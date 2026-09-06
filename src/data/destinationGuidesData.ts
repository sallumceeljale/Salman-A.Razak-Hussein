import { DestinationGuide } from '../types/universityApplications';

export const DESTINATION_GUIDES: DestinationGuide[] = [
  // =========================================================================
  // 1. UNITED STATES
  // =========================================================================
  {
    id: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    tagline: 'Holistic admissions, Common App, need-blind & need-aware financial aid.',
    summary: 'U.S. university admissions evaluate applicants holistically, reviewing academic transcripts, testing, extracurricular impact, teacher recommendations, and personal essays.',
    primaryApplicationRoute: 'Common App & Direct University Portals',
    systemSummary: 'The U.S. does not have a single centralized national admissions authority. While over 1,000 institutions use the Common Application, some major universities (such as MIT, Georgetown, or the University of California system) use dedicated application portals or specialized state systems.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Holistic Review & Multi-Platform Landscape',
        paragraphs: [
          'Undergraduate admission in the United States is famously holistic. Admissions committees look beyond raw grades and test scores to understand who you are, your intellectual curiosity, personal character, background, and how you have contributed to your school and community.',
          'There is no national admissions office in the U.S. Each university sets its own criteria, deadlines, and financial aid policies for international applicants.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Platforms, Application Plans & Decision Timelines',
        paragraphs: [
          'Most international students apply through the Common Application (Common App), but you should always verify if your chosen college requires its own portal (e.g., MIT Application, UC Application, Coalition on Scoir).',
          'U.S. colleges offer several application plans: Early Decision (binding commitment), Early Action (non-binding early submission), Restrictive Early Action (non-binding with single-school restrictions), and Regular Decision.'
        ],
        items: [
          {
            label: 'Common Application',
            description: 'Centralized platform used by 1,000+ colleges. Submit one profile, activities list, and main personal essay to multiple universities.',
            badge: 'Primary Route'
          },
          {
            label: 'Direct Institutional Portals',
            description: 'Custom application platforms maintained by select institutions (e.g., MIT, Georgetown University).',
            badge: 'Direct Route'
          },
          {
            label: 'State University Systems',
            description: 'Regional systems with shared applications (e.g., University of California, ApplyTexas).',
            badge: 'System Route'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Academic, Extracurricular & Personal Components',
        paragraphs: [
          'U.S. applications require multiple components submitted over several months. Plan ahead so your school counselor and teachers have sufficient time to submit official documents.'
        ],
        items: [
          {
            label: 'Secondary School Transcript & School Report',
            description: 'Official record of courses and grades from Grades 9 through 12, submitted directly by your school counselor.',
            level: 'commonly-required'
          },
          {
            label: 'Common App Personal Essay (650 words)',
            description: 'Reflective personal statement answering one of seven prompts demonstrating your authentic voice and values.',
            level: 'commonly-required'
          },
          {
            label: 'Institutional Supplemental Essays',
            description: 'University-specific prompts explaining why you wish to attend and how you align with specific academic departments.',
            level: 'commonly-required'
          },
          {
            label: 'Letters of Recommendation (2 Teachers + 1 Counselor)',
            description: 'Confidential letters evaluating your intellectual engagement, work ethic, and character.',
            level: 'commonly-required'
          },
          {
            label: 'Extracurricular Activities & Honors List (10 activities)',
            description: 'Summary of leadership, volunteering, clubs, athletics, family responsibilities, or work experience.',
            level: 'commonly-required'
          },
          {
            label: 'Standardized Test Scores (SAT or ACT)',
            description: 'Check individual university testing policies (Required, Test-Optional, or Test-Flexible).',
            level: 'sometimes-required'
          },
          {
            label: 'English Proficiency Exam (DET, IELTS, or TOEFL)',
            description: 'Required for non-native English speakers or students whose medium of secondary instruction was not English.',
            level: 'commonly-required'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Materials to Prepare with Your School',
        items: [
          {
            label: 'Official High School Transcripts (9th–12th grades)',
            description: 'Must include certified English translations if original records are in another language.',
            level: 'commonly-required'
          },
          {
            label: 'School Profile & Counselor Report',
            description: 'Background document providing context on your high school curriculum, grading scale, and demographics.',
            level: 'commonly-required'
          },
          {
            label: 'Mid-Year School Report & Final Transcript',
            description: 'Updated 12th grade first-semester marks and final graduation certificate submitted after admission.',
            level: 'required-after-admission'
          },
          {
            label: 'Financial Certification & Bank Statements',
            description: 'Required for visa processing (Form I-20) and international financial aid verification.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'SAT, ACT, DET, IELTS, TOEFL Policies',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'Many U.S. universities operate under Test-Optional policies, but several top institutions have reinstated required SAT/ACT submission. Always verify each college’s current policy on their official admissions page.'
        ],
        items: [
          {
            label: 'Digital SAT / ACT',
            description: 'Standardized assessment of math, reading, and writing. Some colleges require it; others evaluate it optionally.',
            level: 'sometimes-required',
            link: { text: 'View SVT SAT Prep Hub', url: '#sat' }
          },
          {
            label: 'Duolingo English Test (DET)',
            description: 'Widely accepted adaptive online English proficiency exam (common benchmark: 120–135+).',
            level: 'commonly-required',
            link: { text: 'View SVT DET Prep Hub', url: '#det' }
          },
          {
            label: 'IELTS Academic / TOEFL iBT',
            description: 'Traditional certified English language proficiency exams (common benchmarks: IELTS 7.0–7.5+, TOEFL 100+).',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Need-Blind vs. Need-Aware Financial Aid & Merit Awards',
        paragraphs: [
          'U.S. financial aid for international students is distinct from domestic aid. International students cannot receive U.S. federal student aid (FAFSA), but top private universities offer substantial institutional need-based grants or merit scholarships.',
          'Need-Blind universities evaluate your application without considering your financial need and meet 100% of demonstrated need if admitted. Need-Aware colleges take your financial need into account during the admissions evaluation.'
        ],
        items: [
          {
            label: 'CSS Profile (College Board)',
            description: 'Standard online financial aid application used by private U.S. universities to calculate family contribution.',
            level: 'commonly-required'
          },
          {
            label: 'Institutional International Aid Forms (ISFAA / PFAA)',
            description: 'Custom university forms used by select colleges instead of or in addition to the CSS Profile.',
            level: 'sometimes-required'
          },
          {
            label: 'Merit-Based International Scholarships',
            description: 'Competitive scholarships awarded for academic excellence, leadership, or specialized talents, often with early deadlines.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Standard U.S. Admissions Calendar',
        paragraphs: [
          'U.S. admissions planning generally begins 12–18 months prior to intended enrollment.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Government & Platform Links',
        items: [
          {
            label: 'EducationUSA (U.S. Department of State)',
            description: 'Official U.S. government advising network with step-by-step guidance on U.S. study.',
            link: { text: 'Visit EducationUSA', url: 'https://educationusa.state.gov/your-5-steps-us-study' }
          },
          {
            label: 'Common Application Official Portal',
            description: 'Undergraduate application platform connecting over 1,000 U.S. higher education institutions.',
            link: { text: 'Visit Common App', url: 'https://www.commonapp.org/apply/first-year-students' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'us-transcripts', name: 'High School Transcripts (9–12)', level: 'commonly-required', description: 'Certified grades from the past four years of secondary education.' },
      { id: 'us-essay', name: 'Common App Personal Statement', level: 'commonly-required', description: '650-word personal reflective essay.' },
      { id: 'us-supplements', name: 'Supplemental Essays', level: 'commonly-required', description: 'Institution-specific short answer prompts.' },
      { id: 'us-recs', name: 'Teacher & Counselor Recommendations', level: 'commonly-required', description: 'Two academic teacher references and one school counselor evaluation.' },
      { id: 'us-english', name: 'English Proficiency Exam (DET/IELTS/TOEFL)', level: 'commonly-required', description: 'Required for students whose primary language is not English.' },
      { id: 'us-sat', name: 'Standardized Testing (SAT/ACT)', level: 'sometimes-required', description: 'Required by some colleges; test-optional at others.' },
      { id: 'us-finaid', name: 'CSS Profile & Tax Statements', level: 'sometimes-required', description: 'Required if applying for need-based institutional financial aid.' }
    ],
    officialResources: [
      {
        label: 'EducationUSA: Your 5 Steps to U.S. Study',
        url: 'https://educationusa.state.gov/your-5-steps-us-study',
        organization: 'U.S. Department of State',
        description: 'Official advising network with accredited guidance on university selection, financing, and student visas.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'Common App First-Year Application Guide',
        url: 'https://www.commonapp.org/apply/first-year-students',
        organization: 'The Common Application',
        description: 'Official student walkthrough for completing the primary U.S. undergraduate application.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'Spring / Summer (Grade 11)', title: 'Research & Testing', description: 'Draft university list, sit for SAT/ACT and English tests (DET/IELTS), and brainstorm essay topics.', actionableMilestone: 'Shortlist 10–15 target universities.' },
      { period: 'August 1', title: 'Common App Opens', description: 'Create Common App account, add colleges, and review college-specific supplemental questions.', actionableMilestone: 'Finalize Common App main essay draft.' },
      { period: 'October – November', title: 'Early Deadlines (EA / ED / REA)', description: 'Submit Early Action (Nov 1/15) applications and CSS Profile financial aid documentation.', actionableMilestone: 'Confirm teacher recommendations are submitted.' },
      { period: 'December – January', title: 'Regular Decision Submissions', description: 'Submit Regular Decision applications (typically Jan 1–15) and financial aid materials.', actionableMilestone: 'Track applicant portal checklist completion.' },
      { period: 'March – April', title: 'Admissions Decisions Released', description: 'Review acceptance letters, financial aid award offers, and attend virtual admitted student events.', actionableMilestone: 'Compare net cost and enrollment commitments.' },
      { period: 'May 1', title: 'National College Decision Day', description: 'Submit enrollment deposit and begin Form I-20 and F-1 student visa paperwork.', actionableMilestone: 'Deposit at chosen university.' }
    ],
    scholarshipInfo: {
      overview: 'U.S. private colleges provide some of the largest institutional grant endowments in the world, while public universities rarely offer need-based aid to international students.',
      types: [
        { title: 'Need-Based Institutional Aid', description: 'Grants calculated based on demonstrated financial need (CSS Profile). Offered by select top private universities.', tag: 'Need-Based' },
        { title: 'Merit-Based Scholarships', description: 'Awarded for outstanding academic GPA, test scores, or leadership regardless of financial need.', tag: 'Merit' },
        { title: 'External / Private Scholarships', description: 'Independent foundations and organizations providing international study grants.', tag: 'External' }
      ],
      realityCheck: 'Need-blind admissions for international students is offered by a very small group of highly selective institutions. Most colleges are need-aware, meaning requesting substantial financial aid increases admissions competition.'
    }
  },

  // =========================================================================
  // 2. SAUDI ARABIA
  // =========================================================================
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    tagline: 'Official Study in Saudi portal, government scholarship tiers & research universities.',
    summary: 'Saudi Arabia offers major research universities and structured government scholarship tracks through the centralized Study in Saudi platform.',
    primaryApplicationRoute: 'Study in Saudi Official Portal (studyinsaudi.sa)',
    systemSummary: 'International admissions for undergraduate and graduate programs are coordinated centrally through the Ministry of Education’s Study in Saudi platform (studyinsaudi.sa/en). Students create one profile to apply to accredited Saudi universities and government scholarship tracks.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Centralized Admissions & Academic Tiers',
        paragraphs: [
          'Saudi Arabia has invested heavily in higher education under Vision 2030, building internationally recognized research universities like KFUPM, King Saud University, and KAUST.',
          'International applicants apply through the official Ministry of Education platform: Study in Saudi (studyinsaudi.sa/en). The portal centralizes application submission, eligibility review, and educational visa sponsorship.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Study in Saudi Portal Steps',
        paragraphs: [
          '1. Create an electronic account on the official portal (https://studyinsaudi.sa/en).',
          '2. Browse available degree tracks, faculties, and medium of instruction (English or Arabic).',
          '3. Upload attested high school certificates, transcripts, and passport identification.',
          '4. Select your preferred universities and submit for Ministry and university review.'
        ],
        items: [
          {
            label: 'Study in Saudi Portal (Official)',
            description: 'The sole authorized government electronic portal for international student applications to Saudi universities.',
            badge: 'Official Platform'
          },
          {
            label: 'Direct Graduate / Specialized Portals',
            description: 'Select graduate research institutions like KAUST and KFUPM Graduate College also operate direct institutional portals.',
            badge: 'Specialized'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Eligibility & Academic Thresholds',
        items: [
          {
            label: 'Attested High School Graduation Certificate',
            description: 'Secondary certificate recognized by the Ministry of Education with high minimum grade percentiles (often 85–90%+ for STEM).',
            level: 'commonly-required'
          },
          {
            label: 'Complete Academic Transcripts',
            description: 'Detailed grade breakdown for secondary school years with official translations if not in English or Arabic.',
            level: 'commonly-required'
          },
          {
            label: 'Valid International Passport',
            description: 'Must have at least 12 months of validity remaining for visa processing.',
            level: 'commonly-required'
          },
          {
            label: 'Language Proficiency (English or Arabic)',
            description: 'IELTS/TOEFL required for English-taught STEM curricula; Arabic placement test or language institute track for Arabic-taught programs.',
            level: 'commonly-required'
          },
          {
            label: 'Medical Fitness Certificate',
            description: 'Certified medical examination confirming freedom from infectious diseases.',
            level: 'required-after-admission'
          },
          {
            label: 'Police Clearance / Certificate of Good Conduct',
            description: 'Official criminal background check from home country required for visa issuance.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Attestation & Verification Steps',
        items: [
          {
            label: 'Secondary School Diploma (Attested)',
            description: 'Attested by the Ministry of Foreign Affairs and the Saudi Embassy / Cultural Mission in your home country.',
            level: 'commonly-required'
          },
          {
            label: 'Academic Transcripts with Certified Translation',
            description: 'Official English or Arabic translations of all school records.',
            level: 'commonly-required'
          },
          {
            label: 'Passport Copy & Recent ID Photos',
            description: 'Clear digital scan of the biographical page and white-background passport photograph.',
            level: 'commonly-required'
          },
          {
            label: 'Letters of Recommendation',
            description: 'Academic references from teachers or school counselors.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'Standardized Assessments & Medium of Instruction',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'For English-taught engineering and computer science programs (e.g., KFUPM), strong scores in SAT Math, IELTS Academic (6.0–6.5+), or TOEFL iBT (79–90+) are commonly requested.'
        ],
        items: [
          {
            label: 'IELTS Academic / TOEFL iBT',
            description: 'Required for English-taught faculties (Engineering, Medicine, Computing, Business).',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'SAT / Math Proficiency',
            description: 'Considered for competitive engineering and technical faculties.',
            level: 'sometimes-required',
            link: { text: 'View SVT SAT Prep Hub', url: '#sat' }
          },
          {
            label: 'Arabic Language Preparatory Institutes',
            description: 'Many public universities offer a 1–2 year preparatory Arabic immersion program for admitted international students.',
            level: 'required-for-certain-programs'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Three Official Government Tracks',
        paragraphs: [
          'The Saudi government provides three distinct funding categories for international students on the Study in Saudi portal: Fully Funded, Partially Funded, and Self-Funded.'
        ],
        items: [
          {
            label: 'Fully Funded Government Scholarship',
            description: 'Covers 100% of tuition, university housing, monthly living stipend, annual round-trip flight tickets, and health insurance.',
            badge: 'Full Scholarship'
          },
          {
            label: 'Partially Funded Scholarship',
            description: 'Covers tuition waivers or subsidized accommodation while students cover living expenses.',
            badge: 'Partial Aid'
          },
          {
            label: 'Self-Funded Study Program',
            description: 'Student or family covers competitive university tuition fees and personal living costs.',
            badge: 'Self-Funded'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Admission Rounds & Educational Visa Processing',
        paragraphs: [
          'Study in Saudi application cycles open periodically during the academic year. Visa issuance and security clearances take 8–16 weeks following institutional acceptance.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Government Link',
        items: [
          {
            label: 'Study in Saudi Official Portal',
            description: 'Authorized government gateway for international admissions to Saudi universities.',
            link: { text: 'Visit Study in Saudi', url: 'https://studyinsaudi.sa/en' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'sa-diploma', name: 'Attested High School Diploma', level: 'commonly-required', description: 'Secondary school completion certificate authenticated by Saudi cultural mission.' },
      { id: 'sa-transcripts', name: 'Full Academic Transcripts', level: 'commonly-required', description: 'Transcripts in Arabic or English with grading scale key.' },
      { id: 'sa-passport', name: 'Valid Passport Copy', level: 'commonly-required', description: 'Clear color copy with minimum 12-month validity.' },
      { id: 'sa-english', name: 'English Language Test (IELTS/TOEFL)', level: 'required-for-certain-programs', description: 'Required for degree programs instructed in English.' },
      { id: 'sa-medical', name: 'Medical Examination Report', level: 'required-after-admission', description: 'Standard health check required prior to educational visa issuance.' },
      { id: 'sa-conduct', name: 'Police Certificate of Good Conduct', level: 'required-after-admission', description: 'Official background clearance from home country authorities.' }
    ],
    officialResources: [
      {
        label: 'Study in Saudi (Official Platform)',
        url: 'https://studyinsaudi.sa/en',
        organization: 'Ministry of Education, Kingdom of Saudi Arabia',
        description: 'Official unified electronic admissions platform for international students across Saudi universities.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'October – January', title: 'Portal Registration & Application', description: 'Register on studyinsaudi.sa, select desired degree programs, and upload certified credentials.', actionableMilestone: 'Submit complete application before portal closing date.' },
      { period: 'February – April', title: 'Ministry & University Review', description: 'Applications undergo academic audit, quota distribution, and faculty evaluations.', actionableMilestone: 'Respond promptly to any additional document requests.' },
      { period: 'May – June', title: 'Official Admission Offers', description: 'Acceptance notifications are issued through the electronic portal along with scholarship tier assignment.', actionableMilestone: 'Confirm acceptance electronically.' },
      { period: 'July – August', title: 'Educational Visa & Travel', description: 'University issues visa authorization; submit passport to Saudi embassy for visa stamping and flight booking.', actionableMilestone: 'Receive student visa and prepare for arrival.' }
    ],
    scholarshipInfo: {
      overview: 'Saudi Arabia offers generous government scholarships to international students, but admission and scholarship awards are competitive and quota-governed.',
      types: [
        { title: 'Fully Funded Government Scholarships', description: 'Tuition waiver, subsidized housing, monthly stipend, travel tickets, and medical care.', tag: 'Fully Funded' },
        { title: 'Partially Funded Scholarships', description: 'Partial tuition assistance or subsidized campus facilities.', tag: 'Partial' },
        { title: 'Self-Funded Study', description: 'Paid tuition programs with standard student visa sponsorship.', tag: 'Self-Funded' }
      ],
      realityCheck: 'Applying for a scholarship through Study in Saudi does not guarantee admission or award. Never pay unauthorized intermediaries or third parties claiming guaranteed placement.'
    }
  },

  // =========================================================================
  // 3. TÜRKIYE
  // =========================================================================
  {
    id: 'turkiye',
    name: 'Türkiye',
    flag: '🇹🇷',
    tagline: 'Two distinct paths: Direct university admissions & the competitive Türkiye Scholarships program.',
    summary: 'Türkiye offers high-quality higher education connecting Europe and Asia. International students apply either directly to individual universities or through the government Türkiye Scholarships program.',
    primaryApplicationRoute: 'Direct University Portals & Türkiye Scholarships',
    systemSummary: 'International students have two distinct application paths in Türkiye: 1) Direct university admission via individual university international student portals, or 2) Türkiye Scholarships (Türkiye Bursları), a separate, highly competitive government scholarship program with its own centralized application.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Understanding the Two Independent Routes',
        paragraphs: [
          'Turkish higher education offers thousands of undergraduate programs across public and foundation (private) universities, taught in English or Turkish.',
          'Crucially, international students must understand that applying for regular university admission and applying for Türkiye Scholarships are two separate processes. Applying for Türkiye Scholarships is not required if you plan to apply directly to a university.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Route A: Direct Admission vs. Route B: Türkiye Scholarships',
        paragraphs: [
          'Route A (Direct University Admission): You research universities on Study in Türkiye (studyinturkiye.gov.tr), apply directly on each university’s international admissions portal, submit required test scores or high school grades, and pay applicable tuition fees upon acceptance.',
          'Route B (Türkiye Scholarships): You apply online at turkiyeburslari.gov.tr during the annual January–February window. If selected through interviews, the scholarship covers full tuition, 1-year Turkish language preparatory year, accommodation, monthly stipend, flights, and health insurance.'
        ],
        items: [
          {
            label: 'Route A: Direct University Portals',
            description: 'Apply directly to public and foundation universities through their independent online international offices.',
            badge: 'Direct Admission'
          },
          {
            label: 'Route B: Türkiye Scholarships (Türkiye Bursları)',
            description: 'Centralized government scholarship program covering tuition, living allowance, and accommodation.',
            badge: 'Government Scholarship'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Academic Credentials & Entry Assessments',
        items: [
          {
            label: 'Secondary School Diploma (High School Certificate)',
            description: 'Original diploma with notarized Turkish or English translation.',
            level: 'commonly-required'
          },
          {
            label: 'Official Academic Transcript',
            description: 'Certified transcript covering all secondary school years.',
            level: 'commonly-required'
          },
          {
            label: 'Equivalence Certificate (Denklik Belgesi)',
            description: 'Official certification from the Turkish Ministry of National Education or Turkish Embassy confirming your high school diploma is equivalent to a Turkish high school diploma.',
            level: 'required-after-admission'
          },
          {
            label: 'Standardized Exam Score (TR-YÖS, SAT, or National Exam)',
            description: 'Many public universities evaluate the international student examination (TR-YÖS) or Digital SAT. Requirements differ significantly by university.',
            level: 'required-for-certain-programs'
          },
          {
            label: 'Language Proficiency (Turkish TÖMER or English IELTS/TOEFL)',
            description: 'Required depending on the medium of instruction. Turkish-taught programs require TÖMER B2/C1 certificate; English programs require certified English tests.',
            level: 'commonly-required'
          },
          {
            label: 'Passport & Biometric Photos',
            description: 'Valid passport and standard biometric photographs.',
            level: 'commonly-required'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Key Papers for Turkish Admissions',
        items: [
          {
            label: 'High School Diploma with Notarized Translation',
            description: 'Must be translated into Turkish or English by a certified sworn translator.',
            level: 'commonly-required'
          },
          {
            label: 'Equivalence Certificate (Denklik Belgesi)',
            description: 'Obtained from Turkish Embassies/Consulates abroad or provincial education directorates in Türkiye.',
            level: 'required-after-admission'
          },
          {
            label: 'Statement of Purpose / Motivation Letter',
            description: 'Required for Türkiye Scholarships applications and select private universities.',
            level: 'sometimes-required'
          },
          {
            label: 'Letters of Academic Recommendation',
            description: 'Required for Türkiye Scholarships candidates; optional at many direct admission universities.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'TR-YÖS, SAT, TÖMER, and English Exams',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'TR-YÖS (Türkiye Yurt Dışından Öğrenci Kabul Sınavı) is administered centrally by ÖSYM for international students applying to Turkish public universities. However, many universities also accept the Digital SAT, GCE A-Levels, IB diplomas, or national high school exit exam results.'
        ],
        items: [
          {
            label: 'TR-YÖS Exam (Central International Student Exam)',
            description: 'Standardized basic learning skills exam organized by ÖSYM for admission to Turkish public universities.',
            level: 'sometimes-required'
          },
          {
            label: 'Digital SAT',
            description: 'Widely accepted by top English-medium institutions (such as METU, Boğaziçi, ITU, Bilkent, Koç).',
            level: 'sometimes-required',
            link: { text: 'View SVT SAT Prep Hub', url: '#sat' }
          },
          {
            label: 'TÖMER Turkish Proficiency Certificate',
            description: 'Required for degree programs taught in Turkish (minimum B2 or C1 level).',
            level: 'required-for-certain-programs'
          },
          {
            label: 'IELTS Academic / TOEFL iBT',
            description: 'Required for programs taught 100% or 30% in English.',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Türkiye Scholarships & University Tuition Reductions',
        paragraphs: [
          'Public university tuition fees in Türkiye are relatively affordable for international students compared to North America and Western Europe, though rates vary by faculty (Medicine and Dentistry have higher rates).',
          'Türkiye Scholarships provides full funding for selected candidates. Private foundation universities frequently offer 25%, 50%, or 100% merit tuition waivers based on high school grades or SAT scores.'
        ],
        items: [
          {
            label: 'Türkiye Scholarships (Türkiye Bursları)',
            description: 'Government full award: tuition, accommodation, stipend, insurance, Turkish language preparatory course, and flight.',
            badge: 'Full Scholarship'
          },
          {
            label: 'Foundation University Merit Discounts',
            description: 'Partial or full tuition scholarships awarded automatically during admissions review at private universities.',
            badge: 'Merit Waiver'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Seasonal Calendar for Türkiye',
        paragraphs: [
          'Türkiye Scholarships applications run in January–February each year. Direct university admissions run from May through August for the Fall semester intake.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Government Portals',
        items: [
          {
            label: 'Study in Türkiye (Official Platform)',
            description: 'National portal managed by the Council of Higher Education (YÖK).',
            link: { text: 'Visit Study in Türkiye', url: 'https://www.studyinturkiye.gov.tr/' }
          },
          {
            label: 'Türkiye Scholarships (Türkiye Bursları)',
            description: 'Official government scholarship application system.',
            link: { text: 'Visit Türkiye Scholarships', url: 'https://www.turkiyeburslari.gov.tr/' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'tr-diploma', name: 'High School Diploma & Translations', level: 'commonly-required', description: 'Certified diploma with official Turkish/English translation.' },
      { id: 'tr-transcripts', name: 'Academic Transcripts', level: 'commonly-required', description: 'Official high school transcript with grading explanation.' },
      { id: 'tr-denklik', name: 'Equivalence Certificate (Denklik)', level: 'required-after-admission', description: 'Ministry equivalence document obtained before final university enrollment.' },
      { id: 'tr-exam', name: 'TR-YÖS, SAT, or National Exam', level: 'sometimes-required', description: 'Test policy varies: some universities require TR-YÖS or SAT; others admit on high school GPA.' },
      { id: 'tr-lang', name: 'Language Certificate (TÖMER / IELTS / TOEFL)', level: 'commonly-required', description: 'Language proof matching the program’s instruction medium.' },
      { id: 'tr-passport', name: 'Passport & Biometric Photos', level: 'commonly-required', description: 'Valid passport and official identification photos.' }
    ],
    officialResources: [
      {
        label: 'Study in Türkiye (YÖK Official Portal)',
        url: 'https://www.studyinturkiye.gov.tr/',
        organization: 'Council of Higher Education (YÖK)',
        description: 'Official Turkish government platform for international students detailing universities and programs.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'Türkiye Scholarships (Türkiye Bursları)',
        url: 'https://www.turkiyeburslari.gov.tr/',
        organization: 'Presidency for Turks Abroad and Related Communities (YTB)',
        description: 'Official government scholarship application portal for undergraduate and graduate studies.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'January 10 – February 20', title: 'Türkiye Scholarships Window', description: 'Submit online application at turkiyeburslari.gov.tr including academic records, recommendations, and essays.', actionableMilestone: 'Submit Türkiye Scholarships application.' },
      { period: 'March – May', title: 'TR-YÖS Exam & Direct Prep', description: 'Register for TR-YÖS sessions or prepare Digital SAT scores for direct university applications.', actionableMilestone: 'Obtain test score reports.' },
      { period: 'May – July', title: 'Direct University Admissions', description: 'Apply directly on university international student portals as application windows open.', actionableMilestone: 'Submit direct university applications.' },
      { period: 'July – August', title: 'Admissions Results & Acceptance', description: 'Receive acceptance letters and pay initial tuition deposit to receive the official Acceptance Letter.', actionableMilestone: 'Secure official acceptance letter.' },
      { period: 'August – September', title: 'Denklik & Student Visa', description: 'Apply for Denklik (Equivalence Certificate) and obtain student visa for enrollment.', actionableMilestone: 'Complete campus registration.' }
    ],
    scholarshipInfo: {
      overview: 'Türkiye offers both government-funded full scholarship packages and university-level partial tuition waivers.',
      types: [
        { title: 'Türkiye Scholarships (Government)', description: 'Full package: tuition, housing, monthly allowance, health insurance, and flights.', tag: 'Full Package' },
        { title: 'Foundation University Merit Discounts', description: 'Institutional 25% to 100% tuition scholarships based on academic credentials.', tag: 'Merit' }
      ],
      realityCheck: 'Applying for Türkiye Scholarships does not guarantee placement. Do not rely on unauthorized private agencies promising guaranteed admissions or visas.'
    }
  },

  // =========================================================================
  // 4. CANADA
  // =========================================================================
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    tagline: 'Provincial application hubs, direct university portals, and distinct study-permit steps.',
    summary: 'Canadian universities are globally renowned for research excellence and rigorous academic standards. Admissions operate at the provincial or individual university level rather than a single national portal.',
    primaryApplicationRoute: 'Provincial Portals (e.g., OUAC) & Direct University Portals',
    systemSummary: 'Canada does not have one centralized national application system. In Ontario, students apply through OUAC (Ontario Universities’ Application Centre); in other provinces (such as British Columbia, Alberta, or Quebec), students apply through provincial hubs (e.g., EducationPlannerBC, ApplyAlberta) or directly on university websites.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Decentralized Provincial Systems & Direct Portals',
        paragraphs: [
          'Canada consists of 10 provinces and 3 territories, and education is governed at the provincial level. Each university sets its own admission averages, prerequisite high school courses, and application deadlines.',
          'Canadian universities heavily emphasize academic performance in Grades 11 and 12, focusing specifically on required subject prerequisites for your intended major.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Provincial Portals vs. Direct Applications',
        paragraphs: [
          'In Ontario (home to universities like Toronto, Waterloo, McMaster, and Queen’s), undergraduate applicants use the Ontario Universities’ Application Centre (OUAC).',
          'In other provinces (e.g., UBC in British Columbia, McGill in Quebec, or University of Alberta), students apply through provincial systems like EducationPlannerBC or directly through the university’s own admissions portal.'
        ],
        items: [
          {
            label: 'OUAC (Ontario Universities’ Application Centre)',
            description: 'Centralized hub for applying to all public universities located in Ontario.',
            badge: 'Ontario Hub'
          },
          {
            label: 'Direct University Applications',
            description: 'Independent application systems used by institutions across British Columbia, Quebec, Alberta, and Atlantic Canada.',
            badge: 'Direct Portals'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Prerequisites, Transcripts & Supplemental Profiles',
        items: [
          {
            label: 'High School Transcripts & Predicted Grades',
            description: 'Detailed records for Grades 10–12. High emphasis on final-year prerequisite subjects (e.g., Grade 12 Calculus for Engineering/CS).',
            level: 'commonly-required'
          },
          {
            label: 'Program-Specific Subject Prerequisites',
            description: 'Specific high school courses (such as Advanced Mathematics, Physics, Chemistry, or English) required for entry into specialized faculties.',
            level: 'commonly-required'
          },
          {
            label: 'English or French Language Proficiency',
            description: 'IELTS Academic, TOEFL iBT, Duolingo English Test (where accepted), or French proficiency for Francophone institutions.',
            level: 'commonly-required'
          },
          {
            label: 'Supplemental Application / Personal Profile',
            description: 'Required by competitive programs (e.g., UBC Personal Profile, Waterloo AIF, U of T Engineering Portal) including short essays and video responses.',
            level: 'required-for-certain-programs'
          },
          {
            label: 'Standardized Testing (SAT / ACT)',
            description: 'SAT/ACT scores are not a universal requirement in Canada. They are usually optional unless applying with a U.S. high school diploma.',
            level: 'usually-not-required'
          },
          {
            label: 'Letters of Reference / Portfolio',
            description: 'Required for specific fine arts, architecture, or selective business/engineering programs.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Academic Submissions & Study Permit Distinction',
        items: [
          {
            label: 'Official High School Transcripts with Grading Legend',
            description: 'Uploaded electronically to each university student portal after submitting the initial application.',
            level: 'commonly-required'
          },
          {
            label: 'Certified English / French Translations',
            description: 'Required if original school documents are in another language.',
            level: 'commonly-required'
          },
          {
            label: 'Provincial Attestation Letter (PAL) & Study Permit',
            description: 'Immigration documents required after receiving an official Letter of Acceptance (LOA) to study in Canada.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'IELTS, TOEFL, DET, and French Tests',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'Most English-medium Canadian universities require an IELTS Academic score of 6.5 (with no band below 6.0) or TOEFL iBT 86–100+. Duolingo English Test acceptance varies by institution.'
        ],
        items: [
          {
            label: 'IELTS Academic',
            description: 'Standard English benchmark accepted by virtually all Canadian universities and colleges (benchmark: 6.5–7.0).',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'Duolingo English Test (DET)',
            description: 'Accepted by many Canadian universities, though some require IELTS/TOEFL for direct entry. Verify each university.',
            level: 'sometimes-required',
            link: { text: 'View SVT DET Prep Hub', url: '#det' }
          },
          {
            label: 'DELF / DALF / TCF',
            description: 'Required for Francophone universities (e.g., Université de Montréal, Université Laval).',
            level: 'required-for-certain-programs'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Entrance Scholarships & International Awards',
        paragraphs: [
          'International tuition in Canada varies significantly by program and province (typically CAD $25,000 to $65,000+ per year).',
          'Most universities offer automatic entrance scholarships based on exceptional high school grades (e.g., 90%+ average), and select institutions offer major international competitive scholarships (such as the Lester B. Pearson Scholarship at University of Toronto or Karen McKellin International Leader of Tomorrow Award at UBC).'
        ],
        items: [
          {
            label: 'Automatic Entrance Scholarships',
            description: 'Assessed automatically during admissions review based on final Grade 12 GPA.',
            badge: 'Automatic'
          },
          {
            label: 'Prestige International Scholarships',
            description: 'Competitive full or major tuition scholarships requiring separate nominations, essays, and early deadlines (often Nov–Dec).',
            badge: 'Nomination-Based'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Standard Canadian Admissions Cycle',
        paragraphs: [
          'Applications open in September–October. Major university deadlines range from early January (UBC, U of T) to March/April for other institutions.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Government & Study Portals',
        items: [
          {
            label: 'EduCanada (Government of Canada)',
            description: 'Official Government of Canada international education portal.',
            link: { text: 'Visit EduCanada', url: 'https://www.educanada.ca/study-plan-etudes/index.aspx?lang=eng' }
          },
          {
            label: 'Immigration, Refugees and Citizenship Canada (IRCC) - Study Permit',
            description: 'Official government requirements, processing steps, and rules for Canadian study permits.',
            link: { text: 'Visit IRCC Study Permit', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'ca-transcripts', name: 'High School Transcripts & Grade 12 Marks', level: 'commonly-required', description: 'Detailed grades with high focus on prerequisite subjects.' },
      { id: 'ca-prereqs', name: 'Required Subject Prerequisites', level: 'commonly-required', description: 'Mandatory high school coursework matching chosen faculty (Math, Sciences, English).' },
      { id: 'ca-english', name: 'English/French Language Proficiency', level: 'commonly-required', description: 'IELTS Academic, TOEFL, or DET score meeting institutional cutoffs.' },
      { id: 'ca-supplements', name: 'Supplemental Application / Profile', level: 'required-for-certain-programs', description: 'Short essays, activities, or video interviews for competitive faculties.' },
      { id: 'ca-sat', name: 'SAT / ACT Scores', level: 'usually-not-required', description: 'Not universally required; primarily used by U.S. curriculum applicants.' },
      { id: 'ca-permit', name: 'Letter of Acceptance & Study Permit', level: 'required-after-admission', description: 'Official LOA required to apply for a Canadian study permit via IRCC.' }
    ],
    officialResources: [
      {
        label: 'EduCanada: Plan Your Studies in Canada',
        url: 'https://www.educanada.ca/study-plan-etudes/index.aspx?lang=eng',
        organization: 'Government of Canada & Global Affairs Canada',
        description: 'Official national resource for choosing accredited Canadian institutions, study programs, and tuition estimates.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'IRCC Study Permit Official Guidelines',
        url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
        organization: 'Immigration, Refugees and Citizenship Canada (IRCC)',
        description: 'Official legal instructions, Provincial Attestation Letter requirements, and financial proof rules for student visas.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'September – November', title: 'Portal Applications Open', description: 'Complete OUAC (Ontario) or direct university portal applications and create student login accounts.', actionableMilestone: 'Submit initial application fee and receive student IDs.' },
      { period: 'December – January 15', title: 'Early & Standard Deadlines', description: 'Submit major competitive applications (UBC, U of T, McGill, Waterloo) and prestige scholarship nominations.', actionableMilestone: 'Upload Grade 11 & interim Grade 12 transcripts.' },
      { period: 'January – February', title: 'Supplemental Profiles & Portfolios', description: 'Complete program-specific supplementary essays, video questions, and language test submissions.', actionableMilestone: 'Finalize supplemental assessments.' },
      { period: 'February – May', title: 'Admissions Offers Released', description: 'Universities release conditional offers of admission based on interim grades.', actionableMilestone: 'Review conditional requirements.' },
      { period: 'May 1 – June 1', title: 'Offer Acceptance & Study Permit', description: 'Accept offer, pay tuition deposit, request Provincial Attestation Letter (PAL), and apply for IRCC study permit.', actionableMilestone: 'Apply for Canadian Study Permit via IRCC.' }
    ],
    scholarshipInfo: {
      overview: 'Canadian university funding is primarily merit-based through entrance scholarships and competitive international leadership awards.',
      types: [
        { title: 'Automatic Entrance Scholarships', description: 'One-time or renewable awards based on final secondary school admission average.', tag: 'Automatic' },
        { title: 'Nomination-Based Major Awards', description: 'Full or significant tuition scholarships requiring secondary school nomination.', tag: 'Prestige' }
      ],
      realityCheck: 'Canadian public universities do not offer need-based aid to international students. Never rely on promises of guaranteed post-graduation work permits or permanent residency.'
    }
  },

  // =========================================================================
  // 5. UNITED KINGDOM
  // =========================================================================
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    tagline: 'UCAS undergraduate applications, course-focused entry criteria, and conditional offers.',
    summary: 'UK university admissions are subject-specific and academically concentrated, managed centrally through UCAS (Universities and Colleges Admissions Service).',
    primaryApplicationRoute: 'UCAS (Universities and Colleges Admissions Service)',
    systemSummary: 'Undergraduate admissions in the UK are centralized through UCAS (ucas.com). Applicants can choose up to five course choices on a single application. Applications focus heavily on academic preparation, subject interest, and relevant academic skills.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Centralized Admissions via UCAS',
        paragraphs: [
          'In the UK, students apply to study a specific subject from Day 1 (e.g., BSc Computer Science, BA History, BEng Mechanical Engineering). Admissions tutors evaluate your academic readiness and dedication to that specific discipline.',
          'All full-time undergraduate applications are submitted online through UCAS. You can select up to five course choices (with a maximum of four in Medicine, Dentistry, or Veterinary Science).'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'UCAS Hub, Course Choices & Key Deadlines',
        paragraphs: [
          '1. Create a UCAS Hub account and add your education history, predicted grades, and course choices.',
          '2. Complete the personal statement / structured questions focusing on your academic subject interest.',
          '3. Provide a confidential academic reference with official predicted grades from your school.',
          '4. Deadlines: October 15 for Oxford, Cambridge, Medicine, Dentistry, and Veterinary Medicine; late January (equal consideration deadline) for most other courses.'
        ],
        items: [
          {
            label: 'UCAS (Centralized Portal)',
            description: 'Unified application system for all UK universities and colleges.',
            badge: 'Centralized'
          },
          {
            label: 'Up to 5 Course Choices',
            description: 'Apply to up to 5 courses across different universities on one application.',
            badge: '5 Choices'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Grades, References & Written Answers',
        items: [
          {
            label: 'Official Predicted Grades',
            description: 'Grades predicted by your school for A-Levels, IB Diploma, AP exams, or national secondary credentials.',
            level: 'commonly-required'
          },
          {
            label: 'UCAS Personal Statement / Structured Written Questions',
            description: 'Academic-focused written statement explaining your passion, reading, projects, and readiness for your chosen course.',
            level: 'commonly-required'
          },
          {
            label: 'Academic Reference from School',
            description: 'Written statement from a teacher or advisor detailing your academic ability and predicted performance.',
            level: 'commonly-required'
          },
          {
            label: 'English Language Proficiency (IELTS / UKVI IELTS)',
            description: 'IELTS Academic, PTE Academic, or university-approved equivalent (typical requirement: 6.5–7.5 overall).',
            level: 'commonly-required'
          },
          {
            label: 'Admissions Tests (UCAT, LNAT, STEP, ESAT, TMUA)',
            description: 'Subject tests required for Medicine, Law, Mathematics, Engineering, or Oxbridge courses.',
            level: 'required-for-certain-programs'
          },
          {
            label: 'Admissions Interview',
            description: 'Required for Oxford, Cambridge, Medicine, Teaching, and select arts or performance courses.',
            level: 'required-for-certain-programs'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Submission via UCAS & Post-Offer Verification',
        items: [
          {
            label: 'Complete Educational Qualifications List',
            description: 'All secondary exam results and qualifications entered directly into UCAS.',
            level: 'commonly-required'
          },
          {
            label: 'Confirmation of Acceptance for Studies (CAS)',
            description: 'Official electronic reference number issued by the university after fulfilling all conditional offer criteria, required for the Student visa.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'IELTS Academic & Course-Specific Assessments',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'UK universities require certified English language proof for admission and visa compliance (CEFR B2/C1). IELTS Academic is universally accepted across UK higher education.'
        ],
        items: [
          {
            label: 'IELTS Academic / IELTS for UKVI',
            description: 'Standard English benchmark across all UK institutions (typically 6.5 with min 6.0 in each skill, or 7.0+ for Law/Medicine).',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'Subject Admissions Tests (UCAT, LNAT, TMUA, STEP)',
            description: 'Pre-interview assessments required for competitive courses at top UK institutions.',
            level: 'required-for-certain-programs'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Tuition Fees & International Scholarship Realities',
        paragraphs: [
          'International undergraduate tuition in the UK ranges from approximately £16,000 to £38,000+ per year (higher for clinical medicine).',
          'Full undergraduate scholarships in the UK are rare. Most universities offer partial international merit discounts (£2,000 to £10,000 fee reductions). Government scholarships like Chevening are reserved for Master’s degrees.'
        ],
        items: [
          {
            label: 'University International Merit Scholarships',
            description: 'Partial tuition fee discounts awarded automatically or via separate scholarship application.',
            badge: 'Partial Fee Reduction'
          },
          {
            label: 'External Foundation Scholarships',
            description: 'Charitable trusts or international organizations offering partial support.',
            badge: 'External'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'UCAS Key Deadlines & Results Days',
        paragraphs: [
          'The UCAS cycle opens in September for entry the following autumn.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified British Council & UCAS Links',
        items: [
          {
            label: 'Study UK (British Council)',
            description: 'Official UK government resource for international student planning and advice.',
            link: { text: 'Visit Study UK', url: 'https://study-uk.britishcouncil.org/plan-studies/apply' }
          },
          {
            label: 'UCAS Official Portal',
            description: 'Central admissions service for all UK undergraduate university applications.',
            link: { text: 'Visit UCAS', url: 'https://www.ucas.com/' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'uk-predicted', name: 'Official Predicted Grades', level: 'commonly-required', description: 'Predicted marks submitted by school referee for final qualifications.' },
      { id: 'uk-statement', name: 'UCAS Personal Statement', level: 'commonly-required', description: 'Academic personal statement outlining subject passion and evidence of preparation.' },
      { id: 'uk-ref', name: 'Academic Teacher Reference', level: 'commonly-required', description: 'Comprehensive reference submitted through UCAS.' },
      { id: 'uk-ielts', name: 'English Language Test (IELTS/PTE)', level: 'commonly-required', description: 'Certified English proficiency test meeting university and visa thresholds.' },
      { id: 'uk-tests', name: 'Admissions Tests (UCAT / LNAT / TMUA)', level: 'required-for-certain-programs', description: 'Mandatory tests for Medicine, Law, Mathematics, or Oxbridge courses.' },
      { id: 'uk-cas', name: 'CAS & UK Student Visa', level: 'required-after-admission', description: 'Issued by university upon meeting all conditional offer criteria.' }
    ],
    officialResources: [
      {
        label: 'Study UK: How to Apply',
        url: 'https://study-uk.britishcouncil.org/plan-studies/apply',
        organization: 'British Council',
        description: 'Official British Council guide to choosing courses, entry requirements, and applying for UK undergraduate study.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'UCAS (Universities and Colleges Admissions Service)',
        url: 'https://www.ucas.com/',
        organization: 'UCAS',
        description: 'The centralized application service for all UK undergraduate university degree programs.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'September', title: 'UCAS Applications Open', description: 'Register on UCAS Hub, select up to 5 course choices, and draft personal statement.', actionableMilestone: 'Link application to school / referee.' },
      { period: 'October 15', title: 'Oxbridge & Medicine Deadline', description: 'Early deadline for Oxford, Cambridge, Medicine, Dentistry, and Veterinary courses.', actionableMilestone: 'Submit Oxbridge / Medicine applications.' },
      { period: 'Late January', title: 'Equal Consideration Deadline', description: 'Standard UCAS deadline for the majority of undergraduate courses.', actionableMilestone: 'Submit complete UCAS application.' },
      { period: 'February – May', title: 'Offers Received (Conditional / Unconditional)', description: 'Universities issue offers specifying required final grades.', actionableMilestone: 'Select Firm (1st) and Insurance (2nd) choices.' },
      { period: 'July – August', title: 'Results Day & CAS Issuance', description: 'Final exam results verified; universities confirm unconditional places and issue CAS numbers for Student visa.', actionableMilestone: 'Apply for UK Student Visa.' }
    ],
    scholarshipInfo: {
      overview: 'UK undergraduate funding is limited and predominantly consists of partial merit-based tuition discounts.',
      types: [
        { title: 'International Merit Discounts', description: 'Partial tuition fee reductions (£2,000–£10,000) applied against first-year tuition.', tag: 'Partial' },
        { title: 'Bilateral / External Awards', description: 'Home country government or philanthropic foundation grants.', tag: 'External' }
      ],
      realityCheck: 'UK undergraduate degrees do not provide full need-based aid for international students. Plan full financing before accepting an offer.'
    }
  },

  // =========================================================================
  // 6. GERMANY
  // =========================================================================
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    tagline: 'High academic standards, low/no public tuition fees, uni-assist, and Studienkolleg pathways.',
    summary: 'Germany provides higher education known for low or zero tuition fees at most public universities, strong academic standards, and specialized technical curricula.',
    primaryApplicationRoute: 'uni-assist & Direct University Portals',
    systemSummary: 'Applications in Germany are submitted directly to individual universities or through uni-assist (uni-assist.de), a centralized preliminary evaluation service used by approximately 180 universities to verify foreign secondary credentials.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Tuition Policies & Qualification Recognition',
        paragraphs: [
          'Most public universities in Germany charge no tuition fees for domestic and international students alike (students only pay a modest semester contribution of €150–€350 covering public transport and campus administration). An exception is the federal state of Baden-Württemberg, which charges €1,500/semester for non-EU students, as well as private institutions.',
          'Admissions depend strictly on whether your secondary school qualification is recognized as equivalent to the German Abitur (Hochschulzugangsberechtigung - HZB).'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Direct Admission vs. Studienkolleg (Preparatory Course)',
        paragraphs: [
          'If your high school diploma grants Direct Admission (Direkter Hochschulzugang), you apply directly to your chosen Bachelor’s program.',
          'If your secondary diploma is not directly equivalent, you must first complete a 1-year preparatory course (Studienkolleg) in Germany and pass the assessment test (Feststellungsprüfung - FSP) before entering university.'
        ],
        items: [
          {
            label: 'uni-assist Portal',
            description: 'Central evaluation service that processes international certificates for over 180 German universities.',
            badge: 'Evaluation Service'
          },
          {
            label: 'Direct University Application',
            description: 'Submitted directly to universities that do not use uni-assist.',
            badge: 'Direct Portal'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Academic Documents & Language Proof',
        items: [
          {
            label: 'University Entrance Qualification (HZB)',
            description: 'Recognized high school certificate or Studienkolleg Feststellungsprüfung.',
            level: 'commonly-required'
          },
          {
            label: 'Certified Translations of Academic Records',
            description: 'Certificates and transcripts must be translated into German or English and officially notarized.',
            level: 'commonly-required'
          },
          {
            label: 'German Language Proficiency (TestDaF, DSH, telc C1, Goethe)',
            description: 'Required for German-taught degrees (typically TestDaF 4x4 or DSH-2).',
            level: 'required-for-certain-programs'
          },
          {
            label: 'English Language Proficiency (IELTS / TOEFL)',
            description: 'Required for English-taught International Degree Programs (typically IELTS 6.5+).',
            level: 'required-for-certain-programs'
          },
          {
            label: 'Proof of Financial Resources (Blocked Account / Sperrkonto)',
            description: 'Proof of required living funds (approx. €11,904/year in a German blocked bank account) required for the student visa.',
            level: 'required-after-admission'
          },
          {
            label: 'German Statutory Health Insurance',
            description: 'Mandatory health insurance certificate required for university matriculation.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Preparation for uni-assist & University Enrollment',
        items: [
          {
            label: 'Officially Certified Copies of High School Diploma',
            description: 'Notarized copies and certified translations submitted to uni-assist or the university.',
            level: 'commonly-required'
          },
          {
            label: 'Preliminary Documentation (VPD) by uni-assist',
            description: 'Vorprüfungsdokumentation required by select universities before direct application.',
            level: 'sometimes-required'
          },
          {
            label: 'Tabular Curriculum Vitae (CV) & Motivation Letter',
            description: 'Concise chronological academic CV.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'German & English Language Assessments',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'German universities are strict regarding language prerequisites. If applying for a German-taught program, you must present a certified German C1 certificate prior to matriculation.'
        ],
        items: [
          {
            label: 'TestDaF / DSH / telc Deutsch C1 Hochschule',
            description: 'Official German language examinations required for degree study in German.',
            level: 'required-for-certain-programs'
          },
          {
            label: 'IELTS Academic / TOEFL iBT',
            description: 'Required for English-taught Bachelor’s programs in Germany.',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'TestAS (Test for Academic Studies)',
            description: 'Standardized aptitude exam for international students used by select universities to strengthen admission rank.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Low Tuition System & Living Expenses',
        paragraphs: [
          'Because public universities in Germany charge negligible tuition, traditional full scholarships for Bachelor’s degrees are very rare. The DAAD (German Academic Exchange Service) primarily funds Master’s and PhD researchers.',
          'Students must demonstrate sufficient funds to cover annual living costs (€992/month or approx. €11,904/year) via a Blocked Bank Account (Sperrkonto) for visa issuance.'
        ],
        items: [
          {
            label: 'Tuition-Free Public Education',
            description: 'Zero tuition at public universities in 15 of 16 federal states; only modest semester fees apply.',
            badge: 'Public Policy'
          },
          {
            label: 'Deutschlandstipendium',
            description: 'Merit scholarship of €300/month co-funded by the federal government and private sponsors.',
            badge: 'Merit'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Winter & Summer Semester Cycles',
        paragraphs: [
          'Winter Semester (starts October): Application deadline is typically July 15. Summer Semester (starts April): Application deadline is typically January 15.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified German Government & DAAD Links',
        items: [
          {
            label: 'Study in Germany (DAAD & BMBF)',
            description: 'Official portal for international students planning their studies in Germany.',
            link: { text: 'Visit Study in Germany', url: 'https://www.study-in-germany.com/en/' }
          },
          {
            label: 'DAAD (German Academic Exchange Service)',
            description: 'National agency for international academic exchange with university and scholarship databases.',
            link: { text: 'Visit DAAD', url: 'https://www.daad.de/en/studying-in-germany/' }
          },
          {
            label: 'uni-assist e.V. Official Portal',
            description: 'Central application processing service for international student qualifications in Germany.',
            link: { text: 'Visit uni-assist', url: 'https://www.uni-assist.de/en/' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'de-hzb', name: 'Recognized High School Qualification (HZB)', level: 'commonly-required', description: 'Secondary diploma evaluated for direct admission or Studienkolleg requirement.' },
      { id: 'de-translations', name: 'Certified German/English Translations', level: 'commonly-required', description: 'Notarized translations of diplomas and transcripts.' },
      { id: 'de-german', name: 'German Language Certificate (TestDaF/DSH)', level: 'required-for-certain-programs', description: 'Mandatory C1 level for German-taught degree programs.' },
      { id: 'de-english', name: 'English Language Test (IELTS/TOEFL)', level: 'required-for-certain-programs', description: 'Required for English-taught degree tracks.' },
      { id: 'de-blocked', name: 'Blocked Bank Account (Sperrkonto)', level: 'required-after-admission', description: 'Proof of approx. €11,904 in living funds required for the German student visa.' },
      { id: 'de-insurance', name: 'Statutory Health Insurance', level: 'required-after-admission', description: 'German public health insurance coverage required for matriculation.' }
    ],
    officialResources: [
      {
        label: 'Study in Germany (DAAD & Federal Ministry)',
        url: 'https://www.study-in-germany.com/en/',
        organization: 'DAAD & German Federal Ministry of Education',
        description: 'Official guidance on university requirements, application procedures, and living in Germany.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'DAAD Study & Scholarship Database',
        url: 'https://www.daad.de/en/studying-in-germany/',
        organization: 'German Academic Exchange Service (DAAD)',
        description: 'Verified database of international Bachelor’s and Master’s programs and admission criteria.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'uni-assist Application Portal',
        url: 'https://www.uni-assist.de/en/',
        organization: 'uni-assist e.V.',
        description: 'Official evaluation portal for submitting foreign educational certificates to member universities.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'January – April', title: 'HZB Verification & Language Certification', description: 'Check qualification on DAAD Anabin database and complete TestDaF/IELTS exams.', actionableMilestone: 'Confirm direct eligibility vs. Studienkolleg.' },
      { period: 'May – July 15', title: 'uni-assist & University Application', description: 'Submit documents via uni-assist and direct university portals before the July 15 Winter deadline.', actionableMilestone: 'Submit uni-assist applications.' },
      { period: 'July – August', title: 'Admission Letters Issued', description: 'Receive Zulassungsbescheid (Letter of Admission) from universities.', actionableMilestone: 'Accept offer and open Blocked Account.' },
      { period: 'August – September', title: 'Blocked Account & Visa', description: 'Fund Sperrkonto (Blocked Account) and attend German embassy student visa appointment.', actionableMilestone: 'Secure German National Student Visa.' },
      { period: 'October', title: 'Matriculation & Semester Start', description: 'Enroll on campus, pay semester fee, and begin orientation week.', actionableMilestone: 'Complete university enrollment.' }
    ],
    scholarshipInfo: {
      overview: 'Germany provides virtually tuition-free education at public universities rather than direct individual cash grants.',
      types: [
        { title: 'Tuition-Free Public Higher Education', description: 'Public funding model eliminating tuition fees at most public universities.', tag: 'Public Benefit' },
        { title: 'Deutschlandstipendium', description: 'National merit award providing €300 monthly for high-achieving students.', tag: 'Merit' }
      ],
      realityCheck: 'While tuition is free or minimal at public universities, students must fully self-fund their living expenses (approx. €11,904/year) in a blocked account. Never believe claims of free accommodation.'
    }
  },

  // =========================================================================
  // 7. AUSTRALIA
  // =========================================================================
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    tagline: 'Direct university portals, authorized education agents, and Genuine Student (GS) criteria.',
    summary: 'Australian universities offer high-quality, internationally accredited undergraduate qualifications with flexible February and July semester intakes.',
    primaryApplicationRoute: 'Direct University Portals & Authorized Application Services',
    systemSummary: 'There is no single national Common App for all Australian universities. International students apply directly through individual university online application systems or through authorized university international education representatives.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Dual Semester Intakes & Academic Assessment',
        paragraphs: [
          'Australia’s academic year begins in February (Semester 1), with a major secondary intake in July (Semester 2).',
          'Admissions criteria are transparent and largely academic, evaluating your secondary school GPA/ATAR equivalence, prerequisite subjects, and English language scores.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Application Channels & Offer Types',
        paragraphs: [
          'You can apply directly online on each university’s international student portal or through an authorized education agent affiliated with the university.',
          'Upon evaluation, universities issue a Conditional Offer (requiring final grades or English test results) or a Full/Unconditional Offer, followed by an Electronic Confirmation of Enrolment (eCoE) upon deposit payment.'
        ],
        items: [
          {
            label: 'Direct University Portals',
            description: 'Individual online application platforms maintained by each Australian university.',
            badge: 'Direct Portal'
          },
          {
            label: 'Authorized Education Representatives',
            description: 'Accredited international advising agencies authorized by Australian institutions to submit applications.',
            badge: 'Authorized Service'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Academic Transcripts, English Scores & GS Criteria',
        items: [
          {
            label: 'Secondary School Qualification & Transcripts',
            description: 'Year 12 equivalent certificate (e.g., IB, A-Levels, national secondary school diploma) converted to the Australian ATAR scale.',
            level: 'commonly-required'
          },
          {
            label: 'English Language Proficiency (IELTS, TOEFL, PTE)',
            description: 'IELTS Academic (typically 6.5 overall, min 6.0 in each band), PTE Academic, or TOEFL iBT.',
            level: 'commonly-required'
          },
          {
            label: 'Program Prerequisites',
            description: 'Specific secondary school subject completions required for engineering, health, or science faculties.',
            level: 'commonly-required'
          },
          {
            label: 'Genuine Student (GS) Assessment',
            description: 'Evaluation by the university and Department of Home Affairs confirming you are a genuine applicant intending to complete your study in Australia.',
            level: 'commonly-required'
          },
          {
            label: 'Overseas Student Health Cover (OSHC)',
            description: 'Mandatory medical insurance covering the entire duration of your stay in Australia.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Academic Verification & eCoE Issuance',
        items: [
          {
            label: 'Certified Academic Transcripts and Certificates',
            description: 'Color scans of original documents and certified English translations.',
            level: 'commonly-required'
          },
          {
            label: 'Valid International Passport',
            description: 'Copy of photo and identification details page.',
            level: 'commonly-required'
          },
          {
            label: 'Electronic Confirmation of Enrolment (eCoE)',
            description: 'Official document issued after tuition deposit payment, required to lodge an Australian Student Visa (Subclass 500).',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'IELTS, PTE Academic, and TOEFL iBT',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'PTE Academic and IELTS Academic are the most widely submitted English tests for Australian university admission and student visa processing.'
        ],
        items: [
          {
            label: 'IELTS Academic',
            description: 'Universally accepted by all Australian higher education institutions (benchmark: 6.5 with no band < 6.0).',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'PTE Academic / TOEFL iBT',
            description: 'Widely accepted computer-based tests for admissions and visa requirements.',
            level: 'commonly-required'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'International Merit Fee Remissions',
        paragraphs: [
          'International undergraduate tuition in Australia ranges from AUD $30,000 to $50,000+ per year.',
          'Most Australian universities offer international merit scholarships (typically 15% to 25% partial tuition fee reductions) awarded automatically based on secondary school academic performance.'
        ],
        items: [
          {
            label: 'Vice-Chancellor / International Merit Scholarships',
            description: '15%–50% tuition fee discounts awarded to high-achieving international applicants.',
            badge: 'Merit Discount'
          },
          {
            label: 'Australia Awards (Government)',
            description: 'Government scholarship program primarily targeted at select developing partner nations.',
            badge: 'Government'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Semester 1 (Feb) & Semester 2 (July) Cycles',
        paragraphs: [
          'Applications for Semester 1 (February start) generally close between October and December. Applications for Semester 2 (July start) close between April and May.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Australian Government Link',
        items: [
          {
            label: 'Study Australia (Australian Government)',
            description: 'Official Australian Government website for international students.',
            link: { text: 'Visit Study Australia', url: 'https://www.studyaustralia.gov.au/en/plan-your-studies/how-to-apply-to-study' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'au-transcripts', name: 'High School Certificates & Transcripts', level: 'commonly-required', description: 'Certified Year 12 equivalent marks evaluated against Australian ATAR.' },
      { id: 'au-english', name: 'English Language Test (IELTS/PTE/TOEFL)', level: 'commonly-required', description: 'Meeting university minimum band score thresholds.' },
      { id: 'au-gs', name: 'Genuine Student (GS) Declaration', level: 'commonly-required', description: 'Statement and evidence confirming genuine study intentions.' },
      { id: 'au-prereq', name: 'Course Prerequisites', level: 'required-for-certain-programs', description: 'Required mathematics or science background for technical faculties.' },
      { id: 'au-oshc', name: 'Overseas Student Health Cover (OSHC)', level: 'required-after-admission', description: 'Mandatory health insurance policy for the student visa duration.' },
      { id: 'au-ecoe', name: 'Electronic Confirmation of Enrolment (eCoE)', level: 'required-after-admission', description: 'Official registration document required for Subclass 500 visa application.' }
    ],
    officialResources: [
      {
        label: 'Study Australia: How to Apply',
        url: 'https://www.studyaustralia.gov.au/en/plan-your-studies/how-to-apply-to-study',
        organization: 'Australian Trade and Investment Commission (Austrade)',
        description: 'Official Australian Government guide covering admission steps, costs, student visa rules, and accredited institutions.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'August – November', title: 'Direct Application Submission', description: 'Submit applications directly or through authorized representatives for the February intake.', actionableMilestone: 'Submit academic documents.' },
      { period: 'October – December', title: 'Offer Letters & Acceptance', description: 'Receive Conditional or Unconditional Offer letters and complete Genuine Student requirements.', actionableMilestone: 'Pay initial deposit to receive eCoE.' },
      { period: 'November – January', title: 'Student Visa (Subclass 500)', description: 'Lodge online visa application with the Department of Home Affairs using eCoE and OSHC.', actionableMilestone: 'Secure Australian Student Visa.' },
      { period: 'February', title: 'Orientation & Semester 1 Start', description: 'Arrive in Australia, attend university orientation, and commence undergraduate classes.', actionableMilestone: 'Enroll in semester courses.' }
    ],
    scholarshipInfo: {
      overview: 'Australian universities offer competitive partial tuition fee scholarships awarded on academic merit.',
      types: [
        { title: 'International Merit Fee Remissions', description: '15%–25% reduction in annual tuition fees based on high school GPA.', tag: 'Partial' },
        { title: 'Global Excellence Scholarships', description: 'Up to 50% tuition reduction for top percentile applicants.', tag: 'Excellence' }
      ],
      realityCheck: 'Australian higher education does not provide full funding for international undergraduates. Do not rely on promises of guaranteed permanent residency, employment, or scholarship waivers.'
    }
  },

  // =========================================================================
  // 8. FRANCE
  // =========================================================================
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    tagline: 'Études en France (Campus France), Parcoursup, and prestigious public & Grande École pathways.',
    summary: 'Higher education in France combines historic public universities with specialized Grandes Écoles, offering high academic rigor at heavily subsidized public tuition rates.',
    primaryApplicationRoute: 'Études en France (Campus France), Parcoursup & Direct Portals',
    systemSummary: 'The application route in France depends on your country of residence, the institution type, level of study, and the language of the program. Students from 65+ partner countries must use the Études en France procedure via Campus France; others use Parcoursup or direct institutional applications.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Determining Your Correct Application Route',
        paragraphs: [
          'France offers two main types of higher education: public universities (universités) and selective specialized institutes (Grandes Écoles and specialized schools).',
          'The correct application route depends on your nationality, country of residence, and program language.'
        ],
        callout: {
          type: 'info',
          title: 'Route-Checking Question',
          text: 'Does your country and chosen program use Études en France, Parcoursup, or direct application? Check Campus France guidelines for your country.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'The Three Main Pathways',
        paragraphs: [
          '1. Études en France (EEF): Mandatory for international students residing in one of the 65+ partner countries where Campus France operates an EEF procedure (e.g., Egypt, Morocco, Turkey, Saudi Arabia, UAE, Lebanon, Senegal, India, etc.).',
          '2. Parcoursup: Used for first-year undergraduate entry (Licence 1) by students from non-EEF countries or students holding a French Baccalauréat / European qualification.',
          '3. Direct Institutional Portals: Used by private institutions, English-taught business schools, and specialized Grande École preparatory tracks.'
        ],
        items: [
          {
            label: 'Études en France (Campus France)',
            description: 'Unified online portal managing academic applications and visa clearance for 65+ partner nations.',
            badge: 'EEF Procedure'
          },
          {
            label: 'Parcoursup',
            description: 'French national platform for first-year undergraduate higher education admissions.',
            badge: 'Parcoursup'
          },
          {
            label: 'Direct Institution Applications',
            description: 'Custom portals used by independent business schools, engineering institutes, and English-taught private programs.',
            badge: 'Direct'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Diplomas, Translations & Language Proof',
        items: [
          {
            label: 'Secondary School Diploma (Baccalauréat Equivalence)',
            description: 'High school graduation diploma recognized as equivalent to the French Baccalauréat.',
            level: 'commonly-required'
          },
          {
            label: 'Official Academic Transcripts with Certified Translations',
            description: 'Detailed grade records translated into French by a certified sworn translator.',
            level: 'commonly-required'
          },
          {
            label: 'French Language Proficiency (DELF B2 / DALF C1 / TCF)',
            description: 'Required for French-taught programs (minimum DELF B2, often DALF C1 for humanities/law).',
            level: 'required-for-certain-programs'
          },
          {
            label: 'English Language Proficiency (IELTS / TOEFL)',
            description: 'Required for 100% English-taught degree programs (typically IELTS 6.5+).',
            level: 'required-for-certain-programs'
          },
          {
            label: 'Motivation Letter (Lettre de Motivation)',
            description: 'Formal statement in French or English detailing academic interests and career goals.',
            level: 'commonly-required'
          },
          {
            label: 'Curriculum Vitae (CV / Resume)',
            description: 'Formatted European-style chronological CV.',
            level: 'commonly-required'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'Campus France & Consular Verification',
        items: [
          {
            label: 'Sworn Translations of Diplomas and Transcripts',
            description: 'All educational certificates translated into French by an approved translator.',
            level: 'commonly-required'
          },
          {
            label: 'Campus France Interview Confirmation',
            description: 'In-person or virtual academic interview with Campus France advisors (for EEF countries).',
            level: 'required-for-certain-programs'
          },
          {
            label: 'Proof of Financial Resources (€615/month minimum)',
            description: 'Required living funds evidence for the French Long-Stay Student Visa (VLS-TS).',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'DELF, DALF, TCF, and English Tests',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'For French-taught undergraduate programs, students must hold at least a DELF B2 or TCF Tout Public with writing test. English-taught programs require IELTS or TOEFL.'
        ],
        items: [
          {
            label: 'DELF B2 / DALF C1 / TCF',
            description: 'Official French Ministry of Education language certifications for French-taught degree studies.',
            level: 'required-for-certain-programs'
          },
          {
            label: 'IELTS Academic / TOEFL iBT',
            description: 'Accepted for English-medium programs across universities and business schools.',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Subsidized Public Tuition & Campus Bourses',
        paragraphs: [
          'Tuition at public universities in France is heavily subsidized by the French state: standard non-EU undergraduate fees are approx. €2,770/year (with many universities offering full or partial fee waivers reducing it to the domestic rate of €175/year).',
          'Private business and engineering schools charge higher commercial fees (€8,000–€20,000/year).'
        ],
        items: [
          {
            label: 'Subsidized Public University Tuition',
            description: 'State-supported tuition structure keeping public university rates accessible.',
            badge: 'State Subsidy'
          },
          {
            label: 'Eiffel Scholarship Program (Graduate Focus)',
            description: 'Government scholarship program predominantly aimed at Master’s and PhD students.',
            badge: 'Government'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Campus France & Parcoursup Deadlines',
        paragraphs: [
          'Études en France (DAP) deadlines typically fall in December–January. Parcoursup registration opens in January and closes in March.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified French Government Portals',
        items: [
          {
            label: 'Campus France (Official Agency)',
            description: 'National agency for the promotion of French higher education abroad.',
            link: { text: 'Visit Campus France', url: 'https://www.campusfrance.org/en' }
          },
          {
            label: 'Parcoursup Official Platform',
            description: 'National platform for first-year higher education admissions in France.',
            link: { text: 'Visit Parcoursup', url: 'https://www.parcoursup.gouv.fr/' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'fr-diploma', name: 'High School Diploma (Bac Equivalent)', level: 'commonly-required', description: 'Certified secondary graduation diploma.' },
      { id: 'fr-transcripts', name: 'Transcripts & Certified French Translations', level: 'commonly-required', description: 'Official academic marks translated into French.' },
      { id: 'fr-motivation', name: 'Motivation Letter (Lettre de Motivation)', level: 'commonly-required', description: 'Personal academic motivation statement.' },
      { id: 'fr-cv', name: 'Curriculum Vitae (CV)', level: 'commonly-required', description: 'Structured academic resume in French or English.' },
      { id: 'fr-french', name: 'French Language Certificate (DELF/TCF)', level: 'required-for-certain-programs', description: 'Minimum DELF B2 for French-taught degree programs.' },
      { id: 'fr-english', name: 'English Language Test (IELTS/TOEFL)', level: 'required-for-certain-programs', description: 'Required for English-taught bachelor’s degrees.' },
      { id: 'fr-visa', name: 'Campus France Approval & VLS-TS Visa', level: 'required-after-admission', description: 'Long-stay student visa with proof of at least €615/month living funds.' }
    ],
    officialResources: [
      {
        label: 'Campus France Official Portal',
        url: 'https://www.campusfrance.org/en',
        organization: 'Campus France (Ministry of Europe and Foreign Affairs)',
        description: 'Official national guide for degree search, procedure verification (EEF vs. non-EEF), and student life.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'Parcoursup National Platform',
        url: 'https://www.parcoursup.gouv.fr/',
        organization: 'Ministry of Higher Education and Research',
        description: 'Official French platform for entering first-year undergraduate university programs.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'October – December', title: 'Campus France (DAP) Preparation', description: 'Create account on Études en France portal, select degree choices, and submit language test certificates.', actionableMilestone: 'Submit DAP application dossier.' },
      { period: 'January – March', title: 'Campus France Interview & Parcoursup', description: 'Attend in-person or online Campus France interview; complete Parcoursup selections if applicable.', actionableMilestone: 'Complete academic interview.' },
      { period: 'April – June', title: 'University Decisions & Confirmation', description: 'Universities communicate decisions; confirm chosen offer on the portal.', actionableMilestone: 'Confirm admission acceptance.' },
      { period: 'June – August', title: 'Visa Application (VLS-TS)', description: 'Submit visa file to French consulate with financial guarantee and accommodation confirmation.', actionableMilestone: 'Obtain French Student Visa.' }
    ],
    scholarshipInfo: {
      overview: 'Public higher education in France operates on heavily state-subsidized tuition rates.',
      types: [
        { title: 'Subsidized Public University Rates', description: 'Non-EU undergraduate fees set at approx. €2,770/year with frequent institutional fee waivers.', tag: 'State Support' },
        { title: 'Campus France Scholarship Search (Campus Bourses)', description: 'Searchable directory of regional and bilateral financial aid opportunities.', tag: 'Directory' }
      ],
      realityCheck: 'Living costs in France (especially Paris and major cities) require realistic budgeting. Students must prove at least €615 per month in living funds for visa approval.'
    }
  },

  // =========================================================================
  // 9. NETHERLANDS
  // =========================================================================
  {
    id: 'netherlands',
    name: 'Netherlands',
    flag: '🇳🇱',
    tagline: 'Studielink portal, high proportion of English-taught programs, and Numerus Fixus deadlines.',
    summary: 'The Netherlands offers a wide variety of English-taught Bachelor’s programs at research universities and universities of applied sciences, with applications beginning on Studielink.',
    primaryApplicationRoute: 'Studielink & Institutional Portals',
    systemSummary: 'Applications for Dutch higher education start on Studielink (studielink.nl), the national application registration platform. After registering on Studielink, students complete their detailed academic dossier on the university’s own online admissions portal (e.g., Osiris).',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Research Universities vs. Universities of Applied Sciences',
        paragraphs: [
          'Dutch higher education is divided into two sectors: Research Universities (WO - offering 3-year research-focused Bachelor’s degrees) and Universities of Applied Sciences (HBO - offering 4-year practical, career-focused Bachelor’s degrees).',
          'The Netherlands is renowned for offering hundreds of fully English-taught Bachelor’s degree programs.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Studielink Registration & Program Types',
        paragraphs: [
          '1. Create an account on Studielink (https://www.studielink.nl/) and select your chosen study programs (maximum of 4 applications, with a maximum of 2 Numerus Fixus programs).',
          '2. You will receive login credentials for the university’s portal to upload transcripts, CV, and motivation materials.',
          '3. Program types: Regular programs (apply until May 1) vs. Numerus Fixus programs (restricted capacity programs with an early January 15 deadline and competitive ranking selection).'
        ],
        items: [
          {
            label: 'Studielink (National Portal)',
            description: 'Central application registry for all accredited Dutch higher education institutions.',
            badge: 'National Portal'
          },
          {
            label: 'Numerus Fixus Programs',
            description: 'Restricted quota programs (e.g., Medicine, Psychology, select Computer Science/AI programs) with a strict January 15 deadline.',
            badge: 'Early Jan 15'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Diploma Equivalence (VWO), Mathematics & English',
        items: [
          {
            label: 'Secondary School Diploma Equivalent to Dutch VWO',
            description: 'Research universities require a pre-university secondary credential (such as IB Diploma, A-Levels, or national high school diploma evaluated by Nuffic).',
            level: 'commonly-required'
          },
          {
            label: 'Subject Prerequisites (Mathematics Track)',
            description: 'Crucial for STEM, Business, and Economics programs (often requiring Mathematics A, B, or equivalent advanced calculus).',
            level: 'commonly-required'
          },
          {
            label: 'English Language Proficiency (IELTS / TOEFL)',
            description: 'IELTS Academic (typically 6.5 overall with min 6.0 in subscores) or TOEFL iBT (90+).',
            level: 'commonly-required'
          },
          {
            label: 'Motivation Letter / Personal Statement',
            description: 'Required for selective programs detailing why you chose the program and university.',
            level: 'sometimes-required'
          },
          {
            label: 'CV / Resume',
            description: 'Concise outline of educational milestones and extracurricular achievements.',
            level: 'sometimes-required'
          },
          {
            label: 'Selection Tests / Homework Assignments',
            description: 'Administered for Numerus Fixus and selective programs in February–March.',
            level: 'required-for-certain-programs'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'University Portal Uploads & Student Housing Alert',
        items: [
          {
            label: 'High School Transcripts & Certified Translations',
            description: 'Records of all completed secondary school years with official English translations.',
            level: 'commonly-required'
          },
          {
            label: 'Course Descriptions / Syllabi (for Math/Sciences)',
            description: 'Detailed course content descriptions if university requires verification of mathematics equivalency.',
            level: 'sometimes-required'
          },
          {
            label: 'Student Housing Verification (Crucial Notice)',
            description: 'Student housing in the Netherlands is extremely scarce. Universities explicitly advise securing accommodation before arriving.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'IELTS, TOEFL, and Mathematics Deficiency Exams',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'If your secondary mathematics is deemed slightly below the Dutch VWO standard, universities may ask you to sit for an online Boswell-Bèta or OMPT Mathematics exam.'
        ],
        items: [
          {
            label: 'IELTS Academic / TOEFL iBT',
            description: 'Required for non-native English speakers applying to English-taught degree tracks.',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'OMPT / Boswell-Bèta Mathematics Tests',
            description: 'Standardized online math proficiency tests used to fulfill subject prerequisites.',
            level: 'required-for-certain-programs'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Tuition Fees & NL Scholarship Opportunities',
        paragraphs: [
          'Non-EU undergraduate tuition in the Netherlands ranges from approx. €9,000 to €17,000+ per year (higher for Liberal Arts and Sciences colleges).',
          'The NL Scholarship (formerly Holland Scholarship) offers a one-time €5,000 grant for selected non-EU students entering their first year.'
        ],
        items: [
          {
            label: 'NL Scholarship (Ministry of Education)',
            description: 'One-time €5,000 financial contribution awarded in the first year of undergraduate studies.',
            badge: 'Partial Grant'
          },
          {
            label: 'Institutional Excellence Scholarships',
            description: 'Merit-based tuition discounts offered by select individual Dutch universities.',
            badge: 'Merit'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Numerus Fixus vs. Regular Deadlines',
        paragraphs: [
          'Numerus Fixus deadline is strictly January 15. Regular non-EU application deadlines generally range between April 1 and May 1.'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Dutch Government Links',
        items: [
          {
            label: 'Study in NL (Nuffic)',
            description: 'Official national portal for international students by the Dutch organisation for internationalisation in education.',
            link: { text: 'Visit Study in NL', url: 'https://www.studyinnl.org/' }
          },
          {
            label: 'Studielink Official Portal',
            description: 'Centralized enrollment registration service for higher education in the Netherlands.',
            link: { text: 'Visit Studielink', url: 'https://www.studielink.nl/' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'nl-diploma', name: 'Diploma Equivalent to Dutch VWO', level: 'commonly-required', description: 'Pre-university secondary qualification evaluated by Nuffic.' },
      { id: 'nl-transcripts', name: 'Academic Transcripts & Translations', level: 'commonly-required', description: 'Certified grades in English or Dutch.' },
      { id: 'nl-math', name: 'Mathematics Prerequisite Benchmark', level: 'commonly-required', description: 'Meeting specific math curriculum levels (Math A or Math B equivalent).' },
      { id: 'nl-english', name: 'English Language Test (IELTS/TOEFL)', level: 'commonly-required', description: 'IELTS 6.5 (min 6.0 bands) or TOEFL 90+.' },
      { id: 'nl-numerus', name: 'Numerus Fixus Selection Test', level: 'required-for-certain-programs', description: 'Required for restricted capacity programs with January 15 deadline.' },
      { id: 'nl-housing', name: 'Housing & Financial Proof for Visa', level: 'required-after-admission', description: 'Indisputable housing search and living cost proof for IND visa sponsorship.' }
    ],
    officialResources: [
      {
        label: 'Study in NL (Official Portal)',
        url: 'https://www.studyinnl.org/',
        organization: 'Nuffic (Dutch Organisation for Internationalisation in Education)',
        description: 'Comprehensive official guide on Dutch degree programs, credential evaluation, visas, and student life.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'Studielink Enrollment Platform',
        url: 'https://www.studielink.nl/',
        organization: 'Studielink Foundation',
        description: 'Official national electronic portal for initiating university applications and student registrations.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: 'October – November', title: 'Studielink Registration', description: 'Create Studielink account, select study programs, and receive university portal login.', actionableMilestone: 'Register programs on Studielink.' },
      { period: 'January 15', title: 'Numerus Fixus Deadline', description: 'Strict deadline for all quota-restricted programs (Medicine, Psychology, select CS/AI).', actionableMilestone: 'Submit Numerus Fixus dossiers.' },
      { period: 'February – March', title: 'Selection Tests & Regular Dossiers', description: 'Complete online selection assessments for Numerus Fixus and upload materials for regular programs.', actionableMilestone: 'Complete selection tasks.' },
      { period: 'April 1 – May 1', title: 'Standard Non-EU Application Deadline', description: 'Final deadline for non-EU regular degree applications and NL Scholarship submissions.', actionableMilestone: 'Finalize non-EU applications.' },
      { period: 'May – July', title: 'Visa Sponsorship (IND) & Housing', description: 'University initiates IND student visa and residence permit sponsorship; secure accommodation.', actionableMilestone: 'Confirm housing and visa approval.' }
    ],
    scholarshipInfo: {
      overview: 'Dutch university funding is primarily merit-based with modest partial scholarship grants.',
      types: [
        { title: 'NL Scholarship (Ministry of Education)', description: 'One-time €5,000 contribution for non-EU students in their first year.', tag: 'Partial' },
        { title: 'University Institutional Scholarships', description: 'Selective partial fee remissions awarded to top academic candidates.', tag: 'Merit' }
      ],
      realityCheck: 'Finding student accommodation in the Netherlands is extremely challenging. Do not travel to the Netherlands without confirmed housing, and note that full-ride undergraduate scholarships do not exist.'
    }
  },

  // =========================================================================
  // 10. MALAYSIA
  // =========================================================================
  {
    id: 'malaysia',
    name: 'Malaysia',
    flag: '🇲🇾',
    tagline: 'Direct university admissions, branch campuses, and EMGS Student Pass processing.',
    summary: 'Malaysia is a regional higher education destination in Southeast Asia, hosting leading public research universities and international branch campuses with English-medium instruction.',
    primaryApplicationRoute: 'Direct University Portals & Education Malaysia Global Services (EMGS)',
    systemSummary: 'Students apply directly to their chosen Malaysian university (public research institutions, private universities, or international branch campuses such as Monash or Nottingham). Once an offer is issued, the university and EMGS coordinate the electronic Visa Approval Letter (eVAL) and Student Pass.',
    sections: [
      {
        id: 'overview',
        title: '1. Application Overview',
        subtitle: 'Institution Types & English-Medium Instruction',
        paragraphs: [
          'Malaysia provides diverse higher education options: top public research universities (e.g., Universiti Malaya, UTM, UKM, USM), established private universities (e.g., Taylor’s, Sunway, UCSI), and international branch campuses (e.g., Monash University Malaysia, University of Nottingham Malaysia, Heriot-Watt Malaysia).',
          'Most international undergraduate degree programs in Malaysia are taught entirely in English.'
        ],
        callout: {
          type: 'info',
          title: 'Institutional Disclaimer',
          text: 'These are common requirements, not universal rules. Every university and program may have different requirements.'
        }
      },
      {
        id: 'how-it-works',
        title: '2. How Applications Work',
        subtitle: 'Direct Admissions & EMGS Visa Processing',
        paragraphs: [
          '1. Apply directly through the international student portal of your chosen Malaysian university.',
          '2. Receive an official Offer Letter upon academic evaluation.',
          '3. The university submits your visa application through Education Malaysia Global Services (EMGS) to obtain the Electronic Visa Approval Letter (eVAL).',
          '4. Arrive in Malaysia, complete the post-arrival medical check, and have the Student Pass endorsed in your passport.'
        ],
        items: [
          {
            label: 'Direct University Applications',
            description: 'Online application submitted directly on the university’s international admissions website.',
            badge: 'Direct Admission'
          },
          {
            label: 'EMGS (Education Malaysia Global Services)',
            description: 'Official government-mandated processing body managing international student visas and health screening.',
            badge: 'Visa & EMGS'
          }
        ]
      },
      {
        id: 'common-requirements',
        title: '3. Common Requirements',
        subtitle: 'Secondary Certificates, Transcripts & Health Clearance',
        items: [
          {
            label: 'Secondary School Certificate (12 Years of Schooling)',
            description: 'High school graduation certificate (e.g., A-Levels, IB, High School Diploma, or equivalent national certificate).',
            level: 'commonly-required'
          },
          {
            label: 'Official Academic Transcripts with Certified Translations',
            description: 'Complete academic records for all secondary school years with official English translations.',
            level: 'commonly-required'
          },
          {
            label: 'English Language Proficiency (IELTS / TOEFL / MUET / PTE)',
            description: 'IELTS Academic (typically 5.5–6.5 depending on faculty), TOEFL iBT, PTE, or Malaysian University English Test (MUET).',
            level: 'commonly-required'
          },
          {
            label: 'Full Passport Copy',
            description: 'Clear color copy of all passport pages (including blank pages) with minimum 18 months validity.',
            level: 'commonly-required'
          },
          {
            label: 'Health Declaration & Medical Screening',
            description: 'Pre-arrival health declaration and mandatory post-arrival medical screening at an EMGS-approved clinic in Malaysia.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'documents',
        title: '4. Documents Checklist',
        subtitle: 'EMGS Visa Approval Letter (eVAL) Dossier',
        items: [
          {
            label: 'High School Certificates & Transcripts',
            description: 'Original language documents and certified English translations.',
            level: 'commonly-required'
          },
          {
            label: 'Passport Photograph (White Background)',
            description: 'Specific dimensions (45mm x 35mm) adhering to EMGS biometric standards.',
            level: 'commonly-required'
          },
          {
            label: 'Electronic Visa Approval Letter (eVAL)',
            description: 'Official visa approval issued by the Malaysian Immigration Department via EMGS.',
            level: 'required-after-admission'
          }
        ]
      },
      {
        id: 'tests-language',
        title: '5. Tests and Language Requirements',
        subtitle: 'IELTS, TOEFL, and MUET Assessments',
        paragraphs: [
          'Universities may ask for proof of language ability, an admission test, both, or neither. Requirements depend on the country, university, program, and applicant’s previous education.',
          'Most degree programs require an IELTS score of 5.5 to 6.5. Students without a standardized English score may sit for the Malaysian University English Test (MUET) or take intensive English courses on campus.'
        ],
        items: [
          {
            label: 'IELTS Academic',
            description: 'Accepted by all public, private, and branch campus universities in Malaysia (benchmark: 5.5–6.5).',
            level: 'commonly-required',
            link: { text: 'View SVT IELTS Prep Hub', url: '#ielts' }
          },
          {
            label: 'MUET (Malaysian University English Test)',
            description: 'National English language assessment administered by the Malaysian Examinations Council.',
            level: 'sometimes-required'
          }
        ]
      },
      {
        id: 'scholarships-funding',
        title: '6. Scholarships and Funding',
        subtitle: 'Competitive Tuition & University Waivers',
        paragraphs: [
          'Tuition in Malaysia is comparatively affordable (typically USD $3,500 to $9,000/year at public/private universities; $9,000 to $18,000/year at international branch campuses).',
          'Private universities frequently offer 20% to 50% merit tuition fee scholarships based on secondary school results.'
        ],
        items: [
          {
            label: 'Institutional Merit Fee Waivers',
            description: 'Partial tuition discounts awarded based on high school academic GPA.',
            badge: 'Merit Waiver'
          },
          {
            label: 'Malaysian International Scholarship (MIS - Graduate)',
            description: 'Government scholarship program primarily targeted at postgraduate Master’s and PhD researchers.',
            badge: 'Postgraduate'
          }
        ]
      },
      {
        id: 'timeline',
        title: '7. Application Timeline',
        subtitle: 'Multiple Intakes Across the Year',
        paragraphs: [
          'Malaysian universities offer multiple intakes: September/October (primary intake), February/March (secondary intake), and select summer intakes (May/July).'
        ]
      },
      {
        id: 'official-resources',
        title: '8. Official Resources',
        subtitle: 'Verified Government & Visa Portals',
        items: [
          {
            label: 'Education Malaysia (Ministry of Higher Education)',
            description: 'Official Ministry of Higher Education portal for international students.',
            link: { text: 'Visit Education Malaysia', url: 'https://educationmalaysia.gov.my/' }
          },
          {
            label: 'Education Malaysia Global Services (EMGS)',
            description: 'Official processing portal for student visas and Student Pass tracking.',
            link: { text: 'Visit EMGS Portal', url: 'https://visa.educationmalaysia.gov.my/' }
          }
        ]
      }
    ],
    commonRequirements: [
      { id: 'my-diploma', name: 'High School Completion Certificate', level: 'commonly-required', description: 'Certified secondary diploma equivalent to 12 years of education.' },
      { id: 'my-transcripts', name: 'Academic Transcripts & Translations', level: 'commonly-required', description: 'Official academic transcript with English translation.' },
      { id: 'my-english', name: 'English Language Test (IELTS/TOEFL/MUET)', level: 'commonly-required', description: 'IELTS 5.5–6.5 or equivalent.' },
      { id: 'my-passport', name: 'Full Passport Scan (All Pages)', level: 'commonly-required', description: 'Color scan of all passport pages with at least 18 months validity.' },
      { id: 'my-eval', name: 'EMGS eVAL & Student Pass', level: 'required-after-admission', description: 'Electronic Visa Approval Letter processed through EMGS prior to arrival.' },
      { id: 'my-medical', name: 'Post-Arrival Health Screening', level: 'required-after-admission', description: 'Mandatory clinical medical examination in Malaysia for Student Pass endorsement.' }
    ],
    officialResources: [
      {
        label: 'Education Malaysia (Ministry of Higher Education)',
        url: 'https://educationmalaysia.gov.my/',
        organization: 'Ministry of Higher Education Malaysia',
        description: 'Official government portal covering accredited universities, study fields, and student guidance.',
        lastReviewed: '2025-02-15'
      },
      {
        label: 'EMGS Visa & Student Pass Portal',
        url: 'https://visa.educationmalaysia.gov.my/',
        organization: 'Education Malaysia Global Services',
        description: 'Official portal for international student visa processing, document checklists, and application status tracking.',
        lastReviewed: '2025-02-15'
      }
    ],
    timelineSteps: [
      { period: '2–4 Months Before Intake', title: 'Direct Application Submission', description: 'Submit online application and academic transcripts to chosen university.', actionableMilestone: 'Receive official Offer Letter.' },
      { period: '6–8 Weeks Before Intake', title: 'EMGS Visa Processing', description: 'Accept offer, pay visa processing fee, and university submits dossier to EMGS for eVAL issuance.', actionableMilestone: 'Receive Electronic Visa Approval Letter (eVAL).' },
      { period: '2–4 Weeks Before Intake', title: 'Single Entry Visa (SEV) & Travel', description: 'Apply for Single Entry Visa at Malaysian embassy (if required by nationality) and book flights.', actionableMilestone: 'Complete pre-arrival travel arrangements.' },
      { period: 'Week 1 on Campus', title: 'Post-Arrival Medical & Student Pass', description: 'Complete mandatory medical screening at EMGS clinic; university submits passport for Student Pass endorsement.', actionableMilestone: 'Receive endorsed Student Pass.' }
    ],
    scholarshipInfo: {
      overview: 'Malaysia provides cost-effective higher education with extensive partial merit waivers at private universities.',
      types: [
        { title: 'Private University Merit Waivers', description: '20% to 50% tuition reduction based on high school examination grades.', tag: 'Merit' },
        { title: 'Branch Campus Academic Scholarships', description: 'Competitive tuition reductions at international branch campuses.', tag: 'Excellence' }
      ],
      realityCheck: 'Admission and visa approval are separate procedures. University admission does not guarantee immigration approval. Always apply for the Student Pass through official EMGS channels.'
    }
  }
];
