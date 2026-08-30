import React from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../ui';

interface LockedFeatureCardProps {
  title: string;
  description: string;
  requiredPlan?: 'qari' | 'growth' | 'enterprise';
  onUpgrade: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const LockedFeatureCard: React.FC<LockedFeatureCardProps> = ({
  title,
  description,
  requiredPlan = 'growth',
  onUpgrade,
  className = '',
  children,
}) => {
  const planNames = {
    qari: 'Qari Plan ($29/mo)',
    growth: 'Growth Plan ($79/mo)',
    enterprise: 'Enterprise Plan ($199/mo)',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}>
      {/* Background Content (blurred if children provided) */}
      {children && (
        <div className="opacity-25 filter blur-[3px] pointer-events-none select-none p-6">
          {children}
        </div>
      )}

      {/* Locked Overlay / Card Body */}
      <div className={`${children ? 'absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]' : 'p-8'} flex flex-col items-center justify-center text-center p-6 z-10`}>
        <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md mb-3">
          <Lock className="w-5 h-5 text-amber-300" />
        </div>

        <div className="mb-2">
          <Badge variant="warning">
            Requires {requiredPlan === 'enterprise' ? 'Enterprise' : 'Growth'} Plan
          </Badge>
        </div>

        <h4 className="text-sm font-bold text-slate-900 max-w-sm">
          {title}
        </h4>

        <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
          {description}
        </p>

        <Button
          variant="primary"
          size="sm"
          onClick={onUpgrade}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Upgrade to {requiredPlan === 'enterprise' ? 'Enterprise' : 'Growth'}
        </Button>
      </div>
    </div>
  );
};
