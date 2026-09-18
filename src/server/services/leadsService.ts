import { prisma } from '../lib/prisma';
import { MOCK_LEADS } from '../../services/mockData';

export class LeadsService {
  static async getLeads(tenantId?: string) {
    if (process.env.DATABASE_URL && tenantId) {
      try {
        return await prisma.lead.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' },
        });
      } catch (error) {
        console.warn('Leads DB lookup warning:', error);
      }
    }

    return tenantId ? MOCK_LEADS.filter((l) => l.tenantId === tenantId) : MOCK_LEADS;
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
      return await prisma.lead.create({
        data: {
          tenantId: data.tenantId,
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
      return await prisma.lead.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
    }

    return { success: true, id, ...updates };
  }
}
