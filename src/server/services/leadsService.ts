import { prisma } from '../lib/prisma';
import { MOCK_LEADS } from '../../services/mockData';

export class LeadsService {
  static async getLeads(tenantId?: string) {
    const cleanSubdomain = tenantId?.replace('tenant-', '');

    if (process.env.DATABASE_URL && tenantId) {
      try {
        const leads = await prisma.lead.findMany({
          where: {
            OR: [
              { tenantId },
              { tenant: { subdomain: cleanSubdomain } },
              { tenant: { id: tenantId } },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        return leads || [];
      } catch (error) {
        console.warn('Leads DB lookup warning:', error);
        return [];
      }
    }

    return [];
  }

  static async createLead(data: {
    tenantId: string;
    studentName?: string;
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    courseInterest?: string;
    priorHifzLevel?: string;
    status?: string;
    paymentStatus?: string;
    tuitionAmount?: number;
    planName?: string;
    notes?: string;
  }) {
    const leadName = data.studentName || data.name || 'Anonymous Student';

    if (process.env.DATABASE_URL && data.tenantId) {
      try {
        const cleanSub = data.tenantId.replace(/^tenant-/, '');
        const tenant = await prisma.tenant.findFirst({
          where: {
            OR: [
              { id: data.tenantId },
              { id: `tenant-${cleanSub}` },
              { subdomain: cleanSub },
              { subdomain: data.tenantId }
            ]
          }
        });

        const targetTenantId = tenant ? tenant.id : data.tenantId;

        return await prisma.lead.create({
          data: {
            tenantId: targetTenantId,
            studentName: leadName,
            email: data.email || '',
            phone: data.phone || '',
            country: data.country || 'Global',
            courseInterest: data.courseInterest || 'General Study',
            priorHifzLevel: data.priorHifzLevel || 'Beginner',
            status: data.status || 'New',
            paymentStatus: data.paymentStatus || 'Pending',
            tuitionAmount: data.tuitionAmount ? Number(data.tuitionAmount) : null,
            planName: data.planName || 'Standard Track',
            notes: data.notes || 'Submitted via online form',
          },
        });
      } catch (err) {
        console.warn('Database lead create exception:', err);
        throw err;
      }
    }

    const mockLead = {
      id: `lead-${Date.now()}`,
      tenantId: data.tenantId || 'tenant-al-furqan',
      studentName: leadName,
      name: leadName,
      email: data.email || '',
      phone: data.phone || '',
      country: data.country || 'Global',
      courseInterest: data.courseInterest || 'General Study',
      priorHifzLevel: data.priorHifzLevel || 'Beginner',
      status: data.status || 'New',
      paymentStatus: data.paymentStatus || 'Pending',
      tuitionAmount: data.tuitionAmount || 65,
      planName: data.planName || 'Standard Track',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_LEADS.unshift(mockLead as any);
    return mockLead;
  }

  static async updateLead(id: string, updates: Record<string, any>) {
    if (process.env.DATABASE_URL && id) {
      try {
        return await prisma.lead.update({
          where: { id },
          data: {
            ...updates,
            updatedAt: new Date(),
          },
        });
      } catch (err) {
        console.warn('Database lead update warning:', err);
      }
    }

    return { success: true, id, ...updates };
  }
}
