import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { Badge } from '../ui';

interface FormResponse {
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
      formId: 'form-ijazah',
      formTitle: 'Sanad Ijazah & Khatmah Application',
      studentName: 'Tariq Mansoor',
      email: 'tariq.mansoor@example.com',
      phone: '+1 (555) 234-8899',
      submittedAt: '2026-08-30 18:45',
      status: 'Admitted',
      data: {
        'Prior Tajweed Certifications': 'Matn Al-Jazariyyah, Tuhfat al-Atfal',
        'Target Qira\'ah Track': 'Hafs \'an \'Asim (حفص عن عاصم)',
        'Hours Dedicated Weekly for Muraja\'ah': '20+ hours (Intensive)',
        'Sanad Verified Teacher': 'Shaykh Dr. Abdul Rahman'
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
      formId: 'form-admissions',
      formTitle: 'Direct Admissions & Evaluation Inquiry',
      studentName: 'Maryam Douglas',
      email: 'maryam.douglas@example.org',
      phone: '+1 (415) 555-0199',
      submittedAt: '2026-08-25 16:10',
      status: 'Admitted',
      data: {
        'Parent / Guardian Name': 'Robert Douglas',
        'Current Juz Memorized': 'Complete Quran (30 Juz)',
        'Preferred Class Timing': 'Evening (Isha-Night)',
        'Selected Plan': 'Intensive Hifz Program ($140/mo)'
      }
    }
  ]);

  // Load persistent submissions from localStorage on mount and when tenant changes
  React.useEffect(() => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormFilter, setSelectedFormFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [viewingResponse, setViewingResponse] = useState<FormResponse | null>(null);

  // Available forms list from tenant
  const tenantForms = tenant.forms && tenant.forms.length > 0 ? tenant.forms : [];

  // Filtered responses
  const filteredResponses = responses.filter((resp) => {
    const matchesSearch =
      resp.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resp.phone.includes(searchQuery) ||
      resp.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesForm = selectedFormFilter === 'all' || resp.formId === selectedFormFilter;
    const matchesStatus = selectedStatusFilter === 'all' || resp.status === selectedStatusFilter;

    return matchesSearch && matchesForm && matchesStatus;
  });

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
      message: `Response ${id} marked as "${newStatus}".`
    });
  };

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

  const handleExportCSV = () => {
    const headers = ['ID', 'Form', 'Student Name', 'Email', 'Phone', 'Date', 'Status'];
    const rows = filteredResponses.map((r) => [
      r.id,
      `"${r.formTitle}"`,
      `"${r.studentName}"`,
      r.email,
      `"${r.phone}"`,
      r.submittedAt,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `form_submissions_${tenant.subdomain}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToast({
      type: 'success',
      title: 'CSV Export Generated',
      message: `Exported ${filteredResponses.length} submissions to CSV.`
    });
  };

  const getStatusBadge = (status: FormResponse['status']) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> New</span>;
      case 'Under Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> In Review</span>;
      case 'Interview Scheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> Interview</span>;
      case 'Admitted':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Admitted</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Form Submissions & Lead Inquiries</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time responses submitted through your custom forms and landing page widgets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export to CSV
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, email, phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Form Filter */}
          <select
            value={selectedFormFilter}
            onChange={(e) => setSelectedFormFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Forms ({responses.length})</option>
            <option value="form-admissions">Admissions Inquiry</option>
            <option value="form-ijazah">Sanad Ijazah Application</option>
            <option value="form-summer-camp">Summer Camp</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">In Review</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Admitted">Admitted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Student / Applicant</th>
                <th className="py-3.5 px-4">Form</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No form submissions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredResponses.map((resp) => (
                  <tr key={resp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {resp.studentName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{resp.studentName}</div>
                          <div className="text-[11px] text-slate-400">{resp.email} • {resp.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{resp.formTitle}</span>
                      <div className="text-[10px] text-slate-400">ID: {resp.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {resp.submittedAt}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(resp.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingResponse(resp)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => handleDelete(resp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Response"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Response Detail Drawer / Modal */}
      {viewingResponse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submission Details</span>
                <h3 className="text-base font-extrabold text-slate-900">{viewingResponse.studentName}</h3>
                <p className="text-xs text-slate-500">{viewingResponse.formTitle} • {viewingResponse.submittedAt}</p>
              </div>
              <button
                onClick={() => setViewingResponse(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300/60 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Action Switcher */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block">Admissions Pipeline Status:</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {(['New', 'Under Review', 'Interview Scheduled', 'Admitted', 'Rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(viewingResponse.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        viewingResponse.status === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant Contact */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Email</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">{viewingResponse.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Phone</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">{viewingResponse.phone}</p>
                </div>
              </div>

              {/* Form Question Answers */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                  Submitted Form Fields:
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(viewingResponse.data).map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="font-bold text-slate-600 text-[11px]">{key}</div>
                      <div className="font-extrabold text-slate-900 text-xs mt-1">{String(val)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {viewingResponse.notes && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                  <div className="font-bold text-amber-900 text-[11px]">Staff Assessment Notes:</div>
                  <p className="text-amber-950 mt-1">{viewingResponse.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(viewingResponse.id)}
                className="px-4 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Delete Record
              </button>
              <button
                onClick={() => setViewingResponse(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
