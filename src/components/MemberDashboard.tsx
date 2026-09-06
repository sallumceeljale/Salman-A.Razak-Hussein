import React, { useState, useRef, useEffect } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  MessageCircle, ClipboardList, BookOpen, Clock, Info, Share2, 
  Link2, Check, ShieldAlert, Crown, Sparkles, Users, Award, 
  Search, GraduationCap, Headphones, Target, ArrowLeft, Settings, 
  LogOut, LogIn, ExternalLink, Globe, UserCheck, ChevronDown, Edit3, ShieldCheck, Compass,
  FlaskConical 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, Task, Resource, VolunteerHourLog } from '../types';
import { getMemberBadge } from '../utils/badge';
import { isLeaderEmail, getHighResPhotoUrl } from '../utils/leader';
import { OFFICIAL_TWITTER_URL } from '../constants/links';
import EditablePublicAssetImage from './EditablePublicAssetImage';
import Board from './Board';
import TasksList from './TasksList';
import ResourceBank from './ResourceBank';
import HoursTracker from './HoursTracker';
import OfficialCredentialsHub from './OfficialCredentialsHub';
import EssayPeerReviewHub from './EssayPeerReviewHub';
import VirtualStudyRoom from './VirtualStudyRoom';
import InstitutionalImpactDashboard from './InstitutionalImpactDashboard';
import StudentLearningPathways from './StudentLearningPathways';
import PracticeLab from './PracticeLab';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';

interface MemberDashboardProps {
  user: User | null;
  memberProfile: any | null;
  loadingAuth: boolean;
  posts: Post[];
  tasks: Task[];
  resources: Resource[];
  logs: VolunteerHourLog[];
  allMembers: any[];
  isAdmin?: boolean;
  customTeamLogo?: string | null;
  customWideBanner?: string | null;
  leaderPhotoURL?: string;
  onUpdateTeamLogo: (base64: string) => Promise<void>;
  onUpdateWideBanner: (base64: string) => Promise<void>;
  onUpdateMemberPhoto: (uid: string, base64: string) => Promise<void>;
  onUpdateFounderPhoto?: (base64: string) => Promise<void> | void;
  onOpenProfile: (uid: string) => void;
  onOpenSettings: () => void;
  onOpenApplicationStatus?: () => void;
  onOpenAdminPortal?: () => void;
  onRefreshClaims?: () => Promise<void>;
  onViewRoster: () => void;
  onNavigateToPublic: () => void;
}

