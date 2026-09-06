export type Destination = 
  | 'united-states'
  | 'saudi-arabia'
  | 'turkiye'
  | 'canada'
  | 'united-kingdom'
  | 'germany'
  | 'australia'
  | 'france'
  | 'netherlands'
  | 'malaysia';

export type UniversityDestinationId = Destination;

export type RequirementLevel =
  | 'common'
  | 'sometimes'
  | 'program-specific'
  | 'after-admission'
  | 'usually-not-required'
  | 'verify'
  | 'commonly-required'
  | 'sometimes-required'
  | 'required-for-certain-programs'
  | 'required-after-admission'
  | 'verify-with-university';

export type ComparisonRating = 
  | 'common' 
  | 'sometimes' 
  | 'program-specific' 
  | 'after-admission' 
  | 'usually-not-required' 
  | 'verify';

export type FinancialAidPolicy =
  | 'need-blind'
  | 'need-aware'
  | 'not-published'
  | 'verify';

export type TestingPolicy =
  | 'required'
  | 'test-optional'
  | 'test-flexible'
  | 'not-considered'
  | 'verify';

export type ApplicationPlanType = 
  | 'early-decision'
  | 'early-decision-2'
  | 'early-action'
  | 'restrictive-early-action'
  | 'regular-decision'
  | 'rolling';

export type TrackingStatus = 'not-started' | 'in-progress' | 'ready' | 'submitted';
export type DecisionStatus = 'pending' | 'admitted' | 'deferred' | 'waitlisted' | 'denied' | 'withdrawn';

export interface OfficialResource {
  label: string;
  url: string;
  organization: string;
  description?: string;
  lastReviewed?: string;
}

export interface PathwayStep {
  id: string;
  stepNumber: number;
  title: string;
  timelineEstimate: string;
  description: string;
  actionPoints?: string[];
}

export interface OfficialPortalLink {
  title: string;
  url: string;
  category: 'central-portal' | 'official-guidance' | 'scholarship' | 'visa-immigration';
  description: string;
}

export interface DestinationDocRequirement {
  id: string;
  name: string;
  requirementLevel: RequirementLevel;
  description: string;
  notes?: string;
}

export interface DestinationStandardizedTest {
  id: string;
  name: string;
  category: string;
  requirementLevel: RequirementLevel;
  description: string;
  typicalScoreBenchmark?: string;
  svtPreparationLink?: string;
}

export interface ScholarshipResourceItem {
  title: string;
  url: string;
  description: string;
}

export interface DestinationVisaInfo {
  proofOfFundsSummary: string;
  workRightsSummary: string;
  visaSteps: string[];
  officialVisaPortalTitle: string;
  officialVisaPortalUrl: string;
}

export interface RequirementItem {
  id: string;
  name: string;
  level: RequirementLevel;
  description: string;
  practicalTip?: string;
}

export interface GuideSectionItem {
  label: string;
  description: string;
  badge?: string;
  level?: RequirementLevel;
  link?: { text: string; url: string };
}

export interface GuideSection {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  paragraphs?: string[];
  items?: GuideSectionItem[];
  callout?: {
    type: 'info' | 'warning' | 'tip';
    title: string;
    text: string;
  };
}

export interface DestinationGuide {
  id: Destination;
  name: string;
  flag: string;
  tagline: string;
  summary: string;
  primaryApplicationRoute: string;
  systemSummary: string;
  sections: GuideSection[];
  commonRequirements: RequirementItem[];
  officialResources: OfficialResource[];
  timelineSteps: {
    period: string;
    title: string;
    description: string;
    actionableMilestone?: string;
  }[];
  scholarshipInfo: {
    overview: string;
    types: { title: string; description: string; tag?: string }[];
    realityCheck: string;
  };

  // Optional aliases / enriched computed properties
  countryName?: string;
  flagEmoji?: string;
  subtitle?: string;
  overview?: string;
  applicationStyle?: string;
  centralPortalName?: string;
  languageOfInstructionSummary?: string;
  estimatedTuitionRange?: string;
  estimatedLivingCostRange?: string;
  academicCalendarSummary?: string;
  lastReviewed?: string;
  verificationNotice?: string;
  keyFeatures?: string[];
  pathwaySteps?: PathwayStep[];
  officialLinks?: OfficialPortalLink[];
  documentRequirements?: DestinationDocRequirement[];
  standardizedTests?: DestinationStandardizedTest[];
  scholarshipOverview?: string;
  scholarshipResources?: ScholarshipResourceItem[];
  visaInfo?: DestinationVisaInfo;
}

export interface UniversityReference {
  id: string;
  name: string;
  shortCode: string;
  location: string;
  country: string;
  destination: Destination;
  applicationPlatform: string;
  admissionsUrl: string;
  financialAidUrl?: string;
  financialAidPolicy: FinancialAidPolicy;
  financialAidPolicyNote: string;
  meetsFullDemonstratedNeed: boolean | 'verify';
  testingPolicy: TestingPolicy;
  testingPolicyNote: string;
  englishRequirement: string;
  requiredFinancialAidForms?: string[];
  applicationDeadlinesNote?: string;
  financialAidDeadlinesNote?: string;
  lastReviewed: string;
  officialSourceLabel: string;
}

export interface UserTrackedUniversity {
  id: string;
  universityName: string;
  destination?: Destination;
  programName?: string;
  location?: string;
  applicationPlatform?: string;
  applicationPlan: ApplicationPlanType | string;
  applicationDeadline: string;
  scholarshipDeadline?: string;
  financialAidDeadline?: string;
  admissionsUrl?: string;
  financialAidUrl?: string;
  testingPolicy?: string;
  recommendationStatus: TrackingStatus;
  transcriptStatus: TrackingStatus;
  essayStatus: TrackingStatus;
  submissionStatus: TrackingStatus;
  financialAidStatus?: TrackingStatus;
  documentsCompleted?: boolean;
  testsCompleted?: boolean;
  decisionStatus: DecisionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityFilterState {
  searchQuery: string;
  destination: Destination | 'all';
  financialAidPolicy: FinancialAidPolicy | 'all';
  testingPolicy: TestingPolicy | 'all';
  platform: string;
}

export interface DocumentComparisonItem {
  id: string;
  documentName: string;
  category: 'identity' | 'academic' | 'testing' | 'written' | 'financial-visa';
  description: string;
  countryRatings: Record<Destination, {
    rating: ComparisonRating;
    note: string;
  }>;
}

export interface StandardizedTestGuideItem {
  id: string;
  name: string;
  shortCode: string;
  category: 'english-language' | 'local-language' | 'academic-admission';
  purpose: string;
  commonlyUsedIn: Destination[];
  verificationWarning: string;
  svtPrepSectionId?: string;
  officialUrl: string;
  officialLabel: string;
  scoreRangeOrScale?: string;
}
