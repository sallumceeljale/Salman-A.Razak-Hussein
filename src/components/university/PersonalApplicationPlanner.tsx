import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, School, Calendar, FileText, Download, AlertCircle, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { DESTINATION_GUIDES } from '../../data/destinationGuidesData';
import { UniversityDestinationId } from '../../types/universityApplications';
import { 
  getSavedApplications, 
  saveApplications, 
  subscribeToSavedUniversities 
} from '../../utils/universityStorage';

interface PersonalApplicationPlannerProps {
  onBack: () => void;
  onSelectDestination: (id: UniversityDestinationId) => void;
}

export interface UniversityApplicationPlan {
  id: string;
  countryId: UniversityDestinationId;
  universityName: string;
  program: string;
  deadline: string;
  portalUrl?: string;
  status: 'researching' | 'preparing' | 'submitted' | 'accepted' | 'conditional' | 'rejected' | 'waitlisted';
  checklist: {
    transcripts: boolean;
    recommendations: boolean;
    personalStatement: boolean;
    languageTest: boolean;
    standardizedTest: boolean;
    financialDocuments: boolean;
  };
  notes: string;
  createdAt: string;
}

export const PersonalApplicationPlanner: React.FC<PersonalApplicationPlannerProps> = ({
  onBack,
  onSelectDestination
}) => {
  const [applications, setApplications] = useState<UniversityApplicationPlan[]>(() => getSavedApplications());

  const [selectedFilterCountry, setSelectedFilterCountry] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Application Form State
  const [formCountry, setFormCountry] = useState<UniversityDestinationId>('united-states');
  const [formUniName, setFormUniName] = useState('');
  const [formProgram, setFormProgram] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formPortalUrl, setFormPortalUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Real-time synchronization
  useEffect(() => {
    const unsubscribe = subscribeToSavedUniversities((apps) => {
      setApplications(apps);
    });
    return () => unsubscribe();
  }, []);

  // Update storage whenever applications state is modified from inside planner
  const updateApplications = (newApps: UniversityApplicationPlan[]) => {
    setApplications(newApps);
    saveApplications(newApps);
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUniName.trim()) return;

    const newApp: UniversityApplicationPlan = {
      id: `app-${Date.now()}`,
      countryId: formCountry,
      universityName: formUniName.trim(),
      program: formProgram.trim() || 'General Undergraduate',
      deadline: formDeadline.trim() || 'Regular Decision',
      portalUrl: formPortalUrl.trim() || undefined,
      status: 'researching',
      checklist: {
        transcripts: false,
        recommendations: false,
        personalStatement: false,
        languageTest: false,
        standardizedTest: false,
        financialDocuments: false
      },
      notes: formNotes.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newApp, ...applications];
    updateApplications(updated);

    // Reset Form
    setFormUniName('');
    setFormProgram('');
    setFormDeadline('');
    setFormPortalUrl('');
    setFormNotes('');
    setIsAddingNew(false);
  };

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(app => app.id !== id);
    updateApplications(updated);
  };

  const handleToggleChecklistItem = (appId: string, itemKey: keyof UniversityApplicationPlan['checklist']) => {
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        checklist: {
          ...app.checklist,
          [itemKey]: !app.checklist[itemKey]
        }
      };
    });
    updateApplications(updated);
  };

  const handleUpdateStatus = (appId: string, status: UniversityApplicationPlan['status']) => {
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      return { ...app, status };
    });
    updateApplications(updated);
  };

  const handleUpdateNotes = (appId: string, notes: string) => {
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      return { ...app, notes };
    });
    updateApplications(updated);
  };

  const filteredApps = applications.filter(app => {
    if (selectedFilterCountry !== 'all' && app.countryId !== selectedFilterCountry) return false;
    if (selectedStatusFilter !== 'all' && app.status !== selectedStatusFilter) return false;
    return true;
  });

  const getDestination = (id: UniversityDestinationId) => {
    return DESTINATION_GUIDES.find(d => d.id === id);
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `svt_university_application_plan_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6" id="personal-planner-view">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            id="btn-back-from-planner"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="text-xs font-bold text-slate-900">Personal University Application Planner</h1>
        </div>

        <div className="flex items-center gap-2">
          {applications.length > 0 && (
            <button
              onClick={exportToJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Export your tracker as a private JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              Backup Data
            </button>
          )}

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            id="btn-toggle-add-app"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAddingNew ? 'Cancel' : 'Add Target University'}
          </button>
        </div>
      </div>

      {/* Hero Explainer Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <School className="w-3.5 h-3.5" />
            Private Browser-Side Storage
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            My Global Target Universities Tracker
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Track applications across any of the 10 study destinations in one centralized planner. Manage individual deadlines, document checklists, and offer statuses privately on your device.
          </p>
        </div>
      </div>

      {/* Add New Application Form Modal/Collapse */}
      {isAddingNew && (
        <form onSubmit={handleAddApplication} className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-sm space-y-4" id="form-new-application">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Add New Target University</h3>
            <span className="text-xs text-slate-500">Stored locally in your browser</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Study Destination *</label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value as UniversityDestinationId)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                required
              >
                {DESTINATION_GUIDES.map(d => {
                  const flag = d.flagEmoji || d.flag;
                  const name = d.countryName || d.name;
                  return (
                    <option key={d.id} value={d.id}>
                      {flag} {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">University Name *</label>
              <input
                type="text"
                placeholder="e.g. Technical University of Munich"
                value={formUniName}
                onChange={(e) => setFormUniName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Degree / Major</label>
              <input
                type="text"
                placeholder="e.g. B.Sc. Informatics"
                value={formProgram}
                onChange={(e) => setFormProgram(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Application Deadline</label>
              <input
                type="text"
                placeholder="e.g. July 15, 2027"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Portal / Website Link</label>
              <input
                type="url"
                placeholder="https://..."
                value={formPortalUrl}
                onChange={(e) => setFormPortalUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Plan</label>
              <input
                type="text"
                placeholder="e.g. Need to certify high school diploma before June"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Save Application
            </button>
          </div>
        </form>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFilterCountry('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilterCountry === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Destinations ({applications.length})
          </button>

          {DESTINATION_GUIDES.map(d => {
            const count = applications.filter(a => a.countryId === d.id).length;
            if (count === 0) return null;
            const flag = d.flagEmoji || d.flag;
            const name = d.countryName || d.name;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedFilterCountry(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  selectedFilterCountry === d.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{flag}</span>
                <span>{name} ({count})</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredApps.length} tracked applications
        </span>
      </div>

      {/* Application Cards List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No University Applications Tracked Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Click "Add Target University" above to start tracking your application deadlines, document checklist, and submission status.
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Application
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => {
            const dest = getDestination(app.countryId);
            const flag = dest?.flagEmoji || dest?.flag;
            const countryName = dest?.countryName || dest?.name;
            const totalItems = Object.keys(app.checklist).length;
            const completedItems = Object.values(app.checklist).filter(Boolean).length;
            const docPercent = Math.round((completedItems / totalItems) * 100);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                id={`planner-card-${app.id}`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onSelectDestination(app.countryId)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>{flag}</span>
                        <span>{countryName}</span>
                      </button>
                      <h3 className="text-base font-bold text-slate-900">{app.universityName}</h3>
                    </div>
                    <div className="text-xs text-slate-500">
                      Program: <span className="font-semibold text-slate-700">{app.program}</span> • Deadline: <span className="font-semibold text-slate-800">{app.deadline}</span>
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value as UniversityApplicationPlan['status'])}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border cursor-pointer ${
                        app.status === 'accepted' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        app.status === 'conditional' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                        app.status === 'submitted' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                        app.status === 'preparing' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-300' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="researching">Researching</option>
                      <option value="preparing">Preparing Application</option>
                      <option value="submitted">Submitted</option>
                      <option value="conditional">Conditional Offer</option>
                      <option value="accepted">Accepted / Offer Received</option>
                      <option value="waitlisted">Waitlisted</option>
                      <option value="rejected">Declined</option>
                    </select>

                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Document Readiness Checklist Strip */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Document Readiness Checklist</span>
                    <span className="font-semibold text-blue-600">{completedItems} of {totalItems} items ready ({docPercent}%)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[
                      { key: 'transcripts' as const, label: 'Transcripts' },
                      { key: 'recommendations' as const, label: 'Recommendations' },
                      { key: 'personalStatement' as const, label: 'Personal Essay' },
                      { key: 'languageTest' as const, label: 'Language Cert' },
                      { key: 'standardizedTest' as const, label: 'Aptitude / SAT' },
                      { key: 'financialDocuments' as const, label: 'Financial Proof' }
                    ].map(item => {
                      const isDone = app.checklist[item.key];
                      return (
                        <button
                          key={item.key}
                          onClick={() => handleToggleChecklistItem(app.id, item.key)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                            isDone
                              ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-300'
                              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                          )}
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add personal notes or login reminders (e.g. Applicant ID: 12345, Sent courier)..."
                    value={app.notes}
                    onChange={(e) => handleUpdateNotes(app.id, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {app.portalUrl && (
                    <a
                      href={app.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Open Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