export default function MemberDashboard({
  user,
  memberProfile,
  loadingAuth,
  posts,
  tasks,
  resources,
  logs,
  allMembers,
  isAdmin = false,
  customTeamLogo,
  customWideBanner,
  leaderPhotoURL,
  onUpdateTeamLogo,
  onUpdateWideBanner,
  onUpdateMemberPhoto,
  onUpdateFounderPhoto,
  onOpenProfile,
  onOpenSettings,
  onOpenApplicationStatus,
  onOpenAdminPortal,
  onRefreshClaims,
  onViewRoster,
  onNavigateToPublic,
}: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bulletin' | 'tasks' | 'pathways' | 'practice' | 'resources' | 'hours' | 'transcripts' | 'essays' | 'study' | 'impact'>('bulletin');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  // Close account menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  const handleTabSelect = (tab: any) => {
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById('workspace-dashboard-area');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleCopyDashboardLink = () => {
    const url = window.location.origin + '/dashboard';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

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

  const totalLoggedHours = logs.reduce((sum, log) => sum + (Number(log.hours) || 0), 0);

  const sortedMembersList = [...allMembers].sort((a, b) => {
    const aIsLeader = isLeaderEmail(a.email);
    const bIsLeader = isLeaderEmail(b.email);
    if (aIsLeader && !bIsLeader) return -1;
    if (!aIsLeader && bIsLeader) return 1;

    const aHasCrown = !!a.hasCrown;
    const bHasCrown = !!b.hasCrown;
    if (aHasCrown && !bHasCrown) return -1;
    if (!aHasCrown && bHasCrown) return 1;

    const aTime = a.joinedAt instanceof Date ? a.joinedAt.getTime() : new Date(b.joinedAt).getTime();
    const bTime = b.joinedAt instanceof Date ? b.joinedAt.getTime() : new Date(b.joinedAt).getTime();
    return bTime - aTime;
  });

  const filteredCircleMembers = sortedMembersList.filter(member => {
    const queryStr = memberSearchQuery.toLowerCase();
    return (
      (member.name || '').toLowerCase().includes(queryStr) ||
      (member.email || '').toLowerCase().includes(queryStr)
    );
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-between text-left selection:bg-amber-400 selection:text-slate-950">
      <div>
        
        {/* MEMBER DASHBOARD TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 gap-3">
              
              {/* Left: Back to Public Site + SVT Dashboard Branding */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  id="btn-back-to-public"
                  onClick={onNavigateToPublic}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
                  title="Return to Public Homepage"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Public Site</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 shrink-0 border border-slate-700 flex items-center justify-center overflow-hidden">
                    <EditablePublicAssetImage
                      assetKey="svt-logo"
                      fallbackSrc={customTeamLogo || teamLogoFallback}
                      fallbackAlt="SVT; The Scholars Volunteer Team official logo"
                      label="Team Logo"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-contain"
                    />
                  </div>
                  <div 
                    onClick={() => handleTabSelect('bulletin')}
                    className="hidden md:block cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white font-display leading-none group-hover:text-amber-300 transition-colors">
                        SVT Member Portal
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                        Workspace
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Workspace Section Tabs Hub */}
              <nav 
                id="member-workspace-tabs"
                className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80 shadow-inner overflow-x-auto max-w-full no-scrollbar shrink-1"
                aria-label="Member Workspace Tabs"
              >
                <button 
                  onClick={() => handleTabSelect('bulletin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'bulletin' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Bulletin</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('tasks')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'tasks' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Activities</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('pathways')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'pathways' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pathways</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('practice')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'practice' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Practice Lab</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('hours')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'hours' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hours Log</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('transcripts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'transcripts' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificates</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('impact')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'impact' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Goals</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('resources')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'resources' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Resources</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('essays')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'essays' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Essay Hub</span>
                </button>
                <button 
                  onClick={() => handleTabSelect('study')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'study' ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Study Room</span>
                </button>
              </nav>

              {/* Right: X.com Link, Auth Profile & Settings */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={OFFICIAL_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-black text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 hover:border-slate-500 transition-all cursor-pointer group shadow-2xs"
                  title="Follow SVT on X (@svt_scholars)"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0 text-slate-300 group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-[11px] font-mono font-bold text-amber-300">@svt_scholars</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white" />
                </a>

                {loadingAuth ? (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                ) : user ? (
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      id="account-menu-trigger"
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      aria-expanded={isAccountMenuOpen}
                      aria-haspopup="menu"
                      className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 p-1 pl-2 pr-2.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-indigo-900 border border-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {memberProfile?.photoURL || user.photoURL ? (
                          <img
                            src={memberProfile?.photoURL || user.photoURL}
                            alt={memberProfile?.displayName || memberProfile?.name || user.displayName || 'Volunteer'}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          user.displayName?.[0] || 'V'
                        )}
                      </div>
                      <span className="text-xs font-bold text-white max-w-[100px] truncate hidden sm:inline">
                        {memberProfile?.displayName || memberProfile?.name || user.displayName || 'Scholar'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180 text-amber-400' : ''}`} />
                    </button>

                    {/* Account Dropdown Menu */}
                    <AnimatePresence>
                      {isAccountMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 8 }}
                          transition={{ duration: 0.15 }}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="account-menu-trigger"
                          className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-left text-white overflow-hidden"
                        >
                          {/* User Header Summary */}
                          <div className="px-4 py-3 border-b border-slate-800/80">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-950 border border-slate-700 shrink-0">
                                {memberProfile?.photoURL || user.photoURL ? (
                                  <img
                                    src={memberProfile?.photoURL || user.photoURL}
                                    alt={memberProfile?.displayName || memberProfile?.name || user.displayName || 'Volunteer'}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                                    {user.displayName?.[0] || 'V'}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-white truncate">
                                  {memberProfile?.displayName || memberProfile?.name || user.displayName || 'Scholar'}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>

                            {/* Role / Display Label */}
                            {isAdmin ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wide w-full">
                                <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                                <span className="truncate">Founder & Administrator</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>{memberProfile?.role || 'Member'} • {memberProfile?.status || 'Active'}</span>
                              </div>
                            )}
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <button
                              role="menuitem"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                onOpenProfile(user.uid);
                              }}
                              className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <UserCheck className="w-4 h-4 text-indigo-400" />
                              <span>View Profile</span>
                            </button>

                            <button
                              role="menuitem"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                onOpenSettings();
                              }}
                              className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 text-amber-400" />
                              <span>Edit Profile</span>
                            </button>

                            {/* Administration Link */}
                            {onOpenAdminPortal && (
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setIsAccountMenuOpen(false);
                                  onOpenAdminPortal();
                                }}
                                className={`w-full px-4 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                  isAdmin
                                    ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 font-semibold'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-amber-400' : 'text-slate-400'}`} />
                                  <span>Administration</span>
                                </div>
                                {isAdmin && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-mono font-bold">
                                    Verified
                                  </span>
                                )}
                              </button>
                            )}

                            {onOpenApplicationStatus && (
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setIsAccountMenuOpen(false);
                                  onOpenApplicationStatus();
                                }}
                                className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                              >
                                <Award className="w-4 h-4 text-emerald-400" />
                                <span>Application Status</span>
                              </button>
                            )}
                          </div>

                          {/* Sign Out Section */}
                          <div className="pt-1 border-t border-slate-800/80">
                            <button
                              role="menuitem"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                handleLogout();
                              }}
                              className="w-full px-4 py-2 text-xs text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 flex items-center gap-2.5 transition-colors cursor-pointer font-semibold"
                            >
                              <LogOut className="w-4 h-4 text-rose-400" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleLogin}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Scholar Sign In</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE DASHBOARD CONTENT */}
        <main id="workspace-dashboard-area" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Member Welcome Card */}
          <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Welcome to SVT
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                You are part of a student-led nonprofit community where students share knowledge, develop useful skills, support one another, and contribute to meaningful volunteer projects.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigateToPublic();
                setTimeout(() => {
                  const el = document.getElementById('about');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (window.history.pushState) {
                      window.history.pushState(null, '', '#about');
                    }
                  }
                }, 100);
              }}
              className="shrink-0 min-h-[44px] px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200/80 transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span>Explore SVT’s Mission</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180 shrink-0" />
            </button>
          </div>

          {/* Active Section Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-xs shrink-0 font-bold">
                {activeTab === 'bulletin' && <MessageCircle className="w-5 h-5" />}
                {activeTab === 'tasks' && <ClipboardList className="w-5 h-5" />}
                {activeTab === 'pathways' && <Compass className="w-5 h-5" />}
                {activeTab === 'practice' && <FlaskConical className="w-5 h-5" />}
                {activeTab === 'hours' && <Clock className="w-5 h-5" />}
                {activeTab === 'transcripts' && <Award className="w-5 h-5" />}
                {activeTab === 'impact' && <Target className="w-5 h-5" />}
                {activeTab === 'resources' && <BookOpen className="w-5 h-5" />}
                {activeTab === 'essays' && <GraduationCap className="w-5 h-5" />}
                {activeTab === 'study' && <Headphones className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-display">
                  {activeTab === 'bulletin' && "Bulletin Board & Circle Updates"}
                  {activeTab === 'tasks' && "Volunteering Activities & Opportunities"}
                  {activeTab === 'pathways' && "Student Learning Pathways & Roadmaps"}
                  {activeTab === 'practice' && "SVT Practice Lab — Interactive Skill Drills"}
                  {activeTab === 'hours' && "Volunteering Hours Log & Record"}
                  {activeTab === 'transcripts' && "Verified Credentials — Coming Soon"}
                  {activeTab === 'impact' && "Team Goals, Leadership & Governance"}
                  {activeTab === 'resources' && "Academic Resource Bank"}
                  {activeTab === 'essays' && "Private Essay Review Pilot — Coming Soon"}
                  {activeTab === 'study' && "Silent Study Room"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  The Scholars Volunteer Team Member Workspace
                </p>
              </div>
            </div>

            {/* Quick Actions: Follow on X & Share Link */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <a
                href={OFFICIAL_TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-black text-white border border-slate-800 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
                title="Follow @svt_scholars on X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0 text-slate-300 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="font-mono text-amber-300">@svt_scholars</span>
                <span className="hidden sm:inline text-slate-300 font-sans font-bold">• Follow on 𝕏</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 transition-colors" />
              </a>

              <button
                onClick={handleCopyDashboardLink}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-slate-500" />}
                <span>{copiedLink ? "Dashboard Link Copied!" : "Share Portal"}</span>
              </button>
            </div>
          </div>

          {/* Prompt banner to non-logged users */}
          <AnimatePresence mode="wait">
            {!loadingAuth && !user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="mb-6 p-4 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-700 shadow-lg shadow-indigo-600/10 text-left"
              >
                <div className="flex gap-3 items-start sm:items-center">
                  <div className="p-2.5 bg-white/10 rounded-xl shrink-0 mt-1 sm:mt-0 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-display tracking-tight">Welcome to the Scholars Volunteer Team Workspace!</h3>
                    <p className="text-xs text-indigo-100 mt-1 font-medium leading-relaxed">
                      You can view all resources, but you need to log in via Google to post announcements or register for volunteering slots under our schedule.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  Sign In with Google
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2-Column Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
            
            {/* Left Content Area: Selected Tab View */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === 'bulletin' ? (
                  <motion.div
                    key="bulletin"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Board 
                      posts={posts} 
                      user={user} 
                      memberProfile={memberProfile} 
                      onViewProfile={onOpenProfile} 
                      customWideBanner={customWideBanner}
                      onUpdateWideBanner={onUpdateWideBanner}
                    />
                  </motion.div>
                ) : activeTab === 'tasks' ? (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <TasksList tasks={tasks} user={user} memberProfile={memberProfile} />
                  </motion.div>
                ) : activeTab === 'pathways' ? (
                  <motion.div
                    key="pathways"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <StudentLearningPathways 
                      isDashboardView={true} 
                      onNavigateToDashboard={() => {}} 
                    />
                  </motion.div>
                ) : activeTab === 'practice' ? (
                  <motion.div
                    key="practice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PracticeLab isDashboardView={true} />
                  </motion.div>
                ) : activeTab === 'resources' ? (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ResourceBank resources={resources} user={user} memberProfile={memberProfile} />
                  </motion.div>
                ) : activeTab === 'hours' ? (
                  <motion.div
                    key="hours"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HoursTracker 
                      logs={logs} 
                      user={user} 
                      memberProfile={memberProfile} 
                      allMembers={allMembers} 
                      onViewProfile={onOpenProfile} 
                      onUpdateMemberPhoto={onUpdateMemberPhoto}
                    />
                  </motion.div>
                ) : activeTab === 'transcripts' ? (
                  <motion.div
                    key="transcripts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <OfficialCredentialsHub 
                      user={user} 
                      memberProfile={memberProfile} 
                      allMembers={allMembers} 
                      logs={logs} 
                    />
                  </motion.div>
                ) : activeTab === 'essays' ? (
                  <motion.div
                    key="essays"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <EssayPeerReviewHub user={user} memberProfile={memberProfile} />
                  </motion.div>
                ) : activeTab === 'study' ? (
                  <motion.div
                    key="study"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <VirtualStudyRoom />
                  </motion.div>
                ) : (
                  <motion.div
                    key="impact"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <InstitutionalImpactDashboard logs={logs} totalMembers={allMembers.length} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar Area: Live list of all members with crowns and honors */}
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm text-left self-start">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                  <h3 className="text-xs font-black font-display text-slate-800 uppercase tracking-widest leading-none">
                    Team Circle
                  </h3>
                </div>
                <button
                  onClick={onViewRoster}
                  className="text-[9.5px] font-black uppercase text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0 transition-colors cursor-pointer"
                >
                  {allMembers.length} Members
                </button>
              </div>

              <p className="text-[10px] text-slate-500 mb-3 leading-relaxed font-bold uppercase tracking-wider">
                🌟 Member Roster & Honors
              </p>

              {/* Team Hours Summary Card */}
              <div className="mb-3 bg-gradient-to-br from-indigo-50/80 via-slate-50/50 to-white border border-indigo-100 rounded-2xl p-3.5 relative overflow-hidden shadow-2xs">
                <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10 pointer-events-none">
                  <Award className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                      Total Team Impact
                    </span>
                    <span className="text-base font-black text-slate-800 leading-none flex items-baseline gap-1">
                      {totalLoggedHours.toFixed(1)}
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hrs Logged</span>
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[9.5px] font-bold text-slate-500 leading-relaxed">
                  Every hour of tutoring, initiative support, or peer review directly empowers our student community.
                </div>
              </div>

              {/* Official X / Twitter Channel Spotlight Card */}
              <div className="mb-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 rounded-2xl p-3.5 relative overflow-hidden shadow-sm group">
                <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <svg className="w-20 h-20 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>

                <div className="flex items-start justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black tracking-tight text-white font-display">
                          Official 𝕏 Channel
                        </span>
                        <span className="text-[7.5px] font-mono font-black bg-amber-400 text-slate-950 px-1 py-0.5 rounded uppercase leading-none">
                          Official
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-amber-300 block leading-tight">
                        @svt_scholars
                      </span>
                    </div>
                  </div>

                  <a
                    href={OFFICIAL_TWITTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-950 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 shadow-xs shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                    title="Visit SVT on X (@svt_scholars)"
                  >
                    <span>Follow</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <p className="mt-2 text-[10px] text-slate-300 leading-relaxed relative z-10">
                  Follow our official account for live volunteer stories, academic alerts, community updates & scholar milestones.
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
                  <span className="font-mono text-slate-400 font-semibold">#SVT_Scholars</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Proud to volunteer with @svt_scholars! Students helping students everywhere 🌟 #SVT_Scholars https://www.scholarsvolunteerteam.org')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-amber-200 font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Post on 𝕏</span>
                    <Share2 className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Instant Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search teammate by name..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Dynamic scrollable members block */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredCircleMembers.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 select-none">
                    <p className="text-xs font-bold">No teammates found</p>
                    <p className="text-[9px] mt-0.5">Try searching with another spelling</p>
                  </div>
                ) : (
                  filteredCircleMembers.map((member) => {
                    const isLeader = isLeaderEmail(member.email);
                    const nameParts = member.name.split(' (');
                    const primaryName = nameParts[0];
                    const englishTag = nameParts[1] ? nameParts[1].replace(')', '') : '';
                    const autoBadge = getMemberBadge(member.uid, logs, posts);

                    return (
                      <div
                        key={member.uid}
                        onClick={() => onOpenProfile(member.uid)}
                        className={`p-2.5 rounded-2xl border transition-all duration-150 flex items-center gap-3 relative overflow-hidden group select-none cursor-pointer hover:scale-[1.015] active:scale-[0.985] hover:border-indigo-400 ${
                          isLeader
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-300 ring-2 ring-amber-400/10 shadow-xs shadow-amber-100/50'
                            : member.hasCrown
                            ? 'bg-gradient-to-r from-slate-50 to-amber-50/20 border-amber-200'
                            : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-150'
                        }`}
                        title="Click to view full scholar profile"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 border border-white shadow-xs flex items-center justify-center">
                            <img
                              src={member.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(member.uid)}`}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(member.uid)}`;
                              }}
                            />
                          </div>
                          {member.hasCrown && (
                            <div className="absolute -top-1.5 -right-1 text-xs filter drop-shadow" title="Crowned active status">
                              👑
                            </div>
                          )}
                        </div>

                        {/* Name and tags */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className={`font-bold text-xs truncate leading-tight ${isLeader ? 'text-amber-950 font-black' : 'text-slate-800'}`}>
                              {primaryName}
                            </span>
                            {isLeader && (
                              <span className="shrink-0 text-[6.5px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/60 border border-amber-300 px-1 rounded font-sans leading-none">
                                Leader
                              </span>
                            )}
                            {member.hasCrown && !isLeader && (
                              <span className="shrink-0 text-[6px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded leading-none font-sans">
                                👑 Crowned
                              </span>
                            )}
                          </div>

                          <p className="text-[9.5px] text-slate-500 truncate leading-snug mt-0.5">
                            {isLeader ? 'Project Founder & Director' : (englishTag ? `(${englishTag})` : 'Active Member')}
                          </p>

                          {/* Badges container */}
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            {member.customBadge && (
                              <span className={`text-[7.2px] font-black uppercase border px-1.5 py-0.5 rounded leading-none font-sans flex items-center gap-0.5 shrink-0 ${
                                isLeader
                                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                🏆 {member.customBadge}
                              </span>
                            )}

                            {autoBadge && (
                              <span 
                                className={`text-[7.2px] font-black uppercase border px-1.5 py-0.5 rounded leading-none font-sans flex items-center gap-0.5 shrink-0 shadow-3xs ${autoBadge.colorClass}`}
                                title={`Dynamic Badge: ${autoBadge.reason}`}
                              >
                                <span>{autoBadge.icon}</span>
                                <span>{autoBadge.text}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* DASHBOARD FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onNavigateToPublic}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public SVT Website</span>
            </button>
            
            <span className="text-slate-300 hidden sm:inline">•</span>

            <a
              href={OFFICIAL_TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-700 hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Follow @svt_scholars on 𝕏</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            © 2026 The Scholars Volunteer Team • Synchronized with Cloud Firestore
          </p>
        </div>
      </footer>

    </div>
  );
}
