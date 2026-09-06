import React from 'react';
import { 
  Award, ShieldCheck, Users, BookOpen, Clock, GraduationCap, 
  CheckCircle2, ArrowRight, Globe, FileText, Landmark, MessageCircle, 
  ClipboardList, ExternalLink, Mail, MapPin, HeartHandshake, Sparkles 
} from 'lucide-react';

interface InstitutionalSectionsProps {
  onSelectTab: (tab: 'bulletin' | 'tasks' | 'resources' | 'hours' | 'transcripts' | 'essays' | 'study' | 'impact') => void;
  totalMembers: number;
  totalHours: number;
}

export default function InstitutionalSections({ onSelectTab, totalMembers, totalHours }: InstitutionalSectionsProps) {
  return (
    <div className="space-y-16 mt-12 text-left">
      
      {/* 1. ABOUT & ACTIVE TEAM IMPACT SECTION */}
      <section id="impact-section" className="scroll-mt-24">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-slate-700">
              Institutional Overview
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                Global Academic Peer Mentorship & Cross-Border Student Impact
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-normal">
                Founded by <strong className="text-slate-900 dark:text-white">Salman A.razak Hussein</strong>, The Scholars Volunteer Team (SVT) operates an active global circle of high-achieving student scholars. We coordinate peer tutoring, university essay reviews, collaborative study rooms, and community support projects across international borders.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Verified Volunteering Hours
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Itemized service logs verified by executive team leaders for university Common App and scholarship submissions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Academic Peer Tutoring & Essay Review
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Structured constructive feedback on college essays, research drafts, and STEM coursework.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Coursera & Google-Standard Certification
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Digital credential IDs backed by online verification domain <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">www.scholarsvolunteerteam.org</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => onSelectTab('impact')}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>View Governance & Impact Data</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Impact Metric Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {totalMembers}+
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Scholar Members
                </p>
                <p className="text-[11px] text-slate-400">
                  Global student network collaborating across tutoring and service.
                </p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl w-fit">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {totalHours.toFixed(0)}+
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Logged Service Hours
                </p>
                <p className="text-[11px] text-slate-400">
                  Student volunteer hours logged and reviewed by coordinators.
                </p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl w-fit">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  Global
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Cross-Border Reach
                </p>
                <p className="text-[11px] text-slate-400">
                  Connecting scholars from multiple regions worldwide.
                </p>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl w-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  Active
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Student-Led Team
                </p>
                <p className="text-[11px] text-slate-400">
                  Peer-organized study sessions, activities, and workshops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2. KEY PROGRAMS & INITIATIVES GRID */}
      <section id="programs-section" className="scroll-mt-24 space-y-6">
        <div>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-slate-700">
            Core Initiatives
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Key Academic & Volunteer Programs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structured activities designed to empower students and foster collaborative peer learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Program 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all">
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Essay Peer Review Pilot
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Planned peer review exchange for constructive feedback on draft essays from fellow student volunteers.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('essays')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Open Essay Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Program 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all">
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Service Logs & Credential Hub
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track volunteer hours and review service records in preparation for official credential exports.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('transcripts')}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Credential Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Program 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all">
            <div className="space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl w-fit">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Resource & Study Bank
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralized repository of study guides, tutoring materials, SAT/ACT prep notes, and leadership guidelines.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('resources')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Explore Bank</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Program 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all">
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Volunteer Activities
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sign up for scheduled team activities, tutoring sessions, workshop coordination, and community drives.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('tasks')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Volunteer Activities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>


      {/* 3. VOLUNTEER CREDENTIAL DEVELOPMENT CALLOUT */}
      <section id="credentials-section" className="scroll-mt-24">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 text-amber-300 rounded-md text-xs font-mono font-bold border border-amber-400/20">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Service Record Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Volunteer Service Transcript & Records Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Volunteer service logs are archived with itemized activity breakdowns for member verification on our official domain: <span className="font-mono text-amber-300 font-bold">www.scholarsvolunteerteam.org</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('transcripts')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Open Credential Hub</span>
            </button>
          </div>
        </div>
      </section>


      {/* 4. INSTITUTIONAL 4-COLUMN FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-12 pb-8 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
          
          {/* Col 1: About SVT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                SVT
              </div>
              <span className="font-black text-sm text-slate-900 dark:text-white">
                Scholars Volunteer Team
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              An active global student volunteer network connecting scholars worldwide for peer study circles, curated resource exchange, and volunteer coordination.
            </p>
            <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              www.scholarsvolunteerteam.org
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onSelectTab('bulletin')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Bulletin Board & News
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tasks')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Volunteer Activities
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('hours')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Volunteering Hours Log
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('transcripts')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Service Logs & Transcripts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Academic Hubs
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onSelectTab('essays')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  College Essay Peer Review (Pilot)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('study')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Silent Study Room
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('resources')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Scholar Study Resource Bank
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('impact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  Impact & Governance Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Executive Leadership & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Leadership & Contact
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Salman A.razak Hussein
              </p>
              <p className="text-[11px] text-slate-500">
                Founder & Team Director
              </p>
              <div className="pt-2 flex flex-col gap-1 text-[11px] font-mono">
                <a href="https://x.com/svt_scholars" target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:underline">
                  𝕏 @svt_scholars
                </a>
                <a href="https://x.com/salman_a_razak" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:underline">
                  𝕏 @salman_a_razak
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Security note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 Scholars Volunteer Team (SVT). All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Official Domain: <span className="text-slate-600 dark:text-slate-300 font-bold">www.scholarsvolunteerteam.org</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
