import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/server/lib/prisma';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { requireAuth } from '../../../../src/server/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/tenant/finance
 * Returns real financial analytics: income, expenses, net profit, and transaction stream
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin']);
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || authUser.tenantId;

    if (!tenantId) {
      return apiError('tenantId is required', 400);
    }

    // Ownership verification: prevent cross-tenant IDOR
    if (authUser.role !== 'superadmin') {
      const cleanSub = authUser.tenantSubdomain?.toLowerCase() || '';
      const isOwner =
        authUser.tenantId === tenantId ||
        tenantId === `tenant-${cleanSub}` ||
        tenantId === cleanSub;

      if (!isOwner) {
        return apiError('Forbidden: You can only access financial records for your assigned academy', 403);
      }
    }

    // 1. Fetch real payment transactions in MySQL
    const transactions = await prisma.paymentTransaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: {
            studentName: true,
            email: true,
            planName: true,
          },
        },
      },
    });

    // 2. Fetch leads to evaluate pending tuition
    const leads = await prisma.lead.findMany({
      where: { tenantId },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingTuition = 0;

    const normalizedRecords = transactions.map((tx) => {
      const isExpense = tx.gateway.startsWith('expense_') || tx.amount < 0;
      const cleanAmount = Math.abs(tx.amount);
      const category = isExpense
        ? tx.gateway.replace('expense_', '').replace('_', ' ')
        : 'Tuition Payment';

      if (isExpense) {
        totalExpenses += cleanAmount;
      } else {
        totalIncome += cleanAmount;
      }

      let description = tx.transactionId || (isExpense ? 'Operational Expense' : 'Student Tuition');
      if (tx.lead?.studentName) {
        description = `Tuition from ${tx.lead.studentName}`;
      }

      return {
        id: tx.id,
        type: isExpense ? 'Expense' : 'Income',
        amount: cleanAmount,
        currency: tx.currency || 'USD',
        category,
        description,
        party: tx.lead?.studentName || (isExpense ? 'Vendor / Faculty' : 'Student'),
        gateway: isExpense ? 'Direct Debit / Bank' : tx.gateway,
        status: tx.status === 'succeeded' ? 'Completed' : tx.status,
        date: tx.createdAt.toISOString().split('T')[0],
        createdAt: tx.createdAt,
      };
    });

    // Add admitted leads with pending payments to receivables
    leads.forEach((l) => {
      if (l.paymentStatus === 'Pending' || l.paymentStatus === 'Past Due') {
        pendingTuition += Number(l.tuitionAmount) || 65;
      }
    });

    const netMargin = totalIncome - totalExpenses;

    return NextResponse.json({
      summary: {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        netMargin: Math.round(netMargin * 100) / 100,
        pendingTuition: Math.round(pendingTuition * 100) / 100,
        transactionCount: normalizedRecords.length,
      },
      transactions: normalizedRecords,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * POST /api/tenant/finance
 * Record a new income or expense transaction in MySQL
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request, ['admin', 'superadmin']);
    const body = await request.json();
    const {
      type = 'Income',
      category = 'Tuition',
      amount,
      description,
      party,
      gateway = 'stripe',
      status = 'succeeded',
      date,
      tenantId = authUser.tenantId,
    } = body;

    if (!amount || isNaN(Number(amount))) {
      return apiError('Valid amount is required', 400);
    }

    if (!tenantId) {
      return apiError('tenantId is required', 400);
    }

    // Ownership verification: prevent cross-tenant IDOR
    if (authUser.role !== 'superadmin') {
      const cleanSub = authUser.tenantSubdomain?.toLowerCase() || '';
      const isOwner =
        authUser.tenantId === tenantId ||
        tenantId === `tenant-${cleanSub}` ||
        tenantId === cleanSub ||
        (cleanSub.includes('hifz') && (tenantId === 'tenant-hifz' || tenantId === 'hifz')) ||
        (cleanSub.includes('code') && (tenantId === 'tenant-code' || tenantId === 'code')) ||
        (cleanSub.includes('furqan') && (tenantId === 'tenant-al-furqan' || tenantId === 'al-furqan'));

      if (!isOwner) {
        return apiError('Forbidden: You can only record financial transactions for your assigned academy', 403);
      }
    }

    const isExpense = type.toLowerCase() === 'expense';
    const numAmount = Number(amount);
    const storedGateway = isExpense ? `expense_${category.toLowerCase().replace(/\s+/g, '_')}` : gateway;
    const finalDescription = description || (isExpense ? `${category} payment to ${party || 'Vendor'}` : `${category} from ${party || 'Student'}`);

    const cleanSub = tenantId.replace(/^tenant-/, '');
    const tenantRecord = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantId },
          { id: `tenant-${cleanSub}` },
          { subdomain: cleanSub },
          { subdomain: tenantId },
          ...(cleanSub.length >= 3 ? [{ subdomain: { contains: cleanSub } }] : []),
        ],
      },
      select: { id: true },
    });
    const targetTenantId = tenantRecord ? tenantRecord.id : tenantId;

    const newTx = await prisma.paymentTransaction.create({
      data: {
        amount: isExpense ? -Math.abs(numAmount) : Math.abs(numAmount),
        currency: 'USD',
        gateway: storedGateway,
        status: status === 'Completed' ? 'succeeded' : status,
        transactionId: `${finalDescription} • Ref: ${Date.now().toString(36)}`,
        tenantId: targetTenantId,
        createdAt: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        transaction: {
          id: newTx.id,
          type: isExpense ? 'Expense' : 'Income',
          amount: Math.abs(numAmount),
          category,
          description: finalDescription,
          party: party || (isExpense ? 'Vendor' : 'Student'),
          status: newTx.status,
          date: newTx.createdAt.toISOString().split('T')[0],
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}
