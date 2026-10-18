export type LessonType = 'lecture' | 'practical_workshop' | 'reading' | 'assignment';

export interface PracticalChecklistStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  requiredProof?: 'photo' | 'video' | 'text';
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswerIndex: number; // For multiple choice / true-false
  explanation?: string;
  points: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weightPercent: number;
}

export interface SchoolAssessment {
  id: string;
  title: string;
  type: 'quiz' | 'practical_project' | 'written_exam';
  description: string;
  timeLimitMinutes?: number;
  passingScorePercent: number;
  questions?: QuizQuestion[]; // For quizzes
  practicalPrompt?: string; // For vocational submissions
  acceptedFileTypes?: string[]; // e.g. ['image/*', 'video/*', 'application/pdf']
  rubric?: RubricCriterion[]; // For teacher grading
}

export interface SchoolLesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  content: string; // Markdown / Workshop guide
  videoUrl?: string;
  attachments?: { name: string; url: string; size: string }[];
  practicalChecklist?: PracticalChecklistStep[];
  assessmentId?: string;
  isCompleted?: boolean;
}

export interface SchoolModule {
  id: string;
  title: string;
  description: string;
  lessons: SchoolLesson[];
}

export interface SchoolCourse {
  id: string;
  title: string;
  category: 'vocational_trade' | 'academic_general' | 'language_skills' | 'islamic_studies';
  description: string;
  thumbnail: string;
  instructorName: string;
  modules: SchoolModule[];
  assessments: SchoolAssessment[];
}

export interface StudentSubmissionRecord {
  id: string;
  assessmentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'needs_revision';
  score?: number;
  feedbackText?: string;
  feedbackAudioUrl?: string;
  uploadedFiles?: { name: string; url: string; type: string }[];
  quizAnswers?: Record<string, number>;
}
