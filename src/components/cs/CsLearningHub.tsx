import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Workflow, 
  FileCode2, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Award, 
  Code, 
  Compass,
  ArrowRight,
  HelpCircle,
  FolderTree,
  FileCheck
} from 'lucide-react';
import { CS_LEARNING_TRACKS } from '../../data/csLearningData';
import { CsTrackId, CsTrack, CsLesson } from '../../types/csLearning';
import { 
  InteractiveQuizDemo, 
  VolunteerHoursCalculatorDemo, 
  PersonalStudyPlannerDemo, 
  ResourceDirectoryDemo, 
  ResponsibleAiChecklistDemo 
} from './CsProjectDemos';

const CS_STORAGE_KEY = 'svt_cs_learning_progress_v1';

interface StoredCsProgress {
  completedLessons: string[];
  completedActivities: string[];
  completedProjects: string[];
  completedChecklistItems: string[];
  conceptAnswers?: { [lessonId: string]: number };
  lastUpdated: string;
}

interface CsLearningHubProps {
  initialTrack?: CsTrackId;
  onBackToOverview?: () => void;
  isDashboardView?: boolean;
}

export default function CsLearningHub({
  initialTrack = 'computer-fundamentals',
  onBackToOverview,
  isDashboardView = false
}: CsLearningHubProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<CsTrackId>(initialTrack);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('cf-1');
  const [userAnswers, setUserAnswers] = useState<{ [lessonId: string]: number }>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [progress, setProgress] = useState<StoredCsProgress>({
    completedLessons: [],
    completedActivities: [],
    completedProjects: [],
    completedChecklistItems: [],
    conceptAnswers: {},
    lastUpdated: ''
  });

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setProgress(parsed);
          if (parsed.conceptAnswers) {
            setUserAnswers(parsed.conceptAnswers);
          }
        }
      }
    } catch (err) {
      console.warn('Could not read CS progress from localStorage:', err);
    }
  }, []);

  // Save non-sensitive progress to localStorage
  const saveProgressState = (newProgress: StoredCsProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(CS_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (err) {
      console.warn('Could not save CS progress to localStorage:', err);
    }
  };

  const currentTrack: CsTrack = CS_LEARNING_TRACKS.find(t => t.id === selectedTrackId) || CS_LEARNING_TRACKS[0];

  // Set default expanded lesson on track change
  const handleSelectTrack = (trackId: CsTrackId) => {
    setSelectedTrackId(trackId);
    const targetTrack = CS_LEARNING_TRACKS.find(t => t.id === trackId);
    if (targetTrack && targetTrack.lessons.length > 0) {
      setExpandedLessonId(targetTrack.lessons[0].id);
    }
    // Scroll smoothly to track content
    setTimeout(() => {
      const el = document.getElementById('cs-track-content');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Toggle Lesson Completion
  const toggleLessonComplete = (lessonId: string) => {
    const isDone = progress.completedLessons.includes(lessonId);
    const updatedLessons = isDone
      ? progress.completedLessons.filter(id => id !== lessonId)
      : [...progress.completedLessons, lessonId];

    const updated: StoredCsProgress = {
      ...progress,
      completedLessons: updatedLessons,
      lastUpdated: new Date().toISOString()
    };
    saveProgressState(updated);
  };

  // Toggle Practical Activity Completion
  const toggleActivityComplete = (trackId: string) => {
    const isDone = progress.completedActivities.includes(trackId);
    const updatedActivities = isDone
      ? progress.completedActivities.filter(id => id !== trackId)
      : [...progress.completedActivities, trackId];

    const updated: StoredCsProgress = {
      ...progress,
      completedActivities: updatedActivities,
      lastUpdated: new Date().toISOString()
    };
    saveProgressState(updated);
  };

  // Toggle Project Completion
  const toggleProjectComplete = (projectId: string) => {
    const isDone = progress.completedProjects.includes(projectId);
    const updatedProjects = isDone
      ? progress.completedProjects.filter(id => id !== projectId)
      : [...progress.completedProjects, projectId];

    const updated: StoredCsProgress = {
      ...progress,
      completedProjects: updatedProjects,
      lastUpdated: new Date().toISOString()
    };
    saveProgressState(updated);
  };

  // Toggle Checklist Item
  const toggleChecklistItem = (itemId: string) => {
    const isDone = progress.completedChecklistItems.includes(itemId);
    const updatedItems = isDone
      ? progress.completedChecklistItems.filter(id => id !== itemId)
      : [...progress.completedChecklistItems, itemId];

    const updated: StoredCsProgress = {
      ...progress,
      completedChecklistItems: updatedItems,
      lastUpdated: new Date().toISOString()
    };
    saveProgressState(updated);
  };

  // Handle Mini Concept Check Option Selection
  const handleConceptAnswer = (lessonId: string, optionIndex: number) => {
    const updatedAnswers = { ...userAnswers, [lessonId]: optionIndex };
    setUserAnswers(updatedAnswers);
    const updated: StoredCsProgress = {
      ...progress,
      conceptAnswers: updatedAnswers,
      lastUpdated: new Date().toISOString()
    };
    saveProgressState(updated);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const resetState: StoredCsProgress = {
      completedLessons: [],
      completedActivities: [],
      completedProjects: [],
      completedChecklistItems: [],
      conceptAnswers: {},
      lastUpdated: new Date().toISOString()
    };
    setUserAnswers({});
    saveProgressState(resetState);
    setShowResetConfirm(false);
  };

  // Track Progress Metrics
  const trackLessonIds = currentTrack.lessons.map(l => l.id);
  const completedLessonsInTrack = trackLessonIds.filter(id => progress.completedLessons.includes(id));
  const isActivityDone = progress.completedActivities.includes(currentTrack.id);
  const isProjectDone = progress.completedProjects.includes(currentTrack.project.id);
  const trackChecklistIds = currentTrack.completionChecklist.map(c => c.id);
  const completedChecklistInTrack = trackChecklistIds.filter(id => progress.completedChecklistItems.includes(id));

  const totalTrackItems = currentTrack.lessons.length + 1 + 1 + currentTrack.completionChecklist.length; // lessons + activity + project + checklist
  const totalTrackCompleted = completedLessonsInTrack.length + (isActivityDone ? 1 : 0) + (isProjectDone ? 1 : 0) + completedChecklistInTrack.length;
  const trackPercent = Math.round((totalTrackCompleted / totalTrackItems) * 100);

  // Helper to render track icon
  const getTrackIcon = (iconName: string, isSelected: boolean) => {
    const className = `w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`;
    switch (iconName) {
      case 'Cpu': return <Cpu className={className} />;
      case 'Workflow': return <Workflow className={className} />;
      case 'FileCode2': return <FileCode2 className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      default: return <Code className={className} />;
    }
  };

  // Render Project Interactive Demo
  const renderProjectDemo = (demoId?: string) => {
    switch (demoId) {
      case 'quiz':
        return <InteractiveQuizDemo />;
      case 'volunteer-calc':
        return <VolunteerHoursCalculatorDemo />;
      case 'study-planner':
        return <PersonalStudyPlannerDemo />;
      case 'resource-dir':
        return <ResourceDirectoryDemo />;
      case 'ai-checklist':
        return <ResponsibleAiChecklistDemo />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full text-slate-900 space-y-8 text-left">
      
      {/* ------------------------------------------------------------- */}
      {/* HUB HEADER & BREADCRUMB */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {onBackToOverview && (
              <button
                type="button"
                onClick={onBackToOverview}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← Back to Pathways Overview</span>
              </button>
            )}
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              SVT Learning Hub
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Offline-First Progress (Private Local Storage)</span>
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            CS & AI Beginner Learning Hub
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Five structured, beginner-friendly tracks covering computer architecture, algorithmic logic, Python programming, web development, and responsible AI literacy.
          </p>
        </div>

        {/* Global Reset Button */}
        {(progress.completedLessons.length > 0 || progress.completedProjects.length > 0) && (
          <div className="shrink-0">
            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-red-200 bg-red-50 text-xs">
                <span className="text-xs text-red-700 font-semibold px-1">Reset all hub progress?</span>
                <button
                  type="button"
                  onClick={handleResetProgress}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Reset all progress in CS Hub"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Hub Progress</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5 TRACK NAVIGATION CARDS / TABS */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select a Learning Track (Showing 1 Active Track at a Time)
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500">
            Track {CS_LEARNING_TRACKS.findIndex(t => t.id === selectedTrackId) + 1} of 5
          </span>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          role="tablist"
          aria-label="CS and AI Learning Tracks"
        >
          {CS_LEARNING_TRACKS.map((track, idx) => {
            const isSelected = track.id === selectedTrackId;
            const tLessonIds = track.lessons.map(l => l.id);
            const tLessonsDone = tLessonIds.filter(id => progress.completedLessons.includes(id)).length;
            const tPercent = Math.round((tLessonsDone / track.lessons.length) * 100);
            const isStarted = tLessonsDone > 0;

            return (
              <button
                key={track.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`track-panel-${track.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectTrack(track.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl border ${
                      isSelected ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {getTrackIcon(track.iconName, isSelected)}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      Track 0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold font-display text-slate-900 leading-snug">
                      {track.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress bar in card */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 w-full">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{tLessonsDone}/{track.lessons.length} Lessons</span>
                    <span className={`font-bold ${isStarted ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {tPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${tPercent === 100 ? 'bg-emerald-600' : 'bg-blue-600'}`}
                      style={{ width: `${tPercent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE TRACK DETAILS PANEL */}
      {/* ------------------------------------------------------------- */}
      <div 
        id="cs-track-content"
        role="tabpanel"
        aria-labelledby={`track-tab-${selectedTrackId}`}
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-8 scroll-mt-24"
      >
        
        {/* Track Title & Meta Overview */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Active Track
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Pacing: {currentTrack.estimatedTime}</span>
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              {currentTrack.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentTrack.overview}
            </p>

            {/* Prerequisites and Objectives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              {/* Prerequisites */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Prerequisites
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 list-none p-0 m-0">
                  {currentTrack.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Objectives */}
              <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                  Beginner Learning Objectives
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 list-none p-0 m-0">
                  {currentTrack.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Track Progress Gauge */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 lg:w-64 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Track Progress</span>
              <span className="text-xs font-mono font-bold text-emerald-700">{trackPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${trackPercent === 100 ? 'bg-emerald-600' : 'bg-blue-600'}`}
                style={{ width: `${trackPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Lessons:</span>
                <strong>{completedLessonsInTrack.length} / {currentTrack.lessons.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Activity:</span>
                <strong className={isActivityDone ? 'text-emerald-600' : ''}>{isActivityDone ? 'Done' : 'Pending'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Project:</span>
                <strong className={isProjectDone ? 'text-emerald-600' : ''}>{isProjectDone ? 'Done' : 'Pending'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Checklist:</span>
                <strong>{completedChecklistInTrack.length} / {currentTrack.completionChecklist.length}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: SHORT LESSONS (ACCORDION / PROGRESSIVE DISCLOSURE) */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Short Lessons ({currentTrack.lessons.length} Modules)
              </h4>
            </div>
            <span className="text-xs text-slate-500">
              Click any lesson to expand details & concept check
            </span>
          </div>

          <div className="space-y-3">
            {currentTrack.lessons.map((lesson) => {
              const isExpanded = expandedLessonId === lesson.id;
              const isDone = progress.completedLessons.includes(lesson.id);
              const isAiPrinciplesLesson = lesson.id === 'ai-3';
              const userAns = userAnswers[lesson.id];

              return (
                <div
                  key={lesson.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded 
                      ? 'border-blue-300 bg-white shadow-xs' 
                      : isDone 
                        ? 'border-emerald-200 bg-emerald-50/20' 
                        : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                  }`}
                >
                  {/* Lesson Accordion Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`lesson-body-${lesson.id}`}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                        isDone 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'bg-white border-slate-300 text-slate-700'
                      }`}>
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : `0${lesson.number}`}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {lesson.title}
                          </span>
                          {isAiPrinciplesLesson && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-700" />
                              <span>Core SVT AI Guidelines</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.estimatedMinutes} mins
                          </span>
                          <span>•</span>
                          <span>{lesson.keyPoints.length} key points</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isDone && (
                        <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Completed
                        </span>
                      )}
                      <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Lesson Content */}
                  {isExpanded && (
                    <div 
                      id={`lesson-body-${lesson.id}`}
                      className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-5 text-xs sm:text-sm text-slate-700"
                    >
                      {/* Original SVT Summary */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          SVT Core Explanation
                        </span>
                        <p className="leading-relaxed text-slate-800">
                          {lesson.summary}
                        </p>
                      </div>

                      {/* Key Takeaways */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                          Key Concepts & Rules
                        </span>
                        <ul className="space-y-2 list-none p-0 m-0">
                          {lesson.keyPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <span className="leading-relaxed text-slate-700">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Code Example / Diagram */}
                      {lesson.codeExample && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>{lesson.codeExample.caption}</span>
                            <span className="uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{lesson.codeExample.language}</span>
                          </div>
                          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                            <code>{lesson.codeExample.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Concept Check Question */}
                      {lesson.conceptCheck && (
                        <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                            <HelpCircle className="w-4 h-4 text-blue-600" />
                            <span>Quick Concept Check</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900">
                            {lesson.conceptCheck.question}
                          </p>
                          <div className="space-y-2">
                            {lesson.conceptCheck.options.map((opt, optIdx) => {
                              const isSelected = userAns === optIdx;
                              const isCorrect = optIdx === lesson.conceptCheck?.correctIndex;
                              const showFeedback = userAns !== undefined;

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleConceptAnswer(lesson.id, optIdx)}
                                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer min-h-[44px] ${
                                    showFeedback && isSelected
                                      ? isCorrect
                                        ? 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold'
                                        : 'bg-red-100/70 border-red-400 text-red-950'
                                      : isSelected
                                        ? 'bg-blue-100 border-blue-400 font-semibold'
                                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {showFeedback && isSelected && (
                                    <span className="text-[10px] font-bold ml-2 shrink-0">
                                      {isCorrect ? '✓ Correct' : '✕ Try Again'}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {userAns !== undefined && (
                            <p className="text-[11px] text-slate-600 pt-1 border-t border-blue-100 leading-relaxed">
                              <strong>Explanation:</strong> {lesson.conceptCheck.explanation}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Complete Lesson Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleLessonComplete(lesson.id)}
                          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isDone 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{isDone ? 'Marked Complete (Click to Undo)' : 'Mark Lesson Complete'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: PRACTICAL ACTIVITY */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Track Hands-On Activity • {currentTrack.practicalActivity.estimatedMinutes} Mins
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {currentTrack.practicalActivity.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleActivityComplete(currentTrack.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isActivityDone
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isActivityDone ? 'Activity Completed' : 'Mark Activity Done'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Objective:</strong> {currentTrack.practicalActivity.objective}
          </p>

          <div className="text-xs text-slate-600">
            <strong>Materials Needed:</strong> {currentTrack.practicalActivity.materialsNeeded}
          </div>

          {/* Step by step instructions */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Step-by-Step Instructions
            </span>
            <ol className="space-y-2 list-none p-0 m-0">
              {currentTrack.practicalActivity.stepByStepGuide.map((step, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <strong>Expected Output:</strong> {currentTrack.practicalActivity.expectedOutput}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            💡 <strong>Pro Tip:</strong> {currentTrack.practicalActivity.proTip}
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: SMALL ORIGINAL PROJECT & WORKING INTERACTIVE DEMO */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Track Applied Project • {currentTrack.project.type}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentTrack.project.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleProjectComplete(currentTrack.project.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isProjectDone
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProjectDone ? 'Project Completed' : 'Mark Project Done'}</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs sm:text-sm text-slate-700">
            <p className="leading-relaxed text-slate-800">
              {currentTrack.project.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Core Project Features
                </span>
                <ul className="space-y-1 text-xs text-slate-700 list-none p-0 m-0">
                  {currentTrack.project.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Deliverable Criteria
                </span>
                <ul className="space-y-1 text-xs text-slate-700 list-none p-0 m-0">
                  {currentTrack.project.deliverableCriteria.map((crit, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Working Demo Sandbox */}
          {currentTrack.project.interactiveDemoId && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Interactive Reference Implementation (SVT Sandbox)
              </span>
              {renderProjectDemo(currentTrack.project.interactiveDemoId)}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: TRACK COMPLETION CHECKLIST */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Track Completion Checklist
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentTrack.completionChecklist.map((item) => {
              const isChecked = progress.completedChecklistItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-300 text-slate-900'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: VERIFIED FREE EXTERNAL RESOURCES */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Verified Free External Resources (Official Documentation & Courses)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentTrack.verifiedResources.map((res, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {res.format}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      100% Free
                    </span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {res.title}
                  </h5>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Provider: {res.provider}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                    <strong>SVT Summary:</strong> {res.svtSummary}
                  </p>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[40px] px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Official Resource</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 6: CLEAR NEXT STEP */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 rounded-3xl border border-blue-100 bg-blue-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Recommended Next Step
            </span>
            <h4 className="text-base font-bold text-slate-900">
              {currentTrack.nextStep.title}
            </h4>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {currentTrack.nextStep.recommendation}
            </p>
          </div>

          {currentTrack.nextStep.suggestedTrackId && (
            <button
              type="button"
              onClick={() => handleSelectTrack(currentTrack.nextStep.suggestedTrackId!)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-xs"
            >
              <span>Continue to Next Track</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PEER LEARNING & NON-ACCREDITATION DISCLAIMER */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-6 border-t border-slate-200 flex items-start gap-3 text-xs text-slate-500 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>Educational & Peer Learning Disclaimer:</strong> The Scholars Volunteer Team (SVT) is an independent, student-led volunteer initiative. Completing these tracks or interactive projects does not award an accredited university degree, official state certification, or professional license. All course references, external software, and trademarks (Harvard CS50, Python, W3C, MDN, Google, UNESCO) are the property of their respective owners.
          </p>
        </div>

      </div>
    </div>
  );
}
