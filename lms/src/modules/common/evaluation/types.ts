export type SubmissionType = 'quran_recitation' | 'school_assignment' | 'coding_challenge' | 'general';

export interface RubricScoreItem {
  id: string;
  label: string;
  labelAr?: string;
  weight: number; // 0 to 100
  score: number;  // 0 to 10
  feedback?: string;
}

export interface TeacherReviewSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  type: SubmissionType;
  title: string;
  subtitle: string;
  submittedAt: string;
  status: 'Pending' | 'Graded' | 'Needs Revision';
  
  // Quran specific fields
  audioUrl?: string;
  surahNumber?: number;
  surahName?: string;
  ayahStart?: number;
  ayahEnd?: number;
  tajweedMistakes?: string[];

  // School specific fields
  assignmentTitle?: string;
  courseTitle?: string;
  documentUrl?: string;
  textContent?: string;
  
  // Coding specific fields
  codeSnippet?: string;
  language?: string;
  testPassedCount?: number;
  totalTestCount?: number;

  // Evaluation results
  overallGrade?: string;
  overallScore?: number;
  rubricScores?: RubricScoreItem[];
  teacherRemarks?: string;
  voiceFeedbackUrl?: string;
  voiceFeedbackDurationSec?: number;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ReviewAdapterProps {
  submission: TeacherReviewSubmission;
  onUpdateRubric?: (rubricScores: RubricScoreItem[]) => void;
  onUpdateMistakes?: (mistakes: string[]) => void;
}
