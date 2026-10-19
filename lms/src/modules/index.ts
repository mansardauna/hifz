export * from './registry';

// Common Core Modules (Universal across all 3 LMSs)
export * as WhiteboardModule from './common/whiteboard';
export * as VideoCallModule from './common/videocall';
export * as ClassroomModule from './common/classroom';
export * as EvaluationModule from './common/evaluation';
export * as CommunityModule from './common/community';
export * as BillingModule from './common/billing';
export * as NotificationsModule from './common/notifications';
export * as ProfileModule from './common/profile';

// Domain-Peculiar LMS Engines
export * as QuranLMSModule from './lms-quran';
export * as SchoolLMSModule from './lms-school';
export * as CodingLMSModule from './lms-coding';

// System Core Modules
export * as I18nModule from './i18n';
export * as AuthModule from './auth';
export * as AdminModule from './admin';
export * as SuperAdminModule from './superadmin';
