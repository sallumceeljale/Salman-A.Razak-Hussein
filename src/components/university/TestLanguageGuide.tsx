import React, { useState, useMemo } from 'react';
import { ArrowLeft, Languages, ExternalLink, Sparkles, AlertTriangle, Search, Filter, BookOpen, School, CheckCircle2, ArrowRight } from 'lucide-react';
import { STANDARDIZED_TESTS_GUIDE } from '../../data/testLanguageGuideData';
import { DESTINATION_GUIDES } from '../../data/destinationGuidesData';
import { UniversityDestinationId } from '../../types/universityApplications';

interface TestLanguageGuideProps {
  onBack: () => void;
  onSelectDestination: (id: UniversityDestinationId) => void;
  onOpenTestPrepHub?: (tab?: string) => void;
}

export const TestLanguageGuide: React.FC<TestLanguageGuideProps> = ({
  onBack,
  onSelectDestination,
  onOpenTestPrepHub
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTests = useMemo(() => {
    return STANDARDIZED_TESTS_GUIDE.filter(test => {
      if (selectedCategory !== 'all' && test.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        test.name.toLowerCase().includes(q) ||
        test.shortCode.toLowerCase().includes(q) ||
        test.purpose.toLowerCase().includes(q) ||
        test.commonlyUsedIn.some(cId => {
          const g = DESTINATION_GUIDES.find(d => d.id === cId);
          const cName = (g?.countryName || g?.name || '').toLowerCase();
          return cName.includes(q);
        })
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6" id="test-language-guide-view">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            id="btn-back-from-tests-guide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Destination Explorer
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-xs font-bold text-slate-900">Standardized Tests & Language Guide</h1>
        </div>
      </div>

      {/* Hero Explainer Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Languages className="w-3.5 h-3.5" />
            Official Standardized Testing Directory
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Standardized Tests & Language Proficiency Directory
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Direct breakdowns of major exams required across our 10 study destinations: English proficiency (DET, IELTS, TOEFL), local languages (TestDaF, DELF/DALF, TÖMER), and academic admission tests (SAT, ACT, TR-YÖS, TestAS).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests (e.g. Duolingo, IELTS, TestDaF, SAT, TR-YÖS, TÖMER)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="input-tests-search"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Tests' },
              { id: 'english-language', label: 'English Exams (DET, IELTS, TOEFL)' },
              { id: 'local-language', label: 'Host Country Languages' },
              { id: 'academic-admission', label: 'Academic & Entrance Tests' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                id={`category-btn-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
          Showing {filteredTests.length} standardized tests
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map(test => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            id={`test-card-${test.id}`}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md border border-blue-100 mb-1">
                    {test.shortCode}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{test.name}</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                  {test.category.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Purpose */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {test.purpose}
              </p>

              {/* Score Benchmark */}
              {test.scoreRangeOrScale && (
                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Score Scale / Benchmark: </span>
                  <span>{test.scoreRangeOrScale}</span>
                </div>
              )}

              {/* Commonly Used In Countries */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Commonly Accepted / Required In:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {test.commonlyUsedIn.map(cId => {
                    const cGuide = DESTINATION_GUIDES.find(d => d.id === cId);
                    if (!cGuide) return null;
                    const flag = cGuide.flagEmoji || cGuide.flag;
                    const name = cGuide.countryName || cGuide.name;
                    return (
                      <button
                        key={cId}
                        onClick={() => onSelectDestination(cId)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                        title={`Open ${name} Guide`}
                      >
                        <span>{flag}</span>
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verification Warning */}
              <div className="text-[11px] text-amber-900 bg-amber-50/70 rounded-xl p-3 border border-amber-200/80 flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{test.verificationWarning}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <a
                href={test.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600"
              >
                <span>{test.officialLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {test.svtPrepSectionId && onOpenTestPrepHub && (
                <button
                  onClick={() => onOpenTestPrepHub(test.svtPrepSectionId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  SVT Prep →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
