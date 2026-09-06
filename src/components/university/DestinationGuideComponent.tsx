import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  DollarSign,
  Globe2,
  Languages,
  School,
  FileText,
  ListOrdered,
  Bookmark,
  Check,
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { DestinationGuide, UniversityDestinationId, RequirementLevel } from '../../types/universityApplications';
import { DESTINATION_GUIDES } from '../../data/destinationGuidesData';
import { hasUniversityDirectory } from '../../data/universities';
import { UniversityDirectorySearch } from './UniversityDirectorySearch';
import { 
  getSavedApplications, 
  saveApplications, 
  removeSavedApplication, 
  subscribeToSavedUniversities 
} from '../../utils/universityStorage';

interface DestinationGuideComponentProps {
  guide: DestinationGuide;
  onBack: () => void;
  onSelectDestination: (id: UniversityDestinationId) => void;
  onOpenComparison: () => void;
  onOpenTestsGuide: () => void;
  onOpenPlanner?: () => void;
  onOpenTestPrepHub?: (tab?: string) => void;
}

const DESTINATION_ORDER: UniversityDestinationId[] = [
  'united-states',
  'saudi-arabia',
  'turkiye',
  'canada',
  'united-kingdom',
  'germany',
  'australia',
  'france',
  'netherlands',
  'malaysia'
];

type GuideSectionKey =
  | 'overview'
  | 'process'
  | 'requirements'
  | 'tests'
  | 'funding'
  | 'resources'
  | 'mylist';

const GLOBAL_PLANNER_STORAGE_KEY = 'svt_global_university_applications_planner_v1';

