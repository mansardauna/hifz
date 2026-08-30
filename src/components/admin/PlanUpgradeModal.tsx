import React from 'react';
import { Modal, Button, Badge } from '../ui';
import { useTenant } from '../../context/TenantContext';
import { TenantSubscriptionPlan } from '../../types';
import { ToastMessage } from '../ui/Toast';
import { CheckCircle2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  onAddToast,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const activePlan: TenantSubscriptionPlan = tenant.subscriptionPlan || 'free';

  const plans: {
    id: TenantSubscriptionPlan;
    name: string;
    price: string;
    period: string;
    description: string;
    studentCapacity: number;
    badge: string;
    isPopular?: boolean;
    features: string[];
  }[] = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for trial institutions and getting started.',
      studentCapacity: 15,
      badge: 'Free Tier',
      features: [
        'Up to 15 Active Students',
        '1 Teacher Seat',
        'Subdomain (*.hifz.app)',
        'Basic Page & Form Builder',
        'Basic Overview KPI Numbers',
      ],
    },
    {
      id: 'qari',
      name: 'Independent Qari',
      price: '$29',
      period: '/ month',
      description: 'For private Quran instructors and independent tutors.',
      studentCapacity: 50,
      badge: 'Qari Solo',
      features: [
        'Up to 50 Active Students',
        '1 Teacher Seat',
        'Subdomain (*.hifz.app)',
        'Audio Homework Looper & Recorder',
        'Stripe Connect Payouts',
        'Standard Admissions CRM',
      ],
    },
    {
      id: 'growth',
      name: 'Madrasah Growth',
      price: '$79',
      period: '/ month',
      description: 'For established academies needing custom domains and deep analytics.',
      studentCapacity: 350,
      badge: 'Most Popular',
      isPopular: true,
      features: [
        'Up to 350 Active Students',
        '10 Teacher Seats',
        'Custom Domain (e.g. academy.com)',
        'Full Interactive Analytics & Growth Charts',
        'Live WebRTC Classroom & Whiteboard',
        'Moyasar (Mada & Apple Pay) + Stripe',
        'GrapesJS Multi-Page Templates',
      ],
    },
    {
      id: 'enterprise',
      name: 'Global Enterprise',
      price: '$199',
      period: '/ month',
      description: 'For multi-branch networks with unlimited student capacity.',
      studentCapacity: 99999,
      badge: 'Enterprise VIP',
      features: [
        'Unlimited Active Students',
        'Unlimited Teacher & Staff Seats',
        'Multi-Branch Campuses & Sub-Accounts',
        'Custom Sanad Ijazah Certificate Builder',
        'Dedicated SFU Live Video Bandwidth',
        'Priority SLA Support & Custom SLA',
      ],
    },
  ];

  const handleSelectPlan = (planId: TenantSubscriptionPlan) => {
    const selectedPlan = plans.find((p) => p.id === planId);
    updateTenantConfig({
      subscriptionPlan: planId,
      studentCapacity: selectedPlan?.studentCapacity || 15,
    });
    onClose();
    onAddToast({
      type: 'success',
      title: 'Plan Tier Updated',
      message: `Your academy is now active on the ${selectedPlan?.name} plan!`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Academy Subscription & Feature Plans"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        <p className="text-xs text-slate-500">
          Choose the plan that matches your madrasah's student capacity and required features. Upgrade or downgrade anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrent = activePlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all relative ${
                  isCurrent
                    ? 'border-slate-900 bg-slate-50/70 ring-2 ring-slate-900 shadow-md'
                    : plan.isPopular
                    ? 'border-emerald-600 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={isCurrent ? 'default' : plan.isPopular ? 'success' : 'default'}>
                      {plan.badge}
                    </Badge>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-slate-900 uppercase">Current</span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{plan.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{plan.description}</p>

                  <div className="my-4 pb-3 border-b border-slate-100">
                    <span className="text-2xl font-bold font-mono text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-500 font-sans ml-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCurrent ? 'text-slate-900' : 'text-emerald-600'}`} />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Button
                    variant={isCurrent ? 'outline' : plan.isPopular ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
