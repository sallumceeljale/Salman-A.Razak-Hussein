import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Filter, 
  X,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AcademicTestData, QuestionType, TestId } from '../../types/academicTesting';

interface TestPracticeViewProps {
  testData: AcademicTestData;
  initialQuestionId?: string;
  isItemSaved: (id: string) => boolean;
  onToggleSaveItem: (item: {
    id: string;
    testId: TestId;
    title: string;
    category: string;
    summary?: string;
  }) => void;
  onNavigateToQuestionTypes: () => void;
}

export const TestPracticeView: React.FC<TestPracticeViewProps> = ({
  testData,
  initialQuestionId,
  isItemSaved,
  onToggleSaveItem,
  onNavigateToQuestionTypes
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(() => {
    if (initialQuestionId) {
      const idx = testData.questionTypes.findIndex(q => q.id === initialQuestionId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  // State for interactive user attempt
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userScratchpadText, setUserScratchpadText] = useState<string>('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Skill category filter options
  const skillCategories = useMemo(() => {
    const set = new Set<string>();
    testData.questionTypes.forEach(q => set.add(q.skillCategory));
    return Array.from(set);
  }, [testData]);

  // Filtered list of questions based on skill filter
  const filteredQuestions = useMemo(() => {
    if (selectedSkillFilter === 'ALL') return testData.questionTypes;
    return testData.questionTypes.filter(q => q.skillCategory === selectedSkillFilter);
  }, [testData, selectedSkillFilter]);

  // Ensure valid current question index within filtered list
  const safeIndex = Math.min(Math.max(0, activeQuestionIndex), Math.max(0, filteredQuestions.length - 1));
  const currentQuestion: QuestionType | undefined = filteredQuestions[safeIndex];

  // Handle jumping to next/prev
  const handleNext = () => {
    if (safeIndex < filteredQuestions.length - 1) {
      setActiveQuestionIndex(safeIndex + 1);
      resetAttempt();
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setActiveQuestionIndex(safeIndex - 1);
      resetAttempt();
    }
  };

  const resetAttempt = () => {
    setSelectedOptionId(null);
    setUserScratchpadText('');
    setIsAnswerRevealed(false);
  };

  // Word count for student scratchpad
  const scratchpadWordCount = useMemo(() => {
    const trimmed = userScratchpadText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [userScratchpadText]);

  return (
    <div id="svt-practice-experience" className="space-y-6 text-left animate-fadeIn">
      {/* Practice Header & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide border ${testData.badgeBg}`}>
                {testData.shortCode} Interactive Practice
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Single-Activity Focus Mode
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Original SVT Practice Activities
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Practise one realistic task at a time, test your approach, and examine model walkthroughs.
            </p>
          </div>

          {/* Skill Filter Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedSkillFilter}
              onChange={(e) => {
                setSelectedSkillFilter(e.target.value);
                setActiveQuestionIndex(0);
                resetAttempt();
              }}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter practice activities by skill domain"
            >
              <option value="ALL">All Skill Domains ({testData.questionTypes.length})</option>
              {skillCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Switcher Step Bar (When multiple questions available) */}
        {filteredQuestions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                Activity {safeIndex + 1} of {filteredQuestions.length}
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                {filteredQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      resetAttempt();
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      idx === safeIndex
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                    aria-label={`Jump to activity ${idx + 1}: ${q.title}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Previous & Next Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={safeIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors shadow-xs min-h-[44px] cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={safeIndex === filteredQuestions.length - 1}
                className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs min-h-[44px] cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Single Practice Card Container */}
      {!currentQuestion ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 font-display">
            No activities matched the selected skill filter.
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing your skill filter to view all available original practice activities for {testData.name}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSkillFilter('ALL');
              setActiveQuestionIndex(0);
              resetAttempt();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer min-h-[44px]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          {/* Activity Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1.5">
              {/* Mandatory SVT Notice Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Original SVT practice — not an official test question.</span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                {currentQuestion.title}
              </h4>

              {/* Badges: Skill, Format, Time Limit, Difficulty */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                  Domain: {currentQuestion.skillCategory}
                </span>

                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  Format: {currentQuestion.format}
                </span>

                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{currentQuestion.timeLimit}</span>
                </span>

                {currentQuestion.difficulty && (
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    currentQuestion.difficulty === 'Challenging'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : currentQuestion.difficulty === 'Standard'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>
            </div>

            {/* Bookmark for Revision Action */}
            <div className="shrink-0 flex items-center gap-2 self-end sm:self-start">
              <button
                type="button"
                onClick={() => {
                  const saveId = `practice-${testData.id}-${currentQuestion.id}`;
                  onToggleSaveItem({
                    id: saveId,
                    testId: testData.id,
                    title: `[${testData.shortCode} Practice] ${currentQuestion.title}`,
                    category: `SVT Practice (${currentQuestion.skillCategory})`,
                    summary: currentQuestion.svtPracticeSample.prompt
                  });
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                  isItemSaved(`practice-${testData.id}-${currentQuestion.id}`)
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Save this practice task for revision"
                aria-label="Save this practice task for revision"
              >
                {isItemSaved(`practice-${testData.id}-${currentQuestion.id}`) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-600 fill-current" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span>Save Task</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Task Instructions */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800">
            <strong className="text-[11px] uppercase tracking-wider text-slate-500 block mb-0.5">
              Task Instructions:
            </strong>
            <p className="leading-relaxed font-medium">
              {currentQuestion.svtPracticeSample.taskInstructions}
            </p>
          </div>

          {/* Passage (if present) */}
          {currentQuestion.svtPracticeSample.passage && (
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2 font-sans">
                Reading Passage:
              </span>
              {currentQuestion.svtPracticeSample.passage}
            </div>
          )}

          {/* Practice Prompt */}
          <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
              Prompt & Question:
            </span>
            <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed whitespace-pre-line">
              {currentQuestion.svtPracticeSample.prompt}
            </p>
          </div>

          {/* Interactive Workspace Area */}
          {currentQuestion.svtPracticeSample.options ? (
            /* MULTIPLE CHOICE / SELECTOR INTERACTION */
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Select your answer:
              </span>
              <div className="space-y-2">
                {currentQuestion.svtPracticeSample.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const showFeedback = isAnswerRevealed;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer min-h-[44px] flex items-start gap-3 ${
                        showFeedback
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-1 ring-emerald-500'
                            : isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-950'
                            : 'bg-white border-slate-200 opacity-60'
                          : isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-950 ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        showFeedback
                          ? opt.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {showFeedback ? (opt.isCorrect ? '✓' : isSelected ? '✕' : '•') : (isSelected ? '●' : '○')}
                      </div>

                      <div className="flex-1">
                        <span className="font-semibold block leading-relaxed">{opt.text}</span>
                        {showFeedback && (
                          <span className={`text-[11px] block mt-1 leading-snug ${
                            opt.isCorrect ? 'text-emerald-800 font-medium' : 'text-slate-500'
                          }`}>
                            {opt.explanation}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* EXTENDED TEXT / SPEECH SCRATCHPAD INTERACTION */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="student-practice-scratchpad" 
                  className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student Draft & Practice Scratchpad:</span>
                </label>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span>{scratchpadWordCount} words</span>
                  {userScratchpadText && (
                    <button
                      type="button"
                      onClick={() => setUserScratchpadText('')}
                      className="text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              <textarea
                id="student-practice-scratchpad"
                rows={5}
                placeholder="Type your outline, complete paragraph draft, or speaking bullet points here before revealing the model response..."
                value={userScratchpadText}
                onChange={(e) => setUserScratchpadText(e.target.value)}
                className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
              />
            </div>
          )}

          {/* Reveal Model Answer Toggle Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[44px] ${
                isAnswerRevealed
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isAnswerRevealed ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Hide Model Answer & Scoring Explanation</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Reveal Model Answer & Scoring Explanation</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateToQuestionTypes}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1 justify-center sm:justify-start"
            >
              <span>View full question type catalogue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Revealed Model Response & Scoring Breakdown Section */}
          {isAnswerRevealed && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-fadeIn">
              {/* Model Response / Solution Walkthrough */}
              <div className="p-4 sm:p-5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block">
                  Model Response & Solution Walkthrough:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {currentQuestion.svtPracticeSample.modelResponseOrSolution}
                </p>
              </div>

              {/* Scoring Focus */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Examiner & Scoring Focus:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {currentQuestion.svtPracticeSample.scoringFocus.map((focus, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core Tactical Strategy Tip (Neutral slate styling per prompt guidance) */}
              <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[11px] uppercase tracking-wider text-slate-700 block">
                    Key Strategy Reminder:
                  </strong>
                  <p className="mt-0.5 leading-relaxed text-slate-700">{currentQuestion.topStrategyTip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Non-Prediction Educational Disclaimer */}
          <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This practice item is an original SVT educational example for self-study and concept mastery. It does not predict or guarantee official test scores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
