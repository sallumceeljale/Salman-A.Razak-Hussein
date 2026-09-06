import { UniversityApplicationPlan } from '../components/university/PersonalApplicationPlanner';

export type { UniversityApplicationPlan };
export const GLOBAL_PLANNER_STORAGE_KEY = 'svt_global_university_applications_planner_v1';
export const SAVED_UNIVERSITIES_EVENT = 'svt_saved_universities_updated';

export function getSavedApplications(): UniversityApplicationPlan[] {
  try {
    const raw = localStorage.getItem(GLOBAL_PLANNER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Error reading saved university applications from localStorage:', err);
    return [];
  }
}

export function saveApplications(apps: UniversityApplicationPlan[]): void {
  try {
    localStorage.setItem(GLOBAL_PLANNER_STORAGE_KEY, JSON.stringify(apps));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SAVED_UNIVERSITIES_EVENT, { detail: { count: apps.length } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (err) {
    console.error('Error saving university applications to localStorage:', err);
  }
}

export function isUniversitySaved(name: string): boolean {
  const apps = getSavedApplications();
  const target = name.trim().toLowerCase();
  return apps.some(app => app.universityName.trim().toLowerCase() === target);
}

export function toggleSaveUniversity(item: {
  name: string;
  countryId: string;
  portalUrl?: string;
  deadline?: string;
  notes?: string;
}): { isSaved: boolean; applications: UniversityApplicationPlan[] } {
  const current = getSavedApplications();
  const target = item.name.trim().toLowerCase();
  const exists = current.some(app => app.universityName.trim().toLowerCase() === target);

  let updated: UniversityApplicationPlan[];
  let isSaved = false;

  if (exists) {
    updated = current.filter(app => app.universityName.trim().toLowerCase() !== target);
    isSaved = false;
  } else {
    const newEntry: UniversityApplicationPlan = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      countryId: item.countryId as any,
      universityName: item.name.trim(),
      program: 'Undergraduate Program',
      deadline: item.deadline || 'Regular Decision',
      status: 'researching',
      portalUrl: item.portalUrl || undefined,
      checklist: {
        transcripts: false,
        recommendations: false,
        personalStatement: false,
        languageTest: false,
        standardizedTest: false,
        financialDocuments: false
      },
      notes: item.notes || `Saved from directory`,
      createdAt: new Date().toISOString()
    };
    updated = [newEntry, ...current];
    isSaved = true;
  }

  saveApplications(updated);
  return { isSaved, applications: updated };
}

export function removeSavedApplication(id: string): UniversityApplicationPlan[] {
  const current = getSavedApplications();
  const updated = current.filter(app => app.id !== id);
  saveApplications(updated);
  return updated;
}

export function subscribeToSavedUniversities(
  callback: (apps: UniversityApplicationPlan[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(getSavedApplications());
  };

  window.addEventListener(SAVED_UNIVERSITIES_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);
  window.addEventListener('focus', handleUpdate);

  return () => {
    window.removeEventListener(SAVED_UNIVERSITIES_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
    window.removeEventListener('focus', handleUpdate);
  };
}
