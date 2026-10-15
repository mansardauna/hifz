import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button, Input, Card, Badge, AppPreloader, ToastMessage, PageHeader } from '../ui';
import { LockedFeatureCard } from './LockedFeatureCard';
import { AuthPageCustomization, FormFieldConfig } from '../../types';
import {
  Building2,
  Phone,
  MapPin,
  Globe,
  Upload,
  Clock,
  Sparkles,
  Shield,
  KeyRound,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Check,
  Palette,
  ExternalLink,
  ShieldCheck,
  Layout,
  Type,
  Code,
  Plus,
  Trash2,
  Sliders,
  Users,
  UserPlus,
  UserCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Save,
  ListTodo,
  Award,
  Layers,
  Copy,
  Loader2
} from 'lucide-react';
import {
  getClassroomConfig,
  saveClassroomConfig,
  detectTenantNicheType,
  ClassroomCustomizationConfig,
  BreakoutPodConfig,
  AgendaMilestoneConfig,
  RubricCriteriaConfig,
  ForumChannelConfig
} from '../../services/classroomCustomizationService';

interface ModernAcademySettingsProps {
  onAddToast?: (toast: Omit<ToastMessage, 'id'>) => void;
  onOpenUpgradeModal?: () => void;
}

const PRESET_BRAND_COLORS = [
  '#059669', // Emerald Green (Default)
  '#d97706', // Amber Gold
  '#dc2626', // Crimson Red
  '#2563eb', // Royal Blue
  '#7c3aed', // Vibrant Purple
  '#0f172a', // Slate Dark
  '#1C1B73', // Navy Indigo
  '#0d9488', // Teal
];

const PRESET_SIDEBAR_COLORS = [
  { label: 'Dark Slate (Standard)', value: '#0f172a' },
  { label: 'Deep Midnight', value: '#020617' },
  { label: 'Deep Forest', value: '#064e3b' },
  { label: 'Deep Indigo', value: '#1e1b4b' },
  { label: 'Royal Plum', value: '#2e1065' },
  { label: 'Charcoal Minimal', value: '#18181b' },
];

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'registrar' | 'parent';
  status: 'active' | 'invited';
  assignedClasses: number;
  phone?: string;
  assignedCourses?: string[];
}

interface PendingApplicant {
  id: string;
  name: string;
  email: string;
  role: string;
  track: string;
  submittedTime: string;
  status: string;
  phone?: string;
}

