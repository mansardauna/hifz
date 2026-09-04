import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary,#047857)]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs font-semibold gap-2 min-h-[36px]',
    md: 'px-4 py-2.5 text-xs sm:text-sm font-semibold gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-sm sm:text-base font-bold gap-2.5 min-h-[46px]',
  };

  const variantStyles = {
    primary:
      'bg-[var(--color-primary,#047857)] hover:opacity-90 active:opacity-95 text-white shadow-xs border border-transparent',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-2xs',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-rose-600',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
