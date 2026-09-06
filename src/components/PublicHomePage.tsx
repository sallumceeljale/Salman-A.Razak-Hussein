import React, { useState, useEffect } from 'react';
import { 
  Globe, ArrowRight, ExternalLink, Sparkles, BookOpen, GraduationCap, 
  HeartHandshake, Award, ShieldCheck, CheckCircle2, FileText, X, 
  Code2, Users, Target, Clock, Check, Compass, ChevronRight, Terminal
} from 'lucide-react';
import PublicHeader from './PublicHeader';
import PublicHero from './PublicHero';
import EnglishProficiencySection from './EnglishProficiencySection';
import StudentLearningPathways from './StudentLearningPathways';
import { LeadershipTeamSection } from './LeadershipTeamSection';
import EditablePublicAssetImage from './EditablePublicAssetImage';
import { getHighResPhotoUrl, DEFAULT_FOUNDER_PHOTO } from '../utils/leader';
import { 
  GOOGLE_FORM_URL, 
  OFFICIAL_DOMAIN, 
  OFFICIAL_DOMAIN_URL, 
  OFFICIAL_TWITTER_URL, 
  FOUNDER_LINKEDIN_URL, 
  FOUNDER_TWITTER_URL
} from '../constants/links';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import wideIdentityBanner from '../assets/images/svt_exact_identity_banner_final_1784959210089.jpg';

interface PublicHomePageProps {
  currentUserEmail?: string | null;
  customTeamLogo?: string | null;
  customWideBanner?: string | null;
  leaderPhotoURL?: string;
  onUpdateTeamLogo?: (base64: string) => Promise<void> | void;
  onUpdateWideBanner?: (base64: string) => Promise<void> | void;
  onUpdateFounderPhoto?: (base64: string) => Promise<void> | void;
  onNavigateToDashboard: () => void;
  onNavigateToJoin: () => void;
}

