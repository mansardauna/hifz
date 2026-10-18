import { TenantNiche } from '../types';
import { StudentLevelTier } from '../components/classroom/LiveClassroomHub';

export interface LiveClassSession {
  id: string; // Deterministic room ID (e.g., "hifz-halaqah-101")
  title: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  targetLevel: StudentLevelTier | 'all';
  targetCohort: string; // e.g. "Halaqah Al-Nour", "Cohort Alpha", "Grade 11-A"
  allowedStudentIds: string[]; // empty means all students in cohort/tenant
  startedAt: string;
  status: 'waiting' | 'live' | 'ended';
  subdomain: string;
  niche: TenantNiche;
  sessionNotes?: string;
  enableP2PMesh?: boolean;
}

const STORAGE_PREFIX = 'hifz_live_sessions_';
const BROADCAST_CHANNEL_NAME = 'hifz_class_sessions_broadcast';

// Safe BroadcastChannel retrieval for cross-tab realtime sync
function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return null;
}

export const classroomSessionService = {
  // Get all active sessions for a tenant subdomain
  getSessions(subdomain: string): LiveClassSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${subdomain}`);
      if (!data) return [];
      const sessions: LiveClassSession[] = JSON.parse(data);
      // Filter out ended sessions older than 4 hours
      return sessions.filter((s) => s.status !== 'ended');
    } catch {
      return [];
    }
  },

  // Get single session by ID
  getSessionById(subdomain: string, sessionId: string): LiveClassSession | null {
    const sessions = this.getSessions(subdomain);
    return sessions.find((s) => s.id === sessionId) || null;
  },

  // Start or register a new live classroom session (Teacher / Admin Host)
  startSession(session: LiveClassSession): LiveClassSession {
    if (typeof window === 'undefined') return session;
    try {
      const existing = this.getSessions(session.subdomain);
      const updated = [
        session,
        ...existing.filter((s) => s.id !== session.id)
      ];
      localStorage.setItem(`${STORAGE_PREFIX}${session.subdomain}`, JSON.stringify(updated));

      // Broadcast event to all open student tabs
      const bc = getBroadcastChannel();
      if (bc) {
        bc.postMessage({
          type: 'SESSION_STARTED',
          session
        });
        bc.close();
      }
    } catch (e) {
      console.warn('Error saving live class session:', e);
    }
    return session;
  },

  // End an active live session
  endSession(subdomain: string, sessionId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getSessions(subdomain);
      const updated = existing.map((s) => (s.id === sessionId ? { ...s, status: 'ended' as const } : s));
      localStorage.setItem(`${STORAGE_PREFIX}${subdomain}`, JSON.stringify(updated));

      const bc = getBroadcastChannel();
      if (bc) {
        bc.postMessage({
          type: 'SESSION_ENDED',
          sessionId,
          subdomain
        });
        bc.close();
      }
    } catch (e) {
      console.warn('Error ending live session:', e);
    }
  },

  // Find active live session matching student's account ID, enrolled course, or cohort
  getActiveSessionForStudent(
    subdomain: string,
    studentId?: string,
    studentCohort?: string,
    enrolledCourseTitle?: string,
    studentLevel?: StudentLevelTier
  ): LiveClassSession | null {
    const sessions = this.getSessions(subdomain);
    const liveSessions = sessions.filter((s) => s.status === 'live');
    if (liveSessions.length === 0) return null;

    // 1. Direct student ID match (if teacher targeted specific students)
    if (studentId) {
      const directMatch = liveSessions.find(
        (s) => s.allowedStudentIds && s.allowedStudentIds.length > 0 && s.allowedStudentIds.includes(studentId)
      );
      if (directMatch) return directMatch;
    }

    // 2. Exact enrolled course match
    if (enrolledCourseTitle) {
      const cleanCourse = enrolledCourseTitle.trim().toLowerCase();
      const courseMatch = liveSessions.find((s) => {
        if (!s.courseTitle) return false;
        const targetCourse = s.courseTitle.trim().toLowerCase();
        return (
          targetCourse === cleanCourse ||
          targetCourse.includes(cleanCourse) ||
          cleanCourse.includes(targetCourse)
        );
      });
      if (courseMatch) return courseMatch;
    }

    // 3. Cohort match
    if (studentCohort) {
      const cleanCohort = studentCohort.trim().toLowerCase();
      const cohortMatch = liveSessions.find((s) => {
        if (!s.targetCohort) return false;
        const target = s.targetCohort.trim().toLowerCase();
        return (
          target === cleanCohort ||
          target.includes(cleanCohort) ||
          cleanCohort.includes(target)
        );
      });
      if (cohortMatch) return cohortMatch;
    }

    // 4. Fallback only if session is explicitly open to all students and unassigned
    const openGeneralSession = liveSessions.find(
      (s) =>
        (!s.allowedStudentIds || s.allowedStudentIds.length === 0) &&
        (s.targetCohort?.toLowerCase() === 'all' || s.targetCohort?.toLowerCase() === 'all cohorts')
    );

    return openGeneralSession || null;
  },

  // Generate shareable student direct invitation URL
  generateInviteLink(subdomain: string, sessionId: string): string {
    if (typeof window === 'undefined') return `/${subdomain}/lms?tab=classroom&roomId=${sessionId}`;
    const origin = window.location.origin;
    return `${origin}/${subdomain}/lms?tab=classroom&roomId=${encodeURIComponent(sessionId)}`;
  },

  // Subscribe to live session events (Cross-tab realtime wakeup)
  subscribe(onEvent: (event: { type: 'SESSION_STARTED' | 'SESSION_ENDED'; session?: LiveClassSession; sessionId?: string }) => void): () => void {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return () => {};
    }
    const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    bc.onmessage = (e) => {
      if (e.data) {
        onEvent(e.data);
      }
    };
    return () => {
      bc.close();
    };
  }
};
