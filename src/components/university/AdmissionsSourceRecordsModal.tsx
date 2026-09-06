import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Building2, 
  Globe, 
  FileText, 
  Layers,
  Search,
  BookOpen
} from 'lucide-react';
import { ADMISSIONS_SOURCE_RECORDS, SourceReviewRecord } from '../../data/admissionsSourceRecords';

interface AdmissionsSourceRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: SourceReviewRecord['topic'] | 'all';
}

export default function AdmissionsSourceRecordsModal({
  isOpen,
  onClose,
  initialTopic = 'all'
}: AdmissionsSourceRecordsModalProps) {
  const [selectedTopic, setSelectedTopic] = useState<SourceReviewRecord['topic'] | 'all'>(initialTopic);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRecords = ADMISSIONS_SOURCE_RECORDS.filter(record => {
    if (selectedTopic !== 'all' && record.topic !== selectedTopic) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        record.title.toLowerCase().includes(q) ||
        record.institutionOrBody.toLowerCase().includes(q) ||
        record.country.toLowerCase().includes(q) ||
        record.policyNotesAndDistinctions.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-records-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto min-h-screen p-4 sm:p-6 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs font-sans text-slate-900"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="source-records-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
                SVT Source Review & Policy Verification Records
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Official source audit logs, institutional policies, and verified review dates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Records ({ADMISSIONS_SOURCE_RECORDS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTopic('financial-aid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === 'financial-aid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Financial Aid
            </button>
            <button
              type="button"
              onClick={() => setSelectedTopic('admissions-policy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === 'admissions-policy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Admissions Policies
            </button>
            <button
              type="button"
              onClick={() => setSelectedTopic('testing-proficiency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === 'testing-proficiency'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              DET & Testing
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Modal Content / Records List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-4 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                      {record.institutionOrBody}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {record.applicantCategory}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Cycle: {record.applicableCycle}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    {record.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified ({record.dateChecked})</span>
                  </span>
                </div>
              </div>

              {/* Key findings bullet list */}
              <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1">
                  Key Verified Findings:
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  {record.keyFindings.map((finding, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Policy notes and distinctions */}
              <div className="text-xs text-slate-600 leading-relaxed border-l-2 border-amber-400 pl-3 py-0.5 bg-amber-50/40 rounded-r">
                <span className="font-semibold text-slate-800">Policy Note & Distinction: </span>
                {record.policyNotesAndDistinctions}
              </div>

              {/* Direct Official Link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Primary Source: <strong className="text-slate-700">{record.officialSourceLabel}</strong>
                </span>
                <a
                  href={record.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
                >
                  <span>Open Official URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <p>SVT maintains an open record policy: all facts are checked directly against official university and testing portals.</p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer transition-colors"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
