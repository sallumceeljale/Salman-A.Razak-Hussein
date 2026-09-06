import React from 'react';
import { 
  Award, FileText, ShieldCheck, Lock, GraduationCap, 
  Clock, Sparkles, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { VolunteerHourLog } from '../types';

export interface Member {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  hasCrown?: boolean;
  customBadge?: string;
}

export interface OfficialCredentialsHubProps {
  user: any;
  memberProfile: any;
  allMembers: Member[];
  logs: VolunteerHourLog[];
}

export default function OfficialCredentialsHub({
  user,
  memberProfile,
  allMembers,
  logs
}: OfficialCredentialsHubProps) {
  // Current logged in member or guest fallback
  const currentMember: Member = {
    uid: user?.uid || 'guest',
    name: memberProfile?.name || user?.displayName || 'Scholar Volunteer',
    email: user?.email || 'scholar@scholarsvolunteerteam.org',
    photoURL: memberProfile?.photoURL || user?.photoURL || '',
    role: memberProfile?.role || 'Volunteer Scholar'
  };

  // Calculate total hours logged overall for current user
  const userLogs = logs.filter(
    l => l.userId === currentMember.uid || (currentMember.email && l.userEmail?.toLowerCase() === currentMember.email.toLowerCase())
  );
  const totalVerifiedHours = userLogs.reduce((sum, log) => {
    if (typeof log.hours === 'number') return sum + log.hours;
    if (typeof log.minutes === 'number') return sum + (log.minutes / 60);
    return sum;
  }, 0);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Coming Soon Notice */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 text-amber-300 rounded-full text-xs font-bold border border-amber-400/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Verified Credentials — Coming Soon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              Official Credentialing & Service Transcripts
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Our official transcript and credential verification infrastructure is currently under active roadmap development. Automated generation, unverified signatures, and simulated certificates are disabled to ensure all future credentials adhere to authentic, transparent verification standards.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Standard Development Pilot</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Service hours continue to be accurately tracked and archived in your Member Hours Log for future certified records.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Status & Roadmap Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Member Service Standing & Credentials Roadmap */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Member Service Summary
                </h2>
                <p className="text-xs text-slate-500">
                  Logged in as <span className="font-semibold text-slate-800">{currentMember.name}</span>
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{totalVerifiedHours.toFixed(1)} Recorded Hrs</span>
            </span>
          </div>

          {/* Planned Credentials Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Official Volunteer Transcript (Planned) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl inline-block">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-md">
                    IN DEVELOPMENT
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Official Volunteer Service Transcript
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Itemized activity records and verified volunteer service logs designed for university admissions and scholarship documentation.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Launching with Verified Portal</span>
              </div>
            </div>

            {/* Card 2: Certificate of Service (Planned) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-amber-100 text-amber-800 rounded-xl inline-block">
                    <Award className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-md">
                    IN DEVELOPMENT
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Certificate of Leadership & Service
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Formal recognition of volunteer dedication and peer mentorship contributions, backed by institutional record checks.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Launching with Verified Portal</span>
              </div>
            </div>

          </div>

          {/* Security Notice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Service Record Integrity Notice
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                To protect student trust and ensure all records carry genuine merit, SVT does not issue self-signed or unverified digital certificates. All future credentials will undergo authenticated verification.
              </p>
            </div>
          </div>

        </div>

        {/* Right Col: Roadmap & Development Milestones */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Credentials Roadmap
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Planned development milestones for verified credential issuance.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Phase 1: Secure Activity Logging</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Accurate logging and tracking of peer mentoring and community hours. (Active)
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Phase 2: Verified Coordinator Review</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Structured administrative review and verification of completed milestones.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Phase 3: Admissions-Ready Transcripts</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Standardized verifiable digital transcripts with secure registry validation.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
            For questions regarding upcoming credential programs, reach out to your SVT student coordinator.
          </div>

        </div>

      </div>
    </div>
  );
}

