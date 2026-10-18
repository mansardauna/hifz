import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export interface TableSortHeaderProps<K extends string = string> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  sortKey?: K;
  field?: K;
  currentSort?: { field?: string; key?: string; dir?: 'asc' | 'desc'; direction?: 'asc' | 'desc' | null } | null;
  currentSortField?: string;
  currentSortDir?: 'asc' | 'desc' | null;
  onSort: (key: K) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Standardized Unified TableSortHeader matching PFMS design system.
 * Features clean uppercase headers, arrow indicators, and hover transitions.
 */
export function TableSortHeader<K extends string = string>({
  label,
  children,
  sortKey,
  field,
  currentSort,
  currentSortField,
  currentSortDir,
  onSort,
  className = '',
  align = 'left',
}: TableSortHeaderProps<K>) {
  const content = children ?? label;
  const targetKey = (sortKey ?? field ?? '') as K;
  const activeKey = currentSortField ?? currentSort?.field ?? currentSort?.key;
  const activeDir = currentSortDir ?? currentSort?.dir ?? currentSort?.direction;
  const isSorted = activeKey === targetKey;

  return (
    <th
      className={`px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors select-none text-[10px] text-slate-500 capitalize tracking-wider font-semibold ${className}`}
      onClick={() => onSort(targetKey)}
    >
      <div
        className={`flex items-center gap-1.5 ${
          align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        <span>{content}</span>
        <div className="flex flex-col text-slate-400">
          {!isSorted || !activeDir ? (
            <ArrowUpDown size={12} className="opacity-50" />
          ) : activeDir === 'asc' ? (
            <ArrowUp size={12} className="text-emerald-600 stroke-[2.5]" />
          ) : (
            <ArrowDown size={12} className="text-emerald-600 stroke-[2.5]" />
          )}
        </div>
      </div>
    </th>
  );
}
