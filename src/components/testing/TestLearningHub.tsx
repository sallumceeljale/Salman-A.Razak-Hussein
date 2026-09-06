import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  Bookmark, 
  BookmarkCheck, 
  Building2, 
  Search, 
  Filter, 
  X, 
  Clock, 
  CheckCircle2, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  BookOpen, 
  Map, 
  Link2, 
  UserCheck, 
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { ACADEMIC_TESTS } from '../../data/academicTestingData';
import { TestId, SectionKey, QuestionType } from '../../types/academicTesting';
import { TestOrientationCard } from './TestOrientationCard';
import { TestPracticeView } from './TestPracticeView';
import { TestNavigationSidebar } from './TestNavigationSidebar';
import AdmissionsReferenceModal from './AdmissionsReferenceModal';
import OpinionParagraphLesson from '../learning/OpinionParagraphLesson';
import detLogo from '../../assets/images/det_official_logo_1787830979022.jpg';
import ieltsLogo from '../../assets/images/ielts_official_logo_1786161093593.jpg';

interface TestLearningHubProps {
  initialTest?: TestId;
}

interface SavedItem {
  id: string;
  testId: TestId;
  title: string;
  category: string;
  summary?: string;
  url?: string;
}

export default function TestLearningHub({ initialTest = 'det' }: TestLearningHubProps) {
  // Primary test tab selection: Only one test active at a time
  const [selectedTestId, setSelectedTestId] = useState<TestId>(initialTest);
  
  // Active Section within current test (Default to 'overview')
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');

  // Specific question ID for direct deep linking into SVT Practice
  const [targetPracticeQuestionId, setTargetPracticeQuestionId] = useState<string | undefined>(undefined);

  // Search query & filter for Question Types
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');

  // Preparation Roadmap checklist completion state
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('svt_test_roadmap_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Saved Revision Items
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem('svt_test_saved_revision');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Separated Admissions Reference Modal
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);

  // Dedicated Interactive English Lesson Unit
  const [isViewingOpinionLesson, setIsViewingOpinionLesson] = useState(false);

  // Active test data
  const currentTest = ACADEMIC_TESTS[selectedTestId];

  // Save roadmap progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('svt_test_roadmap_progress', JSON.stringify(roadmapProgress));
    } catch {
      // ignore
    }
  }, [roadmapProgress]);

  // Save revision list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('svt_test_saved_revision', JSON.stringify(savedItems));
    } catch {
      // ignore
    }
  }, [savedItems]);

  const toggleRoadmapTask = (taskId: string) => {
    setRoadmapProgress(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const resetRoadmapProgressForTest = () => {
    if (window.confirm(`Are you sure you want to reset your study checklist progress for ${currentTest.name}?`)) {
      setRoadmapProgress(prev => {
        const next = { ...prev };
        currentTest.roadmap.forEach(phase => {
          phase.tasks.forEach(t => {
            delete next[t.id];
          });
        });
        return next;
      });
    }
  };

  const isItemSaved = (id: string) => savedItems.some(i => i.id === id);

  const toggleSaveItem = (item: SavedItem) => {
    if (isItemSaved(item.id)) {
      setSavedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setSavedItems(prev => [...prev, item]);
    }
  };

  // Filtered Question Types based on search query & skill filter
  const filteredQuestions = useMemo(() => {
    return currentTest.questionTypes.filter(q => {
      const matchesSearch = 
        q.title.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
        q.skillCategory.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
        q.topStrategyTip.toLowerCase().includes(questionSearchQuery.toLowerCase());
      
      const matchesSkill = selectedSkillFilter === 'ALL' || q.skillCategory === selectedSkillFilter;

      return matchesSearch && matchesSkill;
    });
  }, [currentTest, questionSearchQuery, selectedSkillFilter]);

  // Skill category options for filter
  const skillCategories = useMemo(() => {
    const set = new Set<string>();
    currentTest.questionTypes.forEach(q => set.add(q.skillCategory));
    return Array.from(set);
  }, [currentTest]);

  // Roadmap calculation for current test
  const testRoadmapTaskIds = useMemo(() => {
    const ids: string[] = [];
    currentTest.roadmap.forEach(phase => {
      phase.tasks.forEach(t => ids.push(t.id));
    });
    return ids;
  }, [currentTest]);

  const testCompletedCount = testRoadmapTaskIds.filter(id => !!roadmapProgress[id]).length;
  const testRoadmapPercent = testRoadmapTaskIds.length > 0 
    ? Math.round((testCompletedCount / testRoadmapTaskIds.length) * 100)
    : 0;

  // Handle switching test
  const handleSelectTest = (testId: TestId) => {
    setSelectedTestId(testId);
    setActiveSection('overview');
    setTargetPracticeQuestionId(undefined);
    setQuestionSearchQuery('');
    setSelectedSkillFilter('ALL');
  };

  // Launch specific question in SVT Practice mode
  const handleLaunchPracticeQuestion = (questionId: string) => {
    setTargetPracticeQuestionId(questionId);
    setActiveSection('practice');
  };

  if (isViewingOpinionLesson) {
    return (
      <div id="academic-testing-hub" className="w-full text-left space-y-6">
        <OpinionParagraphLesson onBack={() => setIsViewingOpinionLesson(false)} />
      </div>
    );
  }

  return (
    <div id="academic-testing-hub" className="w-full text-left space-y-6">
      {/* ===================================================================== */}
      {/* 1. TOP HEADER & PRIMARY 3-TEST TABS                                   */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-md text-xs font-semibold tracking-wide border border-teal-200 mb-2 font-sans">
              <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
              <span>Academic Testing & English Proficiency Hub</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight leading-tight">
              Focused test preparation guides
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-sans">
              Structured preparation, test information reviewed against official sources, original SVT practice questions, and independent educator walkthroughs.
            </p>
          </div>

          {/* Quick Utility Actions: Saved List & Admissions Reference */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 font-sans">
            <button
              type="button"
              onClick={() => setIsViewingOpinionLesson(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs min-h-[40px]"
              title="Open full interactive unit: Write a clear opinion paragraph"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Unit: Opinion Writing</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSavedDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold border border-slate-200 transition-colors cursor-pointer shadow-xs min-h-[40px]"
              aria-label={`View ${savedItems.length} saved revision items`}
            >
              <Bookmark className="w-3.5 h-3.5 text-teal-700 fill-current" />
              <span>Saved Items</span>
              <span className="bg-teal-700 text-white text-xs font-bold px-1.5 py-0.2 rounded ml-0.5">
                {savedItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsAdmissionsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs sm:text-sm font-semibold border border-teal-200 transition-colors cursor-pointer shadow-xs min-h-[40px]"
              title="View institutional score benchmarks and approximate concordance tables"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-700" />
              <span>Admissions Benchmarks (Ref)</span>
            </button>
          </div>
        </div>

        {/* Primary 3-Test Switcher Tabs */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 font-sans">
            Select Test to Prepare:
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans" role="tablist" aria-label="Available standardized tests">
            {/* Tab 1: DET */}
            <button
              type="button"
              role="tab"
              aria-selected={selectedTestId === 'det'}
              onClick={() => handleSelectTest('det')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                selectedTestId === 'det'
                  ? 'bg-teal-50/70 border-teal-600 ring-1 ring-teal-600 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border border-slate-200 bg-[#58CC02] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img 
                    src={detLogo} 
                    alt="Duolingo English Test Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 font-sans">
                      Duolingo English Test
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-900">
                      DET
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    Adaptive online English test
                  </p>
                </div>
              </div>
              {selectedTestId === 'det' && (
                <div className="w-2.5 h-2.5 rounded-full bg-teal-700 shrink-0"></div>
              )}
            </button>

            {/* Tab 2: IELTS Academic */}
            <button
              type="button"
              role="tab"
              aria-selected={selectedTestId === 'ielts'}
              onClick={() => handleSelectTest('ielts')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                selectedTestId === 'ielts'
                  ? 'bg-rose-50/70 border-rose-600 ring-1 ring-rose-600 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img 
                    src={ieltsLogo} 
                    alt="IELTS Academic Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 font-sans">
                      IELTS Academic
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-900">
                      Band 1–9
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    Listening, Reading, Writing, Speaking
                  </p>
                </div>
              </div>
              {selectedTestId === 'ielts' && (
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></div>
              )}
            </button>

            {/* Tab 3: Digital SAT */}
            <button
              type="button"
              role="tab"
              aria-selected={selectedTestId === 'sat'}
              onClick={() => handleSelectTest('sat')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                selectedTestId === 'sat'
                  ? 'bg-slate-100 border-[#102A43] ring-1 ring-[#102A43] shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border border-slate-200 bg-[#102A43] text-white p-1 flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                  SAT
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 font-sans">
                      Digital SAT
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-[#102A43]">
                      400–1600
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    Reading & Writing + Math
                  </p>
                </div>
              </div>
              {selectedTestId === 'sat' && (
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. TEST ORIENTATION CARD / STARTING SCREEN                            */}
      {/* ===================================================================== */}
      <TestOrientationCard
        testData={currentTest}
        onNavigateSection={(sec) => {
          setActiveSection(sec);
          if (sec !== 'practice') {
            setTargetPracticeQuestionId(undefined);
          }
        }}
      />

      {/* ===================================================================== */}
      {/* 3. MAIN WORKSPACE: 4-GROUP NAVIGATION + SECTION CONTENT               */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (Desktop: col-span-3, Mobile: full-width selector) */}
        <aside className="lg:col-span-3">
          <TestNavigationSidebar
            currentTest={currentTest}
            activeSection={activeSection}
            onSelectSection={(sec) => {
              setActiveSection(sec);
              if (sec !== 'practice') {
                setTargetPracticeQuestionId(undefined);
              }
            }}
            roadmapPercent={testRoadmapPercent}
          />
        </aside>

        {/* Main Content Area (Desktop: col-span-9) */}
        <main className="lg:col-span-9 space-y-6">
          {/* =============================================================== */}
          {/* GROUP 1: LEARN -> 1.1 TEST OVERVIEW                             */}
          {/* =============================================================== */}
          {activeSection === 'overview' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                      {currentTest.shortCode} Overview
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Administered by {currentTest.administeringBody}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                    {currentTest.name} Structure & Specifications
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {currentTest.tagline}
                  </p>
                </div>
              </div>

              {/* Format Description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-display">
                  Exam Format & Delivery
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {currentTest.overview.formatDescription}
                </p>
              </div>

              {/* 4 Metric Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentTest.overview.keyHighlights.map((hl, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {hl.label}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 mt-1 block leading-snug">
                      {hl.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key Examination Parameters Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                  Key Examination Parameters
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-700">Total Duration:</span>
                    <span className="text-slate-900 font-semibold">{currentTest.overview.totalDuration}</span>
                  </div>
                  <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-700">Scoring Scale:</span>
                    <span className="text-slate-900 font-semibold">{currentTest.overview.scoringScale}</span>
                  </div>
                  <div className="p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-700">Delivery Format:</span>
                    <span className="text-slate-900 font-semibold">{currentTest.overview.deliveryFormat}</span>
                  </div>
                  <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-700">Retake Policy:</span>
                    <span className="text-slate-900 font-semibold">{currentTest.overview.retakePolicy}</span>
                  </div>
                  <div className="p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-700">Score Validity:</span>
                    <span className="text-slate-900 font-semibold">{currentTest.overview.validityPeriod}</span>
                  </div>
                </div>
              </div>

              {/* Admissions Context Note */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950 font-display uppercase tracking-wider">
                    University Admissions Context
                  </h4>
                  <p className="text-xs text-blue-900/90 leading-relaxed mt-0.5">
                    {currentTest.overview.admissionsContext}
                  </p>
                </div>
              </div>

              {/* Independent Preparation Disclaimer */}
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
                <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Independent Preparation Hub:</strong> SVT is an independent student-led nonprofit organization. External educators and resources are shared as optional learning materials and are not partners or official test providers. {currentTest.name} is the property of {currentTest.administeringBody}.
                </p>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 1: LEARN -> 1.2 SKILLS TESTED                             */}
          {/* =============================================================== */}
          {activeSection === 'skills' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                    {currentTest.shortCode} Competencies
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  Core Skills Evaluated on {currentTest.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Detailed breakdown of evaluated language and quantitative competencies across official scoring domains.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTest.skills.map((skill) => (
                  <div 
                    key={skill.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {skill.subscoreName}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 font-display mt-0.5">
                            {skill.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                          {skill.weightOrScale}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {skill.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          Key Competencies:
                        </span>
                        {skill.keyCompetencies.map((comp, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSkillFilter(skill.name);
                        setActiveSection('questions');
                      }}
                      className="mt-4 pt-2 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer min-h-[36px]"
                    >
                      <span>View relevant question types</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 2: PRACTISE -> 2.1 QUESTION & TASK TYPES                  */}
          {/* =============================================================== */}
          {activeSection === 'questions' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                      Question Catalogue
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {currentTest.questionTypes.length} Core Question Formats
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                    {currentTest.name} Task Types & SVT Original Practice
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Examine each question format with original SVT practice items and model walkthroughs.
                  </p>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search question types, skills, or instructions..."
                    value={questionSearchQuery}
                    onChange={(e) => setQuestionSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]"
                    aria-label="Search question types"
                  />
                  {questionSearchQuery && (
                    <button
                      onClick={() => setQuestionSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {skillCategories.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={selectedSkillFilter}
                      onChange={(e) => setSelectedSkillFilter(e.target.value)}
                      className="px-3 py-2 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 cursor-pointer min-h-[40px]"
                      aria-label="Filter by skill domain"
                    >
                      <option value="ALL">All Skill Domains</option>
                      {skillCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Question Type Cards with Progressive Disclosure */}
              <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
                    <p className="font-semibold text-slate-700">No question types matched your search criteria.</p>
                    <button
                      type="button"
                      onClick={() => { setQuestionSearchQuery(''); setSelectedSkillFilter('ALL'); }}
                      className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer min-h-[36px]"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredQuestions.map((q) => {
                    const saveId = `q-${currentTest.id}-${q.id}`;
                    const isSaved = isItemSaved(saveId);

                    return (
                      <div
                        key={q.id}
                        className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {q.skillCategory}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                Format: {q.format}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{q.timeLimit}</span>
                              </span>
                              {q.difficulty && (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  q.difficulty === 'Challenging'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {q.difficulty}
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-black text-slate-900 font-display">
                              {q.title}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSaveItem({
                              id: saveId,
                              testId: currentTest.id,
                              title: `[${currentTest.shortCode}] ${q.title}`,
                              category: `Question Type (${q.skillCategory})`,
                              summary: q.topStrategyTip
                            })}
                            className="text-slate-400 hover:text-amber-500 p-1.5 self-start cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Save for revision"
                            aria-label="Save question type for revision"
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-current" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {q.description}
                        </p>

                        {/* Strategy Tip Box (Neutral slate styling) */}
                        <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold block text-[10px] uppercase tracking-wider text-slate-700">
                              Core Strategy Rule:
                            </strong>
                            <p className="mt-0.5 leading-relaxed text-slate-700">{q.topStrategyTip}</p>
                          </div>
                        </div>

                        {/* Direct Practice Launch Action */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-slate-500 italic">
                            Includes SVT-created original practice sample
                          </span>
                          <button
                            type="button"
                            onClick={() => handleLaunchPracticeQuestion(q.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5 min-h-[44px]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Launch in Practice Mode</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 2: PRACTISE -> 2.2 SVT PRACTICE                           */}
          {/* =============================================================== */}
          {activeSection === 'practice' && (
            <TestPracticeView
              testData={currentTest}
              initialQuestionId={targetPracticeQuestionId}
              isItemSaved={isItemSaved}
              onToggleSaveItem={toggleSaveItem}
              onNavigateToQuestionTypes={() => setActiveSection('questions')}
            />
          )}

          {/* =============================================================== */}
          {/* GROUP 2: PRACTISE -> 2.3 PRACTICE STRATEGIES                    */}
          {/* =============================================================== */}
          {activeSection === 'strategies' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                    Practice Strategies
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  Practice Strategies for {currentTest.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Evidence-based approaches for time management, error avoidance, and skill development.
                </p>
              </div>

              <div className="space-y-4">
                {currentTest.strategies.map((strat) => {
                  const saveId = `strat-${currentTest.id}-${strat.id}`;
                  const isSaved = isItemSaved(saveId);

                  return (
                    <div
                      key={strat.id}
                      className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                            {strat.category}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display mt-1">
                            {strat.title}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSaveItem({
                            id: saveId,
                            testId: currentTest.id,
                            title: `[${currentTest.shortCode} Strategy] ${strat.title}`,
                            category: `Strategy (${strat.category})`,
                            summary: strat.ruleSummary
                          })}
                          className="text-slate-400 hover:text-amber-500 p-1.5 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Save strategy to revision list"
                          aria-label="Save strategy to revision list"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-current" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                        "{strat.ruleSummary}"
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {strat.inDepthExplanation}
                      </p>

                      {/* Actionable Step (Neutral slate styling per prompt guidance) */}
                      <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-[10px] uppercase tracking-wider text-slate-700 block">
                            Actionable Step for Practice:
                          </strong>
                          <p className="mt-0.5 leading-relaxed text-slate-700">{strat.actionableStep}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 3: STUDY PLAN -> 3.1 PREPARATION ROADMAP                  */}
          {/* =============================================================== */}
          {activeSection === 'roadmap' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                      {currentTest.shortCode} Roadmap
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                    {currentTest.name} Preparation Timeline & Action Items
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Track your multi-phase preparation from diagnostic baselines to test day readiness.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
                  <span className="text-xl font-black text-blue-600 block leading-tight">
                    {testRoadmapPercent}%
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {testCompletedCount} of {testRoadmapTaskIds.length} Completed
                  </span>
                </div>
              </div>

              {/* Phases */}
              <div className="space-y-4">
                {currentTest.roadmap.map((phase) => (
                  <div
                    key={phase.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center border border-blue-200 shrink-0">
                          {phase.phaseNumber}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                          {phase.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                        {phase.timeframe}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 ml-9">
                      <strong>Focus:</strong> {phase.focus}
                    </p>

                    {/* Action Tasks */}
                    <div className="space-y-2 ml-0 sm:ml-9 pt-2 border-t border-slate-100">
                      {phase.tasks.map((task) => {
                        const isChecked = !!roadmapProgress[task.id];

                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleRoadmapTask(task.id)}
                            className={`flex items-start gap-2.5 p-3 rounded-xl text-xs font-medium cursor-pointer transition-colors min-h-[44px] ${
                              isChecked
                                ? 'bg-emerald-50 text-emerald-900 line-through opacity-80 border border-emerald-200'
                                : 'hover:bg-slate-50 text-slate-700 border border-slate-100'
                            }`}
                          >
                            <button 
                              type="button" 
                              className="shrink-0 mt-0.5 text-blue-600"
                              aria-label={isChecked ? `Mark ${task.label} incomplete` : `Mark ${task.label} complete`}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <span className="leading-snug">{task.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 3: STUDY PLAN -> 3.2 TRACK PROGRESS                       */}
          {/* =============================================================== */}
          {activeSection === 'progress' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                    Progress Tracker
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  Your {currentTest.name} Study Plan Progress
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Review completed tasks, track preparation milestones, and manage your checklist.
                </p>
              </div>

              {/* Progress Summary Dashboard Card */}
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Overall Completion
                    </span>
                    <div className="text-3xl font-black text-slate-900 font-display mt-0.5">
                      {testRoadmapPercent}%
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                      <span className="text-xs font-bold text-emerald-600 block">{testCompletedCount}</span>
                      <span className="text-[10px] text-slate-500">Completed</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                      <span className="text-xs font-bold text-slate-700 block">{testRoadmapTaskIds.length - testCompletedCount}</span>
                      <span className="text-[10px] text-slate-500">Remaining</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${testRoadmapPercent}%` }}
                    role="progressbar"
                    aria-valuenow={testRoadmapPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-600">
                  <span>Saved locally on your device in your browser.</span>
                  {testCompletedCount > 0 && (
                    <button
                      type="button"
                      onClick={resetRoadmapProgressForTest}
                      className="text-rose-600 hover:text-rose-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset {currentTest.shortCode} Checklist</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Jump Action to Roadmap */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 font-display">
                      Need to update specific roadmap tasks?
                    </h4>
                    <p className="text-xs text-blue-900/80">
                      Open the Preparation Roadmap to toggle checklist items for each phase.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('roadmap')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 min-h-[44px]"
                >
                  Go to Roadmap
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 4: RESOURCES -> 4.1 OFFICIAL RESOURCES                    */}
          {/* =============================================================== */}
          {activeSection === 'official-resources' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${currentTest.badgeBg}`}>
                    Authoritative Sources
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  Official Portals & Test-Maker Resources
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Verified direct links to official portals, testing software downloads, and test guides from {currentTest.administeringBody}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTest.officialResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {res.provider}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {res.type}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        {res.title}
                      </h4>

                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                        {res.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">Official Link</span>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs min-h-[44px]"
                        aria-label={`Visit official resource: ${res.title} (opens in a new tab)`}
                      >
                        <span>Visit Resource</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* GROUP 4: RESOURCES -> 4.2 INDEPENDENT EDUCATOR                  */}
          {/* =============================================================== */}
          {activeSection === 'recommended-educator' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                    Independent Recommended Educator
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  Recommended Learning Channel for {currentTest.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Selected learning resources and video walkthroughs for step-by-step guidance.
                </p>
              </div>

              {currentTest.recommendedEducator ? (
                <div className="space-y-6">
                  {/* Clean Clickable Recommendation Card with YouTube Button */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Approved Channel Image (Un-distorted) */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 p-1 flex items-center justify-center shadow-xs">
                        <img 
                          src={currentTest.recommendedEducator.imageAssetSrc}
                          alt={currentTest.recommendedEducator.imageAlt}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px] font-bold mb-1 border border-slate-300">
                          <UserCheck className="w-3.5 h-3.5 text-slate-700" />
                          <span>Independent educator</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 font-display">
                          {currentTest.recommendedEducator.channelTitle}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 max-w-lg leading-relaxed">
                          {currentTest.recommendedEducator.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Red YouTube Action Button */}
                    <a
                      href={currentTest.recommendedEducator.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer min-h-[44px]"
                      aria-label={`Visit ${currentTest.recommendedEducator.channelTitle} YouTube Channel (opens in a new tab)`}
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span>Visit YouTube Channel</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                    </a>
                  </div>

                  {/* Why Selected & Notable Playlists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
                        Why Selected by the SVT Team
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {currentTest.recommendedEducator.whyRecommended.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
                        Notable Series & Playlists
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {currentTest.recommendedEducator.notablePlaylistsOrSeries.map((playlist, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                            <span className="leading-relaxed">{playlist}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Clear Legal & Partnership Disclaimer */}
                  <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
                    <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Independent Educator Notice:</strong> {currentTest.recommendedEducator.disclaimer}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  No independent educator card listed for this test.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* 4. DRAWER: SAVED REVISION ITEMS                                       */}
      {/* ===================================================================== */}
      {isSavedDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end animate-fadeIn"
          onClick={() => setIsSavedDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-slate-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
                  <h3 className="text-base font-extrabold text-slate-900 font-display">
                    Saved Test Revision List
                  </h3>
                </div>

                <button
                  onClick={() => setIsSavedDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close saved drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {savedItems.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No saved revision items yet.</p>
                  <p className="mt-1 text-slate-400">Click the bookmark icon on any question type, strategy, or practice task to add it to your personal revision deck.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 font-display">
                          {item.title}
                        </h4>
                        {item.summary && (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => toggleSaveItem(item)}
                        className="text-slate-400 hover:text-red-500 p-1.5 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Remove from saved list"
                        aria-label={`Remove ${item.title} from saved list`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {savedItems.length} saved revision items
              </span>
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SEPARATED ADMISSIONS REFERENCE MODAL                               */}
      {/* ===================================================================== */}
      <AdmissionsReferenceModal
        isOpen={isAdmissionsModalOpen}
        onClose={() => setIsAdmissionsModalOpen(false)}
      />
    </div>
  );
}
