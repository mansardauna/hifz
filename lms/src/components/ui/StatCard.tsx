import React from 'react';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  /** Title label for the KPI card (e.g. "Gross Income", "Total Students") */
  title: string;
  /** Main displayed metric value (e.g. "$48,500.00", "280 Students") */
  value: string | number;
  /** Secondary comparison or description label */
  subtext?: string;
  /** Synonym for subtext */
  trend?: string;
  /** Lucide icon component to render */
  icon?: LucideIcon;
  /** Accent color variant */
  color?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'rose' | 'blue' | 'slate' | 'teal';
  /** Optional badge or chip component placed next to the metric value */
  badge?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
  /** Custom additional CSS classes */
  className?: string;
}

const COLOR_MAPS = {
  emerald: {
    iconText: 'text-emerald-600',
    valueText: 'text-slate-900',
    subtext: 'text-emerald-600',
  },
  teal: {
    iconText: 'text-teal-600',
    valueText: 'text-slate-900',
    subtext: 'text-teal-600',
  },
  indigo: {
    iconText: 'text-indigo-600',
    valueText: 'text-slate-900',
    subtext: 'text-indigo-600',
  },
  amber: {
    iconText: 'text-amber-500',
    valueText: 'text-slate-900',
    subtext: 'text-amber-600',
  },
  purple: {
    iconText: 'text-purple-600',
    valueText: 'text-slate-900',
    subtext: 'text-purple-600',
  },
  rose: {
    iconText: 'text-rose-600',
    valueText: 'text-slate-900',
    subtext: 'text-rose-600',
  },
  blue: {
    iconText: 'text-blue-600',
    valueText: 'text-slate-900',
    subtext: 'text-blue-600',
  },
  slate: {
    iconText: 'text-slate-600',
    valueText: 'text-slate-900',
    subtext: 'text-slate-500',
  },
};

/**
 * Standardized KPI StatCard component matching PFMS design system.
 * Features Lucide icon size={28} without heavy background square boxes,
 * compact typography, and optional subtext / trend indicator.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon: Icon,
  color = 'emerald',
  badge,
  onClick,
  className = '',
}) => {
  const colorConfig = COLOR_MAPS[color] || COLOR_MAPS.emerald;
  const description = subtext || trend;

  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''
      } ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`text-2xl sm:text-3xl font-semibold tracking-tight ${colorConfig.valueText}`}>
                {value}
              </span>
              {badge}
            </div>
            {description && (
              <p className={`text-xs font-medium truncate ${colorConfig.subtext}`}>
                {description}
              </p>
            )}
          </div>

          {Icon && (
            <div className="shrink-0 p-1">
              <Icon size={28} className={colorConfig.iconText} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
