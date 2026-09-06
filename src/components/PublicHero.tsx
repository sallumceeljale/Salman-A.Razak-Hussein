import React from 'react';
import { ArrowRight, BookOpen, HeartHandshake, Award, ExternalLink } from 'lucide-react';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import { OFFICIAL_TWITTER_URL } from '../constants/links';
import EditablePublicAssetImage from './EditablePublicAssetImage';

interface PublicHeroProps {
  currentUserEmail?: string | null;
  customTeamLogo?: string | null;
  onUpdateTeamLogo?: (base64: string) => Promise<void> | void;
  onNavigateToJoin: () => void;
}

export default function PublicHero({
  customTeamLogo,
  onNavigateToJoin,
}: PublicHeroProps) {
  const handleScrollToResources = () => {
    const el = document.getElementById('resources');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Welcome to SVT"
      className="relative w-full bg-[#102A43] text-white border-b border-[#081A2C] min-h-[75vh] md:min-h-[82vh] flex items-center py-12 sm:py-16 md:py-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Eyebrow, Large Headline, Description, Actions */}
          <div className="lg:col-span-7 text-left space-y-6 sm:space-y-7">
            
            {/* Short Institutional Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
              <span className="w-2 h-2 rounded-full bg-teal-400" aria-hidden="true" />
              <span>SVT; The Scholars Volunteer Team</span>
            </div>

            {/* Large Institutional Headline */}
            <h1 className="text-[44px] sm:text-[62px] lg:text-[80px] xl:text-[88px] font-bold font-sans tracking-tight text-white leading-[1.0] max-w-[12ch]">
              Students Helping Students Everywhere.
            </h1>

            {/* Concise Description */}
            <p className="text-[18px] sm:text-[20px] lg:text-[22px] text-slate-300 font-normal leading-[1.55] max-w-[58ch]">
              A completely nonprofit, student-led organization connecting students through practical learning, shared knowledge, and volunteer service.
            </p>

            {/* Nonprofit Commitment Statement */}
            <p className="text-[15px] sm:text-base text-teal-300 font-medium leading-relaxed border-l-2 border-teal-500 pl-3.5">
              SVT is built by students to help students learn, volunteer, and support one another without barriers.
            </p>

            {/* Hero Actions Hierarchy */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 flex-wrap">
              {/* Primary Action (Gold) */}
              <button
                id="hero-btn-join"
                onClick={onNavigateToJoin}
                className="min-h-[48px] px-7 py-3.5 bg-[#D99A18] hover:bg-[#A96708] text-[#081A2C] font-semibold text-[16px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-[0.99]"
              >
                <span>Join as a Volunteer</span>
                <ArrowRight className="w-4 h-4 text-[#081A2C] shrink-0" />
              </button>

              {/* Secondary Action (Ghost/Outline) */}
              <button
                id="hero-btn-resources"
                onClick={handleScrollToResources}
                className="min-h-[48px] px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-semibold text-[16px] rounded-lg border border-slate-700 hover:border-slate-500 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <span>Explore Learning Resources</span>
              </button>
            </div>

          </div>

          {/* Right Column: Intentional Brand Composition with Network Geometric Motif */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#081A2C] rounded-xl p-8 border border-slate-800 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              
              {/* Network Geometric Grid Motif in background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hero-net" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hero-net)" />
                </svg>
              </div>

              {/* SVT Official Logo Container */}
              <div className="w-32 sm:w-36 aspect-square rounded-xl bg-white p-3 shadow-md border border-slate-200 flex items-center justify-center overflow-hidden relative z-10 mb-5">
                <EditablePublicAssetImage
                  assetKey="svt-logo"
                  fallbackSrc={customTeamLogo || teamLogoFallback}
                  fallbackAlt="SVT; The Scholars Volunteer Team official logo"
                  label="Team Logo"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-contain"
                />
              </div>

              {/* Identity Details */}
              <div className="space-y-1 relative z-10">
                <span className="text-lg font-bold text-white tracking-normal block">
                  The Scholars Volunteer Team
                </span>
                <span className="text-[14px] text-amber-300 font-medium block">
                  Students Helping Students Everywhere
                </span>
                <span className="text-xs text-slate-400 block pt-0.5">
                  Global Student-Led Non-Profit Network
                </span>
              </div>

              {/* Three Institutional Labels: Learning, Service, Leadership */}
              <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-5 border-t border-slate-800 relative z-10 text-center">
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/10">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200">Learning</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/10">
                  <HeartHandshake className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-semibold text-slate-200">Service</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/10">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200">Leadership</span>
                </div>
              </div>

              {/* Official 𝕏 Handle Link */}
              <a
                href={OFFICIAL_TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 transition-all cursor-pointer group/link relative z-10"
                title="Follow SVT on X (@svt_scholars)"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center border border-slate-800 text-white shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-medium text-amber-300 leading-none">@svt_scholars</p>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Official Account</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover/link:text-white">
                  <span>Follow</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-amber-300" />
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


