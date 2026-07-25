import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { VolunteerHourLog } from '../types';
import LeaderImageUploader from './LeaderImageUploader';
import { 
  Clock, Award, Calendar, TrendingUp, Plus, Trash2, 
  History, Trophy, Sparkles, CheckCircle2, UserCheck, ShieldCheck,
  Copy, Check, Flame, Target, Info, ShieldAlert, FileText, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HoursTrackerProps {
  logs: VolunteerHourLog[];
  user: User | null;
  memberProfile: any | null;
  allMembers: any[];
  onViewProfile?: (uid: string) => void;
  onUpdateMemberPhoto?: (uid: string, base64: string) => void;
}

export default function HoursTracker({ logs, user, memberProfile, allMembers, onViewProfile, onUpdateMemberPhoto }: HoursTrackerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hours, setHours] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'my' | 'leader'>('all');
  const [copiedReport, setCopiedReport] = useState(false);
  const [confirmDeleteLogId, setConfirmDeleteLogId] = useState<string | null>(null);

  // 1. Calculate Leaderboard: Aggregate hours per user from logs
  // Keyed by user identifier (we use UID, fallback to email/name)
  const userAggregate: Record<string, {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    role?: string;
    totalHours: number;
    activityCount: number;
    hasCrown?: boolean;
    customBadge?: string;
  }> = {};

  // First seed leaderboard with all active registered members to show everyone, even if they have 0 hours
  allMembers.forEach(member => {
    userAggregate[member.uid] = {
      uid: member.uid,
      name: member.name,
      email: member.email || '',
      photoURL: member.photoURL || '',
      role: member.email?.toLowerCase() === 'sallumceeljale@gmail.com' ? 'The Leader' : 'Volunteer',
      totalHours: 0,
      activityCount: 0,
      hasCrown: !!member.hasCrown,
      customBadge: member.customBadge || ''
    };
  });

  // Then add logged hours
  logs.forEach(log => {
    const key = log.userId || log.userEmail;
    if (userAggregate[key]) {
      userAggregate[key].totalHours = Number((userAggregate[key].totalHours + log.hours).toFixed(1));
      userAggregate[key].activityCount += 1;
    } else {
      // User is not in allMembers list (maybe log exists but is not currently registered/dummy)
      userAggregate[key] = {
        uid: log.userId,
        name: log.userName || 'Anonymous Volunteer',
        email: log.userEmail || '',
        photoURL: log.userPhotoURL || '',
        totalHours: log.hours,
        activityCount: 1
      };
    }
  });

  // Sort aggregate leaderboard descending by total hours
  const leaderboard = Object.values(userAggregate).sort((a, b) => b.totalHours - a.totalHours);

  // 2. Statistics summaries for current user
  const currentUserTotalHours = user ? (userAggregate[user.uid]?.totalHours || 0) : 0;
  const totalHoursAllTeam = logs.reduce((sum, current) => sum + current.hours, 0);

  // Generate ASCII copyable community report
  const handleCopyReport = () => {
    const topVolunteerName = leaderboard[0] ? leaderboard[0].name : 'N/A';
    const topVolunteerHours = leaderboard[0] ? leaderboard[0].totalHours : 0;
    const registeredCount = allMembers.length;
    const totalEntries = logs.length;
    const teamTarget = 150;
    const targetProgress = Math.min(100, Math.round((totalHoursAllTeam / teamTarget) * 100));

    const report = `🌟 OFFICIAL SCHOLARS VOLUNTEER TEAM REPORT 🌟
==================================================
Report Date       : ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Active Volunteers : ${registeredCount} members registered
Total logged runs : ${totalEntries} contributions recorded
Grand Total Hours : ${totalHoursAllTeam.toFixed(1)} Hours
Hour Goal Target  : ${teamTarget}.0 Hours (${targetProgress}% Goal Progress)

🏆 HONOR ROLL LEADERBOARD HIGHLIGHTS:
- Rank #1 Peak Contributor: ${topVolunteerName} (${topVolunteerHours.toFixed(1)} Hours Logged)
- Collective Average     : ${(totalHoursAllTeam / Math.max(1, registeredCount)).toFixed(1)} Hours/member

Thank you to everyone in our global volunteering community! Every action inspires hope.
==================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // 3. Log Hour submission logic
  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must sign in with Google first to record hours.');
      return;
    }

    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours <= 0) {
      setErrorMsg('Please specify a positive amount of hours.');
      return;
    }

    if (numericHours > 1000) {
      setErrorMsg('A single volunteering log cannot exceed 1000 hours.');
      return;
    }

    const finalDescription = description.trim() || 'Volunteering support';

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const email = user.email || '';
      const name = memberProfile?.name || user.displayName || email.split('@')[0] || "Volunteer";
      const photoURL = memberProfile?.photoURL || user.photoURL || '';

      await setDoc(doc(db, 'hours_logs', randomId), {
        userId: user.uid,
        userName: name,
        userEmail: email,
        userPhotoURL: photoURL,
        hours: numericHours,
        date: date,
        description: finalDescription,
        createdAt: serverTimestamp()
      });

      setSuccessMsg('Your volunteering hours have been registered and synced!');
      setDescription('');
      setHours('1');
      
      setTimeout(() => {
        setIsFormOpen(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failure writing log to database. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Delete Log submission logic
  const handleDeleteLog = async (logId: string, logUserId: string) => {
    if (!user) return;
    const isLeader = user.email?.toLowerCase() === 'sallumceeljale@gmail.com';
    const isOwner = user.uid === logUserId;

    if (!isOwner && !isLeader) {
      alert("Only the owner or the Team Leader can remove hour entries.");
      return;
    }

    try {
      await deleteDoc(doc(db, 'hours_logs', logId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete log entry.");
    }
  };

  // Filter logs based on search criteria and selected log category
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (logFilter === 'my') {
      return log.userId === user?.uid;
    }
    if (logFilter === 'leader') {
      return log.userEmail?.toLowerCase() === 'sallumceeljale@gmail.com';
    }
    return true;
  });

  return (
    <div id="hours_tracker" className="space-y-6">
      
      {/* Dynamic Master Stats Bento Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Our Active Slogan */}
        <div className="relative bg-gradient-to-br from-indigo-550 to-indigo-700 rounded-3xl p-6 text-white text-left flex flex-col justify-between overflow-hidden shadow-md shadow-indigo-600/10 md:col-span-1">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a5b4fc]">Hope Spark</span>
          </div>
          <div className="mt-6">
            <p className="text-sm font-black italic tracking-wide text-indigo-100">
              "Through volunteering, we create hope."
            </p>
            <p className="text-[10px] text-indigo-200 mt-2 font-medium">Volunteering Hour Records</p>
          </div>
        </div>

        {/* Card 2: Combined Global Hours */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-left flex flex-col justify-between shadow-xs">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#64748b] font-black">Collective Impact</p>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Grand Total Logged</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {totalHoursAllTeam.toFixed(1)} <span className="text-lg font-bold text-slate-500">Hrs</span>
            </h3>
            <p className="text-[10px] text-emerald-600 font-black flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-time global community efforts</span>
            </p>
          </div>
        </div>

        {/* Card 3: User's Contribution & Action Button */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-left flex flex-col justify-between shadow-xs relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#64748b] font-black">Your Dashboard</p>
              <p className="text-xs text-slate-500 font-bold mt-0.5">My volunteering hours</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                {currentUserTotalHours} <span className="text-lg font-bold text-slate-500">Hrs</span>
              </h3>
            </div>

            {user ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log Hours</span>
              </button>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                Log in above to write
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Community Hope Milestone Goal Progress bar */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-100 rounded-3xl p-5 sm:p-6 text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="font-extrabold text-[10px] text-emerald-800 uppercase tracking-widest bg-emerald-100/50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              COMMUNITY SERVICE BENCHMARK
            </span>
          </div>
          <h4 className="text-base font-black text-slate-800 tracking-tight">Our Volunteering Monthly Hope Goal</h4>
          <p className="text-xs text-[#64748b] leading-relaxed max-w-xl font-medium">
            We are working together to reach <strong className="text-slate-800 font-extrabold">150.0 logged volunteering hours</strong> this month. Every registered shift fuels classmate support programs!
          </p>

          {/* Elegant horizontal thermometer bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 font-mono text-[10px]">
              <span>🌱 0 Hrs</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-sans text-[10px]">
                🚀 Milestone Reached: {Math.min(100, Math.round((totalHoursAllTeam / 150) * 100))}% ({totalHoursAllTeam.toFixed(1)} / 150 Hrs)
              </span>
              <span>🏆 150 Hrs Target</span>
            </div>
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalHoursAllTeam / 150) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Action Button cluster for copying summary report */}
        <div className="shrink-0 flex flex-col items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopyReport}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              copiedReport 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10'
            }`}
          >
            {copiedReport ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Report copied!</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-slate-300" />
                <span>Copy Summary Report</span>
              </>
            )}
          </button>
          <span className="text-[9px] text-[#64748b] font-semibold text-center mt-1 sm:mt-0">
            ASCII Format • Ideal for emails
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Hours Leaderboard (7 units span) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 text-left space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-sans font-black text-slate-800 text-sm tracking-tight">
                Volunteer Honors List
              </h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-[#64748b] font-black uppercase tracking-wider px-2 py-1 rounded-lg border border-slate-200">
              Sort: Hours Desc
            </span>
          </div>
          <p className="text-[11px] text-[#64748b] font-medium leading-relaxed">
            Dynamic leaderboard ranking classmates and volunteers according to logged hours. Every hour creates hope.
          </p>

          <div className="space-y-2.5 divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
            {leaderboard.map((vol, index) => {
              const seedHex = encodeURIComponent(vol.uid || index);
              const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seedHex}`;
              
              const isFirst = index === 0 && vol.totalHours > 0;
              const isSecond = index === 1 && vol.totalHours > 0;
              const isThird = index === 2 && vol.totalHours > 0;

              return (
                <div 
                  key={vol.uid} 
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-2xl transition-all duration-200 ${
                    isFirst 
                      ? 'bg-amber-50/40 border border-amber-200/65 shadow-xs' 
                      : isSecond 
                        ? 'bg-slate-50/50 border border-slate-200/50' 
                        : isThird 
                          ? 'bg-orange-50/20 border border-orange-100/50'
                          : 'border border-transparent pt-3 first:pt-2.5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Number / Icon */}
                    <div className="w-8 shrink-0 flex items-center justify-center">
                      {isFirst ? (
                        <div className="w-7 h-7 bg-amber-100/80 rounded-full flex items-center justify-center text-sm border border-amber-200 shadow-xs relative">
                          <span>👑</span>
                        </div>
                      ) : isSecond ? (
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-sm border border-slate-200 shadow-xs">
                          <span>🥈</span>
                        </div>
                      ) : isThird ? (
                        <div className="w-7 h-7 bg-orange-100/50 rounded-full flex items-center justify-center text-sm border border-orange-200 shadow-xs">
                          <span>🥉</span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-slate-450 font-mono">#{index + 1}</span>
                      )}
                    </div>

                    {/* Member photo */}
                    <div 
                      className={`w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0 border ${
                        isFirst ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                      }`}
                    >
                      <LeaderImageUploader
                        currentUserEmail={user?.email}
                        currentImageSrc={vol.photoURL || defaultAvatar}
                        altText={vol.name}
                        onImageUploaded={(base64) => onUpdateMemberPhoto?.(vol.uid, base64)}
                        typeLabel="Photo"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>

                    {/* Member info */}
                    <div 
                      onClick={() => onViewProfile?.(vol.uid)}
                      className="min-w-0 text-left cursor-pointer hover:opacity-85 transition-opacity"
                      title="Click to view full scholar profile"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-bold text-slate-800 truncate leading-none">
                          {vol.name}
                        </p>
                        {vol.hasCrown && (
                          <span className="text-[10px] animate-pulse" title="Golden Crown Awardee">👑</span>
                        )}
                        {vol.email === 'sallumceeljale@gmail.com' && (
                          <span className="text-[7.5px] font-black uppercase text-white bg-indigo-650 px-1 py-0.5 rounded-sm shrink-0 font-sans">
                            LEADER
                          </span>
                        )}
                      </div>
                      
                      {vol.customBadge ? (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[7.5px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded shrink-0 font-sans">
                            🏆 {vol.customBadge}
                          </span>
                          <span className="text-[8px] text-[#64748b] font-medium truncate">
                            • {vol.activityCount} blocks
                          </span>
                        </div>
                      ) : (
                        <p className="text-[9px] text-[#64748b] font-medium truncate mt-1">
                          {isFirst ? '🏆 Top Scholars Contributor' : vol.activityCount + (vol.activityCount === 1 ? ' service block' : ' service blocks')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total counter score */}
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl font-mono font-black text-xs border ${
                      isFirst 
                        ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs' 
                        : isSecond 
                          ? 'bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                          : isThird
                            ? 'bg-orange-100/60 text-orange-850 border-orange-250 shadow-xs'
                            : vol.totalHours > 0
                              ? 'bg-indigo-50/50 text-indigo-700 border-indigo-100'
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {vol.totalHours.toFixed(1)} <span className="text-[9px] font-bold ml-0.5 font-sans">Hrs</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Log Feed (7 units span) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 text-left space-y-4">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600 animate-none" />
                <h3 className="font-sans font-black text-slate-800 text-sm tracking-tight">
                  Master Hour Logs & Activity Feed
                </h3>
              </div>

              {/* Advanced filter tab segment */}
              <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setLogFilter('all')}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    logFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Logs
                </button>
                <button
                  type="button"
                  onClick={() => setLogFilter('my')}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    logFilter === 'my'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  My Logs
                </button>
                <button
                  type="button"
                  onClick={() => setLogFilter('leader')}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    logFilter === 'leader'
                      ? 'bg-white text-indigo-650 shadow-xs'
                      : 'text-slate-500 hover:text-indigo-650'
                  }`}
                >
                  Leader Logs
                </button>
              </div>
            </div>
            
            {/* Search Input Filter & Filter Info Info alert banner */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Query by contributor name or remarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[11px] font-semibold pl-3 pr-3 py-2 bg-slate-50 border border-slate-205 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 focus:bg-white text-slate-700 transition-all font-sans"
                />
              </div>

              <div className="text-[10px] text-slate-450 font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Showing {filteredLogs.length} matching logged entries</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-250 flex items-center justify-center text-slate-400 mx-auto">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-650">No logs on record matched search</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">Be the first to log active community contribution!</p>
                </div>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isLeader = user?.email?.toLowerCase() === 'sallumceeljale@gmail.com';
                const isOwner = user?.uid === log.userId;

                const seedHex = encodeURIComponent(log.userId || log.userEmail);
                const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seedHex}`;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 border border-slate-200/80 rounded-2xl transition-all flex items-start gap-3 justify-between group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Avatar */}
                      <div 
                        onClick={() => onViewProfile?.(log.userId)}
                        className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        title="Click to view full scholar profile"
                      >
                        <img 
                          src={log.userPhotoURL || defaultAvatar} 
                          alt={log.userName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAvatar;
                          }}
                        />
                      </div>

                      {/* Content details */}
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            onClick={() => onViewProfile?.(log.userId)}
                            className="font-bold text-xs text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors"
                            title="Click to view full scholar profile"
                          >
                            {log.userName}
                          </span>
                          {log.userEmail?.toLowerCase() === 'sallumceeljale@gmail.com' && (
                            <span className="inline-flex items-center gap-1 bg-indigo-650 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase scale-90 select-none">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Leader</span>
                            </span>
                          )}
                          <span className="text-[9px] text-[#64748b] font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{log.date}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1.5 italic">
                          " {log.description} "
                        </p>
                      </div>
                    </div>

                    {/* Hours Badge of entry and delete button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-150 rounded-xl px-2.5 py-1.5 text-xs font-black text-emerald-700">
                        <span>+{log.hours}</span>
                        <span className="text-[8px] font-bold">hrs</span>
                      </span>

                      {/* Delete button (owner or leader) */}
                      {(isOwner || isLeader) && (
                        <div className="flex items-center gap-1">
                          {confirmDeleteLogId === log.id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-lg p-1 animate-none shrink-0">
                              <span className="text-[8px] font-bold text-red-650 px-1 select-none">sure?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeleteLog(log.id, log.userId);
                                  setConfirmDeleteLogId(null);
                                }}
                                className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[8px] font-black cursor-pointer uppercase transition-all"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteLogId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[8px] font-bold cursor-pointer transition-all"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteLogId(log.id)}
                              className="p-1 px-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                              title="Remove Hours Log entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Hour Logging Modal Setup */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-10 text-left"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/30 via-white to-indigo-50/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-150 rounded-2xl flex items-center justify-center text-indigo-705 shadow-sm shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-slate-800 tracking-tight">
                      Log Volunteering Shift
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">
                      Keep your team time log synchronized
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer font-black"
                >
                  ✕
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleLogHours} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-705 text-xs font-bold rounded-2xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Hours Field */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Number of Hours</span>
                    <span className="text-indigo-600 text-[11px] font-extrabold">{hours} hrs</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-200 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 bg-white"
                      placeholder="Enter hours (e.g. 1.5, 5, 12, 40)"
                      required
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['0.5', '1', '1.5', '2', '3', '4', '5', '6', '8', '10', '12', '24'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHours(val)}
                          className={`px-3 py-1.5 text-[10px] font-extrabold rounded-full border transition-all cursor-pointer ${
                            hours === val
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {val} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Date of Volunteering Activity
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs border border-slate-205 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 font-semibold"
                  />
                </div>

                {/* Description field */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>What did you do? (Description)</span>
                    <span className="text-[9px] text-slate-400 font-bold lowercase">optional</span>
                  </label>
                  <textarea
                    maxLength={250}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Completed geometry tutorial help sessions, organized recycling banners, or cooked the team charity meal. Defaults to 'Volunteering support' if left blank."
                    className="w-full text-xs border border-slate-205 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 font-medium"
                  />
                </div>

                {/* Alert/Disclaimer banner */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-2.5 text-[10px] text-emerald-800 font-medium leading-relaxed flex items-start gap-1.5">
                  <span className="text-xs shrink-0">✅</span>
                  <span>
                    Any member is allowed to log their hours directly anytime! No prior request or approval from the leader is required.
                  </span>
                </div>

                {/* Submit / actions bar */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Logging...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Confirm Entry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
