import React from 'react';
import { MOCK_ANALYTICS } from '../../services/mockData';
import { useTenant } from '../../context/TenantContext';
import { Card, Badge } from '../ui';
import { Users, BookCheck, Mic, Award, TrendingUp, BarChart3, PieChart, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
  const { tenant, language, direction } = useTenant();
  const isAr = language === 'ar';

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Student Inquiries</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1">{MOCK_ANALYTICS.totalLeads}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.4% this month
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Enrolled Students</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1">{MOCK_ANALYTICS.enrolledStudents}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> 71.7% Conversion Rate
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <BookCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Graded Submissions</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1">{MOCK_ANALYTICS.recitationSubmissions}</h3>
            <span className="inline-flex items-center text-xs font-semibold text-blue-600 mt-1">
              +42 submissions this week
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <Mic className="w-5 h-5" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Course Completion Rate</p>
            <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1">{MOCK_ANALYTICS.completionRatePercent}%</h3>
            <span className="inline-flex items-center text-xs font-semibold text-purple-600 mt-1">
              Active progress tracks
            </span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Monthly Enrollment & Lead Growth
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Inquiry leads vs confirmed enrollments</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS.monthlyEnrollment}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="leads" stroke="#0f172a" fillOpacity={1} fill="url(#colorLeads)" name="Total Inquiries" />
                <Area type="monotone" dataKey="enrolled" stroke="#059669" fillOpacity={1} fill="url(#colorEnrolled)" name="Enrolled Students" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Progress Distribution Bar Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Student Milestone Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Active students across curriculum progress stages</p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
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
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="students" fill="#0f172a" radius={[4, 4, 0, 0]} name="Students Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
