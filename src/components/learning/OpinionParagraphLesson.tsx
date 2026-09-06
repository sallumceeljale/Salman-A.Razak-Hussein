import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Sparkles, 
  Lightbulb, 
  Video, 
  FileText, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  AlertCircle, 
  HeartHandshake, 
  Layers, 
  Info,
  Edit3,
  CheckSquare,
  Square,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ListOrdered,
  Clock,
  Tv,
  GraduationCap
} from 'lucide-react';
import { 
  OPINION_PARAGRAPH_LESSON, 
  REASONS_EXAMPLES_LESSON,
  ENGLISH_WRITING_COURSE_PATHWAY,
  EnglishLessonUnit,
  AnnotatedParagraphPart 
} from '../../data/englishLearningData';
import { 
  getLessonProgress, 
  saveLessonProgress, 
  resetLessonProgress, 
  LessonProgressData, 
  STORAGE_DISCLOSURE_NOTICE 
} from '../../utils/learningStorage';
import InAppVideoPlayer from './InAppVideoPlayer';

interface OpinionParagraphLessonProps {
  onBack: () => void;
  onNavigateToSection?: (sectionId: string) => void;
  initialLessonId?: string;
}

type LessonStepKey = 'all' | 'start' | 'elements' | 'video' | 'example' | 'practice' | 'independent' | 'reflection';

const STEPS_NAV: { key: LessonStepKey; label: string; number: string }[] = [
  { key: 'all', label: 'Full Lesson Flow', number: 'All' },
  { key: 'video', label: '1. Video & Key Concepts', number: '01' },
  { key: 'start', label: '2. Diagnostic Warm-Up', number: '02' },
  { key: 'elements', label: '3. Four Elements', number: '03' },
  { key: 'example', label: '4. Worked Example', number: '04' },
  { key: 'practice', label: '5. Guided Practice', number: '05' },
  { key: 'independent', label: '6. Independent Task', number: '06' },
  { key: 'reflection', label: '7. Review & Reflect', number: '07' }
];