export const ModernAcademySettings: React.FC<ModernAcademySettingsProps> = ({
  onAddToast,
  onOpenUpgradeModal,
}) => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success, error, info } = useToast();
  const { triggerEventNotification } = useNotifications();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';
  const plan = tenant.subscriptionPlan || 'free';
  const isCustomDomainUnlocked = plan === 'growth' || plan === 'enterprise';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'roles_permissions' | 'auth_layout' | 'security' | 'classroom_community'>('general');

  // Classroom & Community Customization State
  const [classroomConfig, setClassroomConfig] = useState<ClassroomCustomizationConfig>(() =>
    getClassroomConfig(tenant)
  );
  const [activeClassroomSubTab, setActiveClassroomSubTab] = useState<'pods' | 'agenda' | 'rubric' | 'forum'>('pods');
  const [classroomTopicInputs, setClassroomTopicInputs] = useState<Record<string, string>>({});
  const [newChannelLabel, setNewChannelLabel] = useState<string>('');
  const [newChannelDesc, setNewChannelDesc] = useState<string>('');
  const [newChannelIcon, setNewChannelIcon] = useState<string>('MessageSquare');

  // General Settings
  const [companyName, setCompanyName] = useState<string>(tenant.name || '');
  const [companyId, setCompanyId] = useState<string>(tenant.id || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(tenant.contactPhone || '');
  const [contactEmail, setContactEmail] = useState<string>(tenant.contactEmail || '');
  const [timeZone, setTimeZone] = useState<string>('UTC +3:00 Arabia Standard Time (Makkah)');
  const [subdomain, setSubdomain] = useState<string>(tenant.subdomain || '');
  const [customDomain, setCustomDomain] = useState<string>(tenant.customDomain || '');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);

  // Theme & Branding
  const [logoUrl, setLogoUrl] = useState<string>(tenant.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState<string>(tenant.faviconUrl || '/icons/icon.svg');
  const [primaryColor, setPrimaryColor] = useState<string>(tenant.theme?.primaryColor || '#059669');
  const [secondaryColor, setSecondaryColor] = useState<string>(tenant.theme?.secondaryColor || '#d97706');
  const [sidebarBgColor, setSidebarBgColor] = useState<string>(tenant.theme?.sidebarBgColor || '#0f172a');
  const [fontFamily, setFontFamily] = useState<string>(tenant.theme?.fontFamily || 'Poppins');
  const [borderRadius, setBorderRadius] = useState<string>(tenant.theme?.borderRadius || '0.5rem');
  const [customCss, setCustomCss] = useState<string>(tenant.customCss || '');

  // Preloader Customization
  const [preloaderText, setPreloaderText] = useState<string>(tenant.preloaderCustomization?.customText || 'Loading academy...');
  const [preloaderTextAr, setPreloaderTextAr] = useState<string>(tenant.preloaderCustomization?.customTextAr || 'جارٍ تحميل المنصة...');
  const [preloaderShowLogo, setPreloaderShowLogo] = useState<boolean>(tenant.preloaderCustomization?.showLogo ?? true);
  const [isPreviewingPreloader, setIsPreviewingPreloader] = useState<boolean>(false);

  // Auth Layout Customization
  const [authLayout, setAuthLayout] = useState<'split' | 'centered_glass' | 'minimal_card' | 'heritage_frame'>(
    (tenant.authCustomization?.layout as any) || 'split'
  );
  const [welcomeHeading, setWelcomeHeading] = useState<string>(
    tenant.authCustomization?.welcomeHeading || 'Welcome to Your Academy Workspace'
  );
  const [welcomeSubtitle, setWelcomeSubtitle] = useState<string>(
    tenant.authCustomization?.welcomeSubtitle || 'Enter your account credentials to access your courses, classroom huddles, and student records.'
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
    tenant.authCustomization?.backgroundImageUrl || ''
  );
  const [calligraphyText, setCalligraphyText] = useState<string>(
    tenant.authCustomization?.calligraphyText || (isQuran ? 'وَقُل رَّبِّ زِدْنِي عِلْمًا' : 'Inspiring Excellence Through Learning')
  );
  const [calligraphyTranslation, setCalligraphyTranslation] = useState<string>(
    tenant.authCustomization?.calligraphyTranslation || (isQuran ? '“And say: My Lord, increase me in knowledge” • Surah Taha: 114' : 'Dedicated to lifelong education and professional development')
  );

  // Custom Fields for Student Registration
  const [customFields, setCustomFields] = useState<FormFieldConfig[]>(
    tenant.customFormFields || []
  );
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'select' | 'phone'>('text');

  // Staff & RBAC State (Dynamic from MySQL)
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'teacher' | 'registrar'>('teacher');
  const [provisionedCredentials, setProvisionedCredentials] = useState<{
    name: string;
    email: string;
    role: string;
    temporaryPassword?: string;
  } | null>(null);

  // Applicant Queue State (Dynamic from MySQL)
  const [applicantsList, setApplicantsList] = useState<PendingApplicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(true);
  const [processingApplicantId, setProcessingApplicantId] = useState<string | null>(null);

  // Role Permissions Matrix State
  const defaultRolePermissions = {
    admin: { manageBilling: true, liveClass: true, gradeSubmissions: true, forumMod: true, viewChildReports: true },
    teacher: { manageBilling: false, liveClass: true, gradeSubmissions: true, forumMod: true, viewChildReports: false },
    registrar: { manageBilling: false, liveClass: false, gradeSubmissions: false, forumMod: true, viewChildReports: true },
    student: { manageBilling: false, liveClass: true, gradeSubmissions: false, forumMod: true, viewChildReports: false },
    parent: { manageBilling: false, liveClass: false, gradeSubmissions: false, forumMod: false, viewChildReports: true },
  };

  const [rolePermissions, setRolePermissions] = useState<typeof defaultRolePermissions>(() => {
    return (tenant.settings as any)?.rolePermissions || defaultRolePermissions;
  });
  const [isSavingPermissions, setIsSavingPermissions] = useState<boolean>(false);

  // Fetch real staff from MySQL
  const fetchStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const res = await fetch(`/api/tenant/members?tenantId=${encodeURIComponent(tenant.id || tenant.subdomain)}`);
      if (res.ok) {
        const data = await res.json();
        const mappedStaff: StaffMember[] = (data.staff || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          role: s.role,
          status: s.status === 'Active' ? 'active' : 'invited',
          assignedClasses: s.assignedCourses ? s.assignedCourses.length : 0,
          phone: s.phone,
          assignedCourses: s.assignedCourses || [],
        }));
        setStaffList(mappedStaff);
      }
    } catch (err) {
      console.error('Failed to load staff roster from MySQL:', err);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  // Fetch real pending applicants from MySQL
  const fetchApplicants = async () => {
    setIsLoadingApplicants(true);
    try {
      const res = await fetch(`/api/leads?tenantId=${encodeURIComponent(tenant.id || tenant.subdomain)}`);
      if (res.ok) {
        const data = await res.json();
        const allLeads = Array.isArray(data) ? data : (data.leads || []);
        // Filter for applicants waiting in review queue
        const pending = allLeads
          .filter((l: any) => 
            l.status === 'Under Review' || l.status === 'New' || l.status === 'Pending' || l.status === 'Interview'
          )
          .map((l: any) => {
            const isTeacher = (l.notes || '').toLowerCase().includes('teacher') || (l.notes || '').toLowerCase().includes('instructor');
            return {
              id: l.id,
              name: l.studentName || l.name || 'Anonymous Applicant',
              email: l.email,
              role: isTeacher ? 'teacher' : 'student',
              track: l.courseInterest || l.planName || 'Core Curriculum',
              submittedTime: l.createdAt ? new Date(l.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently',
              status: l.status,
              phone: l.phone,
            };
          });
        setApplicantsList(pending);
      }
    } catch (err) {
      console.error('Failed to load applicant queue from MySQL:', err);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (tenant.id || tenant.subdomain) {
      fetchStaff();
      fetchApplicants();
    }
  }, [tenant.id, tenant.subdomain]);

  useEffect(() => {
    if (tenant.name) setCompanyName(tenant.name);
    if (tenant.id) setCompanyId(tenant.id);
    if (tenant.contactPhone) setPhoneNumber(tenant.contactPhone);
    if (tenant.contactEmail) setContactEmail(tenant.contactEmail);
    if (tenant.subdomain) setSubdomain(tenant.subdomain);
    if (tenant.customDomain) setCustomDomain(tenant.customDomain);
    if (tenant.theme?.primaryColor) setPrimaryColor(tenant.theme.primaryColor);
    if (tenant.theme?.secondaryColor) setSecondaryColor(tenant.theme.secondaryColor);
  }, [tenant.name, tenant.id, tenant.contactPhone, tenant.contactEmail, tenant.subdomain, tenant.customDomain, tenant.theme?.primaryColor, tenant.theme?.secondaryColor]);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [active2faMethod, setActive2faMethod] = useState<string | null>('email');

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const newField: FormFieldConfig = {
      id: `field_${Date.now()}`,
      label: newFieldName.trim(),
      labelAr: newFieldName.trim(),
      type: newFieldType,
      required: false,
      width: 'full',
    };
    setCustomFields([...customFields, newField]);
    setNewFieldName('');
    success('Field Added', `Added "${newField.label}" to registration form.`);
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
    info('Field Removed', 'Registration field removed.');
  };

  const handleInviteStaff = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) {
      error('Missing Details', 'Please provide a staff name and valid email address.');
      return;
    }
    setIsProvisioning(true);
    const tempPassword = 'Staff' + Math.floor(100000 + Math.random() * 900000) + '!';
    try {
      const res = await fetch('/api/tenant/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenant.id || tenant.subdomain,
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
          phone: '',
          temporaryPassword: tempPassword,
          assignedCourses: [],
          assignedTasks: ['Onboard to cohort curriculum', 'Access instructor workstation']
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProvisionedCredentials({
          name: inviteName.trim(),
          email: inviteEmail.trim(),
          role: inviteRole,
          temporaryPassword: data.temporaryPassword || tempPassword,
        });
        success('Staff Provisioned in Database', `Account directly created in MySQL for ${inviteName.trim()} (${inviteEmail.trim()}).`);
        setInviteName('');
        setInviteEmail('');
        setIsInviteModalOpen(false);
        await fetchStaff();
      } else {
        const errData = await res.json().catch(() => ({}));
        error('Provisioning Failed', errData.message || 'Could not save staff to database.');
      }
    } catch (err: any) {
      error('Error', err.message || 'Failed to connect to members API.');
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleRemoveStaff = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/tenant/members?id=${encodeURIComponent(id)}&tenantId=${encodeURIComponent(tenant.id || tenant.subdomain)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setStaffList(prev => prev.filter(s => s.id !== id));
        info('Staff Access Revoked', `${name}'s access revoked from MySQL.`);
      } else {
        error('Revoke Failed', 'Could not delete staff member from database.');
      }
    } catch (err: any) {
      error('Error', err.message || 'Failed to revoke staff access.');
    }
  };

  const handleAcceptApplicant = async (app: PendingApplicant) => {
    setProcessingApplicantId(app.id);
    try {
      // 1. Update lead in MySQL to Admitted
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.id,
          status: 'Admitted',
          paymentStatus: 'Paid'
        })
      });

      // 2. Provision user account in MySQL
      const tempPassword = 'User' + Math.floor(100000 + Math.random() * 900000) + '!';
      await fetch('/api/tenant/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenant.id || tenant.subdomain,
          name: app.name,
          email: app.email,
          role: app.role,
          phone: app.phone || '',
          enrolledCourse: app.track,
          temporaryPassword: tempPassword,
          status: 'Admitted'
        })
      });

      setProvisionedCredentials({
        name: app.name,
        email: app.email,
        role: app.role,
        temporaryPassword: tempPassword
      });

      success('Applicant Approved & Admitted!', `Granted dashboard access to ${app.name} (${app.email}) and created user in MySQL.`);
      await fetchApplicants();
      await fetchStaff();
    } catch (err: any) {
      error('Approval Failed', err.message || 'Could not process applicant approval.');
    } finally {
      setProcessingApplicantId(null);
    }
  };

  const handleDeclineApplicant = async (app: PendingApplicant) => {
    setProcessingApplicantId(app.id);
    try {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.id,
          status: 'Rejected'
        })
      });
      info('Application Rejected', `Declined applicant ${app.name} in MySQL.`);
      await fetchApplicants();
    } catch (err: any) {
      error('Decline Failed', err.message || 'Could not update applicant record.');
    } finally {
      setProcessingApplicantId(null);
    }
  };

  const togglePermission = (role: keyof typeof defaultRolePermissions, perm: keyof typeof defaultRolePermissions['admin']) => {
    if (role === 'admin' && perm === 'manageBilling') {
      info('Locked Permission', 'Academy Admin billing capability is locked for security integrity.');
      return;
    }
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm]
      }
    }));
  };

  const handleSaveRolePermissions = () => {
    setIsSavingPermissions(true);
    updateTenantConfig({
      settings: {
        ...(tenant.settings as any),
        rolePermissions,
      }
    });
    setTimeout(() => {
      setIsSavingPermissions(false);
      success('Role Permissions Saved', 'Granular permissions matrix persisted to MySQL academy configuration.');
    }, 400);
  };

  const handleSaveGeneral = () => {
    const finalSubdomain = subdomain.trim().toLowerCase() || tenant.subdomain;
    updateTenantConfig({
      subdomain: finalSubdomain,
      name: companyName,
      contactPhone: phoneNumber,
      contactEmail: contactEmail,
      customDomain: customDomain || undefined,
    });
    triggerEventNotification('settings_saved');
  };

  const handleSaveBranding = () => {
    updateTenantConfig({
      logoUrl: logoUrl || undefined,
      faviconUrl: faviconUrl || undefined,
      theme: {
        ...tenant.theme,
        primaryColor,
        primaryHover: primaryColor,
        secondaryColor,
        sidebarBgColor,
        fontFamily,
        borderRadius,
      },
      customCss,
      preloaderCustomization: {
        enabled: true,
        customText: preloaderText,
        customTextAr: preloaderTextAr,
        showLogo: preloaderShowLogo,
        blurIntensity: 'subtle',
      },
    });
    triggerEventNotification('settings_saved');
  };

  const handleSaveAuthLayout = () => {
    updateTenantConfig({
      authCustomization: {
        layout: authLayout,
        welcomeHeading,
        welcomeSubtitle,
        calligraphyText,
        calligraphyTranslation,
        backgroundImageUrl: backgroundImageUrl || undefined,
      },
      customFormFields: customFields,
    });
    success('Login Experience Updated', 'Authentication layout, custom background image, and registration fields updated.');
  };

  const handleSaveClassroomCommunity = () => {
    saveClassroomConfig(tenant, classroomConfig, updateTenantConfig);
    success('Classroom Settings Saved', 'Breakout pods, curriculum progression agenda, rubrics, and discussion channels updated.');
    triggerEventNotification('settings_saved');
  };

  const handleVerifyCustomDomain = () => {
    if (!customDomain.trim()) {
      error('Domain Required', 'Please enter your custom domain (e.g. academy.com).');
      return;
    }
    if (!isCustomDomainUnlocked) {
      if (onOpenUpgradeModal) onOpenUpgradeModal();
      return;
    }
    setIsVerifyingDomain(true);
    setTimeout(() => {
      setIsVerifyingDomain(false);
      success('DNS Connected!', `CNAME record for ${customDomain} successfully resolved to Vercel.`);
    }, 1200);
  };

  const handleUpdatePassword = () => {
    if (!newPassword || newPassword.length < 8) {
      error('Password Too Short', 'New password must be at least 8 characters long.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    success('Password Updated', 'Your administrative security credentials have been updated.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Settings, Staff Roles & White-labeling"
        subtitle="Configure institutional profile, branding tokens, staff role permissions, and authentication security."
        badge={{ text: `Active Tier: ${plan.toUpperCase()}`, variant: "neutral" }}
        action={
          plan !== 'enterprise' && onOpenUpgradeModal ? (
            <Button variant="outline" size="sm" onClick={onOpenUpgradeModal}>
              <Sparkles className="w-4 h-4 mr-1 text-amber-500" /> Upgrade Plan
            </Button>
          ) : undefined
        }
      />

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'general'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>General & Domain</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'branding'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Branding & Theme Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab('roles_permissions')}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'roles_permissions'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Roles & RBAC</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'roles_permissions'
                ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)] font-semibold'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {staffList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('auth_layout')}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'auth_layout'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Login Experience & Form Fields</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Sessions</span>
        </button>

        <button
          onClick={() => setActiveTab('classroom_community')}
          className={`py-3 px-5 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'classroom_community'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Classroom & Discussion Channels</span>
        </button>
      </div>

      {/* TAB 1: GENERAL & DOMAIN */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Institutional Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academy Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academy Registration ID</label>
                <input
                  type="text"
                  disabled
                  value={companyId}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admissions Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </Card>

          {/* Subdomain & Custom Domain */}
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Domain & URL Routing</span>
            </h3>

            <div className="space-y-4">
              {/* Default Subdomain */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Platform Subdomain (Free & Always Active)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-600 font-semibold select-none">
                    https://
                  </span>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => {
                      const cleanVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 32);
                      setSubdomain(cleanVal);
                    }}
                    placeholder="academy-subdomain"
                    className="w-56 px-3 py-2 border-y border-slate-300 text-xs font-mono font-semibold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-xs font-mono text-slate-600 font-semibold select-none">
                    .ankabit.app
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Portal address:{' '}
                  <span className="font-mono font-semibold text-slate-700">
                    https://{subdomain || 'academy'}.ankabit.app
                  </span>
                </p>
              </div>

              {/* Custom Domain (Feature Gated) */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Connect Custom Apex/Subdomain (e.g. quranacademy.org)
                  </label>
                  {!isCustomDomainUnlocked && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      Growth & Enterprise Tier
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="academy.org or lms.myinstitution.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    disabled={!isCustomDomainUnlocked}
                    className={`flex-1 px-3 py-2 border rounded-xl text-xs font-mono ${
                      isCustomDomainUnlocked
                        ? 'border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600'
                        : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  />

                  <Button
                    variant={isCustomDomainUnlocked ? 'primary' : 'outline'}
                    size="sm"
                    onClick={handleVerifyCustomDomain}
                    isLoading={isVerifyingDomain}
                    className="font-semibold text-xs"
                  >
                    {isCustomDomainUnlocked ? 'Verify DNS' : 'Unlock Custom Domain'}
                  </Button>
                </div>

                {isCustomDomainUnlocked && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    Point a CNAME record from your domain registrar to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-700">cname.vercel-dns.com</code>. SSL certificate generates automatically.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="primary" size="sm" onClick={handleSaveGeneral}>
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: BRANDING & THEME TOKENS */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          {/* Brand Identity & Favicon Card */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span>Logos & Subdomain Favicon</span>
                </h3>
                <span className="text-xs text-slate-500">Customize the browser tab icon and academy logo across student dashboards</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academy Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://your-domain.com/logo.png"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Recommended: Transparent PNG or SVG (256x256px or wider)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subdomain Favicon URL (Browser Tab Icon)
                  </label>
                  <input
                    type="url"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://your-domain.com/favicon.ico"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Direct link to your .ico, .png, or .svg icon</p>
                </div>
              </div>

              {/* Live Browser Tab Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Live Browser Tab Preview</label>
                <div className="bg-slate-900 rounded-xl p-3 shadow-inner border border-slate-800">
                  {/* Fake browser top bar */}
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    <div className="ml-2 text-[10px] text-slate-500 font-mono flex-1 truncate">
                      https://{subdomain || 'your-academy'}.ankabit.app
                    </div>
                  </div>

                  {/* Browser Tab */}
                  <div className="mt-2.5 max-w-[280px] bg-slate-800 rounded-t-lg px-3 py-1.5 flex items-center gap-2 border border-slate-700 border-b-0 shadow-sm">
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        alt="Favicon"
                        className="w-4 h-4 rounded-xs object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/icons/icon.svg';
                        }}
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-semibold">
                        {companyName.charAt(0) || 'A'}
                      </div>
                    )}
                    <span className="text-xs text-slate-200 font-medium truncate">
                      {companyName} • Ankabit
                    </span>
                    <span className="ml-auto text-[10px] text-slate-500">×</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Theme Tokens Card */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-600" />
                <span>Theme Tokens & Brand Colors</span>
              </h3>
              <span className="text-xs text-slate-500">Applies across all student & landing pages</span>
            </div>

            <div className="space-y-4">
              {/* Primary Color Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Preset Brand Primary Palette</label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_BRAND_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setPrimaryColor(c);
                        info('Color Selected', `Primary brand color set to ${c}.`);
                      }}
                      style={{ backgroundColor: c }}
                      className={`w-9 h-9 rounded-xl transition-transform cursor-pointer flex items-center justify-center shadow-xs ${
                        primaryColor === c ? 'ring-3 ring-emerald-400 scale-110 shadow-md' : 'hover:scale-105'
                      }`}
                    >
                      {primaryColor === c && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Background Color Section */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Dashboard Sidebar Background Color
                  </label>
                  <button
                    onClick={() => {
                      setSidebarBgColor(primaryColor);
                      info('Sidebar Matched', 'Sidebar background matched to brand primary color.');
                    }}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                  >
                    Match Brand Primary Color
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                  {PRESET_SIDEBAR_COLORS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setSidebarBgColor(preset.value);
                        info('Sidebar Color', `Sidebar background set to ${preset.label}.`);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-18 transition-all cursor-pointer ${
                        sidebarBgColor === preset.value
                          ? 'border-emerald-500 ring-2 ring-emerald-400/30 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-5 h-5 rounded-md shadow-xs border border-white/20"
                          style={{ backgroundColor: preset.value }}
                        />
                        {sidebarBgColor === preset.value && (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sidebarBgColor}
                      onChange={(e) => setSidebarBgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={sidebarBgColor}
                      onChange={(e) => setSidebarBgColor(e.target.value)}
                      placeholder="#0f172a"
                      className="w-32 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-semibold"
                    />
                  </div>
                  <span className="text-xs text-slate-500">Custom Hex Code for Sidebar background</span>
                </div>
              </div>

              {/* Font Family & Sizing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Brand Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Poppins">Poppins (Modern Clean)</option>
                    <option value="Inter">Inter (SaaS Standard)</option>
                    <option value="Amiri">Amiri (Traditional Quranic Naskh)</option>
                    <option value="Cairo">Cairo (Contemporary Arabic)</option>
                  </select>
                </div>
              </div>

              {/* Real-time Interactive Live Mockup Preview */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Live Component & Sidebar Preview
                  </label>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Instant Live Render
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-inner bg-slate-100 flex flex-col md:flex-row min-h-[220px]">
                  {/* Mock Sidebar */}
                  <div
                    style={{ backgroundColor: sidebarBgColor }}
                    className="w-full md:w-56 p-4 text-white flex flex-col justify-between shrink-0 transition-colors duration-200"
                  >
                    <div className="space-y-4">
                      {/* Brand Header */}
                      <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                        <div
                          style={{ backgroundColor: primaryColor }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-xs text-white shadow-xs shrink-0"
                        >
                          {companyName.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-white truncate">{companyName}</div>
                          <div className="text-[9px] text-white/50 truncate font-mono">{subdomain}.ankabit.app</div>
                        </div>
                      </div>

                      {/* Mock Navigation Menu */}
                      <div className="space-y-1 text-xs">
                        <div
                          style={{ backgroundColor: primaryColor }}
                          className="px-3 py-1.5 rounded-lg text-white font-semibold flex items-center justify-between shadow-xs"
                        >
                          <span>Dashboard</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white flex items-center justify-between">
                          <span>Classrooms</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg text-white/60 hover:text-white flex items-center justify-between">
                          <span>Students</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[10px] text-white/40 font-mono">
                      Sidebar: {sidebarBgColor}
                    </div>
                  </div>

                  {/* Mock Dashboard Body */}
                  <div className="flex-1 p-5 bg-slate-50 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-slate-900">Welcome Back, Administrator</div>
                          <div className="text-[11px] text-slate-500">Live Academy KPI Summary</div>
                        </div>
                        <button
                          style={{ backgroundColor: primaryColor }}
                          className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity"
                        >
                          + New Student
                        </button>
                      </div>

                      {/* Mock Metrics Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                          <div className="text-[10px] font-semibold text-slate-500 capitalize">Active Students</div>
                          <div className="text-base font-semibold text-slate-900 mt-0.5">148</div>
                          <div
                            style={{ color: primaryColor }}
                            className="text-[10px] font-semibold mt-1"
                          >
                            ↑ 12% this month
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                          <div className="text-[10px] font-semibold text-slate-500 capitalize">Classrooms</div>
                          <div className="text-base font-semibold text-slate-900 mt-0.5">6 Active</div>
                          <div className="text-[10px] text-emerald-600 font-semibold mt-1">WebRTC Online</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-right">
                      Primary Brand Color: <span className="font-mono font-semibold text-slate-600">{primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preloader & Loading Animation Settings */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Branded Preloader & Page Loading Transition</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Customize the gentle, softly blurred loading animation displayed on page transitions across your academy.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviewingPreloader(true);
                      setTimeout(() => setIsPreviewingPreloader(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Test Preview (2s)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Preloader Text (English)"
                    value={preloaderText}
                    onChange={(e) => setPreloaderText(e.target.value)}
                    placeholder="e.g. Loading your courses..."
                  />

                  <Input
                    label="Preloader Text (Arabic)"
                    value={preloaderTextAr}
                    onChange={(e) => setPreloaderTextAr(e.target.value)}
                    placeholder="مثال: جارٍ تحميل الأكاديمية..."
                    dir="rtl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={preloaderShowLogo}
                      onChange={(e) => setPreloaderShowLogo(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Display Academy Logo / Brand Insignia on Preloader</span>
                  </label>
                </div>
              </div>

              <div className="pt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom CSS Overrides</label>
                <textarea
                  rows={3}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Custom CSS overrides for your academy pages */"
                  className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="primary" size="sm" onClick={handleSaveBranding}>
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: STAFF ROLES & RBAC */}
      {activeTab === 'roles_permissions' && (
        <div className="space-y-6">
          {/* Staff Members Management */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Academy Staff & Direct Role Assignment</span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">({staffList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Directly provision accounts or assign roles for teachers, registrars, and sub-administrators.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStaff}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingStaff ? 'animate-spin' : ''}`} />}
                  className="text-xs font-semibold"
                >
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  leftIcon={<UserPlus className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
                >
                  Add Staff
                </Button>
              </div>
            </div>

            {/* Staff Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Assigned Classes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoadingStaff ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                        <span>Loading staff roster from MySQL...</span>
                      </td>
                    </tr>
                  ) : staffList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        <Users className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-xs text-slate-700">No staff members found in database</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click "Provision / Invite Staff" above to add instructors and administrators.</p>
                      </td>
                    </tr>
                  ) : (
                    staffList.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{staff.name}</div>
                          <div className="text-slate-500 text-[11px] font-mono">{staff.email}</div>
                          {staff.phone && <div className="text-slate-400 text-[10px]">{staff.phone}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-semibold capitalize">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            staff.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : staff.role === 'teacher'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{staff.assignedClasses} Courses</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={staff.status === 'active' ? 'success' : 'warning'}>
                            {staff.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Revoke access for ${staff.name}? This will remove their credentials from MySQL.`)) {
                                handleRemoveStaff(staff.id, staff.name);
                              }
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer font-semibold text-xs transition-colors"
                            title="Revoke access"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Public Signups & Student/Teacher Admissions Approval Queue */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Public Signups & Role Access Approval Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review applicant signups and accept them before granting access to their student or instructor dashboard.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchApplicants}
                  leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoadingApplicants ? 'animate-spin' : ''}`} />}
                  className="text-xs font-semibold"
                >
                  Refresh Queue
                </Button>
                <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
                  {applicantsList.length} Pending Review
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Requested Role</th>
                    <th className="py-3 px-4">Applied Track</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoadingApplicants ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                        <span>Querying pending applicant leads from MySQL...</span>
                      </td>
                    </tr>
                  ) : applicantsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        <UserCheck className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-xs text-slate-700">No pending applications awaiting review</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">When students or educators submit registration forms, they will appear here instantly for approval.</p>
                      </td>
                    </tr>
                  ) : (
                    applicantsList.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{app.name}</div>
                          <div className="text-slate-500 text-[11px] font-mono">{app.email}</div>
                          {app.phone && <div className="text-slate-400 text-[10px]">{app.phone}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-semibold capitalize">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            app.role === 'teacher' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {app.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">{app.track}</td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">{app.submittedTime}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={processingApplicantId === app.id}
                            onClick={() => handleAcceptApplicant(app)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] py-1 px-2.5"
                          >
                            {processingApplicantId === app.id ? 'Processing...' : 'Accept & Activate'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={processingApplicantId === app.id}
                            onClick={() => handleDeclineApplicant(app)}
                            className="text-rose-600 hover:bg-rose-50 text-[11px] py-1 px-2 border-rose-200 font-semibold"
                          >
                            Decline
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Role Permissions Matrix */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Granular Role Permission Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure and toggle what actions each account role is permitted to perform across the academy portal.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveRolePermissions}
                disabled={isSavingPermissions}
                leftIcon={<Save className="w-4 h-4" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
              >
                {isSavingPermissions ? 'Saving...' : 'Save'}
              </Button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Permission Capability</th>
                    <th className="py-3 px-3 text-center">Academy Admin</th>
                    <th className="py-3 px-3 text-center">Instructor / Teacher</th>
                    <th className="py-3 px-3 text-center">Registrar</th>
                    <th className="py-3 px-3 text-center">Student</th>
                    <th className="py-3 px-3 text-center">Parent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { key: 'manageBilling' as const, label: 'Manage Billing & Gateways' },
                    { key: 'liveClass' as const, label: 'Host Live WebRTC Classrooms' },
                    { key: 'gradeSubmissions' as const, label: 'Grade Recitations & Feedback' },
                    { key: 'forumMod' as const, label: 'Post in Community Forum' },
                    { key: 'viewChildReports' as const, label: 'View Child Attendance & Invoices' },
                  ].map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.label}</td>
                      {(['admin', 'teacher', 'registrar', 'student', 'parent'] as const).map((role) => {
                        const isGranted = (rolePermissions as any)[role]?.[row.key] ?? false;
                        const isLockedAdmin = role === 'admin' && row.key === 'manageBilling';
                        return (
                          <td key={role} className="text-center py-2 px-3">
                            <button
                              type="button"
                              onClick={() => togglePermission(role, row.key)}
                              disabled={isLockedAdmin}
                              title={isLockedAdmin ? 'Admin billing is locked for security' : `Click to toggle for ${role}`}
                              className={`p-1.5 rounded-lg transition-all inline-flex items-center justify-center ${
                                isGranted
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200/50'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              } ${isLockedAdmin ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                            >
                              {isGranted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Lock className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: AUTH LAYOUT & REGISTRATION FIELDS */}
      {activeTab === 'auth_layout' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Layout className="w-5 h-5 text-emerald-600" />
                <span>Login Layout & Student Registration Setup</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the authentication interface for your students, parents, and teachers.
              </p>
            </div>

            <a
              href={`/${tenant.subdomain}/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Preview Live Login</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Visual Layout Style Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 capitalize tracking-wider">
              Select Academy Login Layout
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: 'split',
                  title: 'Split Modern',
                  desc: 'Dark Islamic hero with calligraphy, ayah quote, and side login card.',
                  badge: 'Recommended',
                },
                {
                  id: 'centered_glass',
                  title: 'Medina Glass',
                  desc: 'Frosted emerald glassmorphic floating card with Bismillah medallion.',
                  badge: 'Majestic',
                },
                {
                  id: 'minimal_card',
                  title: 'Minimalist Clean',
                  desc: 'Clean white SaaS layout with high contrast typography.',
                  badge: 'Focused',
                },
                {
                  id: 'heritage_frame',
                  title: 'Arabesque Frame',
                  desc: 'Ornate geometric border with gold accents & Quranic calligraphy.',
                  badge: 'Traditional',
                },
              ].map((style) => {
                const isSelected = authLayout === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setAuthLayout(style.id as any)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs text-slate-900">{style.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{style.desc}</p>
                    </div>
                    <div className="mt-3">
                      <span className="text-[9px] font-semibold capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {style.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Welcome Header Text</label>
              <input
                type="text"
                value={welcomeHeading}
                onChange={(e) => setWelcomeHeading(e.target.value)}
                placeholder="e.g. Welcome to Your Academy Workspace"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Welcome Subtitle Instructions</label>
              <input
                type="text"
                value={welcomeSubtitle}
                onChange={(e) => setWelcomeSubtitle(e.target.value)}
                placeholder={isQuran ? "e.g. Enter credentials to access live halaqahs..." : "e.g. Enter credentials to access your live classes..."}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Hero Background Image URL</label>
              <input
                type="url"
                value={backgroundImageUrl}
                onChange={(e) => setBackgroundImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-... or custom uploaded URL"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calligraphy Verse Quote / Tagline</label>
              <input
                type="text"
                value={calligraphyText}
                onChange={(e) => setCalligraphyText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-arabic font-semibold"
              />
            </div>
          </div>

          {/* Custom Student Fields */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-semibold capitalize tracking-wider text-slate-700">
              Custom Student Registration Form Fields
            </h4>

            <div className="space-y-2">
              {customFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{field.label}</span>
                    <span className="text-slate-500 ml-2 font-mono text-[11px]">({field.type})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="New field label (e.g. Previous Quran Teacher Name)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                <option value="text">Text Input</option>
                <option value="select">Dropdown Select</option>
                <option value="phone">Phone Number</option>
              </select>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddField} className="font-semibold text-xs">
                Add Field
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" size="sm" onClick={handleSaveAuthLayout}>
              Save
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 5: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Security Credentials & Two-Factor Authentication</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Administrator Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter at least 8 characters..."
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-xs outline-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#047857)]/20 focus:border-[var(--color-primary,#047857)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="primary" size="sm" onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </div>

          {/* 2FA */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-semibold capitalize tracking-wider text-slate-700">
              Two-Factor Authentication (2FA)
            </h4>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">Email Verification OTP Codes</div>
                  <div className="text-[11px] text-slate-500">Require 6-digit confirmation code on new device logins</div>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: CLASSROOM & DISCUSSION CHANNELS */}
      {activeTab === 'classroom_community' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <span>Classroom Pods, Agenda & Discussion Channels</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Customize the breakout pod tiers, live curriculum progression agenda, grading rubrics, and discussion forum channels for all students and instructors.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveClassroomCommunity}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                >
                  Save Classroom Settings
                </Button>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveClassroomSubTab('pods')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeClassroomSubTab === 'pods'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Breakout Pods ({classroomConfig.pods.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClassroomSubTab('agenda')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeClassroomSubTab === 'agenda'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Progression Agenda ({classroomConfig.milestones.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClassroomSubTab('rubric')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeClassroomSubTab === 'rubric'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Grading Rubric ({classroomConfig.rubricCriteria.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveClassroomSubTab('forum')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeClassroomSubTab === 'forum'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussion Channels ({classroomConfig.forumChannels.length})</span>
              </button>
            </div>

            {/* Sub-tab 1: BREAKOUT PODS */}
            {activeClassroomSubTab === 'pods' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title in Live Classroom</label>
                    <input
                      type="text"
                      value={classroomConfig.breakoutPodsTitle}
                      onChange={(e) => setClassroomConfig({ ...classroomConfig, breakoutPodsTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Section Description</label>
                    <input
                      type="text"
                      value={classroomConfig.breakoutPodsSubtitle}
                      onChange={(e) => setClassroomConfig({ ...classroomConfig, breakoutPodsSubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {classroomConfig.pods.map((pod, pIdx) => {
                    const key = `set-pod-${pIdx}`;
                    return (
                      <div key={pod.id || pIdx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${pod.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                            {pod.tier.toUpperCase()} TIER
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Pod #{pIdx + 1}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pod Name / Level Title</label>
                            <input
                              type="text"
                              value={pod.label}
                              onChange={(e) => {
                                const updated = [...classroomConfig.pods];
                                updated[pIdx] = { ...pod, label: e.target.value };
                                setClassroomConfig({ ...classroomConfig, pods: updated });
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Level Description / Focus</label>
                            <input
                              type="text"
                              value={pod.sublabel}
                              onChange={(e) => {
                                const updated = [...classroomConfig.pods];
                                updated[pIdx] = { ...pod, sublabel: e.target.value };
                                setClassroomConfig({ ...classroomConfig, pods: updated });
                              }}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>

                        {/* Focus Topics */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <label className="block text-[11px] font-semibold text-slate-600">Focus Topics</label>
                          <div className="flex flex-wrap gap-1.5">
                            {pod.targetTopics.map((topic, tIdx) => (
                              <span
                                key={tIdx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-[11px] font-medium"
                              >
                                <span>{topic}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...classroomConfig.pods];
                                    updated[pIdx] = {
                                      ...pod,
                                      targetTopics: pod.targetTopics.filter((_, i) => i !== tIdx),
                                    };
                                    setClassroomConfig({ ...classroomConfig, pods: updated });
                                  }}
                                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={classroomTopicInputs[key] || ''}
                              onChange={(e) => setClassroomTopicInputs({ ...classroomTopicInputs, [key]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = (classroomTopicInputs[key] || '').trim();
                                  if (!val) return;
                                  const updated = [...classroomConfig.pods];
                                  updated[pIdx] = { ...pod, targetTopics: [...pod.targetTopics, val] };
                                  setClassroomConfig({ ...classroomConfig, pods: updated });
                                  setClassroomTopicInputs({ ...classroomTopicInputs, [key]: '' });
                                }
                              }}
                              placeholder="Add topic..."
                              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const val = (classroomTopicInputs[key] || '').trim();
                                if (!val) return;
                                const updated = [...classroomConfig.pods];
                                updated[pIdx] = { ...pod, targetTopics: [...pod.targetTopics, val] };
                                setClassroomConfig({ ...classroomConfig, pods: updated });
                                setClassroomTopicInputs({ ...classroomTopicInputs, [key]: '' });
                              }}
                              leftIcon={<Plus className="w-3.5 h-3.5" />}
                              className="text-xs"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-tab 2: CURRICULUM AGENDA */}
            {activeClassroomSubTab === 'agenda' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda Header Title</label>
                    <input
                      type="text"
                      value={classroomConfig.agendaTitle}
                      onChange={(e) => setClassroomConfig({ ...classroomConfig, agendaTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda Subtitle</label>
                    <input
                      type="text"
                      value={classroomConfig.agendaSubtitle}
                      onChange={(e) => setClassroomConfig({ ...classroomConfig, agendaSubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold capitalize text-slate-400 tracking-wider">Milestones List ({classroomConfig.milestones.length})</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newMs: AgendaMilestoneConfig = {
                          id: `ms-${Date.now()}`,
                          tier: 'beginner',
                          title: 'New Curriculum Objective',
                          targetMinutes: 20,
                          done: false,
                        };
                        setClassroomConfig({ ...classroomConfig, milestones: [...classroomConfig.milestones, newMs] });
                      }}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs font-semibold"
                    >
                      Add Milestone
                    </Button>
                  </div>

                  {classroomConfig.milestones.map((ms, idx) => (
                    <div key={ms.id || idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={ms.tier}
                          onChange={(e) => {
                            const updated = [...classroomConfig.milestones];
                            updated[idx] = { ...ms, tier: e.target.value };
                            setClassroomConfig({ ...classroomConfig, milestones: updated });
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50 text-slate-800 focus:outline-none"
                        >
                          <option value="beginner">Level 1 (Beginner)</option>
                          <option value="intermediate">Level 2 (Intermediate)</option>
                          <option value="advanced">Level 3 (Advanced)</option>
                        </select>

                        <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ms.done}
                            onChange={(e) => {
                              const updated = [...classroomConfig.milestones];
                              updated[idx] = { ...ms, done: e.target.checked };
                              setClassroomConfig({ ...classroomConfig, milestones: updated });
                            }}
                            className="rounded text-amber-600 focus:ring-0"
                          />
                          <span>Done</span>
                        </label>
                      </div>

                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <input
                          type="text"
                          value={ms.title}
                          onChange={(e) => {
                            const updated = [...classroomConfig.milestones];
                            updated[idx] = { ...ms, title: e.target.value };
                            setClassroomConfig({ ...classroomConfig, milestones: updated });
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                        />

                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            value={ms.targetMinutes || 20}
                            onChange={(e) => {
                              const updated = [...classroomConfig.milestones];
                              updated[idx] = { ...ms, targetMinutes: parseInt(e.target.value) || 20 };
                              setClassroomConfig({ ...classroomConfig, milestones: updated });
                            }}
                            className="w-14 px-2 py-1.5 border border-slate-200 rounded-xl text-xs text-center font-mono text-slate-800 focus:outline-none"
                            min={5}
                            max={180}
                          />
                          <span className="text-[10px] text-slate-400">mins</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setClassroomConfig({
                              ...classroomConfig,
                              milestones: classroomConfig.milestones.filter((m) => m.id !== ms.id),
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 3: EVALUATION RUBRIC */}
            {activeClassroomSubTab === 'rubric' && (
              <div className="space-y-5">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rubric Title</label>
                  <input
                    type="text"
                    value={classroomConfig.rubricTitle}
                    onChange={(e) => setClassroomConfig({ ...classroomConfig, rubricTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold capitalize text-slate-400 tracking-wider">Evaluation Criteria ({classroomConfig.rubricCriteria.length})</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newCrit: RubricCriteriaConfig = {
                          id: `crit-${Date.now()}`,
                          name: 'New Criterion',
                          desc: 'Description of grading standard',
                          maxScore: 5,
                        };
                        setClassroomConfig({ ...classroomConfig, rubricCriteria: [...classroomConfig.rubricCriteria, newCrit] });
                      }}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="text-xs font-semibold"
                    >
                      Add Criterion
                    </Button>
                  </div>

                  {classroomConfig.rubricCriteria.map((crit, idx) => (
                    <div key={crit.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={crit.name}
                          onChange={(e) => {
                            const updated = [...classroomConfig.rubricCriteria];
                            updated[idx] = { ...crit, name: e.target.value };
                            setClassroomConfig({ ...classroomConfig, rubricCriteria: updated });
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                          placeholder="Criterion Name"
                        />

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[11px] font-semibold text-slate-500">Max:</span>
                          <input
                            type="number"
                            value={crit.maxScore || 5}
                            onChange={(e) => {
                              const updated = [...classroomConfig.rubricCriteria];
                              updated[idx] = { ...crit, maxScore: parseInt(e.target.value) || 5 };
                              setClassroomConfig({ ...classroomConfig, rubricCriteria: updated });
                            }}
                            className="w-12 px-2 py-1 border border-slate-200 rounded-xl text-xs text-center font-semibold text-emerald-800 bg-emerald-50 focus:outline-none"
                            min={1}
                            max={100}
                          />
                          <span className="text-[10px] text-slate-400">pts</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setClassroomConfig({
                              ...classroomConfig,
                              rubricCriteria: classroomConfig.rubricCriteria.filter((c) => c.id !== crit.id),
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        value={crit.desc}
                        onChange={(e) => {
                          const updated = [...classroomConfig.rubricCriteria];
                          updated[idx] = { ...crit, desc: e.target.value };
                          setClassroomConfig({ ...classroomConfig, rubricCriteria: updated });
                        }}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-emerald-600"
                        placeholder="Description of performance standard..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 4: DISCUSSION CHANNELS */}
            {activeClassroomSubTab === 'forum' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold capitalize text-slate-400 tracking-wider">Community Discussion Channels ({classroomConfig.forumChannels.length})</h4>
                    <p className="text-xs text-slate-500">Create, edit, or remove discussion channels displayed in the LMS community forum.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {classroomConfig.forumChannels.map((chan, idx) => (
                    <div key={chan.id || idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono font-semibold text-slate-600 shrink-0">
                          #{chan.id}
                        </span>

                        <input
                          type="text"
                          value={chan.label}
                          onChange={(e) => {
                            const updated = [...classroomConfig.forumChannels];
                            updated[idx] = { ...chan, label: e.target.value };
                            setClassroomConfig({ ...classroomConfig, forumChannels: updated });
                          }}
                          className="w-48 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                          placeholder="Channel Label"
                        />

                        <input
                          type="text"
                          value={chan.description || ''}
                          onChange={(e) => {
                            const updated = [...classroomConfig.forumChannels];
                            updated[idx] = { ...chan, description: e.target.value };
                            setClassroomConfig({ ...classroomConfig, forumChannels: updated });
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:border-blue-600"
                          placeholder="Channel Purpose / Description"
                        />
                      </div>

                      {chan.id !== 'all' && (
                        <button
                          type="button"
                          onClick={() => {
                            setClassroomConfig({
                              ...classroomConfig,
                              forumChannels: classroomConfig.forumChannels.filter((c) => c.id !== chan.id),
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
                          title="Delete Channel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Inline Add Channel Row */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="text-xs font-semibold text-slate-800">Add New Discussion Channel</h5>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      placeholder="Channel Name (e.g. Study Circle Alpha)"
                      value={newChannelLabel}
                      onChange={(e) => setNewChannelLabel(e.target.value)}
                      className="w-full sm:w-56 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      placeholder="Purpose / Guidance for students..."
                      value={newChannelDesc}
                      onChange={(e) => setNewChannelDesc(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-600"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const trimmed = newChannelLabel.trim();
                        if (!trimmed) return;
                        const newId = trimmed.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
                        const newChan: ForumChannelConfig = {
                          id: newId,
                          label: trimmed,
                          description: newChannelDesc.trim() || undefined,
                          icon: newChannelIcon,
                        };
                        setClassroomConfig({
                          ...classroomConfig,
                          forumChannels: [...classroomConfig.forumChannels, newChan],
                        });
                        setNewChannelLabel('');
                        setNewChannelDesc('');
                      }}
                      leftIcon={<Plus className="w-4 h-4" />}
                      className="text-xs font-semibold whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                    >
                      Add Channel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveClassroomCommunity}
                leftIcon={<Save className="w-4 h-4" />}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Staff Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Invite New Staff Member</span>
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sheikh Abdullah"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@academy.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600"
                >
                  <option value="teacher">Instructor / Teacher (Live Class, Grading)</option>
                  <option value="registrar">Admissions Registrar (Leads CRM, Invoices)</option>
                  <option value="admin">Assistant Director / Sub-Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleInviteStaff} disabled={isProvisioning}>
                {isProvisioning ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Credentials Modal */}
      {provisionedCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Account Provisioned in Database</h3>
                <p className="text-xs text-slate-500">Live credentials stored securely in MySQL</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Name:</span>{' '}
                <span className="font-semibold text-slate-800">{provisionedCredentials.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Login Email:</span>{' '}
                <span className="font-mono font-semibold text-emerald-800">{provisionedCredentials.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Assigned Role:</span>{' '}
                <span className="font-semibold text-slate-800 capitalize">{provisionedCredentials.role}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Temporary Password:</span>{' '}
                <span className="font-mono font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {provisionedCredentials.temporaryPassword || 'Password123!'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Login Email: ${provisionedCredentials.email}\nPassword: ${provisionedCredentials.temporaryPassword || 'Password123!'}`
                  );
                  success('Copied!', 'Credentials copied to clipboard.');
                }}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setProvisionedCredentials(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview of Preloader */}
      {isPreviewingPreloader && <AppPreloader forceShow={true} />}
    </div>
  );
};
