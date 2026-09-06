import { AcademicTestData } from '../types/academicTesting';
import detLogo from '../assets/images/det_official_logo_1787830979022.jpg';
import ieltsLogo from '../assets/images/ielts_official_logo_1786161093593.jpg';
import teacherLukeImg from '../assets/images/teacher_luke_det_1786159857156.jpg';
import ieltsAdvantageImg from '../assets/images/chris_pell_ielts_advantage_1786159839701.jpg';

export const ACADEMIC_TESTS: Record<'det' | 'ielts' | 'sat', AcademicTestData> = {
  // =========================================================================
  // 1. DUOLINGO ENGLISH TEST (DET)
  // =========================================================================
  det: {
    id: 'det',
    name: 'Duolingo English Test',
    shortCode: 'DET',
    tagline: 'Computer-adaptive online English proficiency assessment for university admissions worldwide.',
    administeringBody: 'Duolingo, Inc.',
    officialSiteUrl: 'https://englishtest.duolingo.com/',
    testLogoSrc: detLogo,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-200',

    orientation: {
      whatItIs: 'An on-demand, computer-adaptive English proficiency exam taken from any private computer with internet, webcam, and microphone.',
      whoTakesIt: 'Undergraduate and graduate university applicants needing certified English language proficiency for global admissions.',
      majorSections: 'Four integrated subscores: Literacy, Comprehension, Conversation, and Production.',
      approxDuration: 'Approx. 1 Hour (45 min adaptive test + 10 min unscored writing & video sample)',
      scoringScaleSummary: '10 to 160 (reported in 5-point increments)',
      lastReviewedDate: 'February 2025',
      sourceNote: 'Reviewed against official test guidelines published by Duolingo, Inc.',
      primaryOfficialUrl: 'https://englishtest.duolingo.com/',
      primaryOfficialLabel: 'Official Duolingo English Test Portal'
    },

    // 1. Overview
    overview: {
      formatDescription: 'The Duolingo English Test (DET) is an on-demand, computer-adaptive English assessment taken online. The test dynamically adjusts question difficulty based on student responses and is secured through artificial intelligence and certified human remote proctoring.',
      totalDuration: 'Approx. 60 Minutes (45 min computer-adaptive session + 10 min unscored writing and video interview shared with receiving institutions)',
      scoringScale: '10 to 160 (reported in 5-point increments)',
      deliveryFormat: 'Fully online via a personal desktop or laptop with a supported browser, webcam, microphone, and speakers.',
      retakePolicy: 'Candidates may purchase and take the test up to 3 times in any 30-day window.',
      validityPeriod: '2 Years from the test completion date.',
      keyHighlights: [
        { label: 'Delivery Model', value: 'On-Demand Computer Adaptive' },
        { label: 'Subscore Structure', value: 'Literacy, Comprehension, Conversation, Production' },
        { label: 'Result Turnaround', value: 'Certified within 48 hours' },
        { label: 'Proctoring Model', value: 'AI security checks + Certified human proctor review' }
      ],
      admissionsContext: 'Accepted by over 5,000 universities and institutions globally, including top undergraduate and graduate programs across the US, UK, Canada, Europe, and Asia.'
    },

    // 2. Skills Tested
    skills: [
      {
        id: 'det-literacy',
        name: 'Literacy',
        subscoreName: 'Reading & Writing',
        weightOrScale: '10–160 Scale',
        description: 'Measures candidate ability to read and write academic English with accurate grammar, vocabulary range, and textual cohesion.',
        keyCompetencies: [
          'Distinguishing legitimate English words from pseudo-words (Read and Select)',
          'Reconstructing missing text in passages (Fill in the Blanks / Read and Complete)',
          'Identifying logical transitions and main ideas (Interactive Reading)',
          'Writing well-structured academic responses with accurate syntax and paragraphing'
        ]
      },
      {
        id: 'det-comprehension',
        name: 'Comprehension',
        subscoreName: 'Reading & Listening',
        weightOrScale: '10–160 Scale',
        description: 'Assesses candidate capacity to comprehend spoken and written English across academic and daily situations.',
        keyCompetencies: [
          'Auditory word identification (Listen and Select)',
          'Phonetic and syntactic parsing of spoken speech (Listen and Type)',
          'Identifying main arguments and author tone in multi-paragraph passages',
          'Extracting factual details and implicit conclusions from spoken dialogues'
        ]
      },
      {
        id: 'det-conversation',
        name: 'Conversation',
        subscoreName: 'Listening & Speaking',
        weightOrScale: '10–160 Scale',
        description: 'Evaluates spontaneous spoken interaction, auditory comprehension, and conversational fluency.',
        keyCompetencies: [
          'Spontaneous spoken response to audio prompts (Listen, Then Speak)',
          'Participating in interactive multi-turn conversations (Interactive Speaking)',
          'Pronunciation clarity, natural rhythm, and steady cadence',
          'Developing a coherent topic under short preparation time limits'
        ]
      },
      {
        id: 'det-production',
        name: 'Production',
        subscoreName: 'Writing & Speaking',
        weightOrScale: '10–160 Scale',
        description: 'Evaluates generative language output in both written and spoken modalities.',
        keyCompetencies: [
          'Extended written elaboration of academic arguments (Read, Then Write - 5 min)',
          'Describing visual details in writing (Write About the Photo)',
          'Extended spoken discourse on open topics (Speak About the Photo / Read, Then Speak)',
          'Syntactic complexity, topical lexical range, and grammatical accuracy'
        ]
      }
    ],

    // 3. Question Types (with SVT original practice)
    questionTypes: [
      {
        id: 'det-q-read-write',
        title: 'Read, Then Write (Extended Academic Writing)',
        skillCategory: 'Production & Literacy',
        timeLimit: '5 Minutes',
        difficulty: 'Standard',
        format: 'Extended Text',
        description: 'Candidates read an academic prompt and write a response of at least 50 words (typically 80–120 words recommended for clear development).',
        evaluatedSkills: [
          'Direct thesis formulation and opinion development',
          'Academic vocabulary variety and collocations',
          'Complex grammatical structures (subordinate clauses, conditionals)',
          'Paragraph cohesion and logical transitions'
        ],
        svtPracticeSample: {
          id: 'svt-det-sample-1',
          taskInstructions: 'Respond to the prompt in at least 50 words. Support your opinion with clear reasons and specific examples.',
          prompt: 'Some universities require all incoming first-year students to live in campus residence halls, while others permit them to live off-campus from day one. Which policy do you think benefits students more, and why?',
          modelResponseOrSolution: 'Requiring first-year students to reside on campus significantly enhances both academic transition and social integration. Living within campus halls enables students to easily access university libraries, study groups, and faculty office hours without the stress of daily commuting. Furthermore, communal dormitory life fosters intercultural communication and helps students build lasting collaborative networks during their pivotal first year. While living off-campus offers greater independence, the supportive campus ecosystem provides essential stability for students adjusting to rigorous higher education demands.',
          scoringFocus: [
            'Clear direct thesis established in the opening sentence',
            'Logical discourse markers: "Furthermore", "While", "pivotal"',
            'Varied sentence lengths and appropriate collocations ("communal dormitory life", "supportive campus ecosystem")',
            'Minimal grammatical or spelling errors'
          ]
        },
        topStrategyTip: 'Dedicate the first 30 seconds to planning two core supporting arguments, write steadily for 3.5 minutes, and reserve the final 45 seconds strictly for proofreading grammar, capitalization, and spelling.'
      },
      {
        id: 'det-q-read-select',
        title: 'Read and Select (Vocabulary Identification)',
        skillCategory: 'Literacy',
        timeLimit: '1 Minute',
        difficulty: 'Foundational',
        format: 'Multiple Choice',
        description: 'A grid of words appears on screen. Candidates select only legitimate English words and leave invented pseudo-words unselected.',
        evaluatedSkills: [
          'Orthographic lexical memory',
          'Root word, prefix, and suffix recognition',
          'Discrimination between plausible invented forms and genuine vocabulary'
        ],
        svtPracticeSample: {
          id: 'svt-det-sample-2',
          taskInstructions: 'Select only the legitimate English words from the sample list below.',
          prompt: 'Examine the following list and identify the valid English terms:',
          options: [
            { id: 'w1', text: 'ubiquitous', isCorrect: true, explanation: 'Valid English word meaning present, appearing, or found everywhere.' },
            { id: 'w2', text: 'conduciate', isCorrect: false, explanation: 'Pseudo-word. Invented word blending "conduct" and "initiate"; does not exist in standard English.' },
            { id: 'w3', text: 'ephemeral', isCorrect: true, explanation: 'Valid English word meaning lasting for a very short time.' },
            { id: 'w4', text: 'invectivity', isCorrect: false, explanation: 'Pseudo-word. The legitimate noun form is "invective".' },
            { id: 'w5', text: 'resilience', isCorrect: true, explanation: 'Valid English word meaning the capacity to recover quickly from difficulties.' }
          ],
          modelResponseOrSolution: 'Selected: ubiquitous, ephemeral, resilience. (conduciate and invectivity are unselected)',
          scoringFocus: [
            'Precision over speculative guessing',
            'Avoidance of pseudo-words with plausible Latinate suffixes'
          ]
        },
        topStrategyTip: 'Avoid guessing on Read and Select. Selecting non-words carries a negative score weighting. If you do not recognize a word with confidence, leave it unselected.'
      },
      {
        id: 'det-q-interactive-reading',
        title: 'Interactive Reading (Passage Flow & Completion)',
        skillCategory: 'Literacy & Comprehension',
        timeLimit: '7–8 Minutes (multi-part set)',
        difficulty: 'Standard',
        format: 'Fill in Blank',
        description: 'A connected reading set consisting of Complete the Sentences, Complete the Passage, Highlight the Answer, and Identify the Idea.',
        evaluatedSkills: [
          'Anaphoric referencing and discourse continuity',
          'Identifying main author thesis across multiple paragraphs',
          'Locating evidence within informational text'
        ],
        svtPracticeSample: {
          id: 'svt-det-sample-3',
          taskInstructions: 'Choose the most coherent sentence to complete the informational passage.',
          passage: 'Urban planners are increasingly integrating vertical greenery into high-density architecture. Living walls and rooftop gardens provide natural thermal insulation, reducing the energy needed for air conditioning during summer months. [ MISSING SENTENCE ] Consequently, several municipal governments have begun offering tax incentives to developers who incorporate biophilic elements into new construction.',
          prompt: 'Which sentence best fits the missing position?',
          options: [
            { id: 's1', text: 'Additionally, these vegetated surfaces absorb airborne pollutants and mitigate the urban heat island effect across surrounding streets.', isCorrect: true, explanation: 'Correct! This sentence expands on the environmental benefits described previously and leads into the municipal incentives in the following sentence.' },
            { id: 's2', text: 'However, historical buildings were usually made of brick and timber.', isCorrect: false, explanation: 'Irrelevant historical detail that disrupts the logical flow.' },
            { id: 's3', text: 'Rooftops are often used for installing telecommunication antennas.', isCorrect: false, explanation: 'Off-topic diversion from urban vegetation and sustainability.' }
          ],
          modelResponseOrSolution: 'Option 1 completes the chain of ecological benefits leading directly to municipal policy incentives.',
          scoringFocus: [
            'Discourse markers ("Additionally")',
            'Topical coherence with urban ecology and energy savings'
          ]
        },
        topStrategyTip: 'Read the entire paragraph before and after the blank. Look for pronoun references like "these surfaces" or cause-and-effect indicators like "Consequently" to ensure seamless continuity.'
      },
      {
        id: 'det-q-listen-speak',
        title: 'Listen, Then Speak (Spoken Academic Response)',
        skillCategory: 'Conversation & Production',
        timeLimit: '20s Prep / 90s Speaking',
        difficulty: 'Challenging',
        format: 'Audio/Spoken',
        description: 'Candidates listen to an audio prompt (playable up to 3 times) and deliver a spontaneous spoken response lasting between 30 and 90 seconds.',
        evaluatedSkills: [
          'Auditory prompt comprehension',
          'Spoken fluency without long unnatural pauses',
          'Pronunciation clarity and natural intonation',
          'Structured elaboration with concrete examples'
        ],
        svtPracticeSample: {
          id: 'svt-det-sample-4',
          taskInstructions: 'Listen to the prompt and speak for 60–90 seconds. Articulate a direct answer followed by reasons and examples.',
          prompt: '[Audio Prompt]: "Describe a challenging project or assignment you worked on with a team. What was your specific role, and what did you learn from the experience?"',
          modelResponseOrSolution: 'In my senior year of high school, our team organized an interactive community science fair for over 200 middle school students. My specific responsibility was coordinating workshop materials and scheduling student volunteer presenters. During the planning phase, we faced a major bottleneck when two key resource shipments were delayed. Rather than canceling the interactive stations, I led a quick redesign session where our team repurposed everyday household items to demonstrate fundamental physics principles. This experience taught me that proactive adaptability and transparent communication are far more critical to successful collaboration than rigid adherence to an initial plan.',
          scoringFocus: [
            'Directly answers all prompt sub-questions (project description, role, lesson learned)',
            'Sustained speech for 75+ seconds with varied grammatical syntax',
            'Clear articulation of past tense verbs and descriptive terms'
          ]
        },
        topStrategyTip: 'Use a 3-part structure: 1) Direct answer, 2) Specific challenge and action taken, 3) Key lesson learned. Speak at a measured pace looking toward the camera.'
      }
    ],

    // 4. Preparation Roadmap
    roadmap: [
      {
        id: 'det-p1',
        phaseNumber: 1,
        title: 'Diagnostic Benchmark & Interface Orientation',
        timeframe: 'Weeks 1–2',
        focus: 'Understand test mechanics, subscore scoring, and take initial diagnostic.',
        tasks: [
          { id: 'det-t1', label: 'Take the official free practice test on englishtest.duolingo.com to establish baseline subscores.' },
          { id: 'det-t2', label: 'Read the official Duolingo English Test Readiness Guide to review proctoring rules and hardware requirements.' },
          { id: 'det-t3', label: 'Identify subscores needing focus (Literacy, Comprehension, Conversation, Production) to organize your study plan.' }
        ]
      },
      {
        id: 'det-p2',
        phaseNumber: 2,
        title: 'Targeted Subscore Practice & Question Drills',
        timeframe: 'Weeks 3–4',
        focus: 'Practise specific question types: Interactive Reading, 5-minute Writing, and Listen/Speak prompts.',
        tasks: [
          { id: 'det-t4', label: 'Practise Read & Select: train lexical recognition without clicking unfamiliar pseudo-words.' },
          { id: 'det-t5', label: 'Develop the 5-minute Read, Then Write structure: practise writing 80–110 words with proofreading in under 5 minutes.' },
          { id: 'det-t6', label: 'Drill 90-second spoken responses using recordings to evaluate pacing and clarity.' }
        ]
      },
      {
        id: 'det-p3',
        phaseNumber: 3,
        title: 'Full-Length Timed Simulations & Test-Day Environment Setup',
        timeframe: 'Weeks 5–6',
        focus: 'Simulate realistic exam conditions, verify testing room, and finalize test booking.',
        tasks: [
          { id: 'det-t7', label: 'Complete 2 full-length timed mock tests in a quiet, isolated room.' },
          { id: 'det-t8', label: 'Verify computer setup meets official guidelines: face lighting, working microphone, single monitor, no browser extensions.' },
          { id: 'det-t9', label: 'Confirm valid government-issued photo ID (passport or national ID) ready for upload.' }
        ]
      }
    ],

    // 5. Practice Strategies
    strategies: [
      {
        id: 'det-strat-1',
        category: 'Production Subscore',
        title: 'The 45-Second Proofreading Habit for 5-Minute Writing',
        ruleSummary: 'Complete typing with 45 seconds remaining to review grammar and spelling.',
        inDepthExplanation: 'Automated scoring systems evaluate grammatical precision and word accuracy. Small typos, missing plural endings, and subject-verb disagreements can lower your score. Leaving 45 seconds allows you to catch minor mistakes.',
        actionableStep: 'During practice, set a timer for 4 minutes and 15 seconds to finish your content, then spend 45 seconds reviewing subject-verb agreement and spelling.'
      },
      {
        id: 'det-strat-2',
        category: 'Literacy / Vocabulary',
        title: 'Accuracy Discipline in Read and Select',
        ruleSummary: 'Only select words you recognize with confidence. Pseudo-words trigger negative weighting.',
        inDepthExplanation: 'Read and Select questions use statistically calibrated pseudo-words designed to mimic English morphological patterns. Speculative guessing can lower your overall accuracy percentage.',
        actionableStep: 'If you hesitate on a word for more than a few seconds and do not recognize its meaning, leave it unselected.'
      },
      {
        id: 'det-strat-3',
        category: 'Speaking Delivery',
        title: 'Webcam Eye-Alignment and Cadence Control',
        ruleSummary: 'Maintain natural eye level with your webcam and deliver steady, unhurried speech.',
        inDepthExplanation: 'Looking repeatedly away from your screen or down at your keyboard can trigger test security flags. Furthermore, speaking too rapidly often compromises articulation and clarity.',
        actionableStep: 'Position your webcam at eye level. When speaking, look directly toward the screen and pause briefly between ideas rather than rushing.'
      }
    ],

    // 6. Official Resources
    officialResources: [
      {
        id: 'det-off-1',
        title: 'Duolingo English Test Official Portal',
        provider: 'Duolingo, Inc.',
        type: 'Portal',
        url: 'https://englishtest.duolingo.com/',
        description: 'Official test registration, sample questions, account dashboard, and score sending portal.',
        isPrimary: true
      },
      {
        id: 'det-off-2',
        title: 'Official DET Test Readiness Guide & Practice Test',
        provider: 'Duolingo, Inc.',
        type: 'Official Guide',
        url: 'https://englishtest.duolingo.com/guide',
        description: 'Official guide explaining question types, subscore weightings, rules, and free practice test access.',
        isPrimary: true
      },
      {
        id: 'det-off-3',
        title: 'DET Test Security & Proctoring Guidelines',
        provider: 'Duolingo, Inc.',
        type: 'Whitepaper',
        url: 'https://englishtest.duolingo.com/rules',
        description: 'Official technical requirements, identity verification procedures, and exam integrity standards.',
        isPrimary: false
      }
    ],

    // 7. Independent Recommended Educator
    recommendedEducator: {
      name: 'Teacher Luke',
      channelTitle: 'Teacher Luke - Duolingo English Test',
      channelUrl: 'https://www.youtube.com/@TeacherLuke-DET',
      imageAssetSrc: teacherLukeImg,
      imageAlt: 'Teacher Luke DET Channel Logo',
      tagline: 'Independent video tutorials, question-by-question walkthroughs, and practice strategies for DET candidates.',
      whyRecommended: [
        'Detailed breakdowns of DET question formats and Interactive Reading mechanics',
        'Structured response frameworks for 5-minute writing and 90-second speaking prompts',
        'Practical error-avoidance strategies and vocabulary advice',
        'Clear, accessible explanations tailored for student learners'
      ],
      notablePlaylistsOrSeries: [
        'DET Interactive Reading Strategy Series',
        'Production Subscore (Writing & Speaking) Walkthroughs',
        'Complete Question-by-Question DET Strategy Series'
      ],
      disclaimer: 'SVT is an independent student-led nonprofit organization. External educators are shared as optional learning resources and are not partners or official test providers. Teacher Luke is an independent instructor. Duolingo, Inc. is not affiliated with Teacher Luke.'
    }
  },

  // =========================================================================
  // 2. IELTS ACADEMIC
  // =========================================================================
  ielts: {
    id: 'ielts',
    name: 'IELTS Academic',
    shortCode: 'IELTS',
    tagline: 'The International English Language Testing System for higher education study and global academic admission.',
    administeringBody: 'British Council, IDP: IELTS Australia, and Cambridge University Press & Assessment',
    officialSiteUrl: 'https://www.ielts.org/',
    testLogoSrc: ieltsLogo,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-200',

    orientation: {
      whatItIs: 'A globally recognized four-skill English test evaluating academic Listening, Reading, Writing, and Speaking.',
      whoTakesIt: 'Students applying to undergraduate or postgraduate university degree programs taught in English.',
      majorSections: 'Four modules: Listening (40 items), Reading (40 items), Writing (2 tasks), and Speaking (3 parts).',
      approxDuration: 'Approx. 2 Hours 45 Minutes (Listening 30m, Reading 60m, Writing 60m, Speaking 11–14m)',
      scoringScaleSummary: 'Band 1.0 to 9.0 (reported in half-band increments)',
      lastReviewedDate: 'February 2025',
      sourceNote: 'Reviewed against official documentation from British Council, IDP, and Cambridge.',
      primaryOfficialUrl: 'https://www.ielts.org/',
      primaryOfficialLabel: 'Official IELTS Global Portal'
    },

    // 1. Overview
    overview: {
      formatDescription: 'IELTS Academic assesses the language proficiency of individuals intending to study in higher education environments where English is the language of instruction. It evaluates four discrete skills: Listening, Reading, Writing, and Speaking.',
      totalDuration: 'Approx. 2 Hours 45 Minutes (Listening: 30 min + 10 min transfer for paper test, Reading: 60 min, Writing: 60 min, Speaking: 11–14 min)',
      scoringScale: 'Band 1.0 to 9.0 (reported in whole and half band increments)',
      deliveryFormat: 'Available on Computer or Paper at authorized test centers worldwide; also available as IELTS Online in select regions.',
      retakePolicy: 'Candidates may retake the full test at any time; One Skill Retake (OSR) is available at participating centers within 60 days of the original test.',
      validityPeriod: '2 Years from the test date.',
      keyHighlights: [
        { label: 'Evaluation Format', value: '4 Discrete Skill Modules' },
        { label: 'Speaking Exam', value: 'Live 1-on-1 Certified Examiner Interview' },
        { label: 'Retake Flexibility', value: 'One Skill Retake (OSR) Supported' },
        { label: 'Global Recognition', value: '11,500+ Organizations Worldwide' }
      ],
      admissionsContext: 'Recognized for university admissions across the UK, Australia, Canada, the US, New Zealand, Europe, and Asia.'
    },

    // 2. Skills Tested
    skills: [
      {
        id: 'ielts-listening',
        name: 'Listening',
        subscoreName: 'Section 1 to 4 (40 Questions)',
        weightOrScale: 'Band 1.0–9.0',
        description: 'Assesses candidate capacity to comprehend spoken English in social situations and academic lectures.',
        keyCompetencies: [
          'Form completion, note-taking, and identifying factual data (names, numbers, dates)',
          'Understanding multi-speaker academic discussions with diverse accents',
          'Recognizing speaker opinions, attitudes, and nuance',
          'Following structured academic presentations with technical terminology'
        ]
      },
      {
        id: 'ielts-reading',
        name: 'Reading (Academic)',
        subscoreName: '3 Long Passages (40 Questions)',
        weightOrScale: 'Band 1.0–9.0',
        description: 'Evaluates reading for gist, main ideas, detail, skimming, logical argument, and author viewpoint.',
        keyCompetencies: [
          'True / False / Not Given & Yes / No / Not Given identification',
          'Matching headings and matching information to paragraphs',
          'Sentence completion, summary completion, and diagram labeling',
          'Analyzing scientific, historical, and sociological academic texts'
        ]
      },
      {
        id: 'ielts-writing',
        name: 'Writing (Academic)',
        subscoreName: 'Task 1 (Report) & Task 2 (Essay)',
        weightOrScale: 'Band 1.0–9.0',
        description: 'Assesses written academic communication under two distinct tasks with specific grading rubrics.',
        keyCompetencies: [
          'Task 1: Describing visual data (graphs, charts, tables, maps, processes) in 150+ words (20 min)',
          'Task 2: Writing a 250+ word structured argumentative or discussion essay (40 min)',
          'Assessed on Task Achievement/Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy'
        ]
      },
      {
        id: 'ielts-speaking',
        name: 'Speaking',
        subscoreName: 'Parts 1, 2, and 3',
        weightOrScale: 'Band 1.0–9.0',
        description: 'A live 1-on-1 interview assessing spoken fluency, vocabulary, grammar, and pronunciation.',
        keyCompetencies: [
          'Part 1: Answering general personal and familiar questions naturally (4–5 min)',
          'Part 2: Individual long turn on a prompt card with 1 min preparation (3–4 min)',
          'Part 3: In-depth two-way abstract and academic discussion (4–5 min)',
          'Evaluated on Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation'
        ]
      }
    ],

    // 3. Question Types (with SVT original practice)
    questionTypes: [
      {
        id: 'ielts-q-writing-task2',
        title: 'Writing Task 2 (Academic Discursive Essay)',
        skillCategory: 'Writing',
        timeLimit: '40 Minutes',
        difficulty: 'Standard',
        format: 'Extended Text',
        description: 'Candidates write a formal academic essay of at least 250 words responding to a point of view, argument, or problem.',
        evaluatedSkills: [
          'Task Response: fully addressing all parts of the prompt',
          'Coherence & Cohesion: logical paragraph progression and clear linking',
          'Lexical Resource: precise academic vocabulary and collocations',
          'Grammatical Range & Accuracy: complex structures with minimal errors'
        ],
        svtPracticeSample: {
          id: 'svt-ielts-sample-1',
          taskInstructions: 'Write an essay of at least 250 words. Present a relevant argument supported by reasons and examples from your own knowledge or experience.',
          prompt: 'Some educators argue that secondary schools should focus primarily on academic subjects such as mathematics and science, while others believe that practical life skills, such as financial literacy and interpersonal communication, should receive equal curricular weight. Discuss both views and give your own opinion.',
          modelResponseOrSolution: 'It is often debated whether secondary education should prioritize traditional academic disciplines or allocate equal emphasis to practical life competencies. While mastery of science and mathematics provides foundational analytical rigor, I contend that practical skills such as financial literacy and interpersonal communication are equally indispensable for modern adult life.\n\nProponents of an academic-focused curriculum maintain that subjects like calculus and physics develop critical thinking and prepare students for university-level research. These disciplines furnish the cognitive framework required for innovation in engineering, medicine, and technology. Without robust training in foundational sciences, secondary graduates may find themselves ill-equipped for specialized higher education pathways that drive economic development.\n\nConversely, advocates for life-skills education emphasize that many high school graduates lack essential functional abilities upon entering adulthood. Instruction in budgeting, debt management, and civic engagement directly prepares young adults to make sound economic choices and avoid severe personal debt. Furthermore, effective communication and conflict resolution foster collaborative workplaces and healthy communities.\n\nIn conclusion, while rigorous academic disciplines are vital for intellectual development, practical competencies prepare students for everyday social and economic realities. Therefore, educational systems should adopt a balanced curriculum integrating both dimensions equally.',
          scoringFocus: [
            '4-paragraph structure with clear progression',
            'Explicit discussion of both viewpoints before personal stance',
            'Precise collocations: "foundational analytical rigor", "cognitive framework", "functional abilities"',
            'Cohesive markers: "Conversely", "Furthermore", "In conclusion"'
          ]
        },
        topStrategyTip: 'Follow a clean 4-paragraph architecture: Introduction (Paraphrase + Thesis), Body Paragraph 1 (First View), Body Paragraph 2 (Second View + Your Position), and Conclusion (Summary). Spend 5 minutes planning before writing.'
      },
      {
        id: 'ielts-q-reading-tfng',
        title: 'Reading: True / False / Not Given Analysis',
        skillCategory: 'Reading',
        timeLimit: 'Approx. 1.5 min per question',
        difficulty: 'Standard',
        format: 'Multiple Choice',
        description: 'Candidates evaluate statements against an academic text to decide if the statement agrees with (TRUE), contradicts (FALSE), or is not mentioned in (NOT GIVEN) the passage.',
        evaluatedSkills: [
          'Fact-checking against explicit textual evidence',
          'Recognizing qualifying words (all, some, often, never, primarily)',
          'Distinguishing between contradictory statements and unstated assertions'
        ],
        svtPracticeSample: {
          id: 'svt-ielts-sample-2',
          taskInstructions: 'Do the following statements agree with the information given in the reading passage? Write TRUE, FALSE, or NOT GIVEN.',
          passage: 'Hydrothermal vent ecosystems, discovered along mid-ocean ridges in the late 1970s, rely on chemosynthetic bacteria rather than solar photosynthesis to synthesize organic compounds. These specialized microorganisms oxidize hydrogen sulfide dissolved in mineral-rich water emissions. While most marine life depends directly or indirectly on sunlight, hydrothermal vent communities thrive in complete darkness under immense hydrostatic pressure.',
          prompt: 'Statement: "All organisms inhabiting hydrothermal vent systems require solar radiation for survival."',
          options: [
            { id: 'opt-t', text: 'TRUE', isCorrect: false, explanation: 'Incorrect. The passage states they do not rely on solar radiation.' },
            { id: 'opt-f', text: 'FALSE', isCorrect: true, explanation: 'Correct! The passage explicitly states that these ecosystems "rely on chemosynthetic bacteria rather than solar photosynthesis" and "thrive in complete darkness", directly contradicting the statement.' },
            { id: 'opt-ng', text: 'NOT GIVEN', isCorrect: false, explanation: 'Incorrect. The text provides explicit information contradicting the statement.' }
          ],
          modelResponseOrSolution: 'Answer: FALSE. (The passage explicitly states that these ecosystems "rely on chemosynthetic bacteria rather than solar photosynthesis" and "thrive in complete darkness".)',
          scoringFocus: [
            'Identifying direct contradiction with "FALSE"',
            'Avoiding assumptions not supported or refuted in the text'
          ]
        },
        topStrategyTip: 'TRUE means the passage explicitly confirms the idea. FALSE means the passage directly contradicts the idea. NOT GIVEN means the text does not contain enough evidence to confirm or deny.'
      },
      {
        id: 'ielts-q-writing-task1',
        title: 'Writing Task 1 (Academic Visual Report)',
        skillCategory: 'Writing',
        timeLimit: '20 Minutes',
        difficulty: 'Standard',
        format: 'Extended Text',
        description: 'Candidates summarize, describe, or explain information presented in a graph, chart, table, diagram, or map in at least 150 words.',
        evaluatedSkills: [
          'Selecting and reporting main features and key trends',
          'Drafting a clear, prominent Overview paragraph',
          'Accurate comparative language and data citation'
        ],
        svtPracticeSample: {
          id: 'svt-ielts-sample-3',
          taskInstructions: 'Summarize the visual information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
          prompt: 'The bar chart illustrates the percentage of renewable energy consumption across three European nations (Germany, Spain, and Sweden) between 2010 and 2024.',
          modelResponseOrSolution: 'The bar chart compares the proportion of renewable energy consumed in Germany, Spain, and Sweden across a fourteen-year period from 2010 to 2024.\n\nOverall, Sweden consistently maintained the highest share of renewable energy consumption throughout the entire timeframe, while Germany experienced the most rapid upward growth. In contrast, Spain exhibited moderate but steady increases over the surveyed years.\n\nIn 2010, Sweden generated approximately 45% of its total energy from renewable sources, rising steadily to peak at 62% by 2024. Germany began at a modest 18% in 2010 but demonstrated substantial expansion, more than doubling its renewable share to reach 44% in 2024. Meanwhile, Spain started at 28% in 2010 and grew incrementally to finish at 38% in the final recorded year.',
          scoringFocus: [
            'Clear Overview positioned after the introduction',
            'Accurate trend comparisons without personal speculation',
            'Varied data vocabulary: "doubling", "peaked at", "grew incrementally"'
          ]
        },
        topStrategyTip: 'Your Overview paragraph is essential for a high score. Identify 2–3 macro trends or highest/lowest points without citing specific numbers in the overview paragraph itself.'
      },
      {
        id: 'ielts-q-speaking-part2',
        title: 'Speaking Part 2 (Individual Long Turn)',
        skillCategory: 'Speaking',
        timeLimit: '1 Min Prep / 2 Min Speaking',
        difficulty: 'Challenging',
        format: 'Audio/Spoken',
        description: 'The examiner provides a prompt card with a specific topic and bullet points. The candidate has 1 minute to take notes and speaks for 1 to 2 minutes.',
        evaluatedSkills: [
          'Fluency and uninterrupted discourse development',
          'Narrative structuring (Past, Present, and Reflection)',
          'Lexical resource and descriptive expressions'
        ],
        svtPracticeSample: {
          id: 'svt-ielts-sample-4',
          taskInstructions: 'You have 1 minute to prepare your notes. Speak for up to 2 minutes covering all bullet points on the prompt card.',
          prompt: 'Describe a public library or study space that you find inspiring. You should say: where it is located, how often you visit, what facilities it offers, and explain why you find it conducive to learning.',
          modelResponseOrSolution: 'I would like to talk about our regional municipal library, located in the historic center of our city adjacent to the public botanical gardens. I typically visit this library twice a week, especially when preparing for major academic examinations.\n\nThe facility spans three floors and offers both collaborative discussion zones on the ground level and strictly silent study carrels on the upper floor. It houses an extensive digital research archive, high-speed fiber internet, and panoramic glass windows that overlook the surrounding greenery.\n\nWhat makes this space truly conducive to productive learning is the calm atmosphere and ergonomic environment. The abundant natural daylight prevents eye fatigue during extended study sessions, and being surrounded by other dedicated students creates a quiet, motivating peer atmosphere that keeps me focused.',
          scoringFocus: [
            'Covers all 4 prompt bullet points systematically',
            'Uses natural discourse transitions ("What makes this space truly conducive...")',
            'Appropriate academic and descriptive vocabulary ("ergonomic environment", "panoramic glass windows")'
          ]
        },
        topStrategyTip: 'Use your 1-minute prep time to write down keywords for each bullet point using the PPF (Past, Present, Future/Feelings) framework to ensure your speech extends smoothly past 1.5 minutes.'
      }
    ],

    // 4. Preparation Roadmap
    roadmap: [
      {
        id: 'ielts-p1',
        phaseNumber: 1,
        title: 'Diagnostic Band Assessment & Format Orientation',
        timeframe: 'Weeks 1–2',
        focus: 'Understand band descriptors and take a timed baseline diagnostic.',
        tasks: [
          { id: 'ielts-t1', label: 'Review official IELTS band descriptors for Writing Task 1, Writing Task 2, and Speaking.' },
          { id: 'ielts-t2', label: 'Take an official practice test (Listening and Reading) to evaluate your baseline raw score.' },
          { id: 'ielts-t3', label: 'Record a baseline Speaking Part 2 response and analyze fluency, pauses, and grammatical consistency.' }
        ]
      },
      {
        id: 'ielts-p2',
        phaseNumber: 2,
        title: 'Methodology & Paragraph Practice Drills',
        timeframe: 'Weeks 3–5',
        focus: 'Practise the 4-paragraph Task 2 essay structure, Task 1 overview reporting, and reading keyword techniques.',
        tasks: [
          { id: 'ielts-t4', label: 'Practise writing complete Task 2 essays using the 4-paragraph model under 40-minute constraints.' },
          { id: 'ielts-t5', label: 'Practise Task 1 Overview identification across charts, tables, maps, and process diagrams.' },
          { id: 'ielts-t6', label: 'Practise Listening Section 3 and 4 keyword prediction during the 30-second pre-listening windows.' }
        ]
      },
      {
        id: 'ielts-p3',
        phaseNumber: 3,
        title: 'Full Simulation & Exam Readiness',
        timeframe: 'Weeks 6–8',
        focus: 'Conduct full-length timed mock exams in single sessions and finalize test booking.',
        tasks: [
          { id: 'ielts-t7', label: 'Complete 3 full uninterrupted mock tests (Listening + Reading + Writing in 2 hours 45 minutes).' },
          { id: 'ielts-t8', label: 'Conduct mock Speaking interviews with a study partner using official prompt cards.' },
          { id: 'ielts-t9', label: 'Confirm test center location and required identification documents.' }
        ]
      }
    ],

    // 5. Practice Strategies
    strategies: [
      {
        id: 'ielts-strat-1',
        category: 'Writing Task 2',
        title: 'The 4-Paragraph Essay Structure',
        ruleSummary: 'Maintain a 4-paragraph structure with 2 fully developed main ideas.',
        inDepthExplanation: 'Including too many separate ideas can lead to superficial explanations. Evaluators reward developed ideas: Topic Sentence + Deep Explanation + Concrete Example.',
        actionableStep: 'Spend the first 5 minutes planning 2 supporting ideas. Write Paragraph 1 (Introduction), Paragraph 2 (Idea 1), Paragraph 3 (Idea 2), and Paragraph 4 (Conclusion).'
      },
      {
        id: 'ielts-strat-2',
        category: 'Speaking Part 1 & 3',
        title: 'Fluency and Natural Cadence Over Rare Vocabulary',
        ruleSummary: 'Prioritize continuous fluency and clear pronunciation rather than pausing for obscure words.',
        inDepthExplanation: 'Evaluators assess your ability to communicate naturally. Pausing repeatedly to search for uncommon words can disrupt fluency more than using clear, accurate language.',
        actionableStep: 'Practice answering Part 1 questions using 2–3 complete sentences without stopping. Use the PPF (Past, Present, Future) technique.'
      },
      {
        id: 'ielts-strat-3',
        category: 'Listening Sections 3 & 4',
        title: 'Distractor Recognition & Word Category Prediction',
        ruleSummary: 'Anticipate speaker corrections and predict whether the missing answer is a noun, date, number, or adjective.',
        inDepthExplanation: 'IELTS listening recordings frequently include distractors where a speaker gives an initial answer and then modifies it.',
        actionableStep: 'During the 30-second prep window, underline keywords and write grammatical annotations (e.g. "[noun]", "[plural]") next to each blank.'
      }
    ],

    // 6. Official Resources
    officialResources: [
      {
        id: 'ielts-off-1',
        title: 'IELTS Official Global Portal',
        provider: 'British Council, IDP, and Cambridge',
        type: 'Portal',
        url: 'https://www.ielts.org/',
        description: 'Official test overview, test center locator, One Skill Retake (OSR) guidelines, and institutional recognition list.',
        isPrimary: true
      },
      {
        id: 'ielts-off-2',
        title: 'British Council Take IELTS Preparation Portal',
        provider: 'British Council',
        type: 'Practice Test',
        url: 'https://takeielts.britishcouncil.org/',
        description: 'Official practice tests, sample questions for all four skills, and test day advice from British Council educators.',
        isPrimary: true
      },
      {
        id: 'ielts-off-3',
        title: 'IDP IELTS Official Practice Resources',
        provider: 'IDP Education',
        type: 'Practice Test',
        url: 'https://ielts.idp.com/prepare',
        description: 'Official preparation webinars, practice papers, and computer-delivered IELTS tutorials.',
        isPrimary: false
      }
    ],

    // 7. Independent Recommended Educator
    recommendedEducator: {
      name: 'Chris Pell',
      channelTitle: 'IELTS Advantage',
      channelUrl: 'https://www.youtube.com/@Ieltsadvantage',
      imageAssetSrc: ieltsAdvantageImg,
      imageAlt: 'IELTS Advantage Logo',
      tagline: 'Independent video lessons explaining IELTS Academic Writing, Speaking, Reading, and Listening.',
      whyRecommended: [
        'Step-by-step essay planning models for Writing Task 1 and Task 2',
        'Sample candidate speaking mock interviews analyzed against official band criteria',
        'Practical keyword techniques for True/False/Not Given reading questions',
        'Focus on clear structure and task criteria'
      ],
      notablePlaylistsOrSeries: [
        'IELTS Writing Task 2 Video Series',
        'IELTS Speaking Full Mock Interviews with Band Feedback',
        'IELTS Reading Keyword & Timing Techniques'
      ],
      disclaimer: 'SVT is an independent student-led nonprofit organization. External educators are shared as optional learning resources and are not partners or official test providers. IELTS Advantage is an independent educational channel. British Council, IDP, and Cambridge are not affiliated with IELTS Advantage.'
    }
  },

  // =========================================================================
  // 3. DIGITAL SAT
  // =========================================================================
  sat: {
    id: 'sat',
    name: 'Digital SAT',
    shortCode: 'SAT',
    tagline: 'Standardized college admissions assessment in Reading, Writing, and Math.',
    administeringBody: 'College Board',
    officialSiteUrl: 'https://satsuite.collegeboard.org/digital',
    testLogoSrc: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop&q=80',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200',

    orientation: {
      whatItIs: 'A digital, section-adaptive examination administered via the College Board Bluebook app assessing college readiness.',
      whoTakesIt: 'High school students applying to undergraduate programs and merit scholarship programs primarily in the US and globally.',
      majorSections: 'Two sections: Reading & Writing (two 32-min modules) and Math (two 35-min modules with built-in Desmos calculator).',
      approxDuration: '2 Hours 14 Minutes (plus a 10-minute break between sections)',
      scoringScaleSummary: '400 to 1600 (Reading & Writing: 200–800, Math: 200–800)',
      lastReviewedDate: 'February 2025',
      sourceNote: 'Reviewed against official specifications from College Board and Khan Academy.',
      primaryOfficialUrl: 'https://satsuite.collegeboard.org/digital',
      primaryOfficialLabel: 'Official College Board Digital SAT Portal'
    },

    // 1. Overview
    overview: {
      formatDescription: 'The Digital SAT is a section-adaptive, computer-delivered college admissions test administered via the College Board Bluebook application. The exam features short reading passages paired with single questions and provides a built-in Desmos graphing calculator across all Math questions.',
      totalDuration: '2 Hours 14 Minutes (Reading & Writing: 64 min [two 32-min modules] + Math: 70 min [two 35-min modules] + 10-min break between sections)',
      scoringScale: '400 to 1600 (Reading & Writing: 200–800, Math: 200–800)',
      deliveryFormat: 'Delivered digitally on laptops, tablets, or school-managed devices via the Bluebook app at test centers or schools.',
      retakePolicy: 'Students may register and take the SAT as many times as offered throughout the test calendar.',
      validityPeriod: '5 Years from the test date.',
      keyHighlights: [
        { label: 'Delivery Model', value: 'Section-Adaptive Digital (Bluebook)' },
        { label: 'Calculator Access', value: 'Built-in Desmos Calculator for ALL Math' },
        { label: 'Guessing Policy', value: 'No penalty for incorrect answers' },
        { label: 'Passage Structure', value: 'Short passages (25–150 words) with 1 question each' }
      ],
      admissionsContext: 'Primary standardized examination used for undergraduate admissions and merit scholarships by colleges and universities across the United States and internationally.'
    },

    // 2. Skills Tested
    skills: [
      {
        id: 'sat-rw-craft',
        name: 'Craft & Structure (Reading & Writing)',
        subscoreName: 'Reading and Writing Domain',
        weightOrScale: 'Approx. 28% of R&W',
        description: 'Assesses comprehension of vocabulary in context, text structure, point of view, and cross-textual connections.',
        keyCompetencies: [
          'Words in Context: selecting nuanced academic vocabulary in context',
          'Text Structure & Purpose: determining how paragraphs function rhetorically',
          'Cross-Text Connections: comparing claims across two paired texts'
        ]
      },
      {
        id: 'sat-rw-info',
        name: 'Information & Ideas (Reading & Writing)',
        subscoreName: 'Reading and Writing Domain',
        weightOrScale: 'Approx. 26% of R&W',
        description: 'Evaluates reading comprehension, central ideas, textual evidence, and quantitative data analysis in tables and graphs.',
        keyCompetencies: [
          'Central Ideas & Details: identifying author core claims',
          'Command of Evidence (Textual & Quantitative): selecting data supporting or weakening a hypothesis',
          'Inferences: completing logical conclusions based on provided facts'
        ]
      },
      {
        id: 'sat-rw-conventions',
        name: 'Standard English Conventions (Writing)',
        subscoreName: 'Reading and Writing Domain',
        weightOrScale: 'Approx. 26% of R&W',
        description: 'Tests sentence structure, boundaries, agreement, punctuation, and grammatical syntax.',
        keyCompetencies: [
          'Sentence Boundaries: proper use of periods, semicolons, colons, and dashes',
          'Subject-Verb & Pronoun-Antecedent Agreement',
          'Modifier Placement & Parallel Structure'
        ]
      },
      {
        id: 'sat-rw-expression',
        name: 'Expression of Ideas (Writing)',
        subscoreName: 'Reading and Writing Domain',
        weightOrScale: 'Approx. 20% of R&W',
        description: 'Assesses the ability to revise texts to improve rhetoric, transitions, and synthesis of research notes.',
        keyCompetencies: [
          'Transitions: selecting logical connectors (contrast, continuation, cause/effect)',
          'Rhetorical Synthesis: selecting notes fulfilling specific student goals'
        ]
      },
      {
        id: 'sat-math-algebra',
        name: 'Algebra & Advanced Math',
        subscoreName: 'Math Domain',
        weightOrScale: 'Approx. 70% of Math',
        description: 'Evaluates linear equations, systems, inequalities, quadratics, polynomials, and non-linear functions.',
        keyCompetencies: [
          'Linear equations in 1 and 2 variables and systems of equations',
          'Quadratic, exponential, and polynomial equations and graphs',
          'Function notation, transformations, and algebraic manipulation'
        ]
      },
      {
        id: 'sat-math-prob-geom',
        name: 'Problem-Solving, Data & Geometry',
        subscoreName: 'Math Domain',
        weightOrScale: 'Approx. 30% of Math',
        description: 'Assesses ratios, rates, percentages, statistical data analysis, geometry, and trigonometry.',
        keyCompetencies: [
          'Ratios, unit conversions, and percentage change models',
          'Probability, margin of error, and statistical inferences',
          'Right triangle trigonometry, circle theorems, area, and volume formulas'
        ]
      }
    ],

    // 3. Question Types (with SVT original practice)
    questionTypes: [
      {
        id: 'sat-q-rhetorical-synthesis',
        title: 'Rhetorical Synthesis (Student Notes)',
        skillCategory: 'Expression of Ideas',
        timeLimit: 'Approx. 60–75 Seconds',
        difficulty: 'Standard',
        format: 'Multiple Choice',
        description: 'Candidates review bulleted research notes taken by a student and choose the sentence that best fulfills a specifically stated rhetorical goal.',
        evaluatedSkills: [
          'Goal identification from prompt instructions',
          'Filtering irrelevant bullet points',
          'Selecting synthesized sentences that meet the exact objective'
        ],
        svtPracticeSample: {
          id: 'svt-sat-sample-1',
          taskInstructions: 'Read the prompt question FIRST to determine the exact goal, then select the choice that directly accomplishes this goal using information from the notes.',
          prompt: 'While researching a topic, a student has taken the following notes:\n• The Voyager 1 spacecraft was launched by NASA in September 1977.\n• It carries the Golden Record, a gold-plated copper phonograph record containing sounds and images of Earth.\n• The Voyager 2 spacecraft was launched in August 1977, sixteen days prior to Voyager 1.\n• Voyager 2 is the only spacecraft to have visited all four gas giant planets (Jupiter, Saturn, Uranus, and Neptune).\n\nThe student wants to emphasize a unique achievement of Voyager 2. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
          options: [
            { id: 'sat-opt-1', text: 'Although launched sixteen days after Voyager 2, Voyager 1 also carries NASA’s Golden Record.', isCorrect: false, explanation: 'Incorrect. Focuses on Voyager 1 rather than emphasizing Voyager 2’s unique achievement.' },
            { id: 'sat-opt-2', text: 'Voyager 2 holds the distinction of being the sole spacecraft to visit all four of the solar system’s gas giant planets.', isCorrect: true, explanation: 'Correct! This choice directly emphasizes the unique achievement specified in the notes ("the only spacecraft to have visited all four gas giant planets").' },
            { id: 'sat-opt-3', text: 'Both Voyager 1 and Voyager 2 were launched by NASA in the late summer of 1977.', isCorrect: false, explanation: 'Incorrect. Emphasizes similarity and launch timing rather than a unique achievement of Voyager 2.' },
            { id: 'sat-opt-4', text: 'NASA launched Voyager 2 in August 1977 to explore interplanetary space.', isCorrect: false, explanation: 'Incorrect. Provides general launch information without highlighting a unique accomplishment.' }
          ],
          modelResponseOrSolution: 'Option 2 directly fulfills the rhetorical goal by highlighting Voyager 2 as the sole spacecraft to visit all four gas giants.',
          scoringFocus: [
            'Prompt goal matching ("emphasize a unique achievement of Voyager 2")',
            'Exclusion of extraneous facts'
          ]
        },
        topStrategyTip: 'Always read the prompt question at the bottom first before reading the bullet points. Once you know the exact goal (e.g., "emphasize a difference" or "introduce a person to a new audience"), you can eliminate incorrect options quickly.'
      },
      {
        id: 'sat-q-transitions',
        title: 'Logical Transitions in Discourse',
        skillCategory: 'Expression of Ideas',
        timeLimit: 'Approx. 45–60 Seconds',
        difficulty: 'Foundational',
        format: 'Multiple Choice',
        description: 'Candidates select the most logical transition word or phrase connecting two sentences or clauses.',
        evaluatedSkills: [
          'Classifying transition families (Continuation, Contrast, Cause & Effect)',
          'Analyzing semantic relationships between adjacent sentences'
        ],
        svtPracticeSample: {
          id: 'svt-sat-sample-2',
          taskInstructions: 'Choose the transition that most logically completes the text.',
          prompt: 'Early astronomers hypothesized that Mars’s polar ice caps were composed exclusively of frozen carbon dioxide. Modern spectroscopic data gathered by orbital satellites, ________, has revealed that substantial reservoirs of water ice exist directly beneath the carbon dioxide surface layers.',
          options: [
            { id: 't1', text: 'furthermore', isCorrect: false, explanation: 'Incorrect. "Furthermore" signals continuation, but the second sentence contradicts the initial hypothesis.' },
            { id: 't2', text: 'however', isCorrect: true, explanation: 'Correct! "However" signals the contrast between the early hypothesis and the modern satellite discoveries.' },
            { id: 't3', text: 'consequently', isCorrect: false, explanation: 'Incorrect. "Consequently" signals cause-and-effect, which does not match the contrast between old theory and new evidence.' },
            { id: 't4', text: 'for example', isCorrect: false, explanation: 'Incorrect. "For example" introduces an illustration, whereas the text presents a contrasting discovery.' }
          ],
          modelResponseOrSolution: 'Option 2 ("however") establishes the necessary contrast between the early hypothesis and modern spectroscopic findings.',
          scoringFocus: [
            'Identifying contrasting claims',
            'Eliminating transition choices that belong to wrong relationship categories'
          ]
        },
        topStrategyTip: 'Summarize Sentence 1 in your mind, summarize Sentence 2, and determine if the relationship is Contrast (However), Continuation (Moreover), or Cause/Effect (Therefore).'
      },
      {
        id: 'sat-q-desmos-math',
        title: 'Systems of Equations & Non-Linear Functions (Desmos)',
        skillCategory: 'Algebra & Advanced Math',
        timeLimit: 'Approx. 60–90 Seconds',
        difficulty: 'Challenging',
        format: 'Interactive Graph/Desmos',
        description: 'Questions evaluating algebraic systems, intersections, vertex forms, and regressions solvable directly with the built-in Desmos graphing calculator.',
        evaluatedSkills: [
          'Graphing linear and quadratic systems',
          'Finding points of intersection and coordinates',
          'Evaluating function zeros and vertices efficiently'
        ],
        svtPracticeSample: {
          id: 'svt-sat-sample-3',
          taskInstructions: 'Solve the system of equations for positive x and y values.',
          prompt: 'Consider the system of equations:\ny = 2x² - 5x + 3\ny = 3x - 5\nWhat is the x-coordinate of the point of intersection between the parabola and the line?',
          options: [
            { id: 'm1', text: 'x = 2', isCorrect: true, explanation: 'Correct! Setting 2x² - 5x + 3 = 3x - 5 yields 2x² - 8x + 8 = 0 -> 2(x - 2)² = 0, giving a single intersection point at x = 2. In Desmos, typing both equations immediately shows the tangent intersection at (2, 1).' },
            { id: 'm2', text: 'x = 4', isCorrect: false, explanation: 'Incorrect. At x = 4, the parabola gives y = 15 while the line gives y = 7.' },
            { id: 'm3', text: 'x = 1', isCorrect: false, explanation: 'Incorrect. At x = 1, the parabola gives y = 0 while the line gives y = -2.' },
            { id: 'm4', text: 'x = 3', isCorrect: false, explanation: 'Incorrect. At x = 3, the parabola gives y = 6 while the line gives y = 4.' }
          ],
          modelResponseOrSolution: 'x = 2. Solvable algebraically by factoring 2(x - 2)² = 0 or by graphing both equations in Desmos.',
          scoringFocus: [
            'Algebraic equivalence and Desmos intersection verification',
            'Speed and accuracy under timed constraints'
          ]
        },
        topStrategyTip: 'On the Digital SAT, the built-in Desmos calculator is available on ALL Math questions. Type equations directly into Desmos to find intersections, zeros, and vertex points in seconds.'
      }
    ],

    // 4. Preparation Roadmap
    roadmap: [
      {
        id: 'sat-p1',
        phaseNumber: 1,
        title: 'Bluebook Installation & Full-Length Diagnostic',
        timeframe: 'Weeks 1–2',
        focus: 'Download College Board Bluebook app and take official Practice Test 1 under real timing.',
        tasks: [
          { id: 'sat-t1', label: 'Download and install the official Bluebook application from bluebook.collegeboard.org.' },
          { id: 'sat-t2', label: 'Take full-length Practice Test 1 in Bluebook to determine baseline scores in Reading/Writing and Math.' },
          { id: 'sat-t3', label: 'Link College Board account with Khan Academy Official SAT Prep for personalized skill maps.' }
        ]
      },
      {
        id: 'sat-p2',
        phaseNumber: 2,
        title: 'Desmos Pacing & Grammar Conventions Practice',
        timeframe: 'Weeks 3–6',
        focus: 'Practise built-in Desmos calculator shortcuts and Standard English Conventions punctuation rules.',
        tasks: [
          { id: 'sat-t4', label: 'Practise typing systems of equations, sliders, and regressions directly into Desmos.' },
          { id: 'sat-t5', label: 'Practise colon, semicolon, and dash rules: verify that independent clauses precede colons.' },
          { id: 'sat-t6', label: 'Drill Rhetorical Synthesis and Transition questions using goal-first reading strategies.' }
        ]
      },
      {
        id: 'sat-p3',
        phaseNumber: 3,
        title: 'Adaptive Stage 2 Simulations & Test-Day Readiness',
        timeframe: 'Weeks 7–8',
        focus: 'Complete remaining Bluebook practice tests to prepare for harder Module 2 pacing.',
        tasks: [
          { id: 'sat-t7', label: 'Complete Bluebook Practice Tests under timed conditions.' },
          { id: 'sat-t8', label: 'Maintain an Error Log analyzing why incorrect answers were chosen and identifying question triggers.' },
          { id: 'sat-t9', label: 'Print your SAT Admission Ticket and prepare approved device and charger for test day.' }
        ]
      }
    ],

    // 5. Practice Strategies
    strategies: [
      {
        id: 'sat-strat-1',
        category: 'Exam Architecture',
        title: 'Module 1 Accuracy for Module 2 Adaptive Routing',
        ruleSummary: 'Pace yourself for high accuracy on Module 1 to unlock the higher-scoring Module 2.',
        inDepthExplanation: 'The Digital SAT is section-adaptive. Performance on the first module determines whether you receive the easier or harder Module 2. Higher score ranges require qualifying for the harder Module 2.',
        actionableStep: 'Do not rush through Module 1. Double-check your answers and use the Bluebook review screen to check flagged questions.'
      },
      {
        id: 'sat-strat-2',
        category: 'Standard English Conventions',
        title: 'Independent Clause Colon Rule',
        ruleSummary: 'A colon (:) or single dash (—) must be preceded by a complete independent clause.',
        inDepthExplanation: 'A common punctuation trap involves placing a colon after a verb or preposition. On the SAT, the clause preceding a colon must stand as a complete, grammatically sound sentence on its own.',
        actionableStep: 'Whenever you see a colon in an answer choice, read the text before the colon in isolation. If it cannot stand as a complete sentence, eliminate that choice.'
      },
      {
        id: 'sat-strat-3',
        category: 'SAT Math / Desmos',
        title: 'Desmos Regressions for Polynomials & Parabolas',
        ruleSummary: 'Use y1 ~ ax1² + bx1 + c in Desmos to calculate quadratic models from given coordinate tables.',
        inDepthExplanation: 'When a math question provides a table of values and asks for the equation of the parabola or vertex, you do not need to write systems of equations by hand. Desmos calculates regression constants a, b, and c quickly.',
        actionableStep: 'Add a table in Desmos (x1, y1), input 3 points from the question, and type y1 ~ ax1² + bx1 + c on the next line.'
      }
    ],

    // 6. Official Resources
    officialResources: [
      {
        id: 'sat-off-1',
        title: 'College Board Digital SAT Suite',
        provider: 'College Board',
        type: 'Portal',
        url: 'https://satsuite.collegeboard.org/digital',
        description: 'Official registration portal, test dates, score sends, and examination specifications.',
        isPrimary: true
      },
      {
        id: 'sat-off-2',
        title: 'College Board Bluebook Testing App',
        provider: 'College Board',
        type: 'Software/App',
        url: 'https://bluebook.collegeboard.org/',
        description: 'Official testing platform where candidates take authentic adaptive practice tests and actual exams.',
        isPrimary: true
      },
      {
        id: 'sat-off-3',
        title: 'Official Khan Academy SAT Practice',
        provider: 'Khan Academy (Official College Board Partner)',
        type: 'Practice Test',
        url: 'https://www.khanacademy.org/sat',
        description: 'Free official practice library with interactive questions and video lessons developed in partnership with College Board.',
        isPrimary: true
      }
    ],

    // 7. Independent Recommended Educator (Official Partner / Verified Practice)
    recommendedEducator: {
      name: 'Khan Academy SAT Prep',
      channelTitle: 'Official SAT Prep on Khan Academy',
      channelUrl: 'https://www.khanacademy.org/sat',
      imageAssetSrc: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=200&fit=crop&q=80',
      imageAlt: 'Khan Academy SAT Prep',
      tagline: 'Official College Board partnership lessons and verified math and reading walkthroughs for the Digital SAT.',
      whyRecommended: [
        'Direct partnership with College Board ensuring alignment with official question formats',
        'Step-by-step video explanations for every Digital SAT skill domain',
        'Interactive practice challenges for Algebra, Advanced Math, and Grammar Conventions',
        'Desmos graphing walkthroughs and timed practice sets'
      ],
      notablePlaylistsOrSeries: [
        'Official Digital SAT Khan Academy Learning Tracks',
        'Desmos Calculator SAT Strategy Lessons',
        'Standard English Conventions Punctuation Framework'
      ],
      disclaimer: 'SVT is an independent student-led nonprofit organization. External educators are shared as optional learning resources and are not partners or official test providers. Digital SAT is a registered trademark of the College Board. Khan Academy is an official partner of College Board.'
    }
  }
};
