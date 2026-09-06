import React, { useState, useEffect } from 'react';
import { 
  Languages, 
  GraduationCap, 
  Code2, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  Compass, 
  ExternalLink, 
  BookOpen, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CsLearningHub from './cs/CsLearningHub';
import UniversityApplicationsHub from './university/UniversityApplicationsHub';
import OpinionParagraphLesson from './learning/OpinionParagraphLesson';
import { CsTrackId } from '../types/csLearning';

export type PathwayId = 'english-test' | 'university-apps' | 'cs-ai' | 'volunteer-leader';

export interface RecommendedResource {
  label: string;
  url?: string;
  isInternal?: boolean;
  internalAction?: string;
  status?: 'active' | 'coming-soon' | 'pilot';
  statusNote?: string;
}

export interface PathwayStep {
  id: number;
  title: string;
  shortDesc: string;
  actionGuidance: string;
  estimatedEffort: string;
  recommendedResource?: RecommendedResource;
}

export interface Pathway {
  id: PathwayId;
  title: string;
  category: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  estimatedTotalTime: string;
  steps: PathwayStep[];
}

const PATHWAYS: Pathway[] = [
  {
    id: 'english-test',
    title: 'Prepare for an English Test',
    category: 'Language & Testing',
    tagline: 'Build test familiarity through diagnostic practice and targeted skill study.',
    icon: Languages,
    description: 'A structured, practical roadmap to prepare for the Duolingo English Test (DET) or IELTS Academic without feeling overwhelmed.',
    estimatedTotalTime: '4–8 weeks (5–8 hrs/week)',
    steps: [
      {
        id: 1,
        title: 'Choose DET or IELTS',
        shortDesc: 'Evaluate university requirements, budget, computer access, and timeline.',
        actionGuidance: 'Check the specific language proficiency requirements of your target universities. Note that the Duolingo English Test is fully online and accessible at home, while IELTS offers both computer-delivered and paper options at test centers.',
        estimatedEffort: '1–2 days',
        recommendedResource: {
          label: 'SVT Target Requirements Reference Table',
          isInternal: true,
          internalAction: '#resources',
          status: 'active'
        }
      },
      {
        id: 2,
        title: 'Understand the Test Format',
        shortDesc: 'Learn the exact section timings, question formats, and scoring rubrics.',
        actionGuidance: 'Review the official test companion or handbook. Understand how subscores (Literacy, Comprehension, Conversation, Production for DET; Listening, Reading, Writing, Speaking for IELTS) are calculated.',
        estimatedEffort: '2–3 days',
        recommendedResource: {
          label: 'Official DET Format & Readiness Guide',
          url: 'https://englishtest.duolingo.com/readiness',
          status: 'active'
        }
      },
      {
        id: 3,
        title: 'Take a Diagnostic Practice Test',
        shortDesc: 'Establish an accurate baseline score under simulated exam conditions.',
        actionGuidance: 'Complete a full, timed diagnostic practice test in a quiet room without notes or interruptions. Record your estimated score range and note which sections felt most challenging.',
        estimatedEffort: '1–2 hours',
        recommendedResource: {
          label: 'Official Duolingo Practice Test Portal',
          url: 'https://englishtest.duolingo.com/practice',
          status: 'active'
        }
      },
      {
        id: 4,
        title: 'Study Each Skill Systematically',
        shortDesc: 'Target weak areas in reading speed, listening comprehension, vocabulary, and writing structure.',
        actionGuidance: 'Dedicate focused blocks to individual skills. For writing and speaking, practice structured templates (claim, evidence, explanation, conclusion). For vocabulary, learn academic words in context rather than memorizing isolated lists.',
        estimatedEffort: '2–4 weeks',
        recommendedResource: {
          label: 'SVT English Foundations Study Notes',
          isInternal: true,
          internalAction: '#resources',
          status: 'active'
        }
      },
      {
        id: 5,
        title: 'Practice Under Strict Time Limits',
        shortDesc: 'Build stamina and speed for fast-paced question prompts and timed writing.',
        actionGuidance: 'Train with a visible timer. Practice speaking for 60–90 seconds spontaneously without long pauses. For writing, aim to draft, write, and review within the allocated limit.',
        estimatedEffort: '1–2 weeks',
        recommendedResource: {
          label: 'Official IELTS Preparation & Sample Questions',
          url: 'https://ielts.org/take-a-test/prepare-for-ielts',
          status: 'active'
        }
      },
      {
        id: 6,
        title: 'Review Mistakes & Refine Weak Spots',
        shortDesc: 'Maintain an error log to analyze why errors happened and how to avoid them.',
        actionGuidance: 'Never just check if an answer is right or wrong. Categorize mistakes: vocabulary gap, misread question, or time pressure. Re-attempt incorrect items after 48 hours.',
        estimatedEffort: 'Ongoing with practice',
        recommendedResource: {
          label: 'SVT Peer Study Circle Guide',
          isInternal: true,
          internalAction: '#projects',
          status: 'active'
        }
      },
      {
        id: 7,
        title: 'Use Official Resources & Final Simulation',
        shortDesc: 'Complete final full-length test simulations and verify technical readiness.',
        actionGuidance: 'Review test day technical requirements (lighting, camera, government ID, microphone). Take your final simulation 3–4 days before the real test and get adequate rest.',
        estimatedEffort: '3–5 days before test',
        recommendedResource: {
          label: 'Official Test Day Checklist',
          url: 'https://englishtest.duolingo.com',
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'university-apps',
    title: 'Prepare for University Applications',
    category: 'Admissions & College Prep',
    tagline: 'Plan university applications step-by-step with clear timelines and structured preparation.',
    icon: GraduationCap,
    description: 'Explore verified, comprehensive admissions roadmaps for 10 premier global destinations (United States, Saudi Arabia, Türkiye, Canada, United Kingdom, Germany, Australia, France, Netherlands, Malaysia) with policy directories, comparison matrices, and local planners.',
    estimatedTotalTime: '3–6 months (3–6 hrs/week)',
    steps: [
      {
        id: 1,
        title: 'Research Universities & Build Your List',
        shortDesc: 'Balance your list with Reach, Target, and Safety colleges based on academic and financial fit.',
        actionGuidance: 'Research university academic programs, campus culture, financial aid and scholarship policies for your student status, and location. Aim for a balanced list of 8–12 institutions across reach, match, and safety categories.',
        estimatedEffort: '2–3 weeks',
        recommendedResource: {
          label: 'Common App College Search / BigFuture',
          url: 'https://www.commonapp.org/explore',
          status: 'active'
        }
      },
      {
        id: 2,
        title: 'Understand Requirements & Testing Policies',
        shortDesc: 'Catalog required transcripts, recommendation letters, test requirements, and financial documents.',
        actionGuidance: 'Create a central master spreadsheet. Track each school’s standardized testing policy (test-optional vs. required), English test minimums, CSS Profile / ISFAA requirements, and school report deadlines.',
        estimatedEffort: '1 week',
        recommendedResource: {
          label: 'SVT Admissions Requirement Checklist',
          isInternal: true,
          internalAction: '#resources',
          status: 'active'
        }
      },
      {
        id: 3,
        title: 'Organize Application Deadlines',
        shortDesc: 'Map Early Decision (ED), Early Action (EA), and Regular Decision (RD) milestones.',
        actionGuidance: 'Mark deadlines clearly on your calendar. Set self-imposed deadlines 10 days ahead of the official dates to prevent technical glitches or server overloads on submission days.',
        estimatedEffort: '2–3 days',
        recommendedResource: {
          label: 'Common App Application Deadlines Guide',
          url: 'https://www.commonapp.org',
          status: 'active'
        }
      },
      {
        id: 4,
        title: 'Prepare Activities List & Honors',
        shortDesc: 'Summarize extracurriculars with concise, high-impact action verbs and quantitative metrics.',
        actionGuidance: 'Draft your top 10 activities (150-character descriptions for Common App). Emphasize leadership, initiative, time commitment, and concrete impact (e.g., "Led 15 student tutors, logging 200+ hours").',
        estimatedEffort: '1–2 weeks',
        recommendedResource: {
          label: 'SVT Volunteer Activity Log (Programs Section)',
          isInternal: true,
          internalAction: '#programs',
          status: 'active'
        }
      },
      {
        id: 5,
        title: 'Draft Authentic Personal Essays',
        shortDesc: 'Brainstorm personal statements and supplemental essays that highlight your values and character.',
        actionGuidance: 'Focus on a personal moment of insight, genuine curiosity, or problem-solving. Write several drafts without editing early. Share drafts with trusted peers or mentors for feedback on clarity and voice.',
        estimatedEffort: '4–6 weeks',
        recommendedResource: {
          label: 'SVT Peer Essay Review (Mentorship Pilot)',
          isInternal: true,
          internalAction: '#programs',
          status: 'pilot',
          statusNote: 'Peer essay review runs as volunteer-led review sessions during application season.'
        }
      },
      {
        id: 6,
        title: 'Request Recommendation Letters',
        shortDesc: 'Ask teachers and counselors at least 4–6 weeks in advance with a helpful brag sheet.',
        actionGuidance: 'Choose teachers who know your academic curiosity, perseverance, and collaboration well. Provide them with a polite summary sheet detailing your goals, class projects, and resume.',
        estimatedEffort: '4–6 weeks before deadlines',
        recommendedResource: {
          label: 'Official Counselor & Recommender Guidelines',
          url: 'https://www.commonapp.org/counselors-and-recommenders',
          status: 'active'
        }
      },
      {
        id: 7,
        title: 'Final Review & Application Submission',
        shortDesc: 'Proofread PDF previews, verify fee waivers or payments, and submit ahead of the deadline.',
        actionGuidance: 'Review the full PDF preview of every application to ensure formatting is clean and no text is cut off. Confirm your counselor and teacher recommendations are submitted in portals.',
        estimatedEffort: '1 week before deadline',
        recommendedResource: {
          label: 'Official Common App Application Portal',
          url: 'https://www.commonapp.org',
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'cs-ai',
    title: 'Start Learning CS & AI',
    category: 'Technology & Programming',
    tagline: 'Build foundational computational thinking and practice programming with responsible AI.',
    icon: Code2,
    description: 'A beginner roadmap covering computing fundamentals, Python programming, web development, and responsible AI literacy.',
    estimatedTotalTime: '8–12 weeks (4–6 hrs/week)',
    steps: [
      {
        id: 1,
        title: 'Understand Computer Fundamentals',
        shortDesc: 'Learn how computers, operating systems, memory, and the internet work under the hood.',
        actionGuidance: 'Explore binary representation, CPU cycles, basic networking (HTTP, DNS), and terminal/command-line basics. Building intuition for how computers execute instructions makes programming much easier.',
        estimatedEffort: '1–2 weeks',
        recommendedResource: {
          label: 'CS50x: Introduction to Computer Science (Lecture 0)',
          url: 'https://cs50.harvard.edu/x/',
          status: 'active'
        }
      },
      {
        id: 2,
        title: 'Master Programming Basics & Logic',
        shortDesc: 'Understand variables, data types, conditional branching, and loops.',
        actionGuidance: 'Practice thinking algorithmically: decomposing big problems into small, logical steps. Write simple pseudocode before typing code into an editor.',
        estimatedEffort: '2 weeks',
        recommendedResource: {
          label: 'freeCodeCamp Beginner Logic & Algorithms',
          url: 'https://www.freecodecamp.org',
          status: 'active'
        }
      },
      {
        id: 3,
        title: 'Learn Python for Rapid Problem Solving',
        shortDesc: 'Write clean Python code using functions, lists, dictionaries, and file handling.',
        actionGuidance: 'Install Python or use an online playground. Practice fundamental data structures (lists, dicts, sets, tuples). Write clean, readable code with descriptive variable names.',
        estimatedEffort: '2–3 weeks',
        recommendedResource: {
          label: 'Official Python Beginner’s Guide',
          url: 'https://www.python.org/about/gettingstarted/',
          status: 'active'
        }
      },
      {
        id: 4,
        title: 'Build Small, Useful Projects',
        shortDesc: 'Apply your knowledge by building interactive calculators, flashcard tools, or task scripts.',
        actionGuidance: 'Do not stay stuck in tutorial loops. Build something practical: a command-line student grade tracker, a vocabulary flashcard quizzer, or a study timer script.',
        estimatedEffort: '2 weeks',
        recommendedResource: {
          label: 'GitHub Student Starter Projects',
          url: 'https://github.com',
          status: 'active'
        }
      },
      {
        id: 5,
        title: 'Learn & Practice Responsible AI Use',
        shortDesc: 'Understand modern LLMs, prompt crafting, data privacy, and ethical considerations.',
        actionGuidance: 'Use AI as an active coding tutor rather than an answer generator. Ask AI: "Explain why this logic failed" or "Show me 2 alternative ways to structure this function." Never feed private credentials or sensitive personal information into AI models.',
        estimatedEffort: '1–2 weeks',
        recommendedResource: {
          label: 'Google AI Education & Elements of AI',
          url: 'https://ai.google/education/',
          status: 'active'
        }
      },
      {
        id: 6,
        title: 'Develop a Clean Project Portfolio',
        shortDesc: 'Document your code with GitHub repositories and clear README documentation.',
        actionGuidance: 'Create a GitHub account. For every project, write a clear README explaining: what the project does, how to run it locally, and what you learned while building it.',
        estimatedEffort: '1–2 weeks',
        recommendedResource: {
          label: 'GitHub Student Developer Pack',
          url: 'https://education.github.com/pack',
          status: 'active'
        }
      },
      {
        id: 7,
        title: 'Define Your Next Learning Path',
        shortDesc: 'Choose a specialized track: Web Development, Data Science, or Software Engineering.',
        actionGuidance: 'Reflect on what you enjoyed most. Explore web development (TypeScript & React), data science (Pandas & Jupyter), or systems programming. Continue practicing regularly.',
        estimatedEffort: 'Ongoing',
        recommendedResource: {
          label: 'roadmap.sh Developer Roadmaps',
          url: 'https://roadmap.sh',
          status: 'active'
        }
      }
    ]
  },
  {
    id: 'volunteer-leader',
    title: 'Become a Student Volunteer Leader',
    category: 'Leadership & Community',
    tagline: 'Organize student-led academic and community volunteer initiatives with clarity.',
    icon: HeartHandshake,
    description: 'SVT’s guide for planning, organizing, and sustaining student-led volunteer circles and peer mentorship projects.',
    estimatedTotalTime: '4–8 weeks (2–4 hrs/week)',
    steps: [
      {
        id: 1,
        title: 'Identify an Authentic Student Need',
        shortDesc: 'Listen to peers to find real challenges in study resources, exam prep, or peer tutoring.',
        actionGuidance: 'Talk with classmates and peers. Is there a shortage of accessible math worksheets? Do younger students need guidance with high school transition? Define the core problem concisely.',
        estimatedEffort: '1 week',
        recommendedResource: {
          label: 'SVT Core Purpose & Values',
          isInternal: true,
          internalAction: '#about',
          status: 'active'
        }
      },
      {
        id: 2,
        title: 'Plan a Simple, Focused Project',
        shortDesc: 'Keep scope manageable: define clear goals, deliverables, and a timeline ("Clarity is King").',
        actionGuidance: 'Start small. A 4-week peer study group or a 10-page digital revision booklet is much more effective than an over-ambitious initiative that loses momentum. Write a 1-page project brief.',
        estimatedEffort: '3–5 days',
        recommendedResource: {
          label: 'SVT Project Planning Framework',
          isInternal: true,
          internalAction: '#projects',
          status: 'active'
        }
      },
      {
        id: 3,
        title: 'Build a Small, Dedicated Team',
        shortDesc: 'Recruit 2–4 motivated volunteers with complementary strengths and reliable communication.',
        actionGuidance: 'Look for reliability and enthusiasm. Host a 20-minute kickoff meeting to establish shared expectations, communication channels, and meeting cadences.',
        estimatedEffort: '1 week',
        recommendedResource: {
          label: 'SVT Team Roster & Circle Guidelines',
          isInternal: true,
          internalAction: '#programs',
          status: 'active'
        }
      },
      {
        id: 4,
        title: 'Assign Clear Responsibilities & Roles',
        shortDesc: 'Give every volunteer a defined ownership area with actionable milestones.',
        actionGuidance: 'Ensure every team member knows exactly what they are responsible for delivering each week. Use transparent checklists to keep everyone synchronized without micromanagement.',
        estimatedEffort: '2–3 days',
        recommendedResource: {
          label: 'SVT Member Task Guidelines',
          isInternal: true,
          internalAction: '#programs',
          status: 'active'
        }
      },
      {
        id: 5,
        title: 'Deliver the Project with High Standards',
        shortDesc: 'Execute your plan, support team members, and ensure high-quality, friendly delivery.',
        actionGuidance: 'Focus on quality and warmth. Be supportive when team members face academic crunch times. Deliver on promises made to participants.',
        estimatedEffort: '2–4 weeks',
        recommendedResource: {
          label: 'SVT Volunteer Opportunities',
          isInternal: true,
          internalAction: '#programs',
          status: 'active'
        }
      },
      {
        id: 6,
        title: 'Measure Results & Collect Feedback',
        shortDesc: 'Gather participant feedback and quantify hours, attendees, or resources shared.',
        actionGuidance: 'Send a quick 3-question feedback form: What worked best? What could be improved? How did this help your studies? Log verified service hours accurately.',
        estimatedEffort: '3–5 days',
        recommendedResource: {
          label: 'SVT Service Hours Tracking Guide',
          isInternal: true,
          internalAction: '#programs',
          status: 'active'
        }
      },
      {
        id: 7,
        title: 'Reflect, Share Learnings & Improve',
        shortDesc: 'Celebrate team contributions, document lessons learned, and plan next iterations.',
        actionGuidance: 'Acknowledge every contributor publicly. Write a brief post-project summary highlighting what went well and what you would do differently next time.',
        estimatedEffort: '1 week',
        recommendedResource: {
          label: 'SVT Community Announcements',
          isInternal: true,
          internalAction: '#programs',
          status: 'active'
        }
      }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'svt_student_pathways_progress_v1';

interface StoredProgress {
  [pathwayId: string]: {
    completedSteps: number[];
    lastUpdated: string;
  };
}

interface StudentLearningPathwaysProps {
  onNavigateToDashboard?: () => void;
  isDashboardView?: boolean;
}

export default function StudentLearningPathways({
  onNavigateToDashboard,
  isDashboardView = false
}: StudentLearningPathwaysProps) {
  const [selectedPathwayId, setSelectedPathwayId] = useState<PathwayId>('english-test');
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null);
  const [csViewMode, setCsViewMode] = useState<'steps' | 'hub'>('steps');
  const [englishViewMode, setEnglishViewMode] = useState<'steps' | 'lesson'>('steps');
  const [activeCsTrackId, setActiveCsTrackId] = useState<CsTrackId>('computer-fundamentals');
  const [progressMap, setProgressMap] = useState<StoredProgress>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Load progress locally on mount without collecting any private information
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          setProgressMap(parsed);
        }
      }
    } catch (err) {
      console.warn('Could not read saved pathway progress from localStorage:', err);
    }
  }, []);

  // Save non-sensitive progress to localStorage
  const saveProgress = (newProgress: StoredProgress) => {
    setProgressMap(newProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (err) {
      console.warn('Could not save pathway progress to localStorage:', err);
    }
  };

  const currentPathway = PATHWAYS.find(p => p.id === selectedPathwayId) || PATHWAYS[0];
  const pathwayProgress = progressMap[selectedPathwayId] || { completedSteps: [], lastUpdated: '' };
  const completedSteps = pathwayProgress.completedSteps || [];
  const totalSteps = currentPathway.steps.length;
  const progressPercent = Math.round((completedSteps.length / totalSteps) * 100);

  // Determine current active step: the first incomplete step, or step 1
  const firstIncompleteStep = currentPathway.steps.find(s => !completedSteps.includes(s.id));
  const currentStepNumber = firstIncompleteStep ? firstIncompleteStep.id : 1;
  const isAllCompleted = completedSteps.length === totalSteps && totalSteps > 0;

  // Initialize or synchronize expanded step when pathway changes
  useEffect(() => {
    if (firstIncompleteStep) {
      setExpandedStepId(firstIncompleteStep.id);
    } else {
      setExpandedStepId(1);
    }
    // Dismiss notice when switching pathway
    setInfoNotice(null);
  }, [selectedPathwayId]);

  const toggleStep = (stepId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const isCompleted = completedSteps.includes(stepId);
    let newCompleted: number[];
    if (isCompleted) {
      newCompleted = completedSteps.filter(id => id !== stepId);
    } else {
      newCompleted = [...completedSteps, stepId].sort((a, b) => a - b);
    }

    const updated: StoredProgress = {
      ...progressMap,
      [selectedPathwayId]: {
        completedSteps: newCompleted,
        lastUpdated: new Date().toISOString()
      }
    };
    saveProgress(updated);
  };

  const handleResetProgress = () => {
    const updated: StoredProgress = {
      ...progressMap,
      [selectedPathwayId]: {
        completedSteps: [],
        lastUpdated: new Date().toISOString()
      }
    };
    saveProgress(updated);
    setShowResetConfirm(false);
    setExpandedStepId(1);
  };

  const handleSelectPathway = (pathwayId: PathwayId) => {
    setSelectedPathwayId(pathwayId);
    setTimeout(() => {
      const el = document.getElementById(`pathway-panel-${pathwayId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, currentId: PathwayId) => {
    const currentIndex = PATHWAYS.findIndex(p => p.id === currentId);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % PATHWAYS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + PATHWAYS.length) % PATHWAYS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = PATHWAYS.length - 1;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectPathway(currentId);
      return;
    } else {
      return;
    }

    const nextPathway = PATHWAYS[nextIndex];
    setSelectedPathwayId(nextPathway.id);
    const tabEl = document.getElementById(`pathway-tab-${nextPathway.id}`);
    if (tabEl) {
      tabEl.focus();
    }
  };

  const handleToggleAccordion = (stepId: number) => {
    setExpandedStepId(prev => (prev === stepId ? null : stepId));
  };

  const handlePreviousStep = (currentId: number) => {
    if (currentId > 1) {
      setExpandedStepId(currentId - 1);
      const stepEl = document.getElementById(`step-item-${currentId - 1}`);
      if (stepEl) {
        stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleNextStep = (currentId: number) => {
    if (currentId < totalSteps) {
      setExpandedStepId(currentId + 1);
      const stepEl = document.getElementById(`step-item-${currentId + 1}`);
      if (stepEl) {
        stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleResourceClick = (resource: RecommendedResource) => {
    if (!resource) return;

    if (resource.status === 'coming-soon') {
      setInfoNotice(resource.statusNote || 'This feature is currently in planning for future terms.');
      return;
    }

    if (resource.isInternal && resource.internalAction) {
      if (resource.internalAction.startsWith('#')) {
        const targetId = resource.internalAction.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } else if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Step that is currently active or recommended next
  const activeSummaryStep = firstIncompleteStep || currentPathway.steps[currentPathway.steps.length - 1];

  return (
    <section 
      id="pathways" 
      className={`scroll-mt-24 text-left font-sans ${
        isDashboardView 
          ? 'py-2' 
          : 'py-14 sm:py-18 bg-slate-50 border-t border-slate-200 text-slate-900'
      }`}
      aria-label="Student Learning Pathways"
    >
      <div className={`${isDashboardView ? 'w-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-md text-xs font-semibold border border-teal-200">
              <Compass className="w-4 h-4 text-teal-700" />
              <span>SVT Principle: Clarity is King</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 leading-tight">
              Student Learning Pathways
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-600">
              Choose your goal and follow a structured, step-by-step roadmap. Track your progress with private, offline-first local saving.
            </p>
          </div>

          {/* Privacy Note Badge */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs text-xs shrink-0 md:max-w-xs">
            <div className="flex items-center gap-2 font-bold mb-1 text-teal-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
              <span>No account needed</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Your progress is saved in this browser. It won’t automatically appear on another device, and clearing browser data may remove it.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4 EQUAL-HEIGHT PATHWAY CARDS GRID (NO TRUNCATED SENTENCES) */}
        {/* ------------------------------------------------------------- */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 items-stretch"
          role="tablist"
          aria-label="Available Student Pathways"
        >
          {PATHWAYS.map((pathway) => {
            const Icon = pathway.icon;
            const isSelected = pathway.id === selectedPathwayId;
            const pSteps = progressMap[pathway.id]?.completedSteps || [];
            const pPercent = Math.round((pSteps.length / pathway.steps.length) * 100);
            const isStarted = pSteps.length > 0;

            return (
              <div
                key={pathway.id}
                id={`pathway-tab-${pathway.id}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`pathway-panel-${pathway.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectPathway(pathway.id)}
                onKeyDown={(e) => handleTabKeyDown(e, pathway.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                  isSelected
                    ? 'bg-white border-teal-700 shadow-sm ring-1 ring-teal-700/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Top: Icon, Category, Title & Complete Description */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-teal-50 text-teal-800 border-teal-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isStarted ? (
                      <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-teal-700" />
                        <span>{pPercent}% Done</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md border bg-slate-50 text-slate-600 border-slate-200">
                        {pathway.steps.length} Steps
                      </span>
                    )}
                  </div>

                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${
                      isSelected ? 'text-teal-800' : 'text-slate-500'
                    }`}>
                      {pathway.category}
                    </span>
                    <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                      {pathway.title}
                    </h3>
                  </div>

                  {/* Full complete short description - no ellipses or cutoffs */}
                  <p className="text-sm leading-relaxed text-slate-600 flex-1">
                    {pathway.description}
                  </p>
                </div>

                {/* Bottom: Progress bar & selection trigger */}
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {pSteps.length} of {pathway.steps.length} steps completed
                    </span>
                    <span className={`font-bold ${isStarted ? 'text-teal-800' : 'text-slate-600'}`}>
                      {pPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        pPercent === 100 ? 'bg-teal-700' : 'bg-teal-600'
                      }`}
                      style={{ width: `${pPercent}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPathway(pathway.id);
                    }}
                    className={`w-full min-h-[42px] px-3 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                      isSelected
                        ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{isSelected ? 'Viewing Roadmap' : (isStarted ? 'Continue Pathway' : 'Select Pathway')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACTIVE ROADMAP DETAILS VIEW */}
        {/* ------------------------------------------------------------- */}
        <div 
          id={`pathway-panel-${selectedPathwayId}`}
          role="tabpanel"
          aria-labelledby={`pathway-tab-${selectedPathwayId}`}
          tabIndex={0}
          className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 lg:p-8 shadow-xs text-slate-900 transition-all scroll-mt-28 outline-none"
        >
          {/* Subview switcher specifically for English Language & Testing */}
          {selectedPathwayId === 'english-test' && (
            <div className="mb-6 pb-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                  English Language & Testing
                </span>
                <div className="text-sm font-semibold text-slate-900">
                  Choose between the 7-step roadmap checklist or the interactive writing unit
                </div>
              </div>

              <div className="p-1 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-1 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setEnglishViewMode('steps')}
                  className={`flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    englishViewMode === 'steps'
                      ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>7-Step Roadmap Checklist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEnglishViewMode('lesson')}
                  className={`flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    englishViewMode === 'lesson'
                      ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Interactive Unit: Opinion Paragraph</span>
                </button>
              </div>
            </div>
          )}

          {/* Subview switcher specifically for CS & AI */}
          {selectedPathwayId === 'cs-ai' && (
            <div className="mb-6 pb-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                  CS & AI Learning Experience
                </span>
                <div className="text-sm font-semibold text-slate-900">
                  Choose between the 7-step roadmap checklist or the 5-track interactive curriculum
                </div>
              </div>

              <div className="p-1 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-1 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCsViewMode('steps')}
                  className={`flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    csViewMode === 'steps'
                      ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>7-Step Roadmap Checklist</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCsViewMode('hub')}
                  className={`flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    csViewMode === 'hub'
                      ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>5-Track Learning Hub</span>
                </button>
              </div>
            </div>
          )}

          {/* Info Notice Toast/Banner if triggered */}
          {infoNotice && (
            <div className="mb-6 p-4 rounded-lg border border-teal-200 bg-teal-50 text-slate-900 flex items-start justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{infoNotice}</p>
              </div>
              <button
                type="button"
                onClick={() => setInfoNotice(null)}
                className="text-teal-800 hover:text-teal-950 font-semibold shrink-0 cursor-pointer text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* If University Applications pathway is selected, render UniversityApplicationsHub */}
          {selectedPathwayId === 'university-apps' ? (
            <UniversityApplicationsHub 
              onNavigateToSection={(sec) => {
                const el = document.getElementById(sec);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />
          ) : selectedPathwayId === 'english-test' && englishViewMode === 'lesson' ? (
            <OpinionParagraphLesson 
              onBack={() => setEnglishViewMode('steps')} 
            />
          ) : selectedPathwayId === 'cs-ai' && csViewMode === 'hub' ? (
            <CsLearningHub 
              initialTrack={activeCsTrackId}
              onBackToOverview={() => setCsViewMode('steps')}
              isDashboardView={isDashboardView}
            />
          ) : (
            <>
              {/* Header Bar of Active Roadmap */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      Selected Roadmap
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Est. Timeline: {currentPathway.estimatedTotalTime}</span>
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {currentPathway.title}
                  </h3>
                  <p className="text-sm sm:text-base max-w-2xl leading-relaxed text-slate-600">
                    {currentPathway.description}
                  </p>
                </div>

                {/* Reset Control */}
                {completedSteps.length > 0 && (
                  <div className="shrink-0">
                    {showResetConfirm ? (
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-red-200 bg-red-50 text-xs">
                        <span className="text-[11px] text-red-700 px-1 font-semibold">Reset progress?</span>
                        <button
                          type="button"
                          onClick={handleResetProgress}
                          className="min-h-[36px] px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold cursor-pointer transition-colors"
                        >
                          Yes, Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResetConfirm(false)}
                          className="min-h-[36px] px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        className="min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Reset progress for this roadmap"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Progress</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* COMPACT ROADMAP SUMMARY (Key Requirement 4) */}
              {/* ------------------------------------------------------------- */}
              <div className="my-6 p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Roadmap Summary & Next Action
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                    {completedSteps.length} of {totalSteps} Completed ({progressPercent}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                  {/* Item 1: Current Step */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Current Step
                    </span>
                    <div className="font-semibold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      {isAllCompleted ? (
                        <span className="text-teal-800 flex items-center gap-1">
                          <Check className="w-4 h-4 text-teal-700" />
                          <span>All 7 Steps Completed</span>
                        </span>
                      ) : (
                        <span>Step {activeSummaryStep.id}: {activeSummaryStep.title}</span>
                      )}
                    </div>
                  </div>

                  {/* Item 2: Effort & Timeline */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Estimated Effort
                    </span>
                    <div className="font-semibold text-slate-900 text-sm sm:text-base flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {isAllCompleted ? 'Pathway Complete' : `Active Step: ${activeSummaryStep.estimatedEffort}`}
                      </span>
                    </div>
                  </div>

                  {/* Item 3: Progress Bar */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold uppercase tracking-wider text-slate-500 text-xs">
                        Overall Progress
                      </span>
                      <span className="font-bold text-teal-800">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          progressPercent === 100 ? 'bg-teal-700' : 'bg-teal-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Next Recommended Action Banner */}
                {!isAllCompleted && firstIncompleteStep && (
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                        Recommended Next Action:
                      </span>
                      <p className="text-sm font-medium text-slate-800 leading-snug">
                        {firstIncompleteStep.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setExpandedStepId(firstIncompleteStep.id)}
                        className="flex-1 sm:flex-initial min-h-[40px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Open Step {firstIncompleteStep.id}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => toggleStep(firstIncompleteStep.id, e)}
                        className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* COLLAPSIBLE STEP ACCORDIONS (Requirements 5, 6, 7, 8, 9, 15) */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Roadmap Steps ({currentPathway.steps.length} Steps)
                  </h4>
                  <span className="text-xs sm:text-sm text-slate-500">
                    Click any step to expand or collapse details
                  </span>
                </div>

                <div className="space-y-3" role="region" aria-label="Roadmap Step Accordions">
                  {currentPathway.steps.map((step) => {
                    const isDone = completedSteps.includes(step.id);
                    const isExpanded = expandedStepId === step.id;

                    // Mapping for CS & AI specific steps to jump to tracks
                    const getCsTrackForStep = (stepId: number): { trackId: CsTrackId; label: string } | null => {
                      if (selectedPathwayId !== 'cs-ai') return null;
                      switch (stepId) {
                        case 1: return { trackId: 'computer-fundamentals', label: 'Open Track 1: Computer Fundamentals' };
                        case 2: return { trackId: 'programming-problem-solving', label: 'Open Track 2: Programming & Logic' };
                        case 3: return { trackId: 'python-foundations', label: 'Open Track 3: Python Foundations' };
                        case 4: return { trackId: 'python-foundations', label: 'Try Original Projects Sandbox' };
                        case 5: return { trackId: 'ai-literacy-responsible-use', label: 'Open Track 5: AI Literacy & Rules' };
                        case 6: return { trackId: 'web-development', label: 'Open Track 4: Web Development' };
                        case 7: return { trackId: 'ai-literacy-responsible-use', label: 'Explore Advanced AI & Systems' };
                        default: return null;
                      }
                    };

                    const csTrackTarget = getCsTrackForStep(step.id);

                    return (
                      <div
                        key={step.id}
                        id={`step-item-${step.id}`}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          isDone
                            ? 'bg-teal-50/40 border-teal-200'
                            : isExpanded
                              ? 'bg-white border-teal-700 shadow-xs ring-1 ring-teal-700/20'
                              : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {/* ----------------- Accordion Header ----------------- */}
                        <div
                          role="button"
                          id={`step-header-${step.id}`}
                          aria-expanded={isExpanded}
                          aria-controls={`step-content-${step.id}`}
                          tabIndex={0}
                          onClick={() => handleToggleAccordion(step.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleToggleAccordion(step.id);
                            }
                          }}
                          className="p-4 sm:p-4.5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 select-none"
                        >
                          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                            {/* Checkbox / Step Number Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleStep(step.id, e)}
                              aria-label={`Mark step ${step.id}: ${step.title} as ${isDone ? 'incomplete' : 'complete'}`}
                              className="min-w-[44px] min-h-[44px] -m-2 p-2 flex items-center justify-center rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 shrink-0"
                            >
                              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-teal-700 border-teal-700 text-white shadow-xs'
                                  : isExpanded
                                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                                    : 'bg-white border-slate-300 text-slate-600 hover:border-teal-700'
                              }`}>
                                {isDone ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <span className="text-xs font-mono font-bold">{step.id}</span>
                                )}
                              </div>
                            </button>

                            {/* Title & metadata */}
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${
                                  isDone
                                    ? 'bg-teal-100 text-teal-800 border-teal-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                  Step {step.id} of {totalSteps}
                                </span>
                                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>Effort: {step.estimatedEffort}</span>
                                </span>
                              </div>

                              <h5 className={`text-base sm:text-lg font-semibold truncate ${
                                isDone ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}>
                                {step.title}
                              </h5>
                            </div>
                          </div>

                          {/* Right Controls: Mark Done Badge & Chevron */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => toggleStep(step.id, e)}
                              className={`min-h-[38px] hidden md:flex items-center gap-1 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
                                isDone
                                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isDone ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-teal-700" />
                                  <span>Done</span>
                                </>
                              ) : (
                                <span>Mark Done</span>
                              )}
                            </button>

                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                              aria-hidden="true"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-teal-700" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ----------------- Accordion Body (Expanded) ----------------- */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              id={`step-content-${step.id}`}
                              role="region"
                              aria-labelledby={`step-header-${step.id}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-slate-200/80 px-4 sm:px-6 py-4 space-y-4 bg-white"
                            >
                              {/* Step Action Guidance */}
                              <div className="space-y-1.5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                                  Action Guidance
                                </span>
                                <p className="text-sm leading-relaxed text-slate-700">
                                  {step.actionGuidance}
                                </p>
                              </div>

                              {/* Recommended Resource Section & CS Links */}
                              {step.recommendedResource && (
                                <div className="pt-1 flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-semibold text-slate-500 mr-1">
                                    Resource:
                                  </span>

                                  {step.recommendedResource.status === 'coming-soon' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed">
                                      <BookOpen className="w-3.5 h-3.5" />
                                      <span>{step.recommendedResource.label}</span>
                                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded ml-1">
                                        Coming Soon
                                      </span>
                                    </span>
                                  ) : step.recommendedResource.status === 'pilot' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleResourceClick(step.recommendedResource!)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors cursor-pointer"
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                                      <span>{step.recommendedResource.label}</span>
                                      <span className="text-[10px] font-bold bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded ml-1">
                                        Pilot
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleResourceClick(step.recommendedResource!)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors cursor-pointer"
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                                      <span>{step.recommendedResource.label}</span>
                                      {step.recommendedResource.url && (
                                        <ExternalLink className="w-3 h-3 opacity-70" />
                                      )}
                                    </button>
                                  )}

                                  {csTrackTarget && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveCsTrackId(csTrackTarget.trackId);
                                        setCsViewMode('hub');
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border border-teal-200 bg-white hover:bg-teal-50 text-teal-800 transition-colors cursor-pointer"
                                    >
                                      <ArrowRight className="w-3.5 h-3.5 text-teal-700" />
                                      <span>{csTrackTarget.label}</span>
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Bottom Navigation & Action Bar (Requirements 8, 9, 14) */}
                              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                {/* Previous Step Button */}
                                <button
                                  type="button"
                                  disabled={step.id <= 1}
                                  onClick={() => handlePreviousStep(step.id)}
                                  className={`min-h-[42px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                    step.id <= 1
                                      ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                  <span>Previous Step</span>
                                </button>

                                {/* Center: Mark Done Toggle */}
                                <button
                                  type="button"
                                  onClick={(e) => toggleStep(step.id, e)}
                                  className={`min-h-[42px] px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                                    isDone
                                      ? 'bg-teal-700 hover:bg-teal-800 text-white'
                                      : 'bg-teal-700 hover:bg-teal-800 text-white'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isDone ? 'Completed (Click to Undo)' : 'Mark Step as Complete'}</span>
                                </button>

                                {/* Next Step Button */}
                                <button
                                  type="button"
                                  disabled={step.id >= totalSteps}
                                  onClick={() => handleNextStep(step.id)}
                                  className={`min-h-[42px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                    step.id >= totalSteps
                                      ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span>Next Step</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clarity is King Educational Disclaimer */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-start gap-3 text-xs leading-relaxed text-slate-500">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Educational Roadmap Disclaimer:</strong> All roadmaps are curated for peer learning guidance. The Scholars Volunteer Team (SVT) is an independent student volunteer circle. We do not issue official degrees, promise admissions, or guarantee exam scores. All external trademarks (IELTS, DET, SAT, Common App, Python) remain the property of their respective owners.
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