export const DestinationGuideComponent: React.FC<DestinationGuideComponentProps> = ({
  guide,
  onBack,
  onSelectDestination,
  onOpenComparison,
  onOpenTestsGuide,
  onOpenPlanner,
  onOpenTestPrepHub
}) => {
  const [activeSection, setActiveSection] = useState<GuideSectionKey>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const countryName = guide.countryName || guide.name;
  const flag = guide.flagEmoji || guide.flag;
  const tagline = guide.subtitle || guide.tagline;
  const summary = guide.overview || guide.summary;

  const hasDirectory = hasUniversityDirectory(guide.id);

  // Timeline Step Completion in localStorage
  const stepStorageKey = `svt_${guide.id.replace(/-/g, '_')}_pathway_completed_steps_v1`;
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(stepStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved Universities in My List (from global planner)
  const [savedUniversities, setSavedUniversities] = useState<any[]>(() => getSavedApplications());

  // Form state for adding custom university in My List
  const [customUniName, setCustomUniName] = useState('');
  const [customProgram, setCustomProgram] = useState('');
  const [customDeadline, setCustomDeadline] = useState('');

  // Sync completed steps
  useEffect(() => {
    try {
      localStorage.setItem(stepStorageKey, JSON.stringify(completedSteps));
    } catch (e) {
      console.error('Failed to save step progress', e);
    }
  }, [completedSteps, stepStorageKey]);

  // Real-time synchronization of saved universities across views
  useEffect(() => {
    const unsubscribe = subscribeToSavedUniversities((apps) => {
      setSavedUniversities(apps);
    });
    return () => unsubscribe();
  }, []);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const handleAddCustomUni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUniName.trim()) return;

    const newApp = {
      id: `app-${Date.now()}`,
      countryId: guide.id,
      universityName: customUniName.trim(),
      program: customProgram.trim() || 'General Undergraduate',
      deadline: customDeadline.trim() || 'Regular Decision',
      status: 'researching' as const,
      checklist: {
        transcripts: false,
        recommendations: false,
        personalStatement: false,
        languageTest: false,
        standardizedTest: false,
        financialDocuments: false
      },
      notes: `Custom entry for ${countryName}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newApp, ...savedUniversities];
    setSavedUniversities(updated);
    saveApplications(updated);

    setCustomUniName('');
    setCustomProgram('');
    setCustomDeadline('');
  };

  const handleRemoveSavedUni = (id: string) => {
    const updated = removeSavedApplication(id);
    setSavedUniversities(updated);
  };

  // Previous and Next Destination IDs
  const currentIndex = DESTINATION_ORDER.indexOf(guide.id);
  const prevDestinationId = currentIndex > 0 ? DESTINATION_ORDER[currentIndex - 1] : null;
  const nextDestinationId = currentIndex < DESTINATION_ORDER.length - 1 ? DESTINATION_ORDER[currentIndex + 1] : null;

  const prevDestination = prevDestinationId
    ? DESTINATION_GUIDES.find(d => d.id === prevDestinationId)
    : null;
  const nextDestination = nextDestinationId
    ? DESTINATION_GUIDES.find(d => d.id === nextDestinationId)
    : null;

  // Filtered universities for this country
  const countrySavedUnis = useMemo(() => {
    return savedUniversities.filter(item => item.countryId === guide.id);
  }, [savedUniversities, guide.id]);

  const timelineSteps = guide.timelineSteps || [];
  const totalSteps = timelineSteps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

  // Table of contents navigation items
  const navItems = [
    { key: 'overview' as GuideSectionKey, label: 'Overview' },
    { key: 'process' as GuideSectionKey, label: 'Application Process' },
    { key: 'requirements' as GuideSectionKey, label: 'Common Requirements' },
    { key: 'tests' as GuideSectionKey, label: 'Tests and Language' },
    { key: 'funding' as GuideSectionKey, label: 'Funding' },
    { key: 'resources' as GuideSectionKey, label: 'Official Resources' },
    { key: 'mylist' as GuideSectionKey, label: `My List (${countrySavedUnis.length})` }
  ];

  const renderRequirementBadge = (level: RequirementLevel) => {
    switch (level) {
      case 'common':
      case 'commonly-required':
        return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Common</span>;
      case 'sometimes':
      case 'sometimes-required':
        return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Sometimes</span>;
      case 'program-specific':
      case 'required-for-certain-programs':
        return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Program-Specific</span>;
      case 'after-admission':
      case 'required-after-admission':
        return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">After Admission</span>;
      case 'usually-not-required':
        return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">Usually Not Required</span>;
      default:
        return <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Verify</span>;
    }
  };

  return (
    <div className="space-y-8" id={`destination-guide-${guide.id}`}>
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 border-b border-slate-200 pb-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          id="btn-back-to-all-destinations"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All Destinations</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none select-none" aria-hidden="true">
              {flag}
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {countryName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Main route: {guide.primaryApplicationRoute || 'Direct University Applications'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenComparison}
              className="min-h-[44px] px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Compare with Another Country
            </button>
            <button
              type="button"
              onClick={onOpenTestsGuide}
              className="min-h-[44px] px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Test & Language Guide
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Left-side Table of Contents on Desktop + Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Guide Sections Accordion/Dropdown */}
        <div className="lg:hidden bg-slate-50 rounded-2xl border border-slate-200 p-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="w-full min-h-[44px] px-3 py-2 flex items-center justify-between font-semibold text-sm text-slate-900 bg-white rounded-xl border border-slate-200 cursor-pointer"
            aria-expanded={isMobileNavOpen}
          >
            <span>Section: {navItems.find(n => n.key === activeSection)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileNavOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMobileNavOpen && (
            <div className="mt-2 space-y-1 pt-1 border-t border-slate-200">
              {navItems.map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.key);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === item.key
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Left Table of Contents */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-6 bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Guide Sections
          </div>
          <nav aria-label="Guide Sections">
            {navItems.map(item => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="lg:col-span-3 space-y-8">
          {/* SECTION 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-6" id="guide-section-overview">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Overview of Studying in {countryName}
                </h2>
                <p className="text-base text-slate-700 leading-relaxed">
                  {summary}
                </p>

                {tagline && (
                  <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-3">
                    {tagline}
                  </p>
                )}

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 text-sm">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">Main Application Route</span>
                    <span className="text-slate-600">{guide.primaryApplicationRoute}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800 block mb-1">Standard Requirements</span>
                    <span className="text-slate-600">
                      {guide.commonRequirements?.length || 0} standard document categories
                    </span>
                  </div>
                </div>
              </div>

              {/* University Directory & Search - Embedded directly in the Overview */}
              {hasDirectory && (
                <div id="overview-university-directory">
                  <UniversityDirectorySearch
                    countryId={guide.id}
                    countryName={countryName}
                    onOpenPlanner={() => setActiveSection('mylist')}
                  />
                </div>
              )}

              {/* Guide Detailed Sub-sections */}
              {guide.sections && guide.sections.length > 0 && (
                <div className="space-y-4">
                  {guide.sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
                      <h3 className="text-lg font-bold text-slate-900">
                        {section.title}
                      </h3>
                      {section.subtitle && (
                        <p className="text-sm font-medium text-slate-600">
                          {section.subtitle}
                        </p>
                      )}
                      {section.summary && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {section.summary}
                        </p>
                      )}
                      {section.paragraphs && section.paragraphs.map((p, idx) => (
                        <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {section.items && section.items.length > 0 && (
                        <ul className="space-y-2 pt-2">
                          {section.items.map((item, iIdx) => (
                            <li key={iIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
                              <div className="font-semibold text-slate-900">{item.label}</div>
                              <p className="text-slate-600 mt-1">{item.description}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: APPLICATION PROCESS */}
          {activeSection === 'process' && (
            <div className="space-y-6" id="guide-section-process">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Application Timeline & Milestones
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Check off steps as you complete them. Progress is stored privately in your browser.
                    </p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 shrink-0">
                    {completedSteps.length} of {totalSteps} Completed ({progressPercent}%)
                  </div>
                </div>

                {timelineSteps.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4">No timeline steps listed for this country.</p>
                ) : (
                  <div className="space-y-4 pt-2">
                    {timelineSteps.map((step, sIdx) => {
                      const stepId = `step-${sIdx}`;
                      const isCompleted = completedSteps.includes(stepId);

                      return (
                        <div
                          key={sIdx}
                          className={`p-5 rounded-2xl border transition-colors ${
                            isCompleted
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <button
                              type="button"
                              onClick={() => toggleStep(stepId)}
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 cursor-pointer p-0.5"
                              aria-label={isCompleted ? `Mark milestone ${step.title} as incomplete` : `Mark milestone ${step.title} as complete`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className={`text-base font-bold ${isCompleted ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                                  {step.title}
                                </h3>
                                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                  {step.period}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {step.description}
                              </p>
                              {step.actionableMilestone && (
                                <div className="text-xs text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-100 mt-2 font-medium">
                                  Milestone: {step.actionableMilestone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: COMMON REQUIREMENTS */}
          {activeSection === 'requirements' && (
            <div className="space-y-6" id="guide-section-requirements">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Common Document Requirements
                  </h2>
                  <p className="text-sm text-slate-600">
                    Summary of standard documents typically required when applying to institutions in {countryName}.
                  </p>
                </div>

                {guide.commonRequirements && guide.commonRequirements.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {guide.commonRequirements.map((req) => (
                      <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900">{req.name}</h3>
                          {renderRequirementBadge(req.level)}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{req.description}</p>
                        {req.practicalTip && (
                          <div className="text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="font-semibold text-slate-700">Tip: </span>
                            {req.practicalTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-4">No specific document requirements listed.</p>
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: TESTS AND LANGUAGE */}
          {activeSection === 'tests' && (
            <div className="space-y-6" id="guide-section-tests">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Tests and Language Requirements
                  </h2>
                  <p className="text-sm text-slate-600">
                    Standardized admission and language proficiency tests relevant to {countryName}.
                  </p>
                </div>

                {guide.standardizedTests && guide.standardizedTests.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {guide.standardizedTests.map((t) => (
                      <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                            <span className="text-xs text-slate-500">{t.category}</span>
                          </div>
                          {renderRequirementBadge(t.requirementLevel)}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{t.description}</p>
                        {t.typicalScoreBenchmark && (
                          <div className="text-xs text-slate-600 font-medium">
                            Score Benchmark: {t.typicalScoreBenchmark}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 py-2 text-sm text-slate-600">
                    <p>
                      Standardized admission test policies vary by institution and program in {countryName}. Check individual university listings or consult the SVT Test & Language Guide for cross-country comparisons.
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={onOpenTestsGuide}
                        className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        Open Full Tests & Language Guide
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: FUNDING */}
          {activeSection === 'funding' && (
            <div className="space-y-6" id="guide-section-funding">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Scholarships & Funding Options
                  </h2>
                  <p className="text-sm text-slate-600">
                    Tuition models, government grants, and institutional financial aid in {countryName}.
                  </p>
                </div>

                {guide.scholarshipInfo && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {guide.scholarshipInfo.overview}
                    </p>

                    {guide.scholarshipInfo.types && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {guide.scholarshipInfo.types.map((st, sIdx) => (
                          <div key={sIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                            <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {guide.scholarshipInfo.realityCheck && (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="font-bold">Financial Reality Check</div>
                        <p className="leading-relaxed">{guide.scholarshipInfo.realityCheck}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 6: OFFICIAL RESOURCES */}
          {activeSection === 'resources' && (
            <div className="space-y-6" id="guide-section-resources">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Official Portals & Resources
                  </h2>
                  <p className="text-sm text-slate-600">
                    Direct links to government education ministries, central portals, and student visa agencies.
                  </p>
                </div>

                {guide.officialResources && guide.officialResources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {guide.officialResources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/70 transition-colors flex flex-col justify-between gap-3 group"
                        aria-label={`Visit official resource ${res.label} (opens in a new tab)`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {res.label}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" aria-hidden="true" />
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{res.organization}</p>
                          {res.description && (
                            <p className="text-xs text-slate-600 leading-relaxed pt-1">{res.description}</p>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-blue-600">Open Official Website →</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-4">No external resources listed.</p>
                )}
              </div>
            </div>
          )}

          {/* SECTION 7: MY LIST */}
          {activeSection === 'mylist' && (
            <div className="space-y-6" id="guide-section-mylist">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      My Target Universities in {countryName}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Private list stored in your browser. Add institutions from the directory or enter custom ones.
                    </p>
                  </div>
                  {onOpenPlanner && (
                    <button
                      type="button"
                      onClick={onOpenPlanner}
                      className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Open Global Planner →
                    </button>
                  )}
                </div>

                {/* Add Custom University Form */}
                <form onSubmit={handleAddCustomUni} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Add an Institution to My List
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={customUniName}
                      onChange={(e) => setCustomUniName(e.target.value)}
                      placeholder="University Name (e.g. Stanford)..."
                      required
                      className="min-h-[44px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      value={customProgram}
                      onChange={(e) => setCustomProgram(e.target.value)}
                      placeholder="Intended Program (optional)..."
                      className="min-h-[44px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      value={customDeadline}
                      onChange={(e) => setCustomDeadline(e.target.value)}
                      placeholder="Target Deadline (e.g. Jan 15)..."
                      className="min-h-[44px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to My List</span>
                  </button>
                </form>

                {/* Saved List */}
                {countrySavedUnis.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-sm space-y-2">
                    <p className="font-semibold text-slate-800">No institutions saved for {countryName} yet</p>
                    <p className="text-xs">
                      {hasDirectory ? 'Use the University Search tab above to explore and save institutions with one click.' : 'Add your target institutions using the form above.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {countrySavedUnis.map((uni) => (
                      <div
                        key={uni.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-900">{uni.universityName}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span>Program: {uni.program || 'Undergraduate'}</span>
                            <span>•</span>
                            <span>Deadline: {uni.deadline || 'Regular Decision'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {uni.portalUrl && (
                            <a
                              href={uni.portalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 flex items-center gap-1"
                            >
                              <span>Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSavedUni(uni.id)}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Destination Navigation Controls (Previous & Next) */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" id="guide-bottom-nav">
            {prevDestination ? (
              <button
                type="button"
                onClick={() => {
                  onSelectDestination(prevDestination.id);
                  setActiveSection('overview');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous: {prevDestination.countryName || prevDestination.name}</span>
              </button>
            ) : (
              <div />
            )}

            {nextDestination ? (
              <button
                type="button"
                onClick={() => {
                  onSelectDestination(nextDestination.id);
                  setActiveSection('overview');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Next: {nextDestination.countryName || nextDestination.name}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Independent Student Guidance Note */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900 text-xs">
              Independent Student Guidance
            </div>
            <p className="leading-relaxed">
              SVT summarizes common application processes using official resources. Requirements and policies can change, so students should confirm every important detail with the university or responsible government platform.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
