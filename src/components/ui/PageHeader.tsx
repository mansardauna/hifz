import React from 'react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Subtitle or explanatory text */
  subtitle?: string;
  /** Synonym for subtitle */
  description?: string;
  /** Optional badge or chip displayed next to the title */
  badge?: React.ReactNode | { text: string; variant?: any };
  /** Action buttons or controls aligned to the right */
  actions?: React.ReactNode;
  /** Synonym for actions */
  action?: React.ReactNode;
  /** Additional custom class names */
  className?: string;
  /** Additional children rendered beneath title/actions */
  children?: React.ReactNode;
}

/**
 * Standardized responsive PageHeader component matching PFMS design system.
 * Ensures consistent typography, spacing, and action button alignment across all views.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  badge,
  actions,
  action,
  className = '',
  children,
}) => {
  const renderedSubtitle = subtitle || description;
  const renderedBadge = badge && typeof badge === 'object' && 'text' in badge ? (
    <Badge variant={(badge as any).variant === 'neutral' ? 'default' : (badge as any).variant || 'default'}>
      {(badge as any).text}
    </Badge>
  ) : (
    (badge as React.ReactNode)
  );

  const renderedActions = actions || action;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            {renderedBadge}
          </div>
          {renderedSubtitle && (
            <p className="text-sm text-slate-500 mt-1">{renderedSubtitle}</p>
          )}
        </div>
        {renderedActions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {renderedActions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
