import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { 
  ArrowLeft, ShieldCheck, Lock, ExternalLink, AlertCircle, 
  Sparkles, Loader2, UserPlus, Crown
} from 'lucide-react';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import { GOOGLE_FORM_URL, isValidGoogleFormUrl } from '../constants/links';
import { signInWithGoogleFlow, formatAuthError } from '../utils/auth';
import { DEFAULT_FOUNDER_PHOTO, isLeaderEmail } from '../utils/leader';
import { notifyVolunteerSignIn } from '../services/notificationService';

interface SignInPageProps {
  user: User | null;
  loadingAuth: boolean;
  customTeamLogo?: string | null;
  customFounderPhoto?: string | null;
  initialIntent?: string | null;
  onNavigateHome: () => void;
  onNavigateToDashboard: () => void;
}

export default function SignInPage({
  user,
  loadingAuth,
  customTeamLogo,
  customFounderPhoto,
  initialIntent,
  onNavigateHome,
  onNavigateToDashboard,
}: SignInPageProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check intent from props or query string (e.g. /signin?intent=join)
  const isJoinIntent = (initialIntent === 'join') || (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('intent') === 'join';
    } catch {
      return false;
    }
  })();

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setErrorMsg(null);
    setRedirectNotice(false);

    try {
      const result = await signInWithGoogleFlow();
      if (result.isRedirecting) {
        setRedirectNotice(true);
        return;
      }
      if (result.userCredential) {
        const loggedUser = result.userCredential.user;
        notifyVolunteerSignIn({
          name: loggedUser.displayName || 'Volunteer Member',
          email: loggedUser.email || '',
          uid: loggedUser.uid,
          role: isLeaderEmail(loggedUser.email) ? 'admin' : 'member',
          status: 'active',
          photoURL: loggedUser.photoURL || undefined,
          timestamp: new Date().toISOString()
        }).catch(() => {});
        onNavigateToDashboard();
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      const formatted = formatAuthError(err);
      setErrorMsg(formatted);
    } finally {
      setSigningIn(false);
    }
  };

  const isCurrentUserLeader = isLeaderEmail(user?.email);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 px-4 py-8">
      {/* Top Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-slate-700 flex items-center justify-center overflow-hidden">
            <img
              src={customTeamLogo || teamLogoFallback}
              alt="SVT; The Scholars Volunteer Team official logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-sm font-bold font-display tracking-tight text-white">SVT</span>
        </div>
      </div>

      {/* Main Sign In Card */}
      <main className="max-w-md w-full mx-auto my-10 bg-slate-950/85 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm text-center relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Logo Badge */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-200 flex items-center justify-center overflow-hidden">
            <img
              src={customTeamLogo || teamLogoFallback}
              alt="SVT; The Scholars Volunteer Team official logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 text-amber-300 rounded-full text-xs font-semibold border border-amber-400/25">
              {isJoinIntent ? <UserPlus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isJoinIntent ? "Join Volunteer Team" : "Protected Member Portal"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {isJoinIntent ? "Join as a Volunteer" : "Sign In to SVT"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {isJoinIntent
                ? "Sign in with your Google account to set up your profile and submit your volunteer registration."
                : "Sign in with your Google account to access internal volunteer coordination, hours tracking, and peer reviews."}
            </p>
          </div>

          {redirectNotice && (
            <div className="p-3.5 bg-amber-950/80 border border-amber-800/80 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5 text-left">
              <Loader2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
              <div>
                <p className="font-bold">Redirecting to Google...</p>
                <p className="mt-0.5 text-amber-300/90">Browser popup was blocked. Opening secure full-page Google sign in...</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-2xl text-xs text-red-200 flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Sign-in Notice</span>
                <span className="text-red-200/90 leading-relaxed block">{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Already logged in state */}
          {user ? (
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-left">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 shrink-0 border-2 border-amber-400">
                  <img
                    src={isCurrentUserLeader ? (customFounderPhoto || DEFAULT_FOUNDER_PHOTO) : (user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email || 'User')}`)}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">{isCurrentUserLeader ? 'Salman A.Razak' : (user.displayName || 'Volunteer')}</p>
                    {isCurrentUserLeader && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  {isCurrentUserLeader && (
                    <span className="text-[10px] text-amber-300 font-semibold">Founder & Executive Leader</span>
                  )}
                </div>
              </div>

              <button
                onClick={onNavigateToDashboard}
                className="w-full min-h-[48px] px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>{isCurrentUserLeader ? "Open Leader Dashboard" : "Continue to Member Dashboard"}</span>
                <Sparkles className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Universal Sign In with Google */}
              <button
                id="btn-google-signin"
                onClick={handleGoogleSignIn}
                disabled={signingIn || loadingAuth}
                className="w-full min-h-[48px] px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {signingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                    <span>Connecting Google Account...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{isJoinIntent ? "Continue with Google to Join" : "Continue with Google"}</span>
                  </>
                )}
              </button>

              <div className="text-left bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure Authentication</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sign in with your verified Google account. Registered volunteers access their workspace directly; new members will complete a brief onboarding profile.
                </p>
              </div>
            </div>
          )}

          {/* Volunteer application footer */}
          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            {isValidGoogleFormUrl(GOOGLE_FORM_URL) ? (
              <>
                <p>Looking to apply to become a volunteer?</p>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors"
                >
                  <span>Fill Volunteer Application (Google Form)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            ) : (
              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 text-slate-400 text-[11px] space-y-0.5 text-left">
                <p className="font-medium text-slate-300">Volunteer Application Process</p>
                <p className="text-slate-400">
                  Click <strong className="text-amber-300 font-medium">{isJoinIntent ? "Join with Google" : "Sign In with Google"}</strong> to authenticate and complete your volunteer onboarding profile directly.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-xs text-slate-500 font-medium">
        © 2026 SVT • The Scholars Volunteer Team
      </footer>
    </div>
  );
}



