import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { LogIn, LogOut, Award, HeartHandshake, Users, UserPlus, Settings, Crown, ShieldCheck, FileText, ChevronRight, X, ClipboardList, Clock, Target, MessageCircle, BookOpen, GraduationCap, Headphones } from 'lucide-react';
import teamLogo from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import wideIdentityBanner from '../assets/images/svt_exact_identity_banner_final_1784959210089.jpg';
import EditablePublicAssetImage from './EditablePublicAssetImage';
import { isLeaderEmail, getHighResPhotoUrl, DEFAULT_FOUNDER_PHOTO } from '../utils/leader';
import EnglishProficiencySection from './EnglishProficiencySection';

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
  customWideBanner?: string | null;
  onUpdateTeamLogo?: (base64: string) => void;
  onUpdateMemberPhoto?: (uid: string, base64: string) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
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
  customWideBanner,
  onUpdateTeamLogo,
  onUpdateMemberPhoto,
  activeTab = 'bulletin',
  onSelectTab
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

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-slate-900 text-white border-b border-slate-800 relative">
      {/* 1. STICKY INSTITUTIONAL NAVIGATION HEADER */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Identity */}
          <div 
            onClick={() => onSelectTab?.('bulletin')}
            className="flex items-center gap-3 cursor-pointer group"
            title="Go to Main Bulletin Board"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shrink-0 border border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
              <EditablePublicAssetImage
                assetKey="svt-logo"
                fallbackSrc={customTeamLogo || teamLogo}
                fallbackAlt="SVT; The Scholars Volunteer Team official logo"
                label="Team Logo"
                className="w-full h-full"
                imgClassName="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white font-display group-hover:text-amber-300 transition-colors">
                  Scholars Volunteer Team
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                  SVT Official
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                www.scholarsvolunteerteam.org
              </p>
            </div>
          </div>

          {/* Center: Institutional Top Navigation Hub */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80 shadow-inner overflow-x-auto max-w-full no-scrollbar shrink-1">
            <button 
              onClick={() => onSelectTab?.('bulletin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'bulletin' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bulletin</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('tasks')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'tasks' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Activities</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('hours')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'hours' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Hours Log</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('transcripts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'transcripts' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificates</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('impact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'impact' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Goals</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('resources')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'resources' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Resources</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('essays')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'essays' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Essay Hub</span>
            </button>
            <button 
              onClick={() => onSelectTab?.('study')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === 'study' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Study Room</span>
            </button>
          </div>

          {/* Right: Actions, X Account, Login */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://x.com/svt_scholars"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
              title="Official X Handle"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="hidden sm:inline">@svt_scholars</span>
            </a>

            {loadingAuth ? (
              <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 p-1 pl-2 pr-3 rounded-xl">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-900 border border-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {memberProfile?.photoURL || user.photoURL ? (
                    <img src={memberProfile?.photoURL || user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    user.displayName?.[0] || 'V'
                  )}
                </div>
                <span className="text-xs font-bold text-white max-w-[100px] truncate hidden sm:inline">
                  {memberProfile?.name || user.displayName || 'Scholar'}
                </span>
                
                <button
                  onClick={onOpenSettings}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Scholar Sign In</span>
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* 2. INSTITUTIONAL HERO BANNER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14 text-left relative">
        <div className="max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-mono font-bold border border-indigo-500/20">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Official Academic & Student Volunteer Initiative</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 shrink-0 rounded-3xl bg-white p-2.5 sm:p-3 border-2 border-white/40 shadow-2xl overflow-hidden ring-4 ring-indigo-500/30 backdrop-blur-md">
              <EditablePublicAssetImage
                assetKey="svt-logo"
                fallbackSrc={customTeamLogo || teamLogo}
                fallbackAlt="SVT; The Scholars Volunteer Team official logo"
                label="Team Logo"
                className="w-full h-full"
                imgClassName="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight flex-1">
              Empowering Global Scholars Through Volunteering & Leadership
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            The Scholars Volunteer Team (SVT) connects high-achieving student leaders, peer tutors, and volunteers worldwide. We facilitate peer essay reviews, virtual study hubs, academic resources, and international community service initiatives for students everywhere.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!user ? (
              <button
                onClick={handleGoogleLogin}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Join Scholars Circle</span>
              </button>
            ) : (
              <button
                onClick={onViewRoster}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>View Team Roster</span>
              </button>
            )}
          </div>

          {/* Quick Stats Bar */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 max-w-lg">
            <div>
              <span className="text-xl font-black text-white font-mono block">{totalMembers}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Members</span>
            </div>
            <div>
              <span className="text-xl font-black text-white font-mono block">{totalTasks}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Tasks</span>
            </div>
            <div>
              <span className="text-xl font-black text-amber-400 font-mono block">Global</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE DIRECTOR SPOTLIGHT CARD */}
      <div id="leader-spotlight" className="bg-slate-950/80 border-t border-slate-800 py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              <EditablePublicAssetImage
                assetKey="founder-portrait"
                fallbackSrc={getHighResPhotoUrl(leaderPhotoURL) || DEFAULT_FOUNDER_PHOTO}
                fallbackAlt="Salman A.razak Hussein"
                label="Salman A.razak Hussein Portrait"
                className="w-20 h-20"
                imgClassName="w-20 h-20 rounded-full object-cover ring-2 ring-amber-400 border-2 border-slate-900 shadow-md"
              />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Salman A.razak Hussein
                </h3>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded text-[10px] font-bold uppercase">
                  Founder & Director
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 italic">
                "Through volunteering we create hope."
              </p>
              <p className="text-[11px] font-mono text-indigo-400 mt-1">
                Executive Leadership • Scholars Volunteer Team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.linkedin.com/in/salman-a-razak-hussein/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#0A66C2] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://x.com/salman_a_razak"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@salman_a_razak</span>
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Founder's Message</span>
            </button>
          </div>

        </div>
      </div>

      {/* English Language Testing Resources (DET & IELTS) Section directly under Founder's Message */}
      <EnglishProficiencySection />

      {/* Full-Screen Founder's Message Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 text-slate-100 p-4 sm:p-6 overflow-y-auto min-h-screen flex items-center justify-center transition-all animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          {/* Ambient Full-Screen Background showing SVT Identity colors and constellation map */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
            <img 
              src={customWideBanner || wideIdentityBanner} 
              alt="SVT Identity Background" 
              className="w-full h-full object-cover object-center scale-105 opacity-45"
              referrerPolicy="no-referrer"
            />
            {/* Smooth dark vignette & frosted glass overlay for maximum contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/85 backdrop-blur-md"></div>
          </div>

          <div className="max-w-2xl w-full bg-slate-900/95 border border-slate-700/60 rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] relative my-auto text-left overflow-hidden z-10 backdrop-blur-xl transition-all">
            {/* Clear & Unobstructed SVT Identity Graphic Header */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-slate-800 bg-slate-950">
              <img 
                src={customWideBanner || wideIdentityBanner} 
                alt="Scholars Volunteer Team Identity" 
                className="w-full h-full object-cover object-center scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30 pointer-events-none"></div>
              
              {/* Close Button top-right over header */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/20 shadow-md backdrop-blur-md z-20"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Founder Profile & Identity Info Box (Located cleanly under the picture) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-md">
                <div className="flex items-center gap-3.5">
                  {/* Founder Profile Picture on Black Background */}
                  <div className="p-1 bg-black rounded-2xl border border-slate-700 shadow-lg shrink-0">
                    <img
                      src={getHighResPhotoUrl(leaderPhotoURL) || DEFAULT_FOUNDER_PHOTO}
                      alt="Salman A.razak Hussein"
                      className="w-14 h-14 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight leading-snug">
                      Salman A.razak Hussein
                    </h3>
                    <p className="text-xs font-sans font-medium text-slate-300 mt-0.5">
                      Founder and Team Leader
                    </p>
                  </div>
                </div>

                {/* Social Media Connections (LinkedIn & 𝕏) */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                  <a
                    href="https://www.linkedin.com/in/salman-a-razak-hussein/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg transition-all text-xs font-semibold shadow-xs"
                    title="Connect on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/salman_a_razak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all text-xs font-semibold border border-slate-700 shadow-xs"
                    title="Follow on 𝕏"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>𝕏 Profile</span>
                  </a>
                </div>
              </div>

              {/* Founder's Essay Content - Clean Typography */}
              <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                <h4 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Why We Built SVT
                </h4>
                
                <p className="leading-relaxed text-slate-200">
                  When we started The Scholars Volunteer Team (SVT), we believed one simple thing: <strong className="text-white font-semibold">helping others has no boundaries</strong>. No matter where you live or what your situation is, you have the power to make a real difference.
                </p>

                <p className="leading-relaxed text-slate-200">
                  Our main goal is simple: <strong className="text-white font-semibold">students helping students</strong>. We all face similar study struggles, big questions about the future, and tough classes. When we share useful notes, study tips, and guidance with each other, we help everyone succeed together.
                </p>

                <p className="leading-relaxed text-slate-200">
                  Every small effort counts. Every guide shared and every hour spent helping others builds something bigger. Step by step, we are creating hope together.
                </p>
              </div>

              {/* Action Buttons & Dynamic Auth Feedback */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {user ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold rounded-xl shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Active Member</span>
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
                  href="https://x.com/svt_scholars"
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
