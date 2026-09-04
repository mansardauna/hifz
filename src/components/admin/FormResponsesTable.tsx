import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  Eye,
  Trash2,
  Tag,
  Mail,
  Phone,
  Calendar,
  Layers,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Check,
  BarChart3,
  PieChart,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  User,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Badge } from '../ui';
import { FormConfig } from '../../types';

export interface FormResponse {
  id: string;
  formId: string;
  formTitle: string;
  studentName: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: 'New' | 'Under Review' | 'Interview Scheduled' | 'Admitted' | 'Rejected';
  data: Record<string, any>;
  notes?: string;
}

interface FormResponsesTableProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

type SortField = 'studentName' | 'email' | 'submittedAt' | 'status' | string;

export const FormResponsesTable: React.FC<FormResponsesTableProps> = ({ onAddToast }) => {
  const { tenant, language } = useTenant();
  const isAr = language === 'ar';

  const [responses, setResponses] = useState<FormResponse[]>([
    {
      id: 'resp-101',
      formId: 'form-admissions',
      formTitle: 'Direct Admissions & Evaluation Inquiry',
      studentName: 'Zaid Al-Harithi',
      email: 'zaid.harithi@example.com',
      phone: '+966 50 123 4567',
      submittedAt: '2026-09-02 14:30',
      status: 'New',
      data: {
        'Parent / Guardian Name': 'Ibrahim Al-Harithi',
        'Current Juz Memorized': '6 - 15 Juz',
        'Preferred Class Timing': 'Evening (Isha-Night)',
        'Selected Plan': 'Intensive Hifz Program ($140/mo)',
        'Target Goal': 'Complete memorization of Surah Al-Kahf to An-Nas'
      },
      notes: 'Strong Tajweed foundation from local mosque.'
    },
    {
      id: 'resp-102',
      formId: 'form-admissions',
      formTitle: 'Direct Admissions & Evaluation Inquiry',
      studentName: 'Amina Khatun',
      email: 'amina.khatun@example.co.uk',
      phone: '+44 7700 900123',
      submittedAt: '2026-09-01 09:15',
      status: 'Under Review',
      data: {
        'Parent / Guardian Name': 'Farooq Khatun',
        'Current Juz Memorized': '1 - 5 Juz',
        'Preferred Class Timing': 'Morning (Fajr-Zuhr)',
        'Selected Plan': 'Foundational Tajweed Track ($65/mo)',
        'Target Goal': 'Correct Makharij and learn Tuhfat al-Atfal'
      },
      notes: 'Scheduled for voice assessment.'
    },
    {
      id: 'resp-103',
      formId: 'form-placement',
      formTitle: 'Tajweed & Memorization Placement Evaluation',
      studentName: 'Tariq Mansoor',
      email: 'tariq.mansoor@example.com',
      phone: '+1 (555) 234-8899',
      submittedAt: '2026-08-30 18:45',
      status: 'Admitted',
      data: {
        'Current Juz Memorized': 'Complete Quran (30 Juz)',
        'Familiarity with Tajweed Rules': 'Advanced (Studied Tuhfah/Jazariyyah)',
        'Preferred Class Timing': 'Evening (Isha-Night)',
        'Personal Memorization Goal': 'Obtain Sanad connected to Prophet Muhammad (PBUH)'
      },
      notes: 'Passed oral recitation check with 98% accuracy.'
    },
    {
      id: 'resp-104',
      formId: 'form-summer-camp',
      formTitle: 'Summer Intensive Hifz Camp Registration',
      studentName: 'Bilal Faris',
      email: 'bilal.faris@example.com',
      phone: '+971 50 998 7766',
      submittedAt: '2026-08-28 11:20',
      status: 'Interview Scheduled',
      data: {
        'Student Age': '10 - 13 Years',
        'Summer Memorization Goal': '2 New Juz',
        'Emergency Phone Number': '+971 50 111 2233'
      },
      notes: 'Interview scheduled for Sept 5th.'
    },
    {
      id: 'resp-105',
      formId: 'form-scholarship',
      formTitle: 'Tuition Assistance & Scholarship Request',
      studentName: 'Yusuf Kareem',
      email: 'yusuf.kareem@example.com',
      phone: '+1 (555) 876-5432',
      submittedAt: '2026-08-25 16:10',
      status: 'Admitted',
      data: {
        'Number of Students Enrolling': '2 Students',
        'Requested Assistance Level': 'Partial Scholarship (50% Off)',
        'Statement of Need': 'Family committed to full-time daily attendance.'
      },
      notes: 'Approved for 50% tuition subsidy.'
    }
  ]);

  // Load persistent submissions from localStorage on mount and when tenant changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResponses((prev) => {
              const combined = [...parsed];
              prev.forEach((p) => {
                if (!combined.some((c) => c.id === p.id)) {
                  combined.push(p);
                }
              });
              return combined;
            });
          }
        }
      } catch (e) {
        console.warn('Error loading form responses from storage:', e);
      }
    }
  }, [tenant.subdomain]);

  // Available forms list from tenant
  const tenantForms: FormConfig[] = useMemo(() => {
    if (tenant.forms && tenant.forms.length > 0) {
      return tenant.forms;
    }
    return [
      {
        id: 'form-admissions',
        title: tenant.formTitle || 'Direct Admissions & Evaluation Inquiry',
        description: 'Default online student application form.',
        isDefault: true,
        status: 'active',
        fields: tenant.customFormFields || [],
      },
      {
        id: 'form-placement',
        title: 'Tajweed & Memorization Placement Evaluation',
        description: 'Placement test for new admissions.',
        isDefault: false,
        status: 'active',
        fields: [],
      },
      {
        id: 'form-scholarship',
        title: 'Tuition Assistance & Scholarship Request',
        description: 'Need-based scholarship application.',
        isDefault: false,
        status: 'active',
        fields: [],
      }
    ];
  }, [tenant.forms, tenant.formTitle, tenant.customFormFields]);

  // Selected Form Filter (per-form isolation)
  const [selectedFormId, setSelectedFormId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAnalyticsCharts, setShowAnalyticsCharts] = useState<boolean>(true);
  const [viewingResponse, setViewingResponse] = useState<FormResponse | null>(null);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter responses by selected form
  const responsesForSelectedForm = useMemo(() => {
    if (selectedFormId === 'all') return responses;
    return responses.filter((r) => r.formId === selectedFormId);
  }, [responses, selectedFormId]);

  // Dynamically extract unique custom data question keys for the current form
  const dynamicQuestionKeys = useMemo(() => {
    const keysSet = new Set<string>();
    responsesForSelectedForm.forEach((r) => {
      if (r.data) {
        Object.keys(r.data).forEach((k) => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [responsesForSelectedForm]);

  // Filter & Sort responses
  const filteredAndSortedResponses = useMemo(() => {
    let result = responsesForSelectedForm.filter((resp) => {
      const matchesSearch =
        resp.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resp.phone.includes(searchQuery) ||
        resp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(resp.data || {}).some((v) =>
          String(v).toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus =
        selectedStatusFilter === 'all' || resp.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortField === 'studentName') {
        valA = a.studentName.toLowerCase();
        valB = b.studentName.toLowerCase();
      } else if (sortField === 'email') {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      } else if (sortField === 'submittedAt') {
        valA = new Date(a.submittedAt).getTime() || 0;
        valB = new Date(b.submittedAt).getTime() || 0;
      } else if (sortField === 'status') {
        valA = a.status;
        valB = b.status;
      } else {
        // Custom data answer field
        valA = String(a.data?.[sortField] || '').toLowerCase();
        valB = String(b.data?.[sortField] || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [responsesForSelectedForm, searchQuery, selectedStatusFilter, sortField, sortDirection]);

  // Toggle sort direction or set sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Status Change Handler
  const handleStatusChange = (id: string, newStatus: FormResponse['status']) => {
    setResponses((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify(updated));
      }
      return updated;
    });
    if (viewingResponse && viewingResponse.id === id) {
      setViewingResponse((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    onAddToast({
      type: 'success',
      title: 'Status Updated',
      message: `Application marked as "${newStatus}".`
    });
  };

  // Delete Response Handler
  const handleDelete = (id: string) => {
    setResponses((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify(updated));
      }
      return updated;
    });
    if (viewingResponse?.id === id) setViewingResponse(null);
    onAddToast({
      type: 'info',
      title: 'Response Deleted',
      message: 'The submission record has been removed.'
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredAndSortedResponses.length === 0) {
      onAddToast({ type: 'info', title: 'No Data to Export', message: 'No responses match current filter.' });
      return;
    }

    const headers = ['ID', 'Form Title', 'Applicant Name', 'Email', 'Phone', 'Submission Date', 'Status', ...dynamicQuestionKeys, 'Notes'];
    const rows = filteredAndSortedResponses.map((r) => {
      const dynamicValues = dynamicQuestionKeys.map((k) => `"${(r.data?.[k] || '').toString().replace(/"/g, '""')}"`);
      return [
        `"${r.id}"`,
        `"${r.formTitle}"`,
        `"${r.studentName}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.submittedAt}"`,
        `"${r.status}"`,
        ...dynamicValues,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tenant.subdomain}_form_responses_${selectedFormId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToast({
      type: 'success',
      title: 'Export Complete',
      message: `Exported ${filteredAndSortedResponses.length} applicant records.`
    });
  };

  // Metrics calculation for selected form
  const metrics = useMemo(() => {
    const total = responsesForSelectedForm.length;
    const newCount = responsesForSelectedForm.filter((r) => r.status === 'New').length;
    const underReview = responsesForSelectedForm.filter((r) => r.status === 'Under Review').length;
    const admitted = responsesForSelectedForm.filter((r) => r.status === 'Admitted').length;
    const rejected = responsesForSelectedForm.filter((r) => r.status === 'Rejected').length;
    const conversionRate = total > 0 ? Math.round((admitted / total) * 100) : 0;

    return { total, newCount, underReview, admitted, rejected, conversionRate };
  }, [responsesForSelectedForm]);

  // Answer distribution calculation for charts
  const answerDistributions = useMemo(() => {
    const dist: Record<string, Record<string, number>> = {};
    responsesForSelectedForm.forEach((r) => {
      if (r.data) {
        Object.entries(r.data).forEach(([question, answer]) => {
          if (answer && typeof answer === 'string' && answer.length < 50) {
            if (!dist[question]) dist[question] = {};
            dist[question][answer] = (dist[question][answer] || 0) + 1;
          }
        });
      }
    });
    return dist;
  }, [responsesForSelectedForm]);

  return (
    <div className="space-y-6 font-sans text-slate-900 animate-in fade-in duration-200">
      {/* 1. Header & Quick Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Form Submissions & Lead Responses
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Isolate, sort, and analyze prospective applicant responses for each intake form.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setShowAnalyticsCharts((prev) => !prev)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              showAnalyticsCharts
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>{showAnalyticsCharts ? 'Hide Charts' : 'Show Charts'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Per-Form Navigation Tabs (Isolate Each Form) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setSelectedFormId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
            selectedFormId === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Submissions</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            selectedFormId === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
          }`}>
            {responses.length}
          </span>
        </button>

        {tenantForms.map((form) => {
          const isSelected = selectedFormId === form.id;
          const formCount = responses.filter((r) => r.formId === form.id).length;

          return (
            <button
              key={form.id}
              onClick={() => setSelectedFormId(form.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[180px]">{form.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {formCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Visual Charts & Response Analytics (Collapsible) */}
      {showAnalyticsCharts && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-150">
          {/* Status Pipeline Progress Chart */}
          <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Admissions Pipeline Funnel
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {metrics.conversionRate}% Admitted
              </span>
            </div>

            {/* Visual Funnel Stack */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>New Inquiries</span>
                  <span>{metrics.newCount}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${metrics.total ? (metrics.newCount / metrics.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Under Review / Scheduled</span>
                  <span>{metrics.underReview}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${metrics.total ? (metrics.underReview / metrics.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Admitted / Enrolled</span>
                  <span>{metrics.admitted}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${metrics.total ? (metrics.admitted / metrics.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question Answer Frequency Distribution */}
          <div className="md:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Question Answer Breakdown
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Top responses</span>
            </div>

            <div className="space-y-3 max-h-[140px] overflow-y-auto scrollbar-thin pr-1 text-xs">
              {Object.keys(answerDistributions).length === 0 ? (
                <p className="text-slate-400 py-4 text-center">No question answer distribution data yet.</p>
              ) : (
                Object.entries(answerDistributions).slice(0, 2).map(([question, answers]) => (
                  <div key={question} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-extrabold text-[11px] text-slate-800 block truncate">{question}</span>
                    <div className="space-y-1.5">
                      {Object.entries(answers).map(([ans, count]) => (
                        <div key={ans} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 truncate max-w-[200px]">{ans}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${(count / responsesForSelectedForm.length) * 100}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-slate-700 w-4 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicants, emails, or specific answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {(['all', 'New', 'Under Review', 'Interview Scheduled', 'Admitted', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer text-xs ${
                selectedStatusFilter === st
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Sortable Responsive Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                {/* Applicant Column */}
                <th
                  onClick={() => handleSort('studentName')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Applicant</span>
                    {sortField === 'studentName' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>

                {/* Contact Email & Phone */}
                <th
                  onClick={() => handleSort('email')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Contact Info</span>
                    {sortField === 'email' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>

                {/* Dynamic Question / Field Columns */}
                {dynamicQuestionKeys.slice(0, 3).map((questionKey) => (
                  <th
                    key={questionKey}
                    onClick={() => handleSort(questionKey)}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none min-w-[150px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[140px]">{questionKey}</span>
                      {sortField === questionKey ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>
                ))}

                {/* Submission Date */}
                <th
                  onClick={() => handleSort('submittedAt')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Submitted</span>
                    {sortField === 'submittedAt' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>

                {/* Status Column */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Pipeline Status</span>
                    {sortField === 'status' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-emerald-600" /> : <ArrowDown className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedResponses.length === 0 ? (
                <tr>
                  <td colSpan={6 + dynamicQuestionKeys.length} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-700">No submissions found</p>
                    <p className="text-[11px] text-slate-400">No responses match the selected form or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Column */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-xs">{r.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.id}</div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 text-xs font-medium">{r.email}</div>
                      <div className="text-[10px] text-slate-400">{r.phone}</div>
                    </td>

                    {/* Dynamic Question Answers */}
                    {dynamicQuestionKeys.slice(0, 3).map((k) => (
                      <td key={k} className="py-3.5 px-4 text-slate-700 text-xs">
                        <span className="line-clamp-1 max-w-[180px]">
                          {r.data?.[k] ? String(r.data[k]) : '—'}
                        </span>
                      </td>
                    ))}

                    {/* Submitted At */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {r.submittedAt}
                    </td>

                    {/* Pipeline Status */}
                    <td className="py-3.5 px-4">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          r.status === 'New'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : r.status === 'Under Review'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : r.status === 'Interview Scheduled'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : r.status === 'Admitted'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingResponse(r)}
                          className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="View Full Submission"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Response Inspection Drawer / Modal */}
      {viewingResponse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                  {viewingResponse.formTitle}
                </span>
                <h3 className="font-extrabold text-base text-slate-900">
                  {viewingResponse.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingResponse(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                &times;
              </button>
            </div>

            {/* Quick Contact Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewingResponse.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewingResponse.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${viewingResponse.email}`}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>

            {/* Full Form Field Answers List */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
                Applicant Responses & Questionnaire:
              </h4>

              <div className="space-y-2">
                {viewingResponse.data && Object.keys(viewingResponse.data).length > 0 ? (
                  Object.entries(viewingResponse.data).map(([field, val]) => (
                    <div key={field} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-medium block text-[10px] mb-0.5">{field}</span>
                      <span className="font-bold text-slate-900 block">{String(val)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 py-2">No additional custom questionnaire fields recorded.</p>
                )}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800">Review Notes & Instructor Remarks</label>
              <textarea
                rows={2}
                placeholder="Add evaluation comments, Tajweed voice test scores, or next steps..."
                value={viewingResponse.notes || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setResponses((prev) =>
                    prev.map((r) => (r.id === viewingResponse.id ? { ...r, notes: val } : r))
                  );
                  setViewingResponse((prev) => (prev ? { ...prev, notes: val } : null));
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewingResponse(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
