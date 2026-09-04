import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from '../ui';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { TenantSubscriptionPlan } from '../../types';
import { ToastMessage } from '../ui/Toast';
import { getStoredPlatformPlans } from '../../services/platformPlans';
import { CheckCircle2, Sparkles, Loader2, CreditCard } from 'lucide-react';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  onAddToast,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [plans, setPlans] = useState(getStoredPlatformPlans());
  const activePlan: string = tenant.subscriptionPlan || 'free';

  useEffect(() => {
    if (isOpen) {
      setPlans(getStoredPlatformPlans());
    }
  }, [isOpen]);

  const handleUpgrade = async (planId: string, planName: string, studentCapacity: number) => {
    setIsProcessing(planId);

    // Simulate payment gateway redirect & tokenization
    setTimeout(() => {
      updateTenantConfig({
        subscriptionPlan: planId as TenantSubscriptionPlan,
        studentCapacity: studentCapacity,
      });

      setIsProcessing(null);
      onClose();

      const message = `Your institution has successfully switched to the ${planName} plan with active capacity for ${studentCapacity >= 99999 ? 'Unlimited' : studentCapacity} students.`;

      if (onAddToast) {
        onAddToast({
          type: 'success',
          title: 'Plan Upgraded! 🚀',
          message,
        });
      } else {
        success('Plan Upgraded! 🚀', message);
      }
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Your Academy Subscription Tier"
      size="xl"
    >
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="primary" className="mb-2">
            Multi-Tenant Scale & Growth
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Scale Your Academy with Powerful Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unlock custom domains, high-capacity live WebRTC classrooms, Sanad certificate generation, and dedicated teacher seats.
          </p>
        </div>

        {/* Dynamic Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {plans.map((p) => {
            const isCurrent = activePlan === p.id;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                  p.isPopular
                    ? 'border-emerald-600 bg-emerald-50/20 shadow-lg ring-1 ring-emerald-500/20'
                    : isCurrent
                    ? 'border-slate-800 bg-slate-50/80'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Popular Tag */}
                {p.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{p.badge || 'Popular'}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">{p.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 min-h-[36px]">{p.description}</p>

                  <div className="my-4 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">${p.priceMonthly}</span>
                      <span className="text-xs text-slate-500 font-semibold">{p.period}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                      ${p.priceYearly}/yr billed annually
                    </div>
                  </div>

                  {/* Quota Highlights */}
                  <div className="text-[11px] font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Student Limit:</span>
                    <span className="text-emerald-700">
                      {p.studentCapacity >= 99999 ? 'Unlimited' : `${p.studentCapacity} Students`}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 text-xs text-slate-600">
                    {p.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upgrade Button */}
                <div className="mt-6 pt-3 border-t border-slate-100">
                  <Button
                    variant={p.isPopular ? 'primary' : isCurrent ? 'secondary' : 'outline'}
                    size="sm"
                    className="w-full font-bold text-xs"
                    disabled={isCurrent || isProcessing === p.id}
                    onClick={() => handleUpgrade(p.id, p.name, p.studentCapacity)}
                  >
                    {isProcessing === p.id ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Upgrading...</span>
                      </span>
                    ) : isCurrent ? (
                      'Active Plan'
                    ) : p.priceMonthly === 0 ? (
                      'Downgrade to Free'
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Money Back Guarantee */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                14-Day Money-Back Guarantee & Cancel Anytime
              </h4>
              <p className="text-[11px] text-slate-500">
                Secure checkout via Stripe / Moyasar with instant plan activation.
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-700 font-bold">Encrypted 256-bit SSL</span>
        </div>
      </div>
    </Modal>
  );
};
