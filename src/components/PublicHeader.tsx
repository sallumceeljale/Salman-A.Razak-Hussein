import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ExternalLink } from 'lucide-react';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import { OFFICIAL_TWITTER_URL } from '../constants/links';
import EditablePublicAssetImage from './EditablePublicAssetImage';

interface PublicHeaderProps {
  currentUserEmail?: string | null;
  customTeamLogo?: string | null;
  onUpdateTeamLogo?: (base64: string) => Promise<void> | void;
  onNavigateToDashboard: () => void;
  onNavigateToJoin: () => void;
  onNavigateHome?: () => void;
}

export default function PublicHeader({
  currentUserEmail,
  customTeamLogo,
  onUpdateTeamLogo,
  onNavigateToDashboard,
  onNavigateToJoin,
  onNavigateHome,
}: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (!sectionId || sectionId === 'home') {
      if (onNavigateHome) {
        onNavigateHome();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { label: 'About', action: () => handleNavClick('about') },
    { label: 'Programs', action: () => handleNavClick('programs') },
    { label: 'Pathways', action: () => handleNavClick('pathways') },
    { label: 'Resources', action: () => handleNavClick('resources') },
    { label: 'Leadership', action: () => handleNavClick('leadership-team') },
  ];

  return (
    <>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 font-sans ${
          scrolled
            ? 'bg-[#081A2C]/95 backdrop-blur-md shadow-md border-b border-slate-800'
            : 'bg-[#102A43] border-b border-[#081A2C]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: SVT Logo & Full Organization Name */}
            <div className="flex items-center gap-3.5 text-left shrink-0">
              <button
                id="public-brand-logo"
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg p-1 group"
                aria-label="SVT - The Scholars Volunteer Team Home"
              >
                <div className="w-11 h-11 rounded-lg bg-white p-1 shrink-0 border border-slate-700 shadow-xs flex items-center justify-center overflow-hidden">
                  <EditablePublicAssetImage
                    assetKey="svt-logo"
                    fallbackSrc={customTeamLogo || teamLogoFallback}
                    fallbackAlt="SVT official logo"
                    label="Team Logo"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white leading-none group-hover:text-amber-300 transition-colors">
                    SVT
                  </span>
                  <span className="text-[13px] text-slate-300 font-normal tracking-normal mt-1 whitespace-nowrap hidden sm:inline">
                    The Scholars Volunteer Team
                  </span>
                </div>
              </button>
            </div>

            {/* Center Navigation Links (Desktop lg+) at 16px */}
            <nav
              id="public-desktop-nav"
              className="hidden lg:flex items-center gap-1 xl:gap-2"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="min-h-[44px] px-4 py-2 text-[16px] font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 flex items-center whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {/* Member Sign In Button */}
              <button
                id="btn-public-member-portal"
                onClick={onNavigateToDashboard}
                className="min-h-[44px] px-4 py-2 bg-slate-800/80 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-[15px] sm:text-[16px] rounded-lg border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 whitespace-nowrap shrink-0"
              >
                <span>Member Portal</span>
              </button>

              {/* Primary Action: Join as a Volunteer (Gold) */}
              <button
                id="btn-public-join-volunteer"
                onClick={onNavigateToJoin}
                className="min-h-[44px] px-5 py-2.5 bg-[#D99A18] hover:bg-[#A96708] text-[#081A2C] font-semibold text-[15px] sm:text-[16px] rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap shrink-0 active:scale-[0.99]"
              >
                <span>Join as a Volunteer</span>
                <ArrowRight className="w-4 h-4 text-[#081A2C] shrink-0" />
              </button>
            </div>

            {/* Mobile Menu Toggle Button (Visible on < lg screens) */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-h-[48px] min-w-[48px] p-2.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 cursor-pointer"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Accessible Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            id="public-mobile-nav"
            className="lg:hidden bg-[#081A2C] border-b border-slate-800 px-4 pt-4 pb-6 space-y-3 shadow-xl text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="w-full text-left min-h-[48px] px-4 py-3 text-[16px] font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 flex items-center cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile 𝕏 Handle link */}
            <a
              href={OFFICIAL_TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] px-4 py-3 bg-slate-900 hover:bg-black text-white text-sm font-medium rounded-lg border border-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 fill-current text-slate-300" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Follow on 𝕏:</span>
                <span className="font-mono text-amber-300">@svt_scholars</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToDashboard();
                }}
                className="w-full min-h-[48px] px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[16px] rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 cursor-pointer"
              >
                <span>Member Portal</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="btn-mobile-join-volunteer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToJoin();
                }}
                className="w-full min-h-[48px] px-4 py-3 bg-[#D99A18] hover:bg-[#A96708] text-[#081A2C] font-bold text-[16px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 cursor-pointer"
              >
                <span>Join as a Volunteer</span>
                <ArrowRight className="w-4 h-4 text-[#081A2C]" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
