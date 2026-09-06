import { DocumentComparisonItem } from '../types/universityApplications';

export const DOCUMENT_COMPARISON_MATRIX: DocumentComparisonItem[] = [
  {
    id: 'doc-passport',
    documentName: 'Passport or Identification',
    category: 'identity',
    description: 'Valid government-issued international travel passport with sufficient future validity (typically 6 to 18 months).',
    countryRatings: {
      'united-states': { rating: 'sometimes', note: 'Not required for initial Common App submission, but required for Form I-20 and F-1 student visa processing.' },
      'saudi-arabia': { rating: 'common', note: 'Mandatory on the Study in Saudi portal at the time of initial application.' },
      'turkiye': { rating: 'common', note: 'Mandatory during initial online university and Türkiye Scholarships applications.' },
      'canada': { rating: 'common', note: 'Required during portal registration or document upload stage, and for the IRCC study permit.' },
      'united-kingdom': { rating: 'sometimes', note: 'Details entered in UCAS; full scan required for Confirmation of Acceptance for Studies (CAS) and visa.' },
      'germany': { rating: 'common', note: 'Required by uni-assist and direct university portals for identity verification.' },
      'australia': { rating: 'common', note: 'Color passport scan required with initial application submission.' },
      'france': { rating: 'common', note: 'Mandatory on Études en France / Parcoursup portals and for student visa (VLS-TS).' },
      'netherlands': { rating: 'common', note: 'Required for Studielink registration and IND visa sponsorship.' },
      'malaysia': { rating: 'common', note: 'Color scan of all pages (including blank pages) required for university and EMGS eVAL processing.' }
    }
  },
  {
    id: 'doc-secondary-certificate',
    documentName: 'Secondary-School Certificate (Diploma)',
    category: 'academic',
    description: 'Official certificate of secondary school completion or high school graduation diploma.',
    countryRatings: {
      'united-states': { rating: 'after-admission', note: 'Initial review is done on high school transcripts; final graduation certificate confirmed before matriculation.' },
      'saudi-arabia': { rating: 'common', note: 'Must be attested by the Ministry of Foreign Affairs and Saudi Cultural Mission.' },
      'turkiye': { rating: 'common', note: 'Required for initial evaluation and mandatory for obtaining the Equivalence Certificate (Denklik).' },
      'canada': { rating: 'after-admission', note: 'Initial conditional offers are made on interim marks; final diploma required in July/August.' },
      'united-kingdom': { rating: 'after-admission', note: 'Final certificates required to confirm conditional offers into unconditional status.' },
      'germany': { rating: 'common', note: 'Mandatory for HZB Abitur equivalence assessment via uni-assist.' },
      'australia': { rating: 'common', note: 'Final completion certificate required to satisfy academic conditions and receive eCoE.' },
      'france': { rating: 'common', note: 'Baccalauréat equivalent diploma required with official sworn French translation.' },
      'netherlands': { rating: 'common', note: 'Evaluated by Nuffic/university against Dutch VWO/HBO benchmarks.' },
      'malaysia': { rating: 'common', note: 'High school graduation certificate required for both university admission and EMGS clearance.' }
    }
  },
  {
    id: 'doc-transcripts',
    documentName: 'Academic Transcripts',
    category: 'academic',
    description: 'Detailed official grade reports covering all secondary school years (typically Grades 9 through 12).',
    countryRatings: {
      'united-states': { rating: 'common', note: 'Grades 9–12 submitted directly by school counselor with mid-year updates.' },
      'saudi-arabia': { rating: 'common', note: 'Attested official transcripts covering secondary school years.' },
      'turkiye': { rating: 'common', note: 'Official secondary school transcripts with grading legend.' },
      'canada': { rating: 'common', note: 'Heavy focus on Grade 11 and final-year Grade 12 prerequisite course marks.' },
      'united-kingdom': { rating: 'common', note: 'Entered into UCAS and validated by school referee.' },
      'germany': { rating: 'common', note: 'Submitted with certified translations to uni-assist or university.' },
      'australia': { rating: 'common', note: 'Certified academic marks converted to Australian ATAR equivalent.' },
      'france': { rating: 'common', note: 'Transcripts for the last 3 secondary years with certified French translations.' },
      'netherlands': { rating: 'common', note: 'Complete secondary grade reports with emphasis on mathematics and science tracks.' },
      'malaysia': { rating: 'common', note: 'Official academic grade reports submitted directly to the university.' }
    }
  },
  {
    id: 'doc-predicted-results',
    documentName: 'Predicted Results',
    category: 'academic',
    description: 'School-issued forecasts of final performance on external national or international exams (IB, A-Levels, APs).',
    countryRatings: {
      'united-states': { rating: 'sometimes', note: 'Helpful context for international curricula (IB/A-Levels), but US holistic review looks at four-year GPA history.' },
      'saudi-arabia': { rating: 'sometimes', note: 'Universities generally require completed high school certificates, though provisional reviews occur for certain intakes.' },
      'turkiye': { rating: 'sometimes', note: 'Used for early provisional offers by foundation universities; public universities prefer final marks.' },
      'canada': { rating: 'common', note: 'Essential for interim conditional admission offers in January–March.' },
      'united-kingdom': { rating: 'common', note: 'Central basis for UCAS conditional offers; submitted directly by the school referee.' },
      'germany': { rating: 'sometimes', note: 'Some universities accept predicted grades for preliminary assessment (VPD); final certificate required for matriculation.' },
      'australia': { rating: 'common', note: 'Commonly used to issue Conditional Offers before final exam results are published.' },
      'france': { rating: 'sometimes', note: 'Evaluated on current interim bulletin de notes on Parcoursup / EEF.' },
      'netherlands': { rating: 'common', note: 'Used to grant conditional acceptance pending final graduation.' },
      'malaysia': { rating: 'common', note: 'Provisional offers widely issued based on forecast or trial examination results.' }
    }
  },
  {
    id: 'doc-certified-translations',
    documentName: 'Certified Translations',
    category: 'academic',
    description: 'Sworn, notarized, or official institutional translations of academic records not originally issued in the host country language.',
    countryRatings: {
      'united-states': { rating: 'common', note: 'Official certified English translations required alongside original-language transcripts.' },
      'saudi-arabia': { rating: 'common', note: 'Certified translations into Arabic or English required.' },
      'turkiye': { rating: 'common', note: 'Sworn notary-certified translations into Turkish or English are mandatory.' },
      'canada': { rating: 'common', note: 'Certified English or French translations required.' },
      'united-kingdom': { rating: 'common', note: 'Certified English translations stamped by an official translator.' },
      'germany': { rating: 'common', note: 'Officially certified German or English translations mandatory for uni-assist.' },
      'australia': { rating: 'common', note: 'Certified translations by an accredited translator (e.g. NAATI) required.' },
      'france': { rating: 'common', note: 'Certified sworn translations into French (traduction assermentée) required.' },
      'netherlands': { rating: 'common', note: 'Official English, Dutch, German, or French translations accepted.' },
      'malaysia': { rating: 'common', note: 'Certified English translations required for university and EMGS review.' }
    }
  },
  {
    id: 'doc-english-test',
    documentName: 'English-Language Test (IELTS / TOEFL / DET / PTE)',
    category: 'testing',
    description: 'Standardized assessment of English listening, reading, writing, and speaking.',
    countryRatings: {
      'united-states': { rating: 'common', note: 'DET, IELTS, or TOEFL widely accepted for non-native English applicants.' },
      'saudi-arabia': { rating: 'program-specific', note: 'Required for degree programs instructed in English (e.g., KFUPM, King Saud University STEM faculties).' },
      'turkiye': { rating: 'program-specific', note: 'Required for English-medium (100% or 30%) programs (TOEFL/IELTS or university exemption exam).' },
      'canada': { rating: 'common', note: 'IELTS Academic, TOEFL iBT, or DET (where accepted) required for non-native applicants.' },
      'united-kingdom': { rating: 'common', note: 'IELTS Academic / UKVI IELTS required for admission and UK Student visa.' },
      'germany': { rating: 'program-specific', note: 'Required for English-taught International Degree Programs (typically IELTS 6.5+).' },
      'australia': { rating: 'common', note: 'IELTS Academic, PTE Academic, or TOEFL iBT required for admission and Subclass 500 visa.' },
      'france': { rating: 'program-specific', note: 'Required for English-taught bachelor’s programs (typically IELTS 6.0–6.5+).' },
      'netherlands': { rating: 'common', note: 'Required for virtually all English-taught programs (IELTS 6.5 or TOEFL 90+).' },
      'malaysia': { rating: 'common', note: 'IELTS 5.5–6.5, TOEFL, or MUET required for direct undergraduate entry.' }
    }
  },
  {
    id: 'doc-local-language',
    documentName: 'Local-Language Test (German, French, Turkish, Arabic)',
    category: 'testing',
    description: 'Standardized proficiency certificate for programs taught in the host national language.',
    countryRatings: {
      'united-states': { rating: 'usually-not-required', note: 'Not applicable (English is standard).' },
      'saudi-arabia': { rating: 'program-specific', note: 'Arabic proficiency test or preparatory Arabic institute for Arabic-medium programs.' },
      'turkiye': { rating: 'program-specific', note: 'TÖMER certificate (B2/C1) required for Turkish-medium programs.' },
      'canada': { rating: 'program-specific', note: 'DELF/DALF/TCF required for French-medium institutions in Quebec/Canada.' },
      'united-kingdom': { rating: 'usually-not-required', note: 'Not applicable (English is standard).' },
      'germany': { rating: 'program-specific', note: 'TestDaF (4x4), DSH-2, or telc Deutsch C1 Hochschule mandatory for German-taught degrees.' },
      'australia': { rating: 'usually-not-required', note: 'Not applicable (English is standard).' },
      'france': { rating: 'program-specific', note: 'DELF B2 or DALF C1 mandatory for French-taught undergraduate programs.' },
      'netherlands': { rating: 'program-specific', note: 'NT2-II exam required only if applying to Dutch-taught degree programs.' },
      'malaysia': { rating: 'usually-not-required', note: 'Most international programs are taught in English; Bahasa Melayu required only for specific national curricula.' }
    }
  },
  {
    id: 'doc-standardized-test',
    documentName: 'Standardized Admission Test (SAT / ACT / TR-YÖS / TestAS)',
    category: 'testing',
    description: 'Aptitude or general knowledge test used for undergraduate candidate ranking and evaluation.',
    countryRatings: {
      'united-states': { rating: 'sometimes', note: 'Required at some universities; test-optional or test-flexible at others.' },
      'saudi-arabia': { rating: 'program-specific', note: 'SAT Math / standardized aptitude considered for competitive STEM faculties like KFUPM.' },
      'turkiye': { rating: 'program-specific', note: 'TR-YÖS exam or Digital SAT accepted/required by many public and top foundation universities.' },
      'canada': { rating: 'usually-not-required', note: 'Rarely required unless applying from a U.S. high school curriculum.' },
      'united-kingdom': { rating: 'program-specific', note: 'Subject-specific tests required for Medicine (UCAT), Law (LNAT), Math (STEP/TMUA), or Oxbridge.' },
      'germany': { rating: 'sometimes', note: 'TestAS aptitude exam accepted or recommended by certain universities to boost admission ranking.' },
      'australia': { rating: 'usually-not-required', note: 'Admissions based on high school GPA/ATAR equivalence; SAT used primarily for US diploma holders.' },
      'france': { rating: 'usually-not-required', note: 'Evaluation based on school marks; specific concours tests exist for Grande École tracks.' },
      'netherlands': { rating: 'program-specific', note: 'Selection tests for Numerus Fixus programs; OMPT/Boswell-Bèta for math prerequisite gaps.' },
      'malaysia': { rating: 'usually-not-required', note: 'Admission based on secondary school certificate grades (A-Levels, IB, High School Diploma).' }
    }
  },
  {
    id: 'doc-personal-statement',
    documentName: 'Personal Statement or Motivation Letter',
    category: 'written',
    description: 'Written essay explaining personal background, academic curiosity, why you chose the course/university, and career vision.',
    countryRatings: {
      'united-states': { rating: 'common', note: 'Central component of Common App (650 words) plus supplemental university-specific essays.' },
      'saudi-arabia': { rating: 'sometimes', note: 'Requested for select scholarship tracks and graduate institutes (e.g. KAUST statement of purpose).' },
      'turkiye': { rating: 'sometimes', note: 'Mandatory for Türkiye Scholarships; optional for most direct public university admissions.' },
      'canada': { rating: 'program-specific', note: 'Required for competitive faculties (e.g., UBC Personal Profile, Waterloo AIF, Queen’s Commerce).' },
      'united-kingdom': { rating: 'common', note: 'Mandatory on UCAS; focused strictly on academic subject engagement and readiness.' },
      'germany': { rating: 'sometimes', note: 'Required by select universities and specific selective English-taught degree programs.' },
      'australia': { rating: 'sometimes', note: 'Included as part of the Genuine Student (GS) statement or selective scholarship applications.' },
      'france': { rating: 'common', note: 'Lettre de Motivation required on Études en France and Parcoursup for each chosen program.' },
      'netherlands': { rating: 'sometimes', note: 'Required for selective, Liberal Arts, and Numerus Fixus degree programs.' },
      'malaysia': { rating: 'sometimes', note: 'Required for select medical, postgraduate, and international scholarship applications.' }
    }
  },
  {
    id: 'doc-recommendations',
    documentName: 'Recommendation Letters or School Reference',
    category: 'written',
    description: 'Confidential reference letters written by academic teachers, school counselors, or principals evaluating intellectual ability and character.',
    countryRatings: {
      'united-states': { rating: 'common', note: 'Standard requirement: 2 academic teacher recommendations + 1 school counselor report.' },
      'saudi-arabia': { rating: 'sometimes', note: 'Recommended for Study in Saudi portal and mandatory for KAUST/KFUPM research tracks.' },
      'turkiye': { rating: 'sometimes', note: 'Required for Türkiye Scholarships; not commonly requested for direct public university admission.' },
      'canada': { rating: 'program-specific', note: 'Not standard for general admission; required for prestige scholarship nominations and select programs.' },
      'united-kingdom': { rating: 'common', note: 'One comprehensive academic reference submitted directly via UCAS by a teacher or advisor.' },
      'germany': { rating: 'usually-not-required', note: 'German undergraduate admissions are strictly based on formal credential recognition (HZB).' },
      'australia': { rating: 'usually-not-required', note: 'Undergraduate admissions rely almost entirely on academic grades and English proof.' },
      'france': { rating: 'sometimes', note: 'Included in certain selective Grande École applications or teacher evaluations on Parcoursup.' },
      'netherlands': { rating: 'sometimes', note: 'Required for selective University Colleges (Liberal Arts) and select restricted programs.' },
      'malaysia': { rating: 'sometimes', note: 'Required for scholarship applications and select postgraduate tracks.' }
    }
  },
  {
    id: 'doc-activities-list',
    documentName: 'Activities List (Extracurriculars & Leadership)',
    category: 'written',
    description: 'Comprehensive inventory of out-of-classroom involvement: clubs, community service, sports, arts, work, or family commitments.',
    countryRatings: {
      'united-states': { rating: 'common', note: 'Core Common App section: up to 10 activities + 5 honors with hours, weeks, and leadership roles.' },
      'saudi-arabia': { rating: 'sometimes', note: 'Volunteering and extracurricular achievements can be uploaded to strengthen scholarship profile.' },
      'turkiye': { rating: 'sometimes', note: 'Valuable in the Social Activities section of the Türkiye Scholarships application.' },
      'canada': { rating: 'program-specific', note: 'Requested in supplemental profiles for engineering, commerce, and leadership scholarships.' },
      'united-kingdom': { rating: 'program-specific', note: 'Included in UCAS personal statement only when directly relevant to the academic course.' },
      'germany': { rating: 'usually-not-required', note: 'Not evaluated for public university admission.' },
      'australia': { rating: 'usually-not-required', note: 'Not evaluated for standard undergraduate admissions.' },
      'france': { rating: 'sometimes', note: 'Reflected in the "Activités et centres d’intérêt" section of Parcoursup.' },
      'netherlands': { rating: 'sometimes', note: 'Considered for holistic admissions at Dutch University Colleges and selective programs.' },
      'malaysia': { rating: 'sometimes', note: 'Evaluated when applying for private university co-curricular leadership scholarships.' }
    }
  },
  {
    id: 'doc-cv-resume',
    documentName: 'Curriculum Vitae (CV / Resume)',
    category: 'written',
    description: 'Structured 1–2 page document detailing education, certifications, awards, volunteering, and skills.',
    countryRatings: {
      'united-states': { rating: 'sometimes', note: 'Accepted as an optional upload by select colleges on the Common App.' },
      'saudi-arabia': { rating: 'sometimes', note: 'Recommended for graduate and research scholarship tracks.' },
      'turkiye': { rating: 'sometimes', note: 'Required for Türkiye Scholarships and select private universities.' },
      'canada': { rating: 'program-specific', note: 'Required for select cooperative education (co-op) tracks and specialized business faculties.' },
      'united-kingdom': { rating: 'usually-not-required', note: 'Undergraduate applications use the standard UCAS form.' },
      'germany': { rating: 'common', note: 'Tabular CV (lückenloser Lebenslauf) commonly requested by uni-assist and universities.' },
      'australia': { rating: 'sometimes', note: 'Required if there is a study gap between high school completion and university application.' },
      'france': { rating: 'common', note: 'Mandatory standard document on Études en France and Parcoursup dossiers.' },
      'netherlands': { rating: 'sometimes', note: 'Commonly requested in university portal application checklists.' },
      'malaysia': { rating: 'sometimes', note: 'Required if explaining study gaps or applying for postgraduate programs.' }
    }
  },
  {
    id: 'doc-portfolio',
    documentName: 'Portfolio / Audition / Creative Submissions',
    category: 'written',
    description: 'Collection of creative work, design projects, architectural drawings, or performance audition recordings.',
    countryRatings: {
      'united-states': { rating: 'program-specific', note: 'Required for Architecture, Fine Arts, Design, Music, and Theater majors via SlideRoom.' },
      'saudi-arabia': { rating: 'program-specific', note: 'Required for Architecture, Interior Design, and Fine Arts faculties.' },
      'turkiye': { rating: 'program-specific', note: 'Required for faculties of Fine Arts, Architecture, and Conservatory programs.' },
      'canada': { rating: 'program-specific', note: 'Mandatory for Architecture, Visual Arts, and Design faculties.' },
      'united-kingdom': { rating: 'program-specific', note: 'Required for Art & Design, Architecture, Music, and Drama courses.' },
      'germany': { rating: 'program-specific', note: 'Artistic portfolio (Mappe) and practical entrance examination required for Art and Design academies.' },
      'australia': { rating: 'program-specific', note: 'Required for Creative Arts, Animation, Architecture, and Design programs.' },
      'france': { rating: 'program-specific', note: 'Mandatory for Écoles d’Art, Architecture (ENSA), and specialized design institutes.' },
      'netherlands': { rating: 'program-specific', note: 'Required for Design Academies, Architecture, and Art universities.' },
      'malaysia': { rating: 'program-specific', note: 'Required for Creative Multimedia, Architecture, and Fine Arts faculties.' }
    }
  },
  {
    id: 'doc-financial-documents',
    documentName: 'Financial Documents & Proof of Funds',
    category: 'financial-visa',
    description: 'Bank statements, parent income certificates, tax returns, or official scholarship sponsorship letters.',
    countryRatings: {
      'united-states': { rating: 'sometimes', note: 'CSS Profile & parent tax returns required for institutional aid; bank statement required for Form I-20.' },
      'saudi-arabia': { rating: 'sometimes', note: 'Required for self-funded applications; fully funded scholarship recipients receive state coverage.' },
      'turkiye': { rating: 'after-admission', note: 'Proof of funds required for student residence permit (İkamet) application in Türkiye.' },
      'canada': { rating: 'after-admission', note: 'Extensive proof of financial resources (tuition + CAD $20,635+ living funds) required for IRCC study permit.' },
      'united-kingdom': { rating: 'after-admission', note: 'Official bank statements showing 28-day holding of tuition + living funds required for UK Student visa.' },
      'germany': { rating: 'after-admission', note: 'Blocked Bank Account (Sperrkonto) with approx. €11,904 required for the German National Visa.' },
      'australia': { rating: 'after-admission', note: 'Genuine Student financial proof showing tuition + living costs (AUD $29,710/year) for visa lodge.' },
      'france': { rating: 'after-admission', note: 'Proof of at least €615 per month for the French Long-Stay Student Visa (VLS-TS).' },
      'netherlands': { rating: 'after-admission', note: 'Proof of annual tuition + IND living costs (approx. €12,500+) transferred or documented to university.' },
      'malaysia': { rating: 'after-admission', note: 'Bank statement of applicant or sponsor showing capability to pay tuition and living expenses for EMGS.' }
    }
  },
  {
    id: 'doc-visa-documents',
    documentName: 'Visa Documents & Clearances After Admission',
    category: 'financial-visa',
    description: 'Official acceptance certificates, medical examinations, police clearances, and student visa applications.',
    countryRatings: {
      'united-states': { rating: 'after-admission', note: 'Form I-20 from university, SEVIS I-901 fee receipt, DS-160 confirmation, and embassy interview.' },
      'saudi-arabia': { rating: 'after-admission', note: 'Ministry visa authorization, medical fitness report, police clearance certificate, and embassy stamping.' },
      'turkiye': { rating: 'after-admission', note: 'Official Acceptance Letter, Turkish student visa (if required), and Provincial Göç İdaresi residence permit.' },
      'canada': { rating: 'after-admission', note: 'Letter of Acceptance (LOA), Provincial Attestation Letter (PAL), biometric appointment, and IRCC study permit.' },
      'united-kingdom': { rating: 'after-admission', note: 'CAS number from university, Immigration Health Surcharge (IHS), TB test (if applicable), and Student visa.' },
      'germany': { rating: 'after-admission', note: 'Letter of Admission (Zulassungsbescheid), Blocked Account confirmation, health insurance, and National Visa.' },
      'australia': { rating: 'after-admission', note: 'eCoE from university, Overseas Student Health Cover (OSHC), biometrics, and Subclass 500 visa.' },
      'france': { rating: 'after-admission', note: 'Campus France EEF validation, accommodation attestation, and Long-Stay Student Visa (VLS-TS).' },
      'netherlands': { rating: 'after-admission', note: 'University-sponsored IND Entry Visa (MVV) and Residence Permit (VVR), plus TB check if applicable.' },
      'malaysia': { rating: 'after-admission', note: 'EMGS Electronic Visa Approval Letter (eVAL), Single Entry Visa (SEV), and post-arrival medical check.' }
    }
  }
];
