/**
 * SVT Honest Learning Storage
 * 
 * Standard 3 Guidelines:
 * - Distinguish: Opened, Practised, Completed independently, Revisited / Saved for review.
 * - Only record states supported by actual interaction or clearly labeled student self-report.
 * - Do not infer mastery from video completion or time spent.
 * - Provide clear factual evidence (e.g., "Answered correctly without using an SVT hint", "Self-reviewed draft").
 */

export interface PracticeQuestionState {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  hintsViewed: number; // 0, 1, 2...
  attemptCount: number;
  completedWithoutHints: boolean;
}

export interface LessonProgressData {
  lessonId: string;
  hasOpened: boolean;
  openedAt?: string;
  lastAccessedAt?: string;
  
  // Starting task
  startingTaskResponse?: string;
  skippedStartingTask?: boolean;

  // Video interaction
  watchedVideo?: boolean;

  // Guided Practice
  practiceStates: Record<string, PracticeQuestionState>;

  // Independent Writing
  independentDraft: string;
  independentWordCount: number;
  lastSavedDraftAt?: string;

  // Self-Review
  selfReviewChecklist: Record<string, boolean>; // id -> checked
  completedSelfReview: boolean;

  // Reflection
  reflectionResponse?: string;
  serviceReflectionResponse?: string;

  // Review Status
  savedForReview: boolean;
}

const STORAGE_PREFIX = 'svt_honest_learning_unit_';
export const STORAGE_DISCLOSURE_NOTICE = 
  'Your draft and practice responses are stored locally in this browser. Clearing this site’s data in your browser settings will remove saved work; clearing cache alone does not necessarily do so. This work does not automatically sync to other devices.';

export function getLessonProgress(lessonId: string): LessonProgressData {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${lessonId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        lessonId,
        hasOpened: true,
        practiceStates: parsed.practiceStates || {},
        selfReviewChecklist: parsed.selfReviewChecklist || {},
        completedSelfReview: !!parsed.completedSelfReview,
        independentDraft: parsed.independentDraft || '',
        independentWordCount: parsed.independentWordCount || 0,
        savedForReview: !!parsed.savedForReview,
        startingTaskResponse: parsed.startingTaskResponse || '',
        skippedStartingTask: !!parsed.skippedStartingTask,
        watchedVideo: !!parsed.watchedVideo,
        reflectionResponse: parsed.reflectionResponse || '',
        serviceReflectionResponse: parsed.serviceReflectionResponse || '',
        openedAt: parsed.openedAt || new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      };
    }
  } catch (err) {
    console.warn(`Error reading learning storage for ${lessonId}:`, err);
  }

  return {
    lessonId,
    hasOpened: true,
    openedAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    practiceStates: {},
    selfReviewChecklist: {},
    completedSelfReview: false,
    independentDraft: '',
    independentWordCount: 0,
    savedForReview: false
  };
}

export function saveLessonProgress(data: LessonProgressData): void {
  try {
    const payload = {
      ...data,
      lastAccessedAt: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_PREFIX}${data.lessonId}`, JSON.stringify(payload));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('svt_learning_progress_updated', { detail: { lessonId: data.lessonId } }));
    }
  } catch (err) {
    console.error(`Error saving learning storage for ${data.lessonId}:`, err);
  }
}

export function resetLessonProgress(lessonId: string): LessonProgressData {
  const fresh: LessonProgressData = {
    lessonId,
    hasOpened: true,
    openedAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    practiceStates: {},
    selfReviewChecklist: {},
    completedSelfReview: false,
    independentDraft: '',
    independentWordCount: 0,
    savedForReview: false,
    startingTaskResponse: '',
    skippedStartingTask: false,
    watchedVideo: false,
    reflectionResponse: '',
    serviceReflectionResponse: ''
  };
  saveLessonProgress(fresh);
  return fresh;
}
