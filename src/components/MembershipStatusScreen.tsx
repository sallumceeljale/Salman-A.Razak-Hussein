import React from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { MemberStatus } from '../types';
import { 
  Clock, ShieldAlert, XCircle, FileSpreadsheet, 
  ExternalLink, ArrowLeft, LogOut, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, FileText 
} from 'lucide-react';
import { GOOGLE_FORM_URL, isValidGoogleFormUrl } from '../constants/links';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';

interface MembershipStatusScreenProps {
  status: MemberStatus | 'not_found';
  user: User;
  customTeamLogo?: string | null;
  onNavigateHome: () => void;
  onRecheckStatus?: () => void;
}

export default function MembershipStatusScreen({
  status,
  user,
  customTeamLogo,
  onNavigateHome,
  onRecheckStatus,
}: MembershipStatusScreenProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const hasValidFormUrl = isValidGoogleFormUrl(GOOGLE_FORM_URL);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 px-4 py-8">
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
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

      {/* Main Status Container */}
      <main className="max-w-lg w-full mx-auto my-10 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Status Badge and Icon */}
          {status === 'not_found' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 text-amber-300 rounded-full text-xs font-semibold border border-amber-400/25">
                <span>Application Required</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight">
                Volunteer Registration Required
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Your Google account is authenticated, but no active SVT volunteer membership record was found.
              </p>

              <div className="pt-2">
                {hasValidFormUrl ? (
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[48px] px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Volunteer Application (Google Form)</span>
                    <ExternalLink className="w-4 h-4 text-slate-950" />
                  </a>
                ) : (
                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Application form currently unavailable</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      External application form is currently unavailable. Please complete your in-app volunteer profile setup or reach out to your team coordinator.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : status === 'pending' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-400/15 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-400/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Application Under Review</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight">
                Membership Pending Approval
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Thank you for submitting your volunteer profile! Your application is currently awaiting coordinator verification. Once approved, all internal team modules will automatically unlock.
              </p>

              {/* Google Form Application Link or Clean Unavailable State */}
              {hasValidFormUrl ? (
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Official Volunteer Application</span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">External Form</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    If required by your chapter coordinator, you may also complete the team's supplementary Google Form.
                  </p>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Open Supplementary Form (Google Form)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-left space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>In-App Volunteer Profile Received</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Your member details and skills profile have been recorded. No external forms are required at this time.
                  </p>
                </div>
              )}

              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-left space-y-1">
                <p className="text-xs font-bold text-slate-300">What happens next?</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Team coordinators review new volunteer applicants regularly. Once your account status is updated to active, this page will automatically refresh into the Member Dashboard.
                </p>
              </div>

              {onRecheckStatus && (
                <button
                  onClick={onRecheckStatus}
                  className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Check / Refresh Application Status</span>
                </button>
              )}
            </div>
          ) : status === 'suspended' ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-400/15 text-red-300 rounded-full text-xs font-semibold border border-red-400/25">
                <span>Account Suspended</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight">
                Access Temporarily Suspended
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Your volunteer account access has been suspended in accordance with team governance policies. Please contact the administrative coordinator for further details.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-400/15 text-rose-300 rounded-full text-xs font-semibold border border-rose-400/25">
                <span>Application Not Approved</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display tracking-tight">
                Application Status
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                We are unable to approve your application for the current volunteering term. Thank you for your interest in the Scholars Volunteer Team.
              </p>
            </div>
          )}

          {/* User Details & Sign Out Option */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email || 'User')}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user.displayName || 'Volunteer'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 text-xs font-semibold border border-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
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
