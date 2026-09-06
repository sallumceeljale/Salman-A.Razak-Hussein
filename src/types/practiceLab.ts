export type PracticeCategory = 'foundations' | 'det' | 'ielts';

export type PracticeDifficulty = 'Foundation' | 'Intermediate' | 'Advanced';

export type ExerciseType = 
  | 'multiple-choice'
  | 'fill-in-blank'
  | 'read-and-complete'
  | 'sentence-clarity'
  | 'short-writing'
  | 'speaking-prep';

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string; // Explains why this choice is correct or incorrect
}

export interface PracticeExercise {
  id: string;
  category: PracticeCategory;
  categoryLabel: string;
  skill: string;
  difficulty: PracticeDifficulty;
  title: string;
  instructions: string;
  passage?: string; // Optional reading passage or context
  promptText: string;
  exerciseType: ExerciseType;
  // For multiple-choice & clarity
  options?: ExerciseOption[];
  // For fill-in-the-blank / read-and-complete
  blanks?: {
    id: string;
    prefixText?: string;
    correctAnswer: string;
    acceptableAnswers?: string[];
    hint?: string;
  }[];
  // For writing & speaking prompts
  sampleSolution?: {
    overview: string;
    modelResponse: string;
    structureBreakdown: string[];
    keyVocabulary: string[];
  };
  // Educational Rule & Strategy
  coreRule: string;
  strategyTip: string;
  suggestedTimeSeconds?: number;
}

export interface StoredPracticeProgress {
  completedExerciseIds: string[];
  correctExerciseIds: string[];
  attempts: Record<string, {
    lastAttemptDate: string;
    isCorrect: boolean;
    userAnswers: Record<string, string>;
  }>;
}
