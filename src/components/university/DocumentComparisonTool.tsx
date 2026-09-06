import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowLeftRight, ExternalLink, Check, Info } from 'lucide-react';
import { DOCUMENT_COMPARISON_MATRIX } from '../../data/documentComparisonData';
import { DESTINATION_GUIDES } from '../../data/destinationGuidesData';
import { UniversityDestinationId, RequirementLevel, ComparisonRating } from '../../types/universityApplications';

interface DocumentComparisonToolProps {
  onBack: () => void;
  onSelectDestination?: (id: UniversityDestinationId) => void;
}

export const DocumentComparisonTool: React.FC<DocumentComparisonToolProps> = ({
  onBack,
  onSelectDestination
}) => {
  const [countryAId, setCountryAId] = useState<UniversityDestinationId>('united-states');
  const [countryBId, setCountryBId] = useState<UniversityDestinationId>('germany');

  const guideA = useMemo(() => {
    return DESTINATION_GUIDES.find(d => d.id === countryAId) || DESTINATION_GUIDES[0];
  }, [countryAId]);

  const guideB = useMemo(() => {
    return DESTINATION_GUIDES.find(d => d.id === countryBId) || DESTINATION_GUIDES[1];
  }, [countryBId]);

  const handleSwap = () => {
    const temp = countryAId;
    setCountryAId(countryBId);
    setCountryBId(temp);
  };

  const renderBadge = (rating: ComparisonRating | RequirementLevel) => {
    switch (rating) {
      case 'common':
      case 'commonly-required':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Common
          </span>
        );
      case 'sometimes':
      case 'sometimes-required':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            Sometimes
          </span>
        );
      case 'program-specific':
      case 'required-for-certain-programs':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            Program-Specific
          </span>
        );
      case 'after-admission':
      case 'required-after-admission':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            After Admission
          </span>
        );
      case 'usually-not-required':
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Usually Not Required
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Verify
          </span>
        );
    }
  };

  // 15 comparison categories
  const comparisonItems = [
    {
      id: 'cat-main-route',
      name: 'Main Application Route',
      description: 'The standard system or portal used to submit initial undergraduate applications.',
      customComparison: true,
      countryA: {
        badge: 'common' as ComparisonRating,
        detail: guideA.primaryApplicationRoute || 'Direct application'
      },
      countryB: {
        badge: 'common' as ComparisonRating,
        detail: guideB.primaryApplicationRoute || 'Direct application'
      }
    },
    ...DOCUMENT_COMPARISON_MATRIX.map(doc => ({
      id: doc.id,
      name: doc.documentName,
      description: doc.description,
      customComparison: false,
      countryA: {
        badge: doc.countryRatings[countryAId]?.rating || 'verify',
        detail: doc.countryRatings[countryAId]?.note || 'Verify directly with university requirements.'
      },
      countryB: {
        badge: doc.countryRatings[countryBId]?.rating || 'verify',
        detail: doc.countryRatings[countryBId]?.note || 'Verify directly with university requirements.'
      }
    }))
  ];

  return (
    <div className="space-y-8" id="document-comparison-tool-container">
      {/* Top Header */}
      <div className="space-y-3 border-b border-slate-200 pb-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          id="btn-back-from-comparison"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All Destinations</span>
        </button>

        <div className="space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Compare Application Requirements
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            Select any two countries to view their application pathways and required documents side by side.
          </p>
        </div>
      </div>

      {/* Country Selectors */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* First Country Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label htmlFor="select-country-a" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              First Country
            </label>
            <div className="relative">
              <select
                id="select-country-a"
                value={countryAId}
                onChange={(e) => setCountryAId(e.target.value as UniversityDestinationId)}
                className="w-full min-h-[44px] px-4 py-2.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {DESTINATION_GUIDES.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.flagEmoji || d.flag} {d.countryName || d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex items-center justify-center pt-2 md:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap the two selected countries"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Second Country Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label htmlFor="select-country-b" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Second Country
            </label>
            <div className="relative">
              <select
                id="select-country-b"
                value={countryBId}
                onChange={(e) => setCountryBId(e.target.value as UniversityDestinationId)}
                className="w-full min-h-[44px] px-4 py-2.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {DESTINATION_GUIDES.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.flagEmoji || d.flag} {d.countryName || d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison List: Stacks on mobile, clean side-by-side rows on desktop */}
      <div className="space-y-4" id="comparison-rows-list">
        {comparisonItems.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs"
            >
              {/* Row Header */}
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {item.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Two Column Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country A Result */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{guideA.flagEmoji || guideA.flag}</span>
                      <span>{guideA.countryName || guideA.name}</span>
                    </span>
                    {renderBadge(item.countryA.badge)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {item.countryA.detail}
                  </p>
                </div>

                {/* Country B Result */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{guideB.flagEmoji || guideB.flag}</span>
                      <span>{guideB.countryName || guideB.name}</span>
                    </span>
                    {renderBadge(item.countryB.badge)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {item.countryB.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Links for Both Countries */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="text-sm text-slate-600">
          Ready to explore full timelines, requirements, and funding for either destination?
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onSelectDestination && (
            <>
              <button
                type="button"
                onClick={() => onSelectDestination(guideA.id)}
                className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Open {guideA.countryName || guideA.name} Guide
              </button>
              <button
                type="button"
                onClick={() => onSelectDestination(guideB.id)}
                className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Open {guideB.countryName || guideB.name} Guide
              </button>
            </>
          )}
        </div>
      </div>

      {/* Independent Student Guidance */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-1">
        <div className="font-bold text-slate-900 text-xs">
          Independent Student Guidance
        </div>
        <p className="leading-relaxed">
          SVT summarizes common application processes using official resources. Requirements and policies can change, so students should confirm every important detail with the university or responsible government platform.
        </p>
      </div>
    </div>
  );
};
