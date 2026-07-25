import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { LogIn, LogOut, Award, HeartHandshake, Users, UserPlus, Settings, Crown, ShieldCheck, FileText, ChevronRight, X } from 'lucide-react';
import teamLogo from '../assets/images/svt_official_square_avatar_1784958605672.jpg';
import wideIdentityBanner from '../assets/images/svt_exact_identity_banner_final_1784959210089.jpg';
import LeaderImageUploader from './LeaderImageUploader';
import { isLeaderEmail } from '../utils/leader';

interface MemberData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  hasCrown?: boolean;
  customBadge?: string;
}

interface BannerProps {
  user: User | null;
  memberProfile: MemberData | null;
  loadingAuth: boolean;
  totalPosts: number;
  totalTasks: number;
  totalMembers: number;
  onJoinTeam: () => Promise<void>;
  joining: boolean;
  latestMembers: MemberData[];
  onViewRoster: () => void;
  onOpenSettings: () => void;
  leaderPhotoURL?: string;
  customTeamLogo?: string | null;
  onUpdateTeamLogo?: (base64: string) => void;
  onUpdateMemberPhoto?: (uid: string, base64: string) => void;
}

export default function Banner({ 
  user, 
  memberProfile,
  loadingAuth, 
  totalPosts, 
  totalTasks, 
  totalMembers,
  onJoinTeam,
  joining,
  latestMembers,
  onViewRoster,
  onOpenSettings,
  leaderPhotoURL,
  customTeamLogo,
  onUpdateTeamLogo,
  onUpdateMemberPhoto
}: BannerProps) {
  const isLeader = isLeaderEmail(user?.email);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Background Scroll Lock & Keyboard Escape Listener
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google sign-in error", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 sm:py-6 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-70 -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo & title */}
        <div className="flex items-center gap-5 text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border border-slate-200 bg-white p-1">
            <LeaderImageUploader
              currentUserEmail={user?.email}
              currentImageSrc={customTeamLogo || teamLogo}
              altText="Scholars Volunteer Team Official Logo"
              onImageUploaded={(base64) => onUpdateTeamLogo?.(base64)}
              typeLabel="Team Logo"
              className="w-full h-full"
              imgClassName="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                Global Group Board
              </span>

              {isLeader ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-[11px] font-black shadow-xs animate-pulse">
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                  <span>Leader Admin Mode Active</span>
                </span>
              ) : (
                <a
                  href="https://x.com/svt_scholars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-black hover:bg-slate-800 text-white rounded-full text-[11px] font-black shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-800"
                  title="Official X Account @svt_scholars"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>@svt_scholars</span>
                </a>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-800 mt-0.5">
              Scholars Volunteer Team
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Write messages, coordinate schedules and service initiatives, and sign up for global volunteer events instantly.
            </p>
          </div>
        </div>

        {/* User login actions and Official X Account */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Official Big X Button */}
          <a
            href="https://x.com/svt_scholars"
            target="_blank"
            rel="noopener noreferrer"
            id="btn_team_x_official"
            className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-800 group"
            title="Follow Scholars Volunteer Team on X (@svt_scholars)"
          >
            <svg className="w-5 h-5 fill-current shrink-0 transition-transform group-hover:rotate-6" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Official X</span>
          </a>

          {loadingAuth ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
              <span>Checking user...</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 pl-3 pr-4 rounded-2xl">
              {memberProfile?.photoURL || user.photoURL ? (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 border-indigo-100 shadow-xs">
                  <LeaderImageUploader
                    currentUserEmail={user?.email}
                    currentImageSrc={memberProfile?.photoURL || user.photoURL || ''}
                    altText={memberProfile?.name || user.displayName || "Volunteer"}
                    onImageUploaded={(base64) => onUpdateMemberPhoto?.(user.uid, base64)}
                    typeLabel="Profile Photo"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {(memberProfile?.name || user.displayName || user.email?.[0] || "V")[0].toUpperCase()}
                </div>
              )}
              <div className="text-left max-w-[124px] sm:max-w-[180px] truncate">
                <div className="flex items-center gap-1">
                  {memberProfile?.customBadge ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 rounded-sm text-[7.5px] font-black px-1.5 py-0.5 leading-none shrink-0" title={memberProfile.customBadge}>
                      🏆 {memberProfile.customBadge}
                    </span>
                  ) : (
                    <p className="text-[10px] text-indigo-650 font-black uppercase tracking-wider leading-none">
                      {memberProfile?.role || "Volunteer Member"}
                    </p>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight mt-1 truncate flex items-center gap-1" title={memberProfile?.name || user.displayName || ''}>
                  <span>{memberProfile?.name || user.displayName || user.email?.split('@')[0]}</span>
                  {memberProfile?.hasCrown && (
                    <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-bounce shrink-0" />
                  )}
                </p>
              </div>
              
              {/* Settings Trigger */}
              <button
                id="btn_open_settings"
                onClick={onOpenSettings}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer shadow-xs"
                title="Account Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn_logout"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer shadow-xs"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn_login"
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Join via Google Verify</span>
            </button>
          )}
        </div>
      </div>

      {/* Leader's Welcome Executive Profile Card */}
      <div id="leader-spotlight" className="max-w-md mx-auto my-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 text-center relative">
        {/* Avatar */}
        {leaderPhotoURL ? (
          <img 
            src={leaderPhotoURL} 
            alt="Salman A. Razak Hussein" 
            className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-indigo-50 dark:ring-slate-800 shadow-md"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-3xl mx-auto ring-4 ring-indigo-50 dark:ring-slate-800 shadow-md">
            👑
          </div>
        )}

        {/* Identity & Slogan */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-3">
          Salman A. Razak Hussein
        </h3>
        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
          Founder & Team Leader • SVT
        </p>
        <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-3">
          "Through volunteering we create hope."
        </p>

        {/* Social Action Bar */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <a
            href="https://www.linkedin.com/in/salman-a-razak-hussein/"
            target="_blank"
            rel="noopener noreferrer"
            title="Connect on LinkedIn"
            className="inline-flex items-center justify-center w-10 h-10 bg-[#0A66C2] text-white rounded-xl hover:scale-105 transition-transform shadow-xs cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
          <a
            href="https://x.com/salman_a_razak"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow @salman_a_razak on 𝕏"
            className="inline-flex items-center justify-center w-10 h-10 bg-black text-white dark:bg-slate-800 rounded-xl hover:scale-105 transition-transform shadow-xs cursor-pointer p-2.5 border border-slate-800 dark:border-slate-700"
          >
            <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>

        {/* Primary Action Button: Founder's Message */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Founder's Message</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full-Screen Founder's Message Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md text-slate-100 p-4 sm:p-6 overflow-y-auto min-h-screen flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto text-left">
            {/* Top Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700/60"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>

            {/* Header Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-800 pr-12">
              <img
                src={leaderPhotoURL || "https://api.dicebear.com/7.x/initials/svg?seed=Salman%20A.%20Razak"}
                alt="Salman A. Razak Hussein"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Salman A. Razak Hussein
                </h3>
                <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                  Founder & Team Leader • SVT
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href="https://www.linkedin.com/in/salman-a-razak-hussein/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-7 h-7 bg-[#0A66C2] text-white rounded-lg hover:scale-105 transition-transform"
                    title="Connect on LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                  <a
                    href="https://x.com/salman_a_razak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-7 h-7 bg-slate-800 text-white rounded-lg hover:scale-105 transition-transform border border-slate-700 p-1.5"
                    title="Follow on 𝕏"
                  >
                    <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Founder's Essay Content */}
            <div className="py-6 space-y-4 text-slate-300 text-sm leading-relaxed">
              <h4 className="text-xl font-extrabold text-white tracking-tight">
                Why We Built SVT
              </h4>
              
              <p>
                When we launched The Scholars Volunteer Team (SVT), we held a firm conviction: <strong className="text-white">volunteering knows no physical borders</strong>. Anyone, anywhere in the world, possesses the power to create a lasting positive impact regardless of location or circumstance.
              </p>

              <p>
                At the heart of our mission is <strong className="text-white">peer-to-peer knowledge sharing</strong>. Students across universities and colleges face similar academic challenges, career questions, and learning hurdles. By sharing useful study insights, academic guidance, and practical tips student-to-student, we empower colleagues globally to support and elevate one another.
              </p>

              <p>
                Every small initiative, shared resource, and logged volunteer hour contributes to a larger movement. Starting from small steps, we build global hope together.
              </p>

              <p className="pt-2 font-medium italic text-slate-200">
                "Join us in creating hope — Salman A. Razak Hussein"
              </p>
            </div>

            {/* Action Buttons & Dynamic Auth Feedback */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {user ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold rounded-xl shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Member Verified</span>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    await handleGoogleLogin();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Join the Team</span>
                </button>
              )}

              <a
                href="https://x.com/salman_a_razak"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Follow SVT on 𝕏</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard quick Bento Grid stats container */}
      <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-slate-200/60 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Bento Card 1: Volunteers Joined */}
        <div id="bento_volunteers" className="bg-[#f8fafc] p-4 rounded-3xl border border-slate-200 text-left hover:border-indigo-100 transition-all duration-200 flex flex-col justify-between group">
          <div onClick={onViewRoster} className="cursor-pointer group/stat" title="Click to view volunteer team roster">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Volunteers Joined</span>
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-800 font-mono group-hover/stat:text-indigo-600 transition-colors">{totalMembers}</span>
              <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 group-hover/stat:bg-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span>Live</span>
                <span className="text-[8px] opacity-75">View roster ➔</span>
              </span>
            </div>
          </div>

          <div className="mt-3">
            <button
              id="btn_join_team"
              onClick={onJoinTeam}
              disabled={joining}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-[11px] font-bold py-2 px-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer text-center"
            >
              {joining ? (
                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join the Team</span>
                </>
              )}
            </button>
          </div>

          {/* Avatar bubbles / list of newest members */}
          {latestMembers && latestMembers.length > 0 && (
            <div 
              onClick={onViewRoster}
              className="mt-3 pt-3 border-t border-slate-200/50 flex items-center gap-2 cursor-pointer hover:opacity-90 group/bubbles"
              title="Click to view volunteer roster"
            >
              <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                {latestMembers.slice(0, 4).map((m, idx) => (
                  <div 
                    key={m.uid || idx} 
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center text-[8px] font-bold text-indigo-600 uppercase"
                    title={m.name}
                  >
                    {m.photoURL ? (
                      <img src={m.photoURL} alt={m.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      m.name.charAt(0)
                    )}
                  </div>
                ))}
              </div>
              <span className="text-[9px] text-[#64748b] group-hover/bubbles:text-indigo-600 transition-colors font-medium truncate">
                {latestMembers[0]?.name.split(' ')[0]} joined! <span className="text-[8px] text-indigo-500 font-bold ml-1">Roster 👀</span>
              </span>
            </div>
          )}
        </div>

        {/* Stat Bento Card 2: Open Opportunities */}
        <div className="bg-[#f8fafc] p-4 rounded-3xl border border-slate-200 text-left hover:border-emerald-100 transition-all duration-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Open Opportunities</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-800 font-mono">{totalTasks}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
          </div>
        </div>

        {/* Stat Bento Card 3: Bulletin Board updates */}
        <div className="bg-[#f8fafc] p-4 rounded-3xl border border-slate-200 text-left hover:border-amber-100 transition-all duration-200">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bulletin Updates</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-800 font-mono">{totalPosts}</span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Live updates</span>
          </div>
        </div>

        {/* Stat Bento Card 4 (Collaborative Pledge) */}
        <div className="bg-[#0f172a] p-4 rounded-3xl text-white text-left col-span-2 lg:col-span-1 relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 flex items-start gap-2.5">
            <div className="p-1 bg-indigo-600 rounded-lg shrink-0 text-white leading-none">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Our Mission</p>
              <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed mt-1">
                Post schedules, list support needs, and register for global team volunteer hours below.
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500 rounded-full blur-2xl opacity-25 pointer-events-none" />
        </div>
      </div>
    </header>
  );
}
