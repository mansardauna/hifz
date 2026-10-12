import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../src/server/lib/prisma';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { getAuthenticatedUser } from '../../../../src/server/lib/serverAuth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/tenant/members
 * Fetch all staff and students belonging to the tenant from MySQL
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(request);
    const { searchParams } = new URL(request.url);
    const rawTenant = searchParams.get('tenantId') || authUser?.tenantId;

    if (!rawTenant) {
      return apiError('tenantId is required', 400);
    }

    const cleanSubdomain = rawTenant.replace('tenant-', '');
    const tenantRecord = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: rawTenant },
          { id: `tenant-${cleanSubdomain}` },
          { subdomain: cleanSubdomain },
          { subdomain: rawTenant }
        ]
      }
    });

    const targetTenantId = tenantRecord ? tenantRecord.id : rawTenant;

    // 1. Fetch all users for this tenant from MySQL
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { tenantId: targetTenantId },
          ...(cleanSubdomain ? [{ tenant: { subdomain: cleanSubdomain } }] : [])
        ]
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 2. Fetch all leads/students enrolled in this tenant from MySQL
    const leads = await prisma.lead.findMany({
      where: {
        OR: [
          { tenantId: targetTenantId },
          ...(cleanSubdomain ? [{ tenant: { subdomain: cleanSubdomain } }] : [])
        ]
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse metadata from avatar field if present
    const parsedStaff = users
      .filter((u) => u.role !== 'student')
      .map((u) => {
        let meta: any = {};
        if (u.avatar && u.avatar.startsWith('{')) {
          try {
            meta = JSON.parse(u.avatar);
          } catch (e) {}
        }
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone || '',
          assignedCourses: meta.assignedCourses || [],
          assignedTasks: meta.assignedTasks || [],
          status: meta.status || 'Active',
          rawPassword: meta.initialPassword || null,
          createdAt: u.createdAt,
        };
      });

    const parsedStudents = users
      .filter((u) => u.role === 'student')
      .map((u) => {
        let meta: any = {};
        if (u.avatar && u.avatar.startsWith('{')) {
          try {
            meta = JSON.parse(u.avatar);
          } catch (e) {}
        }
        const matchingLead = leads.find((l) => l.email.toLowerCase() === u.email.toLowerCase());
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: 'student',
          phone: u.phone || matchingLead?.phone || '',
          enrolledCourse: meta.enrolledCourse || matchingLead?.courseInterest || 'Curriculum Course',
          planName: meta.planName || matchingLead?.planName || 'Standard Plan',
          paymentStatus: matchingLead?.paymentStatus || 'Paid',
          status: matchingLead?.status || 'Admitted',
          rawPassword: meta.initialPassword || null,
          createdAt: u.createdAt,
        };
      });

    return NextResponse.json({
      staff: parsedStaff,
      students: parsedStudents,
      totalStaff: parsedStaff.length,
      totalStudents: parsedStudents.length,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * POST /api/tenant/members
 * Create a new staff member or student in MySQL
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(request);
    const body = await request.json();
    const {
      name,
      email,
      password,
      role = 'teacher',
      phone,
      tenantId = authUser?.tenantId,
      assignedCourses = [],
      assignedTasks = [],
      enrolledCourse,
      planName = 'Foundational',
      tuitionAmount = 65,
    } = body;

    if (!name || !email) {
      return apiError('Name and email are required', 400);
    }

    if (!tenantId) {
      return apiError('tenantId is required', 400);
    }

    const cleanSubdomain = tenantId.replace('tenant-', '');
    const tenantRecord = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: tenantId },
          { id: `tenant-${cleanSubdomain}` },
          { subdomain: cleanSubdomain },
          { subdomain: tenantId }
        ]
      }
    });

    const targetTenantId = tenantRecord ? tenantRecord.id : tenantId;

    // Check if user already exists
    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return apiError(`An account with email "${cleanEmail}" already exists.`, 409);
    }

    const rawPassword = password && password.trim() ? password.trim() : `Ankabit${Math.floor(1000 + Math.random() * 9000)}!`;
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const metadata = {
      assignedCourses,
      assignedTasks,
      enrolledCourse: enrolledCourse || assignedCourses[0] || '',
      planName,
      status: 'Active',
      initialPassword: rawPassword, // Stored safely for admin credentials issuance
    };

    // 1. Create User in MySQL
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role.toLowerCase(),
        phone: phone ? phone.trim() : null,
        avatar: JSON.stringify(metadata),
        tenantId: targetTenantId,
      },
    });

    // 2. If student, also register as an admitted Lead in CRM
    if (role.toLowerCase() === 'student') {
      try {
        await prisma.lead.create({
          data: {
            studentName: name.trim(),
            email: cleanEmail,
            phone: phone ? phone.trim() : '',
            courseInterest: enrolledCourse || (assignedCourses[0] as string) || 'Curriculum',
            status: 'Admitted',
            paymentStatus: 'Paid',
            tuitionAmount: Number(tuitionAmount) || 65,
            planName,
            tenantId: targetTenantId,
          },
        });
      } catch (err) {
        console.warn('Lead synchronization warning:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          rawPassword,
          assignedCourses,
          assignedTasks,
          enrolledCourse: metadata.enrolledCourse,
          planName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/tenant/members
 * Update an existing member's role, classes, or tasks in MySQL
 */
export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(request);
    const body = await request.json();
    const { id, name, role, phone, assignedCourses, assignedTasks, newPassword } = body;

    if (!id) {
      return apiError('User ID is required', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return apiError('User not found', 404);
    }

    let meta: any = {};
    if (user.avatar && user.avatar.startsWith('{')) {
      try {
        meta = JSON.parse(user.avatar);
      } catch (e) {}
    }

    if (assignedCourses) meta.assignedCourses = assignedCourses;
    if (assignedTasks) meta.assignedTasks = assignedTasks;

    const dataToUpdate: any = {
      avatar: JSON.stringify(meta),
      updatedAt: new Date(),
    };

    if (name) dataToUpdate.name = name.trim();
    if (role) dataToUpdate.role = role.toLowerCase();
    if (phone !== undefined) dataToUpdate.phone = phone;

    if (newPassword && newPassword.trim()) {
      dataToUpdate.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
      meta.initialPassword = newPassword.trim();
      dataToUpdate.avatar = JSON.stringify(meta);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/tenant/members
 * Delete member from MySQL
 */
export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthenticatedUser(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return apiError('User ID is required', 400);
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Member removed successfully' });
  } catch (error: any) {
    return handleApiError(error);
  }
}
