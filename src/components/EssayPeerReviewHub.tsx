import React from 'react';
import { User } from 'firebase/auth';
import { 
  FileText, MessageSquare, Sparkles, ShieldCheck, 
  GraduationCap, Lock, CheckCircle2, Clock, Users, ArrowRight 
} from 'lucide-react';

export interface FeedbackComment {
  id: string;
  reviewerUid: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerPhotoURL?: string;
  ratingClarity: number; // 1-5
  ratingAcademic: number; // 1-5
  ratingImpact: number; // 1-5
  comments: string;
  suggestedRevision: string;
  createdAt: any;
}

export interface EssaySubmission {
  id: string;
  scholarUid: string;
  scholarName: string;
  scholarEmail: string;
  scholarPhotoURL?: string;
  targetUniversity: string;
  degreeMajor: string;
  essayType: 'Statement of Purpose (SOP)' | 'Personal Statement' | 'Scholarship Essay' | 'Recommendation Letter Draft' | 'DET/IELTS Practice Essay';
  essayTitle: string;
  essayPrompt: string;
  essayContent: string;
  status: 'Draft' | 'Under Review' | 'Feedback Provided' | 'Approved';
  feedbacks: FeedbackComment[];
  createdAt: any;
}

export interface EssayPeerReviewHubProps {
  user: User | null;
  memberProfile: any | null;
}

export default function EssayPeerReviewHub({ user, memberProfile }: EssayPeerReviewHubProps) {
  return (
    <div className="space-y-6 text-left">
      {/* Top Banner: Coming Soon */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 text-amber-300 rounded-full text-xs font-bold border border-amber-400/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Private Essay Review Pilot — Coming Soon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              Admissions Essay & SOP Review
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              A private peer mentorship program connecting student applicants with experienced scholar mentors for structured feedback on Statement of Purpose (SOP), Common App, and scholarship personal statements.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Draft Submissions Paused</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Submissions and document uploads are temporarily disabled while privacy controls and mentor review protocols are prepared.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Pilot Architecture & Key Pillars */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Private Mentorship Overview
                </h2>
                <p className="text-xs text-slate-500">
                  Structured student-to-student application guidance
                </p>
              </div>
            </div>

            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Pilot Preparation</span>
            </span>
          </div>

          {/* Feature Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: 1-on-1 Blind Review */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                1-on-1 Mentor Pairing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with admitted upper-year students in your intended field for constructive feedback on narrative clarity and tone.
              </p>
            </div>

            {/* Card 2: Rubric-Based Feedback */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Structured Review Rubric
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive standardized evaluations across thesis strength, academic impact, structure flow, and grammatical polish.
              </p>
            </div>

          </div>

          {/* Privacy & Academic Integrity Notice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Privacy & Academic Integrity Notice</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Essay reviews are strictly advisory and student-led. Mentors provide suggestions on clarity and organization; all writing remains the original work of the student applicant. Uploads and drafts will be securely restricted to assigned reviewers.
            </p>
          </div>

        </div>

        {/* Right Col: Pilot Launch Phases */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">
                Pilot Timeline
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Planned development milestones for private essay reviews.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Phase 1: Review Rubrics Defined</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Evaluation guidelines for Common App, SOPs, and scholarship drafts established.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Phase 2: Mentor Training</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Onboarding volunteer student mentors and establishing privacy standards.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Phase 3: Private Pilot Launch</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Invited SVT members submit drafts for confidential 1-on-1 review.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
            Check the SVT Bulletin Board for announcements when mentor applications open.
          </div>

        </div>

      </div>
    </div>
  );
}
