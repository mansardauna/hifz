import { prisma } from '../lib/prisma';
import { DEFAULT_PLATFORM_PLANS } from '../../services/platformPlans';
import { loadDatabaseConfig } from '../lib/multiDbService';
import { PlatformTenantStats, PlatformSubscriber, SuperAdminUser } from '../../types/superAdmin';

export class SuperAdminService {
  static async getDashboardData() {
    try {
      if (!process.env.DATABASE_URL) {
        return {
          tenantsCount: 0,
          tenants: [],
          subscribers: [],
          staffUsers: [],
          totalRevenue: 0,
          plans: DEFAULT_PLATFORM_PLANS,
          counts: { totalStudents: 0, totalTeachers: 0, totalAdmins: 0, totalCourses: 0, totalLeads: 0, totalRevenue: 0 },
          monthlyRevenueData: [],
          activeDbEngine: 'mysql',
        };
      }

      // 1. Fetch real tenants with their users, transactions, and relational counts
      const dbTenants = await prisma.tenant.findMany({
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
            },
          },
          transactions: {
            select: {
              id: true,
              amount: true,
              status: true,
              currency: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              users: true,
              courses: true,
              leads: true,
              transactions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // 2. Fetch real transactions with relationships
      const dbTransactions = await prisma.paymentTransaction.findMany({
        include: {
          tenant: { select: { id: true, name: true, subdomain: true } },
          lead: { select: { id: true, studentName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      // 3. Aggregate real global counts directly from DB
      const [totalStudents, totalTeachers, totalAdmins, totalCourses, totalLeads, dbSuperAdmins] = await Promise.all([
        prisma.user.count({ where: { role: 'student' } }),
        prisma.user.count({ where: { role: 'teacher' } }),
        prisma.user.count({ where: { role: 'admin' } }),
        prisma.course.count(),
        prisma.lead.count(),
        prisma.user.findMany({
          where: { role: 'superadmin' },
          select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        }),
      ]);

      const totalRevenue = dbTransactions
        .filter((tx) => tx.status === 'succeeded')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

      // 4. Transform real tenants to PlatformTenantStats[]
      const mappedTenants: PlatformTenantStats[] = dbTenants.map((t) => {
        const adminUser = t.users.find((u) => u.role === 'admin') || t.users[0];
        const settings = (t.settings as any) || {};
        const studentsCount = t.users.filter((u) => u.role === 'student').length;
        const coursesCount = t._count.courses || 0;
        const tenantRevenue = t.transactions
          .filter((tx) => tx.status === 'succeeded')
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const status: 'active' | 'trial' | 'suspended' =
          settings.status === 'suspended' ? 'suspended' : settings.status === 'trial' ? 'trial' : 'active';

        const planName =
          settings.planName || settings.subscriptionTier || (t.pricingPlans as any)?.[0]?.name || 'Standard Tier';

        return {
          id: t.id,
          name: t.name,
          subdomain: t.subdomain,
          customDomain: t.customDomain || undefined,
          niche: t.niche || 'general',
          planId: settings.planId || 'growth',
          planName,
          status,
          ownerName: adminUser?.name || 'Administrator',
          ownerEmail: adminUser?.email || `admin@${t.subdomain}.edu`,
          studentsCount,
          coursesCount,
          totalRevenue: tenantRevenue,
          currency: t.currency || 'USD',
          createdAt: t.createdAt.toISOString().split('T')[0],
          lastActiveAt: t.updatedAt ? t.updatedAt.toISOString().split('T')[0] : t.createdAt.toISOString().split('T')[0],
        };
      });

      // 5. Transform real transactions to PlatformSubscriber[]
      const mappedSubscribers: PlatformSubscriber[] = dbTransactions.map((tx) => {
        const status: 'active' | 'past_due' | 'canceled' =
          tx.status === 'succeeded' ? 'active' : tx.status === 'failed' ? 'canceled' : 'past_due';
        const gateway: 'stripe' | 'moyasar' | 'bank_transfer' =
          (tx.gateway as any) || 'stripe';

        const periodEnd = new Date(tx.createdAt);
        periodEnd.setDate(periodEnd.getDate() + 30);

        return {
          id: tx.id,
          tenantId: tx.tenantId,
          academyName: tx.tenant?.name || 'Academy',
          subdomain: tx.tenant?.subdomain || 'tenant',
          planId: 'tuition-charge',
          planName: tx.lead?.studentName ? `Tuition: ${tx.lead.studentName}` : 'Academy Tuition',
          amount: tx.amount,
          currency: tx.currency || 'USD',
          billingCycle: 'monthly',
          status,
          paymentGateway: gateway,
          currentPeriodEnd: periodEnd.toISOString().split('T')[0],
          createdAt: tx.createdAt.toISOString().split('T')[0],
        };
      });

      // 6. Transform staff users
      const mappedStaffUsers: SuperAdminUser[] = dbSuperAdmins.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: 'superadmin',
        status: 'active',
        createdAt: u.createdAt.toISOString().split('T')[0],
        lastActiveAt: u.updatedAt.toISOString().split('T')[0],
      }));

      // 7. Calculate real monthly data from actual records
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const monthlyRevenueData = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mName = monthNames[d.getMonth()];
        const y = d.getFullYear();
        const m = d.getMonth();

        const monthRevenue = dbTransactions
          .filter((tx) => {
            const txDate = new Date(tx.createdAt);
            return tx.status === 'succeeded' && txDate.getFullYear() === y && txDate.getMonth() === m;
          })
          .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        const monthStudents = dbTenants.reduce((sum, t) => {
          const matchingUsers = t.users.filter((u) => {
            const uDate = new Date(u.createdAt);
            return u.role === 'student' && uDate <= new Date(y, m + 1, 0);
          });
          return sum + matchingUsers.length;
        }, 0);

        monthlyRevenueData.push({
          month: mName,
          mrr: monthRevenue,
          students: monthStudents,
        });
      }

      // 8. Detect active database engine
      let activeDbEngine = 'mysql';
      try {
        const dbConf = await loadDatabaseConfig();
        activeDbEngine = dbConf.engine || 'mysql';
      } catch (_e) {}

      return {
        tenantsCount: mappedTenants.length,
        tenants: mappedTenants,
        subscribers: mappedSubscribers,
        staffUsers: mappedStaffUsers,
        totalRevenue,
        plans: DEFAULT_PLATFORM_PLANS,
        counts: {
          totalStudents,
          totalTeachers,
          totalAdmins,
          totalCourses,
          totalLeads,
          totalRevenue,
        },
        monthlyRevenueData,
        activeDbEngine,
      };
    } catch (error: any) {
      console.warn('Super Admin DB query warning:', error?.message);
      return {
        tenantsCount: 0,
        tenants: [],
        subscribers: [],
        staffUsers: [],
        totalRevenue: 0,
        plans: DEFAULT_PLATFORM_PLANS,
        counts: { totalStudents: 0, totalTeachers: 0, totalAdmins: 0, totalCourses: 0, totalLeads: 0, totalRevenue: 0 },
        monthlyRevenueData: [],
        activeDbEngine: 'mysql',
      };
    }
  }

  static async updateTenantStatus(tenantId: string, status?: string, planId?: string, planSlug?: string) {
    if (process.env.DATABASE_URL && tenantId) {
      const isId = tenantId.startsWith('tenant-') || tenantId.length > 20;
      const existing = await prisma.tenant.findUnique({
        where: isId ? { id: tenantId } : { subdomain: tenantId },
      });
      const currentSettings = (existing?.settings as any) || {};
      const resolvedSlug = planSlug || (planId?.replace('plan-', '') || 'growth');

      const updated = await prisma.tenant.update({
        where: isId ? { id: tenantId } : { subdomain: tenantId },
        data: {
          settings: {
            ...currentSettings,
            status: status || currentSettings.status || 'active',
            planId: planId || currentSettings.planId || 'growth',
            subscriptionPlan: resolvedSlug,
            updatedAt: new Date().toISOString(),
          },
        },
      });

      // Clear tenant cache so changes reflect instantly
      try {
        const { cacheService } = await import('../../services/cacheService');
        await cacheService.invalidateTenant(existing?.subdomain || tenantId);
      } catch (e) {}

      return updated;
    }

    return { id: tenantId, status, planId };
  }
}
