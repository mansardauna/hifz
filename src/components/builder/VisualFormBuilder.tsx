import React, { useState } from 'react';
import { FormFieldConfig, FormConfig, FieldType, FieldWidth } from '../../types';
import { useTenant } from '../../context/TenantContext';
import { ToastMessage } from '../ui/Toast';
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
  Wand2
} from 'lucide-react';

interface VisualFormBuilderProps {
  onAddToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const VisualFormBuilder: React.FC<VisualFormBuilderProps> = ({ onAddToast }) => {
  const { tenant, updateTenantConfig, language, direction } = useTenant();

  // Initialize forms list from tenant or defaults
  const initialForms: FormConfig[] = tenant.forms && tenant.forms.length > 0
    ? tenant.forms
    : [
        {
          id: 'form-admissions',
          title: tenant.formTitle || 'Direct Admissions & Evaluation Inquiry',
          titleAr: 'نموذج القبول وتقييم المستوى',
          description: tenant.formDescription || 'Fill out your prospective student details below for immediate review by our admissions committee.',
          isDefault: true,
          status: 'active',
          submissionsCount: 48,
          createdAt: '2026-08-01',
          fields: tenant.customFormFields && tenant.customFormFields.length > 0
            ? tenant.customFormFields
            : [
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
          submissionsCount: 14,
          createdAt: '2026-08-10',
          fields: [
            { id: 'priorCertification', label: 'Prior Tajweed Certifications (e.g. Tuhfat al-Atfal, Jazariyyah)', labelAr: 'المتون المحفوظة (تحفة الأطفال، الجزرية)', type: 'text', required: true, placeholder: 'List certified texts...', width: 'full', order: 1 },
            { id: 'qiraahPreference', label: 'Target Qira\'ah Track', labelAr: 'الرواية المطلوبة', type: 'select', required: true, options: ['Hafs \'an \'Asim (حفص عن عاصم)', 'Warsh \'an Nafi\' (ورش عن نافع)', 'Qalun \'an Nafi\' (قالون عن نافع)', 'Shu\'bah \'an \'Asim (شعبة عن عاصم)'], width: 'half', order: 2 },
            { id: 'weeklyAvailability', label: 'Hours Dedicated Weekly for Muraja\'ah', labelAr: 'ساعات المراجعة الأسبوعية', type: 'select', required: true, options: ['5 - 10 hours', '10 - 20 hours', '20+ hours (Intensive)'], width: 'half', order: 3 }
          ]
        },
        {
          id: 'form-summer-camp',
          title: 'Summer Intensive Hifz Camp Registration',
          titleAr: 'التسجيل في المخيم الصيفي المكثف',
          description: '6-week accelerated Quran memorization and Arabic immersion camp for youth and children.',
          isDefault: false,
          status: 'active',
          submissionsCount: 32,
          createdAt: '2026-08-15',
          fields: [
            { id: 'childAge', label: 'Student Age (6 - 17 years)', labelAr: 'عمر الطالب', type: 'select', required: true, options: ['6 - 9 Years', '10 - 13 Years', '14 - 17 Years'], width: 'half', order: 1 },
            { id: 'targetJuzCount', label: 'Summer Memorization Goal', labelAr: 'الهدف الصيفي', type: 'select', required: true, options: ['1 New Juz + Revision', '2 New Juz', '3 New Juz (Accelerated Track)'], width: 'half', order: 2 },
            { id: 'emergencyContact', label: 'Emergency Phone Number', labelAr: 'رقم هاتف الطوارئ', type: 'phone', required: true, placeholder: '+966 55 000 0000', width: 'full', order: 3 }
          ]
        }
      ];

  const [formsList, setFormsList] = useState<FormConfig[]>(initialForms);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  // Active form being edited
  const activeEditingForm = formsList.find((f) => f.id === editingFormId) || null;
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const isAr = language === 'ar';

  const paletteComponents: { type: FieldType; label: string; icon: any }[] = [
    { type: 'text', label: 'Text Input', icon: Type },
    { type: 'email', label: 'Email Input', icon: Mail },
    { type: 'phone', label: 'Phone / WhatsApp', icon: Phone },
    { type: 'select', label: 'Dropdown Select', icon: List },
    { type: 'date', label: 'Date Picker', icon: Calendar },
    { type: 'file', label: 'File Attachment', icon: UploadCloud },
    { type: 'textarea', label: 'Text Area', icon: FileText },
  ];

  // Helper to persist forms
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

  // AI Form Generator State
  const [isAiFormModalOpen, setIsAiFormModalOpen] = useState<boolean>(false);
  const [aiFormGoal, setAiFormGoal] = useState<string>('');
  const [isGeneratingFormWithAi, setIsGeneratingFormWithAi] = useState<boolean>(false);

  const handleGenerateFormWithAi = (presetGoal?: string) => {
    const goal = presetGoal || aiFormGoal;
    setIsGeneratingFormWithAi(true);

    setTimeout(() => {
      const formId = `form-${Date.now()}`;
      let title = 'AI Generated Admissions Application';
      let titleAr = 'نموذج القبول الذكي';
      let description = 'Please complete the questionnaire below for immediate academic evaluation.';
      let fields: FormFieldConfig[] = [];

      const lowerGoal = (goal || '').toLowerCase();

      if (lowerGoal.includes('placement') || lowerGoal.includes('evaluat') || lowerGoal.includes('tajweed') || lowerGoal.includes('hifz') || lowerGoal.includes('quran')) {
        title = 'Tajweed & Memorization Placement Evaluation';
        titleAr = 'تقييم مستوى التجويد والحفظ';
        description = 'Evaluate recitation proficiency, Makharij clarity, and prior memorized Juz.';
        fields = [
          { id: `fld_name_${Date.now()}`, label: 'Student Full Name', labelAr: 'اسم الطالب الكامل', type: 'text', required: true, placeholder: 'e.g. Bilal Ibrahim', width: 'half', order: 1 },
          { id: `fld_email_${Date.now()}`, label: 'Guardian / Contact Email', labelAr: 'البريد الإلكتروني لولي الأمر', type: 'email', required: true, placeholder: 'parent@example.com', width: 'half', order: 2 },
          { id: `fld_phone_${Date.now()}`, label: 'WhatsApp / Phone', labelAr: 'رقم الواتساب', type: 'phone', required: true, placeholder: '+966 50 000 0000', width: 'half', order: 3 },
          { id: `fld_juz_${Date.now()}`, label: 'Current Juz Memorized', labelAr: 'عدد الأجزاء المحفوظة', type: 'select', required: true, options: ['0 (Beginner)', '1 - 5 Juz', '6 - 15 Juz', '16 - 29 Juz', 'Complete Quran (30 Juz)'], width: 'half', order: 4 },
          { id: `fld_rules_${Date.now()}`, label: 'Familiarity with Tajweed Rules (Noon Sakinah, Madd)', labelAr: 'المعرفة بأحكام التجويد', type: 'select', required: true, options: ['Beginner (No Prior Rules)', 'Intermediate (Know Basic Rules)', 'Advanced (Studied Tuhfah/Jazariyyah)'], width: 'half', order: 5 },
          { id: `fld_audio_${Date.now()}`, label: 'Audio Recitation Sample (Surah Al-Fatihah or Any Surah)', labelAr: 'تسجيل صوتي للتلاوة (الفاتحة أو أي سورة)', type: 'file', required: false, width: 'half', order: 6 },
          { id: `fld_schedule_${Date.now()}`, label: 'Preferred Class Timing', labelAr: 'الوقت المفضل للحصص', type: 'select', required: true, options: ['Morning (Fajr-Zuhr)', 'Afternoon (Asr-Maghrib)', 'Evening (Isha-Night)'], width: 'full', order: 7 },
          { id: `fld_goals_${Date.now()}`, label: 'Personal Memorization Goal for Next 6 Months', labelAr: 'الهدف القرآني للأشهر الستة القادمة', type: 'textarea', required: false, placeholder: 'Describe your goals...', width: 'full', order: 8 },
        ];
      } else if (lowerGoal.includes('code') || lowerGoal.includes('bootcamp') || lowerGoal.includes('software')) {
        title = 'Full-Stack Developer Bootcamp Application';
        titleAr = 'طلب الالتحاق بمعسكر البرمجة';
        description = 'Application for aspiring software engineers and cloud architects.';
        fields = [
          { id: `fld_name_${Date.now()}`, label: 'Applicant Name', labelAr: 'اسم المتقدم', type: 'text', required: true, placeholder: 'e.g. Alex Morgan', width: 'half', order: 1 },
          { id: `fld_email_${Date.now()}`, label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'alex@example.com', width: 'half', order: 2 },
          { id: `fld_github_${Date.now()}`, label: 'GitHub / Portfolio URL', labelAr: 'رابط ملف جيت هاب', type: 'text', required: false, placeholder: 'https://github.com/username', width: 'half', order: 3 },
          { id: `fld_exp_${Date.now()}`, label: 'Prior Coding Experience', labelAr: 'الخبرة السابقة في البرمجة', type: 'select', required: true, options: ['Absolute Beginner', 'HTML/CSS/JS Basics', 'Built Simple Web Apps', 'Intermediate Programmer'], width: 'half', order: 4 },
          { id: `fld_hours_${Date.now()}`, label: 'Weekly Hours Dedicated to Practice', labelAr: 'ساعات التفرغ الأسبوعية', type: 'select', required: true, options: ['10 - 15 Hours (Part-Time)', '20 - 30 Hours', '40+ Hours (Full Immersion)'], width: 'half', order: 5 },
          { id: `fld_track_${Date.now()}`, label: 'Desired Career Track', labelAr: 'المسار المهني المطلوب', type: 'select', required: true, options: ['Full-Stack React & Next.js', 'AI Systems & Cloud Backend', 'Frontend Architecture'], width: 'half', order: 6 },
          { id: `fld_motivation_${Date.now()}`, label: 'Why do you want to join this cohort?', labelAr: 'ما هو دافعك للانضمام؟', type: 'textarea', required: true, placeholder: 'Tell us about your career transition goals...', width: 'full', order: 7 },
        ];
      } else if (lowerGoal.includes('scholarship') || lowerGoal.includes('aid') || lowerGoal.includes('financial')) {
        title = 'Tuition Assistance & Scholarship Request';
        titleAr = 'طلب منحة دراسية ومساعدة مالية';
        description = 'Application for need-based tuition subsidy and educational sponsorships.';
        fields = [
          { id: `fld_name_${Date.now()}`, label: 'Applicant / Guardian Name', labelAr: 'اسم المتقدم أو ولي الأمر', type: 'text', required: true, placeholder: 'Full Name...', width: 'half', order: 1 },
          { id: `fld_email_${Date.now()}`, label: 'Contact Email', labelAr: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'contact@example.com', width: 'half', order: 2 },
          { id: `fld_phone_${Date.now()}`, label: 'Phone Number', labelAr: 'رقم الهاتف', type: 'phone', required: true, placeholder: '+1 (555) 000-0000', width: 'half', order: 3 },
          { id: `fld_dependents_${Date.now()}`, label: 'Number of Students Enrolling', labelAr: 'عدد الطلاب المسجلين', type: 'select', required: true, options: ['1 Student', '2 Students', '3+ Students (Family Discount)'], width: 'half', order: 4 },
          { id: `fld_subsidy_${Date.now()}`, label: 'Requested Assistance Level', labelAr: 'نسبة الدعم المطلوبة', type: 'select', required: true, options: ['Partial Scholarship (50% Off)', 'Significant Assistance (75% Off)', 'Full Tuition Sponsorship (100% Need-Based)'], width: 'half', order: 5 },
          { id: `fld_circumstance_${Date.now()}`, label: 'Statement of Need & Dedication', labelAr: 'شرح الوضع المالي والالتزام', type: 'textarea', required: true, placeholder: 'Please share your family situation and commitment to completing the track...', width: 'full', order: 6 },
        ];
      } else {
        title = goal || 'General Admissions & Course Inquiry';
        fields = [
          { id: `fld_name_${Date.now()}`, label: 'Student Full Name', labelAr: 'اسم الطالب الكامل', type: 'text', required: true, placeholder: 'Enter name...', width: 'half', order: 1 },
          { id: `fld_email_${Date.now()}`, label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'email@example.com', width: 'half', order: 2 },
          { id: `fld_phone_${Date.now()}`, label: 'Phone / WhatsApp', labelAr: 'رقم الهاتف', type: 'phone', required: true, placeholder: '+1 000 000 0000', width: 'half', order: 3 },
          { id: `fld_level_${Date.now()}`, label: 'Current Proficiency Level', labelAr: 'المستوى الحالي', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced'], width: 'half', order: 4 },
          { id: `fld_notes_${Date.now()}`, label: 'Questions / Special Requests', labelAr: 'أي أسئلة أو طلبات خاصة', type: 'textarea', required: false, placeholder: 'How can our academy assist you?', width: 'full', order: 5 },
        ];
      }

      const newForm: FormConfig = {
        id: formId,
        title,
        titleAr,
        description,
        isDefault: false,
        status: 'active',
        submissionsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        fields,
      };

      const updated = [...formsList, newForm];
      persistForms(updated);
      setEditingFormId(formId);
      setSelectedFieldId(newForm.fields[0].id);
      setIsGeneratingFormWithAi(false);
      setIsAiFormModalOpen(false);
      setAiFormGoal('');

      onAddToast({
        type: 'success',
        title: 'AI Form Generated Successfully!',
        message: `Created "${newForm.title}" with ${newForm.fields.length} customized fields.`,
      });
    }, 700);
  };

  // Create a new form
  const handleCreateNewForm = () => {
    const newFormId = `form-${Date.now()}`;
    const newForm: FormConfig = {
      id: newFormId,
      title: 'New Student Intake Form',
      description: 'Please complete the questionnaire below for academy registration.',
      isDefault: false,
      status: 'active',
      submissionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      fields: [
        { id: `fld_name_${Date.now()}`, label: 'Applicant Full Name', labelAr: 'الاسم الكامل', type: 'text', required: true, placeholder: 'Enter full name...', width: 'half', order: 1 },
        { id: `fld_email_${Date.now()}`, label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'applicant@example.com', width: 'half', order: 2 },
        { id: `fld_notes_${Date.now()}`, label: 'Prior Quran Background', labelAr: 'الخلفية القرآنية', type: 'textarea', required: false, placeholder: 'Describe your prior studies...', width: 'full', order: 3 },
      ],
    };

    const updated = [...formsList, newForm];
    persistForms(updated);
    setEditingFormId(newFormId);
    setSelectedFieldId(newForm.fields[0].id);
    onAddToast({ type: 'success', title: 'New Form Created', message: 'Form added. Customize its fields and preview.' });
  };

  // Duplicate an existing form
  const handleDuplicateForm = (form: FormConfig) => {
    const duplicated: FormConfig = {
      ...form,
      id: `form-${Date.now()}`,
      title: `${form.title} (Copy)`,
      isDefault: false,
      submissionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      fields: form.fields.map((fld) => ({ ...fld, id: `fld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })),
    };

    const updated = [...formsList, duplicated];
    persistForms(updated);
    onAddToast({ type: 'success', title: 'Form Duplicated', message: `Created copy of "${form.title}".` });
  };

  // Delete a form
  const handleDeleteForm = (formId: string) => {
    if (formsList.length <= 1) {
      onAddToast({ type: 'error', title: 'Cannot Delete', message: 'At least one form must remain in the academy.' });
      return;
    }
    const updated = formsList.filter((f) => f.id !== formId);
    if (!updated.some((f) => f.isDefault)) {
      updated[0].isDefault = true;
    }
    persistForms(updated);
    if (editingFormId === formId) {
      setEditingFormId(null);
    }
    onAddToast({ type: 'info', title: 'Form Deleted', message: 'Form removed from your repository.' });
  };

  // Set default form for landing page
  const handleSetDefault = (formId: string) => {
    const updated = formsList.map((f) => ({
      ...f,
      isDefault: f.id === formId,
    }));
    persistForms(updated);
    onAddToast({ type: 'success', title: 'Default Form Updated', message: 'This form will now appear on your academy landing page.' });
  };

  // Update active form fields
  const handleUpdateActiveForm = (updates: Partial<FormConfig>) => {
    if (!editingFormId) return;
    const updated = formsList.map((f) => (f.id === editingFormId ? { ...f, ...updates } : f));
    persistForms(updated);
  };

  // Add field to active form
  const handleAddField = (type: FieldType) => {
    if (!activeEditingForm) return;
    const newField: FormFieldConfig = {
      id: `fld_${Date.now()}`,
      type,
      label: `New ${type.toUpperCase()} Field`,
      labelAr: `حقل جديد (${type})`,
      placeholder: `Enter ${type}...`,
      required: false,
      width: type === 'textarea' ? 'full' : 'half',
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
      order: activeEditingForm.fields.length + 1,
    };

    const updatedFields = [...activeEditingForm.fields, newField];
    handleUpdateActiveForm({ fields: updatedFields });
    setSelectedFieldId(newField.id);
    onAddToast({ type: 'success', title: 'Field Added', message: `Inserted ${type} field.` });
  };

  // Move field up/down
  const handleMoveField = (index: number, moveDirection: 'up' | 'down') => {
    if (!activeEditingForm) return;
    const targetIndex = moveDirection === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeEditingForm.fields.length) return;

    const updated = [...activeEditingForm.fields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    handleUpdateActiveForm({ fields: updated });
  };

  // Delete field
  const handleDeleteField = (fieldId: string) => {
    if (!activeEditingForm) return;
    const updatedFields = activeEditingForm.fields.filter((f) => f.id !== fieldId);
    handleUpdateActiveForm({ fields: updatedFields });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(updatedFields[0]?.id || null);
    }
  };

  // Update specific field properties
  const handleUpdateFieldProps = (fieldId: string, updates: Partial<FormFieldConfig>) => {
    if (!activeEditingForm) return;
    const updatedFields = activeEditingForm.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f));
    handleUpdateActiveForm({ fields: updatedFields });
  };

  const selectedField = activeEditingForm?.fields.find((f) => f.id === selectedFieldId);

  // -------------------------------------------------------------
  // VIEW 1: CARD LIST OF BUILT FORMS
  // -------------------------------------------------------------
  if (!editingFormId || !activeEditingForm) {
    return (
      <div className="space-y-6 font-sans" dir={direction}>
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Form Builder
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create and manage multiple intake and lead capture forms for your academy. Forms are automatically available as draggable blocks in the Page Builder.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsAiFormModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-95"
            >
              <Wand2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Build Form with AI</span>
            </button>

            <button
              onClick={handleCreateNewForm}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Form</span>
            </button>
          </div>
        </div>

        {/* Form Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formsList.map((form) => {
            return (
              <div
                key={form.id}
                className={`bg-white rounded-md border shadow-md p-6 flex flex-col justify-between transition-all hover:shadow-lg ${
                  form.isDefault
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {form.status || 'Active'}
                    </span>

                    {form.isDefault ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        Default Landing Form
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(form.id)}
                        className="text-[10px] text-slate-400 hover:text-emerald-700 font-semibold cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-display text-slate-900 mb-1.5">
                    {form.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {form.description}
                  </p>

                  {/* Form Metrics */}
                  <div className="grid grid-cols-2 gap-2 my-5 p-3 rounded-md bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Form Fields</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">
                        {form.fields.length} Inputs
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Inquiries Received</p>
                      <p className="font-bold text-emerald-700 text-sm mt-0.5">
                        {form.submissionsCount || 0} Leads
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setEditingFormId(form.id);
                      setSelectedFieldId(form.fields[0]?.id || null);
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Form Layout</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateForm(form)}
                    className="p-2 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                    title="Duplicate Form"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="p-2 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="Delete Form"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: VISUAL DRAG-AND-DROP FORM EDITOR
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Editor Top Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-md border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditingFormId(null)}
            className="p-2 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Forms</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-display text-slate-900">
                {activeEditingForm.title}
              </h2>
              {activeEditingForm.isDefault && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Default Landing Form
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Drag-and-drop fields, choose flex layout widths, and preview changes in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onAddToast({ type: 'success', title: 'Form Saved', message: `Saved changes to "${activeEditingForm.title}".` });
            setEditingFormId(null);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-display text-xs rounded-md shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save & Return to Forms</span>
        </button>
      </div>

      {/* Form Settings Header (Title & Description) */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-md space-y-4">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-700">
          Form Title & Distribution Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Form Heading Title</label>
            <input
              type="text"
              value={activeEditingForm.title}
              onChange={(e) => handleUpdateActiveForm({ title: e.target.value })}
              placeholder="e.g. Direct Admissions & Evaluation Inquiry"
              className="w-full p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Form Subtitle / Distribution Description</label>
            <input
              type="text"
              value={activeEditingForm.description}
              onChange={(e) => handleUpdateActiveForm({ description: e.target.value })}
              placeholder="e.g. Fill out your details for immediate review..."
              className="w-full p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* 3-Column Studio: Component Palette | Visual Canvas Preview | Field Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Component Palette */}
        <div className="lg:col-span-3 bg-white p-4 rounded-md border border-slate-200 shadow-md space-y-3">
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-700 mb-3">
            Add Field Blocks
          </h3>
          <div className="space-y-1.5">
            {paletteComponents.map((comp) => {
              const Icon = comp.icon;
              return (
                <button
                  key={comp.type}
                  type="button"
                  onClick={() => handleAddField(comp.type)}
                  className="w-full flex items-center justify-between p-2.5 rounded-md border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-start text-xs font-semibold text-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{comp.label}</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Live Drag-and-Drop Form Canvas Preview */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-md border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold font-display text-slate-900">
                Live Form Layout Preview
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {activeEditingForm.fields.length} Custom Fields
            </span>
          </div>

          {/* Form Card Preview */}
          <div className="p-5 sm:p-6 rounded-md bg-slate-50 border border-slate-200/80 shadow-xs">
            <div className="text-center mb-6">
              <h4 className="text-base font-bold font-display text-slate-900">
                {activeEditingForm.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {activeEditingForm.description}
              </p>
            </div>

            {/* Flexed Field Grid */}
            <div className="flex flex-wrap -mx-2">
              {activeEditingForm.fields.map((field, idx) => {
                const isSelected = selectedFieldId === field.id;
                const widthClass =
                  field.width === 'third'
                    ? 'w-full sm:w-1/3'
                    : field.width === 'half'
                    ? 'w-full sm:w-1/2'
                    : 'w-full';

                return (
                  <div key={field.id} className={`${widthClass} px-2 mb-3.5`}>
                    <div
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-3 rounded-md border transition-all cursor-pointer relative group bg-white ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Action Controls */}
                      <div className="flex items-center justify-between mb-1.5 opacity-70 group-hover:opacity-100">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {field.width === 'full' ? '100% Full' : field.width === 'half' ? '50% Flex' : '33% Col'}
                        </span>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleMoveField(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveField(idx, 'down')}
                            disabled={idx === activeEditingForm.fields.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteField(field.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete Field"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Live Input Field */}
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <select
                          disabled
                          className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 text-xs"
                        >
                          {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          disabled
                          rows={2}
                          placeholder={field.placeholder}
                          className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 text-xs"
                        />
                      ) : (
                        <input
                          type={field.type}
                          disabled
                          placeholder={field.placeholder}
                          className="w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 text-xs"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form Submit Preview Button */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <button
                disabled
                className="w-full py-2.5 bg-emerald-700 text-white font-bold font-display text-xs rounded-md shadow-xs opacity-90 cursor-not-allowed"
              >
                Submit Admissions Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* Right: Selected Field Property Inspector */}
        <div className="lg:col-span-3 bg-white p-4 rounded-md border border-slate-200 shadow-md space-y-4">
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-700">
            Field Properties
          </h3>

          {selectedField ? (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Label (English)</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => handleUpdateFieldProps(selectedField.id, { label: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Label (Arabic)</label>
                <input
                  type="text"
                  value={selectedField.labelAr}
                  onChange={(e) => handleUpdateFieldProps(selectedField.id, { labelAr: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50 font-arabic text-end"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Placeholder Text</label>
                <input
                  type="text"
                  value={selectedField.placeholder || ''}
                  onChange={(e) => handleUpdateFieldProps(selectedField.id, { placeholder: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
                />
              </div>

              {/* Flex Grid Width Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Layout Width on Page</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md">
                  <button
                    type="button"
                    onClick={() => handleUpdateFieldProps(selectedField.id, { width: 'third' })}
                    className={`py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedField.width === 'third' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    33% Col
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateFieldProps(selectedField.id, { width: 'half' })}
                    className={`py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedField.width === 'half' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    50% Flex
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateFieldProps(selectedField.id, { width: 'full' })}
                    className={`py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      selectedField.width === 'full' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    100% Full
                  </button>
                </div>
              </div>

              {/* Required Switch */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-200">
                <span className="font-semibold text-slate-700">Mandatory Field</span>
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(e) => handleUpdateFieldProps(selectedField.id, { required: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
              </div>

              {/* Dropdown Options Editor */}
              {selectedField.type === 'select' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dropdown Options (Comma separated)</label>
                  <textarea
                    rows={3}
                    value={(selectedField.options || []).join(', ')}
                    onChange={(e) =>
                      handleUpdateFieldProps(selectedField.id, {
                        options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-md text-xs bg-slate-50"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              Click any field on the canvas to configure its layout width and options.
            </p>
          )}
        </div>
      </div>

      {/* BUILD FORM WITH AI MODAL */}
      {isAiFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  <Wand2 className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Build Admissions Form with AI</h3>
                  <p className="text-[11px] text-slate-500">Pick a preset or tell the AI what information you need to collect.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiFormModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                &times;
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Quick Presets:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateFormWithAi('Tajweed & Memorization Placement Test')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">🎙️ Tajweed Placement Test</div>
                  <div className="text-[10px] text-slate-500">Juz count, Makharij & Audio clip</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateFormWithAi('Full-Stack Developer Bootcamp Application')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">💻 Coding Bootcamp Application</div>
                  <div className="text-[10px] text-slate-500">GitHub, hours & career goals</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateFormWithAi('Tuition Assistance & Scholarship Request')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">🤝 Scholarship Request</div>
                  <div className="text-[10px] text-slate-500">Financial aid & family situation</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGenerateFormWithAi('Youth Summer Camp Registration')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-900">⛺ Summer Camp Registration</div>
                  <div className="text-[10px] text-slate-500">Emergency contacts & age group</div>
                </button>
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-800">Or Describe Your Custom Form Requirements</label>
              <input
                type="text"
                placeholder="e.g. Teacher Recruitment Form with CV Upload and Qira'at Certification"
                value={aiFormGoal}
                onChange={(e) => setAiFormGoal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAiFormModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleGenerateFormWithAi()}
                disabled={isGeneratingFormWithAi || !aiFormGoal.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center gap-2 disabled:opacity-50 select-none active:scale-95"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>{isGeneratingFormWithAi ? 'Generating Form Fields...' : 'Generate Form with AI'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
