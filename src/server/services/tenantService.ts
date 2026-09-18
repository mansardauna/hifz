import { prisma } from '../lib/prisma';
import { MOCK_TENANTS } from '../../services/mockData';

export class TenantService {
  static async getBySubdomainOrDomain(subdomain?: string, customDomain?: string) {
    const effectiveSubdomain = subdomain || 'al-furqan';

    if (process.env.DATABASE_URL) {
      try {
        const tenant = await prisma.tenant.findFirst({
          where: customDomain ? { customDomain } : { subdomain: effectiveSubdomain },
        });

        if (tenant) {
          return {
            ...tenant,
            pricingPlans: tenant.pricingPlans || [],
            paymentGateways: tenant.paymentGateways || [],
            settings: tenant.settings || {},
          };
        }
      } catch (error) {
        console.warn('Database tenant lookup warning:', error);
      }
    }

    // Fallback to rich mock templates
    let resolvedKey = effectiveSubdomain;
    if (resolvedKey === 'hifz') resolvedKey = 'hifz-academy';
    if (resolvedKey === 'code') resolvedKey = 'code-academy';
    return (
      MOCK_TENANTS[resolvedKey] ||
      MOCK_TENANTS['hifz-academy'] ||
      MOCK_TENANTS['al-furqan']
    );
  }

  static async createTenant(data: {
    name: string;
    subdomain: string;
    niche?: string;
    brandColor?: string;
    customDomain?: string;
    pricingPlans?: any[];
    paymentGateways?: any[];
    settings?: any;
  }) {
    const { name, subdomain, niche = 'quran_tajweed', brandColor = '#0f766e', customDomain } = data;

    if (!name || !subdomain) {
      throw new Error('Name and subdomain are required');
    }

    if (process.env.DATABASE_URL) {
      const existing = await prisma.tenant.findUnique({ where: { subdomain } });
      if (existing) {
        throw new Error('Subdomain is already taken');
      }

      return await prisma.tenant.create({
        data: {
          name,
          subdomain,
          niche,
          brandColor,
          customDomain: customDomain || null,
          pricingPlans: data.pricingPlans || [],
          paymentGateways: data.paymentGateways || [],
          settings: data.settings || {},
        },
      });
    }

    return {
      id: `tenant-${Date.now()}`,
      name,
      subdomain,
      niche,
      brandColor,
      createdAt: new Date().toISOString(),
    };
  }

  static async updateTenant(idOrSubdomain: string, updates: Record<string, any>) {
    if (process.env.DATABASE_URL) {
      const isId = idOrSubdomain.startsWith('tenant-') || idOrSubdomain.length > 20;
      return await prisma.tenant.update({
        where: isId ? { id: idOrSubdomain } : { subdomain: idOrSubdomain },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });
    }

    return { success: true, ...updates, id: idOrSubdomain };
  }
}
