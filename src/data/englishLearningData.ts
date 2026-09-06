export interface GuidedPracticeQuestion {
  id: string;
  title: string;
  scenarioOrContext: string;
  targetConcept: 'opinion-reason' | 'reason-example' | 'connection';
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  hints: string[];
  reasoningExplanation: string;
}

export interface AnnotatedParagraphPart {
  label: 'Opinion' | 'Reason' | 'Example' | 'Connection';
  colorKey: 'emerald' | 'blue' | 'amber' | 'purple';
  text: string;
  explanation: string;
}

export interface EnglishLessonUnit {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  estimatedTime: string;
  audience: string;
  prerequisites: string;
  outcome: string;
  practiceLengthGuideline: string;

  // Step 1: Starting Task
  startingTask: {
    prompt: string;
    helpText: string;
    placeholder: string;
  };

  // Step 2: Explanation
  explanation: {
    coreMessage: string;
    elements: {
      name: string;
      role: string;
      description: string;
      guidingQuestion: string;
    }[];
    clarityPrinciple: string;
  };

  // Step 3: Verified Educational Video
  videoResource: {
    title: string;
    creator: string;
    creatorDescription: string;
    embedUrl?: string;
    sourceUrl: string;
    durationLabel: string;
    transcriptSummary: string;
    keyTakeaways: string[];
  };

  // Step 4: Worked Example
  workedExample: {
    prompt: string;
    fullParagraph: string;
    parts: AnnotatedParagraphPart[];
    weakerVersion: {
      text: string;
      whyItIsWeaker: string[];
    };
  };

  // Step 5: Guided Practice
  guidedPractice: GuidedPracticeQuestion[];

  // Step 6: Independent Task
  independentTask: {
    prompt: string;
    instructions: string;
    suggestedLengthNote: string;
    selfReviewChecklist: {
      id: string;
      label: string;
      description: string;
    }[];
  };

  // Step 7: Reflection
  reflection: {
    prompt: string;
    guidance: string;
  };

  // Step 8: Service Connection
  serviceConnection: {
    title: string;
    task: string;
    reflectionPrompt: string;
  };
}

export interface LearningCoursePathway {
  id: string;
  title: string;
  category: string;
  type: 'svt-pathway' | 'official-course';
  typeLabel: string;
  description: string;
  totalLessons: number;
  estimatedTotalTime: string;
  lessons: EnglishLessonUnit[];
}

