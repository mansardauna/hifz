import { prisma } from '../lib/prisma';
import { MOCK_TENANTS } from '../../services/mockData';
import { cacheService } from '../../services/cacheService';
import { isDemoTenant } from '../../lib/tenants';

export class TenantService {
  static async getBySubdomainOrDomain(subdomain?: string, customDomain?: string) {
    const effectiveSubdomain = subdomain || '';
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
          where: customDomain ? { customDomain } : {
            OR: [
              { subdomain: effectiveSubdomain },
              { id: effectiveSubdomain },
              { id: `tenant-${effectiveSubdomain}` }
            ]
          },
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

    // Fallback to rich mock templates ONLY for explicit demo sandbox; for all live accounts return clean tenant config
    if (!tenantResult) {
      const isDemo = isDemoTenant(effectiveSubdomain);

      if (isDemo) {
        tenantResult =
          MOCK_TENANTS[effectiveSubdomain] ||
          MOCK_TENANTS['demo'] ||
          MOCK_TENANTS['hifz-academy'] ||
          MOCK_TENANTS['sample-demo'];
      } else {
        const isCoding = effectiveSubdomain.includes('code');
        const isSchool = effectiveSubdomain.includes('school') || effectiveSubdomain.includes('horizon');
        const name = effectiveSubdomain
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
        tenantResult = {
          id: `tenant-${effectiveSubdomain}`,
          name,
          nameAr: effectiveSubdomain,
          tagline: 'Autonomous Educational Institution',
          taglineAr: 'منصة تعليمية ذكية',
          subdomain: effectiveSubdomain,
          customDomain: customDomain || `${effectiveSubdomain}.ankabit.app`,
          niche: isCoding ? 'coding' : isSchool ? 'school' : 'madrasat',
          logoUrl: '',
          faviconUrl: '',
          theme: {
            primaryColor: isCoding ? '#2563eb' : isSchool ? '#7c3aed' : '#059669',
            primaryHover: isCoding ? '#1d4ed8' : isSchool ? '#6d28d9' : '#047857',
            secondaryColor: '#0f172a',
            accentColor: '#10b981',
            backgroundColor: '#ffffff',
            surfaceColor: '#f8fafc',
            textColor: '#0f172a',
            borderRadius: 'rounded-xl',
            fontFamily: 'Inter',
          },
          heroBadgeText: 'Admissions Open',
          heroBadgeTextAr: 'التسجيل متاح',
          aboutText: `Welcome to ${name}.`,
          aboutTextAr: `مرحباً بكم في ${name}.`,
          admissionsOpen: true,
          pageBlocks: [],
          pricingPlans: [],
          paymentGateways: [],
          forms: [],
          customFormFields: [],
          subscriptionPlan: 'free',
          contactEmail: `admin@${effectiveSubdomain}.ankabit.app`,
          contactPhone: '',
          defaultDirection: 'ltr',
        };
      }
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

    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.customHtml && typeof sanitizedUpdates.customHtml === 'string') {
      sanitizedUpdates.customHtml = sanitizedUpdates.customHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi, '')
        .replace(/\s+on[a-zA-Z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');
    }

    if (process.env.DATABASE_URL) {
      const isId = idOrSubdomain.startsWith('tenant-') || idOrSubdomain.length > 20;
      return await prisma.tenant.update({
        where: isId ? { id: idOrSubdomain } : { subdomain: idOrSubdomain },
        data: {
          ...sanitizedUpdates,
          updatedAt: new Date(),
        },
      });
    }

    return { success: true, ...sanitizedUpdates, id: idOrSubdomain };
  }
}
