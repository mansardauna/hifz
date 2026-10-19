export interface TestCase {
  id: string;
  description: string;
  testCode: string; // JavaScript assertion expression e.g. "add(2, 3) === 5"
  expectedOutput?: string;
  hidden?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'sql';
  instructions: string; // Markdown / HTML
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: TestCase[];
  order: number;
}

export interface CodingModule {
  id: string;
  title: string;
  description: string;
  challenges: CodingChallenge[];
}

export interface CodingTrack {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  modules: CodingModule[];
}

export interface TestResult {
  testId: string;
  description: string;
  passed: boolean;
  error?: string;
}
