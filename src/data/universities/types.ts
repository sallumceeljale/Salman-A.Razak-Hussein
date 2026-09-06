export type InstitutionType =
  | 'private-university'
  | 'public-university'
  | 'liberal-arts-college';

export interface UniversityDirectoryEntry {
  id: string;
  name: string;
  aliases: string[];
  country: string;
  institutionType: InstitutionType;
  officialWebsite: string;
  logoAsset?: string;
  logoPath?: string;
  monogram?: string;
  internationalAdmissionsUrl?: string;
  financialAidUrl?: string;
  lastReviewed?: string;
}

export type MarkSourceType =
  | 'apple-touch-icon'
  | 'site-icon'
  | 'approved-brand-asset'
  | 'manual'
  | 'unresolved';

export interface UniversityMarkRecord {
  universityId: string;
  officialDomain: string;
  localAssetPath?: string;
  sourceUrl?: string;
  sourceType: MarkSourceType;
  reviewed: boolean;
}
