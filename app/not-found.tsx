import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-11/12 max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-600 tracking-normal">Error 404</span>
          <h1 className="text-2xl font-semibold text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page, academy, or resource you are looking for could not be located. It may have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return To Home</span>
          </Link>

          <Link
            href="/create-academy"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Academy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
