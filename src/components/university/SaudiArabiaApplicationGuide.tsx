import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  AlertTriangle, 
  BookOpen, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Building2,
  FileText,
  Info,
  Globe2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversityListDirectory from './UniversityListDirectory';
import MyUniversityTracker from './MyUniversityTracker';

interface SaudiArabiaApplicationGuideProps {
  completedStepIds: number[];
  onToggleStep: (stepId: number) => void;
}

export default function SaudiArabiaApplicationGuide({
  completedStepIds,
  onToggleStep
}: SaudiArabiaApplicationGuideProps) {
  const [expandedStepId, setExpandedStepId] = useState<number | null>(1);

  const toggleAccordion = (stepId: number) => {
    setExpandedStepId(prev => (prev === stepId ? null : stepId));
  };

  const stepsList = [
    {
      id: 1,
      title: 'Visit the Official Study in Saudi Platform',
      desc: 'Access the authorized Ministry of Education international portal.',
      guidance: 'Open the official portal (https://studyinsaudi.sa/en) to view active government scholarship opportunities, accredited universities, and current admissions calendars.'
    },
    {
      id: 2,
      title: 'Explore Available Universities and Programs',
      desc: 'Search undergraduate and graduate degree offerings across institutions.',
      guidance: 'Browse universities by specialization (Engineering, Computer Science, Health Sciences, Business, Islamic Studies, Arabic Language). Note whether the curriculum is delivered in English or Arabic.'
    },
    {
      id: 3,
      title: 'Review Program Eligibility Rules',
      desc: 'Verify age criteria, minimum high school percentages, and residency prerequisites.',
      guidance: 'Each university and faculty publishes specific entry thresholds. For example, STEM and health faculties typically require strong science foundations and high GPA percentiles.'
    },
    {
      id: 4,
      title: 'Check Language and Academic Requirements',
      desc: 'Confirm required English proficiency (IELTS/TOEFL) or Arabic placement tests.',
      guidance: 'Programs taught in English generally require verifiable IELTS or TOEFL Academic scores. Arabic-taught programs may require an Arabic proficiency test or admission into a preparatory language institute.'
    },
    {
      id: 5,
      title: 'Prepare Required Documents and Attestations',
      desc: 'Gather academic transcripts, graduation diplomas, passport, and medical checks.',
      guidance: 'Have official certificates translated into English or Arabic where required, and prepare digital copies according to Study in Saudi formatting and file size guidelines.'
    },
    {
      id: 6,
      title: 'Create an Account on the Official Platform',
      desc: 'Register personal contact details securely on studyinsaudi.sa.',
      guidance: 'Use an active email address and record your credentials securely. Complete your profile details accurately to match your passport.'
    },
    {
      id: 7,
      title: 'Complete and Submit the Electronic Application',
      desc: 'Select preferred degree tracks and submit before portal closing dates.',
      guidance: 'Carefully review all uploaded files and program selections. Submit ahead of the announced portal deadlines.'
    },
    {
      id: 8,
      title: 'Track Application Status Through the Official Portal',
      desc: 'Monitor nomination stages, university reviews, and ministry verification.',
      guidance: 'Log in regularly to review your application status (e.g. Under Review, Nominated by University, Ministry Verification, Final Approval).'
    },
    {
      id: 9,
      title: 'Follow Official University and Visa Instructions',
      desc: 'Coordinate with university admissions for visa issuance and arrival.',
      guidance: 'Upon receiving official confirmation, follow the university’s instructions to obtain your educational visa through the authorized Saudi embassy or diplomatic mission.'
    }
  ];

  return (
    <div className="space-y-8 text-slate-900">
      {/* Destination Intro Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Destination: Saudi Arabia
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Ministry of Education Official Portal Guide · 9 Steps
          </span>
        </div>

        <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Study in Saudi Arabia Application Guide
        </h3>

        {/* Mandated Official Intro */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium">
            “Study in Saudi is the official platform for international students interested in educational opportunities in Saudi Arabia. Students can explore available institutions and programs and follow the official application process.”
          </p>

          {/* Prominent Official Button */}
          <div className="pt-1">
            <a
              href="https://studyinsaudi.sa/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label="Visit official Study in Saudi portal in a new tab"
            >
              <span>Visit Study in Saudi</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Funding Tiers Explanation */}
      <div className="space-y-3">
        <h4 className="font-sans text-base font-bold text-slate-900">
          Understanding Scholarship and Funding Types
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {/* Fully Funded */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="font-bold text-slate-900 text-sm">Fully Funded Track</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Typically covers tuition, student housing, monthly living stipend, annual airfare allowance, and university healthcare coverage according to government regulations.
            </p>
          </div>

          {/* Partially Funded */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
              <span className="font-bold text-slate-900 text-sm">Partially Funded Track</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              May cover partial or full tuition while requiring students to arrange their own living accommodations or personal expenses.
            </p>
          </div>

          {/* Self-Funded */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0" />
              <span className="font-bold text-slate-900 text-sm">Self-Funded Track</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Students pay institutional tuition fees and personal maintenance costs according to published university fee schedules.
            </p>
          </div>
        </div>

        {/* Realistic Guidance Warning */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 space-y-1">
          <p className="leading-relaxed">
            * <strong>Important Clarification:</strong> Not every university or degree program offers every funding category. SVT does not issue visas, guarantee admissions, or grant scholarships.
          </p>
          <p className="text-slate-500 leading-relaxed">
            Application opening dates vary by academic calendar. Always verify active admission cycles on the official <strong>studyinsaudi.sa</strong> portal.
          </p>
        </div>
      </div>

      {/* 9-Step Roadmap Accordions */}
      <div className="space-y-3" role="region" aria-label="Saudi Arabia Application Steps">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official Application Steps ({stepsList.length} Steps)
          </h4>
          <span className="text-xs text-slate-500">
            Click any step to view actionable guidance
          </span>
        </div>

        {stepsList.map((step) => {
          const isDone = completedStepIds.includes(step.id);
          const isExpanded = expandedStepId === step.id;

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isExpanded
                    ? 'bg-white border-emerald-700 shadow-xs ring-1 ring-emerald-700/20'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {/* Accordion Header */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`saudi-step-${step.id}`}
                onClick={() => toggleAccordion(step.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleAccordion(step.id))}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleStep(step.id); }}
                    className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                    aria-label={`Mark step ${step.id} as ${isDone ? 'incomplete' : 'complete'}`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-700">{step.id}</span>
                    )}
                  </button>

                  <div className="min-w-0">
                    <span className="text-[11px] font-mono font-medium text-slate-400 block">
                      Step {step.id} of {stepsList.length}
                    </span>
                    <h5 className={`text-sm sm:text-base font-semibold truncate ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}>
                      {step.title}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onToggleStep(step.id); }}
                    className={`min-h-[34px] hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isDone ? 'Completed' : 'Mark Done'}
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Accordion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`saudi-step-${step.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-200/80 px-4 sm:px-6 py-4 space-y-3 bg-white"
                  >
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {step.guidance}
                    </p>

                    {step.id === 1 && (
                      <div className="pt-2">
                        <a
                          href="https://studyinsaudi.sa/en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-900 text-xs"
                          aria-label="Open Study in Saudi portal"
                        >
                          <span>Go to studyinsaudi.sa/en</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Status: {isDone ? 'Finished' : 'In Progress'}</span>
                      <button
                        type="button"
                        onClick={() => onToggleStep(step.id)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        {isDone ? 'Mark Incomplete' : 'Mark Step Complete'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Verified Saudi Universities Directory */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <h4 className="font-sans text-base font-bold text-slate-900">
            Verified Saudi Universities on Study in Saudi
          </h4>
          <p className="text-xs text-slate-500">
            Explore participating universities, medium of instruction, and official links.
          </p>
        </div>
        <UniversityListDirectory initialDestination="saudi-arabia" />
      </div>

      {/* Embedded Application Tracker */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <h4 className="font-sans text-base font-bold text-slate-900">
            Application Progress Tracker
          </h4>
          <p className="text-xs text-slate-500">
            Track submission status and deadlines locally in your browser.
          </p>
        </div>
        <MyUniversityTracker />
      </div>
    </div>
  );
}
