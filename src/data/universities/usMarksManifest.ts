import { UniversityMarkRecord } from './types';
import { UNITED_STATES_UNIVERSITIES } from './unitedStates';

export const US_MARKS_MANIFEST: UniversityMarkRecord[] = UNITED_STATES_UNIVERSITIES.map(u => ({
  universityId: u.id,
  officialDomain: u.officialWebsite,
  localAssetPath: u.logoPath,
  sourceUrl: u.officialWebsite,
  sourceType: u.logoPath ? 'site-icon' : 'unresolved',
  reviewed: false
}));

export const US_MARKS_MAP: Record<string, UniversityMarkRecord> = US_MARKS_MANIFEST.reduce(
  (acc, item) => {
    acc[item.universityId] = item;
    return acc;
  },
  {} as Record<string, UniversityMarkRecord>
);

