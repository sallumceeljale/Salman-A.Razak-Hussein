import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FlaskConical, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  Play, 
  Pause, 
  Award, 
  Languages, 
  GraduationCap, 
  Compass, 
  BarChart2, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRACTICE_EXERCISES } from '../data/practiceLabData';
import { 
  PracticeExercise, 
  PracticeCategory, 
  PracticeDifficulty, 
  StoredPracticeProgress 
} from '../types/practiceLab';

const STORAGE_KEY = 'svt_practice_lab_progress_v1';

interface PracticeLabProps {
  initialCategory?: PracticeCategory | 'all';
  isDashboardView?: boolean;
}

export default function PracticeLab({
  initialCategory = 'all',
  isDashboardView = false
}: PracticeLabProps) {
  // -------------------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory | 'all'>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PracticeDifficulty | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // User input states for active exercise
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  // Timer states
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Local storage progress
  const [progress, setProgress] = useState<StoredPracticeProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            completedExerciseIds: Array.isArray(parsed.completedExerciseIds) ? parsed.completedExerciseIds : [],
            correctExerciseIds: Array.isArray(parsed.correctExerciseIds) ? parsed.correctExerciseIds : [],
            attempts: parsed.attempts || {}
          };
        }
      }
    } catch (e) {
      console.warn('Could not read practice lab progress from localStorage:', e);
    }
    return {
      completedExerciseIds: [],
      correctExerciseIds: [],
      attempts: {}
    };
  });

  const [showResetModal, setShowResetModal] = useState(false);

  // -------------------------------------------------------------------------
  // PERSISTENCE EFFECT
  // -------------------------------------------------------------------------
  const saveProgress = (newProgress: StoredPracticeProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('Could not save practice lab progress:', e);
    }
  };

  // -------------------------------------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------------------------------------
  const filteredExercises = useMemo(() => {
    return PRACTICE_EXERCISES.filter((ex) => {
      // Category filter
      if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && ex.difficulty !== selectedDifficulty) {
        return false;
      }
      // Skill filter
      if (selectedSkillFilter !== 'ALL' && ex.skill !== selectedSkillFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ex.title.toLowerCase().includes(q);
        const matchPrompt = ex.promptText.toLowerCase().includes(q);
        const matchSkill = ex.skill.toLowerCase().includes(q);
        const matchPassage = ex.passage?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchPrompt && !matchSkill && !matchPassage) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, selectedSkillFilter, searchQuery]);

  // Unique skills list for the dropdown filter
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    PRACTICE_EXERCISES.forEach((ex) => {
      if (selectedCategory === 'all' || ex.category === selectedCategory) {
        skills.add(ex.skill);
      }
    });
    return Array.from(skills);
  }, [selectedCategory]);

  // Active exercise pointer
  const activeExercise: PracticeExercise | undefined = filteredExercises[currentExerciseIndex];

  // Reset exercise-specific form state when switching questions
  useEffect(() => {
    setSelectedOptionId(null);
    setBlankAnswers({});
    setIsSubmitted(false);
    setShowExplanation(true);
    setIsTimeUp(false);

    if (activeExercise) {
      const defaultTime = activeExercise.suggestedTimeSeconds || 60;
      setTimerSeconds(defaultTime);
      setRemainingSeconds(defaultTime);
      if (isTimerEnabled) {
        setIsTimerRunning(true);
      } else {
        setIsTimerRunning(false);
      }
    }
  }, [currentExerciseIndex, activeExercise?.id, isTimerEnabled]);

  // Keep index within bounds if filters shrink the list
  useEffect(() => {
    if (currentExerciseIndex >= filteredExercises.length) {
      setCurrentExerciseIndex(0);
    }
  }, [filteredExercises.length, currentExerciseIndex]);

  // -------------------------------------------------------------------------
  // TIMER TICKER
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (isTimerEnabled && isTimerRunning && remainingSeconds > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeUp(true);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerEnabled, isTimerRunning, remainingSeconds, isSubmitted]);

  // -------------------------------------------------------------------------
  // SUBMISSION LOGIC
  // -------------------------------------------------------------------------
  const handleSubmitAnswer = () => {
    if (!activeExercise || isSubmitted) return;

    let isCorrect = false;

    if (activeExercise.exerciseType === 'multiple-choice' || activeExercise.exerciseType === 'sentence-clarity') {
      const chosen = activeExercise.options?.find((o) => o.id === selectedOptionId);
      isCorrect = chosen?.isCorrect ?? false;
    } else if (activeExercise.exerciseType === 'read-and-complete' || activeExercise.exerciseType === 'fill-in-blank') {
      if (activeExercise.blanks) {
        isCorrect = activeExercise.blanks.every((b) => {
          const userVal = (blankAnswers[b.id] || '').trim().toLowerCase();
          const correctVal = b.correctAnswer.trim().toLowerCase();
          const acceptable = (b.acceptableAnswers || []).map(a => a.trim().toLowerCase());
          return userVal === correctVal || acceptable.includes(userVal);
        });
      }
    }

    setIsSubmitted(true);
    setIsTimerRunning(false);

    // Update progress state
    const exId = activeExercise.id;
    const completedSet = new Set<string>(progress.completedExerciseIds);
    const correctSet = new Set<string>(progress.correctExerciseIds);

    completedSet.add(exId);
    if (isCorrect) {
      correctSet.add(exId);
    } else {
      correctSet.delete(exId);
    }

    const updatedAttempts = {
      ...progress.attempts,
      [exId]: {
        lastAttemptDate: new Date().toISOString(),
        isCorrect,
        userAnswers: selectedOptionId 
          ? { selectedOption: selectedOptionId } 
          : blankAnswers
      }
    };

    saveProgress({
      completedExerciseIds: Array.from(completedSet),
      correctExerciseIds: Array.from(correctSet),
      attempts: updatedAttempts
    });
  };

  const handleTryAgain = () => {
    setSelectedOptionId(null);
    setBlankAnswers({});
    setIsSubmitted(false);
    setIsTimeUp(false);
    if (activeExercise) {
      const defaultTime = activeExercise.suggestedTimeSeconds || 60;
      setRemainingSeconds(defaultTime);
      if (isTimerEnabled) setIsTimerRunning(true);
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const handleResetAllProgress = () => {
    saveProgress({
      completedExerciseIds: [],
      correctExerciseIds: [],
      attempts: {}
    });
    setShowResetModal(false);
    handleTryAgain();
  };

  // Keyboard shortcut listeners (1-4 for options, Enter to submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in search or text inputs
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (!isSubmitted && activeExercise?.options) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (activeExercise.options[idx]) {
            e.preventDefault();
            setSelectedOptionId(activeExercise.options[idx].id);
          }
        }
      }

      if (e.key === 'Enter' && !isSubmitted && selectedOptionId) {
        e.preventDefault();
        handleSubmitAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeExercise, isSubmitted, selectedOptionId]);

  // Calculations for accuracy and completion
  const totalCompleted = progress.completedExerciseIds.length;
  const totalCorrect = progress.correctExerciseIds.length;
  const accuracyPercent = totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0;

  return (
    <div 
      id="practice-lab"
      className={`text-left ${
        isDashboardView 
          ? 'space-y-6' 
          : 'space-y-8 max-w-6xl mx-auto'
      }`}
      aria-label="SVT Interactive Practice Lab"
    >
      {/* ------------------------------------------------------------- */}
      {/* HEADER & EDUCATIONAL DISCLAIMER                               */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100">
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span>Interactive Skill Lab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            SVT Practice Lab
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Practice essential English foundations, DET question formats, and IELTS Academic test skills with immediate feedback, detailed distractor rationales, and key grammar strategies.
          </p>
        </div>

        {/* Local Accuracy Badge & Privacy Notice */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Practice Accuracy
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-black font-display text-slate-900">
                  {totalCompleted > 0 ? `${accuracyPercent}%` : '—'}
                </span>
                <span className="text-xs text-slate-500">
                  ({totalCorrect}/{totalCompleted} solved)
                </span>
              </div>
            </div>
          </div>

          {totalCompleted > 0 && (
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Reset practice lab local progress"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Educational Originality Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-slate-900">Original SVT Educational Materials:</strong> These practice exercises were authored by Scholars Volunteer Team educators and student mentors. They are independent educational drills designed to teach linguistic principles. They are not official test questions and do not predict official examination scores or admissions outcomes.
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY SELECTOR TABS                                         */}
      {/* ------------------------------------------------------------- */}
      <div 
        className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
        role="tablist"
        aria-label="Practice Categories"
      >
        <button
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => { setSelectedCategory('all'); setSelectedSkillFilter('ALL'); setCurrentExerciseIndex(0); }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Modules ({PRACTICE_EXERCISES.length})</span>
        </button>

        <button
          role="tab"
          aria-selected={selectedCategory === 'foundations'}
          onClick={() => { setSelectedCategory('foundations'); setSelectedSkillFilter('ALL'); setCurrentExerciseIndex(0); }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
            selectedCategory === 'foundations'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. English Foundations</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {PRACTICE_EXERCISES.filter(e => e.category === 'foundations').length}
          </span>
        </button>

        <button
          role="tab"
          aria-selected={selectedCategory === 'det'}
          onClick={() => { setSelectedCategory('det'); setSelectedSkillFilter('ALL'); setCurrentExerciseIndex(0); }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
            selectedCategory === 'det'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>2. DET Skills</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {PRACTICE_EXERCISES.filter(e => e.category === 'det').length}
          </span>
        </button>

        <button
          role="tab"
          aria-selected={selectedCategory === 'ielts'}
          onClick={() => { setSelectedCategory('ielts'); setSelectedSkillFilter('ALL'); setCurrentExerciseIndex(0); }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
            selectedCategory === 'ielts'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>3. IELTS Skills</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {PRACTICE_EXERCISES.filter(e => e.category === 'ielts').length}
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH, DIFFICULTY & SKILL FILTERS BAR                         */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises, skills, or grammar concepts..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 px-2">Level:</span>
            {(['ALL', 'Foundation', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Skill Filter Dropdown */}
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Skills ({availableSkills.length})</option>
            {availableSkills.map((sk) => (
              <option key={sk} value={sk}>
                {sk.length > 35 ? `${sk.slice(0, 35)}...` : sk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE EXERCISE CONTAINER                                      */}
      {/* ------------------------------------------------------------- */}
      {filteredExercises.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No exercises match your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your keyword, resetting the difficulty, or selecting "All Modules".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('ALL');
              setSelectedSkillFilter('ALL');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : activeExercise ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
          
          {/* Card Top Navigation / Meta Bar */}
          <div className="p-4 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Category, Difficulty & Index */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                activeExercise.category === 'foundations'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : activeExercise.category === 'det'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {activeExercise.categoryLabel}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                activeExercise.difficulty === 'Foundation'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : activeExercise.difficulty === 'Intermediate'
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {activeExercise.difficulty}
              </span>

              <span className="text-xs font-mono font-bold text-slate-500">
                Question {currentExerciseIndex + 1} of {filteredExercises.length}
              </span>

              {progress.completedExerciseIds.includes(activeExercise.id) && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Completed</span>
                </span>
              )}
            </div>

            {/* Right: Optional Timer Controls & Question Pagination */}
            <div className="flex items-center gap-3 shrink-0">
              
              {/* Optional Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerEnabled(!isTimerEnabled);
                    if (!isTimerEnabled) {
                      setRemainingSeconds(activeExercise.suggestedTimeSeconds || 60);
                      setIsTimerRunning(true);
                    }
                  }}
                  className={`flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                    isTimerEnabled ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                  title={isTimerEnabled ? 'Disable optional practice timer' : 'Enable optional practice timer'}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timer: {isTimerEnabled ? 'On' : 'Off'}</span>
                </button>

                {isTimerEnabled && (
                  <span className={`font-mono text-xs font-bold pl-1 border-l border-slate-200 ${
                    isTimeUp 
                      ? 'text-amber-600' 
                      : remainingSeconds <= 15 
                        ? 'text-red-600 animate-pulse' 
                        : 'text-slate-700'
                  }`}>
                    {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Prev / Next question navigation */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentExerciseIndex === 0}
                  aria-label="Previous question"
                  className="min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentExerciseIndex === filteredExercises.length - 1}
                  aria-label="Next question"
                  className="min-w-[40px] min-h-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Question Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Skill Focus & Title */}
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-indigo-600">
                Skill Focus: {activeExercise.skill}
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                {activeExercise.title}
              </h3>
            </div>

            {/* Instructions */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-medium">
              {activeExercise.instructions}
            </div>

            {/* Optional Reading Passage / Excerpt */}
            {activeExercise.passage && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {activeExercise.passage}
              </div>
            )}

            {/* Question Prompt */}
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {activeExercise.promptText}
            </div>

            {/* ----------------------------------------------------------- */}
            {/* EXERCISE TYPE INTERFACES                                    */}
            {/* ----------------------------------------------------------- */}

            {/* Type A: Multiple Choice / Sentence Clarity */}
            {activeExercise.options && (
              <div className="space-y-3" role="radiogroup" aria-label="Answer options">
                {activeExercise.options.map((option, idx) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.isCorrect;

                  let optionStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
                  
                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400';
                    } else {
                      optionStyle = 'opacity-60 bg-slate-50 border-slate-200 text-slate-500';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-indigo-50/70 border-indigo-500 text-indigo-950 ring-2 ring-indigo-400';
                  }

                  return (
                    <div
                      key={option.id}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => {
                        if (!isSubmitted) setSelectedOptionId(option.id);
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !isSubmitted) {
                          e.preventDefault();
                          setSelectedOptionId(option.id);
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${optionStyle}`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isSubmitted && isSelected && !isCorrect
                              ? 'bg-rose-600 text-white border-rose-600'
                              : isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                          {option.text}
                        </div>
                      </div>

                      {/* Feedback Icon */}
                      {isSubmitted && (
                        <div className="shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Type B: Read & Complete (C-Test / Letters completion) */}
            {activeExercise.blanks && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fill in the missing letters / words:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeExercise.blanks.map((blank, bIdx) => {
                    const userVal = blankAnswers[blank.id] || '';
                    const isBlankCorrect = userVal.trim().toLowerCase() === blank.correctAnswer.trim().toLowerCase() ||
                      (blank.acceptableAnswers || []).some(a => a.trim().toLowerCase() === userVal.trim().toLowerCase());

                    return (
                      <div key={blank.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>Slot {bIdx + 1} {blank.prefixText ? `("${blank.prefixText}...")` : ''}</span>
                          {isSubmitted && (
                            <span className={isBlankCorrect ? 'text-emerald-600 flex items-center gap-1' : 'text-rose-600 flex items-center gap-1'}>
                              {isBlankCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                              {isBlankCorrect ? 'Correct' : `Answer: ${blank.correctAnswer}`}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {blank.prefixText && (
                            <span className="font-mono font-bold text-slate-500 text-sm">
                              {blank.prefixText}
                            </span>
                          )}
                          <input
                            type="text"
                            disabled={isSubmitted}
                            value={userVal}
                            onChange={(e) => {
                              setBlankAnswers({
                                ...blankAnswers,
                                [blank.id]: e.target.value
                              });
                            }}
                            placeholder={blank.hint || 'Type missing letters...'}
                            className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-sm font-mono border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              isSubmitted
                                ? isBlankCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                  : 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-slate-50 border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        {blank.hint && !isSubmitted && (
                          <div className="text-[11px] text-slate-400 italic">
                            Hint: {blank.hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* SUBMIT / ACTION BUTTONS                                     */}
            {/* ----------------------------------------------------------- */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200">
              
              <div className="text-xs text-slate-500">
                {!isSubmitted ? (
                  <span>Press keys <kbd className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-[10px]">1</kbd>–<kbd className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-[10px]">4</kbd> or click to select</span>
                ) : (
                  <span>Review the pedagogical rationale and strategy below</span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {!isSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={
                      activeExercise.options 
                        ? !selectedOptionId 
                        : Object.keys(blankAnswers).length === 0
                    }
                    className="min-h-[44px] w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Check Solution</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentExerciseIndex === filteredExercises.length - 1}
                      className="min-h-[44px] px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next Exercise</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* IMMEDIATE PEDAGOGICAL FEEDBACK & STRATEGY PANEL             */}
            {/* ----------------------------------------------------------- */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-6 rounded-2xl border border-slate-200 overflow-hidden"
              >
                {/* Header banner of feedback */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Pedagogical Explanation & Strategy Review
                    </h4>
                  </div>
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{showExplanation ? 'Hide Details' : 'Show Details'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {showExplanation && (
                  <div className="p-5 sm:p-6 bg-white space-y-5 text-xs sm:text-sm">
                    
                    {/* Core Rule & Strategy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Core Linguistic Rule</span>
                        </div>
                        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                          {activeExercise.coreRule}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" />
                          <span>Actionable Strategy Tip</span>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                          {activeExercise.strategyTip}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Distractor Breakdown for Multiple Choice */}
                    {activeExercise.options && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Answer Choice Analysis:
                        </h5>
                        <div className="space-y-2">
                          {activeExercise.options.map((opt, i) => (
                            <div 
                              key={opt.id} 
                              className={`p-3 rounded-xl border text-xs leading-relaxed ${
                                opt.isCorrect
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="font-bold flex items-center gap-1.5 mb-0.5">
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                                  opt.isCorrect 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span>{opt.text}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  opt.isCorrect 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {opt.isCorrect ? 'Correct Solution' : 'Distractor'}
                                </span>
                              </div>
                              <p className="mt-1 pl-6 text-slate-600">
                                {opt.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            )}

          </div>

          {/* Card Bottom Quick Jumper */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Jump to Exercise:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {filteredExercises.map((ex, idx) => {
                const isCurrent = idx === currentExerciseIndex;
                const isDone = progress.completedExerciseIds.includes(ex.id);
                const isPassed = progress.correctExerciseIds.includes(ex.id);

                return (
                  <button
                    key={ex.id}
                    onClick={() => setCurrentExerciseIndex(idx)}
                    className={`min-w-[32px] h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs scale-105'
                        : isDone
                          ? isPassed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                    title={`${ex.title} (${ex.difficulty})`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}

      {/* ------------------------------------------------------------- */}
      {/* RESET CONFIRMATION MODAL                                      */}
      {/* ------------------------------------------------------------- */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <RotateCcw className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Practice Records?</h3>
                <p className="text-xs text-slate-500">This will clear your local exercise history.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              All solved counts and accuracy metrics stored in your browser will be cleared. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetAllProgress}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