export const OPINION_PARAGRAPH_LESSON: EnglishLessonUnit = {
  id: 'opinion-paragraph-1',
  title: 'Write a clear opinion paragraph',
  subtitle: 'Organize your thoughts into a logical paragraph that readers can follow with ease.',
  category: 'English Writing Foundations',
  level: 'Beginner to Intermediate',
  estimatedTime: '20–30 minutes',
  audience: 'Students who can write simple English sentences and want to explain an opinion clearly.',
  prerequisites: 'Ability to write a basic sentence in English and give a reason for your view.',
  outcome: 'Write a short paragraph that states an opinion, explains a reason, gives an example, and connects the ideas clearly.',
  practiceLengthGuideline: 'Suggested length: 60 to 100 words. (This is an SVT practice guideline to help you focus on clarity, not an official exam rule.)',

  startingTask: {
    prompt: 'Should students sometimes study together? Write your opinion and one reason.',
    helpText: 'Write a quick 1 to 2 sentence starting answer. You can save your answer or skip this step. Saving it helps you compare your starting draft with your final writing at the end of the lesson.',
    placeholder: 'For example: I think students should study together because they can help each other understand hard topics.'
  },

  explanation: {
    coreMessage: 'A good paragraph is easy to read because every sentence has a clear purpose. Rather than memorizing complicated transition words, focus on making the relationship between your ideas obvious to the reader.',
    elements: [
      {
        name: '1. Opinion (Your Main Point)',
        role: 'State your view directly.',
        description: 'Tell the reader what you believe in your first sentence. Avoid vague or conflicting statements.',
        guidingQuestion: 'What do I want the reader to understand?'
      },
      {
        name: '2. Reason (The Why)',
        role: 'Explain the main cause behind your belief.',
        description: 'Give a logical explanation that directly supports your opinion rather than stating an unrelated fact.',
        guidingQuestion: 'Why is my opinion reasonable?'
      },
      {
        name: '3. Example (The Evidence)',
        role: 'Describe a specific situation or detail.',
        description: 'A concrete example makes your abstract reason real. It shows how your reason works in practice.',
        guidingQuestion: 'What is a real-life situation that illustrates this reason?'
      },
      {
        name: '4. Connection (The Logical Link)',
        role: 'Tie the example back to your main point.',
        description: 'Explain what the example proves and conclude the thought smoothly so the paragraph feels complete.',
        guidingQuestion: 'How does my example connect back to my main opinion?'
      }
    ],
    clarityPrinciple: 'Clear relationships between ideas matter much more than inserting fancy vocabulary. Readers appreciate simple, direct sentences that build on one another logically.'
  },

  videoResource: {
    title: 'How to Write an Opinion Paragraph',
    creator: 'BBC Learning English',
    creatorDescription: 'Independent public educational broadcast series providing verified English learning lessons.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/P6T63i8Kz54',
    sourceUrl: 'https://www.bbc.co.uk/learningenglish',
    durationLabel: '4 min video',
    transcriptSummary: 'In this lesson, the instructor breaks down the core anatomy of an opinion paragraph. The speaker stresses that an opinion sentence must be followed immediately by a direct reason rather than an unrelated story. Concrete illustrations provide tangible evidence, and a closing synthesis sentence ensures the reader finishes with a clear understanding of the writer’s position.',
    keyTakeaways: [
      'State your main point directly in sentence one without rambling introductory phrases.',
      'Explain "why" right after your opinion statement to maintain momentum.',
      'Ground your reason with one specific, relatable example.',
      'Ensure the final sentence links the example back to the original claim.'
    ]
  },

  workedExample: {
    prompt: 'Should students learn a second language in school?',
    fullParagraph: 'Learning a second language should be required in secondary school because it develops mental flexibility and global communication skills. For instance, when students practice conversing in a foreign language, they learn to adapt their vocabulary and appreciate diverse cultural perspectives. This active mental effort strengthens both general problem-solving ability and intercultural empathy.',
    parts: [
      {
        label: 'Opinion',
        colorKey: 'emerald',
        text: 'Learning a second language should be required in secondary school',
        explanation: 'Directly states the student’s stance on the prompt without hesitation or filler words.'
      },
      {
        label: 'Reason',
        colorKey: 'blue',
        text: 'because it develops mental flexibility and global communication skills.',
        explanation: 'Provides two clear, logical rationales ("mental flexibility" and "global communication") that can be explained next.'
      },
      {
        label: 'Example',
        colorKey: 'amber',
        text: 'For instance, when students practice conversing in a foreign language, they learn to adapt their vocabulary and appreciate diverse cultural perspectives.',
        explanation: 'Gives a concrete classroom situation (conversational practice) showing exactly what the learning looks like.'
      },
      {
        label: 'Connection',
        colorKey: 'purple',
        text: 'This active mental effort strengthens both general problem-solving ability and intercultural empathy.',
        explanation: 'Concludes by tying the example back to the mental flexibility and communication mentioned in the opening sentence.'
      }
    ],
    weakerVersion: {
      text: 'Language is very good. Many people speak English. However, my friend traveled to Spain. Therefore languages are super awesome for everybody.',
      whyItIsWeaker: [
        'Missing a clear central opinion in the first sentence ("Language is very good" is too generic).',
        'Sentences jump between unrelated thoughts without explaining "why".',
        'Uses connectors like "However" and "Therefore" incorrectly where ideas do not contrast or follow logically.',
        'Informal closing phrase ("super awesome") fails to connect back to a coherent main point.'
      ]
    }
  },

  guidedPractice: [
    {
      id: 'gp-1',
      title: 'Exercise 1: Matching Reason to Opinion',
      scenarioOrContext: 'You are writing an opinion paragraph on whether school cafeterias should offer fresh fruit daily.',
      targetConcept: 'opinion-reason',
      question: 'Which of the following sentences provides the clearest and most direct reason to support the opinion: "School cafeterias should provide fresh fruit options at lunch"?',
      options: [
        {
          id: 'opt-1-a',
          text: 'Because supermarkets often sell apples and bananas in large quantities.',
          isCorrect: false,
          feedback: 'This is a general fact about supermarkets, not a reason why school cafeterias should offer fruit to students.'
        },
        {
          id: 'opt-1-b',
          text: 'Because nutrient-rich foods help students stay energized and focused during afternoon classes.',
          isCorrect: true,
          feedback: 'Correct! This gives a direct, logical benefit (energy and focus for afternoon learning) that supports the claim.'
        },
        {
          id: 'opt-1-c',
          text: 'Although some students prefer drinking sweetened soda instead.',
          isCorrect: false,
          feedback: 'This points out a conflicting preference rather than giving a supporting reason.'
        }
      ],
      hints: [
        'Hint 1: A good reason answers the question "Why would offering fruit help students at school?"',
        'Hint 2: Look for the option that connects eating fruit directly to a benefit for learners.'
      ],
      reasoningExplanation: 'A strong reason directly validates the claim. Option B links fresh fruit consumption to tangible student benefits (afternoon focus and physical energy), forming a logical bridge between opinion and evidence.'
    },
    {
      id: 'gp-2',
      title: 'Exercise 2: Selecting a Concrete Example',
      scenarioOrContext: 'Opinion + Reason: "Volunteering in school peer-tutoring groups helps older students master foundational concepts because explaining a topic requires deep understanding."',
      targetConcept: 'reason-example',
      question: 'Which example provides the most concrete illustration of this reason?',
      options: [
        {
          id: 'opt-2-a',
          text: 'For example, many schools around the world have libraries and classrooms.',
          isCorrect: false,
          feedback: 'This describes school facilities rather than an example of an older student tutoring.'
        },
        {
          id: 'opt-2-b',
          text: 'For instance, when a 10th-grade student teaches fractions to an 8th grader, they must review basic math rules and clarify tricky steps in simple terms.',
          isCorrect: true,
          feedback: 'Correct! This describes a specific grade level, subject (fractions), and the exact mental process of reviewing and clarifying.'
        },
        {
          id: 'opt-2-c',
          text: 'For example, volunteering is generally considered very noble by many communities.',
          isCorrect: false,
          feedback: 'This is an abstract opinion about volunteering, not an illustrative example of tutoring math.'
        }
      ],
      hints: [
        'Hint 1: A concrete example shows who, what, and how rather than giving vague praises.',
        'Hint 2: Look for specific details (like grades, subjects, or actions) that illustrate the tutor learning while teaching.'
      ],
      reasoningExplanation: 'Concrete examples use real-world specifics. Option B shows a 10th-grader tutoring fractions, illustrating exactly how the tutor reinforces their own grasp of basic mathematical principles.'
    },
    {
      id: 'gp-3',
      title: 'Exercise 3: Choosing a Meaningful Connection',
      scenarioOrContext: 'Opinion: "Digital flashcard apps are an effective study tool for learning vocabulary."',
      targetConcept: 'connection',
      question: 'Which pair of sentences demonstrates a natural, logical connection between the claim and the supporting detail?',
      options: [
        {
          id: 'opt-3-a',
          text: 'Digital flashcards help students memorize terms quickly. However, they are made with plastic screen protectors.',
          isCorrect: false,
          feedback: '"However" implies a contradiction, but the screen protector comment is an irrelevant technical detail.'
        },
        {
          id: 'opt-3-b',
          text: 'Digital flashcards help students memorize terms quickly. Because learners can review five cards during short bus rides, they build regular daily repetition without needing long study blocks.',
          isCorrect: true,
          feedback: 'Correct! The second sentence explains how the quick memorization happens in real life (daily micro-sessions).'
        },
        {
          id: 'opt-3-c',
          text: 'Digital flashcards help students memorize terms quickly. In conclusion, the weather is very pleasant today.',
          isCorrect: false,
          feedback: 'The second sentence has no connection to vocabulary learning or digital flashcards.'
        }
      ],
      hints: [
        'Hint 1: Sentence 1 claims flashcards help memorize words quickly. Sentence 2 should explain or show how this happens.',
        'Hint 2: Avoid connectors like "However" or "Nevertheless" when the second sentence agrees with and supports the first sentence.'
      ],
      reasoningExplanation: 'Connectors must reflect the true relationship between ideas. Option B explains the cause ("Because they are easily accessible...") and gives a realistic example without conflicting transition words.'
    }
  ],

  independentTask: {
    prompt: 'Should students teach one another something they know?',
    instructions: 'Write a short paragraph in your own words. State your opinion, explain a reason, provide a specific example, and connect your thoughts clearly.',
    suggestedLengthNote: 'Suggested length: 60 to 100 words. Take your time to write clearly.',
    selfReviewChecklist: [
      {
        id: 'chk-opinion',
        label: 'Is my opinion clear in the first sentence?',
        description: 'The reader knows right away whether you agree or disagree.'
      },
      {
        id: 'chk-reason',
        label: 'Does my reason directly support my opinion?',
        description: 'You explained why your view makes sense.'
      },
      {
        id: 'chk-example',
        label: 'Does my example illustrate the reason?',
        description: 'You described a concrete situation or experience.'
      },
      {
        id: 'chk-connections',
        label: 'Can a reader follow the connections easily?',
        description: 'Sentences build naturally on each other without confusing jumps.'
      },
      {
        id: 'chk-confusing',
        label: 'Have I checked for any confusing sentences?',
        description: 'You re-read your draft once to ensure the wording is natural.'
      }
    ]
  },

  reflection: {
    prompt: 'What did you make clearer in your writing today?',
    guidance: 'Compare your starting response (if you wrote one) with your final paragraph. Note what you changed, such as adding a specific example, improving a reason, or smoothing a transition.'
  },

  serviceConnection: {
    title: 'Connecting Learning to Service',
    task: 'Think of a topic you recently studied in school or in your volunteer team. How could writing a clear 4-part explanation help another student who feels stuck on that concept?',
    reflectionPrompt: 'Briefly reflect: Where in your school or volunteer work could you share a clear explanation to help someone else learn?'
  }
};

