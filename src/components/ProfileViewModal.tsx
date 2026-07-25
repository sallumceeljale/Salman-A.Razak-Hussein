import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Crown, Calendar, Sparkles, Mail, ShieldCheck, Heart } from 'lucide-react';
import { Post } from '../types';
import { getMemberBadge } from '../utils/badge';
import LeaderImageUploader from './LeaderImageUploader';

interface MemberData {
  uid: string;
  name: string;
  email?: string;
  photoURL?: string;
  role?: string;
  hasCrown?: boolean;
  customBadge?: string;
  joinedAt?: any;
  linkedinURL?: string;
}

interface VolunteerHourLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhotoURL: string;
  hours: number;
  description: string;
  category: string;
  date: any;
}

interface ProfileViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberData | null;
  logs: VolunteerHourLog[];
  posts?: Post[];
  currentUserEmail?: string | null;
  onUpdateMemberPhoto?: (uid: string, base64: string) => void;
}

export default function ProfileViewModal({ 
  isOpen, 
  onClose, 
  member, 
  logs, 
  posts = [],
  currentUserEmail,
  onUpdateMemberPhoto
}: ProfileViewModalProps) {
  if (!member) return null;

  const isLeader = member.email?.toLowerCase() === 'sallumceeljale@gmail.com';
  
  // Calculate member's real-time statistics
  const memberLogs = logs.filter(log => log.userEmail?.toLowerCase() === member.email?.toLowerCase() || log.userId === member.uid);
  const totalHours = memberLogs.reduce((sum, log) => sum + log.hours, 0);
  const totalContributions = memberLogs.length;

  // Calculate dynamic automated badge
  const autoLogsFormat = memberLogs.map(l => ({
    id: l.id,
    userId: member.uid, // Map key correctly
    userName: l.userName,
    userEmail: l.userEmail,
    hours: l.hours,
    description: l.description,
    createdAt: new Date(),
    date: l.date
  }));
  const autoBadge = getMemberBadge(member.uid, autoLogsFormat as any[], posts);

  const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(member.uid)}`;

  // Formatted join date or placeholder
  let joinedStr = "Joined Scholar Volunteers";
  if (member.joinedAt) {
    try {
      const date = member.joinedAt.toDate ? member.joinedAt.toDate() : new Date(member.joinedAt);
      joinedStr = `Joined on ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    } catch (e) {
      // fallback
    }
  }

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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-2xl z-10 text-slate-800"
          >
            {/* Soft decorative header pattern */}
            <div className={`h-24 w-full bg-gradient-to-r ${
              isLeader 
                ? 'from-indigo-600 via-indigo-700 to-indigo-900' 
                : member.hasCrown 
                  ? 'from-amber-500 via-yellow-600 to-amber-700' 
                  : 'from-slate-700 via-slate-800 to-slate-950'
            } relative overflow-hidden flex items-end justify-between p-4`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Badges overlapping title */}
              <div className="flex gap-1.5 items-center">
                {isLeader && (
                  <span className="text-[8px] font-black tracking-widest px-2.5 py-1 bg-white text-indigo-950 rounded-full shadow-xs flex items-center gap-1 uppercase">
                    <ShieldCheck className="w-3 h-3 text-indigo-600 shrink-0" />
                    FOUNDER
                  </span>
                )}
                {member.hasCrown && (
                  <span className="text-[8px] font-black tracking-widest px-2.5 py-1 bg-amber-100 text-amber-950 rounded-full shadow-xs flex items-center gap-1 uppercase">
                    <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                    CROWNED
                  </span>
                )}
              </div>
            </div>

            {/* Profile Avatar Spot - overlapping header */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-10 mb-4 h-16">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-white shadow-md flex items-center justify-center">
                    <LeaderImageUploader
                      currentUserEmail={currentUserEmail}
                      currentImageSrc={member.photoURL || defaultAvatar}
                      altText={member.name}
                      onImageUploaded={(base64) => onUpdateMemberPhoto?.(member.uid, base64)}
                      typeLabel="Profile Photo"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                  {member.hasCrown && (
                    <div className="absolute -top-1.5 -right-1.5 text-lg filter drop-shadow pointer-events-none">
                      👑
                    </div>
                  )}
                </div>

                {/* Micro award counts */}
                <div className="flex gap-4 pr-1 text-right">
                  <div>
                    <p className="text-lg font-black text-slate-800 leading-none">{totalHours.toFixed(1)}</p>
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Hours</p>
                  </div>
                  <div className="w-px h-6 bg-slate-100 self-center" />
                  <div>
                    <p className="text-lg font-black text-slate-800 leading-none">{totalContributions}</p>
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Runs</p>
                  </div>
                </div>
              </div>

              {/* Core Info */}
              <div className="text-left space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black tracking-tight text-slate-800">{member.name}</h3>
                </div>
                
                {/* Position and Role descriptions */}
                <p className="text-xs font-bold text-indigo-750">
                  {isLeader 
                    ? 'Project Founder & Team Leader' 
                    : (member.role || 'Active Team Scholar')}
                </p>

                {/* Additional Awardee description badges */}
                <div className="pt-1.5 flex flex-col gap-1.5">
                  {member.customBadge && (
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[8px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wide shadow-xs">
                        <Award className="w-3 h-3 text-amber-600" />
                        SPECIALIST: {member.customBadge}
                      </span>
                    </div>
                  )}

                  {autoBadge && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 border text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-wide shadow-xs ${autoBadge.colorClass}`}>
                        <span>{autoBadge.icon}</span>
                        <span>{autoBadge.text}</span>
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-bold">
                        ({autoBadge.reason})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-slate-100 my-4" />

              {/* Mini details Section */}
              <div className="space-y-2.5 text-left text-xs text-slate-500 font-medium">
                {member.email && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-[9px] font-black uppercase text-slate-450 leading-none tracking-wider">Verified Contact</p>
                      <p className="text-xs text-slate-700 font-semibold truncate mt-0.5">{member.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-450 leading-none tracking-wider">Member Status</p>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5">{joinedStr}</p>
                  </div>
                </div>
              </div>

              {/* Progress Summary Meter */}
              {totalHours > 0 && (
                <div className="mt-5 p-4 bg-indigo-50/40 border border-indigo-100/30 rounded-2xl text-left">
                  <p className="text-[9px] font-black uppercase text-indigo-750 tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    Contribution Milestone
                  </p>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold mt-1">
                    Outstanding participation! Contributed <strong className="text-indigo-850 font-black">{totalHours.toFixed(1)} hours</strong> across tutoring, support initiatives, or research banks.
                  </p>
                  <div className="mt-3 relative h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, (totalHours / 30) * 100)}%` }}
                      className="absolute h-full left-0 top-0 bg-indigo-600 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 mt-1 uppercase">
                    <span>Level 1 (0h)</span>
                    <span className="text-indigo-700 font-black">{Math.round(Math.min(100, (totalHours / 30) * 100))}% towards Elite Status</span>
                    <span>Level 2 (30h)</span>
                  </div>
                </div>
              )}

              {totalHours === 0 && (
                <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-150 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-700 leading-snug">New Scholar Journey</p>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-semibold mt-0.5">Help them kickstart their hours log or collaborate in peer schedules!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with closed message */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[9px] text-slate-400 leading-none font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                🎓 Verified Scholars Volunteer Team Profile
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
