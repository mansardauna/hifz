import React, { useState, useEffect, useMemo } from 'react';
import { FormFieldConfig, FormConfig, FieldType, FieldWidth, FormUiTheme } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
import { ThemedFormRenderer, THEME_COLOR_MAP } from '../forms/ThemedFormRenderer';
import {
  Plus,
  Trash2,
  Edit3,
  Type,
  Mail,
  Phone,
  List,
  Calendar,
  UploadCloud,
  FileText,
  ArrowUp,
  ArrowDown,
  Save,
  CheckSquare,
  Columns,
  Sparkles,
  Eye,
  GripVertical,
  CheckCircle2,
  Copy,
  Star,
  ArrowLeft,
  Layers,
  FileCheck,
  Check,
  Wand2,
  Palette,
  Play,
  X,
  Send,
  AlertCircle,
  Download,
  Search,
  Filter,
  BarChart3,
  Sliders,
  ExternalLink,
  Clock,
  UserCheck,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { Badge, DataTablePagination } from '../ui';

interface VisualFormBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export interface FormResponseItem {
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

type FormStudioTab = 'questions' | 'responses' | 'themes' | 'preview_embed';

export const VisualFormBuilder: React.FC<VisualFormBuilderProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig, language, direction } = useTenant();
  const isAr = language === 'ar';

  const isDemoAcademy = ['hifz-academy', 'al-furqan', 'code-academy', 'school-demo'].includes(tenant.subdomain || '');

  // Initialize forms list from tenant
  const initialForms: FormConfig[] = tenant.forms && tenant.forms.length > 0
    ? tenant.forms
    : isDemoAcademy
    ? [
        {
          id: 'form-admissions',
          title: tenant.formTitle || 'Direct Admissions & Placement Inquiry',
          titleAr: 'نموذج القبول وتقييم المستوى',
          description: tenant.formDescription || 'Complete your student details below for immediate review by our admissions committee.',
          isDefault: true,
          status: 'active',
          themeStyle: 'material',
          accentColor: 'emerald',
          acceptingResponses: true,
          submissionsCount: 48,
          createdAt: '2026-08-01',
          submitButtonText: 'Submit Application',
          submitButtonTextAr: 'إرسال طلب القبول',
          fields: [
            { id: 'parentName', label: 'Parent / Guardian Name', labelAr: 'اسم ولي الأمر', type: 'text', required: false, placeholder: 'e.g. Ahmad Al-Mansoor', width: 'half', order: 1 },
            { id: 'memorizedJuz', label: 'Current Juz Memorized (0-30)', labelAr: 'عدد الأجزاء المحفوظة', type: 'select', required: true, options: ['0 (Beginner)', '1 - 5 Juz', '6 - 15 Juz', '16 - 29 Juz', 'Complete Quran (30 Juz)'], width: 'half', order: 2 },
            { id: 'preferredTime', label: 'Preferred Class Timing', labelAr: 'الوقت المفضل للحصص', type: 'select', required: true, options: ['Morning (Fajr-Zuhr)', 'Afternoon (Asr-Maghrib)', 'Evening (Isha-Night)'], width: 'full', order: 3 }
          ]
        },
        {
          id: 'form-ijazah',
          title: 'Sanad Ijazah & Khatmah Application',
          titleAr: 'طلب الالتحاق بمسار الإسناد والإجازة',
          description: 'Application for students seeking unbroken Sanad chains and complete oral recitation verification.',
          isDefault: false,
          status: 'active',
          themeStyle: 'islamic_heritage',
          accentColor: 'emerald',
          acceptingResponses: true,
          submissionsCount: 14,
          createdAt: '2026-08-10',
          submitButtonText: 'Submit Sanad Application',
          fields: [
            { id: 'priorCertification', label: 'Prior Tajweed Certifications (e.g. Tuhfat al-Atfal, Jazariyyah)', labelAr: 'المتون المحفوظة (تحفة الأطفال، الجزرية)', type: 'text', required: true, placeholder: 'List certified texts...', width: 'full', order: 1 },
            { id: 'qiraahPreference', label: 'Target Qira\'ah Track', labelAr: 'الرواية المطلوبة', type: 'select', required: true, options: ['Hafs \'an \'Asim (حفص عن عاصم)', 'Warsh \'an Nafi\' (ورش عن نافع)', 'Qalun \'an Nafi\' (قالون عن نافع)'], width: 'half', order: 2 },
            { id: 'weeklyAvailability', label: 'Hours Dedicated Weekly for Muraja\'ah', labelAr: 'ساعات المراجعة الأسبوعية', type: 'select', required: true, options: ['5 - 10 hours', '10 - 20 hours', '20+ hours (Intensive)'], width: 'half', order: 3 }
          ]
        },
        {
          id: 'form-tech-assessment',
          title: 'Coding Bootcamp Entrance Assessment',
          titleAr: 'تقييم القبول لمعسكر البرمجة',
          description: 'Application for aspiring software engineers and full-stack developers.',
          isDefault: false,
          status: 'active',
          themeStyle: 'cyber_dark',
          accentColor: 'blue',
          acceptingResponses: true,
          submissionsCount: 22,
          createdAt: '2026-08-15',
          submitButtonText: 'Submit Assessment',
          fields: [
            { id: 'githubUrl', label: 'GitHub / Portfolio URL', labelAr: 'رابط ملف جيت هاب', type: 'text', required: false, placeholder: 'https://github.com/username', width: 'half', order: 1 },
            { id: 'experienceLevel', label: 'Prior Coding Background', labelAr: 'الخبرة السابقة', type: 'select', required: true, options: ['Absolute Beginner', 'HTML/CSS/JS Basics', 'Intermediate React/Node'], width: 'half', order: 2 },
            { id: 'trackGoal', label: 'Target Track Goal', labelAr: 'الهدف من المعسكر', type: 'textarea', required: true, placeholder: 'Describe your transition goals...', width: 'full', order: 3 }
          ]
        }
      ]
    : [];

  const [formsList, setFormsList] = useState<FormConfig[]>(initialForms);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<FormStudioTab>('questions');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Active form currently opened in the studio
  const activeForm = useMemo(() => {
    return formsList.find((f) => f.id === editingFormId) || null;
  }, [formsList, editingFormId]);

  // Load All Submissions from localStorage
  const [allResponses, setAllResponses] = useState<FormResponseItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`tenant_form_responses_${tenant.subdomain}`);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return isDemoAcademy ? [
      {
        id: 'resp-1',
        formId: 'form-admissions',
        formTitle: 'Direct Admissions & Placement Inquiry',
        studentName: 'Zaid Al-Harithi',
        email: 'zaid@example.com',
        phone: '+966 50 123 4567',
        submittedAt: '2026-09-02 14:30',
        status: 'New',
        data: {
          'Parent / Guardian Name': 'Ibrahim Al-Harithi',
          'Current Juz Memorized': '6 - 15 Juz',
          'Preferred Class Timing': 'Evening (Isha-Night)',
        }
      },
      {
        id: 'resp-2',
        formId: 'form-admissions',
        formTitle: 'Direct Admissions & Placement Inquiry',
        studentName: 'Amina Khatun',
        email: 'amina@example.com',
        phone: '+44 7700 900123',
        submittedAt: '2026-09-01 09:15',
        status: 'Under Review',
        data: {
          'Parent / Guardian Name': 'Farooq Khatun',
          'Current Juz Memorized': '1 - 5 Juz',
          'Preferred Class Timing': 'Morning (Fajr-Zuhr)',
        }
      },
      {
        id: 'resp-3',
        formId: 'form-ijazah',
        formTitle: 'Sanad Ijazah & Khatmah Application',
        studentName: 'Tariq Mansoor',
        email: 'tariq.mansoor@example.com',
        phone: '+1 (555) 234-8899',
        submittedAt: '2026-08-30 18:45',
        status: 'Admitted',
        data: {
          'Prior Tajweed Certifications': 'Tuhfat al-Atfal & Jazariyyah completed',
          'Target Qira\'ah Track': 'Hafs \'an \'Asim',
          'Weekly Availability': '10 - 20 hours',
        }
      },
      {
        id: 'resp-4',
        formId: 'form-tech-assessment',
        formTitle: 'Coding Bootcamp Entrance Assessment',
        studentName: 'Karim Bennani',
        email: 'karim@techdev.io',
        phone: '+33 6 12 34 56 78',
        submittedAt: '2026-09-10 11:20',
        status: 'Interview Scheduled',
        data: {
          'GitHub / Portfolio URL': 'https://github.com/kbennani',
          'Prior Coding Background': 'HTML/CSS/JS Basics',
          'Target Track Goal': 'Full-Stack React & Next.js transition'
        }
      }
    ] : [];
  });

  // Responses dedicated to the currently opened form
  const currentFormResponses = useMemo(() => {
    if (!activeForm) return [];
    return allResponses.filter((r) => r.formId === activeForm.id);
  }, [allResponses, activeForm]);

  // Responses Tab State: Search, Filter, Pagination, Inspection Modal
  const [responseSearchQuery, setResponseSearchQuery] = useState('');
  const [responseStatusFilter, setResponseStatusFilter] = useState<string>('All');
  const [selectedResponseForModal, setSelectedResponseForModal] = useState<FormResponseItem | null>(null);
  const [responsePage, setResponsePage] = useState(1);
  const responsesPerPage = 8;

  const filteredResponses = useMemo(() => {
    return currentFormResponses.filter((resp) => {
      const matchSearch =
        resp.studentName.toLowerCase().includes(responseSearchQuery.toLowerCase()) ||
        resp.email.toLowerCase().includes(responseSearchQuery.toLowerCase()) ||
        resp.phone.toLowerCase().includes(responseSearchQuery.toLowerCase()) ||
        Object.values(resp.data || {}).some((v) =>
          String(v).toLowerCase().includes(responseSearchQuery.toLowerCase())
        );
      const matchStatus = responseStatusFilter === 'All' || resp.status === responseStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [currentFormResponses, responseSearchQuery, responseStatusFilter]);

  const totalResponsePages = Math.max(1, Math.ceil(filteredResponses.length / responsesPerPage));
  const paginatedResponses = filteredResponses.slice(
    (responsePage - 1) * responsesPerPage,
    responsePage * responsesPerPage
  );

  // Save changes to tenant and local storage
  const persistForms = (newForms: FormConfig[]) => {
    setFormsList(newForms);
    const defaultForm = newForms.find((f) => f.isDefault) || newForms[0];
    updateTenantConfig({
      forms: newForms,
      customFormFields: defaultForm?.fields || [],
      formTitle: defaultForm?.title,
      formDescription: defaultForm?.description,
    });
  };

  const persistResponses = (updated: FormResponseItem[]) => {
    setAllResponses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`tenant_form_responses_${tenant.subdomain}`, JSON.stringify(updated));
    }
  };

  // Status changer for response
  const handleUpdateResponseStatus = (respId: string, newStatus: FormResponseItem['status']) => {
    const updated = allResponses.map((r) => (r.id === respId ? { ...r, status: newStatus } : r));
    persistResponses(updated);
    onAddToast({
      type: 'success',
      title: 'Status Updated',
      message: `Response marked as "${newStatus}".`,
    });
  };

  // Delete single response
  const handleDeleteResponse = (respId: string) => {
    const updated = allResponses.filter((r) => r.id !== respId);
    persistResponses(updated);
    if (activeForm) {
      const count = updated.filter((r) => r.formId === activeForm.id).length;
      const updatedForms = formsList.map((f) =>
        f.id === activeForm.id ? { ...f, submissionsCount: count } : f
      );
      persistForms(updatedForms);
    }
    onAddToast({
      type: 'info',
      title: 'Response Deleted',
      message: 'Submission removed from form records.',
    });
  };

  // Export CSV for this form only
  const handleExportFormCsv = () => {
    if (!activeForm || currentFormResponses.length === 0) {
      onAddToast({
        type: 'info',
        title: 'No Data',
        message: 'No submissions available to export for this form.',
      });
      return;
    }

    const headers = ['Response ID', 'Student Name', 'Email', 'Phone', 'Status', 'Submitted At', ...activeForm.fields.map(f => f.label)];
    const rows = currentFormResponses.map(r => [
      r.id,
      `"${r.studentName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.status}"`,
      `"${r.submittedAt}"`,
      ...activeForm.fields.map(f => `"${r.data[f.label] || r.data[f.id] || ''}"`)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeForm.title.toLowerCase().replace(/\s+/g, '_')}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToast({
      type: 'success',
      title: 'CSV Exported',
      message: `Downloaded ${currentFormResponses.length} submissions.`,
    });
  };

  // Create New Form
  const handleCreateNewForm = () => {
    const newId = `form-${Date.now()}`;
    const newForm: FormConfig = {
      id: newId,
      title: 'New Student Intake Form',
      titleAr: 'نموذج تسجيل جديد',
      description: 'Please complete the questionnaire below for admission.',
      isDefault: formsList.length === 0,
      status: 'active',
      themeStyle: 'material',
      accentColor: 'emerald',
      acceptingResponses: true,
      submissionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      submitButtonText: 'Submit Application',
      fields: [
        { id: `fld_${Date.now()}_1`, label: 'Student Full Name', labelAr: 'اسم الطالب', type: 'text', required: true, width: 'half', order: 1 },
        { id: `fld_${Date.now()}_2`, label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email', required: true, width: 'half', order: 2 },
        { id: `fld_${Date.now()}_3`, label: 'Phone / WhatsApp', labelAr: 'رقم الهاتف', type: 'phone', required: true, width: 'half', order: 3 },
        { id: `fld_${Date.now()}_4`, label: 'Current Proficiency Level', labelAr: 'المستوى الحالي', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'], width: 'half', order: 4 },
      ]
    };

    const updated = [...formsList, newForm];
    persistForms(updated);
    setEditingFormId(newId);
    setActiveStudioTab('questions');
    setSelectedFieldId(newForm.fields[0].id);

    onAddToast({
      type: 'success',
      title: 'Form Created',
      message: 'Created new form with default starter fields.',
    });
  };

  // Add Question to Active Form
  const handleAddField = (type: FieldType = 'text') => {
    if (!activeForm) return;
    const newFieldId = `fld_${Date.now()}`;
    const defaultLabels: Record<FieldType, { en: string; ar: string }> = {
      text: { en: 'Full Name / Text Answer', ar: 'إجابة نصية' },
      email: { en: 'Email Address', ar: 'البريد الإلكتروني' },
      phone: { en: 'Phone / WhatsApp', ar: 'رقم الهاتف' },
      select: { en: 'Dropdown Choice Question', ar: 'اختيار من قائمة' },
      date: { en: 'Date of Birth / Preferred Date', ar: 'التاريخ' },
      file: { en: 'Audio Sample or Document Upload', ar: 'رفع ملف أو تسجيل' },
      textarea: { en: 'Detailed Statement / Questions', ar: 'تفاصيل إضافية' },
    };

    const newField: FormFieldConfig = {
      id: newFieldId,
      label: defaultLabels[type].en,
      labelAr: defaultLabels[type].ar,
      type,
      required: false,
      width: 'full',
      order: activeForm.fields.length + 1,
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };

    const updatedFields = [...activeForm.fields, newField];
    const updatedForm = { ...activeForm, fields: updatedFields };
    const updatedForms = formsList.map((f) => (f.id === activeForm.id ? updatedForm : f));
    persistForms(updatedForms);
    setSelectedFieldId(newFieldId);

    onAddToast({
      type: 'success',
      title: 'Question Added',
      message: `Added new ${type} question to form.`,
    });
  };

  // Update Field Configuration
  const handleUpdateField = (fieldId: string, updates: Partial<FormFieldConfig>) => {
    if (!activeForm) return;
    const updatedFields = activeForm.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f));
    const updatedForm = { ...activeForm, fields: updatedFields };
    const updatedForms = formsList.map((f) => (f.id === activeForm.id ? updatedForm : f));
    persistForms(updatedForms);
  };

  // Delete Field
  const handleDeleteField = (fieldId: string) => {
    if (!activeForm) return;
    const updatedFields = activeForm.fields.filter((f) => f.id !== fieldId);
    const updatedForm = { ...activeForm, fields: updatedFields };
    const updatedForms = formsList.map((f) => (f.id === activeForm.id ? updatedForm : f));
    persistForms(updatedForms);
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(updatedFields[0]?.id || null);
    }
  };

  // Move Field Up/Down
  const handleMoveField = (index: number, dirMove: 'up' | 'down') => {
    if (!activeForm) return;
    const targetIdx = dirMove === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeForm.fields.length) return;

    const fieldsCopy = [...activeForm.fields];
    const temp = fieldsCopy[index];
    fieldsCopy[index] = fieldsCopy[targetIdx];
    fieldsCopy[targetIdx] = temp;

    const updatedForm = { ...activeForm, fields: fieldsCopy };
    const updatedForms = formsList.map((f) => (f.id === activeForm.id ? updatedForm : f));
    persistForms(updatedForms);
  };

  // Update Form Properties (Theme, Title, Acceptance, etc.)
  const handleUpdateActiveForm = (updates: Partial<FormConfig>) => {
    if (!activeForm) return;
    const updatedForm = { ...activeForm, ...updates };
    const updatedForms = formsList.map((f) => (f.id === activeForm.id ? updatedForm : f));
    persistForms(updatedForms);
  };

  // Perform Live Test Submission in Preview Tab
  const handleLiveTestSubmit = (data: Record<string, any>) => {
    if (!activeForm) return;
    const newSubmission: FormResponseItem = {
      id: `resp-test-${Date.now()}`,
      formId: activeForm.id,
      formTitle: activeForm.title,
      studentName: data.studentName || data.parentName || data.fullName || 'Test Applicant',
      email: data.email || 'applicant@test.com',
      phone: data.phone || '+1 555-0199',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'New',
      data,
      notes: 'Submitted via interactive studio preview'
    };

    const updatedResponses = [newSubmission, ...allResponses];
    persistResponses(updatedResponses);

    const updatedCount = (activeForm.submissionsCount || 0) + 1;
    handleUpdateActiveForm({ submissionsCount: updatedCount });

    onAddToast({
      type: 'success',
      title: 'Submission Received!',
      message: `Test response recorded. View it directly in the Responses tab.`,
    });
  };

  // Palette Component Types
  const paletteTypes: { type: FieldType; label: string; icon: any }[] = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'email', label: 'Email Address', icon: Mail },
    { type: 'phone', label: 'Phone / WhatsApp', icon: Phone },
    { type: 'select', label: 'Dropdown Select', icon: List },
    { type: 'date', label: 'Date Picker', icon: Calendar },
    { type: 'file', label: 'File Upload', icon: UploadCloud },
    { type: 'textarea', label: 'Long Paragraph', icon: FileText },
  ];

  // -------------------------------------------------------------
  // VIEW 1: FORMS GRID (When no single form is opened)
  // -------------------------------------------------------------
  if (!activeForm) {
    return (
      <div className="space-y-8 font-sans" dir={direction}>
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm">
                <FileCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-black text-slate-900 ${isAr ? 'font-arabic text-3xl' : ''}`}>
                  {isAr ? 'استوديو النماذج والاستبيانات الذكية' : 'Google Forms & Admissions Studio'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? 'إنشاء نماذج مخصصة لكل تخصص، مع ثيمات متقدمة (Material UI) وردود معزولة لكل نموذج' : 'Create Google Forms-style multi-forms with Material UI themes, isolated response repositories, and landing page embeds.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCreateNewForm}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إنشاء نموذج جديد' : 'Create New Form'}</span>
            </button>
          </div>
        </div>

        {/* Forms Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formsList.map((form) => {
            const formRespCount = allResponses.filter((r) => r.formId === form.id).length;
            const theme = form.themeStyle || 'material';

            return (
              <div
                key={form.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Visual Mini Canva Preview */}
                <div
                  onClick={() => {
                    setEditingFormId(form.id);
                    setActiveStudioTab('questions');
                  }}
                  className={`h-40 p-5 cursor-pointer relative overflow-hidden transition-all flex flex-col justify-between ${
                    theme === 'cyber_dark' ? 'bg-slate-950 text-slate-100' :
                    theme === 'glassmorphism' ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-slate-900' :
                    theme === 'islamic_heritage' ? 'bg-amber-50/70 border-b-2 border-emerald-600/30' :
                    theme === 'minimalist' ? 'bg-slate-50 border-b-2 border-black font-mono' :
                    'bg-slate-50 border-b border-slate-200'
                  }`}
                >
                  {/* Theme Accent Strip */}
                  {theme === 'material' && (
                    <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-600" />
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-slate-800 shadow-xs border border-slate-200">
                      {theme.toUpperCase()}
                    </span>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      form.acceptingResponses !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {form.acceptingResponses !== false ? 'Accepting Responses' : 'Closed'}
                    </span>
                  </div>

                  {/* Mock Mini Input fields representation */}
                  <div className="space-y-1.5 opacity-70">
                    <div className="h-4 w-3/4 bg-slate-300/60 rounded-md" />
                    <div className="h-6 w-full bg-white/80 border border-slate-300/60 rounded-lg shadow-xs" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="truncate">{form.fields.length} Questionnaire Fields</span>
                    <span className="text-emerald-700 font-mono font-black">{formRespCount} Responses</span>
                  </div>
                </div>

                {/* Form Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {form.title}
                      </h3>
                      {form.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 shrink-0">
                          Landing Page Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {form.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFormId(form.id);
                        setActiveStudioTab('questions');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingFormId(form.id);
                        setActiveStudioTab('responses');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Responses ({formRespCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingFormId(form.id);
                        setActiveStudioTab('themes');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Theme & Style"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DEDICATED FORM STUDIO (With Questions, Responses, Themes, Preview)
  // -------------------------------------------------------------
  const selectedField = activeForm.fields.find((f) => f.id === selectedFieldId) || activeForm.fields[0];

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Top Form Studio Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingFormId(null)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Back to Forms List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activeForm.title}
                  onChange={(e) => handleUpdateActiveForm({ title: e.target.value })}
                  className="font-black text-xl sm:text-2xl text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded-xl border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <input
                type="text"
                value={activeForm.description}
                onChange={(e) => handleUpdateActiveForm({ description: e.target.value })}
                placeholder="Form description or instructions..."
                className="text-xs text-slate-500 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-0.5 rounded-lg border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:outline-none transition-all w-full max-w-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Acceptance Responses Switch (Google Forms style) */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                {activeForm.acceptingResponses !== false ? 'Accepting Responses' : 'Not Accepting'}
              </span>
              <button
                type="button"
                onClick={() => handleUpdateActiveForm({ acceptingResponses: activeForm.acceptingResponses === false ? true : false })}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  activeForm.acceptingResponses !== false ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    activeForm.acceptingResponses !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToast({
                  type: 'success',
                  title: 'Changes Published',
                  message: `"${activeForm.title}" is saved and live.`,
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish</span>
            </button>
          </div>
        </div>

        {/* 4 Google Forms Style Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setActiveStudioTab('questions')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeStudioTab === 'questions'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Questions ({activeForm.fields.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('responses')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeStudioTab === 'responses'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Responses ({currentFormResponses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('themes')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeStudioTab === 'themes'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Design & Themes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('preview_embed')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              activeStudioTab === 'preview_embed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview & Embed</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: QUESTIONS & FIELDS EDITOR                              */}
      {/* ------------------------------------------------------------- */}
      {activeStudioTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Palette: Add Field Types */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Add Field Type
              </h3>
              <div className="space-y-2">
                {paletteTypes.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleAddField(item.type)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 text-slate-700 hover:text-emerald-800 font-bold text-xs transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-emerald-100 text-slate-500 group-hover:text-emerald-700 flex items-center justify-center shadow-xs">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Questions List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Form Questions ({activeForm.fields.length})
                </h3>
                <span className="text-[11px] text-slate-400">Click a question to configure</span>
              </div>

              {activeForm.fields.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">No questions added yet.</p>
                  <p className="text-[11px] text-slate-400">Click any field type on the left to start building.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeForm.fields.map((field, idx) => {
                    const isSelected = selectedFieldId === field.id;
                    return (
                      <div
                        key={field.id}
                        onClick={() => setSelectedFieldId(field.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-black text-xs text-slate-900 truncate">{field.label}</p>
                              <span className="text-[10px] text-slate-400 uppercase font-mono">{field.type} • {field.width || 'full'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleMoveField(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveField(idx, 'down')}
                              disabled={idx === activeForm.fields.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteField(field.id)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Selected Field Property Inspector */}
          <div className="lg:col-span-4 space-y-4">
            {selectedField ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900">Question Settings</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">{selectedField.type}</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Question Label (English)</label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Question Label (Arabic)</label>
                    <input
                      type="text"
                      value={selectedField.labelAr || ''}
                      onChange={(e) => handleUpdateField(selectedField.id, { labelAr: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Placeholder Text</label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => handleUpdateField(selectedField.id, { placeholder: e.target.value })}
                      placeholder="e.g. Enter full name..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Field Width</label>
                      <select
                        value={selectedField.width || 'full'}
                        onChange={(e) => handleUpdateField(selectedField.id, { width: e.target.value as FieldWidth })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        <option value="full">Full Width (100%)</option>
                        <option value="half">Half Width (50%)</option>
                        <option value="third">One Third (33%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Field Type</label>
                      <select
                        value={selectedField.type}
                        onChange={(e) => handleUpdateField(selectedField.id, { type: e.target.value as FieldType })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                      >
                        <option value="text">Text Input</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone / WhatsApp</option>
                        <option value="select">Dropdown Select</option>
                        <option value="date">Date</option>
                        <option value="file">File Upload</option>
                        <option value="textarea">Paragraph Area</option>
                      </select>
                    </div>
                  </div>

                  {/* Required Switch */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700">Required Response</span>
                    <input
                      type="checkbox"
                      checked={selectedField.required}
                      onChange={(e) => handleUpdateField(selectedField.id, { required: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </div>

                  {/* Dropdown Options Editor */}
                  {selectedField.type === 'select' && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="block font-bold text-slate-700">Dropdown Options</label>
                      {(selectedField.options || []).map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(selectedField.options || [])];
                              newOpts[oi] = e.target.value;
                              handleUpdateField(selectedField.id, { options: newOpts });
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newOpts = (selectedField.options || []).filter((_, idx) => idx !== oi);
                              handleUpdateField(selectedField.id, { options: newOpts });
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newOpts = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                          handleUpdateField(selectedField.id, { options: newOpts });
                        }}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
                Select a question on the left to edit its properties.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ISOLATED RESPONSES REPOSITORY (FOR THIS SPECIFIC FORM)  */}
      {/* ------------------------------------------------------------- */}
      {activeStudioTab === 'responses' && (
        <div className="space-y-6">
          {/* Form Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Submissions</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{currentFormResponses.length}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">New / Unreviewed</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {currentFormResponses.filter((r) => r.status === 'New').length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Interview / Admitted</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {currentFormResponses.filter((r) => ['Interview Scheduled', 'Admitted'].includes(r.status)).length}
              </p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Export Data</span>
                <p className="text-xs text-slate-500 mt-0.5">CSV spreadsheet</p>
              </div>
              <button
                type="button"
                onClick={handleExportFormCsv}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
                title="Download CSV"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Responses Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={responseSearchQuery}
                  onChange={(e) => setResponseSearchQuery(e.target.value)}
                  placeholder="Search applicants, emails, questionnaire answers..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter:</span>
                <select
                  value={responseStatusFilter}
                  onChange={(e) => setResponseStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Submissions List */}
            {paginatedResponses.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-600">No responses recorded yet for this form.</p>
                <p className="text-xs text-slate-400">
                  Submissions from your landing page or live test embeds will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Submitted At</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedResponses.map((resp) => (
                      <tr key={resp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          <div>{resp.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{resp.id}</div>
                        </td>
                        <td className="p-3">
                          <div>{resp.email}</div>
                          <div className="text-[10px] text-slate-400">{resp.phone}</div>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">
                          {resp.submittedAt}
                        </td>
                        <td className="p-3">
                          <select
                            value={resp.status}
                            onChange={(e) => handleUpdateResponseStatus(resp.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                              resp.status === 'New' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              resp.status === 'Admitted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              resp.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Admitted">Admitted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setSelectedResponseForModal(resp)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResponse(resp.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="pt-4 border-t border-slate-100">
                  <DataTablePagination
                    currentPage={responsePage}
                    totalPages={totalResponsePages}
                    pageSize={responsesPerPage}
                    totalItems={filteredResponses.length}
                    onPageChange={setResponsePage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: DESIGN & UI THEMES (Material UI, Glassmorphism, etc.)   */}
      {/* ------------------------------------------------------------- */}
      {activeStudioTab === 'themes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Form UI Theme & Visual Styling</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select a visual design language for this form. It renders across your landing page and embeds.
              </p>
            </div>

            {/* Theme Preset Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  id: 'material' as FormUiTheme,
                  title: 'Material UI Style',
                  desc: 'Elevated top banner, outlined inputs, ripple button shadow',
                  previewBg: 'bg-white border-slate-300',
                  accent: 'bg-emerald-600',
                },
                {
                  id: 'glassmorphism' as FormUiTheme,
                  title: 'Neo-Glassmorphism',
                  desc: 'Frosted glass blur, soft iridescent glow, translucent fields',
                  previewBg: 'bg-gradient-to-br from-emerald-50 to-teal-100',
                  accent: 'bg-teal-500',
                },
                {
                  id: 'minimalist' as FormUiTheme,
                  title: 'Clean Minimalist',
                  desc: 'Notion-style crisp monochrome lines, high contrast',
                  previewBg: 'bg-slate-50 border-2 border-black font-mono',
                  accent: 'bg-black',
                },
                {
                  id: 'islamic_heritage' as FormUiTheme,
                  title: 'Islamic Arabesque',
                  desc: 'Emerald & Gold frame, Bismillah emblem, warm parchment',
                  previewBg: 'bg-amber-50/70 border-amber-300',
                  accent: 'bg-emerald-800',
                },
                {
                  id: 'cyber_dark' as FormUiTheme,
                  title: 'Cyber Dark IDE',
                  desc: 'Obsidian dark container, glowing neon cyan focus rings',
                  previewBg: 'bg-slate-950 text-white border-slate-800',
                  accent: 'bg-cyan-500',
                },
              ].map((themeOpt) => {
                const isSelected = (activeForm.themeStyle || 'material') === themeOpt.id;
                return (
                  <div
                    key={themeOpt.id}
                    onClick={() => handleUpdateActiveForm({ themeStyle: themeOpt.id })}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-lg ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className={`h-16 rounded-2xl ${themeOpt.previewBg} p-2 flex flex-col justify-between`}>
                        <div className={`h-2 w-1/3 rounded-full ${themeOpt.accent}`} />
                        <div className="h-3 w-full bg-slate-200/60 rounded" />
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900">{themeOpt.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{themeOpt.desc}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Active Theme' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Accent Color Palette & Banner Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
              <div className="space-y-3">
                <label className="block font-bold text-slate-700">Primary Theme Accent Color</label>
                <div className="flex items-center gap-3">
                  {Object.keys(THEME_COLOR_MAP).map((cKey) => {
                    const isPicked = (activeForm.accentColor || 'emerald') === cKey;
                    return (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => handleUpdateActiveForm({ accentColor: cKey })}
                        className={`w-8 h-8 rounded-full ${THEME_COLOR_MAP[cKey].primary} transition-transform cursor-pointer ${
                          isPicked ? 'scale-125 ring-4 ring-slate-300 shadow-md' : 'hover:scale-110'
                        }`}
                        title={cKey}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-slate-700">Header Banner Image URL (Optional)</label>
                <input
                  type="text"
                  value={activeForm.headerBannerUrl || ''}
                  onChange={(e) => handleUpdateActiveForm({ headerBannerUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or leave blank"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-slate-700">Submit Button Text</label>
                <input
                  type="text"
                  value={activeForm.submitButtonText || ''}
                  onChange={(e) => handleUpdateActiveForm({ submitButtonText: e.target.value })}
                  placeholder="Submit Application"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <label className="block font-bold text-slate-700">Custom Success Message</label>
                <input
                  type="text"
                  value={activeForm.customSuccessMessage || ''}
                  onChange={(e) => handleUpdateActiveForm({ customSuccessMessage: e.target.value })}
                  placeholder="Thank you! Our committee will review your application."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: LIVE PREVIEW & LANDING PAGE EMBED INTEGRATION          */}
      {/* ------------------------------------------------------------- */}
      {activeStudioTab === 'preview_embed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Live Themed Form Preview */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-100 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <ThemedFormRenderer
                form={activeForm}
                onSubmit={handleLiveTestSubmit}
                language={language}
              />
            </div>
          </div>

          {/* Right: Embed & Integration Assistant */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Landing Page Embed</span>
              </h3>

              <p className="text-slate-500 leading-relaxed">
                This form can be embedded in your subdomain landing page via the <strong>Puck Page Builder Studio</strong> or selected as the default admissions form.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">Form ID Identifier</span>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                  <span>{activeForm.id}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeForm.id);
                      onAddToast({ type: 'success', title: 'Copied', message: 'Form ID copied to clipboard.' });
                    }}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = formsList.map((f) => ({
                      ...f,
                      isDefault: f.id === activeForm.id,
                    }));
                    persistForms(updated);
                    onAddToast({
                      type: 'success',
                      title: 'Set as Landing Page Default',
                      message: `"${activeForm.title}" is now the active form on your landing page.`,
                    });
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all text-xs cursor-pointer"
                >
                  Set as Landing Page Default Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Modal for Single Response */}
      {selectedResponseForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900">{selectedResponseForModal.studentName}</h3>
                <span className="text-xs text-slate-400">{selectedResponseForModal.email} • {selectedResponseForModal.phone}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResponseForModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-600">Submission Timestamp:</span>
                <span className="font-mono text-slate-800">{selectedResponseForModal.submittedAt}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Questionnaire Answers:</h4>
                {Object.entries(selectedResponseForModal.data || {}).map(([key, val], idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 block">{key}</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResponseForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
