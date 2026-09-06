import React from 'react';
import { 
  X, Award, ShieldCheck, Lock, Sparkles, Clock, FileText, CheckCircle2 
} from 'lucide-react';
import { VolunteerHourLog } from '../types';

export interface TranscriptCertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    uid: string;
    name?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: string;
    joinedAt?: any;
    hasCrown?: boolean;
    customBadge?: string;
  } | null;
  logs: VolunteerHourLog[];
}

export default function TranscriptCertificateGeneratorModal({
  isOpen,
  onClose,
  member,
  logs
}: TranscriptCertificateGeneratorModalProps) {
  if (!isOpen || !member) return null;

  const memberName = member.name || member.displayName || 'Volunteer Scholar';
  
  // Filter logs for this specific member
  const memberLogs = logs.filter(
    l => l.userId === member.uid || (member.email && l.userEmail?.toLowerCase() === member.email.toLowerCase())
  );

  const totalHours = memberLogs.reduce((sum, l) => {
    if (typeof l.hours === 'number') return sum + l.hours;
    if (typeof l.minutes === 'number') return sum + (l.minutes / 60);
    return sum;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col text-left">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/20 rounded-2xl border border-amber-400/30 text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white font-display">
                Verified Credentials — Coming Soon
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Credential & Transcript Infrastructure
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Standard Development & Verification Pilot</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Client-side certificate generation, automated signatures, and simulated verification codes have been disabled to prepare for authentic, accredited institutional verification standards.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Current Member Standing
            </h3>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Volunteer:</span>
              <span className="font-bold text-slate-900">{memberName}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Logged Service Hours:</span>
              <span className="font-bold text-slate-900">{totalHours.toFixed(1)} Hours</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-500 font-medium">Verified Records:</span>
              <span className="font-semibold text-indigo-700">{memberLogs.length} Activities on File</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              When the verified credential registry launches, eligible active members will be able to export digitally certified transcripts verified directly against administrative service logs.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
