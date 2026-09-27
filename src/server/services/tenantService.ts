import { prisma } from '../lib/prisma';
import { MOCK_TENANTS } from '../../services/mockData';
import { cacheService } from '../../services/cacheService';

export class TenantService {
  static async getBySubdomainOrDomain(subdomain?: string, customDomain?: string) {
    const effectiveSubdomain = subdomain || 'al-furqan';
    const cacheKey = customDomain ? `domain_${customDomain}` : effectiveSubdomain;

    // 1. High-speed cache lookup (Redis / in-memory cache)
    try {
      const cached = await cacheService.getTenant(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (err) {
      console.warn('Cache lookup non-blocking warning:', err);
    }

    let tenantResult: any = null;

    if (process.env.DATABASE_URL) {
      try {
        const tenant = await prisma.tenant.findFirst({
          where: customDomain ? { customDomain } : { subdomain: effectiveSubdomain },
        });

        if (tenant) {
          tenantResult = {
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
    if (!tenantResult) {
      let resolvedKey = effectiveSubdomain;
      if (resolvedKey === 'hifz') resolvedKey = 'hifz-academy';
      if (resolvedKey === 'code') resolvedKey = 'code-academy';
      tenantResult =
        MOCK_TENANTS[resolvedKey] ||
        MOCK_TENANTS['hifz-academy'] ||
        MOCK_TENANTS['al-furqan'];
    }

    // 2. Cache tenant profile for subsequent ultra-fast lookups
    if (tenantResult) {
      try {
        await cacheService.setTenant(cacheKey, tenantResult);
      } catch (err) {
        console.warn('Cache write non-blocking warning:', err);
      }
    }

    return tenantResult;
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
    // Invalidate cache immediately on change
    try {
      await cacheService.invalidateTenant(idOrSubdomain);
    } catch (err) {
      console.warn('Cache invalidation warning:', err);
    }

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
