import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'tab';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isActive?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Standard Unified Button Component matching PFMS design system.
 * Enforces uniform radius (rounded-xl), active click feedback (active:scale-[0.98]),
 * crisp font-bold typography, and consistent sizing across all portal views.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isActive = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const isTab = variant === 'tab';

  const baseStyles = isTab
    ? 'inline-flex items-center justify-center font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap select-none rounded-t-lg outline-none focus:outline-none'
    : 'inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] outline-none focus:outline-none';

  const sizeStyles = isTab
    ? {
        sm: 'py-2.5 px-4 text-xs sm:text-sm font-semibold gap-2.5',
        md: 'py-3.5 px-6 text-sm font-semibold gap-2.5',
        lg: 'py-4 px-8 text-base font-semibold gap-3',
      }
    : {
        sm: 'h-10 px-4 text-xs sm:text-sm font-semibold gap-2.5',
        md: 'h-12 px-6 text-sm font-semibold gap-2.5 shadow-xs',
        lg: 'h-14 px-8 text-base font-semibold gap-3 shadow-sm',
      };

  const variantStyles = {
    primary:
      'bg-[var(--color-primary,#047857)] hover:brightness-95 text-white shadow-sm shadow-[var(--color-primary,#047857)]/20 active:scale-[0.98]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-[0.98]',
    tertiary:
      'bg-transparent hover:bg-slate-100 text-slate-700',
    outline:
      'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20 active:scale-[0.98]',
    tab: isActive
      ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,rgba(4,120,87,0.06))]'
      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0 -ml-1 mr-1" />
      ) : (
        leftIcon && <span className="inline-flex items-center shrink-0">{leftIcon}</span>
      )}
      <span className="inline-flex items-center">{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex items-center shrink-0">{rightIcon}</span>}
    </button>
  );
};
