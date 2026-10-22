import React, { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useToast } from '../../context/ToastContext';
import { detectTenantNicheType } from '../../services/classroomCustomizationService';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Modal,
  PageHeader,
  StatCard,
  TableControls,
  TableSortHeader,
  TablePagination,
  Avatar,
} from '../ui';
import {
  Users,
  GraduationCap,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  Search,
  BookOpen,
  CheckSquare,
  ShieldCheck,
  Mail,
  Phone,
  Trash2,
  Edit,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  assignedCourses: string[];
  assignedTasks: string[];
  status: string;
  rawPassword?: string | null;
  createdAt: string;
}

interface StudentMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  enrolledCourse: string;
  planName: string;
  paymentStatus: string;
  status: string;
  rawPassword?: string | null;
  createdAt: string;
}

export const StaffAndStudentManager: React.FC = () => {
  const { tenant, courses, direction } = useTenant();
  const { addToast } = useToast();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';

  const [activeTab, setActiveTab] = useState<'staff' | 'students'>('staff');
  const [isLoading, setIsLoading] = useState(false);

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [studentList, setStudentList] = useState<StudentMember[]>([]);

  // Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Modals State
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedCredentials, setSelectedCredentials] = useState<{
    name: string;
    email: string;
    password?: string;
    role: string;
  } | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Form State: Add Staff
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    phone: '',
    selectedCourses: [] as string[],
    selectedTasks: [] as string[],
  });

  // Form State: Add Student
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    enrolledCourse: '',
    planName: 'Foundational',
    tuitionAmount: 65,
  });

  const availableTasks = isQuran
    ? [
        'Lead Morning Halaqah & Tajweed',
        'Evaluate Audio Recitation Submissions',
        'Prepare Sanad Exam Portfolios',
        'Conduct Parent Progress Check-ins',
        'Oversee Syllabus & Retention Drills',
        'Supervise Virtual Classroom SFU',
      ]
    : [
        'Lead Interactive Class Sessions',
        'Evaluate Assignment & Project Submissions',
        'Prepare Student Assessment Portfolios',
        'Conduct Parent / Advisor Check-ins',
        'Oversee Syllabus & Mastery Milestones',
        'Supervise Virtual Classroom SFU',
      ];

  // Fetch real members from MySQL
  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('ankabit_auth_token')) : null;
      const res = await fetch(`/api/tenant/members?tenantId=${tenant.id || tenant.subdomain}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
        setStudentList(data.students || []);
      }
    } catch (err) {
      console.warn('Failed to load members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [tenant.id, tenant.subdomain]);

  // Handle Add Staff Submit
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) {
      addToast({ type: 'error', title: 'Missing Information', message: 'Name and email are required.' });
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('ankabit_auth_token')) : null;
      const res = await fetch('/api/tenant/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: staffForm.name,
          email: staffForm.email,
          password: staffForm.password,
          role: staffForm.role,
          phone: staffForm.phone,
          tenantId: tenant.id || tenant.subdomain,
          assignedCourses: staffForm.selectedCourses,
          assignedTasks: staffForm.selectedTasks,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to create staff member');
      }

      addToast({
        type: 'success',
        title: 'Staff Member Created',
        message: `${staffForm.name} assigned as ${staffForm.role} in MySQL.`,
      });

      // Show credentials modal
      setSelectedCredentials({
        name: result.user.name,
        email: result.user.email,
        password: result.user.rawPassword,
        role: result.user.role,
      });

      setIsAddStaffOpen(false);
      setStaffForm({
        name: '',
        email: '',
        password: '',
        role: 'teacher',
        phone: '',
        selectedCourses: [],
        selectedTasks: [],
      });
      fetchMembers();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  // Handle Add Student Submit
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) {
      addToast({ type: 'error', title: 'Missing Information', message: 'Name and email are required.' });
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('ankabit_auth_token')) : null;
      const res = await fetch('/api/tenant/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: studentForm.name,
          email: studentForm.email,
          password: studentForm.password,
          role: 'student',
          phone: studentForm.phone,
          tenantId: tenant.id || tenant.subdomain,
          enrolledCourse: studentForm.enrolledCourse || courses[0]?.title || 'Curriculum Course',
          planName: studentForm.planName,
          tuitionAmount: studentForm.tuitionAmount,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to enroll student');
      }

      addToast({
        type: 'success',
        title: 'Student Enrolled',
        message: `${studentForm.name} admitted and credentials generated.`,
      });

      setSelectedCredentials({
        name: result.user.name,
        email: result.user.email,
        password: result.user.rawPassword,
        role: 'student',
      });

      setIsAddStudentOpen(false);
      setStudentForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        enrolledCourse: '',
        planName: 'Foundational',
        tuitionAmount: 65,
      });
      fetchMembers();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  // Delete Member
  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your academy?`)) return;
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('auth_token') || localStorage.getItem('ankabit_auth_token')) : null;
      const res = await fetch(`/api/tenant/members?id=${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        addToast({ type: 'success', title: 'Member Removed', message: `${name} has been removed.` });
        fetchMembers();
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to delete member' });
    }
  };

  // Copy Credentials
  const handleCopyCredentials = () => {
    if (!selectedCredentials) return;
    const text = `Liwan LMS Login Credentials:\nAcademy Portal: https://${tenant.subdomain}.liwanlms.com/login\nEmail: ${selectedCredentials.email}\nPassword: ${selectedCredentials.password || 'Contact administrator'}\nRole: ${selectedCredentials.role}`;
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    addToast({ type: 'info', title: 'Copied', message: 'Credentials copied to clipboard.' });
  };

  // Filter & Sort Staff
  const filteredAndSortedStaff = useMemo(() => {
    return staffList
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || s.role.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        const fieldA = (a as any)[sortField] || '';
        const fieldB = (b as any)[sortField] || '';
        if (sortDir === 'asc') return fieldA > fieldB ? 1 : -1;
        return fieldA < fieldB ? 1 : -1;
      });
  }, [staffList, searchTerm, roleFilter, sortField, sortDir]);

  // Filter & Sort Students
  const filteredAndSortedStudents = useMemo(() => {
    return studentList
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.enrolledCourse.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        const fieldA = (a as any)[sortField] || '';
        const fieldB = (b as any)[sortField] || '';
        if (sortDir === 'asc') return fieldA > fieldB ? 1 : -1;
        return fieldA < fieldB ? 1 : -1;
      });
  }, [studentList, searchTerm, sortField, sortDir]);

  const paginatedStaff = filteredAndSortedStaff.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginatedStudents = filteredAndSortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6 font-sans" dir={direction}>
      {/* Page Header */}
      <PageHeader
        title="Faculty & Student Directory"
        subtitle="Provision roles, generate secure student and staff credentials, and allocate classes & responsibilities."
        badge={{ text: "Active Roster", variant: "neutral" }}
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={() => setIsAddStudentOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4 text-slate-700" />}
            >
              Add Student
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsAddStaffOpen(true)}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Add Staff
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Teaching Faculty"
          value={staffList.filter((s) => s.role === 'teacher').length.toString()}
          icon={ShieldCheck}
          trend={isQuran ? "Certified Ustadhs & Instructors" : "Faculty & Subject Mentors"}
        />
        <StatCard
          title="Total Staff & Admins"
          value={staffList.length.toString()}
          icon={Users}
          trend="Faculty & Coordinators"
        />
        <StatCard
          title="Enrolled Students"
          value={studentList.length.toString()}
          icon={GraduationCap}
          trend="Active enrolled learners"
        />
        <StatCard
          title="Curriculum Tracks"
          value={courses.length.toString()}
          icon={BookOpen}
          trend={isQuran ? "Active academic halaqahs" : "Active academic courses"}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center space-x-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('staff');
            setCurrentPage(1);
          }}
          className={`py-3 px-5 font-semibold text-xs transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'staff'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Staff & Faculty</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              activeTab === 'staff'
                ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)] font-semibold'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {staffList.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('students');
            setCurrentPage(1);
          }}
          className={`py-3 px-5 font-semibold text-xs transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'students'
              ? 'border-[var(--color-primary,#047857)] text-[var(--color-primary,#047857)] bg-[var(--color-primary-50,#ecfdf5)]'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Enrolled Students</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              activeTab === 'students'
                ? 'bg-[var(--color-primary,#047857)]/15 text-[var(--color-primary,#047857)] font-semibold'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {studentList.length}
          </span>
        </button>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{activeTab === 'staff' ? 'Faculty & Staff Roster' : 'Enrolled Students Roster'}</CardTitle>
            <CardDescription>
              {activeTab === 'staff'
                ? 'Manage teaching faculty, coordinators, and access privileges'
                : 'View registered students and curriculum enrolments'}
            </CardDescription>
          </div>
          <TableControls
            searchValue={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            searchPlaceholder={`Search ${activeTab === 'staff' ? 'staff by name or email' : 'students by name, email or course'}...`}
            actions={
              activeTab === 'staff' ? (
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 px-4 text-sm bg-white text-slate-800 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)] shadow-xs font-semibold"
                >
                  <option value="ALL">All Roles</option>
                  <option value="teacher">Teachers / Ustadhs</option>
                  <option value="coordinator">Coordinators</option>
                  <option value="admin">Administrators</option>
                  <option value="assistant">Assistants</option>
                </select>
              ) : undefined
            }
          />
        </CardHeader>

        <CardContent className="p-0">
          {activeTab === 'staff' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold capitalize tracking-wider text-xs">
                  <tr>
                    <TableSortHeader
                      field="name"
                      currentSortField={sortField}
                      currentSortDir={sortDir}
                      onSort={handleSort}
                    >
                      Faculty Member
                    </TableSortHeader>
                    <th className="py-3.5 px-5">Role & Permissions</th>
                    <th className="py-3.5 px-5">Assigned Classes / Tracks</th>
                    <th className="py-3.5 px-5">Assigned Tasks</th>
                    <th className="py-3.5 px-5 text-center">Credentials</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-slate-400">
                        <Avatar size="xl" className="mx-auto mb-3" />
                        <p className="font-semibold text-base text-slate-800">No staff members found</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Click "+ Add Staff" to assign teachers and administrators.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">
                          <div className="flex items-center gap-3">
                            <Avatar name={staff.name} size="md" />
                            <div>
                              <span className="block font-semibold text-slate-900">{staff.name}</span>
                              <span className="text-xs text-slate-500 font-normal block">{staff.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <Badge
                            variant={
                              staff.role === 'admin'
                                ? 'primary'
                                : staff.role === 'teacher'
                                ? 'info'
                                : 'neutral'
                            }
                            className="capitalize font-semibold text-xs"
                          >
                            {staff.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-5">
                          {staff.assignedCourses.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {staff.assignedCourses.map((c, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                                  {c}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">No classes assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          {staff.assignedTasks.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {staff.assignedTasks.map((t, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium text-xs border border-emerald-200">
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">No active tasks</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedCredentials({
                                name: staff.name,
                                email: staff.email,
                                password: staff.rawPassword || '••••••••',
                                role: staff.role,
                              })
                            }
                            leftIcon={<KeyRound className="w-3.5 h-3.5 text-amber-600" />}
                            className="text-xs font-semibold"
                          >
                            Credentials
                          </Button>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDeleteMember(staff.id, staff.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove staff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold capitalize tracking-wider text-xs">
                  <tr>
                    <TableSortHeader
                      field="name"
                      currentSortField={sortField}
                      currentSortDir={sortDir}
                      onSort={handleSort}
                    >
                      Student
                    </TableSortHeader>
                    <th className="py-3.5 px-5">Enrolled Course Track</th>
                    <th className="py-3.5 px-5">Tuition Plan</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-center">Student Credentials</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-slate-400">
                        <Avatar size="xl" className="mx-auto mb-3" />
                        <p className="font-semibold text-base text-slate-800">No students enrolled</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Click "+ Admit Student" to register your first student.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">
                          <div className="flex items-center gap-3">
                            <Avatar name={student.name} size="md" />
                            <div>
                              <span className="block font-semibold text-slate-900">{student.name}</span>
                              <span className="text-xs text-slate-500 font-normal block">{student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{student.enrolledCourse}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-slate-900">{student.planName}</span>
                          <Badge variant="success" className="ml-2 text-xs font-semibold">
                            {student.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <Badge variant="default" className="text-xs font-semibold">
                            {student.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedCredentials({
                                name: student.name,
                                email: student.email,
                                password: student.rawPassword || '••••••••',
                                role: 'student',
                              })
                            }
                            leftIcon={<KeyRound className="w-3.5 h-3.5 text-amber-600" />}
                            className="text-xs font-semibold"
                          >
                            Credentials
                          </Button>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleDeleteMember(student.id, student.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={activeTab === 'staff' ? filteredAndSortedStaff.length : filteredAndSortedStudents.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* MODAL 1: ADD STAFF */}
      {isAddStaffOpen && (
        <Modal
          isOpen={isAddStaffOpen}
          onClose={() => setIsAddStaffOpen(false)}
          title={isQuran ? "Add Staff Member / Ustadhah" : "Add Faculty / Staff Member"}
        >
          <form onSubmit={handleCreateStaff} className="space-y-4 font-sans text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Full Name *</label>
              <Input
                placeholder={isQuran ? "e.g. Ustadhah Fatima Al-Hashemi" : "e.g. Dr. Sarah Jenkins"}
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address (Login) *</label>
                <Input
                  type="email"
                  placeholder="teacher@academy.liwanlms.com"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Assign Role *</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-hidden"
                >
                  <option value="teacher">
                    {isQuran ? "Teacher / Ustadhah (Live Classes & Grading)" : "Teacher / Instructor (Live Classes & Grading)"}
                  </option>
                  <option value="coordinator">
                    {isQuran ? "Academic Coordinator (Curriculum & Halaqahs)" : "Academic Coordinator (Curriculum & Cohorts)"}
                  </option>
                  <option value="assistant">Teaching Assistant (Attendance & Reviews)</option>
                  <option value="admin">Admin (Full Management)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Initial Password (Optional: Auto-generated if blank)</label>
              <Input
                type="text"
                placeholder="Leave blank to auto-generate secure password"
                value={staffForm.password}
                onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
              />
            </div>

            {/* Class / Course Assignment */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">
                {isQuran ? "Assign Courses / Halaqahs" : "Assign Courses / Tracks"}
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 max-h-36 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-slate-400 italic">No courses created yet. Create a course in the Curriculum tab first.</p>
                ) : (
                  courses.map((c) => {
                    const isSelected = staffForm.selectedCourses.includes(c.title);
                    return (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStaffForm({ ...staffForm, selectedCourses: [...staffForm.selectedCourses, c.title] });
                            } else {
                              setStaffForm({
                                ...staffForm,
                                selectedCourses: staffForm.selectedCourses.filter((x) => x !== c.title),
                              });
                            }
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span className="font-medium text-slate-800">{c.title}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Task Assignments */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Assign Staff Responsibilities & Tasks</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableTasks.map((task) => {
                  const isChecked = staffForm.selectedTasks.includes(task);
                  return (
                    <label key={task} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStaffForm({ ...staffForm, selectedTasks: [...staffForm.selectedTasks, task] });
                          } else {
                            setStaffForm({
                              ...staffForm,
                              selectedTasks: staffForm.selectedTasks.filter((t) => t !== task),
                            });
                          }
                        }}
                        className="rounded text-emerald-600"
                      />
                      <span className="text-[11px] font-semibold text-slate-800">{task}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setIsAddStaffOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="font-semibold">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: ADD STUDENT */}
      {isAddStudentOpen && (
        <Modal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          title="Admit New Student"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4 font-sans text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Student Full Name *</label>
              <Input
                placeholder={isQuran ? "e.g. Maryam Al-Khatib" : "e.g. Alex Morgan"}
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address (Login) *</label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Phone Number (Parent / Guardian)</label>
                <Input
                  placeholder="+1 (555) 000-0000"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Initial Password (Optional)</label>
              <Input
                type="text"
                placeholder="Leave blank to auto-generate password"
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Enroll in Course Track</label>
                <select
                  value={studentForm.enrolledCourse}
                  onChange={(e) => setStudentForm({ ...studentForm, enrolledCourse: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-hidden"
                >
                  <option value="">Select a Course Track</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                  {courses.length === 0 && (
                    <>
                      <option value={isQuran ? "Hifz Al-Quran Intensive" : "Core Curriculum Foundations"}>
                        {isQuran ? "Hifz Al-Quran Intensive" : "Core Curriculum Foundations"}
                      </option>
                      <option value={isQuran ? "Tajweed Phonetics Foundation" : "Applied Practicum & Labs"}>
                        {isQuran ? "Tajweed Phonetics Foundation" : "Applied Practicum & Labs"}
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tuition Plan</label>
                <select
                  value={studentForm.planName}
                  onChange={(e) => setStudentForm({ ...studentForm, planName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-hidden"
                >
                  <option value="Foundational">Foundational ($65/mo)</option>
                  <option value="Intensive">Intensive ($120/mo)</option>
                  <option value={isQuran ? "Sanad Track" : "Honors Track"}>
                    {isQuran ? "Sanad Track ($180/mo)" : "Honors Track ($180/mo)"}
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setIsAddStudentOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="font-semibold">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: CREDENTIALS SUMMARY MODAL */}
      {selectedCredentials && (
        <Modal
          isOpen={Boolean(selectedCredentials)}
          onClose={() => setSelectedCredentials(null)}
          title="Account Login Credentials"
        >
          <div className="space-y-4 font-sans text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-950 text-sm">{selectedCredentials.name}</span>
                <Badge variant="success" className="capitalize font-semibold">
                  {selectedCredentials.role}
                </Badge>
              </div>
              <p className="text-emerald-800 text-[11px]">
                Share these credentials with the user to allow them to sign into the academy portal.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-sans">Login Portal:</span>
                <span className="font-semibold text-slate-900 select-all">https://{tenant.subdomain}.liwanlms.com/login</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
                <span className="text-slate-500 font-sans">Username / Email:</span>
                <span className="font-semibold text-slate-900 select-all">{selectedCredentials.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-sans">Password:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded select-all">
                  {selectedCredentials.password || '••••••••'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCredentials}
                leftIcon={hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                className="font-semibold"
              >
                {hasCopied ? 'Copied to Clipboard' : 'Copy Credentials'}
              </Button>

              <Button variant="primary" size="sm" onClick={() => setSelectedCredentials(null)} className="font-semibold">
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
