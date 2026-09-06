import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ExternalLink, Bookmark, Check, ArrowRight, Sparkles } from 'lucide-react';
import { UniversityDirectoryEntry, InstitutionType } from '../../data/universities/types';
import { getUniversitiesByCountry } from '../../data/universities';
import { UniversityDestinationId } from '../../types/universityApplications';
import { UniversityIdentity } from './UniversityIdentity';
import { 
  getSavedApplications, 
  toggleSaveUniversity, 
  subscribeToSavedUniversities 
} from '../../utils/universityStorage';

interface UniversityDirectorySearchProps {
  countryId: UniversityDestinationId;
  countryName: string;
  onOpenPlanner?: () => void;
}

// Common stop words to exclude from single-character word matching
const STOP_WORDS = new Set(['the', 'of', 'in', 'at', 'and', 'for', 'university', 'college', 'institute', 'state']);

function getInstitutionTypeLabel(type: InstitutionType): string {
  switch (type) {
    case 'private-university':
      return 'Private University';
    case 'public-university':
      return 'Public University';
    case 'liberal-arts-college':
      return 'Liberal Arts College';
    default:
      return 'University';
  }
}

function normalizeSearchText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[–—\-.,'/()]/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const UniversityDirectorySearch: React.FC<UniversityDirectorySearchProps> = ({
  countryId,
  countryName,
  onOpenPlanner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Saved universities from localStorage
  const [savedUniNames, setSavedUniNames] = useState<string[]>(() => {
    return getSavedApplications().map(item => item.universityName);
  });

  const allUniversities = useMemo(() => {
    const list = getUniversitiesByCountry(countryId);
    // Sort alphabetically by default
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [countryId]);

  // Extract all available starting letters from institution names
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const u of allUniversities) {
      const cleanName = u.name.replace(/^the\s+/i, '').trim();
      if (cleanName.length > 0) {
        set.add(cleanName[0].toUpperCase());
      }
    }
    return Array.from(set).sort();
  }, [allUniversities]);

  // Sync saved list from real-time events
  useEffect(() => {
    const unsubscribe = subscribeToSavedUniversities((apps) => {
      setSavedUniNames(apps.map(item => item.universityName));
    });
    return () => unsubscribe();
  }, []);

  // Filtered and Scored list
  const filteredUniversities = useMemo(() => {
    let list = allUniversities;

    // Apply institution type filter
    if (selectedTypeFilter !== 'all') {
      list = list.filter(u => u.institutionType === selectedTypeFilter);
    }

    const trimmedQuery = searchQuery.trim();

    // 1. If user clicked a letter filter and there's no custom text search
    if (selectedLetter && !trimmedQuery) {
      const letterLower = selectedLetter.toLowerCase();
      return list.filter(u => {
        const cleanName = u.name.replace(/^the\s+/i, '').toLowerCase();
        return cleanName.startsWith(letterLower);
      });
    }

    // 2. If no search query and no letter filter, return the entire sorted list of 100 institutions
    if (!trimmedQuery) {
      return list;
    }

    const normalizedQuery = normalizeSearchText(trimmedQuery);
    const queryUpper = trimmedQuery.toUpperCase();

    // 3. Single-character search (e.g. typing "S" or "M")
    if (normalizedQuery.length === 1) {
      const letter = normalizedQuery;

      const tier1: UniversityDirectoryEntry[] = []; // direct name starts with letter (e.g. Stanford, Syracuse)
      const tier2: UniversityDirectoryEntry[] = []; // alias starts with letter (e.g. SUNY Buffalo)
      const tier3: UniversityDirectoryEntry[] = []; // major word starts with letter (e.g. Southern California, San Diego)

      for (const uni of list) {
        const normName = normalizeSearchText(uni.name);
        const strippedName = normName.startsWith('the ') ? normName.slice(4) : normName;

        if (strippedName.startsWith(letter)) {
          tier1.push(uni);
          continue;
        }

        if (uni.aliases.some(a => normalizeSearchText(a).startsWith(letter))) {
          tier2.push(uni);
          continue;
        }

        const words = strippedName.split(' ').filter(w => !STOP_WORDS.has(w));
        if (words.some(w => w.startsWith(letter))) {
          tier3.push(uni);
        }
      }

      tier1.sort((a, b) => a.name.localeCompare(b.name));
      tier2.sort((a, b) => a.name.localeCompare(b.name));
      tier3.sort((a, b) => a.name.localeCompare(b.name));

      return [...tier1, ...tier2, ...tier3];
    }

    // 4. Multi-character search (e.g. "St", "Stan", "Harvard", "MIT", "NYU", "Caltech")
    interface ScoredItem {
      uni: UniversityDirectoryEntry;
      score: number;
    }

    const scored: ScoredItem[] = [];

    for (const uni of list) {
      const normName = normalizeSearchText(uni.name);
      const strippedName = normName.startsWith('the ') ? normName.slice(4) : normName;
      let score = 0;

      // Exact alias match (e.g. "MIT", "NYU", "UCLA", "Caltech", "UPenn", "WashU", "W&L")
      for (const alias of uni.aliases) {
        if (alias.toUpperCase() === queryUpper || normalizeSearchText(alias) === normalizedQuery) {
          score = 1000;
          break;
        }
      }

      // Exact name match
      if (!score && (normName === normalizedQuery || strippedName === normalizedQuery)) {
        score = 900;
      }

      // Name starts with query
      if (!score && (normName.startsWith(normalizedQuery) || strippedName.startsWith(normalizedQuery))) {
        score = 800;
      }

      // Any alias starts with query
      if (!score) {
        for (const alias of uni.aliases) {
          if (alias.toUpperCase().startsWith(queryUpper) || normalizeSearchText(alias).startsWith(normalizedQuery)) {
            score = 700;
            break;
          }
        }
      }

      // Significant word in name starts with query (e.g. "California", "San Diego", "Austin")
      if (!score) {
        const words = strippedName.split(' ');
        if (words.some(w => w.startsWith(normalizedQuery))) {
          score = 650;
        }
      }

      // Substring in alias
      if (!score) {
        for (const alias of uni.aliases) {
          if (normalizeSearchText(alias).includes(normalizedQuery)) {
            score = 500;
            break;
          }
        }
      }

      // Substring in name
      if (!score && normName.includes(normalizedQuery)) {
        score = 400;
      }

      // Multi-word query where all words appear in name or aliases
      if (!score) {
        const queryWords = normalizedQuery.split(' ').filter(Boolean);
        if (queryWords.length > 1) {
          const combined = `${normName} ${uni.aliases.map(normalizeSearchText).join(' ')}`;
          if (queryWords.every(qw => combined.includes(qw))) {
            score = 300;
          }
        }
      }

      if (score > 0) {
        scored.push({ uni, score });
      }
    }

    scored.sort((a, b) => b.score - a.score || a.uni.name.localeCompare(b.uni.name));
    return scored.map(item => item.uni);
  }, [allUniversities, searchQuery, selectedLetter, selectedTypeFilter]);

  const handleToggleSave = (uni: UniversityDirectoryEntry) => {
    try {
      const result = toggleSaveUniversity({
        name: uni.name,
        countryId: uni.country || (countryId as any) || 'united-states',
        portalUrl: uni.officialWebsite,
        deadline: 'Regular Decision',
        notes: `Added from ${countryName} Directory`
      });
      setSavedUniNames(result.applications.map(item => item.universityName));
    } catch (e) {
      console.error('Failed to update saved university', e);
    }
  };

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter && !searchQuery) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
      setSearchQuery(letter);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedLetter(null);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Determine active letter from search query if single letter
  const activeLetter = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length === 1) {
      return trimmed.toUpperCase();
    }
    return selectedLetter;
  }, [searchQuery, selectedLetter]);

  const isFiltering = searchQuery.trim().length > 0 || selectedLetter !== null || selectedTypeFilter !== 'all';

  return (
    <div className="space-y-6" id="university-directory-search-container">
      {/* Search & Filter Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {countryName} University Directory
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Browse all 100 official institutions with verified admissions websites, or type any letter to filter instantly.
            </p>
          </div>

          {onOpenPlanner && savedUniNames.length > 0 && (
            <button
              type="button"
              onClick={onOpenPlanner}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto py-2 px-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 transition-colors"
            >
              <span>View My List ({savedUniNames.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Input Bar with integrated Search Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <label htmlFor="search-university-input" className="sr-only">
              Search universities by name or letter
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              ref={searchInputRef}
              id="search-university-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim().length === 1) {
                  setSelectedLetter(val.trim().toUpperCase());
                } else if (!val.trim()) {
                  setSelectedLetter(null);
                }
              }}
              placeholder="Search by name or write a letter (e.g. write S for Stanford, Syracuse, or type MIT, Harvard, UCLA)..."
              className="w-full min-h-[48px] pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search input"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
            className="min-h-[48px] px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
            id="btn-trigger-university-search"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Search</span>
          </button>
        </div>

        {/* Alphabet Quick Jump Ribbon */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Quick filter by letter:</span>
            {isFiltering && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin no-scrollbar"
            role="group"
            aria-label="Filter universities by first letter"
          >
            <button
              type="button"
              onClick={() => {
                setSelectedLetter(null);
                setSearchQuery('');
              }}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                !activeLetter && !searchQuery.trim()
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All (100)
            </button>
            {availableLetters.map(letter => {
              const isSelected = activeLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleLetterClick(letter)}
                  className={`min-h-[36px] w-9 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Show universities starting with ${letter}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Institution Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100" role="group" aria-label="Filter by institution type">
          {[
            { id: 'all', label: 'All Types (100)' },
            { id: 'private-university', label: 'Private Universities' },
            { id: 'public-university', label: 'Public Universities' },
            { id: 'liberal-arts-college', label: 'Liberal Arts Colleges' }
          ].map(f => {
            const isSelected = selectedTypeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedTypeFilter(f.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Status Result Count Announcement */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1" aria-live="polite">
          <span className="font-semibold text-slate-800">
            {searchQuery.trim()
              ? `Showing ${filteredUniversities.length} ${filteredUniversities.length === 1 ? 'university' : 'universities'} matching "${searchQuery.trim()}"`
              : selectedLetter
              ? `Showing ${filteredUniversities.length} universities starting with "${selectedLetter}"`
              : `Showing all ${filteredUniversities.length} universities across the United States`}
          </span>
          {isFiltering && (
            <span className="text-slate-400">
              {filteredUniversities.length} of {allUniversities.length} total
            </span>
          )}
        </div>
      </div>

      {/* Results Grid: All universities displayed right in front of the user */}
      {filteredUniversities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <p className="text-base font-semibold text-slate-800">
            No universities found matching "{searchQuery}"
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for a different letter (e.g. S, M, H), full name, abbreviation (e.g. MIT, CMU, NYU), or resetting your filters.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="min-h-[44px] px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Show All 100 Universities
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="university-results-grid">
            {filteredUniversities.map((uni) => {
              const isSaved = savedUniNames.includes(uni.name);

              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <UniversityIdentity
                      name={uni.name}
                      logoPath={uni.logoPath}
                      monogram={uni.monogram}
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        <a
                          href={uni.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-sm"
                        >
                          {uni.name}
                        </a>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {getInstitutionTypeLabel(uni.institutionType)}
                      </p>
                      {uni.aliases.length > 0 && (
                        <p className="text-xs text-slate-400 truncate">
                          {uni.aliases.slice(0, 3).join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs font-semibold">
                    <a
                      href={uni.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors min-h-[44px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg"
                    >
                      <span>Official Website</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleToggleSave(uni)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        isSaved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      aria-label={isSaved ? `Remove ${uni.name} from My List` : `Save ${uni.name} to My List`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Save to My List</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trademark and Independence Notice */}
      <div className="text-center text-xs text-slate-400 pt-4 max-w-2xl mx-auto leading-relaxed border-t border-slate-100">
        University names and marks belong to their respective institutions. They are shown only to help students identify official institutions. SVT is independent and is not affiliated with or endorsed by these universities.
      </div>
    </div>
  );
};
