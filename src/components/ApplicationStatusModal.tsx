import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Award, 
  User, 
  Calendar, 
  Globe, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { GOOGLE_FORM_URL, isValidGoogleFormUrl } from '../constants/links';
import { Member } from '../types';

interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberProfile: Member | null;
  currentUserEmail?: string | null;
}

export default function ApplicationStatusModal({
  isOpen,
  onClose,
  memberProfile,
  currentUserEmail,
}: ApplicationStatusModalProps) {
  if (!memberProfile) return null;

  const totalHours = ((memberProfile.totalApprovedMinutes || 0) / 60).toFixed(1);
  const formattedJoinDate = memberProfile.joinedAt instanceof Date 
    ? memberProfile.joinedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Active Term 2026';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col z-10 text-left text-white"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white tracking-tight">
                    Volunteer Application & Status
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Verified SVT membership credential record
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Status Header Chip */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Membership Status
                    </span>
                    <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 capitalize">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{memberProfile.status || 'Active'} Volunteer</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Assigned Role
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full capitalize">
                    {memberProfile.role || 'Member'}
                  </span>
                </div>
              </div>

              {/* Grid of Verified Records */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Verified Hours</span>
                  </span>
                  <p className="text-lg font-black text-white">{totalHours} <span className="text-xs font-normal text-slate-400">hrs</span></p>
                  <p className="text-[10px] text-slate-500 font-mono">{memberProfile.totalApprovedMinutes || 0} minutes approved</p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>Joined Date</span>
                  </span>
                  <p className="text-xs font-bold text-white truncate">{formattedJoinDate}</p>
                  <p className="text-[10px] text-slate-500">Official Roster</p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>Directory Status</span>
                  </span>
                  <p className="text-xs font-bold text-white">
                    {memberProfile.directoryVisible ? 'Publicly Visible' : 'Private to Coordinators'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {memberProfile.region || 'Global Team'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>Custom Badge</span>
                  </span>
                  <p className="text-xs font-bold text-amber-300 truncate">
                    {memberProfile.customBadge || 'Active Scholar'}
                  </p>
                  <p className="text-[10px] text-slate-500">Student Tag</p>
                </div>
              </div>

              {/* Skills & Bio Summary */}
              {memberProfile.skills && memberProfile.skills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    <span>Registered Skills</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {memberProfile.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-semibold rounded-lg border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Form Links if configured */}
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300">Volunteer Application Records</span>
                  <span className="text-[10px] text-slate-400 font-mono">Profile & Records</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Need to update your emergency contact, parent consent, or school semester schedule? You can contact your chapter coordinator or edit your profile directly.
                </p>
                {isValidGoogleFormUrl(GOOGLE_FORM_URL) ? (
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    <span>Open Official Volunteer Application Form</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <p className="text-[10px] text-slate-400 font-medium">
                    External application form currently unavailable • In-app profile is active
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
