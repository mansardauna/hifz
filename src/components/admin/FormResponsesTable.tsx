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
  TrendingUp,
  Copy,
  LayoutGrid,
  List,
  Code2,
  Printer,
  Table as TableIcon
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Badge, Button, Card, PageHeader, TablePagination, Avatar } from '../ui';
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

import { detectTenantNicheType } from '../../services/classroomCustomizationService';

const getDemoResponses = (niche: string): FormResponse[] => {
  if (niche === 'quran') {
    return [
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
      }
    ];
  }

  if (niche === 'coding') {
    return [
      {
        id: 'resp-101',
        formId: 'form-admissions',
        formTitle: 'Direct Admissions & Application Inquiry',
        studentName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 432-8765',
        submittedAt: '2026-09-02 14:30',
        status: 'New',
        data: {
          'Years of Experience': '1 - 2 Years (Self-Taught & Bootcamp)',
          'Preferred Tech Stack': 'TypeScript, React 19, Node.js & Next.js',
          'Preferred Cohort Timing': 'Evening Cohort (6:00 PM - 8:30 PM)',
          'Selected Plan': 'Full-Stack Engineering Immersion ($140/mo)',
          'Target Career Goal': 'Transition to Senior Full-Stack Software Engineer'
        },
        notes: 'Solid GitHub portfolio with 3 deployed applications.'
      },
      {
        id: 'resp-102',
        formId: 'form-admissions',
        formTitle: 'Direct Admissions & Application Inquiry',
        studentName: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        phone: '+44 7911 123456',
        submittedAt: '2026-09-01 09:15',
        status: 'Under Review',
        data: {
          'Years of Experience': 'Beginner (Basic HTML/CSS & JS)',
          'Preferred Tech Stack': 'JavaScript Fundamentals & React Basics',
          'Preferred Cohort Timing': 'Weekend Intensive Track',
          'Selected Plan': 'Foundational Frontend Track ($65/mo)',
          'Target Career Goal': 'Build interactive web applications and prepare for tech roles'
        },
        notes: 'Passed technical diagnostic quiz with 92% score.'
      },
      {
        id: 'resp-103',
        formId: 'form-placement',
        formTitle: 'Technical Competency & Placement Evaluation',
        studentName: 'David Miller',
        email: 'david.miller@example.com',
        phone: '+1 (555) 345-6789',
        submittedAt: '2026-08-30 18:45',
        status: 'Admitted',
        data: {
          'Years of Experience': '3+ Years Professional Development',
          'Preferred Tech Stack': 'Distributed Systems, Microservices & Cloud Architecture',
          'Preferred Cohort Timing': 'Evening Cohort (6:00 PM - 8:30 PM)',
          'Target Career Goal': 'Architect high-concurrency cloud systems'
        },
        notes: 'Passed code review assessment and algorithmic interview.'
      }
    ];
  }

  if (niche === 'school') {
    return [
      {
        id: 'resp-101',
        formId: 'form-admissions',
        formTitle: 'Direct Student Admissions Application',
        studentName: 'Lucas Bennett',
        email: 'lucas.bennett@example.com',
        phone: '+1 (555) 876-5432',
        submittedAt: '2026-09-02 14:30',
        status: 'New',
        data: {
          'Parent / Guardian Name': 'Robert Bennett',
          'Current Academic Grade': 'Grade 11 (Honors)',
          'Preferred Cohort Timing': 'Regular School Day Session',
          'Selected Plan': 'Comprehensive Academic Curriculum ($140/mo)',
          'Target Goal': 'Complete AP Calculus and Honors Physics coursework'
        },
        notes: 'Strong academic record with 3.9 GPA.'
      },
      {
        id: 'resp-102',
        formId: 'form-admissions',
        formTitle: 'Direct Student Admissions Application',
        studentName: 'Sophia Zhang',
        email: 'sophia.zhang@example.com',
        phone: '+1 (555) 765-4321',
        submittedAt: '2026-09-01 09:15',
        status: 'Under Review',
        data: {
          'Parent / Guardian Name': 'Mei Zhang',
          'Current Academic Grade': 'Grade 9 (Foundations)',
          'Preferred Cohort Timing': 'Morning Academic Cohort',
          'Selected Plan': 'Standard Academic Foundations ($65/mo)',
          'Target Goal': 'Excel in foundational STEM subjects and literature'
        },
        notes: 'Scheduled for placement diagnostic.'
      },
      {
        id: 'resp-103',
        formId: 'form-placement',
        formTitle: 'Academic Placement & Diagnostic Assessment',
        studentName: 'Hamza Al-Khatib',
        email: 'hamza.khatib@example.com',
        phone: '+1 (555) 654-3210',
        submittedAt: '2026-08-30 18:45',
        status: 'Admitted',
        data: {
          'Parent / Guardian Name': 'Samir Al-Khatib',
          'Current Academic Grade': 'Grade 12 (Senior Capstone)',
          'Preferred Cohort Timing': 'Afternoon Honors Seminar',
          'Target Goal': 'Defend Senior Honors Capstone research paper'
        },
        notes: 'Scored 98th percentile on diagnostic mathematics assessment.'
      }
    ];
  }

  // General / Professional
  return [
    {
      id: 'resp-101',
      formId: 'form-admissions',
      formTitle: 'Direct Admissions & Enrollment Inquiry',
      studentName: 'Alex Parker',
      email: 'alex.parker@example.com',
      phone: '+1 (555) 432-1100',
      submittedAt: '2026-09-02 14:30',
      status: 'New',
      data: {
        'Sponsor / Organization': 'Parker & Associates Ltd.',
        'Current Experience Level': 'Intermediate Practitioner',
        'Preferred Session Timing': 'Evening Professional Cohort',
        'Selected Plan': 'Comprehensive Professional Track ($140/mo)',
        'Target Goal': 'Attain professional certification and operational mastery'
      },
      notes: 'Strong foundational background and clear learning objectives.'
    },
    {
      id: 'resp-102',
      formId: 'form-admissions',
      formTitle: 'Direct Admissions & Enrollment Inquiry',
      studentName: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 321-2200',
      submittedAt: '2026-09-01 09:15',
      status: 'Under Review',
      data: {
        'Sponsor / Organization': 'Independent Professional',
        'Current Experience Level': 'Foundational Practitioner',
        'Preferred Session Timing': 'Weekend Cohort',
        'Selected Plan': 'Core Fundamentals Track ($65/mo)',
        'Target Goal': 'Build structured competence in primary methodologies'
      },
      notes: 'Scheduled for initial intake interview.'
    },
    {
      id: 'resp-103',
      formId: 'form-placement',
      formTitle: 'Competency & Placement Diagnostic',
      studentName: 'Jordan Lee',
      email: 'jordan.lee@example.com',
      phone: '+1 (555) 210-3300',
      submittedAt: '2026-08-30 18:45',
      status: 'Admitted',
      data: {
        'Current Experience Level': 'Advanced Specialist',
        'Preferred Session Timing': 'Evening Professional Cohort',
        'Target Goal': 'Complete executive capstone and final defense'
      },
      notes: 'Passed entrance review with high distinction.'
    }
  ];
};

