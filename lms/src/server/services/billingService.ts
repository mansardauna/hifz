import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/apiResponse';
import { AuthUserPayload } from '../services/authService';

export interface CreatePlatformCheckoutParams {
  tierId: string;
  academySubdomain: string;
  adminEmail: string;
  origin?: string;
}

export interface CreateTuitionCheckoutParams {
  tenantId: string;
  leadId?: string;
  planId?: string;
  studentEmail: string;
  studentName?: string;
  description?: string;
  origin?: string;
  authUser?: AuthUserPayload | null;
}

const PLATFORM_TIER_PRICES: Record<string, { name: string; priceUsd: number }> = {
  solo: { name: 'Madrasah Solo Tier Subscription', priceUsd: 29 },
  qari: { name: 'Qari Tier Subscription', priceUsd: 29 },
  growth: { name: 'Madrasah Growth Tier Subscription', priceUsd: 79 },
  enterprise: { name: 'Madrasah Enterprise Tier Subscription', priceUsd: 199 },
};

export class BillingService {
  private static getStripeClient(): Stripe {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new HttpError('Platform Stripe secret key not configured in environment variables (STRIPE_SECRET_KEY)', 500);
    }
    return new Stripe(apiKey, { apiVersion: '2024-04-10' as any });
  }

  /**
   * Generates a checkout session for an Academy upgrading its SaaS subscription tier.
   * Enforces server-side fixed pricing to prevent client price tampering.
   */
  static async createPlatformTierCheckout(params: CreatePlatformCheckoutParams) {
    const stripe = this.getStripeClient();
    const { tierId, academySubdomain, adminEmail, origin = 'http://localhost:3000' } = params;

    const targetTier = PLATFORM_TIER_PRICES[tierId?.toLowerCase()];
    if (!targetTier) {
      throw new HttpError(`Invalid subscription tier: "${tierId}". Allowed tiers: ${Object.keys(PLATFORM_TIER_PRICES).join(', ')}`, 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: adminEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: targetTier.name,
              description: `Monthly subscription for ${academySubdomain}.ankabit.app`,
            },
            unit_amount: targetTier.priceUsd * 100,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'platform_subscription',
        tierId,
        academySubdomain,
        adminEmail,
      },
      success_url: `${origin}/${academySubdomain}/admin?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${academySubdomain}/admin?upgrade=cancelled`,
    });

    return { sessionId: session.id, url: session.url };
  }

  /**
   * Generates an authoritative checkout session for a student enrolling or paying tuition.
   * Strictly enforces:
   * 1. Tenant must exist.
   * 2. Lead/plan ownership & email matching.
   * 3. 100% server-side derived pricing (client price override strictly prohibited).
   */
  static async createStudentTuitionCheckout(params: CreateTuitionCheckoutParams) {
    const stripe = this.getStripeClient();
    const {
      tenantId,
      leadId,
      planId,
      studentName = 'Student',
      description,
      origin = 'http://localhost:3000',
      authUser,
    } = params;

    if (!tenantId) {
      throw new HttpError('tenantId is required for student tuition payment', 400);
    }

    let studentEmail = params.studentEmail?.trim().toLowerCase();
    if (!studentEmail) {
      throw new HttpError('studentEmail is required for student tuition payment', 400);
    }

    let finalAmount: number | null = null;
    let currency = 'usd';
    let academySubdomain = tenantId.replace(/^tenant-/, '');

    // 1. Validate Tenant existence
    if (process.env.DATABASE_URL) {
      const tenant = await prisma.tenant.findFirst({
        where: {
          OR: [{ id: tenantId }, { subdomain: academySubdomain }, { id: `tenant-${academySubdomain}` }],
        },
      });

      if (!tenant) {
        throw new HttpError(`Academy tenant '${tenantId}' does not exist.`, 404);
      }

      academySubdomain = tenant.subdomain;

      // 2. Caller Scoping & Authorization Validation
      if (authUser) {
        if (authUser.role !== 'superadmin') {
          // If caller is an admin, ensure they belong to this academy
          if (authUser.role === 'admin') {
            if (authUser.tenantId !== tenant.id && authUser.tenantSubdomain !== tenant.subdomain) {
              throw new HttpError('Forbidden: Cannot initiate tuition checkout for another academy.', 403);
            }
          }
          // If caller is a logged-in student, lock email to their account
          if (authUser.role === 'student') {
            if (authUser.tenantId !== tenant.id && authUser.tenantSubdomain !== tenant.subdomain) {
              throw new HttpError('Forbidden: You can only pay tuition for your enrolled academy.', 403);
            }
            studentEmail = authUser.email.toLowerCase();
          }
        }
      }

      // 3. Resolve price server-side from Lead
      if (leadId) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) {
          throw new HttpError(`Lead record '${leadId}' not found.`, 404);
        }
        if (lead.tenantId !== tenant.id) {
          throw new HttpError(`Forbidden: Lead '${leadId}' does not belong to academy '${tenant.id}'.`, 403);
        }
        // Critical: Email verification prevents anonymous takeover of another lead
        if (lead.email.toLowerCase().trim() !== studentEmail) {
          throw new HttpError(`Forbidden: Email '${studentEmail}' does not match the enrolled lead.`, 403);
        }
        if (lead.tuitionAmount && Number(lead.tuitionAmount) > 0) {
          finalAmount = Number(lead.tuitionAmount);
        }
      }

      // 4. Resolve price server-side from Tenant Pricing Plans
      if (finalAmount === null && planId && Array.isArray(tenant.pricingPlans)) {
        const plan = (tenant.pricingPlans as any[]).find((p) => p.id === planId || p.slug === planId);
        if (!plan) {
          throw new HttpError(`Invalid tuition plan '${planId}' for academy '${tenant.name}'.`, 400);
        }
        if (plan.priceMonthly && Number(plan.priceMonthly) > 0) {
          finalAmount = Number(plan.priceMonthly);
        }
        if (plan.currency) {
          currency = plan.currency.toLowerCase();
        }
      }

      // 5. Fallback to active default plan if no lead/plan amount was specified
      if (finalAmount === null && Array.isArray(tenant.pricingPlans) && tenant.pricingPlans.length > 0) {
        const defaultPlan = (tenant.pricingPlans as any[]).find((p) => p.isDefault || p.priceMonthly) || tenant.pricingPlans[0];
        if (defaultPlan?.priceMonthly) {
          finalAmount = Number(defaultPlan.priceMonthly);
          if (defaultPlan.currency) currency = defaultPlan.currency.toLowerCase();
        }
      }

      // If price could still not be derived server-side
      if (finalAmount === null || finalAmount <= 0) {
        throw new HttpError(
          'Unable to determine valid tuition amount from academy records. Please contact academy administration.',
          400
        );
      }
    } else {
      // In-memory / mock fallback without database
      finalAmount = 65;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: studentEmail,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: description || `Academy Tuition — ${studentName}`,
              description: `Enrolled in ${academySubdomain}.ankabit.app`,
            },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'student_tuition',
        tenantId,
        leadId: leadId || '',
        email: studentEmail,
        name: studentName,
        planId: planId || '',
      },
      success_url: `${origin}/${academySubdomain}/lms?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${academySubdomain}?payment=cancelled`,
    });

    return { sessionId: session.id, url: session.url };
  }
}
