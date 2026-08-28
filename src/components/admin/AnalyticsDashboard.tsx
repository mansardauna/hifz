import React from 'react';
import { MOCK_ANALYTICS } from '../../services/mockData';
import { useTenant } from '../../context/TenantContext';
import { Users, BookCheck, Mic, Award, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { SanadScrollVector, QuranRahlVector, CrescentVector } from '../ui/IslamicArtDecoration';

export const AnalyticsDashboard: React.FC = () => {
  const { tenant, language, direction } = useTenant();
  const isAr = language === 'ar';

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Banner Card with 2D Vector Illustration */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest font-display">
            <CrescentVector className="w-4 h-4 text-amber-400" />
            <span>Real-time Madrasah Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            {tenant.name} Growth Overview
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
            Live insights on student leads, enrollment velocity, verse audio homework recordings, and Sanad certificate achievements.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <QuranRahlVector className="w-16 h-16 text-amber-400/90" />
          <SanadScrollVector className="w-16 h-16 text-emerald-400/90" />
        </div>
      </div>

      {/* Metric Cards Grid with Clean, High-Contrast Typography & Generous Padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 sm:p-7 rounded-md border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
              {isAr ? 'إجمالي الطلبات' : 'Total Inquiries / Leads'}
            </p>
            <h3 className="text-3xl font-extrabold font-mono text-slate-900 mt-1.5">{MOCK_ANALYTICS.totalLeads}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5 me-1" /> +18.4% this month
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-md border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
              {isAr ? 'الطلاب المقبولون' : 'Active Students'}
            </p>
            <h3 className="text-3xl font-extrabold font-mono text-slate-900 mt-1.5">{MOCK_ANALYTICS.enrolledStudents}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5 me-1" /> 71.7% Conversion Rate
            </span>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
            <BookCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-md border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
              {isAr ? 'التلاوات الصوتية' : 'Recitations Graded'}
            </p>
            <h3 className="text-3xl font-extrabold font-mono text-slate-900 mt-1.5">{MOCK_ANALYTICS.recitationSubmissions}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-sky-700 mt-1.5">
              +42 submissions this week
            </span>
          </div>
          <div className="p-3.5 bg-sky-50 text-sky-700 rounded-md border border-sky-100">
            <Mic className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-7 rounded-md border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
              {isAr ? 'معدل الإنجاز' : 'Completion Rate'}
            </p>
            <h3 className="text-3xl font-extrabold font-mono text-slate-900 mt-1.5">{MOCK_ANALYTICS.completionRatePercent}%</h3>
            <span className="inline-flex items-center text-xs font-semibold text-purple-700 mt-1.5">
              Active memorizers
            </span>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                {isAr ? 'نمو التسجيل والقبول الشهري' : 'Monthly Enrollment & Lead Growth'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Comparing inquiry leads vs enrolled students</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS.monthlyEnrollment}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="leads" stroke="#047857" fillOpacity={1} fill="url(#colorLeads)" name="Total Inquiries" />
                <Area type="monotone" dataKey="enrolled" stroke="#d97706" fillOpacity={1} fill="url(#colorEnrolled)" name="Enrolled Students" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Juz Memorization Distribution Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                {isAr ? 'توزيع الطلاب حسب الأجزاء المحفوظة' : 'Student Juz Progress Distribution'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Active students across 30 Juz memorization milestones</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS.juzDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="students" fill="#047857" radius={[4, 4, 0, 0]} name="Students Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
