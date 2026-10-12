import React from 'react';
import { Search } from 'lucide-react';

export interface TableControlsProps {
  searchTerm?: string;
  searchValue?: string;
  setSearchTerm?: (term: string) => void;
  onSearchChange?: (term: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Standardized Unified TableControls toolbar matching PFMS design system.
 * Features consistent search bar dimensions, padding, rounded-xl inputs, and action alignments.
 */
export const TableControls: React.FC<TableControlsProps> = ({
  searchTerm,
  searchValue,
  setSearchTerm,
  onSearchChange,
  placeholder,
  searchPlaceholder,
  actions,
  children,
  className = '',
}) => {
  const value = searchValue ?? searchTerm ?? '';
  const onChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    if (setSearchTerm) setSearchTerm(val);
  };
  const inputPlaceholder = searchPlaceholder ?? placeholder ?? 'Search records...';

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 border-b border-slate-100 bg-white ${className}`}>
      <div className="relative w-full sm:w-72">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-all bg-white shadow-xs"
        />
      </div>
      {(actions || children) && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
};
