import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Lightbulb, 
  Map, 
  CheckSquare, 
  Link2, 
  UserCheck, 
  ChevronRight, 
  ChevronDown
} from 'lucide-react';
import { SectionKey, NavGroupId, AcademicTestData } from '../../types/academicTesting';

interface NavItem {
  key: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  id: NavGroupId;
  label: string;
  items: NavItem[];
}

interface TestNavigationSidebarProps {
  currentTest: AcademicTestData;
  activeSection: SectionKey;
  onSelectSection: (section: SectionKey) => void;
  roadmapPercent: number;
}

export const TestNavigationSidebar: React.FC<TestNavigationSidebarProps> = ({
  currentTest,
  activeSection,
  onSelectSection,
  roadmapPercent
}) => {
  // Navigation structure in 4 distinct groups
  const NAV_GROUPS: NavGroup[] = [
    {
      id: 'learn',
      label: '1. Learn',
      items: [
        { key: 'overview', label: 'Test Overview', icon: BookOpen },
        { key: 'skills', label: 'Skills Tested', icon: Layers }
      ]
    },
    {
      id: 'practise',
      label: '2. Practise',
      items: [
        { key: 'questions', label: 'Question & Task Types', icon: HelpCircle },
        { key: 'practice', label: 'SVT Practice', icon: Sparkles, badge: 'Interactive' },
        { key: 'strategies', label: 'Practice Strategies', icon: Lightbulb }
      ]
    },
    {
      id: 'study-plan',
      label: '3. Study Plan',
      items: [
        { key: 'roadmap', label: 'Preparation Roadmap', icon: Map },
        { key: 'progress', label: 'Track Progress', icon: CheckSquare, badge: roadmapPercent > 0 ? `${roadmapPercent}%` : undefined }
      ]
    },
    {
      id: 'resources',
      label: '4. Resources',
      items: [
        { key: 'official-resources', label: 'Official Resources', icon: Link2 },
        { key: 'recommended-educator', label: 'Independent Educator', icon: UserCheck }
      ]
    }
  ];

  // Derive which group contains the currently active section
  const activeGroupId = NAV_GROUPS.find(g => g.items.some(i => i.key === activeSection))?.id || 'learn';

  // State to track open/expanded groups on desktop (all open by default or collapsible)
  const [openGroups, setOpenGroups] = useState<Record<NavGroupId, boolean>>({
    'learn': true,
    'practise': true,
    'study-plan': true,
    'resources': true
  });

  const toggleGroup = (groupId: NavGroupId) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="space-y-4">
      {/* ================================================================= */}
      {/* MOBILE FULL-WIDTH ACCESSIBLE SECTION SELECTOR                     */}
      {/* ================================================================= */}
      <div className="lg:hidden bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <label htmlFor="mobile-section-select" className="text-xs font-semibold text-slate-700 flex items-center justify-between font-sans">
          <span>Jump to Guide Section:</span>
          <span className="text-[11px] font-semibold text-teal-700">{currentTest.shortCode}</span>
        </label>
        
        <select
          id="mobile-section-select"
          value={activeSection}
          onChange={(e) => onSelectSection(e.target.value as SectionKey)}
          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 text-sm font-semibold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700 min-h-[44px] cursor-pointer font-sans"
        >
          {NAV_GROUPS.map((group) => (
            <optgroup key={group.id} label={group.label}>
              {group.items.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label} {item.badge ? `(${item.badge})` : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* ================================================================= */}
      {/* DESKTOP COMPACT STICKY GROUPED SIDEBAR                            */}
      {/* ================================================================= */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 p-4 shadow-xs sticky top-20 text-left">
        {/* Active Test Header Label */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              currentTest.id === 'det' ? 'bg-teal-600' : currentTest.id === 'ielts' ? 'bg-rose-600' : 'bg-[#102A43]'
            }`}></span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide font-sans">
              {currentTest.name}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-sans">
            4 Groups
          </span>
        </div>

        {/* 4 Group Accordions */}
        <nav className="space-y-3" aria-label="Test Preparation Sections">
          {NAV_GROUPS.map((group) => {
            const isOpen = openGroups[group.id];
            const isGroupActive = group.id === activeGroupId;

            return (
              <div key={group.id} className="space-y-1">
                {/* Group Header Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer font-sans ${
                    isGroupActive
                      ? 'text-teal-900 bg-teal-50/60'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span>{group.label}</span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {/* Group Items */}
                {isOpen && (
                  <div className="space-y-0.5 pl-1 animate-fadeIn">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.key;

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => onSelectSection(item.key)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[38px] font-sans ${
                            isActive
                              ? 'bg-[#102A43] text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {isActive ? (
                            <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0 ml-1" />
                          ) : item.badge ? (
                            <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded shrink-0 ml-1 font-sans ${
                              item.key === 'practice'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Study Plan Mini Progress Card */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 font-sans">
            <span>Roadmap Progress</span>
            <span className="font-semibold text-teal-700">{roadmapPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${roadmapPercent}%` }}
              role="progressbar"
              aria-valuenow={roadmapPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
