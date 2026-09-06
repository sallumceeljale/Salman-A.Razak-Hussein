import { PracticeExercise } from '../types/practiceLab';

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  // =========================================================================
  // CATEGORY 1: ENGLISH FOUNDATIONS
  // =========================================================================
  {
    id: 'fnd-1',
    category: 'foundations',
    categoryLabel: 'English Foundations',
    skill: 'Grammar: Subject-Verb Agreement with Intervening Phrases',
    difficulty: 'Foundation',
    title: 'Agreement Across Intervening Prepositional Phrases',
    instructions: 'Select the verb form that grammatically agrees with the true subject of the sentence.',
    promptText: 'The collection of rare manuscripts and historical letters, which was preserved by university librarians, ________ scheduled for exhibition next semester.',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'is',
        isCorrect: true,
        explanation: 'Correct! The singular head noun is "The collection". The intervening prepositional phrase "of rare manuscripts and historical letters" does not alter the number of the subject. Therefore, the singular verb "is" is required.'
      },
      {
        id: 'opt-b',
        text: 'are',
        isCorrect: false,
        explanation: 'Incorrect. "Are" is plural. Test-takers often mistakenly match the verb to nearby plural nouns like "letters" or "manuscripts", but the grammatical subject is the singular noun "collection".'
      },
      {
        id: 'opt-c',
        text: 'were',
        isCorrect: false,
        explanation: 'Incorrect. "Were" is both plural and past tense, conflicting with the singular subject "collection" and future time frame "next semester".'
      },
      {
        id: 'opt-d',
        text: 'being',
        isCorrect: false,
        explanation: 'Incorrect. "Being" is a participle and cannot serve as the main finite verb of the independent clause without an auxiliary verb.'
      }
    ],
    coreRule: 'Prepositional phrases (e.g., "of...", "in addition to...", "along with...") positioned between a subject and verb never change the grammatical number of the subject.',
    strategyTip: 'Mentally cross out all prepositional and relative clauses between the subject and the blank to clearly isolate the head noun.',
    suggestedTimeSeconds: 45
  },
  {
    id: 'fnd-2',
    category: 'foundations',
    categoryLabel: 'English Foundations',
    skill: 'Vocabulary in Context: Nuanced Academic Adjectives',
    difficulty: 'Intermediate',
    title: 'Contextual Word Precision in Scientific Prose',
    instructions: 'Choose the word that most accurately completes the scientific sentence without introducing unintended emotional connotation.',
    passage: 'After analyzing three years of meteorological telemetry, the research team noted that seasonal precipitation patterns were highly ________, demonstrating sharp fluctuations between consecutive quarters.',
    promptText: 'Which word best fits the blank to convey unreliability and continuous variation?',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'erratic',
        isCorrect: true,
        explanation: 'Correct! "Erratic" means unpredictable, inconsistent, or fluctuating widely, which directly matches the context of "sharp fluctuations between consecutive quarters".'
      },
      {
        id: 'opt-b',
        text: 'hazardous',
        isCorrect: false,
        explanation: 'Incorrect. "Hazardous" means dangerous to health or safety. While erratic weather can occasionally be dangerous, the passage focuses purely on numerical variation and unpredictability, not physical peril.'
      },
      {
        id: 'opt-c',
        text: 'tedious',
        isCorrect: false,
        explanation: 'Incorrect. "Tedious" means boring or tiresomely repetitive, which is an emotional human reaction rather than a description of fluctuating climate data.'
      },
      {
        id: 'opt-d',
        text: 'diminished',
        isCorrect: false,
        explanation: 'Incorrect. "Diminished" means reduced in size or amount overall. The sentence describes "sharp fluctuations" (both highs and lows), not a permanent reduction.'
      }
    ],
    coreRule: 'Academic context clues often provide direct synonyms or definitions in the surrounding clause (e.g., "sharp fluctuations").',
    strategyTip: 'Substitute your own simple word (like "unpredictable") into the blank before looking at the choices, then select the closest academic synonym.',
    suggestedTimeSeconds: 60
  },
  {
    id: 'fnd-3',
    category: 'foundations',
    categoryLabel: 'English Foundations',
    skill: 'Sentence Clarity: Eliminating Redundancy & Wordiness',
    difficulty: 'Foundation',
    title: 'Concise Phrasing & Economy of Language',
    instructions: 'Identify the version of the sentence that conveys the meaning clearly without unnecessary repetition or wordiness.',
    promptText: 'Which revised sentence provides the cleanest and most direct phrasing?',
    exerciseType: 'sentence-clarity',
    options: [
      {
        id: 'opt-a',
        text: 'The committee members unanimously agreed on the proposal at the same time together.',
        isCorrect: false,
        explanation: 'Incorrect. "Unanimously" already means all members agreed; adding "at the same time together" is redundant repetition.'
      },
      {
        id: 'opt-b',
        text: 'The committee members reached a unanimous agreement in complete unison.',
        isCorrect: false,
        explanation: 'Incorrect. "Unanimous agreement" and "in complete unison" repeat the exact same concept of universal consent.'
      },
      {
        id: 'opt-c',
        text: 'The committee unanimously approved the proposal.',
        isCorrect: true,
        explanation: 'Correct! This choice uses an active, precise verb ("approved") and a single adverb ("unanimously") to express the complete idea without any superfluous words.'
      },
      {
        id: 'opt-d',
        text: 'Due to the fact that they shared the same point of view, the committee approved the proposal.',
        isCorrect: false,
        explanation: 'Incorrect. "Due to the fact that they shared the same point of view" is a bloated, wordy replacement for the concise adverb "unanimously".'
      }
    ],
    coreRule: 'In academic writing, shorter sentences that preserve all factual details with active verbs are always preferred over multi-word idioms and tautologies.',
    strategyTip: 'Look out for paired duplicates like "unanimous + together", "past history", "future plans", or "collaborate together". Eliminate the duplicate.',
    suggestedTimeSeconds: 50
  },
  {
    id: 'fnd-4',
    category: 'foundations',
    categoryLabel: 'English Foundations',
    skill: 'Grammar: Dangling and Misplaced Modifiers',
    difficulty: 'Intermediate',
    title: 'Participial Phrase Alignment',
    instructions: 'Select the sentence that correctly connects the introductory descriptive phrase to its logical agent.',
    promptText: 'Introductory modifier: "Having spent several hours reviewing the organic chemistry equations,"',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'Having spent several hours reviewing the organic chemistry equations, the laboratory exam seemed much less intimidating to Maya.',
        isCorrect: false,
        explanation: 'Incorrect. The subject immediately following the comma is "the laboratory exam", which cannot spend hours reviewing chemistry equations. This creates a dangling modifier.'
      },
      {
        id: 'opt-b',
        text: 'Having spent several hours reviewing the organic chemistry equations, Maya found the laboratory exam much less intimidating.',
        isCorrect: true,
        explanation: 'Correct! Maya is the person who spent hours studying, so placing "Maya" immediately after the introductory participial modifier creates logical and grammatical alignment.'
      },
      {
        id: 'opt-c',
        text: 'Having spent several hours reviewing the organic chemistry equations, the study notes prepared Maya thoroughly for the exam.',
        isCorrect: false,
        explanation: 'Incorrect. The noun "study notes" immediately follows the comma, illogically implying that the inanimate study notes reviewed the equations.'
      },
      {
        id: 'opt-d',
        text: 'Having spent several hours reviewing the organic chemistry equations, confidence was restored before the exam began.',
        isCorrect: false,
        explanation: 'Incorrect. The abstract noun "confidence" cannot perform the action of reviewing chemistry equations.'
      }
    ],
    coreRule: 'An introductory participial phrase (e.g., "-ing" or "-ed") must immediately precede the exact noun performing that action.',
    strategyTip: 'Always ask yourself: "Who or what is performing the action in the opening phrase?" That person or entity MUST be the first word after the comma.',
    suggestedTimeSeconds: 60
  },
  {
    id: 'fnd-5',
    category: 'foundations',
    categoryLabel: 'English Foundations',
    skill: 'Reading Comprehension: Synthesizing Main Ideas',
    difficulty: 'Intermediate',
    title: 'Urban Ecology and Green Infrastructure',
    instructions: 'Read the short excerpt and identify the central thesis of the paragraph.',
    passage: 'Traditional civil engineering historically viewed urban rainwater as an industrial hazard to be channeled into concrete storm drains as swiftly as possible. Modern ecological design, however, treats precipitation as a vital municipal asset. By implementing permeable pavements, bioswales, and rooftop gardens, contemporary cities capture runoff locally, replenishing underground aquifers and reducing urban heat-island temperatures while simultaneously mitigating flood risks.',
    promptText: 'Which statement most comprehensively captures the main idea of the passage?',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'Concrete storm drains have completely failed in all major global metropolitan areas.',
        isCorrect: false,
        explanation: 'Incorrect. The passage notes that traditional systems channeled water rapidly into concrete drains, but does not make the extreme claim that they "completely failed in all major global areas".'
      },
      {
        id: 'opt-b',
        text: 'Urban development has shifted from rapid water expulsion toward integrated, nature-based runoff management.',
        isCorrect: true,
        explanation: 'Correct! The paragraph explicitly contrasts the historical approach (rapid drainage through concrete) with modern ecological infrastructure (permeable pavements, bioswales, aquifer replenishment).'
      },
      {
        id: 'opt-c',
        text: 'Rooftop gardens are the single most economical method for lowering municipal temperatures.',
        isCorrect: false,
        explanation: 'Incorrect. Rooftop gardens are mentioned as one example alongside bioswales and permeable pavements; the text makes no claim about them being the "single most economical" tool.'
      },
      {
        id: 'opt-d',
        text: 'Aquifer replenishment is impossible in densely populated concrete environments.',
        isCorrect: false,
        explanation: 'Incorrect. The text explains that modern cities actively replenish aquifers using permeable designs.'
      }
    ],
    coreRule: 'A true main idea reflects the overarching transition or argument of the entire passage, not isolated supporting examples.',
    strategyTip: 'Look for contrast transition markers like "however", "on the other hand", or "nevertheless" to identify the author’s primary pivot.',
    suggestedTimeSeconds: 75
  },

  // =========================================================================
  // CATEGORY 2: DET SKILLS (Duolingo English Test Format Styles)
  // =========================================================================
  {
    id: 'det-1',
    category: 'det',
    categoryLabel: 'DET Skills',
    skill: 'Read and Complete: C-Test Word Reconstruction',
    difficulty: 'Foundation',
    title: 'Academic Paragraph Letter Completion',
    instructions: 'In the passage below, complete the missing letters for each partially blank word to form a grammatically and contextually correct text.',
    passage: 'Renewable energy systems are bec______ essential for modern power grids. Sol______ panels and wi______ turbines generate clean electricity without producing greenh______ emissions.',
    promptText: 'Type the missing letters to complete the 4 words in sequence:',
    exerciseType: 'read-and-complete',
    blanks: [
      {
        id: 'blk-1',
        prefixText: 'bec',
        correctAnswer: 'oming',
        acceptableAnswers: ['oming'],
        hint: 'Present participle of "become" (6 letters total: bec + oming)'
      },
      {
        id: 'blk-2',
        prefixText: 'Sol',
        correctAnswer: 'ar',
        acceptableAnswers: ['ar'],
        hint: 'Relating to energy from the sun (5 letters total: Sol + ar)'
      },
      {
        id: 'blk-3',
        prefixText: 'wi',
        correctAnswer: 'nd',
        acceptableAnswers: ['nd'],
        hint: 'Moving air power generator (4 letters total: wi + nd)'
      },
      {
        id: 'blk-4',
        prefixText: 'greenh',
        correctAnswer: 'ouse',
        acceptableAnswers: ['ouse'],
        hint: 'Type of heat-trapping gas emissions (10 letters total: greenh + ouse)'
      }
    ],
    coreRule: 'In C-Test exercises, the second half of every target word is omitted. Count the missing character slots and check the part of speech (noun, verb, adjective).',
    strategyTip: 'Read the full sentence first to determine context and syntax before filling in individual letters.',
    suggestedTimeSeconds: 90
  },
  {
    id: 'det-2',
    category: 'det',
    categoryLabel: 'DET Skills',
    skill: 'Fill in the Blanks: Academic Passage Cloze',
    difficulty: 'Intermediate',
    title: 'Text Completion with Collocational Precision',
    instructions: 'Complete the missing words in the academic passage by selecting the most appropriate term for each numbered blank.',
    passage: 'Microscopic phytoplankton play a pivotal role in the global carbon cycle. Through the process of (1) [photosynthesis / evaporation / combustion], they absorb atmospheric carbon dioxide and release oxygen. When these organisms die, a substantial portion of their biomass sinks to the ocean floor, effectively (2) [sequestering / distributing / diluting] carbon for centuries.',
    promptText: 'Select the correct pair of words to complete blanks (1) and (2):',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: '(1) photosynthesis | (2) sequestering',
        isCorrect: true,
        explanation: 'Correct! Phytoplankton absorb carbon and produce oxygen via photosynthesis. When dead biomass settles on the ocean bed, it traps or stores ("sequesters") carbon from the atmosphere.'
      },
      {
        id: 'opt-b',
        text: '(1) evaporation | (2) distributing',
        isCorrect: false,
        explanation: 'Incorrect. Evaporation is a physical water phase change, not a biological mechanism absorbing CO2. "Distributing" implies spreading across the surface rather than isolating at depth.'
      },
      {
        id: 'opt-c',
        text: '(1) combustion | (2) diluting',
        isCorrect: false,
        explanation: 'Incorrect. Combustion produces carbon dioxide through burning, the exact opposite of what phytoplankton do.'
      },
      {
        id: 'opt-d',
        text: '(1) photosynthesis | (2) diluting',
        isCorrect: false,
        explanation: 'Incorrect. While photosynthesis is accurate for (1), "diluting" means weakening concentration rather than capturing/trapping carbon.'
      }
    ],
    coreRule: 'Subject-matter reading passages test domain collocations: biology mechanisms (photosynthesis, respiration) and climate terminology (carbon sequestration).',
    strategyTip: 'Trace the causal chain in the sentence: absorbing CO2 + sinking to floor = long-term carbon storage ("sequestering").',
    suggestedTimeSeconds: 60
  },
  {
    id: 'det-3',
    category: 'det',
    categoryLabel: 'DET Skills',
    skill: 'Short Writing: 5-Minute Argumentative Response Structure',
    difficulty: 'Intermediate',
    title: 'Prompt Architecture for Timed Written Arguments',
    instructions: 'Review the prompt below and identify the most cohesive topic sentence and supporting structure for a 5-minute written response.',
    promptText: 'DET Prompt: "Some students prefer studying individually, while others believe group study is more effective. Which approach do you think is better, and why? Give reasons and examples."',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'I think studying is good for students. When we study, we get good grades in school, and my friends also like to study every day at home.',
        isCorrect: false,
        explanation: 'Incorrect. This response lacks a clear comparative position between solo vs. group study and relies on overly simplistic sentence structures without answering the core prompt prompt.'
      },
      {
        id: 'opt-b',
        text: 'While collaborative study fosters lively discussion, I believe independent study is more effective because it allows students to customize their pacing and identify individual conceptual weaknesses without distraction.',
        isCorrect: true,
        explanation: 'Correct! This thesis directly answers the prompt, acknowledges the counter-perspective ("While collaborative study..."), clearly states a position, and provides two distinct supporting pillars (pacing customization & distraction-free weakness diagnosis).'
      },
      {
        id: 'opt-c',
        text: 'Studying in groups is fun because you can eat snacks and talk about homework together with your classmates.',
        isCorrect: false,
        explanation: 'Incorrect. This response is informal and does not demonstrate academic register, grammatical variety, or persuasive depth required for high subscores.'
      },
      {
        id: 'opt-d',
        text: 'Both ways are very nice and have many good things and bad things.',
        isCorrect: false,
        explanation: 'Incorrect. Stating that both have "good and bad things" without taking a distinct stance or developing specific arguments produces a vague, underdeveloped response.'
      }
    ],
    coreRule: 'In 5-minute writing prompts, a complex opening sentence using a concession clause ("Although X, I argue Y because A and B") demonstrates high lexical resource and syntactic sophistication immediately.',
    strategyTip: 'Aim for 80–120 words in 5 minutes with 3 components: Clear Thesis -> Concrete Example/Illustration -> Impactful Conclusion.',
    suggestedTimeSeconds: 75
  },
  {
    id: 'det-4',
    category: 'det',
    categoryLabel: 'DET Skills',
    skill: 'Speaking-Planning: 20-Second Preparation Blueprint',
    difficulty: 'Advanced',
    title: 'Structuring Spontaneous 60–90s Spoken Responses',
    instructions: 'You are given 20 seconds to prepare for a speaking prompt. Which organizational roadmap delivers the highest scoring fluency and coherence?',
    promptText: 'Speaking Prompt: "Describe a significant challenge you faced during a school project and explain how you overcame it."',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'STAR Method: Situation (Project topic & deadline) -> Task/Conflict (Team member dropped out / data corrupted) -> Action (Reorganized milestones & took initiative) -> Result/Reflection (Successful delivery & lesson in resilience).',
        isCorrect: true,
        explanation: 'Correct! The STAR framework ensures structured narrative pacing, eliminates awkward mid-speech pauses, and naturally incorporates past, present, and reflective tenses.'
      },
      {
        id: 'opt-b',
        text: 'Start talking immediately about all the bad things that happened without planning, and keep speaking until the clock runs out.',
        isCorrect: false,
        explanation: 'Incorrect. Unstructured speaking leads to circular repetition, fillers ("um", "like"), and disorganized thoughts that lower production subscores.'
      },
      {
        id: 'opt-c',
        text: 'Spend the whole 20 seconds memorizing a sophisticated dictionary word to say once at the start.',
        isCorrect: false,
        explanation: 'Incorrect. Fixating on an isolated vocabulary word sacrifices overall coherence and story development. Coherence and natural grammar are evaluated across the entire 90 seconds.'
      },
      {
        id: 'opt-d',
        text: 'Recite a pre-memorized speech about your favorite hobby regardless of what the prompt asked.',
        isCorrect: false,
        explanation: 'Incorrect. Pre-memorized or off-topic responses are flagged for lacking topical relevance, severely reducing scoring.'
      }
    ],
    coreRule: 'Use the 20-second prep screen to map 3 quick mental anchor words (Problem -> Solution -> Lesson) rather than trying to write full sentences.',
    strategyTip: 'Transition smoothly between anchors with discourse markers: "The primary obstacle arose when...", "To resolve this, I took the initiative to...", "Ultimately, this experience taught me...".',
    suggestedTimeSeconds: 60
  },
  {
    id: 'det-5',
    category: 'det',
    categoryLabel: 'DET Skills',
    skill: 'Vocabulary Selection: Identifying Authentic English Words',
    difficulty: 'Intermediate',
    title: 'Distinguishing Real vs. Pseudo-English Words',
    instructions: 'Identify which of the four presented words is a genuine, standard English academic word.',
    promptText: 'Which word below is an authentic English word?',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'incomprehensivity',
        isCorrect: false,
        explanation: 'Incorrect. This is an artificial pseudo-word combining prefixes and suffixes incorrectly. The authentic noun is "incomprehensibility".'
      },
      {
        id: 'opt-b',
        text: 'preponderance',
        isCorrect: true,
        explanation: 'Correct! "Preponderance" is a legitimate academic noun meaning the quality of being greater in number, quantity, or importance (e.g., "a preponderance of evidence").'
      },
      {
        id: 'opt-c',
        text: 'descriptious',
        isCorrect: false,
        explanation: 'Incorrect. This is a fabricated pseudo-word. The correct adjective forms are "descriptive" or "nondescript".'
      },
      {
        id: 'opt-d',
        text: 'authentify',
        isCorrect: false,
        explanation: 'Incorrect. This is an invalid suffix combination. The genuine English verb is "authenticate".'
      }
    ],
    coreRule: 'In Read and Select / Vocabulary tasks, pseudo-words often misuse common Latin suffixes (-ious, -ify, -ivity). If you have never encountered a word in genuine reading, do not guess it solely because it sounds plausible.',
    strategyTip: 'Check the root word and suffix rules: authenticate (verb), authentic (adjective), authenticity (noun).',
    suggestedTimeSeconds: 45
  },

  // =========================================================================
  // CATEGORY 3: IELTS SKILLS (Academic IELTS Focus)
  // =========================================================================
  {
    id: 'iel-1',
    category: 'ielts',
    categoryLabel: 'IELTS Skills',
    skill: 'Reading: True / False / Not Given Logic',
    difficulty: 'Intermediate',
    title: 'Analyzing Textual Verification & Absence of Proof',
    instructions: 'Read the short excerpt and determine whether the statement is TRUE, FALSE, or NOT GIVEN based solely on the text.',
    passage: 'Excavations in the ancient Mesopotamian city of Uruk revealed complex clay token accounting systems dating back to 3500 BCE. While early archeologists assumed these tokens recorded religious sacrifices, subsequent decipherment proved they were utilized exclusively for cataloging agricultural yields such as grain and livestock.',
    promptText: 'Statement: "Archeologists in the nineteenth century were the first researchers to discover clay tokens at Uruk."',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'TRUE',
        isCorrect: false,
        explanation: 'Incorrect. The passage mentions "early archeologists", but does NOT state that nineteenth-century researchers specifically made the initial discovery.'
      },
      {
        id: 'opt-b',
        text: 'FALSE',
        isCorrect: false,
        explanation: 'Incorrect. To be FALSE, the passage would have to explicitly contradict the statement (e.g., by stating that twentieth-century archeologists were the first).'
      },
      {
        id: 'opt-c',
        text: 'NOT GIVEN',
        isCorrect: true,
        explanation: 'Correct! The text describes "early archeologists" and what they assumed, but never specifies which century they operated in or who made the first discovery. Because the fact is neither confirmed nor contradicted, it is NOT GIVEN.'
      }
    ],
    coreRule: 'TRUE = Directly confirmed by the passage. FALSE = Directly contradicted by the passage. NOT GIVEN = Impossible to verify without outside information.',
    strategyTip: 'Never assume historical dates or outside facts. If a specific adjective or number (e.g., "in the nineteenth century") cannot be found or disproved in the text, choose NOT GIVEN.',
    suggestedTimeSeconds: 60
  },
  {
    id: 'iel-2',
    category: 'ielts',
    categoryLabel: 'IELTS Skills',
    skill: 'Writing Task 1: Academic Overview Formulation',
    difficulty: 'Advanced',
    title: 'Drafting a Band 7+ Overview Paragraph',
    instructions: 'You are analyzing a line graph illustrating renewable vs. fossil fuel electricity generation in Europe from 2000 to 2025.',
    promptText: 'Which overview sentence meets the criteria for Band 7+ in Task Achievement?',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'In 2000, fossil fuels produced 650 TWh and in 2005 they produced 630 TWh, while solar was at 10 TWh in 2000 and 40 TWh in 2010.',
        isCorrect: false,
        explanation: 'Incorrect. An Overview must summarize broad trends, not list individual raw numbers or data points. Listing specific numbers belongs in the detailed body paragraphs.'
      },
      {
        id: 'opt-b',
        text: 'Overall, renewable energy generation experienced a substantial upward trajectory over the period, while fossil fuel reliance showed a steady decline despite remaining the dominant source for the majority of the timeframe.',
        isCorrect: true,
        explanation: 'Correct! This sentence identifies two primary overarching trends (renewable surge vs. fossil fuel decline) and highlights a key comparative feature (fossil fuel dominance for most of the period) without cluttering the overview with raw statistics.'
      },
      {
        id: 'opt-c',
        text: 'The graph has four lines with different colors showing various countries and electricity types in Europe.',
        isCorrect: false,
        explanation: 'Incorrect. This merely describes the visual appearance of the chart rather than summarizing key trends in the data.'
      },
      {
        id: 'opt-d',
        text: 'I think that renewable energy is much better for the environment than coal and oil.',
        isCorrect: false,
        explanation: 'Incorrect. Academic Task 1 requires objective data reporting. Personal opinions, judgments, or speculative reasons are strictly penalized.'
      }
    ],
    coreRule: 'According to official IELTS band descriptors, an Overview must synthesize 2–3 macro trends without including detailed individual data figures.',
    strategyTip: 'Always start your overview with the word "Overall," and place it immediately following your introductory paraphrase paragraph.',
    suggestedTimeSeconds: 75
  },
  {
    id: 'iel-3',
    category: 'ielts',
    categoryLabel: 'IELTS Skills',
    skill: 'Writing Task 2: PEEL Body Paragraph Architecture',
    difficulty: 'Intermediate',
    title: 'Cohesive Paragraph Development (Point, Explanation, Example, Link)',
    instructions: 'Arrange or select the most structurally coherent body paragraph addressing the benefits of remote work.',
    promptText: 'Which paragraph demonstrates correct PEEL progression with robust coherence and cohesion?',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'Remote work saves time. People do not like commuting on buses. Also companies save money on rent. It is very nice for everybody.',
        isCorrect: false,
        explanation: 'Incorrect. The ideas are disconnected, lack transitional signposts, and offer no depth of explanation or concrete examples.'
      },
      {
        id: 'opt-b',
        text: 'One primary benefit of flexible remote employment is the significant reduction in daily commuting time (Point). By eliminating long transit hours, employees can allocate additional time to rest, family commitments, and physical exercise (Explanation). For instance, a recent survey by the Stanford Institute for Economic Policy Research found that remote professionals regained an average of 72 minutes daily (Example). Consequently, this improved work-life balance translates into higher workplace satisfaction and reduced burnout (Link).',
        isCorrect: true,
        explanation: 'Correct! This follows the PEEL framework rigorously: Point (topic sentence), Explanation (how and why it works), Example (concrete academic evidence), and Link (connecting back to the broader thesis).'
      },
      {
        id: 'opt-c',
        text: 'For instance, in 2022 many companies closed offices. Commuting takes 1 hour. Therefore remote work is good because people do not drive cars.',
        isCorrect: false,
        explanation: 'Incorrect. Opening with an example before stating a clear conceptual topic sentence disrupts logical paragraph progression.'
      },
      {
        id: 'opt-d',
        text: 'Firstly, working from home is good. Secondly, traffic is bad. Thirdly, computers are fast. In conclusion, office work is obsolete.',
        isCorrect: false,
        explanation: 'Incorrect. Listing superficial numerical points without explanatory depth or evidence prevents achieving higher coherence bands.'
      }
    ],
    coreRule: 'High-scoring Task 2 body paragraphs focus on ONE well-developed central idea rather than a superficial checklist of 4-5 unrelated points.',
    strategyTip: 'Use PEEL (Point -> Explanation -> Example -> Link). If you cannot provide a detailed explanation for an idea, replace it with one you can defend thoroughly.',
    suggestedTimeSeconds: 80
  },
  {
    id: 'iel-4',
    category: 'ielts',
    categoryLabel: 'IELTS Skills',
    skill: 'Speaking: Part 1 Past-Present-Future (PPF) Expansion',
    difficulty: 'Foundation',
    title: 'Extending Short Answers Naturally',
    instructions: 'Review the examiner prompt and evaluate which response demonstrates optimal natural development without rambling.',
    promptText: 'Examiner: "Do you enjoy reading books in your free time?"',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'Yes, I do. I love books.',
        isCorrect: false,
        explanation: 'Incorrect. This answer is too brief and fails to demonstrate grammatical range or conversational fluency.'
      },
      {
        id: 'opt-b',
        text: 'To be honest, my reading habits have evolved quite a bit. As a child, I used to read fantasy novels constantly (Past), but nowadays with my demanding academic schedule, I primarily read non-fiction articles and scientific papers in the evenings (Present). Once my exams conclude next month, I hope to dive back into historical fiction (Future).',
        isCorrect: true,
        explanation: 'Correct! The response uses the PPF technique (used to read -> nowadays I read -> once exams conclude I hope to). This displays a variety of verb tenses naturally in under 25 seconds.'
      },
      {
        id: 'opt-c',
        text: 'Reading is an intellectual exercise that enhances cognitive faculties across multiple domains according to psychological literature.',
        isCorrect: false,
        explanation: 'Incorrect. This response is overly academic, unnatural, and impersonal for a Part 1 personal question.'
      },
      {
        id: 'opt-d',
        text: 'No, because books are boring and TikTok is better.',
        isCorrect: false,
        explanation: 'Incorrect. While honest, it is too abrupt and uses minimal vocabulary and conversational elaboration.'
      }
    ],
    coreRule: 'In IELTS Speaking Part 1, aim for 2–4 sentences per answer. Using Past, Present, and Future contrast is the most reliable way to demonstrate grammatical range.',
    strategyTip: 'Adopt conversational openers like "To be honest...", "Generally speaking...", or "That depends on...".',
    suggestedTimeSeconds: 50
  },
  {
    id: 'iel-5',
    category: 'ielts',
    categoryLabel: 'IELTS Skills',
    skill: 'Vocabulary & Lexical Resource: Academic Collocations',
    difficulty: 'Advanced',
    title: 'Collocational Precision with Verbs and Nouns',
    instructions: 'Choose the correct verb that naturally and academically collocates with the noun phrase "a comprehensive enquiry".',
    promptText: 'The independent regulatory commission decided to ________ a comprehensive enquiry into the regional banking crisis.',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'conduct',
        isCorrect: true,
        explanation: 'Correct! In formal English, one "conducts an enquiry", "conducts an investigation", or "conducts research". This is an authentic high-frequency academic collocation.'
      },
      {
        id: 'opt-b',
        text: 'make',
        isCorrect: false,
        explanation: 'Incorrect. While "make an enquiry" can be used for casual questions (e.g., asking about train tickets), formal investigations use "conduct", "undertake", or "launch".'
      },
      {
        id: 'opt-c',
        text: 'practice',
        isCorrect: false,
        explanation: 'Incorrect. "Practice" collocates with skills, professions (practice law/medicine), or habits, not formal regulatory enquiries.'
      },
      {
        id: 'opt-d',
        text: 'execute',
        isCorrect: false,
        explanation: 'Incorrect. "Execute" collocates with plans, orders, or computer programs, rather than investigative enquiries.'
      }
    ],
    coreRule: 'Band 7+ Lexical Resource rewards natural word partnerships (collocations) like "conduct research", "pose a threat", "exert influence", and "address a concern".',
    strategyTip: 'When learning a new academic noun, always write down the 2–3 verbs and adjectives that native speakers naturally combine with it.',
    suggestedTimeSeconds: 45
  },
  {
    id: 'iel-6',
    category: 'ielts',
    categoryLabel: 'IELTS Skills',
    skill: 'Reading: Heading Matching & Paragraph Skimming',
    difficulty: 'Advanced',
    title: 'Identifying Paragraph Purpose vs. Isolated Details',
    instructions: 'Read the short paragraph and choose the most suitable section heading.',
    passage: 'While the initial capital expenditure for geothermal installation exceeds that of conventional natural gas boilers, operating costs over a 20-year horizon are dramatically lower. Geothermal loops require minimal mechanical maintenance, suffer zero fuel price volatility, and offer life expectancies exceeding 50 years for underground piping, making them exceptionally attractive to long-term institutional investors.',
    promptText: 'Which heading accurately represents the central focus of this paragraph?',
    exerciseType: 'multiple-choice',
    options: [
      {
        id: 'opt-a',
        text: 'The Long-Term Economic Viability of Geothermal Energy',
        isCorrect: true,
        explanation: 'Correct! The entire paragraph evaluates financial trade-offs: high initial capital vs. 20-year operational savings, low maintenance, zero fuel risk, and investor appeal.'
      },
      {
        id: 'opt-b',
        text: 'The Exact Engineering Architecture of Underground Piping',
        isCorrect: false,
        explanation: 'Incorrect. The 50-year underground piping lifespan is mentioned solely as supporting evidence for long-term economics, not as an engineering schematic.'
      },
      {
        id: 'opt-c',
        text: 'Why Natural Gas Remains the Safest Heating Technology',
        isCorrect: false,
        explanation: 'Incorrect. The text mentions gas boilers solely for cost comparison and does not argue that natural gas is safest.'
      },
      {
        id: 'opt-d',
        text: 'Global Government Subsidies for Institutional Investors',
        isCorrect: false,
        explanation: 'Incorrect. Government subsidies are never mentioned in the text.'
      }
    ],
    coreRule: 'In Heading Matching, avoid choosing a heading based on a single keyword found in the middle of a paragraph. The correct heading summarizes the PURPOSE of the paragraph.',
    strategyTip: 'Read the first sentence and last sentence carefully, then ask: "Why did the author write this paragraph?"',
    suggestedTimeSeconds: 60
  }
];