export const REASONS_EXAMPLES_LESSON: EnglishLessonUnit = {
  id: 'reasons-examples-2',
  title: 'Supporting Arguments with Reasons and Concrete Examples',
  subtitle: 'Move from broad claims to persuasive, evidence-based paragraphs.',
  category: 'English Writing Foundations',
  level: 'Intermediate',
  estimatedTime: '25–35 minutes',
  audience: 'Students preparing for academic writing tasks who want to develop strong, concrete supporting evidence.',
  prerequisites: 'Basic knowledge of paragraph structure (topic sentence, reason, example).',
  outcome: 'Construct a paragraph with two complementary reasons backed by concrete real-world evidence.',
  practiceLengthGuideline: 'Suggested length: 80 to 120 words. (SVT practice guideline for focused elaboration).',

  startingTask: {
    prompt: 'Why should schools encourage group problem-solving projects?',
    helpText: 'Write a quick 1 to 2 sentence answer stating a reason and a real-life situation where group work helps.',
    placeholder: 'For example: Group projects help students learn how to communicate different perspectives when tackling complex problems.'
  },

  explanation: {
    coreMessage: 'An argument is only as strong as the evidence supporting it. Weak writing relies on vague generalizations like "everyone knows this is good," whereas strong academic writing provides specific, verifiable illustrations.',
    elements: [
      {
        name: '1. Specific Claim',
        role: 'Focus your argument.',
        description: 'Narrow your focus so your reasons can provide depth rather than superficial coverage.',
        guidingQuestion: 'What precise point am I arguing?'
      },
      {
        name: '2. Complementary Reasons',
        role: 'Provide two facets of support.',
        description: 'Give reasons that reinforce each other (such as personal development + collaborative efficiency).',
        guidingQuestion: 'Why does this benefit both the individual and the group?'
      },
      {
        name: '3. Grounded Evidence',
        role: 'Anchor in reality.',
        description: 'Use a clear case study, academic example, or realistic scenario.',
        guidingQuestion: 'What specific situation proves this is true?'
      },
      {
        name: '4. Concluding Synthesis',
        role: 'Re-center the main idea.',
        description: 'Show how the combined evidence conclusively supports your starting claim.',
        guidingQuestion: 'What general insight can the reader take away?'
      }
    ],
    clarityPrinciple: 'Specificity creates credibility. One detailed, relatable example is far more persuasive than three vague generalities.'
  },

  videoResource: {
    title: 'Giving Reasons & Examples in Academic Writing',
    creator: 'BBC Learning English',
    creatorDescription: 'Public educational broadcaster providing practical guidance on essay and paragraph composition.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/g2bRn1j-1B8',
    sourceUrl: 'https://www.bbc.co.uk/learningenglish',
    durationLabel: '5 min video',
    transcriptSummary: 'This lesson demonstrates how to transition from abstract theories to vivid supporting examples. The instructor shows how phrases like "For instance," "To illustrate," and "A clear demonstration of this is" introduce focused case examples that validate your reasons.',
    keyTakeaways: [
      'Avoid vague phrases like "many things" or "in various ways" — name the exact factors.',
      'Place the example directly after the reason it illustrates.',
      'Explain the significance of the example rather than assuming it speaks for itself.'
    ]
  },

  workedExample: {
    prompt: 'Should public libraries provide free access to computers and the internet?',
    fullParagraph: 'Public libraries should offer free computer and internet access because digital connectivity is essential for equal educational and economic opportunities. For example, high school students from low-income families frequently rely on library workstations to submit homework, complete college applications, and research scholarship criteria. Without this community service, many capable students would face an insurmountable digital divide that hinders their academic progress.',
    parts: [
      {
        label: 'Opinion',
        colorKey: 'emerald',
        text: 'Public libraries should offer free computer and internet access',
        explanation: 'Clearly states the policy or stance being supported.'
      },
      {
        label: 'Reason',
        colorKey: 'blue',
        text: 'because digital connectivity is essential for equal educational and economic opportunities.',
        explanation: 'Provides a strong, principled justification focused on equal opportunity.'
      },
      {
        label: 'Example',
        colorKey: 'amber',
        text: 'For example, high school students from low-income families frequently rely on library workstations to submit homework, complete college applications, and research scholarship criteria.',
        explanation: 'Shows realistic, specific tasks (homework, applications, scholarship searches) carried out at library terminals.'
      },
      {
        label: 'Connection',
        colorKey: 'purple',
        text: 'Without this community service, many capable students would face an insurmountable digital divide that hinders their academic progress.',
        explanation: 'Synthesizes the consequence of lacking access, linking directly back to educational opportunity.'
      }
    ],
    weakerVersion: {
      text: 'Libraries must have computers. Computers are everywhere and everyone likes internet. Also books are old. So we need computers.',
      whyItIsWeaker: [
        'Over-generalized claims ("everyone likes internet").',
        'Unnecessary negative comment about books that weakens the core argument.',
        'No concrete examples of who actually benefits and how.'
      ]
    }
  },

  guidedPractice: [
    {
      id: 'gp-re-1',
      title: 'Exercise 1: Identifying Strong Supporting Detail',
      scenarioOrContext: 'Claim: "Participating in extracurricular sports builds leadership skills."',
      targetConcept: 'reason-example',
      question: 'Which of the following sentences provides the strongest supporting example?',
      options: [
        {
          id: 'opt-re-1-a',
          text: 'For instance, team captains must communicate game strategies clearly under pressure and motivate teammates during difficult matches.',
          isCorrect: true,
          feedback: 'Correct! This specifies a role (captain), real scenarios (under pressure/difficult matches), and concrete actions (communicating strategy, motivating).'
        },
        {
          id: 'opt-re-1-b',
          text: 'For example, sports are played by millions of people across the globe every weekend.',
          isCorrect: false,
          feedback: 'This is a global popularity statistic, not an example of developing leadership skills.'
        },
        {
          id: 'opt-re-1-c',
          text: 'For instance, running shoes are very expensive to purchase in stores.',
          isCorrect: false,
          feedback: 'Equipment costs have no relevance to building leadership skills.'
        }
      ],
      hints: [
        'Hint 1: Look for an action that a leader must perform in a sports setting.',
        'Hint 2: Find the sentence that explains how communication and motivation occur on a team.'
      ],
      reasoningExplanation: 'Effective examples show cause and effect. Option A illustrates the concrete leadership behaviors (communication and encouragement) required in sports.'
    }
  ],

  independentTask: {
    prompt: 'Should secondary schools teach personal financial budgeting to all students?',
    instructions: 'Write a focused paragraph with a clear opinion, a strong reason, a concrete real-world example, and a concluding link.',
    suggestedLengthNote: 'Suggested length: 80 to 120 words.',
    selfReviewChecklist: [
      {
        id: 'chk-re-claim',
        label: 'Is the core claim stated clearly at the start?',
        description: 'The reader understands your stance immediately.'
      },
      {
        id: 'chk-re-reason',
        label: 'Is the reason logical and defensible?',
        description: 'You gave a substantive reason why personal budgeting matters.'
      },
      {
        id: 'chk-re-example',
        label: 'Did you include a concrete, realistic situation?',
        description: 'Your example illustrates real financial decisions (e.g. saving, student loans, budgeting rent).'
      },
      {
        id: 'chk-re-conclusion',
        label: 'Does the concluding sentence synthesize the paragraph?',
        description: 'You tied the example back to long-term financial stability.'
      }
    ]
  },

  reflection: {
    prompt: 'How did adding specific details strengthen your paragraph compared to writing general statements?',
    guidance: 'Reflect on how concrete examples make arguments convincing for the reader.'
  },

  serviceConnection: {
    title: 'Peer Mentorship & Knowledge Sharing',
    task: 'When helping a peer revise an essay, what questions can you ask them to help turn a vague sentence into a clear, concrete example?',
    reflectionPrompt: 'Write 1–2 questions you could ask a peer to help them uncover a stronger supporting example.'
  }
};

export const ENGLISH_WRITING_COURSE_PATHWAY: LearningCoursePathway = {
  id: 'english-writing-foundations',
  title: 'English Writing Foundations',
  category: 'Academic Writing & Language Proficiency',
  type: 'svt-pathway',
  typeLabel: 'SVT Learning Path',
  description: 'A curated sequence of verified educational lessons and companion SVT practice exercises designed to develop paragraph structure, strong reasoning, smooth connections, and self-editing skills.',
  totalLessons: 2,
  estimatedTotalTime: '1–1.5 hours',
  lessons: [
    OPINION_PARAGRAPH_LESSON,
    REASONS_EXAMPLES_LESSON
  ]
};

