import { UniversityDirectoryEntry } from './types';
import { UNITED_STATES_UNIVERSITIES } from './unitedStates';
import { SAUDI_ARABIA_UNIVERSITIES } from './saudiArabia';
import { TURKIYE_UNIVERSITIES } from './turkiye';
import { CANADA_UNIVERSITIES } from './canada';
import { UNITED_KINGDOM_UNIVERSITIES } from './unitedKingdom';
import { GERMANY_UNIVERSITIES } from './germany';
import { AUSTRALIA_UNIVERSITIES } from './australia';
import { FRANCE_UNIVERSITIES } from './france';
import { NETHERLANDS_UNIVERSITIES } from './netherlands';
import { MALAYSIA_UNIVERSITIES } from './malaysia';

export * from './types';
export { UNITED_STATES_UNIVERSITIES } from './unitedStates';
export { SAUDI_ARABIA_UNIVERSITIES } from './saudiArabia';
export { TURKIYE_UNIVERSITIES } from './turkiye';
export { CANADA_UNIVERSITIES } from './canada';
export { UNITED_KINGDOM_UNIVERSITIES } from './unitedKingdom';
export { GERMANY_UNIVERSITIES } from './germany';
export { AUSTRALIA_UNIVERSITIES } from './australia';
export { FRANCE_UNIVERSITIES } from './france';
export { NETHERLANDS_UNIVERSITIES } from './netherlands';
export { MALAYSIA_UNIVERSITIES } from './malaysia';

const COUNTRY_UNIVERSITIES_MAP: Record<string, UniversityDirectoryEntry[]> = {
  'united-states': UNITED_STATES_UNIVERSITIES,
  'saudi-arabia': SAUDI_ARABIA_UNIVERSITIES,
  'turkiye': TURKIYE_UNIVERSITIES,
  'canada': CANADA_UNIVERSITIES,
  'united-kingdom': UNITED_KINGDOM_UNIVERSITIES,
  'germany': GERMANY_UNIVERSITIES,
  'australia': AUSTRALIA_UNIVERSITIES,
  'france': FRANCE_UNIVERSITIES,
  'netherlands': NETHERLANDS_UNIVERSITIES,
  'malaysia': MALAYSIA_UNIVERSITIES,
};

export function getUniversitiesByCountry(countryId: string): UniversityDirectoryEntry[] {
  return COUNTRY_UNIVERSITIES_MAP[countryId] || [];
}

export function hasUniversityDirectory(countryId: string): boolean {
  const list = COUNTRY_UNIVERSITIES_MAP[countryId];
  return Boolean(list && list.length > 0);
}
