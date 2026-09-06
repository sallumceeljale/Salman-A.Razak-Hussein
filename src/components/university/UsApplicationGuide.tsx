import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Calendar,
  Layers,
  Award,
  PenTool,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversityListDirectory from './UniversityListDirectory';
import NeedBlindPolicyDirectory from './NeedBlindPolicyDirectory';
import MyUniversityTracker from './MyUniversityTracker';

interface UsApplicationGuideProps {
  completedStepIds: number[];
  onToggleStep: (stepId: number) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export default function UsApplicationGuide({
  completedStepIds,
  onToggleStep,
  onNavigateToSection
}: UsApplicationGuideProps) {
  const [expandedStepId, setExpandedStepId] = useState<number | null>(1);

  const toggleAccordion = (stepId: number) => {
    setExpandedStepId(prev => (prev === stepId ? null : stepId));
  };

  const stepsList = [
    { id: 1, title: 'Understand the Holistic Review Process', duration: 'Week 1' },
    { id: 2, title: 'Build a Balanced University List', duration: 'Weeks 1–3' },
    { id: 3, title: 'Understand Need-Blind vs. Need-Aware Admission', duration: 'Week 2' },
    { id: 4, title: 'Choose the Right Application Plan', duration: 'Week 3' },
    { id: 5, title: 'Navigate Application Platforms (Common App & Portals)', duration: 'Weeks 3–4' },
    { id: 6, title: 'Plan and Draft Authentic Essays', duration: 'Weeks 4–8' },
    { id: 7, title: 'Standardized Testing & English Proficiency', duration: 'Ongoing' },
    { id: 8, title: 'Prepare Financial Aid Applications & Documents', duration: 'Weeks 6–10' },
    { id: 9, title: 'Organize Application Materials & Recommendations', duration: 'Weeks 8–12' },
    { id: 10, title: 'Track Deadlines & Submission Milestones', duration: 'Ongoing' },
  ];

  return (
    <div className="space-y-8 text-slate-900">
      {/* Intro Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
            Destination: United States
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Undergraduate Admissions Guide · 10 Steps
          </span>
        </div>

        <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          U.S. Undergraduate Application Roadmap
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-3xl">
          A step-by-step educational guide for international and domestic students navigating the U.S. college admissions process. All guidance is written in clear language with direct links to official university and platform resources.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4" role="region" aria-label="United States Application Steps">
        {/* ========================================================================= */}
        {/* STEP 1: Understand the Process */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(1) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 1 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 1}
            aria-controls="step-content-1"
            onClick={() => toggleAccordion(1)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(1))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(1); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 1 as ${completedStepIds.includes(1) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(1) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">1</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 1 · {stepsList[0].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(1) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[0].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 1 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 1 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 1 && (
              <motion.div
                id="step-content-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-4 bg-white"
              >
                {/* Core Mandated Definition */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 text-slate-900 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                    Core Concept: Holistic Admissions
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-slate-800">
                    “U.S. universities review more than grades. Depending on the university, they may consider your courses, activities, essays, recommendations, test results, personal background, and financial-aid request.”
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600">
                    * Not all universities evaluate applicants using identical criteria. Public state universities, liberal arts colleges, and private research institutions often weight components differently.
                  </p>
                </div>

                {/* Factors Breakdown */}
                <div className="space-y-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    Key Components Evaluated in Holistic Review
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-800 block">1. Academic Rigor & Grades</span>
                      <p className="text-slate-600 leading-relaxed">
                        Course selection relative to what your high school offers, grade trends over time, and exam marks.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-800 block">2. Extracurricular Involvement</span>
                      <p className="text-slate-600 leading-relaxed">
                        Depth of commitment, leadership, community service, family responsibilities, and creative pursuits.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-800 block">3. Authentic Writing (Essays)</span>
                      <p className="text-slate-600 leading-relaxed">
                        Your personal statement and institution-specific supplements reflecting your voice, values, and character.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-800 block">4. Letters of Recommendation</span>
                      <p className="text-slate-600 leading-relaxed">
                        Evaluations from teachers and counselors offering context on your intellectual curiosity and character.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-800 block">5. Standardized Testing</span>
                      <p className="text-slate-600 leading-relaxed">
                        SAT/ACT results (if required or submitted) and English language proficiency assessments (DET, IELTS, TOEFL).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-800 block">6. Educational Context</span>
                      <p className="text-slate-600 leading-relaxed">
                        Your background, socioeconomic context, school environment, and opportunities available in your region.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Action: Understand your school grading system and ask for your unofficial transcript.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(1)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(1) ? 'Mark Incomplete' : 'Mark Step 1 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: Build a University List */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(2) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 2 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 2}
            aria-controls="step-content-2"
            onClick={() => toggleAccordion(2)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(2))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(2); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 2 as ${completedStepIds.includes(2) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(2) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">2</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 2 · {stepsList[1].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(2) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[1].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 2 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 2 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 2 && (
              <motion.div
                id="step-content-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                <div className="space-y-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    How to Balance Your University List
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Build a balanced list of 8–12 institutions across Reach, Target, and Safety tiers. For international students requiring financial assistance, financial policy is just as important as academic admissibility.
                  </p>
                </div>

                {/* List Strategy Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">Reach Colleges (3–4)</span>
                    <p className="text-slate-600 leading-relaxed">
                      Institutions with highly selective acceptance rates (&lt;15%) or colleges where testing/grades are near or below median.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">Target Colleges (3–5)</span>
                    <p className="text-slate-600 leading-relaxed">
                      Institutions where your academic credentials align closely with admitted student middle 50% profiles.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">Likely / Safety (2–3)</span>
                    <p className="text-slate-600 leading-relaxed">
                      Institutions with high probability of admission and confirmed financial affordability (net price within family budget).
                    </p>
                  </div>
                </div>

                {/* Embedded Verified Directory */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <h5 className="font-sans text-sm font-bold text-slate-900">
                      Explore Verified University Profiles & Policies
                    </h5>
                    <span className="text-xs text-slate-500">
                      Filter by financial aid policy or test requirement
                    </span>
                  </div>
                  <UniversityListDirectory initialDestination="united-states" />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Save your target schools to your browser application tracker below.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(2)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(2) ? 'Mark Incomplete' : 'Mark Step 2 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 3: Understand Need-Blind vs. Need-Aware Admission */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(3) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 3 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 3}
            aria-controls="step-content-3"
            onClick={() => toggleAccordion(3)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(3))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(3); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 3 as ${completedStepIds.includes(3) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(3) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">3</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 3 · {stepsList[2].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(3) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[2].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 3 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 3 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 3 && (
              <motion.div
                id="step-content-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-4 bg-white"
              >
                <NeedBlindPolicyDirectory />

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Always confirm financial aid policies directly on official institutional portals.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(3)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(3) ? 'Mark Incomplete' : 'Mark Step 3 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 4: Explain Application Plans */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(4) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 4 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 4}
            aria-controls="step-content-4"
            onClick={() => toggleAccordion(4)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(4))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(4); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 4 as ${completedStepIds.includes(4) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(4) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">4</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 4 · {stepsList[3].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(4) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[3].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 4 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 4 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 4 && (
              <motion.div
                id="step-content-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-4 bg-white"
              >
                {/* Warning on Binding Plans */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/80 text-slate-800 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Important Warning Regarding Binding Application Plans</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    “Before applying through a binding plan, review the university’s official rules and discuss affordability with a parent, guardian, or trusted school adviser.”
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">
                    * Early Decision agreements require you, your counselor, and your parent to sign a contract agreeing to enroll and withdraw all other applications if admitted. Never apply Early Decision without knowing your family’s estimated net price.
                  </p>
                </div>

                {/* Plan Types Comparison Table / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Early Decision */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Early Decision (ED / ED2)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                        Binding
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      You apply early (typically Nov 1 for ED1, Jan 1–15 for ED2) to your top-choice university. If admitted, you commit to enroll and withdraw other college applications.
                    </p>
                  </div>

                  {/* Early Action */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Early Action (EA)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                        Non-Binding
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      You submit your application early (usually Nov 1 or Nov 15) and receive an early decision (usually December or January). You are under no obligation to enroll and can compare offers until May 1.
                    </p>
                  </div>

                  {/* Restrictive / Single-Choice Early Action */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Restrictive / Single-Choice EA (REA / SCEA)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        Non-Binding (Restricted)
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Non-binding, but the university restricts you from applying early to other private institutions. You still have until May 1 to decide. (e.g. Harvard, Princeton, Yale, Stanford).
                    </p>
                  </div>

                  {/* Regular Decision */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Regular Decision (RD)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        Non-Binding
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      The standard application timeline (deadlines in January–February, decisions in late March or early April). Gives you maximum time to polish essays and submit first-semester senior year grades.
                    </p>
                  </div>

                  {/* Rolling Admission */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Rolling Admission</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase">
                        Continuous Review
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Applications are evaluated as they arrive over a wide window until available class seats are filled. Applying earlier in the cycle is generally advantageous.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Never rush into an Early Decision plan without explicit financial clarity.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(4)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(4) ? 'Mark Incomplete' : 'Mark Step 4 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 5: Application Platforms */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(5) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 5 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 5}
            aria-controls="step-content-5"
            onClick={() => toggleAccordion(5)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(5))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(5); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 5 as ${completedStepIds.includes(5) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(5) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">5</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 5 · {stepsList[4].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(5) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[4].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 5 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 5 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 5 && (
              <motion.div
                id="step-content-5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                <div className="space-y-2">
                  <h5 className="font-sans text-base font-bold text-slate-900">
                    Where do you submit your application?
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    “Many U.S. universities accept the Common Application, but not every university uses it. Check each university’s official admissions website before starting.”
                  </p>
                </div>

                {/* Common App Official Button */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900 block">
                      The Common Application (First-Year Students)
                    </span>
                    <p className="text-xs text-slate-600">
                      Used by over 1,000 public and private higher education institutions worldwide.
                    </p>
                  </div>
                  <a
                    href="https://www.commonapp.org/apply/first-year-students"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="Visit Common App official website for first-year students in a new tab"
                  >
                    <span>Visit Common App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Common Parts of an Application */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-sans text-sm font-bold text-slate-900">
                      Standard Sections of a First-Year Application
                    </h5>
                    <span className="text-xs text-slate-500">
                      * Requirements differ by university; not every institution requires all sections
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {[
                      { title: 'Profile & Contact', desc: 'Basic personal and demographic details' },
                      { title: 'Family Information', desc: 'Parent education, employment, and siblings' },
                      { title: 'Education & School History', desc: 'Current high school, CEEB code, and dates attended' },
                      { title: 'Courses & Grades', desc: 'Self-reported senior year schedule and grading scale' },
                      { title: 'Testing Information', desc: 'Official or self-reported SAT, ACT, or AP results' },
                      { title: 'Activities List', desc: 'Top 10 extracurriculars with roles and time commitment' },
                      { title: 'Academic Honors', desc: 'Up to 5 regional, national, or school awards' },
                      { title: 'Personal Essay', desc: '650-word personal statement shared across universities' },
                      { title: 'Additional Information', desc: 'Space to explain academic disruptions or context' },
                      { title: 'University Supplements', desc: 'School-specific questions and short-answer prompts' },
                      { title: 'Recommendation Letters', desc: 'Teacher evaluations and counselor recommendation' },
                      { title: 'Counselor & Transcript', desc: 'Official high school transcript and school profile' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                        <span className="font-semibold text-slate-800 block">{item.title}</span>
                        <span className="text-slate-500 text-[11px] leading-snug">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Always double-check whether target universities require an independent portal (e.g., MIT, Georgetown, UC system).
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(5)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(5) ? 'Mark Incomplete' : 'Mark Step 5 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 6: Essays */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(6) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 6 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 6}
            aria-controls="step-content-6"
            onClick={() => toggleAccordion(6)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(6))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(6); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 6 as ${completedStepIds.includes(6) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(6) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">6</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 6 · {stepsList[5].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(6) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[5].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 6 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 6 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 6 && (
              <motion.div
                id="step-content-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                {/* Writing Ethics Notice */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-slate-800 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <PenTool className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Authenticity in Application Writing</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    “Your essay should represent your own experiences, thinking, and voice. Use feedback and technology responsibly, but do not submit writing that is not your own.”
                  </p>
                </div>

                {/* Common Essay Types */}
                <div className="space-y-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    Types of Application Essays You Will Encounter
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">1. Common App Personal Essay</span>
                      <p className="text-slate-600 leading-relaxed">
                        A 250–650 word narrative personal statement sent to most of your universities. Reflects who you are beyond numbers.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">2. "Why This University?"</span>
                      <p className="text-slate-600 leading-relaxed">
                        Explaining concrete academic programs, professors, research labs, or culture that match your specific goals.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">3. Community & Background</span>
                      <p className="text-slate-600 leading-relaxed">
                        How your cultural background, community service, or family environment shaped your perspective.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">4. Academic Interest / Major</span>
                      <p className="text-slate-600 leading-relaxed">
                        Describing your intellectual curiosity, independent projects, books read, or reasons for choosing a field of study.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">5. Meaningful Extracurricular</span>
                      <p className="text-slate-600 leading-relaxed">
                        Expanding on one significant activity or leadership challenge (typically 150–250 words).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">6. Short-Answer Prompts</span>
                      <p className="text-slate-600 leading-relaxed">
                        Quick 50–100 word or one-sentence prompts testing creativity, spontaneous reflection, or personal interests.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical 8-Step Writing Process */}
                <div className="space-y-3 pt-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    The 8-Step Writing Process
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { step: 1, title: 'Understand the Question', desc: 'Identify what the prompt is genuinely asking you to reflect on.' },
                      { step: 2, title: 'Brainstorm Real Experiences', desc: 'List moments of curiosity, problem-solving, or growth.' },
                      { step: 3, title: 'Select One Clear Story', desc: 'Choose a specific focal point rather than summarizing your life.' },
                      { step: 4, title: 'Write a First Draft', desc: 'Write freely without censoring or editing yourself too early.' },
                      { step: 5, title: 'Add Specific Details', desc: 'Use concrete sensory details and clear reflections on what you learned.' },
                      { step: 6, title: 'Remove Unnecessary Language', desc: 'Cut repetitive words, flowery filler, and passive voice.' },
                      { step: 7, title: 'Ask for Constructive Feedback', desc: 'Have a teacher or mentor check clarity and tone.' },
                      { step: 8, title: 'Proofread Before Submission', desc: 'Read aloud slowly to catch typos and punctuation slips.' },
                    ].map((st) => (
                      <div key={st.step} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-blue-700">
                          <span>0{st.step}.</span>
                          <span className="font-sans text-slate-800">{st.title}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* External Prompt Link & Pilot status */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800">
                      Official Common App Essay Prompts:
                    </span>
                    <p className="text-slate-500">
                      Read the current first-year prompts directly on the official Common App website.
                    </p>
                  </div>
                  <a
                    href="https://www.commonapp.org/apply/essay-prompts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                    aria-label="View official Common App essay prompts in new tab"
                  >
                    <span>View Official Prompts</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Notice on Private Essay Pilot */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-500 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Note: SVT does not collect, store, or upload private student essays. The volunteer peer review pilot operates during scheduled application cycles with strict privacy.
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Draft multiple revisions. Quality essays are built through thoughtful refinement.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(6)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(6) ? 'Mark Incomplete' : 'Mark Step 6 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 7: Testing & English Proficiency */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(7) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 7 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 7}
            aria-controls="step-content-7"
            onClick={() => toggleAccordion(7)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(7))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(7); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 7 as ${completedStepIds.includes(7) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(7) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">7</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 7 · {stepsList[6].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(7) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[6].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 7 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 7 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 7 && (
              <motion.div
                id="step-content-7"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Testing policies vary significantly by university and application year. Standardized testing (SAT/ACT) policies and English proficiency requirements are separate considerations.
                  </p>
                </div>

                {/* Standardized Testing Policy Categories */}
                <div className="space-y-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    Understanding Standardized Testing Policy Labels
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Required</span>
                      <p className="text-slate-600 leading-relaxed">
                        All applicants must submit SAT or ACT scores to be considered for admission (e.g. MIT, Harvard, Dartmouth, Caltech).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Test-Optional</span>
                      <p className="text-slate-600 leading-relaxed">
                        You decide whether to submit test scores. Applicants without test scores are reviewed based on other credentials without penalty.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Test-Flexible</span>
                      <p className="text-slate-600 leading-relaxed">
                        You can satisfy testing requirements using alternative exams such as AP exam scores or IB diploma scores (e.g. Yale).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Not Considered / Test-Free</span>
                      <p className="text-slate-600 leading-relaxed">
                        Test scores are not viewed or used in admission decisions even if submitted (e.g. UC System).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 sm:col-span-2">
                      <span className="font-bold text-slate-900 block">English Language Proficiency</span>
                      <p className="text-slate-600 leading-relaxed">
                        Even if a university is test-optional for SAT/ACT, non-native English speakers or students whose high school was not taught in English may still be required to submit DET, IELTS, or TOEFL scores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Links to Existing SVT Resources */}
                <div className="space-y-2 pt-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    SVT Diagnostic Practice & Preparation Hubs
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Digital SAT */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">Digital SAT Hub</span>
                        <p className="text-slate-600 leading-relaxed">
                          Practice interactive Math and Reading/Writing drills formatted for the Digital SAT suite.
                        </p>
                      </div>
                      <a
                        href="#testing"
                        onClick={(e) => {
                          if (onNavigateToSection) {
                            e.preventDefault();
                            onNavigateToSection('testing');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <span>Open SAT Prep Hub</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Duolingo English Test */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">Duolingo English Test (DET)</span>
                        <p className="text-slate-600 leading-relaxed">
                          Official format guides, question walkthroughs, and diagnostic practice links.
                        </p>
                      </div>
                      <a
                        href="#resources"
                        onClick={(e) => {
                          if (onNavigateToSection) {
                            e.preventDefault();
                            onNavigateToSection('resources');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <span>Explore DET Study Tools</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* IELTS Academic */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block">IELTS Academic</span>
                        <p className="text-slate-600 leading-relaxed">
                          Band descriptors, timed essay templates, and official practice test sets.
                        </p>
                      </div>
                      <a
                        href="#resources"
                        onClick={(e) => {
                          if (onNavigateToSection) {
                            e.preventDefault();
                            onNavigateToSection('resources');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <span>Explore IELTS Study Tools</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Always confirm current testing policies on the university’s official admissions website.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(7)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(7) ? 'Mark Incomplete' : 'Mark Step 7 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 8: Financial Aid */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(8) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 8 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 8}
            aria-controls="step-content-8"
            onClick={() => toggleAccordion(8)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(8))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(8); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 8 as ${completedStepIds.includes(8) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(8) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">8</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 8 · {stepsList[7].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(8) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[7].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 8 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 8 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 8 && (
              <motion.div
                id="step-content-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                {/* Official Principle Statement */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 space-y-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 block">Financial Aid Policy Fact:</span>
                  <p className="leading-relaxed text-slate-700 font-medium">
                    “Financial-aid decisions depend on the university’s policies and the applicant’s documented financial circumstances.”
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    SVT does not calculate aid, promise awards, or guarantee admission.
                  </p>
                </div>

                {/* Important FAFSA Notice for International Students */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-slate-800 space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>FAFSA Eligibility Notice</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    FAFSA (Free Application for Federal Student Aid) eligibility is limited to U.S. citizens and eligible non-citizens (such as permanent residents). Most international students on non-immigrant student visas are not eligible for federal U.S. aid. Always verify eligibility using official U.S. Department of Education resources (StudentAid.gov).
                  </p>
                </div>

                {/* Financial Aid Checklist */}
                <div className="space-y-2">
                  <h5 className="font-sans text-sm font-bold text-slate-900">
                    Standard Financial Aid Documentation Checklist
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>1. CSS Profile (College Board)</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Online application used by ~400 colleges to award institutional non-federal aid. Fee waivers available through participating colleges.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>2. IDOC Document Portal</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        College Board secure document upload service for tax forms, wage statements, and business supplements requested by colleges.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>3. Institutional Financial Aid Forms</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        University-specific forms (e.g. Princeton Financial Aid Application, ISFAA worksheets) required by specific admissions offices.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>4. Parent Income & Certified Translations</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Official income tax filings, wage statements, or employer letters with certified English translations and currency conversions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Financial aid deadlines often coincide with or closely follow admissions deadlines.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(8)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(8) ? 'Mark Incomplete' : 'Mark Step 8 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 9: Documents & Recommendations */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(9) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 9 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 9}
            aria-controls="step-content-9"
            onClick={() => toggleAccordion(9)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(9))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(9); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 9 as ${completedStepIds.includes(9) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(9) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">9</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 9 · {stepsList[8].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(9) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[8].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 9 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 9 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 9 && (
              <motion.div
                id="step-content-9"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    “Requirements differ by university. Confirm every document on the university’s official application checklist.”
                  </p>
                  <p className="text-xs text-slate-500">
                    SVT never collects or requests students to upload passports, transcripts, income tax documents, or recommendation letters.
                  </p>
                </div>

                {/* Possible Application Materials Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { label: 'Official School Transcript', desc: 'Grades 9–12 transcripts issued directly by your school counselor.' },
                    { label: 'Certified English Translation', desc: 'Required if your school records are in a language other than English.' },
                    { label: 'School Report & Profile', desc: 'Context document submitted by your counselor explaining your school system.' },
                    { label: 'Counselor Recommendation', desc: 'Holistic letter describing your community contributions and academic character.' },
                    { label: 'Teacher Recommendations (1–2)', desc: 'From academic instructors who know your classroom curiosity and work ethic.' },
                    { label: 'Predicted or Final Examination Results', desc: 'IB predicted scores, Cambridge IGCSE / A-Levels, or national board certificates.' },
                    { label: 'Passport Identification Information', desc: 'Submitted directly to official portals when officially requested for I-20 processing.' },
                    { label: 'Standardized & English Test Results', desc: 'Score reports sent according to university self-report or official score policies.' },
                  ].map((mat, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-semibold text-slate-900 block">✓ {mat.label}</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{mat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Give recommenders at least 4–6 weeks notice before application deadlines.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(9)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(9) ? 'Mark Incomplete' : 'Mark Step 9 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* STEP 10: Deadlines & Application Tracking */}
        {/* ========================================================================= */}
        <div className={`rounded-xl border transition-all overflow-hidden ${
          completedStepIds.includes(10) 
            ? 'bg-slate-50/50 border-slate-200' 
            : expandedStepId === 10 
              ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedStepId === 10}
            aria-controls="step-content-10"
            onClick={() => toggleAccordion(10)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(10))}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleStep(10); }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Mark step 10 as ${completedStepIds.includes(10) ? 'incomplete' : 'complete'}`}
              >
                {completedStepIds.includes(10) ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700">10</span>
                )}
              </button>
              <div>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider block">
                  Step 10 · {stepsList[9].duration}
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${completedStepIds.includes(10) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {stepsList[9].title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {expandedStepId === 10 ? 'Hide Details' : 'View Guide'}
              </span>
              {expandedStepId === 10 ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedStepId === 10 && (
              <motion.div
                id="step-content-10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 px-4 sm:px-6 py-5 space-y-5 bg-white"
              >
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Track your individual university applications, test submission dates, and checklist milestones in your private browser tracker below.
                  </p>
                </div>

                {/* Embedded Interactive Tracker */}
                <MyUniversityTracker />

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Always aim to submit applications 5–7 days ahead of official deadlines.
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleStep(10)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {completedStepIds.includes(10) ? 'Mark Incomplete' : 'Mark Step 10 Complete'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
