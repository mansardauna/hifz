import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TablePaginationProps {
  currentPage: number;
  totalPages?: number;
  totalItems?: number;
  totalCount?: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

/**
 * Standardized Unified TablePagination component matching PFMS design system.
 * Features clean summary counters, rows per page selector, and pagination navigation.
 */
export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  totalCount,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className = '',
}) => {
  const items = totalCount ?? totalItems ?? 0;
  const pages = totalPages ?? Math.max(1, Math.ceil(items / (pageSize || 1)));
  const startIndex = items === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, items);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-5 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 font-sans ${className}`}>
      <div className="flex items-center gap-4 flex-wrap">
        <span>
          Showing <span className="font-semibold text-slate-800">{startIndex}</span> to{' '}
          <span className="font-semibold text-slate-800">{endIndex}</span> of{' '}
          <span className="font-semibold text-slate-800">{items}</span> results
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <span className="font-medium text-slate-600">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer text-sm shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer text-slate-700"
          aria-label="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-slate-700">
          Page {currentPage} of {pages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= pages}
          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer text-slate-700"
          aria-label="Next Page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
