import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../context/TenantContext';
import { useToast } from '../../../context/ToastContext';
import { useConfirm } from '../../../context/ConfirmModalContext';
import { Button, Input, Select, Card, Badge, Modal, PageHeader, Avatar } from '../../ui';
import {
  Users,
  UserPlus,
  UserCheck,
  ShieldCheck,
  Check,
  Copy,
  Lock,
  Mail,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Save,
  Loader2,
  X
} from 'lucide-react';

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

export const StaffRolesManager: React.FC = () => {
  const { tenant, updateTenantConfig } = useTenant();
  const { success, error, info } = useToast();
  const confirm = useConfirm();

  // Staff Roster State
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'teacher' | 'registrar'>('teacher');
  const [invitePhone, setInvitePhone] = useState('');
  const [provisionedCredentials, setProvisionedCredentials] = useState<{
    name: string;
    email: string;
    role: string;
    temporaryPassword?: string;
  } | null>(null);

  // Applicant Queue State
  const [applicantsList, setApplicantsList] = useState<PendingApplicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(true);
  const [processingApplicantId, setProcessingApplicantId] = useState<string | null>(null);

  // Granular Role Permission Matrix
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
              submittedTime: l.createdAt
                ? new Date(l.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recently',
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

  const handleInviteStaff = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) {
      error('Missing Details', 'Please provide a staff name and valid email address.');
      return;
    }

    setIsProvisioning(true);
    try {
      const generatedTempPassword = `Staff#${Math.random().toString(36).slice(-6)}!`;
      const res = await fetch('/api/tenant/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenant.id || tenant.subdomain,
          name: inviteName.trim(),
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
          phone: invitePhone.trim(),
          temporaryPassword: generatedTempPassword,
          status: 'Active',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Could not provision staff account.');
      }

      setProvisionedCredentials({
        name: inviteName.trim(),
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        temporaryPassword: generatedTempPassword,
      });

      success('Account Provisioned', `Provisioned ${inviteName} as ${inviteRole}.`);
      setInviteName('');
      setInviteEmail('');
      setInvitePhone('');
      await fetchStaff();
    } catch (err: any) {
      error('Provisioning Error', err.message || 'Failed to save staff account.');
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleRevokeStaff = async (staff: StaffMember) => {
    const ok = await confirm({
      title: 'Revoke Staff Access',
      message: `Are you sure you want to revoke administrative access for ${staff.name} (${staff.email})?`,
      confirmText: 'Revoke Access',
      cancelText: 'Keep Active',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      const res = await fetch(
        `/api/tenant/members?id=${encodeURIComponent(staff.id)}&tenantId=${encodeURIComponent(tenant.id || tenant.subdomain)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        success('Access Revoked', `Revoked account access for ${staff.name}.`);
        await fetchStaff();
      } else {
        throw new Error('Failed to revoke account.');
      }
    } catch (err: any) {
      error('Revocation Error', err.message || 'Could not revoke staff access.');
    }
  };

  const handleApproveApplicant = async (app: PendingApplicant) => {
    setProcessingApplicantId(app.id);
    try {
      const tempPassword = `Learn#${Math.random().toString(36).slice(-6)}!`;
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
          status: 'Admitted',
        }),
      });

      setProvisionedCredentials({
        name: app.name,
        email: app.email,
        role: app.role,
        temporaryPassword: tempPassword,
      });

      success('Applicant Approved & Admitted!', `Granted dashboard access to ${app.name} (${app.email}).`);
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
          status: 'Rejected',
        }),
      });
      info('Application Rejected', `Declined applicant ${app.name}.`);
      await fetchApplicants();
    } catch (err: any) {
      error('Decline Failed', err.message || 'Could not update applicant record.');
    } finally {
      setProcessingApplicantId(null);
    }
  };

  const togglePermission = (
    role: keyof typeof defaultRolePermissions,
    perm: keyof typeof defaultRolePermissions['admin']
  ) => {
    if (role === 'admin' && perm === 'manageBilling') {
      info('Locked Permission', 'Academy Admin billing capability is locked for security integrity.');
      return;
    }
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm],
      },
    }));
  };

  const handleSaveRolePermissions = () => {
    setIsSavingPermissions(true);
    updateTenantConfig({
      settings: {
        ...(tenant.settings as any),
        rolePermissions,
      },
    });
    setTimeout(() => {
      setIsSavingPermissions(false);
      success('Role Permissions Saved', 'Granular permissions matrix persisted to academy configuration.');
    }, 400);
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Staff & Role Permissions (RBAC)"
        subtitle="Directly provision faculty and registrar accounts, review public registration queues, and configure granular role permission capabilities."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchStaff();
                fetchApplicants();
              }}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Staff
            </Button>
          </div>
        }
      />

      {/* Section 1: Academy Staff Roster */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Academy Staff & Direct Role Assignment</h2>
              <p className="text-sm text-slate-500">
                Directly provision accounts or assign roles for teachers, registrars, and sub-administrators.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Staff
          </Button>
        </div>

        {/* Staff Table or Empty State */}
        {isLoadingStaff ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading academy staff roster...</p>
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-14 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 space-y-4">
            <div className="flex justify-center">
              <Avatar size="xl" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No staff accounts provisioned yet</h3>
              <p className="text-sm text-slate-500">
                Click "Add Staff" to directly add instructors, teachers, or admissions registrars with credentials to access their academy portal.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsInviteModalOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Staff
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Staff Member</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Assigned Classes</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={staff.name} status={staff.status} size="md" />
                        <div>
                          <div className="font-semibold text-slate-900">{staff.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          staff.role === 'admin'
                            ? 'primary'
                            : staff.role === 'teacher'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {staff.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {staff.assignedClasses} Courses
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={staff.status === 'active' ? 'success' : 'warning'}>
                        {staff.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeStaff(staff)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Public Signups & Role Approval Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Public Signups & Role Access Approval Queue</h2>
                {applicantsList.length > 0 && (
                  <Badge variant="warning">{applicantsList.length} Pending</Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">
                Review applicant signups and accept them before granting access to their student or instructor dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Applicants Table or Empty State */}
        {isLoadingApplicants ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Checking applicant review queue...</p>
          </div>
        ) : applicantsList.length === 0 ? (
          <div className="py-14 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
            <div className="flex justify-center">
              <Avatar size="xl" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No pending applicant signups</h3>
              <p className="text-sm text-slate-500">
                When prospective students or teachers submit public registration forms, their requests will appear here for administrative verification and approval.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Applicant</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Requested Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Applied Track</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Submitted</th>
                  <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicantsList.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={app.name} size="md" status="invited" />
                        <div>
                          <div className="font-semibold text-slate-900">{app.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={app.role === 'teacher' ? 'info' : 'primary'}>
                        {app.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">{app.track}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">{app.submittedTime}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={processingApplicantId === app.id}
                          onClick={() => handleDeclineApplicant(app)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={processingApplicantId === app.id}
                          isLoading={processingApplicantId === app.id}
                          onClick={() => handleApproveApplicant(app)}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Approve
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Granular Role Permission Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-purple-600 shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Granular Role Permission Matrix</h2>
              <p className="text-sm text-slate-500">
                Configure what actions each account role is permitted to perform across the academy portal.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleSaveRolePermissions}
            isLoading={isSavingPermissions}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold capitalize tracking-wider">Permission Capability</th>
                <th className="px-4 py-3.5 text-xs font-semibold capitalize tracking-wider text-center">Academy Admin</th>
                <th className="px-4 py-3.5 text-xs font-semibold capitalize tracking-wider text-center">Instructor / Teacher</th>
                <th className="px-4 py-3.5 text-xs font-semibold capitalize tracking-wider text-center">Registrar</th>
                <th className="px-4 py-3.5 text-xs font-semibold capitalize tracking-wider text-center">Student</th>
                <th className="px-4 py-3.5 text-xs font-semibold capitalize tracking-wider text-center">Parent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { key: 'manageBilling', label: 'Manage Billing & Gateways' },
                { key: 'liveClass', label: 'Host Live WebRTC Classrooms' },
                { key: 'gradeSubmissions', label: 'Grade Recitations & Feedback' },
                { key: 'forumMod', label: 'Post in Community Forum' },
                { key: 'viewChildReports', label: 'View Child Attendance & Invoices' },
              ].map(({ key, label }) => (
                <tr key={key} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">{label}</td>
                  {(['admin', 'teacher', 'registrar', 'student', 'parent'] as const).map((role) => {
                    const isEnabled = (rolePermissions as any)[role]?.[key];
                    return (
                      <td key={role} className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(role, key as any)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs hover:bg-emerald-700'
                              : 'bg-slate-50 text-slate-300 border-slate-200 hover:border-slate-300 hover:text-slate-400'
                          }`}
                        >
                          {isEnabled ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Provision Staff Account Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Provision New Staff Member"
        description="Create an authorized instructor or registrar account with direct dashboard access."
        size="md"
      >
        <div className="space-y-5">
          <Input
            label="Staff Member Full Name"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="e.g. Ustadh Tariq Al-Madani"
          />

          <Input
            label="Staff Member Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="instructor@academy.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone Number (Optional)"
            value={invitePhone}
            onChange={(e) => setInvitePhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />

          <Select
            label="Assigned System Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            options={[
              { value: 'teacher', label: 'Teacher / Instructor (Classes & Grading)' },
              { value: 'registrar', label: 'Registrar (Admissions & Invoices)' },
              { value: 'admin', label: 'Sub-Administrator (Curriculum & Settings)' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleInviteStaff}
              isLoading={isProvisioning}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Provisioned Account Credentials Card */}
      <Modal
        isOpen={Boolean(provisionedCredentials)}
        onClose={() => setProvisionedCredentials(null)}
        title="Account Credentials Generated"
        description="Share these secure one-time login credentials with the newly provisioned staff member."
        size="md"
      >
        {provisionedCredentials && (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Account successfully created in database!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  The user can sign in using this temporary password and will be prompted to update it on first login.
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Name:</span>
                <span className="font-semibold text-slate-900">{provisionedCredentials.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="font-semibold text-slate-900 font-mono">{provisionedCredentials.email}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Role:</span>
                <Badge variant="primary">{provisionedCredentials.role}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 font-medium">Temporary Password:</span>
                <span className="font-mono font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {provisionedCredentials.temporaryPassword}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Welcome to ${tenant.name}!\nEmail: ${provisionedCredentials.email}\nTemporary Password: ${provisionedCredentials.temporaryPassword}\nLogin Portal: https://${tenant.subdomain}.ankabit.app`
                  );
                  success('Credentials Copied', 'Login details copied to clipboard.');
                }}
                leftIcon={<Copy className="w-4 h-4" />}
              >
                Copy Details
              </Button>
              <Button variant="primary" onClick={() => setProvisionedCredentials(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
