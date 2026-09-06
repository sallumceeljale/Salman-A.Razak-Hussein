/**
 * SVT Admissions & Educational Source Review Records
 * 
 * Standard 4 Structure:
 * - Exact official source URL
 * - Relevant institution, country, program, and applicant category
 * - Applicable cycle or date when relevant
 * - Actual date checked
 * - Review status and unresolved questions
 * - Explicit policy distinctions (e.g. Need-blind admission vs. Meeting full demonstrated need)
 */

export interface SourceReviewRecord {
  id: string;
  topic: 'admissions-policy' | 'financial-aid' | 'testing-proficiency' | 'curriculum-visa';
  title: string;
  institutionOrBody: string;
  country: string;
  program: string;
  applicantCategory: string; // e.g. "International First-Year Undergraduate"
  applicableCycle: string;
  officialSourceUrl: string;
  officialSourceLabel: string;
  dateChecked: string; // ISO or YYYY-MM-DD
  reviewStatus: 'verified' | 'unresolved-questions' | 'pending-cycle-update';
  keyFindings: string[];
  policyNotesAndDistinctions: string;
  unresolvedQuestions?: string;
}

export const ADMISSIONS_SOURCE_RECORDS: SourceReviewRecord[] = [
  // 1. Princeton Financial Aid & Application Policy
  {
    id: 'src-princeton-finaid-2025',
    topic: 'financial-aid',
    title: 'Princeton Undergraduate Financial Aid Application Guidelines',
    institutionOrBody: 'Princeton University',
    country: 'United States',
    program: 'Undergraduate (First-Year)',
    applicantCategory: 'All First-Year Applicants (Domestic & International)',
    applicableCycle: '2024–2025 / 2025–2026 Cycle',
    officialSourceUrl: 'https://finaid.princeton.edu/apply-aid-prospective-students',
    officialSourceLabel: 'Princeton Undergraduate Financial Aid Prospective Students Portal',
    dateChecked: '2025-02-15',
    reviewStatus: 'verified',
    keyFindings: [
      'Princeton operates a need-blind admission policy for both domestic and international undergraduate applicants.',
      'Princeton meets 100% of demonstrated financial need with grant aid rather than student loans.',
      'Prospective undergraduate applicants must submit the Princeton Financial Aid Application (PFAA) directly through Princeton’s applicant portal. Princeton does NOT use or require the CSS Profile for prospective undergraduate financial aid.'
    ],
    policyNotesAndDistinctions: 'Crucial distinction: Admissions evaluation is need-blind; financial aid package calculation is conducted through the institutional PFAA (not CSS Profile). Meeting full demonstrated need means calculated family contribution is subtracted from total cost of attendance and covered with grants.'
  },

  // 2. Duolingo English Test (DET) Hardware, Subscores, and Secondary Camera Protocols
  {
    id: 'src-det-subscores-and-security',
    topic: 'testing-proficiency',
    title: 'DET 4 Integrated Subscores & Computer-Adaptive Scoring Framework',
    institutionOrBody: 'Duolingo, Inc. (Duolingo English Test)',
    country: 'Global / Standardized Assessment',
    program: 'Certified Higher Education English Assessment',
    applicantCategory: 'All Test Takers (Undergraduate & Graduate Applicants)',
    applicableCycle: 'Current Test Specifications (2024–2025)',
    officialSourceUrl: 'https://blog.englishtest.duolingo.com/det-subscores/',
    officialSourceLabel: 'Official Duolingo English Test Subscores Research & Guide',
    dateChecked: '2025-02-15',
    reviewStatus: 'verified',
    keyFindings: [
      'Overall test score is reported on a scale of 10–160 in 5-point increments.',
      'Four integrated subscores are reported: Literacy (Reading & Writing), Comprehension (Reading & Listening), Conversation (Listening & Speaking), and Production (Writing & Speaking).',
      'Each subscore evaluates integrated linguistic modalities rather than isolated skills.'
    ],
    policyNotesAndDistinctions: 'Institutions set their own subscore minimums and composite requirements. A test score does not guarantee admission or language waiver without verification against individual university thresholds.'
  },

  // 3. Duolingo English Test (DET) Room Scanning and Secondary Camera Setup
  {
    id: 'src-det-room-scan-secondary-camera',
    topic: 'testing-proficiency',
    title: 'DET Testing Environment Setup & Secondary Camera Room Scan Protocol',
    institutionOrBody: 'Duolingo, Inc. (Duolingo English Test)',
    country: 'Global / Standardized Assessment',
    program: 'Remote Proctoring & Test Security',
    applicantCategory: 'All Test Takers',
    applicableCycle: 'Current Proctoring Protocol',
    officialSourceUrl: 'https://blog.englishtest.duolingo.com/duolingo-english-test-setup-secondary-camera-room-scan/',
    officialSourceLabel: 'Official Duolingo English Test Room Scan & Setup Guide',
    dateChecked: '2025-02-15',
    reviewStatus: 'verified',
    keyFindings: [
      'Test takers must test in a private, quiet room with no other people present.',
      'Candidates need a supported computer (desktop/laptop) with working webcam, microphone, speakers, and reliable internet connection.',
      'Test takers may be prompted during onboarding to use a secondary camera device (such as a smartphone with QR code pairing) to perform a 360-degree environment room scan and monitor testing area security during the session.',
      'Browser extensions, dual monitors, headphones/earbuds, and unauthorized recording software are strictly prohibited.'
    ],
    policyNotesAndDistinctions: 'Setup requirements are strictly enforced by AI proctoring checks and human proctors. Violations lead to test invalidation without certification.'
  },

  // 4. Distinction Between Need-Blind Admissions and Meeting Full Demonstrated Need
  {
    id: 'src-need-blind-vs-full-need-distinction',
    topic: 'admissions-policy',
    title: 'Admissions Evaluation (Need-Blind vs. Need-Aware) vs. Financial Aid Awarding (Meeting Full Need)',
    institutionOrBody: 'Standard Higher Education Admissions Practice',
    country: 'United States',
    program: 'Undergraduate Admissions',
    applicantCategory: 'International Applicants',
    applicableCycle: 'General Admissions Policy Structure',
    officialSourceUrl: 'https://educationusa.state.gov/your-5-steps-us-study',
    officialSourceLabel: 'EducationUSA (U.S. Department of State)',
    dateChecked: '2025-02-15',
    reviewStatus: 'verified',
    keyFindings: [
      'Need-Blind vs. Need-Aware describes whether an admissions committee evaluates an applicant’s financial need when deciding to offer admission.',
      'Meeting 100% of Demonstrated Need describes the financial aid office’s commitment to bridge the gap between estimated family contribution and total cost of attendance for admitted students.',
      'These are two separate policies: A university can be Need-Aware during selection, yet commit to Meeting 100% of Demonstrated Need for all admitted international students (e.g. Stanford, Columbia, UPenn, Duke).'
    ],
    policyNotesAndDistinctions: 'International students should not assume need-aware colleges offer no financial assistance; many need-aware private institutions award extensive aid packages to the international students they select.'
  },

  // 5. Letter of Recommendation & Testing Material Variation
  {
    id: 'src-recommendations-and-materials-variation',
    topic: 'admissions-policy',
    title: 'Non-Universality of Recommendation Counts and Standardized Testing Across Destinations',
    institutionOrBody: 'International Admissions Standards (US, UK, Canada, Europe)',
    country: 'Multi-Destination (US, UK, Canada, Germany, Saudi Arabia, Turkiye)',
    program: 'Undergraduate Admissions',
    applicantCategory: 'All Secondary School Leavers',
    applicableCycle: '2024–2025 / 2025–2026',
    officialSourceUrl: 'https://www.commonapp.org/apply/first-year-students',
    officialSourceLabel: 'Common Application First-Year Guidelines & UCAS Application Guide',
    dateChecked: '2025-02-15',
    reviewStatus: 'verified',
    keyFindings: [
      'Application requirements vary significantly by country and individual institution.',
      'Recommendation letters (often 1–2 teachers + 1 counselor in holistic U.S. colleges) are not required by UK UCAS (requires 1 academic reference) or many Canadian, German, and European universities (which evaluate transcripts and diplomas directly).',
      'Standardized tests (SAT/ACT) are required by some U.S. institutions, optional or not considered at others, and not utilized for direct entry in many global university systems.'
    ],
    policyNotesAndDistinctions: 'Always verify institution-specific requirements on official college websites rather than applying one country’s holistic checklist to another.'
  }
];

export function getSourceRecordsByTopic(topic: SourceReviewRecord['topic']): SourceReviewRecord[] {
  return ADMISSIONS_SOURCE_RECORDS.filter(r => r.topic === topic);
}

export function getSourceRecordById(id: string): SourceReviewRecord | undefined {
  return ADMISSIONS_SOURCE_RECORDS.find(r => r.id === id);
}
