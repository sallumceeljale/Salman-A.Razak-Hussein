import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { VERIFIED_UNIVERSITIES } from '../../data/universityApplicationsData';
import { UniversityReference, FinancialAidPolicy } from '../../types/universityApplications';

export default function NeedBlindPolicyDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<FinancialAidPolicy | 'all'>('all');

  const usUniversities = VERIFIED_UNIVERSITIES.filter(u => u.destination === 'united-states');

  const needBlindList = usUniversities.filter(u => u.financialAidPolicy === 'need-blind');
  const needAwareList = usUniversities.filter(u => u.financialAidPolicy === 'need-aware');
  const verifyList = usUniversities.filter(u => u.financialAidPolicy === 'verify' || u.financialAidPolicy === 'not-published');

  const filteredUniversities = selectedCategory === 'all' 
    ? usUniversities 
    : usUniversities.filter(u => u.financialAidPolicy === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Educational Concept Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Need-Blind Definition */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <h4 className="font-sans text-base font-bold text-slate-900">
              Need-Blind Admission
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-700 font-medium">
            “The university does not consider your ability to pay when making its admission decision.”
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            For international applicants, very few institutions in the United States operate under a strictly need-blind policy.
          </p>
        </div>

        {/* Need-Aware Definition */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
            <h4 className="font-sans text-base font-bold text-slate-900">
              Need-Aware Admission
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-700 font-medium">
            “The amount of financial assistance you need may be considered during the admission process.”
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            Most U.S. colleges are need-aware for international students. This does not mean aid is unavailable; many need-aware colleges still meet 100% of demonstrated need for students they admit.
          </p>
        </div>
      </div>

      {/* Critical Distinction Notice */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-slate-800 space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Crucial Distinction: Need-Blind vs. Meeting Full Demonstrated Need</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-700">
          “Need-blind admission and meeting full demonstrated financial need are different policies. A university may have one policy without having the other.”
        </p>
        <p className="text-xs leading-relaxed text-slate-600 pt-1">
          * Being need-aware does not prevent a student from receiving substantial financial assistance, nor does a need-blind admission policy guarantee that every admitted student will find their financial package manageable. Always review net-price guidelines and financial calculators on the university’s official website.
        </p>
      </div>

      {/* Policy Category Filter Tabs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h4 className="text-sm font-bold text-slate-900">
            Verified International Policy Directory
          </h4>
          <span className="text-xs text-slate-500">
            All listings verified against official university financial aid portals
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Financial Aid Policy Categories">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Verified ({usUniversities.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'need-blind'}
            onClick={() => setSelectedCategory('need-blind')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'need-blind'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Need-Blind for International ({needBlindList.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'need-aware'}
            onClick={() => setSelectedCategory('need-aware')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'need-aware'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Need-Aware for International ({needAwareList.length})</span>
          </button>
          {verifyList.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'verify'}
              onClick={() => setSelectedCategory('verify')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'verify'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Policy Requires Verification ({verifyList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUniversities.map((uni) => {
          const isNeedBlind = uni.financialAidPolicy === 'need-blind';
          const isNeedAware = uni.financialAidPolicy === 'need-aware';

          return (
            <div 
              key={uni.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Monogram + Name + Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-800 shrink-0">
                      {uni.shortCode}
                    </div>
                    <div>
                      <h5 className="font-sans text-base font-bold text-slate-900 leading-snug">
                        {uni.name}
                      </h5>
                      <span className="text-xs text-slate-500">
                        {uni.location}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border shrink-0 ${
                    isNeedBlind 
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : isNeedAware
                        ? 'bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isNeedBlind ? 'Need-Blind (Intl)' : isNeedAware ? 'Need-Aware (Intl)' : 'Verify Policy'}
                  </span>
                </div>

                {/* Policy Narrative */}
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {uni.financialAidPolicyNote}
                </p>

                {/* Meets Full Need Status */}
                <div className="text-xs flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Demonstrated Need:</strong> {uni.meetsFullDemonstratedNeed === true ? 'Meets 100% demonstrated financial need for admitted students' : 'Consult official financial aid office'}
                  </span>
                </div>

                {/* Required Forms */}
                {uni.requiredFinancialAidForms && uni.requiredFinancialAidForms.length > 0 && (
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Forms:</span> {uni.requiredFinancialAidForms.join(', ')}
                  </div>
                )}
              </div>

              {/* Card Footer: Official Links & Last Reviewed */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={uni.admissionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    aria-label={`Visit ${uni.name} official admissions portal in new tab`}
                  >
                    <span>Admissions</span>
                    <ArrowUpRight className="w-3 h-3 opacity-80" />
                  </a>

                  {uni.financialAidUrl && (
                    <a
                      href={uni.financialAidUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                      aria-label={`Visit ${uni.name} official financial aid portal in new tab`}
                    >
                      <span>Financial Aid</span>
                      <ArrowUpRight className="w-3 h-3 opacity-80" />
                    </a>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  Reviewed: {uni.lastReviewed}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