export default function OpinionParagraphLesson({ 
  onBack, 
  onNavigateToSection,
  initialLessonId 
}: OpinionParagraphLessonProps) {
  const course = ENGLISH_WRITING_COURSE_PATHWAY;

  // Active lesson in the course sequence
  const [activeLessonId, setActiveLessonId] = useState<string>(initialLessonId || course.lessons[0].id);
  const currentLesson: EnglishLessonUnit = useMemo(() => {
    return course.lessons.find(l => l.id === activeLessonId) || course.lessons[0];
  }, [course, activeLessonId]);

  const currentLessonIndex = useMemo(() => {
    return course.lessons.findIndex(l => l.id === currentLesson.id);
  }, [course, currentLesson]);

  // Focus View (Distraction-Free Mode) - separate from video full screen
  const [isFocusView, setIsFocusView] = useState(false);

  // Active step in linear learning progression
  const [activeStep, setActiveStep] = useState<LessonStepKey>('all');

  // Honest learning progress state
  const [progress, setProgress] = useState<LessonProgressData>(() => getLessonProgress(currentLesson.id));

  // Local state for forms and drafts (synced on lesson change)
  const [startingDraft, setStartingDraft] = useState(progress.startingTaskResponse || '');
  const [independentDraft, setIndependentDraft] = useState(progress.independentDraft || '');
  const [reflectionText, setReflectionText] = useState(progress.reflectionResponse || '');
  const [serviceReflectionText, setServiceReflectionText] = useState(progress.serviceReflectionResponse || '');
  const [draftSaveStatus, setDraftSaveStatus] = useState<string | null>(null);

  // Interactive highlight in worked example
  const [selectedHighlightPart, setSelectedHighlightPart] = useState<string | null>('Opinion');

  // Guided practice state per question (tracks hints viewed, selected options, attempt)
  const [practiceActiveHints, setPracticeActiveHints] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    currentLesson.guidedPractice.forEach(q => {
      init[q.id] = progress.practiceStates[q.id]?.hintsViewed || 0;
    });
    return init;
  });

  // Reload progress when active lesson changes
  useEffect(() => {
    const freshProgress = getLessonProgress(currentLesson.id);
    setProgress(freshProgress);
    setStartingDraft(freshProgress.startingTaskResponse || '');
    setIndependentDraft(freshProgress.independentDraft || '');
    setReflectionText(freshProgress.reflectionResponse || '');
    setServiceReflectionText(freshProgress.serviceReflectionResponse || '');
    
    const hintsInit: Record<string, number> = {};
    currentLesson.guidedPractice.forEach(q => {
      hintsInit[q.id] = freshProgress.practiceStates[q.id]?.hintsViewed || 0;
    });
    setPracticeActiveHints(hintsInit);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLesson]);

  // Keyboard shortcut: Escape key exits Focus View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusView) {
        setIsFocusView(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusView]);

  // Sync state to storage whenever progress is modified
  const updateProgress = (updater: (prev: LessonProgressData) => LessonProgressData) => {
    setProgress(prev => {
      const next = updater(prev);
      saveLessonProgress(next);
      return next;
    });
  };

  // Word count helper for independent writing
  const countWords = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  // Lesson switching handlers (Preserves drafts and does not autoplay next lesson)
  const handleSelectLesson = (lessonId: string) => {
    // Save current draft before switching
    if (independentDraft) {
      handleSaveIndependentDraft();
    }
    setActiveLessonId(lessonId);
    setActiveStep('all');
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      handleSelectLesson(course.lessons[currentLessonIndex + 1].id);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      handleSelectLesson(course.lessons[currentLessonIndex - 1].id);
    }
  };

  // Save Starting Task Draft
  const handleSaveStartingTask = () => {
    updateProgress(prev => ({
      ...prev,
      startingTaskResponse: startingDraft,
      skippedStartingTask: false
    }));
    setDraftSaveStatus('Starting task saved in this browser.');
    setTimeout(() => setDraftSaveStatus(null), 3000);
  };

  // Skip Starting Task
  const handleSkipStartingTask = () => {
    updateProgress(prev => ({
      ...prev,
      skippedStartingTask: true
    }));
  };

  // Save Independent Draft
  const handleSaveIndependentDraft = () => {
    const words = countWords(independentDraft);
    updateProgress(prev => ({
      ...prev,
      independentDraft,
      independentWordCount: words,
      lastSavedDraftAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    setDraftSaveStatus('Writing draft saved in this browser.');
    setTimeout(() => setDraftSaveStatus(null), 3000);
  };

  // Toggle checklist item in self-review
  const handleToggleChecklistItem = (id: string) => {
    updateProgress(prev => {
      const currentList = { ...prev.selfReviewChecklist };
      currentList[id] = !currentList[id];
      const allChecked = currentLesson.independentTask.selfReviewChecklist.every(item => !!currentList[item.id]);
      return {
        ...prev,
        selfReviewChecklist: currentList,
        completedSelfReview: allChecked
      };
    });
  };

  // Guided Practice: Select an Option
  const handleSelectPracticeOption = (questionId: string, optionId: string, isCorrect: boolean) => {
    updateProgress(prev => {
      const existing = prev.practiceStates[questionId] || {
        questionId,
        selectedOptionId: null,
        isCorrect: false,
        hintsViewed: practiceActiveHints[questionId] || 0,
        attemptCount: 0,
        completedWithoutHints: false
      };

      const newHintsViewed = practiceActiveHints[questionId] || 0;
      const isCompletedWithoutHints = isCorrect && newHintsViewed === 0 && existing.attemptCount === 0;

      return {
        ...prev,
        practiceStates: {
          ...prev.practiceStates,
          [questionId]: {
            questionId,
            selectedOptionId: optionId,
            isCorrect,
            hintsViewed: newHintsViewed,
            attemptCount: existing.attemptCount + 1,
            completedWithoutHints: isCorrect ? (existing.completedWithoutHints || isCompletedWithoutHints) : false
          }
        }
      };
    });
  };

  // Show Next Hint for Guided Practice
  const handleShowNextHint = (questionId: string, maxHints: number) => {
    const current = practiceActiveHints[questionId] || 0;
    if (current < maxHints) {
      const nextVal = current + 1;
      setPracticeActiveHints(prev => ({ ...prev, [questionId]: nextVal }));
      updateProgress(prev => {
        const existing = prev.practiceStates[questionId] || {
          questionId,
          selectedOptionId: null,
          isCorrect: false,
          hintsViewed: 0,
          attemptCount: 0,
          completedWithoutHints: false
        };
        return {
          ...prev,
          practiceStates: {
            ...prev.practiceStates,
            [questionId]: {
              ...existing,
              hintsViewed: nextVal
            }
          }
        };
      });
    }
  };

  // Save Reflection & Service Connection
  const handleSaveReflections = () => {
    updateProgress(prev => ({
      ...prev,
      reflectionResponse: reflectionText,
      serviceReflectionResponse: serviceReflectionText
    }));
    setDraftSaveStatus('Reflections saved in this browser.');
    setTimeout(() => setDraftSaveStatus(null), 3000);
  };

  // Save for Review Bookmark Toggle
  const handleToggleSavedForReview = () => {
    updateProgress(prev => ({
      ...prev,
      savedForReview: !prev.savedForReview
    }));
  };

  // Reset Progress for this Lesson
  const handleResetProgress = () => {
    if (window.confirm('Reset your practice answers and drafts for this lesson? This cannot be undone.')) {
      resetLessonProgress(currentLesson.id);
      setProgress(getLessonProgress(currentLesson.id));
      setStartingDraft('');
      setIndependentDraft('');
      setReflectionText('');
      setServiceReflectionText('');
      setPracticeActiveHints({});
      setDraftSaveStatus('Lesson responses reset.');
      setTimeout(() => setDraftSaveStatus(null), 3000);
    }
  };

  // Evidence summary stats (honest reporting)
  const practiceQuestionsTotal = currentLesson.guidedPractice.length;
  const practiceStatesList = Object.values(progress.practiceStates || {});
  const practiceQuestionsCorrect = practiceStatesList.filter((s: any) => s && s.isCorrect).length;
  const practiceQuestionsWithoutHints = practiceStatesList.filter((s: any) => s && s.isCorrect && s.completedWithoutHints).length;
  const selfReviewCheckedCount = Object.values(progress.selfReviewChecklist || {}).filter(Boolean).length;
  const independentWordTotal = countWords(independentDraft);

  // Focus View vs Standard Container Wrapper
  const containerClasses = isFocusView 
    ? 'fixed inset-0 z-50 bg-[#FAF9F5] overflow-y-auto p-4 sm:p-8' 
    : 'w-full max-w-6xl mx-auto text-left font-sans space-y-6 pb-12';

  return (
    <div id="course-video-lesson-viewer" className={containerClasses}>
      
      {/* ===================================================================== */}
      {/* 1. TOP HEADER & COURSE CONTROLS                                       */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={isFocusView ? () => setIsFocusView(false) : onBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>{isFocusView ? 'Exit Focus View' : 'Back to Language & Testing'}</span>
            </button>

            {isFocusView && (
              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-full border border-amber-300">
                Focus Mode (Distraction-Free)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Focus View Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsFocusView(!isFocusView)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer min-h-[38px] ${
                isFocusView 
                  ? 'bg-teal-700 text-white border-teal-800' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title={isFocusView ? 'Exit focus view mode (Esc)' : 'Enter focus view (distraction-free course view)'}
            >
              {isFocusView ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Focus</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Focus View</span>
                </>
              )}
            </button>

            {/* Save for Review Bookmark */}
            <button
              type="button"
              onClick={handleToggleSavedForReview}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer min-h-[38px] ${
                progress.savedForReview
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Save this lesson to your revision list"
            >
              {progress.savedForReview ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-700" />
                  <span>Saved for Review</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  <span>Save for Review</span>
                </>
              )}
            </button>

            {/* Reset Progress */}
            <button
              type="button"
              onClick={handleResetProgress}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer min-h-[38px]"
              title="Reset practice responses for this lesson"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Course Path Badge & Current Lesson Overview */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-mono">
              {course.typeLabel}: {course.title}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Unit {currentLessonIndex + 1} of {course.lessons.length}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Est. {currentLesson.estimatedTime}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
              {currentLesson.subtitle}
            </p>
          </div>

          {/* Learning Target / Concrete Outcome */}
          <div className="p-3.5 rounded-lg bg-teal-50/70 border border-teal-200 text-xs sm:text-sm">
            <span className="font-bold text-teal-900 block mb-0.5">Target Learning Outcome:</span>
            <p className="text-teal-950 leading-relaxed font-medium">
              "{currentLesson.outcome}"
            </p>
          </div>
        </div>

        {/* Previous / Next Lesson Quick Switch Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentLessonIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
            Lesson {currentLessonIndex + 1} of {course.lessons.length}
          </span>

          <button
            type="button"
            onClick={handleNextLesson}
            disabled={currentLessonIndex >= course.lessons.length - 1}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentLessonIndex >= course.lessons.length - 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Next Lesson</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Save Status */}
      {draftSaveStatus && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{draftSaveStatus}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MAIN 2-COLUMN COURSE EXPERIENCE (VIDEO + PLAYLIST ON DESKTOP)      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main Column: In-App Video Player (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Tv className="w-4 h-4 text-teal-700" />
                <span>Video Instruction</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {currentLesson.videoResource.durationLabel}
              </span>
            </div>

            {/* Robust In-App Video Player */}
            <InAppVideoPlayer
              title={currentLesson.videoResource.title}
              creator={currentLesson.videoResource.creator}
              creatorDescription={currentLesson.videoResource.creatorDescription}
              embedUrl={currentLesson.videoResource.embedUrl}
              sourceUrl={currentLesson.videoResource.sourceUrl}
              durationLabel={currentLesson.videoResource.durationLabel}
              transcriptSummary={currentLesson.videoResource.transcriptSummary}
              keyTakeaways={currentLesson.videoResource.keyTakeaways}
              isWatched={progress.watchedVideo}
              onToggleWatched={(watched) => {
                updateProgress(prev => ({ ...prev, watchedVideo: watched }));
              }}
            />
          </div>
        </div>

        {/* Right Column: Ordered Lesson Playlist / Course Index (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 sticky top-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Course Pathway Units
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {course.lessons.length} Units
              </span>
            </div>

            <div className="space-y-2">
              {course.lessons.map((item, idx) => {
                const isSelected = item.id === currentLesson.id;
                const itemProgress = getLessonProgress(item.id);
                
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLesson(item.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-teal-50/90 border-teal-500 text-teal-950 font-medium shadow-xs ring-1 ring-teal-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {itemProgress.watchedVideo ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                          isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold leading-snug line-clamp-2">
                        {item.title}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.estimatedTime}</span>
                        </span>
                        
                        {itemProgress.independentDraft && (
                          <span className="text-emerald-700 font-medium">
                            • Draft saved
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Honest Local Storage Disclosure */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
              <span>{STORAGE_DISCLOSURE_NOTICE}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. STEP FILTER TABS                                                   */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Lesson Notes & Practice Steps:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
          {STEPS_NAV.map((step) => {
            const isActive = activeStep === step.key;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => setActiveStep(step.key)}
                className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. COMPREHENSIVE NOTES, WORKED EXAMPLES & PRACTICE SECTIONS           */}
      {/* ===================================================================== */}

      {/* --------------------------------------------------------------------- */}
      {/* SECTION A: DIAGNOSTIC WARM-UP                                         */}
      {/* --------------------------------------------------------------------- */}
      {(activeStep === 'all' || activeStep === 'start') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Step 1: Diagnostic Warm-Up
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentLesson.startingTask.prompt}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentLesson.startingTask.helpText}
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="starting-draft-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Starting Response (1–2 sentences):
            </label>
            <textarea
              id="starting-draft-input"
              value={startingDraft}
              onChange={(e) => setStartingDraft(e.target.value)}
              placeholder={currentLesson.startingTask.placeholder}
              rows={3}
              className="w-full p-4 rounded-lg border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-sans"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSkipStartingTask}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-h-[42px]"
            >
              Skip warm-up & view lesson
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveStartingTask}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer min-h-[42px]"
              >
                Save Warm-Up Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SECTION B: FOUR ELEMENTS EXPLANATION                                  */}
      {/* --------------------------------------------------------------------- */}
      {(activeStep === 'all' || activeStep === 'elements') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Step 2: Core Structure & Logic
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              The Four Structural Elements of Clear Academic Writing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentLesson.explanation.coreMessage}
            </p>
          </div>

          {/* 4 Core Elements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentLesson.explanation.elements.map((elem, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-[#FAF9F5] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {elem.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {elem.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {elem.description}
                </p>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Ask yourself: </span>
                  <span className="italic">{elem.guidingQuestion}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Plain Language Principle Note */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">SVT Clarity Principle:</span>
              <p className="leading-relaxed">
                {currentLesson.explanation.clarityPrinciple}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SECTION C: WORKED EXAMPLE & WEAKER VERSION COMPARISON                 */}
      {/* --------------------------------------------------------------------- */}
      {(activeStep === 'all' || activeStep === 'example') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Step 3: Annotated Model Example
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Worked Paragraph Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Prompt: <strong className="text-slate-800">"{currentLesson.workedExample.prompt}"</strong>
            </p>
          </div>

          {/* Full Paragraph Breakdown with Clickable Part Tags */}
          <div className="p-5 rounded-xl border border-slate-200 bg-[#FAF9F5] space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Click a part below to examine its purpose:
            </div>

            <div className="flex flex-wrap gap-2">
              {currentLesson.workedExample.parts.map((part) => (
                <button
                  key={part.label}
                  type="button"
                  onClick={() => setSelectedHighlightPart(part.label)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                    selectedHighlightPart === part.label
                      ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {part.label}
                </button>
              ))}
            </div>

            {/* Paragraph Text with Highlighting */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                {currentLesson.workedExample.parts.map((part, pIdx) => {
                  const isHighlighted = selectedHighlightPart === part.label;
                  let highlightColor = '';
                  if (part.label === 'Opinion') highlightColor = 'bg-emerald-100 text-emerald-950 ring-1 ring-emerald-400';
                  if (part.label === 'Reason') highlightColor = 'bg-blue-100 text-blue-950 ring-1 ring-blue-400';
                  if (part.label === 'Example') highlightColor = 'bg-amber-100 text-amber-950 ring-1 ring-amber-400';
                  if (part.label === 'Connection') highlightColor = 'bg-purple-100 text-purple-950 ring-1 ring-purple-400';

                  return (
                    <span 
                      key={pIdx} 
                      className={`px-1 rounded transition-colors ${isHighlighted ? `${highlightColor} font-semibold` : ''}`}
                    >
                      {part.text}{' '}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Selected Part Explanation */}
            {selectedHighlightPart && (
              <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs sm:text-sm">
                <span className="font-bold text-teal-900 block mb-0.5">
                  Why the {selectedHighlightPart} works:
                </span>
                <p className="text-teal-950 leading-relaxed">
                  {currentLesson.workedExample.parts.find(p => p.label === selectedHighlightPart)?.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Comparison with Weaker Version */}
          <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <h3 className="text-sm font-bold text-rose-950">
                Comparison: A Weaker Version (What to Avoid)
              </h3>
            </div>

            <blockquote className="p-3 bg-white rounded-lg border border-rose-200 text-xs sm:text-sm text-slate-800 italic leading-relaxed">
              "{currentLesson.workedExample.weakerVersion.text}"
            </blockquote>

            <div className="space-y-1.5 text-xs text-rose-950 pt-1">
              <span className="font-bold block">Why this version is less clear:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {currentLesson.workedExample.weakerVersion.whyItIsWeaker.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SECTION D: GUIDED PRACTICE WITH PROGRESSIVE HINTS                     */}
      {/* --------------------------------------------------------------------- */}
      {(activeStep === 'all' || activeStep === 'practice') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Step 4: Guided Practice ({currentLesson.guidedPractice.length} Exercises)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Check Your Understanding with Progressive Hints
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select the best choice for each scenario. You can reveal hints if needed; hints used are recorded honestly in your learning summary.
            </p>
          </div>

          {/* Guided Practice Questions */}
          <div className="space-y-8 divide-y divide-slate-200">
            {currentLesson.guidedPractice.map((q, qIndex) => {
              const qState = progress.practiceStates[q.id];
              const hintsCount = practiceActiveHints[q.id] || 0;
              const hasAnswered = !!qState?.selectedOptionId;

              return (
                <div key={q.id} className={`space-y-4 ${qIndex > 0 ? 'pt-8' : ''}`}>
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                        {q.title}
                      </span>
                      {qState?.isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" />
                          <span>
                            {qState.completedWithoutHints
                              ? 'Answered correctly without hints'
                              : 'Answered correctly with hint'}
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 mb-2">
                      {q.scenarioOrContext}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = qState?.selectedOptionId === opt.id;
                      let optionBorder = 'border-slate-200 hover:border-slate-300 bg-white';
                      if (hasAnswered) {
                        if (opt.isCorrect) {
                          optionBorder = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold';
                        } else if (isSelected && !opt.isCorrect) {
                          optionBorder = 'border-rose-400 bg-rose-50/70 text-rose-950';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectPracticeOption(q.id, opt.id, opt.isCorrect)}
                          className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 ${optionBorder}`}
                        >
                          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            {isSelected ? '●' : '○'}
                          </div>
                          <div className="space-y-1">
                            <span>{opt.text}</span>
                            {hasAnswered && isSelected && (
                              <p className={`text-xs mt-1 font-normal ${opt.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                                {opt.feedback}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Progressive Hint Button & Hints Box */}
                  <div className="space-y-2 pt-1">
                    {hintsCount < q.hints.length && !qState?.isCorrect && (
                      <button
                        type="button"
                        onClick={() => handleShowNextHint(q.id, q.hints.length)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                        <span>Need help? Show Hint {hintsCount + 1} of {q.hints.length}</span>
                      </button>
                    )}

                    {hintsCount > 0 && (
                      <div className="space-y-1.5 p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                        {q.hints.slice(0, hintsCount).map((hintText, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-1.5">
                            <span className="font-bold shrink-0">{hIdx + 1}.</span>
                            <p className="leading-relaxed">{hintText}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reasoning Explanation when correct */}
                    {qState?.isCorrect && (
                      <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                        <span className="font-bold block">Reasoning Explanation:</span>
                        <p className="leading-relaxed">{q.reasoningExplanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SECTION E: INDEPENDENT WRITING & SELF-REVIEW CHECKLIST                */}
      {/* --------------------------------------------------------------------- */}
      {(activeStep === 'all' || activeStep === 'independent') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Step 5: Independent Practice Task
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentLesson.independentTask.prompt}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentLesson.independentTask.instructions}
            </p>
            <div className="text-xs font-medium text-slate-500">
              {currentLesson.independentTask.suggestedLengthNote}
            </div>
          </div>

          {/* Writing Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label htmlFor="independent-writing-textarea" className="font-bold text-slate-800 uppercase tracking-wider">
                Your Paragraph Draft:
              </label>
              <span className={`font-mono font-bold ${
                independentWordTotal >= 60 && independentWordTotal <= 120
                  ? 'text-emerald-700'
                  : 'text-slate-600'
              }`}>
                {independentWordTotal} words
              </span>
            </div>

            <textarea
              id="independent-writing-textarea"
              value={independentDraft}
              onChange={(e) => setIndependentDraft(e.target.value)}
              placeholder="State your opinion in the first sentence, explain your main reason, give a specific example, and connect the thought smoothly..."
              rows={6}
              className="w-full p-4 rounded-xl border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed"
            />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{progress.lastSavedDraftAt ? `Last saved at ${progress.lastSavedDraftAt}` : 'Draft saved in this browser'}</span>
              <button
                type="button"
                onClick={handleSaveIndependentDraft}
                className="px-3.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-300 transition-colors cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </div>

          {/* 5-Item Self-Review Checklist */}
          <div className="p-5 rounded-xl border border-slate-200 bg-[#FAF9F5] space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Student Self-Review Checklist
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Check each question as you review your paragraph. (Completion is self-reported by you; we do not use fake automated grading.)
              </p>
            </div>

            <div className="space-y-2.5">
              {currentLesson.independentTask.selfReviewChecklist.map((item) => {
                const isChecked = !!progress.selfReviewChecklist[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleChecklistItem(item.id)}
                    className={`w-full p-3 rounded-lg border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-teal-50/80 border-teal-300 text-teal-950 font-medium'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-teal-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold block">{item.label}</span>
                      <span className="text-xs text-slate-500">{item.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {progress.completedSelfReview && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>All self-review items checked. Great attention to clarity!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SECTION F: REFLECTION, SERVICE CONNECTION & HONEST SUMMARY            */}
      {/* --------------------------------------------------------------------- */}
      {(activeStep === 'all' || activeStep === 'reflection') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Step 6: Reflection & Learning Evidence
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Compare Your Starting & Final Writing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentLesson.reflection.guidance}
            </p>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Starting Response */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Starting Task (Step 1):
              </span>
              {progress.startingTaskResponse ? (
                <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                  "{progress.startingTaskResponse}"
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  (You skipped the warm-up task.)
                </p>
              )}
            </div>

            {/* Box 2: Independent Final Paragraph */}
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                Final Independent Writing (Step 5):
              </span>
              {independentDraft ? (
                <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                  "{independentDraft}"
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  (No independent draft entered yet.)
                </p>
              )}
            </div>
          </div>

          {/* Student Reflection Input */}
          <div className="space-y-2">
            <label htmlFor="reflection-textarea" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              {currentLesson.reflection.prompt}
            </label>
            <textarea
              id="reflection-textarea"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="What specific improvements did you make in your reasons, examples, or flow?"
              rows={3}
              className="w-full p-4 rounded-xl border border-slate-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* Optional Service Connection */}
          <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                {currentLesson.serviceConnection.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentLesson.serviceConnection.task}
            </p>
            <textarea
              value={serviceReflectionText}
              onChange={(e) => setServiceReflectionText(e.target.value)}
              placeholder="Optional: How could sharing clear explanations support peers in your study group or school?"
              rows={2}
              className="w-full p-3 rounded-lg border border-amber-300 focus:border-amber-500 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>

          {/* Save Reflections Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveReflections}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            >
              Save Reflections
            </button>
          </div>

          {/* Honest Evidence Summary Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-[#FAF9F5] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Honest Learning Evidence Summary
              </h4>
              <span className="text-xs text-slate-500">Saved in browser</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Video Status:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {progress.watchedVideo ? 'Watched (Self-reported)' : 'Not marked yet'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Guided Practice:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {practiceQuestionsCorrect} of {practiceQuestionsTotal} correct
                </span>
                <span className="text-[11px] text-slate-500">
                  ({practiceQuestionsWithoutHints} without hints)
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Independent Draft:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {independentWordTotal > 0 ? `${independentWordTotal} words` : 'Not written'}
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Self-Review:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {selfReviewCheckedCount} items checked
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreviousLesson}
              disabled={currentLessonIndex === 0}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1 min-h-[40px] ${
                currentLessonIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Lesson</span>
            </button>

            <div className="flex items-center gap-2">
              {currentLessonIndex < course.lessons.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextLesson}
                  className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors flex items-center gap-1.5 min-h-[40px] shadow-xs cursor-pointer"
                >
                  <span>Next Lesson in Path</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={isFocusView ? () => setIsFocusView(false) : onBack}
                  className="px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors flex items-center gap-1.5 min-h-[40px] shadow-xs cursor-pointer"
                >
                  <span>Finish & Return</span>
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
