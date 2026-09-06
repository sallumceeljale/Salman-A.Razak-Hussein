import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Globe2, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft,
  Info,
  BookOpen,
  Languages,
  School
} from 'lucide-react';
import { UniversityDestinationId } from '../../types/universityApplications';
import { DESTINATION_GUIDES } from '../../data/destinationGuidesData';
import { DestinationExplorer } from './DestinationExplorer';
import { DestinationGuideComponent } from './DestinationGuideComponent';
import { DocumentComparisonTool } from './DocumentComparisonTool';
import { TestLanguageGuide } from './TestLanguageGuide';
import { PersonalApplicationPlanner } from './PersonalApplicationPlanner';
import UsApplicationGuide from './UsApplicationGuide';
import SaudiArabiaApplicationGuide from './SaudiArabiaApplicationGuide';

interface UniversityApplicationsHubProps {
  onNavigateToSection?: (sectionId: string) => void;
}

const DESTINATION_STORAGE_KEY = 'svt_selected_uni_destination_v1';
const US_PROGRESS_STORAGE_KEY = 'svt_us_pathway_completed_steps_v1';
const SAUDI_PROGRESS_STORAGE_KEY = 'svt_saudi_pathway_completed_steps_v1';

type ActiveHubView = 'explorer' | 'guide' | 'comparison' | 'tests' | 'planner';

