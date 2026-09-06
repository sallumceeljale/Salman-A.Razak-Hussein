import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Calendar,
  Layers,
  FileText,
  Clock,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  UserTrackedUniversity, 
  TrackingStatus, 
  DecisionStatus, 
  ApplicationPlanType 
} from '../../types/universityApplications';
import { VERIFIED_UNIVERSITIES } from '../../data/universityApplicationsData';

const TRACKER_LOCAL_STORAGE_KEY = 'svt_my_university_tracker_v1';

export default function MyUniversityTracker() {
  const [trackedList, setTrackedList] = useState<UserTrackedUniversity[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPlan, setFormPlan] = useState<string>('Regular Decision');
  const [formAppDeadline, setFormAppDeadline] = useState('');
  const [formAidDeadline, setFormAidDeadline] = useState('');
  const [formAdmissionsUrl, setFormAdmissionsUrl] = useState('');
  const [formFinancialAidUrl, setFormFinancialAidUrl] = useState('');
  const [formRecStatus, setFormRecStatus] = useState<TrackingStatus>('not-started');
  const [formTranscriptStatus, setFormTranscriptStatus] = useState<TrackingStatus>('not-started');
  const [formEssayStatus, setFormEssayStatus] = useState<TrackingStatus>('not-started');
  const [formSubStatus, setFormSubStatus] = useState<TrackingStatus>('not-started');
  const [formDecisionStatus, setFormDecisionStatus] = useState<DecisionStatus>('pending');
  const [formNotes, setFormNotes] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TRACKER_LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTrackedList(parsed);
        }
      }
    } catch (e) {
      console.warn('Unable to load tracker from localStorage:', e);
    }
  }, []);

  // Save to localStorage helper
  const saveTrackedList = (newList: UserTrackedUniversity[]) => {
    setTrackedList(newList);
    try {
      localStorage.setItem(TRACKER_LOCAL_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.warn('Unable to save tracker to localStorage:', e);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const resetForm = () => {
    setFormName('');
    setFormLocation('');
    setFormPlan('Regular Decision');
    setFormAppDeadline('');
    setFormAidDeadline('');
    setFormAdmissionsUrl('');
    setFormFinancialAidUrl('');
    setFormRecStatus('not-started');
    setFormTranscriptStatus('not-started');
    setFormEssayStatus('not-started');
    setFormSubStatus('not-started');
    setFormDecisionStatus('pending');
    setFormNotes('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = (prefillUniName?: string) => {
    resetForm();
    if (prefillUniName) {
      const matched = VERIFIED_UNIVERSITIES.find(u => u.name.toLowerCase() === prefillUniName.toLowerCase());
      if (matched) {
        setFormName(matched.name);
        setFormLocation(matched.location);
        setFormAdmissionsUrl(matched.admissionsUrl);
        setFormFinancialAidUrl(matched.financialAidUrl || '');
        setFormAppDeadline(matched.applicationDeadlinesNote || '');
        setFormAidDeadline(matched.financialAidDeadlinesNote || '');
      } else {
        setFormName(prefillUniName);
      }
    }
    setIsAdding(true);
  };

  const handleStartEdit = (entry: UserTrackedUniversity) => {
    setEditingId(entry.id);
    setFormName(entry.universityName);
    setFormLocation(entry.location || '');
    setFormPlan(entry.applicationPlan);
    setFormAppDeadline(entry.applicationDeadline);
    setFormAidDeadline(entry.financialAidDeadline || '');
    setFormAdmissionsUrl(entry.admissionsUrl || '');
    setFormFinancialAidUrl(entry.financialAidUrl || '');
    setFormRecStatus(entry.recommendationStatus);
    setFormTranscriptStatus(entry.transcriptStatus);
    setFormEssayStatus(entry.essayStatus);
    setFormSubStatus(entry.submissionStatus);
    setFormDecisionStatus(entry.decisionStatus);
    setFormNotes(entry.notes || '');
    setIsAdding(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showNotification('Please provide a university name.');
      return;
    }

    const now = new Date().toISOString();

    if (editingId) {
      const updated = trackedList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            universityName: formName.trim(),
            location: formLocation.trim(),
            applicationPlan: formPlan,
            applicationDeadline: formAppDeadline.trim() || 'Verify on website',
            financialAidDeadline: formAidDeadline.trim(),
            admissionsUrl: formAdmissionsUrl.trim(),
            financialAidUrl: formFinancialAidUrl.trim(),
            recommendationStatus: formRecStatus,
            transcriptStatus: formTranscriptStatus,
            essayStatus: formEssayStatus,
            submissionStatus: formSubStatus,
            decisionStatus: formDecisionStatus,
            notes: formNotes.trim(),
            updatedAt: now
          };
        }
        return item;
      });
      saveTrackedList(updated);
      showNotification(`Updated "${formName.trim()}".`);
    } else {
      const newEntry: UserTrackedUniversity = {
        id: `tracker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        universityName: formName.trim(),
        location: formLocation.trim(),
        applicationPlan: formPlan,
        applicationDeadline: formAppDeadline.trim() || 'Verify on website',
        financialAidDeadline: formAidDeadline.trim(),
        admissionsUrl: formAdmissionsUrl.trim(),
        financialAidUrl: formFinancialAidUrl.trim(),
        recommendationStatus: formRecStatus,
        transcriptStatus: formTranscriptStatus,
        essayStatus: formEssayStatus,
        submissionStatus: formSubStatus,
        decisionStatus: formDecisionStatus,
        notes: formNotes.trim(),
        createdAt: now,
        updatedAt: now
      };
      saveTrackedList([newEntry, ...trackedList]);
      showNotification(`Added "${formName.trim()}" to your application tracker.`);
    }

    resetForm();
  };

  const handleDeleteEntry = (id: string, name: string) => {
    const updated = trackedList.filter(item => item.id !== id);
    saveTrackedList(updated);
    showNotification(`Removed "${name}" from your list.`);
  };

  const handleQuickStatusCycle = (
    id: string, 
    field: 'recommendationStatus' | 'transcriptStatus' | 'essayStatus' | 'submissionStatus'
  ) => {
    const statuses: TrackingStatus[] = ['not-started', 'in-progress', 'ready', 'submitted'];
    const updated = trackedList.map(item => {
      if (item.id === id) {
        const currentIndex = statuses.indexOf(item[field]);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return {
          ...item,
          [field]: statuses[nextIndex],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    saveTrackedList(updated);
  };

  const handleExportChecklist = () => {
    if (trackedList.length === 0) {
      showNotification('No universities in your list to export.');
      return;
    }

    const nonSensitiveExport = trackedList.map(u => ({
      University: u.universityName,
      Location: u.location || 'N/A',
      ApplicationPlan: u.applicationPlan,
      ApplicationDeadline: u.applicationDeadline,
      FinancialAidDeadline: u.financialAidDeadline || 'N/A',
      Recommendations: u.recommendationStatus,
      Transcript: u.transcriptStatus,
      Essays: u.essayStatus,
      Submission: u.submissionStatus,
      Decision: u.decisionStatus,
      Notes: u.notes || ''
    }));

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nonSensitiveExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `svt_university_application_tracker_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Exported application checklist successfully.');
  };

  const handleResetAll = () => {
    saveTrackedList([]);
    setShowResetConfirm(false);
    resetForm();
    showNotification('All local tracker data has been reset.');
  };

  const formatStatusLabel = (status: TrackingStatus) => {
    switch (status) {
      case 'submitted': return { label: 'Submitted', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'ready': return { label: 'Ready', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'in-progress': return { label: 'In Progress', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      default: return { label: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h4 className="font-sans text-base font-bold text-slate-900">
              My Private Application Tracker
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            Saved exclusively in your browser (<code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">localStorage</code>). No personal documents or grades collected.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => handleStartAdd()}
            className="min-h-[38px] px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add University</span>
          </button>

          {trackedList.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportChecklist}
                className="min-h-[38px] px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Export a simple non-sensitive JSON file"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Checklist</span>
              </button>

              {showResetConfirm ? (
                <div className="flex items-center gap-1 p-1 rounded-lg border border-red-200 bg-red-50 text-xs">
                  <span className="text-[11px] text-red-700 px-1 font-semibold">Clear list?</span>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="min-h-[38px] px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Reset all local entries"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="text-blue-700 hover:text-blue-900 cursor-pointer font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Add / Edit Form Modal or Inline Drawer */}
      {isAdding && (
        <form 
          onSubmit={handleSaveEntry}
          className="p-5 rounded-xl border border-blue-200 bg-slate-50 space-y-4 text-slate-900"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h5 className="font-sans text-sm font-bold text-slate-900">
              {editingId ? 'Edit Application Entry' : 'Add University to Tracker'}
            </h5>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* University Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                University Name *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Harvard University"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Location
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={e => setFormLocation(e.target.value)}
                placeholder="e.g. Cambridge, MA"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Application Plan */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Application Plan
              </label>
              <select
                value={formPlan}
                onChange={e => setFormPlan(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Regular Decision">Regular Decision (RD)</option>
                <option value="Early Action">Early Action (EA)</option>
                <option value="Early Decision">Early Decision (ED - Binding)</option>
                <option value="Early Decision 2">Early Decision 2 (ED2 - Binding)</option>
                <option value="Restrictive Early Action">Restrictive Early Action (REA)</option>
                <option value="Single-Choice Early Action">Single-Choice Early Action (SCEA)</option>
                <option value="Rolling Admission">Rolling Admission</option>
                <option value="Study in Saudi Cycle">Study in Saudi Portal Intake</option>
              </select>
            </div>

            {/* App Deadline */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Application Deadline
              </label>
              <input
                type="text"
                value={formAppDeadline}
                onChange={e => setFormAppDeadline(e.target.value)}
                placeholder="e.g. Jan 1, 2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Financial Aid Deadline */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Financial Aid Deadline
              </label>
              <input
                type="text"
                value={formAidDeadline}
                onChange={e => setFormAidDeadline(e.target.value)}
                placeholder="e.g. Feb 1, 2026"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Decision Status */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Decision Status
              </label>
              <select
                value={formDecisionStatus}
                onChange={e => setFormDecisionStatus(e.target.value as DecisionStatus)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="admitted">Admitted</option>
                <option value="deferred">Deferred</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="denied">Denied</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          {/* Task Status Toggles */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Recommendations</label>
              <select
                value={formRecStatus}
                onChange={e => setFormRecStatus(e.target.value as TrackingStatus)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Transcripts</label>
              <select
                value={formTranscriptStatus}
                onChange={e => setFormTranscriptStatus(e.target.value as TrackingStatus)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Essays</label>
              <select
                value={formEssayStatus}
                onChange={e => setFormEssayStatus(e.target.value as TrackingStatus)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Submission</label>
              <select
                value={formSubStatus}
                onChange={e => setFormSubStatus(e.target.value as TrackingStatus)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700 block">
              Personal Notes (portal login links, reminders - no sensitive data)
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="e.g. Teacher recommender: Mrs. Smith, CSS Profile submitted on Oct 25"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {editingId ? 'Save Changes' : 'Add University'}
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {trackedList.length === 0 && !isAdding && (
        <div className="p-8 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h5 className="font-sans text-sm font-bold text-slate-800">
              No Universities Added Yet
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track deadlines, essay completion, recommendations, and official portal statuses in one private place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleStartAdd()}
            className="min-h-[38px] px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Your First University</span>
          </button>
        </div>
      )}

      {/* List Table / Cards */}
      {trackedList.length > 0 && (
        <div className="space-y-3">
          {trackedList.map((item) => {
            const recFmt = formatStatusLabel(item.recommendationStatus);
            const trnFmt = formatStatusLabel(item.transcriptStatus);
            const essFmt = formatStatusLabel(item.essayStatus);
            const subFmt = formatStatusLabel(item.submissionStatus);

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all space-y-3 text-slate-900"
              >
                {/* Header Row: Name, Plan, Decision & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h5 className="font-sans text-base font-bold text-slate-900">
                      {item.universityName}
                    </h5>
                    {item.location && (
                      <span className="text-xs text-slate-500">
                        ({item.location})
                      </span>
                    )}
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {item.applicationPlan}
                    </span>
                    {item.decisionStatus !== 'pending' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                        {item.decisionStatus}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Edit entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(item.id, item.universityName)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deadlines Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>App Deadline:</strong> {item.applicationDeadline}</span>
                  </div>
                  {item.financialAidDeadline && (
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Aid Deadline:</strong> {item.financialAidDeadline}</span>
                    </div>
                  )}
                </div>

                {/* Interactive Status Pills (Click to toggle) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Application Task Milestones (Click badge to advance status):</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {/* Recommendations */}
                    <button
                      type="button"
                      onClick={() => handleQuickStatusCycle(item.id, 'recommendationStatus')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:opacity-90 ${recFmt.color}`}
                      title="Click to cycle status"
                    >
                      <span className="text-[10px] font-bold block uppercase opacity-75">Recommendations</span>
                      <span className="font-semibold text-xs">{recFmt.label}</span>
                    </button>

                    {/* Transcript */}
                    <button
                      type="button"
                      onClick={() => handleQuickStatusCycle(item.id, 'transcriptStatus')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:opacity-90 ${trnFmt.color}`}
                      title="Click to cycle status"
                    >
                      <span className="text-[10px] font-bold block uppercase opacity-75">Transcript</span>
                      <span className="font-semibold text-xs">{trnFmt.label}</span>
                    </button>

                    {/* Essays */}
                    <button
                      type="button"
                      onClick={() => handleQuickStatusCycle(item.id, 'essayStatus')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:opacity-90 ${essFmt.color}`}
                      title="Click to cycle status"
                    >
                      <span className="text-[10px] font-bold block uppercase opacity-75">Essays</span>
                      <span className="font-semibold text-xs">{essFmt.label}</span>
                    </button>

                    {/* Submission */}
                    <button
                      type="button"
                      onClick={() => handleQuickStatusCycle(item.id, 'submissionStatus')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:opacity-90 ${subFmt.color}`}
                      title="Click to cycle status"
                    >
                      <span className="text-[10px] font-bold block uppercase opacity-75">Submission</span>
                      <span className="font-semibold text-xs">{subFmt.label}</span>
                    </button>
                  </div>
                </div>

                {/* Notes footer */}
                {item.notes && (
                  <p className="text-xs text-slate-500 italic pt-1">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
