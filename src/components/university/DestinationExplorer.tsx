import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, ExternalLink, BookOpen, Languages, Calendar } from 'lucide-react';
import { DESTINATION_GUIDES } from '../../data/destinationGuidesData';
import { UniversityDestinationId } from '../../types/universityApplications';

interface DestinationExplorerProps {
  onSelectDestination: (id: UniversityDestinationId) => void;
  onOpenComparison: () => void;
  onOpenTestsGuide: () => void;
  onOpenPlanner: () => void;
  completedStepsMap?: Record<string, string[]>;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestination,
  onOpenComparison,
  onOpenTestsGuide,
  onOpenPlanner,
  completedStepsMap = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DESTINATION_GUIDES;

    return DESTINATION_GUIDES.filter(dest => {
      const cName = (dest.countryName || dest.name || '').toLowerCase();
      const cTag = (dest.subtitle || dest.tagline || dest.summary || '').toLowerCase();
      const cRoute = (dest.primaryApplicationRoute || dest.centralPortalName || '').toLowerCase();

      return cName.includes(q) || cTag.includes(q) || cRoute.includes(q);
    });
  }, [searchQuery]);

  return (
    <div className="space-y-8" id="destination-explorer-container">
      {/* Editorial Introduction */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs" id="destination-explorer-header">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Explore University Applications by Country
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Choose a destination to understand its usual application process, common documents, language requirements, funding options, and official resources.
          </p>
          <p className="text-sm text-slate-500">
            Requirements differ by university and program. Always confirm the details on the institution’s official website.
          </p>
        </div>

        {/* Secondary Utility Links */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-sm">
          <button
            type="button"
            onClick={onOpenComparison}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 inline-flex items-center gap-2 font-medium transition-colors cursor-pointer"
            id="btn-compare-documents"
          >
            <BookOpen className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Comparison Tool</span>
          </button>
          <button
            type="button"
            onClick={onOpenTestsGuide}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 inline-flex items-center gap-2 font-medium transition-colors cursor-pointer"
            id="btn-tests-language-guide"
          >
            <Languages className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Test & Language Guide</span>
          </button>
          <button
            type="button"
            onClick={onOpenPlanner}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 inline-flex items-center gap-2 font-medium transition-colors cursor-pointer"
            id="btn-my-application-planner"
          >
            <Calendar className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Application Planner</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3" id="destination-filters-bar">
        <div className="relative">
          <label htmlFor="destination-search-input" className="sr-only">
            Search study destinations
          </label>
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="destination-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country or application route (e.g. United States, UCAS, uni-assist)..."
            className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear destination search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1" aria-live="polite">
          <span>Showing {filteredDestinations.length} of {DESTINATION_GUIDES.length} destinations</span>
        </div>
      </div>

      {/* 10 Destination Cards Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      {filteredDestinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3" id="empty-destinations-state">
          <h2 className="text-base font-semibold text-slate-900">No destinations match your search</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try searching for a different country name or clear your search input.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="destinations-grid">
          {filteredDestinations.map((dest) => {
            const flag = dest.flagEmoji || dest.flag;
            const countryName = dest.countryName || dest.name;
            const description = dest.summary || dest.subtitle || dest.tagline;
            const mainRoute = dest.primaryApplicationRoute || dest.centralPortalName;

            return (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
                id={`destination-card-${dest.id}`}
              >
                <div className="space-y-3">
                  {/* Flag & Country Name */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl leading-none select-none" aria-hidden="true">
                      {flag}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {countryName}
                    </h2>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {description}
                  </p>

                  {/* Main Route */}
                  <div className="pt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Main route: </span>
                    <span>{mainRoute}</span>
                  </div>
                </div>

                {/* View Guide Action Link */}
                <div className="pt-6 mt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectDestination(dest.id)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs group"
                    id={`btn-open-guide-${dest.id}`}
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Independent Student Guidance Note */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-sm text-slate-600 space-y-1.5" id="destination-explorer-footer-advisory">
        <h2 className="font-bold text-slate-900 text-sm">
          Independent Student Guidance
        </h2>
        <p className="text-slate-600 leading-relaxed text-sm">
          SVT summarizes common application processes using official resources. Requirements and policies can change, so students should confirm every important detail with the university or responsible government platform.
        </p>
      </div>
    </div>
  );
};
