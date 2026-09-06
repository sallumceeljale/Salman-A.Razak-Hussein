import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Map, 
  ExternalLink, 
  Clock, 
  Award, 
  Users, 
  Layers,
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';
import { AcademicTestData, SectionKey } from '../../types/academicTesting';

interface TestOrientationCardProps {
  testData: AcademicTestData;
  onNavigateSection: (section: SectionKey) => void;
}

export const TestOrientationCard: React.FC<TestOrientationCardProps> = ({
  testData,
  onNavigateSection
}) => {
  const { orientation } = testData;

  return (
    <div 
      id="test-orientation-overview"
      className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 text-left"
    >
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide border ${testData.badgeBg} font-sans`}>
              {testData.shortCode} Orientation
            </span>
            <span className="text-xs text-slate-500 font-medium font-sans">
              Administered by {testData.administeringBody}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif leading-snug">
            {testData.name}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            {orientation.whatItIs}
          </p>
        </div>

        {/* Primary Official Link Action */}
        <div className="shrink-0 flex items-center">
          <a
            href={orientation.primaryOfficialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#102A43] hover:bg-[#081A2C] text-white rounded-lg text-xs font-semibold transition-all shadow-xs min-h-[44px] cursor-pointer font-sans"
            aria-label={`Visit ${orientation.primaryOfficialLabel} (opens in a new tab)`}
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
          </a>
        </div>
      </div>

      {/* 4 Essential Orientation Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Target Candidates */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Users className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-sans">
              Who Takes It
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold leading-snug font-sans">
            {orientation.whoTakesIt}
          </p>
        </div>

        {/* Major Skills / Sections */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Layers className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-sans">
              Major Sections
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold leading-snug font-sans">
            {orientation.majorSections}
          </p>
        </div>

        {/* Approximate Duration */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-sans">
              Test Duration
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold leading-snug font-sans">
            {orientation.approxDuration}
          </p>
        </div>

        {/* Scoring Scale */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Award className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-sans">
              Scoring Scale
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold leading-snug font-sans">
            {orientation.scoringScaleSummary}
          </p>
        </div>
      </div>

      {/* Quick Launch Buttons: 3 Major Action Pathways */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigateSection('overview')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#102A43] hover:bg-[#081A2C] text-white rounded-lg text-xs font-semibold transition-all shadow-xs min-h-[44px] cursor-pointer font-sans"
        >
          <BookOpen className="w-4 h-4" />
          <span>Start Learning</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('practice')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs min-h-[44px] cursor-pointer font-sans"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Practice (SVT)</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSection('roadmap')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-all min-h-[44px] cursor-pointer font-sans"
        >
          <Map className="w-4 h-4 text-slate-600" />
          <span>Build Study Plan</span>
        </button>
      </div>

      {/* Source Attribution & Review Date Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{orientation.sourceNote}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Last reviewed: {orientation.lastReviewedDate}</span>
        </div>
      </div>
    </div>
  );
};
