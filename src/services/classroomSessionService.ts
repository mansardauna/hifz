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

  // Find active live session matching student's account ID, cohort, or level
  getActiveSessionForStudent(
    subdomain: string,
    studentId?: string,
    studentCohort?: string,
    studentLevel?: StudentLevelTier
  ): LiveClassSession | null {
    const sessions = this.getSessions(subdomain);
    const liveSessions = sessions.filter((s) => s.status === 'live');
    if (liveSessions.length === 0) return null;

    // 1. Direct student ID match
    if (studentId) {
      const directMatch = liveSessions.find(
        (s) => s.allowedStudentIds && s.allowedStudentIds.length > 0 && s.allowedStudentIds.includes(studentId)
      );
      if (directMatch) return directMatch;
    }

    // 2. Cohort match
    if (studentCohort) {
      const cohortMatch = liveSessions.find(
        (s) => s.targetCohort && s.targetCohort.toLowerCase() === studentCohort.toLowerCase()
      );
      if (cohortMatch) return cohortMatch;
    }

    // 3. Level match
    if (studentLevel) {
      const levelMatch = liveSessions.find(
        (s) => s.targetLevel === 'all' || s.targetLevel === studentLevel
      );
      if (levelMatch) return levelMatch;
    }

    // 4. Default to first open live session for this tenant
    return liveSessions[0] || null;
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
