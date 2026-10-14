import React, { useState, useEffect, useMemo } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Lead } from '../../types';
import { isDemoTenant as checkIsDemoTenant } from '../../lib/tenants';
import { Card, Badge, Button, PageHeader } from '../ui';
import { detectTenantNicheType } from '../../services/classroomCustomizationService';
import {
  DollarSign,
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Plus,
  ArrowUpRight,
  Filter,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Bell,
  CreditCard,
  Video,
  ExternalLink,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export interface AdminTask {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Normal';
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export interface AdminReport {
  id: string;
  title: string;
  category: string;
  period: string;
  format: 'CSV' | 'PDF' | 'Excel';
  size: string;
  generatedDate: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  instructor: string;
  time: string;
  date: string;
  track: string;
  isLive?: boolean;
}

interface AnalyticsDashboardProps {
  onOpenUpgradeModal?: () => void;
  onNavigateToCourses?: () => void;
  onNavigateToAdmissions?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onOpenUpgradeModal,
  onNavigateToCourses,
  onNavigateToAdmissions,
  onNavigateTab,
}) => {
  const { tenant, courses, direction } = useTenant();
  const { user } = useAuth();
  const { success, info } = useToast();
  const niche = detectTenantNicheType(tenant);
  const isQuran = niche === 'quran';
  const isDemo = checkIsDemoTenant(tenant.subdomain);

  const [liveStats, setLiveStats] = useState<any>(null);
  const [liveLeads, setLiveLeads] = useState<Lead[]>([]);
  const [chartPeriod, setChartPeriod] = useState<'6m' | '1y'>('6m');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(12); // Day of month
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Normal'>('Medium');

  // Interactive Tasks Checklist State: strictly empty for real tenants
  const [tasks, setTasks] = useState<AdminTask[]>(() => {
    if (isDemo) {
      return [
        {
          id: 't-1',
          title: isQuran
            ? 'Verify and countersign 3 capstone Ijazah graduation certificates'
            : 'Verify and approve 3 graduating capstone certificates',
          category: 'Certification',
          priority: 'High',
          assignee: 'Sheikh Director',
          dueDate: 'Oct 15, 2026',
          completed: false,
        },
        {
          id: 't-2',
          title: 'Review 5 pending student admission applications in intake queue',
          category: 'Admissions',
          priority: 'High',
          assignee: 'Admissions Officer',
          dueDate: 'Oct 14, 2026',
          completed: false,
        },
        {
          id: 't-3',
          title: 'Reconcile October monthly tuition invoices and gateway settlement',
          category: 'Finance',
          priority: 'Medium',
          assignee: 'Finance Office',
          dueDate: 'Oct 18, 2026',
          completed: true,
        },
        {
          id: 't-4',
          title: isQuran
            ? 'Publish Week 4 Tajweed syllabus updates and audio recitation exercises'
            : 'Publish Week 4 curriculum updates and interactive labs',
          category: 'Academics',
          priority: 'Normal',
          assignee: 'Lead Faculty',
          dueDate: 'Oct 20, 2026',
          completed: false,
        },
        {
          id: 't-5',
          title: 'Run WebRTC classroom audio latency check before evening halaqah',
          category: 'Technical',
          priority: 'Normal',
          assignee: 'IT & Media Desk',
          dueDate: 'Today',
          completed: true,
        },
      ];
    }
    return [];
  });

  // Reports Table Data: strictly empty for real tenants
  const reports: AdminReport[] = useMemo(() => {
    if (isDemo) {
      return [
        {
          id: 'rep-1',
          title: 'Monthly Tuition & Gateway Revenue Ledger',
          category: 'Finance',
          period: 'October 2026',
          format: 'CSV',
          size: '284 KB',
          generatedDate: 'Oct 12, 2026',
        },
        {
          id: 'rep-2',
          title: isQuran
            ? 'Halaqah Attendance & Punctuality Cohort Summary'
            : 'Student Cohort Attendance & Class Participation Summary',
          category: 'Academics',
          period: 'Fall Term 2026',
          format: 'PDF',
          size: '1.2 MB',
          generatedDate: 'Oct 11, 2026',
        },
        {
          id: 'rep-3',
          title: isQuran
            ? 'Recitation Evaluations & Oral Assessment Matrix'
            : 'Student Assessment Scores & Gradebook Summary',
          category: 'Assessments',
          period: 'Term 1 Midterm',
          format: 'Excel',
          size: '512 KB',
          generatedDate: 'Oct 09, 2026',
        },
        {
          id: 'rep-4',
          title: 'Faculty Teaching Hours & Live Session Records',
          category: 'Faculty',
          period: 'Monthly Q4',
          format: 'PDF',
          size: '890 KB',
          generatedDate: 'Oct 08, 2026',
        },
      ];
    }
    return [];
  }, [isDemo, isQuran]);

  // Calendar Scheduled Sessions: strictly empty for real tenants
  const scheduledSessions: ScheduledEvent[] = useMemo(() => {
    if (isDemo) {
      return [
        {
          id: 's-1',
          title: isQuran
            ? 'Daily Tajweed & Muraja\'ah Halaqah'
            : 'Core Interactive Lecture & Lab Pod',
          instructor: isQuran ? 'Shaykh Dr. Abdul Rahman' : 'Dr. Sarah Jenkins',
          time: '4:30 PM - 5:30 PM',
          date: 'Today',
          track: isQuran ? 'Intensive Track' : 'Level 2 Track',
          isLive: true,
        },
        {
          id: 's-2',
          title: isQuran
            ? 'Advanced Hifz Juz 28 Recitation Evaluation'
            : 'Applied Problem Set 4 Walkthrough',
          instructor: isQuran ? 'Ustadha Fatima Al-Mansoor' : 'Prof. Alan Vance',
          time: '6:00 PM - 7:00 PM',
          date: 'Today',
          track: isQuran ? 'Ijazah Track' : 'Advanced Track',
          isLive: false,
        },
        {
          id: 's-3',
          title: isQuran
            ? 'Weekend Noorani Qaidah Foundations Cohort'
            : 'Foundations of Algorithm Architecture',
          instructor: isQuran ? 'Shaykh Tariq Mansour' : 'Elena Rostova',
          time: '10:00 AM - 11:30 AM',
          date: 'Tomorrow',
          track: 'Beginner Track',
          isLive: false,
        },
        {
          id: 's-4',
          title: 'Faculty Academic Standards Board Meeting',
          instructor: 'Academic Director & Staff',
          time: '2:00 PM - 3:00 PM',
          date: 'Oct 15, 2026',
          track: 'Faculty Administration',
          isLive: false,
        },
      ];
    }
    return [];
  }, [isDemo, isQuran]);

  // Live Notifications Feed: strictly real activity or empty
  const notificationsFeed = useMemo(() => {
    if (isDemo) {
      return [
        {
          id: 'n-1',
          title: 'New Student Enrollment',
          description: isQuran
            ? 'Tariq Mansour enrolled in Intensive Tajweed Track ($140/mo)'
            : 'Tariq Mansour enrolled in Full Stack Bootcamp ($140/mo)',
          time: '12m ago',
          type: 'enrollment',
        },
        {
          id: 'n-2',
          title: 'Tuition Payment Received',
          description: '$140.00 USD securely settled via Stripe card checkout',
          time: '45m ago',
          type: 'payment',
        },
        {
          id: 'n-3',
          title: isQuran ? 'Recitation Assignment Submitted' : 'Student Assignment Uploaded',
          description: isQuran
            ? 'Surah Al-Mulk oral recitation recorded by Fatima Zahra'
            : 'Unit 3 Problem Set submitted by Fatima Zahra',
          time: '2h ago',
          type: 'submission',
        },
        {
          id: 'n-4',
          title: 'Live Classroom Attendance Logged',
          description: '18 students verified attendance in Evening Halaqah Session',
          time: '4h ago',
          type: 'classroom',
        },
        {
          id: 'n-5',
          title: 'Automated Snapshot Verified',
          description: 'Daily database snapshot and student vault backup completed',
          time: '6h ago',
          type: 'system',
        },
      ];
    }
    if (liveLeads && liveLeads.length > 0) {
      return liveLeads.slice(0, 5).map((lead, idx) => ({
        id: lead.id || `lead-${idx}`,
        title: lead.status === 'Admitted' ? 'Student Admitted' : 'New Admission Inquiry',
        description: `${lead.name || lead.studentName || 'Student'} applied for ${lead.courseInterest || 'Academy Track'}${lead.tuitionAmount ? ` ($${lead.tuitionAmount})` : ''}`,
        time: 'Recently',
        type: lead.paymentStatus === 'Paid' ? 'payment' : 'enrollment',
      }));
    }
    return [];
  }, [isDemo, isQuran, liveLeads]);

  // Fetch real analytics and leads
  useEffect(() => {
    let isMounted = true;
    if (!isDemo) {
      const targetKey = tenant.id || tenant.subdomain;
      Promise.all([api.getAnalytics(targetKey), api.getLeads(targetKey)])
        .then(([analyticsData, leadsData]) => {
          if (isMounted) {
            setLiveStats(analyticsData);
            setLiveLeads(leadsData || []);
          }
        })
        .catch((err) => {
          console.warn('Analytics lookup notice:', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [tenant.id, tenant.subdomain, isDemo]);

  // Dynamic Calculated Metrics - STRICTLY ZERO FALLBACK FOR REAL TENANTS
  const revenueCalculated = useMemo(() => {
    if (isDemo) return 28450;
    if (typeof liveStats?.monthlyRevenue === 'number' && !isNaN(liveStats.monthlyRevenue)) {
      return liveStats.monthlyRevenue;
    }
    const paidInvoicesTotal = liveLeads
      .flatMap((l) => l.invoices || [])
      .filter((inv) => inv.status === 'Paid')
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    return paidInvoicesTotal; // Returns 0 if no real paid invoices - NO FALLBACK
  }, [isDemo, liveStats, liveLeads]);

  const studentsCount = useMemo(() => {
    if (isDemo) return 142;
    if (typeof liveStats?.enrolledStudents === 'number' && !isNaN(liveStats.enrolledStudents)) {
      return liveStats.enrolledStudents;
    }
    const admittedLeads = liveLeads.filter(
      (l) => l.status === 'Admitted' || l.paymentStatus === 'Paid'
    );
    return admittedLeads.length; // Returns 0 if no real students - NO FALLBACK
  }, [isDemo, liveStats, liveLeads]);

  const teachersCount = useMemo(() => {
    if (isDemo) return 14;
    if (typeof liveStats?.teachersCount === 'number' && !isNaN(liveStats.teachersCount)) {
      return liveStats.teachersCount;
    }
    const members = (tenant as any)?.members || [];
    const teacherMembers = members.filter((m: any) => m.role === 'teacher' || m.role === 'instructor');
    return teacherMembers.length; // Returns 0 if no faculty added - NO FALLBACK
  }, [isDemo, liveStats, tenant]);

  const publishedCoursesCount = courses ? courses.length : 0; // Real course count - NO FALLBACK

  // Revenue Chart Data (Rolling 6 Months vs 12 Months)
  const revenueChartData = useMemo(() => {
    if (isDemo) {
      if (chartPeriod === '6m') {
        return [
          { month: 'May', revenue: 16800, students: 95 },
          { month: 'Jun', revenue: 19400, students: 108 },
          { month: 'Jul', revenue: 21200, students: 118 },
          { month: 'Aug', revenue: 23900, students: 126 },
          { month: 'Sep', revenue: 26100, students: 135 },
          { month: 'Oct', revenue: 28450, students: 142 },
        ];
      } else {
        return [
          { month: 'Nov', revenue: 11200, students: 60 },
          { month: 'Dec', revenue: 12400, students: 72 },
          { month: 'Jan', revenue: 13800, students: 80 },
          { month: 'Feb', revenue: 14500, students: 85 },
          { month: 'Mar', revenue: 15200, students: 90 },
          { month: 'Apr', revenue: 16100, students: 94 },
          { month: 'May', revenue: 16800, students: 95 },
          { month: 'Jun', revenue: 19400, students: 108 },
          { month: 'Jul', revenue: 21200, students: 118 },
          { month: 'Aug', revenue: 23900, students: 126 },
          { month: 'Sep', revenue: 26100, students: 135 },
          { month: 'Oct', revenue: 28450, students: 142 },
        ];
      }
    }

    // Real non-demo tenant: use live monthly data if available, otherwise zeros
    if (liveStats?.monthlyEnrollment && Array.isArray(liveStats.monthlyEnrollment) && liveStats.monthlyEnrollment.length > 0) {
      return liveStats.monthlyEnrollment.map((m: any) => ({
        month: m.month,
        revenue: m.revenue || 0,
        students: m.enrolled || 0,
      }));
    }

    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    return months.map((month, idx) => ({
      month,
      revenue: idx === months.length - 1 ? revenueCalculated : 0,
      students: idx === months.length - 1 ? studentsCount : 0,
    }));
  }, [isDemo, chartPeriod, liveStats, revenueCalculated, studentsCount]);

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: AdminTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: 'General',
      priority: newTaskPriority,
      assignee: user?.name || 'Administrator',
      dueDate: 'Oct 25, 2026',
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTaskTitle('');
    setIsAddTaskModalOpen(false);
    success('Task Added', 'New administrative task added to your workflow list.');
  };

  const handleDownloadReport = (report: AdminReport) => {
    // Generate clean CSV content and trigger client-side download
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        `Report Title,${report.title}\nCategory,${report.category}\nReporting Period,${report.period}\nGenerated Date,${report.generatedDate}\nAcademy,${tenant.name}\nStatus,Verified Official Record\n`
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `${report.title.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    info('Report Downloaded', `${report.title} exported as ${report.format} file.`);
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900" dir={direction}>
      {/* Top Page Header */}
      <PageHeader
        title="Academy Executive Dashboard"
        subtitle="Real-time institutional revenue, active student rosters, upcoming halaqahs, and workflow tasks."
        badge={{
          text: isDemo ? 'ACTIVE DEMO TERM' : 'LIVE ACADEMY PORTAL',
          variant: 'success',
        }}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToCourses?.()}
              leftIcon={<BookOpen className="w-4 h-4 text-slate-600" />}
            >
              Courses
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigateToAdmissions?.()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Admissions
            </Button>
          </div>
        }
      />

      {/* ======================================================== */}
      {/* 1. TOP STATS ROW (4 High-Impact Cards - Direct Inline Icons) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Revenue */}
        <Card className="p-6 sm:p-7 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold capitalize tracking-wider text-slate-500">
              Total Tuition Revenue
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 font-display tracking-tight">
              ${Number(revenueCalculated).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            {isDemo ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4%
                  </span>
                  <span className="text-slate-400 font-medium">vs last term</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Deposited securely via Stripe & Moyasar
                </p>
              </>
            ) : revenueCalculated > 0 ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Settled
                  </span>
                  <span className="text-slate-400 font-medium">active billing cycle</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Deposited via connected payment gateways
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-slate-400 font-medium">No transactions recorded yet</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  0 invoices paid
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Stat 2: Enrolled Students */}
        <Card className="p-6 sm:p-7 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold capitalize tracking-wider text-slate-500">
              Enrolled Students
            </span>
            <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 font-display tracking-tight">
              {studentsCount}
            </h3>
            {isDemo ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +12
                  </span>
                  <span className="text-slate-400 font-medium">admissions this week</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Active learners across all tracks
                </p>
              </>
            ) : studentsCount > 0 ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Active
                  </span>
                  <span className="text-slate-400 font-medium">enrolled learners</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Active learners across enrolled tracks
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-slate-400 font-medium">0 admissions this term</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  No enrolled learners yet
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Stat 3: Faculty & Teachers */}
        <Card className="p-6 sm:p-7 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold capitalize tracking-wider text-slate-500">
              Faculty & Instructors
            </span>
            <Users className="w-5 h-5 text-purple-600 shrink-0" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 font-display tracking-tight">
              {teachersCount}
            </h3>
            {isDemo ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-purple-700 font-semibold flex items-center gap-0.5">
                    <Video className="w-3.5 h-3.5" /> 2 Live
                  </span>
                  <span className="text-slate-400 font-medium">in live sessions now</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {isQuran ? 'Certified Qaris & Sheikhs' : 'Lead Faculty & Instructors'}
                </p>
              </>
            ) : teachersCount > 0 ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-purple-700 font-semibold flex items-center gap-0.5">
                    <Users className="w-3.5 h-3.5" /> Active
                  </span>
                  <span className="text-slate-400 font-medium">faculty assigned</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  {isQuran ? 'Certified Qaris & Sheikhs' : 'Lead Faculty & Instructors'}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-slate-400 font-medium">No instructors assigned yet</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  0 faculty members on roster
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Stat 4: Active Courses & Completion */}
        <Card className="p-6 sm:p-7 space-y-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold capitalize tracking-wider text-slate-500">
              Active Courses & Tracks
            </span>
            <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 font-display tracking-tight">
              {publishedCoursesCount}
            </h3>
            {isDemo ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 94%
                  </span>
                  <span className="text-slate-400 font-medium">completion rate</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Live Interactive & Self-paced Tracks
                </p>
              </>
            ) : publishedCoursesCount > 0 ? (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                  <span className="text-slate-400 font-medium">published tracks</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Open for student enrollment
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
                  <span className="text-slate-400 font-medium">No courses published</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  0 active tracks
                </p>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* ======================================================== */}
      {/* 2. REVENUE & ENROLLMENT ANALYTICS CHARTS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart (7 cols): Revenue Growth Trajectory */}
        <Card className="lg:col-span-7 p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="text-base font-semibold text-slate-900">Tuition Revenue Trajectory</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly revenue volume collected through payment processors
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setChartPeriod('6m')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  chartPeriod === '6m' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6 Months
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('1y')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  chartPeriod === '1y' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                12 Months
              </button>
            </div>
          </div>

          {revenueCalculated === 0 && !isDemo ? (
            <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <DollarSign className="w-8 h-8 text-slate-300 mb-2 shrink-0" />
              <p className="text-sm font-semibold text-slate-700">No revenue data recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Tuition revenue trajectory will display here once students submit payments via your connected gateways.
              </p>
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Right Chart (5 cols): Student Enrollment Growth */}
        <Card className="lg:col-span-5 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
                <h3 className="text-base font-semibold text-slate-900">Student Intake Volume</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                New learner enrollments by calendar month
              </p>
            </div>
            <Badge variant="success">Active Growth</Badge>
          </div>

          {studentsCount === 0 && !isDemo ? (
            <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <GraduationCap className="w-8 h-8 text-slate-300 mb-2 shrink-0" />
              <p className="text-sm font-semibold text-slate-700">No student intake recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Enrollment volume will display here once students submit admissions and register for courses.
              </p>
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value: any) => [value, 'Students']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* ======================================================== */}
      {/* 3. CALENDAR & SCHEDULED SESSIONS WIDGET */}
      {/* ======================================================== */}
      <Card className="p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">Academic Calendar & Upcoming Halaqahs</h3>
              <p className="text-xs text-slate-500">Live sessions, assessments, and faculty milestones scheduled for this month</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              October 2026
            </span>
          </div>
        </div>

        {/* Days of Month Bar */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedCalendarDate(day)}
              className={`p-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                selectedCalendarDate === day
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span className="block text-[10px] text-slate-400 font-normal">Day</span>
              <span>{day}</span>
            </button>
          ))}
        </div>

        {/* Scheduled Sessions List */}
        {scheduledSessions.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <CalendarIcon className="w-8 h-8 text-slate-300 mb-2 shrink-0" />
            <p className="text-sm font-semibold text-slate-700">No sessions scheduled for this date</p>
            <p className="text-xs text-slate-400 mt-1">Live classes and cohort sessions will appear here once scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {scheduledSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-start justify-between gap-3 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{session.title}</span>
                    {session.isLive ? (
                      <Badge variant="success" className="animate-pulse">Live Now</Badge>
                    ) : (
                      <Badge variant="default">{session.date}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {session.time}
                    </span>
                    <span>•</span>
                    <span>{session.instructor}</span>
                  </div>
                  <span className="inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {session.track}
                  </span>
                </div>

                {session.isLive ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigateTab ? onNavigateTab('classroom') : null}
                    leftIcon={<Video className="w-3.5 h-3.5" />}
                  >
                    Join
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => info('Class Details', `${session.title} with ${session.instructor} at ${session.time}`)}
                  >
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ======================================================== */}
      {/* 4. TASKS CHECKLIST TABLE & WORKFLOW TRACKER */}
      {/* ======================================================== */}
      <Card className="p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">Administrative Tasks & Action Queue</h3>
              <p className="text-xs text-slate-500">Track admissions reviews, certificate approvals, and operational milestones</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTaskFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  taskFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter('pending')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  taskFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter('completed')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  taskFilter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Done
              </button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddTaskModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4 text-slate-600" />}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold capitalize tracking-wider">
              <tr>
                <th className="px-4 py-3 w-10 text-center">Done</th>
                <th className="px-4 py-3">Task Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-slate-300 mb-1.5 shrink-0" />
                      <span className="text-xs font-semibold text-slate-600">No administrative tasks found</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Click &quot;Add Task&quot; above to add a workflow task.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      task.completed ? 'bg-slate-50/40 text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 mx-auto" />
                      )}
                    </td>
                    <td className={`px-4 py-3 font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {task.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{task.assignee}</td>
                    <td className="px-4 py-3 text-slate-500">{task.dueDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* 5. REPORTS TABLE & NOTIFICATIONS STREAM (2-Column Grid) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Table (7 cols) */}
        <Card className="lg:col-span-7 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">Institutional Reports & Audits</h3>
                <p className="text-xs text-slate-500">Official exportable summaries of tuition, attendance, and assessments</p>
              </div>
            </div>
            <Badge variant="default">{reports.length} Available</Badge>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold capitalize tracking-wider">
                <tr>
                  <th className="px-4 py-3">Report Name</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-7 h-7 text-slate-300 mb-1.5 shrink-0" />
                        <span className="text-xs font-semibold text-slate-600">No reports generated yet</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Official audits and ledgers will appear as terms and academic cycles progress.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div>
                          <span>{report.title}</span>
                          <span className="block text-[11px] text-slate-400">{report.size} • Generated {report.generatedDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{report.period}</td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded text-[11px] font-semibold">
                          {report.format}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report)}
                          leftIcon={<Download className="w-3.5 h-3.5 text-slate-600" />}
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Live Notifications Feed (5 cols) */}
        <Card className="lg:col-span-5 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">Live Activity Feed</h3>
                <p className="text-xs text-slate-500">Real-time alerts, admissions, and tuition receipts</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>

          <div className="space-y-3">
            {notificationsFeed.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Bell className="w-7 h-7 text-slate-300 mb-1.5 shrink-0" />
                <span className="text-xs font-semibold text-slate-600">No recent activity</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Real-time alerts, admissions, and tuition receipts will stream here live.</span>
              </div>
            ) : (
              notificationsFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{item.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 sm:p-7 space-y-4 bg-white shadow-2xl">
            <h3 className="text-base font-semibold text-slate-900">Create New Administrative Task</h3>
            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Countersign Ijazah Certificates..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
