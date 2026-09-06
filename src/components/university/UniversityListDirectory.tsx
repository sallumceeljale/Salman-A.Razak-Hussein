import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowUpRight,
  PlusCircle,
  Check,
  BookmarkCheck,
  Bookmark
} from 'lucide-react';
import { VERIFIED_UNIVERSITIES } from '../../data/universityApplicationsData';
import { 
  UniversityReference, 
  Destination, 
  FinancialAidPolicy, 
  TestingPolicy 
} from '../../types/universityApplications';
import {
  getSavedApplications,
  toggleSaveUniversity,
  subscribeToSavedUniversities,
  UniversityApplicationPlan
} from '../../utils/universityStorage';

interface UniversityListDirectoryProps {
  initialDestination?: Destination | 'all';
  onAddUniversityToTracker?: (name: string) => void;
}

export default function UniversityListDirectory({
  initialDestination = 'all',
  onAddUniversityToTracker
}: UniversityListDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | 'all'>(initialDestination);
  const [selectedAidPolicy, setSelectedAidPolicy] = useState<FinancialAidPolicy | 'all'>('all');
  const [selectedTestingPolicy, setSelectedTestingPolicy] = useState<TestingPolicy | 'all'>('all');
  const [savedApps, setSavedApps] = useState<UniversityApplicationPlan[]>(() => getSavedApplications());

  useEffect(() => {
    const unsub = subscribeToSavedUniversities((apps) => {
      setSavedApps(apps);
    });
    return () => unsub();
  }, []);

  const isUniSaved = (uniName: string) => {
    const target = uniName.trim().toLowerCase();
    return savedApps.some(app => app.universityName.trim().toLowerCase() === target);
  };

  const filteredList = VERIFIED_UNIVERSITIES.filter((uni) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = uni.name.toLowerCase().includes(q);
      const matchLoc = uni.location.toLowerCase().includes(q);
      const matchCode = uni.shortCode.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCode) return false;
    }

    // Destination match
    if (selectedDestination !== 'all' && uni.destination !== selectedDestination) {
      return false;
    }

    // Aid Policy match
    if (selectedAidPolicy !== 'all' && uni.financialAidPolicy !== selectedAidPolicy) {
      return false;
    }

    // Testing policy match
    if (selectedTestingPolicy !== 'all' && uni.testingPolicy !== selectedTestingPolicy) {
      return false;
    }

    return true;
  });

  const handleToggleSave = (uni: UniversityReference) => {
    if (onAddUniversityToTracker) {
      onAddUniversityToTracker(uni.name);
    }
    
    // Save to unified global planner and country list
    const { applications } = toggleSaveUniversity({
      name: uni.name,
      countryId: uni.destination,
      portalUrl: uni.admissionsUrl,
      deadline: uni.applicationDeadlinesNote || 'Regular Decision',
      notes: `Saved from directory (${uni.location}) · Platform: ${uni.applicationPlatform}`
    });

    setSavedApps(applications);

    // Also sync local legacy tracker for backwards compatibility
    try {
      const key = 'svt_my_university_tracker_v1';
      const existingStr = localStorage.getItem(key);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      if (Array.isArray(existing)) {
        const target = uni.name.trim().toLowerCase();
        const exists = existing.some((item: any) => item.universityName?.trim().toLowerCase() === target);
        if (!exists) {
          const now = new Date().toISOString();
          const newEntry = {
            id: `tracker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            universityName: uni.name,
            location: uni.location,
            applicationPlan: 'Regular Decision',
            applicationDeadline: uni.applicationDeadlinesNote || 'Verify on website',
            financialAidDeadline: uni.financialAidDeadlinesNote || '',
            admissionsUrl: uni.admissionsUrl,
            financialAidUrl: uni.financialAidUrl || '',
            recommendationStatus: 'not-started',
            transcriptStatus: 'not-started',
            essayStatus: 'not-started',
            submissionStatus: 'not-started',
            decisionStatus: 'pending',
            notes: `Added from directory (${uni.applicationPlatform})`,
            createdAt: now,
            updatedAt: now
          };
          localStorage.setItem(key, JSON.stringify([newEntry, ...existing]));
        }
      }
    } catch (e) {
      console.warn('Could not auto-add to tracker:', e);
    }
  };

  const getTestingBadge = (policy: TestingPolicy) => {
    switch (policy) {
      case 'required':
        return { label: 'SAT/ACT Required', color: 'bg-red-50 text-red-800 border-red-200' };
      case 'test-optional':
        return { label: 'Test-Optional', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'test-flexible':
        return { label: 'Test-Flexible', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'not-considered':
        return { label: 'Test Not Considered', color: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: 'Verify Current Policy', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  const getAidBadge = (policy: FinancialAidPolicy) => {
    switch (policy) {
      case 'need-blind':
        return { label: 'Need-Blind (Intl)', color: 'bg-blue-600 text-white border-blue-700' };
      case 'need-aware':
        return { label: 'Need-Aware (Intl)', color: 'bg-slate-800 text-white border-slate-900' };
      default:
        return { label: 'Verify Official Policy', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search universities by name or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Quick Clear Button if active */}
          {(searchQuery || selectedDestination !== 'all' || selectedAidPolicy !== 'all' || selectedTestingPolicy !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDestination('all');
                setSelectedAidPolicy('all');
                setSelectedTestingPolicy('all');
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns / Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          {/* Destination */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600 block">
              Destination
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value as Destination | 'all')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Destinations</option>
              <option value="united-states">United States</option>
              <option value="saudi-arabia">Saudi Arabia</option>
            </select>
          </div>

          {/* Financial Aid Policy */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600 block">
              Financial Aid Policy
            </label>
            <select
              value={selectedAidPolicy}
              onChange={(e) => setSelectedAidPolicy(e.target.value as FinancialAidPolicy | 'all')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Aid Policies</option>
              <option value="need-blind">Need-Blind for International</option>
              <option value="need-aware">Need-Aware for International</option>
              <option value="verify">Policy Requires Verification</option>
            </select>
          </div>

          {/* Testing Policy */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600 block">
              Standardized Testing Policy
            </label>
            <select
              value={selectedTestingPolicy}
              onChange={(e) => setSelectedTestingPolicy(e.target.value as TestingPolicy | 'all')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Testing Policies</option>
              <option value="required">Standardized Test Required</option>
              <option value="test-optional">Test-Optional</option>
              <option value="test-flexible">Test-Flexible</option>
              <option value="not-considered">Not Considered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mandatory Official Warning Banner */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-slate-800 flex items-start gap-3 text-xs sm:text-sm">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Verification Warning:</strong> “Admissions requirements and financial-aid policies can change. Always confirm information on the university’s official website before applying.”
        </p>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {filteredList.length} verified institution{filteredList.length === 1 ? '' : 's'}</span>
        <span>Every listing includes direct official links and verified review dates</span>
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((uni) => {
          const testBadge = getTestingBadge(uni.testingPolicy);
          const aidBadge = getAidBadge(uni.financialAidPolicy);
          const isSaved = isUniSaved(uni.name);

          return (
            <div
              key={uni.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Top: Monogram + Name + Badges */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-800 shrink-0">
                      {uni.shortCode}
                    </div>
                    <div>
                      <h4 className="font-sans text-base font-bold text-slate-900 leading-snug">
                        {uni.name}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {uni.location} · {uni.country}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border shrink-0 ${aidBadge.color}`}>
                    {aidBadge.label}
                  </span>
                </div>

                {/* Key Metadata Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    Platform: {uni.applicationPlatform}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${testBadge.color}`}>
                    {testBadge.label}
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">Financial Aid Policy:</span> {uni.financialAidPolicyNote}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Testing & English:</span> {uni.testingPolicyNote} {uni.englishRequirement}
                  </div>
                  {uni.requiredFinancialAidForms && uni.requiredFinancialAidForms.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-800">Required Aid Forms:</span> {uni.requiredFinancialAidForms.join(', ')}
                    </div>
                  )}
                  {uni.applicationDeadlinesNote && (
                    <div className="pt-1 border-t border-slate-200/60 font-medium text-slate-700">
                      <strong>Timeline:</strong> {uni.applicationDeadlinesNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom: Links & Add to Tracker */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <a
                      href={uni.admissionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                      aria-label={`Visit ${uni.name} official admissions portal in a new tab`}
                    >
                      <span>Official Admissions</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    {uni.financialAidUrl && (
                      <a
                        href={uni.financialAidUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                        aria-label={`Visit ${uni.name} official financial aid portal in a new tab`}
                      >
                        <span>Financial Aid</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Last reviewed: {uni.lastReviewed}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSave(uni)}
                  className={`w-full min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                  aria-label={isSaved ? `Remove ${uni.name} from saved applications` : `Save ${uni.name} to application planner and country list`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saved to List & Planner (Click to remove)</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Save to List & Planner</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
