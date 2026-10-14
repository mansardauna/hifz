'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, LogIn, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-11/12 max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-rose-600 tracking-normal">Error 401 &bull; Unauthorized</span>
          <h1 className="text-2xl font-semibold text-slate-900">Access Restricted</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You do not possess the necessary permissions to access this administrative portal or protected resource.
            {user && (
              <span className="block mt-2 font-medium text-slate-700">
                Currently signed in as: <span className="text-slate-900">{user.email}</span> ({user.role})
              </span>
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In With Authorized Account</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return To Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