export default function UniversityApplicationsHub({
  onNavigateToSection
}: UniversityApplicationsHubProps) {
  const [activeView, setActiveView] = useState<ActiveHubView>('explorer');
  const [selectedDestinationId, setSelectedDestinationId] = useState<UniversityDestinationId | null>(null);

  // US and Saudi specific step progress (for backward compatibility)
  const [usCompletedSteps, setUsCompletedSteps] = useState<number[]>([]);
  const [saudiCompletedSteps, setSaudiCompletedSteps] = useState<number[]>([]);

  // Step completion tracking map for all 10 destinations
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, string[]>>({});

  // Guide format toggle (for US / Saudi if user wants to see classic deep modules vs standard guide)
  const [useClassicGuide, setUseClassicGuide] = useState<boolean>(false);

  // Load saved state and URL hash
  useEffect(() => {
    try {
      const savedUsProgress = localStorage.getItem(US_PROGRESS_STORAGE_KEY);
      if (savedUsProgress) {
        setUsCompletedSteps(JSON.parse(savedUsProgress));
      }

      const savedSaudiProgress = localStorage.getItem(SAUDI_PROGRESS_STORAGE_KEY);
      if (savedSaudiProgress) {
        setSaudiCompletedSteps(JSON.parse(savedSaudiProgress));
      }

      // Load progress for all 10 destinations
      const stepsMap: Record<string, string[]> = {};
      DESTINATION_GUIDES.forEach(dest => {
        const key = `svt_${dest.id.replace(/-/g, '_')}_pathway_completed_steps_v1`;
        const val = localStorage.getItem(key);
        if (val) {
          try {
            stepsMap[dest.id] = JSON.parse(val);
          } catch {
            stepsMap[dest.id] = [];
          }
        }
      });
      setCompletedStepsMap(stepsMap);

      // Check URL parameters / hash on mount
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const destParam = hashParams.get('destination') as UniversityDestinationId | null;
      const viewParam = hashParams.get('view') as ActiveHubView | null;

      if (destParam && DESTINATION_GUIDES.some(d => d.id === destParam)) {
        setSelectedDestinationId(destParam);
        setActiveView('guide');
      } else if (viewParam && ['comparison', 'tests', 'planner'].includes(viewParam)) {
        setActiveView(viewParam);
      }
    } catch (e) {
      console.warn('Error reading from localStorage or URL:', e);
    }
  }, []);

  // Handle browser popstate for back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const destParam = hashParams.get('destination') as UniversityDestinationId | null;
        const viewParam = hashParams.get('view') as ActiveHubView | null;

        if (destParam && DESTINATION_GUIDES.some(d => d.id === destParam)) {
          setSelectedDestinationId(destParam);
          setActiveView('guide');
        } else if (viewParam && ['comparison', 'tests', 'planner'].includes(viewParam)) {
          setActiveView(viewParam);
        } else {
          setSelectedDestinationId(null);
          setActiveView('explorer');
        }
      } catch (e) {
        console.warn('Error in popstate handler', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateUrlHash = (view: ActiveHubView, destinationId?: UniversityDestinationId | null) => {
    try {
      const params = new URLSearchParams();
      if (destinationId) {
        params.set('destination', destinationId);
      } else if (view !== 'explorer') {
        params.set('view', view);
      }
      const hash = params.toString();
      const newUrl = hash ? `#${hash}` : window.location.pathname;
      window.history.pushState(null, '', newUrl);
    } catch (e) {
      // ignore
    }
  };

  const handleSelectDestination = (destId: UniversityDestinationId) => {
    setSelectedDestinationId(destId);
    setActiveView('guide');
    updateUrlHash('guide', destId);
    try {
      localStorage.setItem(DESTINATION_STORAGE_KEY, destId);
    } catch (e) {
      console.warn('Error saving destination to localStorage:', e);
    }
  };

  const handleBackToExplorer = () => {
    setSelectedDestinationId(null);
    setActiveView('explorer');
    updateUrlHash('explorer', null);
    try {
      localStorage.removeItem(DESTINATION_STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing destination in localStorage:', e);
    }
  };

  const handleOpenView = (view: ActiveHubView) => {
    setActiveView(view);
    updateUrlHash(view, selectedDestinationId);
  };

  const handleToggleUsStep = (stepId: number) => {
    const updated = usCompletedSteps.includes(stepId)
      ? usCompletedSteps.filter(id => id !== stepId)
      : [...usCompletedSteps, stepId];
    setUsCompletedSteps(updated);
    try {
      localStorage.setItem(US_PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving US progress:', e);
    }
  };

  const handleToggleSaudiStep = (stepId: number) => {
    const updated = saudiCompletedSteps.includes(stepId)
      ? saudiCompletedSteps.filter(id => id !== stepId)
      : [...saudiCompletedSteps, stepId];
    setSaudiCompletedSteps(updated);
    try {
      localStorage.setItem(SAUDI_PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving Saudi progress:', e);
    }
  };

  const activeGuide = DESTINATION_GUIDES.find(d => d.id === selectedDestinationId);

  return (
    <div className="space-y-8" id="university-applications-hub-root">
      {/* 1. Comparison Tool View */}
      {activeView === 'comparison' && (
        <DocumentComparisonTool
          onBack={() => {
            if (selectedDestinationId) {
              setActiveView('guide');
              updateUrlHash('guide', selectedDestinationId);
            } else {
              handleBackToExplorer();
            }
          }}
          onSelectDestination={handleSelectDestination}
        />
      )}

      {/* 2. Standardized Tests & Language Guide View */}
      {activeView === 'tests' && (
        <TestLanguageGuide
          onBack={() => {
            if (selectedDestinationId) {
              setActiveView('guide');
              updateUrlHash('guide', selectedDestinationId);
            } else {
              handleBackToExplorer();
            }
          }}
          onSelectDestination={handleSelectDestination}
          onOpenTestPrepHub={(sectionId) => {
            if (onNavigateToSection) {
              onNavigateToSection(sectionId || 'sat');
            }
          }}
        />
      )}

      {/* 3. Global Personal Application Planner View */}
      {activeView === 'planner' && (
        <PersonalApplicationPlanner
          onBack={() => {
            if (selectedDestinationId) {
              setActiveView('guide');
              updateUrlHash('guide', selectedDestinationId);
            } else {
              handleBackToExplorer();
            }
          }}
          onSelectDestination={handleSelectDestination}
        />
      )}

      {/* 4. Destination Explorer (Main 10-Destination Hub Grid) */}
      {(activeView === 'explorer' || (!activeGuide && activeView === 'guide')) && (
        <DestinationExplorer
          onSelectDestination={handleSelectDestination}
          onOpenComparison={() => handleOpenView('comparison')}
          onOpenTestsGuide={() => handleOpenView('tests')}
          onOpenPlanner={() => handleOpenView('planner')}
          completedStepsMap={completedStepsMap}
        />
      )}

      {/* 5. Destination Guide View */}
      {activeView === 'guide' && activeGuide && (
        <div className="space-y-6">
          {/* Classic vs Modular toggle for US and Saudi Arabia */}
          {(activeGuide.id === 'united-states' || activeGuide.id === 'saudi-arabia') && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700">
              <span>
                Viewing {activeGuide.countryName || activeGuide.name} in <strong>{useClassicGuide ? 'In-Depth Module View' : 'Standard Guide'}</strong>.
              </span>
              <button
                type="button"
                onClick={() => setUseClassicGuide(!useClassicGuide)}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                Switch to {useClassicGuide ? 'Standard Guide' : 'Classic In-Depth Modules'} →
              </button>
            </div>
          )}

          {useClassicGuide && activeGuide.id === 'united-states' ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleBackToExplorer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Destinations
              </button>
              <UsApplicationGuide
                completedStepIds={usCompletedSteps}
                onToggleStep={handleToggleUsStep}
                onNavigateToSection={onNavigateToSection}
              />
            </div>
          ) : useClassicGuide && activeGuide.id === 'saudi-arabia' ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleBackToExplorer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Destinations
              </button>
              <SaudiArabiaApplicationGuide
                completedStepIds={saudiCompletedSteps}
                onToggleStep={handleToggleSaudiStep}
              />
            </div>
          ) : (
            <DestinationGuideComponent
              guide={activeGuide}
              onBack={handleBackToExplorer}
              onSelectDestination={handleSelectDestination}
              onOpenComparison={() => handleOpenView('comparison')}
              onOpenTestsGuide={() => handleOpenView('tests')}
              onOpenPlanner={() => handleOpenView('planner')}
              onOpenTestPrepHub={(sectionId) => {
                if (onNavigateToSection) {
                  onNavigateToSection(sectionId || 'sat');
                }
              }}
            />
          )}
        </div>
      )}

      {/* Mandatory Official Disclaimer & Privacy Guidance Footer */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs text-slate-600" id="institutional-disclaimer-footer">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-medium text-slate-800">
              <strong>Independent Student Guidance:</strong> SVT provides independent educational guidance. It is not affiliated with universities, central admissions councils (e.g. Common App, UCAS, uni-assist, Study in Saudi, Parcoursup, Studielink), or government immigration authorities.
            </p>
            <p className="text-slate-500">
              Admissions requirements, testing benchmarks, tuition rates, and visa regulations evolve over time. Always verify current details directly on official university and platform websites.
            </p>
            <p className="text-slate-500 pt-1">
              <strong>Local Privacy:</strong> SVT never collects or stores private student documents, grades, transcripts, financial statements, or passports. All progress and planner notes are stored strictly inside your local browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
