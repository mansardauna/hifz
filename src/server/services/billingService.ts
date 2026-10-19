import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

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
  amount?: number;
  origin?: string;
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
      throw new Error('Platform Stripe secret key not configured in environment variables (STRIPE_SECRET_KEY)');
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
      throw new Error(`Invalid subscription tier: "${tierId}". Allowed tiers: ${Object.keys(PLATFORM_TIER_PRICES).join(', ')}`);
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
              description: `Ankabit LMS SaaS Platform Tier Subscription for ${academySubdomain}.ankabit.app`,
            },
            unit_amount: targetTier.priceUsd * 100,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'platform_tier_upgrade',
        tierId,
        academySubdomain,
      },
      success_url: `${origin}/${academySubdomain}/admin?upgrade=success&tier=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${academySubdomain}/admin?upgrade=cancelled`,
    });

    return { sessionId: session.id, url: session.url };
  }

  /**
   * Generates a checkout session for a student enrolling or paying tuition.
   * Resolves tuition price from the database record or pricing plan.
   */
  static async createStudentTuitionCheckout(params: CreateTuitionCheckoutParams) {
    const stripe = this.getStripeClient();
    const { tenantId, leadId, planId, studentEmail, studentName = 'Student', description, origin = 'http://localhost:3000' } = params;

    if (!tenantId) {
      throw new Error('tenantId is required for student tuition payment');
    }
    if (!studentEmail) {
      throw new Error('studentEmail is required for student tuition payment');
    }

    let finalAmount = 65; // Default standard tuition if not found
    let currency = 'usd';
    let academySubdomain = tenantId.replace(/^tenant-/, '');

    // Resolve tenant and price from DB
    if (process.env.DATABASE_URL) {
      const tenant = await prisma.tenant.findFirst({
        where: {
          OR: [{ id: tenantId }, { subdomain: academySubdomain }, { id: `tenant-${academySubdomain}` }],
        },
      });

      if (tenant) {
        academySubdomain = tenant.subdomain;
        if (planId && Array.isArray(tenant.pricingPlans)) {
          const plan = (tenant.pricingPlans as any[]).find((p) => p.id === planId);
          if (plan && plan.priceMonthly) {
            finalAmount = Number(plan.priceMonthly);
            if (plan.currency) currency = plan.currency.toLowerCase();
          }
        }
      }

      if (leadId) {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (lead) {
          if (tenant && lead.tenantId !== tenant.id) {
            throw new Error(`Forbidden: Lead '${leadId}' does not belong to the selected academy '${tenant.id}'.`);
          }
          if (lead.tuitionAmount) {
            finalAmount = Number(lead.tuitionAmount);
          }
        }
      }
    } else if (params.amount && params.amount > 0) {
      finalAmount = params.amount;
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
