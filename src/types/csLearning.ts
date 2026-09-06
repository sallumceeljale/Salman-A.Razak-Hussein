export type CsTrackId = 
  | 'computer-fundamentals'
  | 'programming-problem-solving'
  | 'python-foundations'
  | 'web-development'
  | 'ai-literacy-responsible-use';

export interface LessonConceptCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CsLesson {
  id: string;
  number: number;
  title: string;
  estimatedMinutes: number;
  summary: string;
  keyPoints: string[];
  codeExample?: {
    language: string;
    code: string;
    caption: string;
  };
  conceptCheck?: LessonConceptCheck;
}

export interface PracticalActivity {
  title: string;
  estimatedMinutes: number;
  objective: string;
  materialsNeeded: string;
  stepByStepGuide: string[];
  expectedOutput: string;
  proTip: string;
}

export interface TrackProject {
  id: string;
  title: string;
  type: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  starterSteps: string[];
  deliverableCriteria: string[];
  interactiveDemoId?: 'quiz' | 'volunteer-calc' | 'study-planner' | 'resource-dir' | 'ai-checklist';
}

export interface VerifiedResource {
  title: string;
  provider: string;
  url: string;
  format: string;
  isFree: boolean;
  svtSummary: string;
}

export interface TrackChecklistItem {
  id: string;
  title: string;
  description: string;
}

export interface CsTrack {
  id: CsTrackId;
  title: string;
  subtitle: string;
  iconName: string;
  overview: string;
  prerequisites: string[];
  learningObjectives: string[];
  estimatedTime: string;
  lessons: CsLesson[];
  practicalActivity: PracticalActivity;
  project: TrackProject;
  completionChecklist: TrackChecklistItem[];
  verifiedResources: VerifiedResource[];
  nextStep: {
    title: string;
    recommendation: string;
    suggestedTrackId?: CsTrackId;
  };
}

export interface CsHubProgress {
  completedLessons: string[];
  completedActivities: string[];
  completedProjects: string[];
  completedChecklistItems: string[];
  lastUpdated: string;
}