export default function PublicHomePage({
  currentUserEmail,
  customTeamLogo,
  customWideBanner,
  leaderPhotoURL,
  onUpdateTeamLogo,
  onUpdateWideBanner,
  onUpdateFounderPhoto,
  onNavigateToDashboard,
  onNavigateToJoin,
}: PublicHomePageProps) {
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFounderModalOpen) {
        setIsFounderModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFounderModalOpen]);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(OFFICIAL_DOMAIN_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 flex flex-col justify-between selection:bg-[#D99A18] selection:text-[#081A2C] font-sans">
      
      {/* 1. PUBLIC HEADER */}
      <PublicHeader
        currentUserEmail={currentUserEmail}
        customTeamLogo={customTeamLogo}
        onUpdateTeamLogo={onUpdateTeamLogo}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoin={onNavigateToJoin}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* 2. PUBLIC HERO */}
      <PublicHero 
        currentUserEmail={currentUserEmail} 
        customTeamLogo={customTeamLogo} 
        onUpdateTeamLogo={onUpdateTeamLogo} 
        onNavigateToJoin={onNavigateToJoin}
      />

      {/* MAIN PUBLIC CONTENT CONTAINER */}
      <main id="main-content" className="w-full">
        
        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: ABOUT SVT / MISSION & 3 PRINCIPLES (#about) */}
        {/* ------------------------------------------------------------- */}
        <section id="about" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Big Heading & Editorial Mission Quote */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-teal-800">
                <Compass className="w-4 h-4 text-teal-700" />
                <span>About SVT</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold font-sans text-slate-900 tracking-tight leading-[1.12]">
                Students Learning and Helping Together
              </h2>

              {/* Accent Mission Quote in Source Serif 4 */}
              <blockquote className="font-serif text-xl sm:text-2xl text-slate-800 font-normal leading-relaxed border-l-2 border-[#D99A18] pl-5 italic">
                "We unite students across borders to share open study resources, build practical skills, and support one another without barriers."
              </blockquote>
            </div>

            {/* Right Column: Clear Explanations & 3 Core Principles */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4 text-base sm:text-[18px] text-slate-700 leading-relaxed">
                <p>
                  SVT is a completely nonprofit organization built by students. We believe learning should be accessible to everyone, everywhere.
                </p>
                <p>
                  Through peer mentorship and open study materials, students share what they know and help each other prepare for exams, university, and future careers.
                </p>
              </div>

              {/* 3 Core Principles with Clean Dividers */}
              <div className="border-t border-slate-300 pt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900">Share Knowledge</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-0.5 leading-normal">
                      Open study notes, test preparation guides, and clear subject explanations created by students for students.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900">Build Practical Skills</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-0.5 leading-normal">
                      English proficiency, computer science foundations, and responsible technology habits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-slate-900">Serve with Purpose</h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-0.5 leading-normal">
                      Meaningful volunteer initiatives where students help peers, organize study sessions, and lead projects.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: PROGRAMS (#programs) - 3 Numbered Editorial Rows */}
        {/* ------------------------------------------------------------- */}
        <section id="programs" className="py-20 sm:py-24 bg-white border-y border-slate-200 scroll-mt-24 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
            
            <div className="max-w-3xl mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-teal-800">
                <Award className="w-4 h-4 text-teal-700" />
                <span>What SVT Offers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-sans text-slate-900 tracking-tight leading-tight">
                Programs Built for Students
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Structured, open initiatives designed to help students learn effectively and volunteer meaningfully.
              </p>
            </div>

            {/* 3 Numbered Editorial Items */}
            <div className="space-y-8">
              
              {/* Item 01: Learning Resources */}
              <div className="p-8 sm:p-10 rounded-xl bg-[#FAF9F5] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-6 max-w-2xl">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-teal-700 shrink-0">
                    01
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Learning Resources
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Free, curated study notes, practice sets, and test guides for English exams (Duolingo English Test, IELTS Academic) and standardized university testing.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleScrollToSection('resources')}
                  className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-[15px] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 self-start md:self-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  <span>Explore Resources</span>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              {/* Item 02: Student Learning Pathways */}
              <div className="p-8 sm:p-10 rounded-xl bg-[#FAF9F5] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-6 max-w-2xl">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-teal-700 shrink-0">
                    02
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Student Learning Pathways
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Step-by-step learning roadmaps with private, offline-first progress saving for self-guided study in testing, computer science, and college prep.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleScrollToSection('pathways')}
                  className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-[15px] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 self-start md:self-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  <span>View Pathways</span>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              {/* Item 03: Volunteer Opportunities */}
              <div className="p-8 sm:p-10 rounded-xl bg-[#FAF9F5] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-6 max-w-2xl">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-[#D99A18] shrink-0">
                    03
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Volunteer Opportunities
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed">
                      Practical ways for students to volunteer their time—creating open study notes, mentoring peers, organizing study circles, and leading community projects.
                    </p>
                  </div>
                </div>

                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-6 py-2.5 bg-[#D99A18] hover:bg-[#A96708] text-[#081A2C] font-semibold text-[15px] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 self-start md:self-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-xs"
                >
                  <span>Apply to Volunteer</span>
                  <ExternalLink className="w-4 h-4 text-[#081A2C]" />
                </a>
              </div>

            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: STUDENT LEARNING PATHWAYS (#pathways) */}
        {/* ------------------------------------------------------------- */}
        <StudentLearningPathways onNavigateToDashboard={onNavigateToDashboard} />


        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: TEST PREPARATION & ENGLISH PROFICIENCY (#resources) */}
        {/* ------------------------------------------------------------- */}
        <section id="resources" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 text-left">
          <div className="mb-10 space-y-3 font-sans max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-teal-800">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Academic Testing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-sans text-slate-900 tracking-tight leading-tight">
              Test Preparation Resources
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Accurate, practical guides for standardized English exams and university testing. Review preparation roadmaps for the Duolingo English Test (DET) and IELTS Academic with score requirements for top institutions.
            </p>
          </div>

          {/* Render the full EnglishProficiencySection */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <EnglishProficiencySection />
          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: COMPUTER SCIENCE & AI HUB PREVIEW (#cs-ai) */}
        {/* ------------------------------------------------------------- */}
        <section id="cs-ai" className="py-20 sm:py-24 bg-white border-y border-slate-200 scroll-mt-24 text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-teal-800">
                  <Terminal className="w-4 h-4 text-teal-700" />
                  <span>CS & AI Foundations</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-sans text-slate-900 tracking-tight leading-tight">
                  Computer Science and Responsible AI
                </h2>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[65ch]">
                  Learn real computational thinking, write clean code, and develop responsible habits for using modern AI tools in your studies.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900">Python Foundations</h4>
                    <p className="text-sm text-slate-600 mt-1">Variables, control flow, functions, and hands-on mini-projects.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900">Responsible AI</h4>
                    <p className="text-sm text-slate-600 mt-1">Using AI as an active tutor while protecting personal privacy.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900">Web Development</h4>
                    <p className="text-sm text-slate-600 mt-1">HTML, CSS, JavaScript, and building accessible web tools.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FAF9F5] border border-slate-200">
                    <h4 className="text-base font-bold text-slate-900">Problem Solving</h4>
                    <p className="text-sm text-slate-600 mt-1">Algorithmic thinking, debugging strategies, and clean code.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleScrollToSection('pathways')}
                    className="min-h-[44px] px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base rounded-lg transition-colors cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                  >
                    <span>Open CS & AI Pathway</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Code Snippet Visual */}
              <div className="lg:col-span-5 bg-[#081A2C] rounded-xl p-6 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm shadow-lg overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400 font-sans">
                  <span>svt_student_code.py</span>
                  <span className="text-teal-400">Python 3</span>
                </div>
                <pre className="space-y-1.5 overflow-x-auto">
                  <code>
                    <span className="text-teal-400">def</span> <span className="text-amber-300">learn_and_share</span>():{'\n'}
                    {'    '}goal = <span className="text-emerald-300">"Help students everywhere"</span>{'\n'}
                    {'    '}skills = [<span className="text-emerald-300">"English"</span>, <span className="text-emerald-300">"Python"</span>, <span className="text-emerald-300">"AI"</span>]{'\n'}
                    {'    '}<span className="text-teal-400">for</span> skill <span className="text-teal-400">in</span> skills:{'\n'}
                    {'        '}practice(skill){'\n'}
                    {'        '}teach_peers(skill){'\n'}
                    {'    '}<span className="text-teal-400">return</span> <span className="text-emerald-300">"Hope and progress."</span>{'\n'}
                    {'\n'}
                    print(learn_and_share())
                  </code>
                </pre>
              </div>

            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 6: LEADERSHIP TEAM */}
        {/* ------------------------------------------------------------- */}
        <LeadershipTeamSection />


        {/* ------------------------------------------------------------- */}
        {/* SECTION 7: FOUNDER'S MESSAGE (#founder) - Balanced 2 Columns */}
        {/* ------------------------------------------------------------- */}
        <section id="founder" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 text-left">
          <div className="bg-white rounded-xl p-8 sm:p-12 lg:p-14 border border-slate-200 shadow-xs font-sans">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Founder Portrait */}
              <div className="lg:col-span-5 flex justify-center lg:justify-start">
                <div className="w-full max-w-[360px] aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center relative">
                  <EditablePublicAssetImage
                    assetKey="founder-portrait"
                    fallbackSrc={getHighResPhotoUrl(leaderPhotoURL) || DEFAULT_FOUNDER_PHOTO}
                    fallbackAlt="Salman A.razak Hussein, Founder of SVT"
                    label="Salman A.razak Hussein Portrait"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    objectPosition="center 20%"
                  />
                </div>
              </div>

              {/* Right Column: Founder Details & Message */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                    <span>Founder's Message</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold font-sans text-slate-900 leading-tight">
                    Salman A.razak Hussein
                  </h3>
                  <p className="text-base font-semibold text-teal-700 mt-1">
                    Founder & Leader
                  </p>
                </div>

                {/* Message Text */}
                <p className="font-serif text-lg sm:text-xl text-slate-800 italic leading-relaxed">
                  "We built SVT to connect students across borders. When we share what we learn and help each other through tough subjects, every student gets a chance to succeed."
                </p>

                <p className="text-base text-slate-600 leading-relaxed">
                  Leading The Scholars Volunteer Team with the commitment to open education, student-led mentorship, and accessible learning tools for all.
                </p>

                {/* Social & Message Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={FOUNDER_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 bg-[#0A66C2] hover:bg-[#095196] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={FOUNDER_TWITTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>@salman_a_razak</span>
                  </a>

                  <button
                    onClick={() => setIsFounderModalOpen(true)}
                    className="min-h-[44px] px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Read Founder's Letter</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 8: IN DEVELOPMENT (#in-development) */}
        {/* ------------------------------------------------------------- */}
        <section id="in-development" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left font-sans">
          <div className="border border-slate-200 rounded-xl p-8 bg-white space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">In Development</h3>
              <p className="text-sm text-slate-600">
                These features are currently being planned and tested before public availability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-lg bg-[#FAF9F5] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">Private Essay Review Pilot</h4>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    In Planning
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A structured peer-review initiative for constructive feedback on university admission essays and scholarship personal statements.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#FAF9F5] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">Verified Service Records</h4>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    In Planning
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A digital logging system to verify peer tutoring hours and community volunteer activities across SVT.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 9: FINAL CALL TO ACTION (#join) */}
        {/* ------------------------------------------------------------- */}
        <section id="join" className="py-20 sm:py-28 bg-[#102A43] text-white scroll-mt-24 text-center font-sans border-t border-[#081A2C]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
            
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Join as a Volunteer</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold font-sans text-white tracking-tight leading-tight">
              Help us build something useful for students.
            </h2>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              SVT is looking for volunteers who want to contribute knowledge, study materials, and time to help peers worldwide.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                id="join-section-btn"
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-8 py-3.5 bg-[#D99A18] hover:bg-[#A96708] text-[#081A2C] font-semibold text-[16px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <span>Join as a Volunteer</span>
                <ArrowRight className="w-4 h-4 text-[#081A2C] shrink-0" />
              </a>

              <button
                onClick={onNavigateToDashboard}
                className="min-h-[48px] px-7 py-3.5 bg-transparent hover:bg-white/10 text-white font-semibold text-[16px] rounded-lg border border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <span>Open Member Portal</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-400 pt-3">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Privacy Notice: SVT collects basic details solely for volunteer coordination and does not sell student data.</span>
            </div>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* PUBLIC FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-slate-800 bg-[#081A2C] text-white py-14 text-left font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            
            {/* Col 1: Brand & Overview */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden border border-slate-800 shadow-xs">
                  <EditablePublicAssetImage
                    assetKey="svt-logo"
                    fallbackSrc={customTeamLogo || teamLogoFallback}
                    fallbackAlt="SVT; The Scholars Volunteer Team official logo"
                    label="Team Logo"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-lg font-bold text-white leading-tight block">
                    The Scholars Volunteer Team
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Students Helping Students Everywhere
                  </p>
                </div>
              </div>

              <p className="text-[15px] sm:text-base text-slate-400 leading-relaxed max-w-sm">
                A global student-led organization connecting students through learning, shared knowledge, and volunteer service.
              </p>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleCopyInviteLink}
                  className="min-h-[40px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-teal-400" /> : <Globe className="w-4 h-4 text-teal-400" />}
                  <span>{copiedLink ? "Domain Copied!" : OFFICIAL_DOMAIN}</span>
                </button>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-[15px] text-slate-400">
                <li>
                  <a href="#about" className="hover:text-amber-300 transition-colors">About SVT</a>
                </li>
                <li>
                  <a href="#programs" className="hover:text-amber-300 transition-colors">Programs</a>
                </li>
                <li>
                  <a href="#pathways" className="hover:text-amber-300 transition-colors">Learning Pathways</a>
                </li>
                <li>
                  <a href="#resources" className="hover:text-amber-300 transition-colors">Test Preparation</a>
                </li>
                <li>
                  <a href="#cs-ai" className="hover:text-amber-300 transition-colors">CS & AI</a>
                </li>
                <li>
                  <a href="#leadership-team" className="hover:text-amber-300 transition-colors">Leadership</a>
                </li>
                <li>
                  <button onClick={onNavigateToDashboard} className="hover:text-amber-300 transition-colors cursor-pointer text-left">
                    Member Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Leadership & Social Contact */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Leadership & Contact
              </h4>
              <div className="text-[15px] text-slate-400 space-y-2">
                <p className="font-semibold text-white">
                  Salman A.razak Hussein
                </p>
                <p className="text-xs text-slate-400">
                  Founder & Leader
                </p>
                <div className="pt-2 flex flex-col gap-2 text-sm font-mono">
                  <a href={OFFICIAL_TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>@svt_scholars</span>
                  </a>
                  <a href={FOUNDER_TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>@salman_a_razak</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
            <p>© 2026 The Scholars Volunteer Team (SVT). All rights reserved.</p>
            <p>
              Global Student-Led Non-Profit Network • <span className="text-slate-300">{OFFICIAL_DOMAIN}</span>
            </p>
          </div>
        </div>
      </footer>

      {/* FOUNDER'S MESSAGE MODAL */}
      {isFounderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Founder's Message"
          className="fixed inset-0 z-50 text-slate-100 p-4 sm:p-6 overflow-y-auto min-h-screen flex items-center justify-center transition-all animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFounderModalOpen(false);
            }
          }}
        >
          {/* Background backdrop */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-slate-950/85 backdrop-blur-md" />

          <div className="max-w-2xl w-full bg-[#081A2C] border border-slate-800 rounded-xl shadow-2xl relative my-auto text-left overflow-hidden z-10 font-sans">
            
            {/* Modal Top Banner */}
            <div className="relative h-36 sm:h-44 w-full overflow-hidden border-b border-slate-800 bg-slate-950">
              <EditablePublicAssetImage
                assetKey="team-banner"
                fallbackSrc={customWideBanner || wideIdentityBanner}
                fallbackAlt="SVT Banner"
                label="Identity Banner"
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsFounderModalOpen(false)}
                className="min-h-[44px] min-w-[44px] absolute top-4 right-4 text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 z-20"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-lg bg-[#102A43] border border-slate-700 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#081A2C] border border-[#D99A18] p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                  <EditablePublicAssetImage
                    assetKey="founder-portrait"
                    fallbackSrc={getHighResPhotoUrl(leaderPhotoURL) || DEFAULT_FOUNDER_PHOTO}
                    fallbackAlt="Salman A.razak Hussein"
                    label="Salman A.razak Hussein Portrait"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover rounded-full"
                    objectPosition="center 20%"
                  />
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-white leading-snug">
                    Salman A.razak Hussein
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold font-sans">
                    Founder & Leader
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-slate-200 text-base leading-relaxed">
                <h4 className="font-sans text-2xl font-bold text-white leading-snug">
                  Why we built SVT
                </h4>
                <p>
                  When we started The Scholars Volunteer Team (SVT), we believed one simple thing: <strong className="text-white">helping others has no boundaries</strong>. No matter where you live or what your situation is, you have the power to make a real difference.
                </p>
                <p>
                  Our main goal is simple: <strong className="text-white">students helping students</strong>. We all face similar study struggles, big questions about the future, and tough classes. When we share useful notes, study tips, and guidance with each other, we help everyone succeed together.
                </p>
                <p>
                  Every small effort counts. Every guide shared and every hour spent helping others builds something bigger. Step by step, we are creating hope together.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 font-sans">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 bg-[#D99A18] hover:bg-[#A96708] text-[#081A2C] text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <span>Join as a Volunteer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setIsFounderModalOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
