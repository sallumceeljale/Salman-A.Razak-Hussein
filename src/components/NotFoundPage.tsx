import React from 'react';
import { Home, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import { GOOGLE_FORM_URL } from '../constants/links';

interface NotFoundPageProps {
  customTeamLogo?: string | null;
  onNavigateHome: () => void;
}

export default function NotFoundPage({
  customTeamLogo,
  onNavigateHome,
}: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 px-4 py-8 text-center">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
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

      {/* Main 404 Container */}
      <main className="max-w-md w-full mx-auto my-12 bg-slate-950/80 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-200 flex items-center justify-center overflow-hidden">
            <img
              src={customTeamLogo || teamLogoFallback}
              alt="SVT; The Scholars Volunteer Team official logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <span className="text-4xl sm:text-5xl font-black text-amber-400 font-display tracking-tight block">
              404
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              The page you are looking for does not exist, has been moved, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={onNavigateHome}
              className="w-full min-h-[48px] px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Home className="w-4 h-4 text-slate-950" />
              <span>Back to Homepage</span>
            </button>

            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span>Join as a Volunteer</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Privacy Note */}
          <div className="pt-2 text-left bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Privacy Notice</span>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-relaxed">
              SVT collects only essential information needed for volunteer onboarding and task coordination. We never share or sell student data.
            </p>
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
