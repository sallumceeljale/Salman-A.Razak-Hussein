import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { VolunteerHourLog, MemberRole } from '../types';
import LeaderImageUploader from './LeaderImageUploader';
import { getHighResPhotoUrl } from '../utils/leader';
import TranscriptCertificateGeneratorModal from './TranscriptCertificateGeneratorModal';
import { 
  Clock, Award, Calendar, TrendingUp, Plus, Trash2, 
  History, Trophy, CheckCircle2, ShieldCheck,
  Check, Target, Info, FileText, AlertCircle, X, CheckCheck, XCircle
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

export default function HoursTracker({ 
  logs, 
  user, 
  memberProfile, 
  allMembers, 
  onViewProfile, 
  onUpdateMemberPhoto 
}: HoursTrackerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hours, setHours] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewingLogId, setReviewingLogId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'my' | 'pending' | 'approved'>('all');
  const [copiedReport, setCopiedReport] = useState(false);
  const [confirmDeleteLogId, setConfirmDeleteLogId] = useState<string | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [transcriptMember, setTranscriptMember] = useState<any | null>(null);

  const userRole: MemberRole = memberProfile?.role || 'member';
  const isCoordinatorOrAdmin = userRole === 'coordinator' || userRole === 'admin';

  // Helper to extract numeric approved/logged hours from log record
  const getLogHours = (log: VolunteerHourLog): number => {
    if (typeof log.minutes === 'number' && !isNaN(log.minutes)) return log.minutes / 60;
    if (typeof log.hours === 'number' && !isNaN(log.hours)) return log.hours;
    return 0;
  };

  // Helper to extract integer minutes from log record
  const getLogMinutes = (log: VolunteerHourLog): number => {
    if (typeof log.minutes === 'number' && !isNaN(log.minutes)) return log.minutes;
    if (typeof log.hours === 'number' && !isNaN(log.hours)) return Math.round(log.hours * 60);
    return 0;
  };

  // 1. Approved logs only for totals, leaderboard, and milestones
  const approvedLogs = logs.filter(log => log.status === 'approved');
  const pendingLogs = logs.filter(log => log.status === 'pending');

  // 2. Calculate Current Month's Approved Hours (only current month)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentMonthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const currentMonthApprovedMinutes = approvedLogs
    .filter(log => {
      const dateStr = log.date || log.activityDate;
      if (dateStr) {
        const parts = dateStr.split('-');
        if (parts.length >= 2) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          if (y === currentYear && m === currentMonth) return true;
        }
      } else if (log.submittedAt || log.createdAt) {
        const d = log.submittedAt ? new Date(log.submittedAt) : new Date(log.createdAt!);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) return true;
      }
      return false;
    })
    .reduce((sum, log) => sum + getLogMinutes(log), 0);

  const currentMonthApprovedHours = currentMonthApprovedMinutes / 60;
  const monthlyTeamGoal = 150;
  const monthlyProgressPercent = Math.min(100, Math.round((currentMonthApprovedHours / monthlyTeamGoal) * 100));

  // 3. Calculate Leaderboard: Aggregate ONLY approved hours per member
  const userAggregate: Record<string, {
    uid: string;
    name: string;
    photoURL: string;
    role?: string;
    totalHours: number;
    activityCount: number;
    hasCrown?: boolean;
    customBadge?: string;
  }> = {};

  // Seed with active members
  allMembers.forEach(member => {
    userAggregate[member.uid] = {
      uid: member.uid,
      name: member.displayName || member.name || 'Volunteer Member',
      photoURL: member.photoURL || '',
      role: member.role || 'member',
      totalHours: 0,
      activityCount: 0,
      hasCrown: !!member.hasCrown,
      customBadge: member.customBadge || ''
    };
  });

  // Aggregate only approved hours
  approvedLogs.forEach(log => {
    const key = log.userId || log.memberId;
    if (!key) return;
    const logHrs = getLogHours(log);

    if (userAggregate[key]) {
      userAggregate[key].totalHours = Number((userAggregate[key].totalHours + logHrs).toFixed(1));
      userAggregate[key].activityCount += 1;
    } else {
      userAggregate[key] = {
        uid: key,
        name: log.userName || 'Volunteer',
        photoURL: log.userPhotoURL || '',
        role: 'member',
        totalHours: logHrs,
        activityCount: 1
      };
    }
  });

  const leaderboard = Object.values(userAggregate).sort((a, b) => b.totalHours - a.totalHours);

  // 4. Stats summaries (Approved minutes only)
  const currentUserApprovedMinutes = user
    ? approvedLogs.filter(l => (l.userId || l.memberId) === user.uid).reduce((sum, l) => sum + getLogMinutes(l), 0)
    : 0;
  const currentUserApprovedHours = currentUserApprovedMinutes / 60;

  const currentUserPendingMinutes = user
    ? pendingLogs.filter(l => (l.userId || l.memberId) === user.uid).reduce((sum, l) => sum + getLogMinutes(l), 0)
    : 0;
  const currentUserPendingHours = currentUserPendingMinutes / 60;

  const totalApprovedMinutesAllTeam = approvedLogs.reduce((sum, current) => sum + getLogMinutes(current), 0);
  const totalApprovedHoursAllTeam = totalApprovedMinutesAllTeam / 60;

  // Generate copyable community report
  const handleCopyReport = () => {
    const topVolunteerName = leaderboard[0] ? leaderboard[0].name : 'N/A';
    const topVolunteerHours = leaderboard[0] ? leaderboard[0].totalHours : 0;
    const registeredCount = allMembers.length;
    const totalApprovedSessions = approvedLogs.length;

    const report = `SVT; The Scholars Volunteer Team — Community Impact Report
==================================================
Report Date       : ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Active Volunteers : ${registeredCount} members registered
Approved Sessions : ${totalApprovedSessions} verified service sessions
Grand Total Hours : ${totalApprovedHoursAllTeam.toFixed(1)} Approved Hours
Current Month     : ${currentMonthName}
Monthly Progress  : ${currentMonthApprovedHours.toFixed(1)} / ${monthlyTeamGoal}.0 Hours (${monthlyProgressPercent}% Reached)

HONOR ROLL HIGHLIGHTS:
- Top Contributor : ${topVolunteerName} (${topVolunteerHours.toFixed(1)} Approved Hours)
- Collective Average: ${(totalApprovedHoursAllTeam / Math.max(1, registeredCount)).toFixed(1)} Approved Hours/member

Thank you to everyone in our global volunteering community!
==================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Submit volunteer hour log (Integer minutes, always starts as pending)
  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please sign in to record volunteering hours.');
      return;
    }

    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours <= 0) {
      setErrorMsg('Please specify a positive amount of hours.');
      return;
    }

    // Convert to integer minutes
    const totalMinutes = Math.round(numericHours * 60);
    if (!Number.isInteger(totalMinutes) || totalMinutes <= 0) {
      setErrorMsg('Please enter a valid amount of minutes.');
      return;
    }

    if (totalMinutes > 60000) {
      setErrorMsg('A single volunteering log cannot exceed 1,000 hours (60,000 minutes).');
      return;
    }

    const finalDescription = description.trim() || 'Community volunteering and academic peer support';

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const randomId = doc(collection(db, 'hours_logs')).id;
      const memberDisplayName = memberProfile?.displayName || user.displayName || 'Volunteer Member';
      const memberPhoto = memberProfile?.photoURL || user.photoURL || '';

      // Write document with integer minutes and pending status
      await setDoc(doc(db, 'hours_logs', randomId), {
        userId: user.uid,
        userName: memberDisplayName,
        userPhotoURL: memberPhoto,
        minutes: totalMinutes,
        date: date,
        description: finalDescription,
        status: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      setSuccessMsg('Hours submitted for review.');
      setDescription('');
      setHours('1');
      
      setTimeout(() => {
        setIsFormOpen(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error("Error logging hours:", err);
      setErrorMsg(err?.message || 'Failure writing log to database. Please check permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  // Coordinator/Admin: Approve submission
  const handleApproveLog = async (logId: string) => {
    if (!isCoordinatorOrAdmin || !user) return;
    setReviewingLogId(logId);
    try {
      await updateDoc(doc(db, 'hours_logs', logId), {
        status: 'approved',
        reviewedBy: memberProfile?.displayName || user.displayName || user.email || 'Coordinator',
        reviewedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `hours_logs/${logId}`);
    } finally {
      setReviewingLogId(null);
    }
  };

  // Coordinator/Admin: Reject submission
  const handleRejectLog = async (logId: string) => {
    if (!isCoordinatorOrAdmin || !user) return;
    setReviewingLogId(logId);
    try {
      await updateDoc(doc(db, 'hours_logs', logId), {
        status: 'rejected',
        reviewedBy: memberProfile?.displayName || user.displayName || user.email || 'Coordinator',
        reviewedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `hours_logs/${logId}`);
    } finally {
      setReviewingLogId(null);
    }
  };

  // Delete Log handler: Volunteers can only delete their own pending logs; coordinators/admins can delete any
  const handleDeleteLog = async (logId: string, logUserId: string, logStatus: string) => {
    if (!user) return;
    const isOwner = user.uid === logUserId;

    if (!isCoordinatorOrAdmin) {
      if (!isOwner) {
        alert("You can only delete your own hour records.");
        return;
      }
      if (logStatus !== 'pending') {
        alert("Approved records cannot be deleted by members. Please contact a coordinator.");
        return;
      }
    }

    try {
      await deleteDoc(doc(db, 'hours_logs', logId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `hours_logs/${logId}`);
    }
  };

  // Filter logs for display
  const filteredLogs = logs.filter(log => {
    const logUser = log.userName || '';
    const logDesc = log.description || '';
    const matchesSearch = logUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          logDesc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (logFilter === 'my') {
      return (log.userId || log.memberId) === user?.uid;
    }
    if (logFilter === 'pending') {
      return log.status === 'pending';
    }
    if (logFilter === 'approved') {
      return log.status === 'approved';
    }
    return true;
  });

  return (
    <div id="hours_tracker" className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Team Mission */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white text-left flex flex-col justify-between overflow-hidden shadow-sm md:col-span-1 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">Scholars Impact</span>
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold italic tracking-wide text-indigo-100">
              "Through peer education and service, we empower students across borders."
            </p>
            <p className="text-xs text-indigo-300 mt-2 font-medium">Community Service Record</p>
          </div>
        </div>

        {/* Card 2: Combined Global Hours (Approved Only) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-left flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Collective Service</p>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">Approved Total Logged</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {totalApprovedHoursAllTeam.toFixed(1)} <span className="text-lg font-bold text-slate-500">Hrs</span>
            </h3>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>{approvedLogs.length} verified sessions</span>
            </p>
          </div>
        </div>

        {/* Card 3: User's Contribution & Action Button */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-left flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">My Record</p>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">Approved Service Hours</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {currentUserApprovedHours.toFixed(1)} <span className="text-lg font-bold text-slate-500">Hrs</span>
              </h3>
              {currentUserPendingHours > 0 && (
                <p className="text-[11px] text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>+{currentUserPendingHours.toFixed(1)} hrs pending review</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentMember = allMembers.find(m => m.uid === user?.uid) || {
                    uid: user?.uid || 'guest',
                    displayName: memberProfile?.displayName || user?.displayName || 'Scholar Volunteer',
                    photoURL: memberProfile?.photoURL || user?.photoURL || ''
                  };
                  setTranscriptMember(currentMember);
                  setIsTranscriptModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                title="Verified Credentials — Coming Soon"
              >
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>Credentials</span>
              </button>

              {user && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Hours</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Community Monthly Milestone (Current Month Only) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-xs text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentMonthName} Milestone
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-800 tracking-tight">Monthly Team Volunteering Target</h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-normal">
            Collective goal: <strong className="text-slate-900 font-bold">{monthlyTeamGoal}.0 approved hours</strong> in {currentMonthName}. Only verified sessions are counted toward the monthly target.
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
              <span>0.0 Hrs</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs font-bold border border-emerald-100">
                {monthlyProgressPercent}% Reached ({currentMonthApprovedHours.toFixed(1)} / {monthlyTeamGoal}.0 Hrs this month)
              </span>
              <span>{monthlyTeamGoal}.0 Hrs Goal</span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${monthlyProgressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={handleCopyReport}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              copiedReport 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
            }`}
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-100" />
                <span>Report copied!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy Summary Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid: Leaderboard & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Leaderboard (Approved Hours Only) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 text-left space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Volunteer Honors Roll
              </h3>
            </div>
            <span className="text-xs bg-slate-50 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
              Approved Hours
            </span>
          </div>

          <div className="space-y-2 divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
            {leaderboard.map((vol, index) => {
              const seedHex = encodeURIComponent(vol.uid || index);
              const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seedHex}`;
              
              const isFirst = index === 0 && vol.totalHours > 0;
              const isSecond = index === 1 && vol.totalHours > 0;
              const isThird = index === 2 && vol.totalHours > 0;

              return (
                <div 
                  key={vol.uid} 
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-2xl transition-all ${
                    isFirst 
                      ? 'bg-amber-50/50 border border-amber-200' 
                      : isSecond 
                        ? 'bg-slate-50 border border-slate-200' 
                        : isThird 
                          ? 'bg-orange-50/40 border border-orange-200'
                          : 'border border-transparent pt-3 first:pt-2.5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 shrink-0 flex items-center justify-center font-bold text-xs text-slate-500 font-mono">
                      {isFirst ? '👑' : isSecond ? '🥈' : isThird ? '🥉' : `#${index + 1}`}
                    </div>

                    <div 
                      className={`w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0 border ${
                        isFirst ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                      }`}
                    >
                      <LeaderImageUploader
                        currentUserEmail={user?.email}
                        currentImageSrc={getHighResPhotoUrl(vol.photoURL) || defaultAvatar}
                        altText={vol.name}
                        onImageUploaded={(base64) => onUpdateMemberPhoto?.(vol.uid, base64)}
                        typeLabel="Photo"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>

                    <div 
                      onClick={() => onViewProfile?.(vol.uid)}
                      className="min-w-0 text-left cursor-pointer hover:opacity-85 transition-opacity"
                      title="Click to view member profile"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-bold text-slate-900 truncate leading-none hover:text-indigo-600 transition-colors">
                          {vol.name}
                        </p>
                        {vol.hasCrown && (
                          <span className="text-xs" title="Golden Crown Awardee">👑</span>
                        )}
                        {vol.role && vol.role !== 'member' && (
                          <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                            {vol.role}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-500 font-medium truncate mt-1">
                        {vol.activityCount} {vol.activityCount === 1 ? 'approved session' : 'approved sessions'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl font-mono font-bold text-xs border ${
                      isFirst 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : isSecond 
                          ? 'bg-slate-100 text-slate-800 border-slate-300'
                          : isThird
                            ? 'bg-orange-100 text-orange-900 border-orange-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {vol.totalHours.toFixed(1)} <span className="text-[10px] ml-0.5">hrs</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Log Feed */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 text-left space-y-4">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Activity & Hour Logs
                </h3>
              </div>

              <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-xl shrink-0 flex-wrap gap-0.5">
                <button
                  type="button"
                  onClick={() => setLogFilter('all')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    logFilter === 'my'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  My Logs
                </button>
                {isCoordinatorOrAdmin && pendingLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setLogFilter('pending')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                      logFilter === 'pending'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-amber-700 hover:text-amber-900 bg-amber-50'
                    }`}
                  >
                    <span>Pending ({pendingLogs.length})</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLogFilter('approved')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    logFilter === 'approved'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Approved
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Filter by volunteer or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-medium pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{filteredLogs.length} entries shown</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">No logs found</p>
                <p className="text-xs text-slate-400">Record a volunteering session above to begin.</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isOwner = user?.uid === (log.userId || log.memberId);
                // Members can only delete their own pending logs. Approved logs require coordinator/admin.
                const canDelete = isCoordinatorOrAdmin || (isOwner && log.status === 'pending');
                const logHrs = getLogHours(log);
                const isPending = log.status === 'pending';
                const isApproved = log.status === 'approved';
                const isRejected = log.status === 'rejected';

                const seedHex = encodeURIComponent(log.userId || log.memberId || 'volunteer');
                const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seedHex}`;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-50/60 hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-start gap-3 justify-between group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div 
                        onClick={() => onViewProfile?.(log.userId || log.memberId || '')}
                        className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 cursor-pointer hover:opacity-85"
                        title="View profile"
                      >
                        <img 
                          src={getHighResPhotoUrl(log.userPhotoURL) || defaultAvatar} 
                          alt={log.userName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultAvatar;
                          }}
                        />
                      </div>

                      <div className="min-w-0 text-left space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            onClick={() => onViewProfile?.(log.userId || log.memberId || '')}
                            className="font-bold text-xs text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors"
                          >
                            {log.userName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{log.date || log.activityDate}</span>
                          </span>

                          {/* Status Pill */}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Approved</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pending Review</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Not Approved</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                          {log.description}
                        </p>

                        {log.reviewedBy && (
                          <p className="text-[10px] text-slate-400 font-medium">
                            Reviewed by {log.reviewedBy}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                      <span className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold border ${
                        isApproved 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : isPending 
                            ? 'bg-amber-50 border-amber-200 text-amber-800' 
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        <span>+{logHrs.toFixed(1)}</span>
                        <span className="text-[10px]">hrs</span>
                      </span>

                      {/* Coordinator / Admin Approval Controls */}
                      {isCoordinatorOrAdmin && isPending && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={reviewingLogId === log.id}
                            onClick={() => handleApproveLog(log.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shadow-xs disabled:opacity-50"
                            title="Approve volunteer hours"
                          >
                            <CheckCheck className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            disabled={reviewingLogId === log.id}
                            onClick={() => handleRejectLog(log.id)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 disabled:opacity-50"
                            title="Reject submission"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}

                      {canDelete && (
                        <div className="flex items-center">
                          {confirmDeleteLogId === log.id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg p-1">
                              <span className="text-[10px] font-bold text-red-700 px-1 select-none">Delete?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeleteLog(log.id, log.userId || log.memberId || '', log.status);
                                  setConfirmDeleteLogId(null);
                                }}
                                className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer uppercase transition-all"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteLogId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-all"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteLogId(log.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title={isPending ? "Delete pending submission" : "Delete log entry"}
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

      {/* Log Hours Modal Dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 text-left"
            >
              <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Record Volunteering Shift
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Submit community service hours for coordinator review
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogHours} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>Number of Hours</span>
                    <span className="text-indigo-600 text-xs font-bold">
                      {hours} hrs ({Math.round((parseFloat(hours) || 0) * 60)} mins)
                    </span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full text-sm font-semibold border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-white text-slate-800"
                      placeholder="e.g., 1.5, 2, 4"
                      required
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['0.5', '1', '1.5', '2', '3', '4', '5', '8'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHours(val)}
                          className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            hours === val
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {val} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Date of Service
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>Activity Description</span>
                  </label>
                  <textarea
                    maxLength={500}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tasks completed (e.g., Cambridge test prep tutoring, materials creation, volunteering event assistance)..."
                    className="w-full text-xs border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-slate-800 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transcript & Certificate Generator Modal */}
      <TranscriptCertificateGeneratorModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        member={transcriptMember}
        logs={approvedLogs}
      />
    </div>
  );
}