export const FormResponsesTable: React.FC<FormResponsesTableProps> = ({ onAddToast }) => {
  const { tenant, language } = useTenant();
  const isAr = language === 'ar';
  const nicheType = detectTenantNicheType(tenant);
  const isQuran = nicheType === 'quran';
  const isCoding = nicheType === 'coding';
  const isSchool = nicheType === 'school';


  const [responses, setResponses] = useState<FormResponse[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return [];
  });

  // Load persistent submissions from localStorage on mount and when tenant changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`);
        if (stored) {
          setResponses(JSON.parse(stored));
        } else {
          setResponses([]);
        }
      } catch (e) {
        console.warn('Failed to parse cached responses:', e);
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
        title: isQuran
          ? 'Tajweed & Memorization Placement Evaluation'
          : isCoding
          ? 'Technical Competency & Placement Evaluation'
          : isSchool
          ? 'Academic Placement & Diagnostic Assessment'
          : 'Competency & Placement Diagnostic',
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

  // High-Capacity 400+ Fields Inspector Drawer State
  const [fieldSearchQuery, setFieldSearchQuery] = useState<string>('');
  const [modalLayoutMode, setModalLayoutMode] = useState<'cards' | 'grid' | 'table' | 'json'>('cards');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [copiedFieldKey, setCopiedFieldKey] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatusFilter, selectedFormId, pageSize]);

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

  // Paginated Sliced Responses
  const paginatedResponses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedResponses.slice(start, start + pageSize);
  }, [filteredAndSortedResponses, currentPage, pageSize]);

  // Helper to categorize fields for 400+ fields UX
  const categorizeField = (fieldKey: string): string => {
    const lower = fieldKey.toLowerCase();
    if (lower.includes('parent') || lower.includes('guardian') || lower.includes('dob') || lower.includes('birth') || lower.includes('age') || lower.includes('gender') || lower.includes('address') || lower.includes('city') || lower.includes('country') || lower.includes('emergency')) {
      return 'personal';
    }
    if (lower.includes('juz') || lower.includes('tajweed') || lower.includes('quran') || lower.includes('hifz') || lower.includes('surah') || lower.includes('memoriz') || lower.includes('level') || lower.includes('grade') || lower.includes('academic') || lower.includes('school') || lower.includes('experience')) {
      return 'academic';
    }
    if (lower.includes('time') || lower.includes('timing') || lower.includes('schedule') || lower.includes('slot') || lower.includes('day') || lower.includes('plan') || lower.includes('fee') || lower.includes('tuition') || lower.includes('payment') || lower.includes('track')) {
      return 'scheduling';
    }
    return 'custom';
  };

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
      {/* 1. Page Header */}
      <PageHeader
        title="Form Submissions & Lead Responses"
        subtitle="Isolate, sort, and analyze prospective applicant responses for each intake form."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalyticsCharts((prev) => !prev)}
              leftIcon={<BarChart3 className="w-4 h-4 text-emerald-600" />}
            >
              {showAnalyticsCharts ? 'Hide Charts' : 'Show Charts'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* 2. Per-Form Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar space-x-1">
        <button
          onClick={() => setSelectedFormId('all')}
          className={`py-3 px-5 font-bold text-xs border-b-2 transition-all shrink-0 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedFormId === 'all'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Submissions</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            selectedFormId === 'all' ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)] font-bold' : 'bg-slate-100 text-slate-600'
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
              className={`py-3 px-5 font-bold text-xs border-b-2 transition-all shrink-0 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[180px]">{form.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)] font-bold' : 'bg-slate-100 text-slate-600'
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

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAndSortedResponses.length === 0 ? (
                <tr>
                  <td colSpan={6 + dynamicQuestionKeys.length} className="py-14 text-center text-slate-400">
                    <Avatar size="xl" className="mx-auto mb-3" />
                    <p className="font-bold text-base text-slate-800">No submissions found</p>
                    <p className="text-sm text-slate-500 mt-1">No responses match the selected form or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Column */}
                    <td className="py-4 px-5 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.studentName} size="md" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{r.studentName}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{r.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-5">
                      <div className="text-slate-800 text-sm font-medium">{r.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.phone}</div>
                    </td>

                    {/* Dynamic Question Answers */}
                    {dynamicQuestionKeys.slice(0, 3).map((k) => (
                      <td key={k} className="py-4 px-5 text-slate-700 text-sm">
                        <span className="line-clamp-1 max-w-[180px]">
                          {r.data?.[k] ? String(r.data[k]) : '—'}
                        </span>
                      </td>
                    ))}

                    {/* Submitted At */}
                    <td className="py-4 px-5 text-slate-500 font-mono text-xs">
                      {r.submittedAt}
                    </td>

                    {/* Pipeline Status */}
                    <td className="py-4 px-5">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
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
                          onClick={() => {
                            setViewingResponse(r);
                            setFieldSearchQuery('');
                            setActiveCategoryTab('all');
                          }}
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

        {/* Pagination Controls */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredAndSortedResponses.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>

      {/* 6. Ultra-Scalable Response Inspection Drawer / Modal (Built for 400+ Fields) */}
      {viewingResponse && (() => {
        // Collect all data entries
        const allEntries = viewingResponse.data ? Object.entries(viewingResponse.data) : [];
        
        // Filter by field search query and category
        const filteredEntries = allEntries.filter(([k, v]) => {
          const matchSearch =
            k.toLowerCase().includes(fieldSearchQuery.toLowerCase()) ||
            String(v).toLowerCase().includes(fieldSearchQuery.toLowerCase());
          
          if (!matchSearch) return false;
          if (activeCategoryTab === 'all') return true;
          return categorizeField(k) === activeCategoryTab;
        });

        // Category counts
        const catCounts = {
          all: allEntries.length,
          personal: allEntries.filter(([k]) => categorizeField(k) === 'personal').length,
          academic: allEntries.filter(([k]) => categorizeField(k) === 'academic').length,
          scheduling: allEntries.filter(([k]) => categorizeField(k) === 'scheduling').length,
          custom: allEntries.filter(([k]) => categorizeField(k) === 'custom').length,
        };

        const copyToClipboard = (text: string, key?: string) => {
          navigator.clipboard.writeText(text);
          if (key) {
            setCopiedFieldKey(key);
            setTimeout(() => setCopiedFieldKey(null), 2000);
          }
          onAddToast({
            type: 'info',
            title: 'Copied to Clipboard',
            message: key ? `Field "${key}" copied.` : 'Submission data copied.'
          });
        };

        return (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      {viewingResponse.formTitle}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{viewingResponse.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                    <span>{viewingResponse.studentName}</span>
                    <Badge variant={viewingResponse.status === 'Admitted' ? 'success' : viewingResponse.status === 'Rejected' ? 'error' : 'warning'}>
                      {viewingResponse.status}
                    </Badge>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(viewingResponse, null, 2))}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    title="Copy full record JSON"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">JSON</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-700"
                    title="Print Submission"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingResponse(null)}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm ml-2 transition-colors cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Quick Contact & Summary Bar */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex flex-wrap items-center gap-4 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${viewingResponse.email}`} className="font-medium hover:text-emerald-700 underline">
                      {viewingResponse.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${viewingResponse.phone}`} className="font-medium hover:text-emerald-700">
                      {viewingResponse.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{viewingResponse.submittedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">
                    {allEntries.length} Total Fields Recorded
                  </span>
                </div>
              </div>

              {/* 400+ Fields Search & View Controls Bar */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                {/* Search Bar for fast field filtering */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search across questionnaire fields & answers..."
                    value={fieldSearchQuery}
                    onChange={(e) => setFieldSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  {fieldSearchQuery && (
                    <button
                      onClick={() => setFieldSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Layout Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setModalLayoutMode('cards')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      modalLayoutMode === 'cards' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                  <button
                    onClick={() => setModalLayoutMode('table')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      modalLayoutMode === 'table' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Key-Value Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => setModalLayoutMode('json')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      modalLayoutMode === 'json' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Raw JSON View"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Category Tabs */}
              {modalLayoutMode !== 'json' && (
                <div className="px-6 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
                  <button
                    onClick={() => setActiveCategoryTab('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                      activeCategoryTab === 'all'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All ({catCounts.all})
                  </button>
                  {catCounts.personal > 0 && (
                    <button
                      onClick={() => setActiveCategoryTab('personal')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                        activeCategoryTab === 'personal'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Personal & Guardian ({catCounts.personal})
                    </button>
                  )}
                  {catCounts.academic > 0 && (
                    <button
                      onClick={() => setActiveCategoryTab('academic')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                        activeCategoryTab === 'academic'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Academic & Quranic ({catCounts.academic})
                    </button>
                  )}
                  {catCounts.scheduling > 0 && (
                    <button
                      onClick={() => setActiveCategoryTab('scheduling')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                        activeCategoryTab === 'scheduling'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Program & Timing ({catCounts.scheduling})
                    </button>
                  )}
                  {catCounts.custom > 0 && (
                    <button
                      onClick={() => setActiveCategoryTab('custom')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                        activeCategoryTab === 'custom'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Custom Fields ({catCounts.custom})
                    </button>
                  )}
                </div>
              )}

              {/* Scrollable Fields Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {modalLayoutMode === 'json' ? (
                  <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{JSON.stringify(viewingResponse, null, 2)}</pre>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No questionnaire fields match "{fieldSearchQuery}"</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting a different category tab.</p>
                  </div>
                ) : modalLayoutMode === 'table' ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-2.5 px-4 w-1/3">Field Question</th>
                          <th className="py-2.5 px-4">Applicant Response</th>
                          <th className="py-2.5 px-3 text-right w-16">Copy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEntries.map(([field, val]) => (
                          <tr key={field} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-4 font-semibold text-slate-700">{field}</td>
                            <td className="py-2.5 px-4 text-slate-900 font-bold break-words">{String(val)}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => copyToClipboard(String(val), field)}
                                className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Copy Value"
                              >
                                {copiedFieldKey === field ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredEntries.map(([field, val]) => (
                      <div
                        key={field}
                        className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:bg-white transition-all shadow-2xs group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {field}
                          </span>
                          <button
                            onClick={() => copyToClipboard(String(val), field)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded transition-opacity"
                            title="Copy Value"
                          >
                            {copiedFieldKey === field ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-xs font-bold text-slate-900 break-words leading-relaxed">
                          {String(val)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Internal Admin Review Remarks */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Internal Review Notes & Placement Remarks</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder={
                      isQuran
                        ? "Add evaluation comments, Tajweed voice test scores, or next steps..."
                        : isCoding
                        ? "Add evaluation comments, technical review scores, or next steps..."
                        : isSchool
                        ? "Add evaluation comments, academic placement scores, or next steps..."
                        : "Add evaluation comments, interview scores, or next steps..."
                    }
                    value={viewingResponse.notes || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setResponses((prev) =>
                        prev.map((r) => (r.id === viewingResponse.id ? { ...r, notes: val } : r))
                      );
                      setViewingResponse((prev) => (prev ? { ...prev, notes: val } : null));
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Update Status:</span>
                  <select
                    value={viewingResponse.status}
                    onChange={(e) => handleStatusChange(viewingResponse.id, e.target.value as any)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingResponse(null)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
