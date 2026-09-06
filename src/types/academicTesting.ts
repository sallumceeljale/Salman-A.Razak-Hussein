export type TestId = 'det' | 'ielts' | 'sat';

export type NavGroupId = 'learn' | 'practise' | 'study-plan' | 'resources';

export type SectionKey = 
  | 'overview' 
  | 'skills' 
  | 'questions' 
  | 'practice'
  | 'strategies' 
  | 'roadmap' 
  | 'progress'
  | 'official-resources' 
  | 'recommended-educator';

export interface TestSkill {
  id: string;
  name: string;
  subscoreName: string;
  weightOrScale: string;
  description: string;
  keyCompetencies: string[];
}

export interface PracticeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface OriginalPracticeSample {
  id: string;
  prompt: string;
  passage?: string;
  taskInstructions: string;
  options?: PracticeOption[];
  modelResponseOrSolution: string;
  scoringFocus: string[];
}

export interface QuestionType {
  id: string;
  title: string;
  skillCategory: string;
  timeLimit: string;
  difficulty?: 'Foundational' | 'Standard' | 'Challenging';
  format: 'Adaptive Computer' | 'Audio/Spoken' | 'Extended Text' | 'Multiple Choice' | 'Fill in Blank' | 'Interactive Graph/Desmos';
  description: string;
  evaluatedSkills: string[];
  svtPracticeSample: OriginalPracticeSample;
  topStrategyTip: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  timeframe: string;
  focus: string;
  tasks: {
    id: string;
    label: string;
    details?: string;
  }[];
}

export interface PracticeStrategy {
  id: string;
  category: string;
  title: string;
  ruleSummary: string;
  inDepthExplanation: string;
  actionableStep: string;
}

export interface OfficialResource {
  id: string;
  title: string;
  provider: string;
  type: 'Portal' | 'Official Guide' | 'Software/App' | 'Whitepaper' | 'Practice Test';
  url: string;
  description: string;
  isPrimary: boolean;
}

export interface RecommendedEducator {
  name: string;
  channelTitle: string;
  channelUrl: string;
  imageAssetSrc: string;
  imageAlt: string;
  tagline: string;
  whyRecommended: string[];
  notablePlaylistsOrSeries: string[];
  disclaimer: string;
}

export interface TestOrientationData {
  whatItIs: string;
  whoTakesIt: string;
  majorSections: string;
  approxDuration: string;
  scoringScaleSummary: string;
  lastReviewedDate: string;
  sourceNote: string;
  primaryOfficialUrl: string;
  primaryOfficialLabel: string;
}

export interface AcademicTestData {
  id: TestId;
  name: string;
  shortCode: string;
  tagline: string;
  administeringBody: string;
  officialSiteUrl: string;
  testLogoSrc: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  
  // Quick orientation info
  orientation: TestOrientationData;

  // 1. Overview
  overview: {
    formatDescription: string;
    totalDuration: string;
    scoringScale: string;
    deliveryFormat: string;
    retakePolicy: string;
    validityPeriod: string;
    keyHighlights: { label: string; value: string }[];
    admissionsContext: string;
  };

  // 2. Skills Tested
  skills: TestSkill[];

  // 3. Question Types (with SVT-created original practice)
  questionTypes: QuestionType[];

  // 4. Preparation Roadmap
  roadmap: RoadmapPhase[];

  // 5. Practice Strategies
  strategies: PracticeStrategy[];

  // 6. Official Resources
  officialResources: OfficialResource[];

  // 7. Independent Recommended Educator (Optional/Present where verified)
  recommendedEducator?: RecommendedEducator;
}
