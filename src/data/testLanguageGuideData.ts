import { StandardizedTestGuideItem } from '../types/universityApplications';

export const STANDARDIZED_TESTS_GUIDE: StandardizedTestGuideItem[] = [
  // 1. Duolingo English Test (DET)
  {
    id: 'det',
    name: 'Duolingo English Test',
    shortCode: 'DET',
    category: 'english-language',
    purpose: 'On-demand, computer-adaptive online English proficiency examination certifying literacy, comprehension, conversation, and production skills for undergraduate and graduate university admissions.',
    commonlyUsedIn: ['united-states', 'canada', 'germany'],
    verificationWarning: 'Accepted by over 5,000 institutions globally. However, some Canadian, UK, and Australian universities or specific visa categories require traditional in-person testing (IELTS/TOEFL). Always verify institutional acceptance.',
    svtPrepSectionId: 'english-test',
    officialUrl: 'https://englishtest.duolingo.com/',
    officialLabel: 'Official Duolingo English Test Portal',
    scoreRangeOrScale: '10 to 160 (reported in 5-point increments; competitive benchmarks: 120–135+)'
  },

  // 2. IELTS Academic
  {
    id: 'ielts',
    name: 'IELTS Academic',
    shortCode: 'IELTS',
    category: 'english-language',
    purpose: 'Four-skill assessment (Listening, Reading, Writing, Speaking) evaluating academic English proficiency for global university admissions and international student visa compliance.',
    commonlyUsedIn: [
      'united-kingdom',
      'canada',
      'australia',
      'united-states',
      'germany',
      'netherlands',
      'malaysia',
      'france',
      'turkiye',
      'saudi-arabia'
    ],
    verificationWarning: 'Universally accepted across the UK, Australia, Canada, Europe, and North America. UK student visa applicants should confirm whether their university requires "IELTS for UKVI".',
    svtPrepSectionId: 'english-test',
    officialUrl: 'https://www.ielts.org/',
    officialLabel: 'Official IELTS Portal (British Council / IDP)',
    scoreRangeOrScale: 'Band 0.0 to 9.0 (typical university minimums: 6.0–7.5 overall)'
  },

  // 3. Digital SAT
  {
    id: 'sat',
    name: 'Digital SAT',
    shortCode: 'SAT',
    category: 'academic-admission',
    purpose: 'Computer-based standardized assessment measuring critical reading, writing, and mathematical reasoning for undergraduate college admissions.',
    commonlyUsedIn: ['united-states', 'turkiye', 'saudi-arabia', 'canada'],
    verificationWarning: 'Standardized testing policies vary dynamically between Required, Test-Optional, and Test-Flexible across institutions. Verify current policy directly with each university.',
    svtPrepSectionId: 'sat',
    officialUrl: 'https://satsuite.collegeboard.org/digital',
    officialLabel: 'College Board Digital SAT Suite',
    scoreRangeOrScale: '400 to 1600 (Reading/Writing: 200–800, Math: 200–800)'
  },

  // 4. TOEFL iBT
  {
    id: 'toefl',
    name: 'TOEFL iBT (Test of English as a Foreign Language)',
    shortCode: 'TOEFL',
    category: 'english-language',
    purpose: 'Standardized test measuring the ability of non-native English speakers to use and understand academic English in university classrooms across Reading, Listening, Speaking, and Writing.',
    commonlyUsedIn: [
      'united-states',
      'canada',
      'germany',
      'netherlands',
      'france',
      'turkiye',
      'saudi-arabia',
      'malaysia'
    ],
    verificationWarning: 'Accepted by over 12,500 universities in more than 160 countries. Verify whether your chosen institution accepts the Home Edition or requires in-person test center scores.',
    officialUrl: 'https://www.ets.org/toefl.html',
    officialLabel: 'ETS Official TOEFL Portal',
    scoreRangeOrScale: '0 to 120 (competitive university benchmark: 85–100+)'
  },

  // 5. ACT
  {
    id: 'act',
    name: 'ACT (American College Testing)',
    shortCode: 'ACT',
    category: 'academic-admission',
    purpose: 'Curriculum-based standardized college entrance examination evaluating English, Mathematics, Reading, and Science reasoning.',
    commonlyUsedIn: ['united-states', 'canada', 'turkiye'],
    verificationWarning: 'Accepted interchangeably with the SAT by virtually all U.S. colleges. Verify whether your target universities are currently test-optional or test-required.',
    officialUrl: 'https://www.act.org/',
    officialLabel: 'Official ACT Portal',
    scoreRangeOrScale: '1 to 36 Composite (competitive benchmark: 28–34+)'
  },

  // 6. TR-YÖS (Türkiye)
  {
    id: 'tr-yos',
    name: 'TR-YÖS (Türkiye Foreign Student Exam)',
    shortCode: 'TR-YÖS',
    category: 'academic-admission',
    purpose: 'Centralized international student entrance examination administered by ÖSYM assessing basic learning skills (mathematical reasoning and abstract logic) for admission to Turkish universities.',
    commonlyUsedIn: ['turkiye'],
    verificationWarning: 'Administered twice a year globally by ÖSYM. Requirements vary: some Turkish public universities require TR-YÖS, while others accept Digital SAT, GCE A-Levels, or high school GPA. Always verify individual university criteria.',
    officialUrl: 'https://www.osym.gov.tr/',
    officialLabel: 'ÖSYM Official Portal (Türkiye Student Selection and Placement Center)',
    scoreRangeOrScale: '100 to 500 (administered in multiple languages including English, Turkish, Arabic, French, Russian, German)'
  },

  // 7. TestDaF / DSH (Germany)
  {
    id: 'testdaf-dsh',
    name: 'TestDaF / DSH (German Language Proficiency)',
    shortCode: 'TestDaF / DSH',
    category: 'local-language',
    purpose: 'Standardized language examinations certifying advanced German language proficiency (CEFR B2 to C1) required for matriculation into German-taught degree programs at German universities.',
    commonlyUsedIn: ['germany'],
    verificationWarning: 'Mandatory for degree programs taught in German. Standard minimum requirement is TestDaF 4x4 (level TDN 4 in all 4 sub-tests) or DSH-2. Programs taught 100% in English do not require German language exams.',
    officialUrl: 'https://www.testdaf.de/',
    officialLabel: 'TestDaF-Institut Official Portal',
    scoreRangeOrScale: 'TDN 3 to TDN 5 (TestDaF) / DSH-1 to DSH-3 (DSH)'
  },

  // 8. DELF / DALF / TCF (France)
  {
    id: 'delf-dalf',
    name: 'DELF / DALF / TCF (French Language Certifications)',
    shortCode: 'DELF / DALF',
    category: 'local-language',
    purpose: 'Official certifications awarded by the French Ministry of Education certifying French language skills for international candidates applying to French-taught university programs.',
    commonlyUsedIn: ['france', 'canada'],
    verificationWarning: 'DELF B2 is the standard minimum requirement for most undergraduate programs in France; DALF C1 is frequently required for Law, Humanities, and Medicine. Verify specific faculty expectations.',
    officialUrl: 'https://www.france-education-international.fr/diplome/delf-dalf',
    officialLabel: 'France Éducation International',
    scoreRangeOrScale: 'CEFR Scale: A1, A2, B1, B2 (DELF), C1, C2 (DALF)'
  },

  // 9. UCAT / LNAT (United Kingdom)
  {
    id: 'ucat-lnat',
    name: 'UCAT & LNAT (UK Admissions Assessments)',
    shortCode: 'UCAT / LNAT',
    category: 'academic-admission',
    purpose: 'Specialized university admissions tests: UCAT (University Clinical Aptitude Test for Medicine/Dentistry) and LNAT (National Admissions Test for Law) assessing cognitive abilities, critical thinking, and ethical reasoning.',
    commonlyUsedIn: ['united-kingdom', 'australia'],
    verificationWarning: 'Mandatory only for specific degree disciplines (Medicine, Dentistry, Law). Must be taken during the summer/autumn window prior to the UCAS application deadline.',
    officialUrl: 'https://www.ucat.ac.uk/',
    officialLabel: 'Official UCAT Consortium Portal',
    scoreRangeOrScale: 'UCAT: 1200–3600 (four cognitive subtests) + Situational Judgement Band 1–4'
  },

  // 10. Pearson PTE Academic
  {
    id: 'pte-academic',
    name: 'PTE Academic (Pearson Test of English)',
    shortCode: 'PTE',
    category: 'english-language',
    purpose: 'Computer-based academic English language test evaluated by artificial intelligence, measuring Speaking & Writing, Reading, and Listening.',
    commonlyUsedIn: ['australia', 'united-kingdom', 'canada', 'netherlands'],
    verificationWarning: 'Widely accepted by 100% of Australian universities and standard Australian visa subclass 500 pathways, as well as many UK, Canadian, and European institutions. Verify target university score criteria.',
    officialUrl: 'https://www.pearsonpte.com/',
    officialLabel: 'Pearson PTE Academic Official Portal',
    scoreRangeOrScale: '10 to 90 (standard university benchmarks: 58–68+)'
  }
];
