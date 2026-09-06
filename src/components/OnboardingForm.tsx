import React, { useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { uploadProfilePhoto } from '../utils/auth';
import { GOOGLE_FORM_URL, isValidGoogleFormUrl } from '../constants/links';
import { 
  Sparkles, 
  Upload, 
  Check, 
  User as UserIcon, 
  Globe, 
  BookOpen, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  LogOut, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  Tag,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingFormProps {
  user: User;
  onComplete: () => void;
  onSignOut: () => void;
}

const DEFAULT_SKILLS = [
  'Math Tutoring',
  'Physics & Chemistry',
  'Biology',
  'Essay & College Prep',
  'Computer Science & Coding',
  'English & Literature',
  'Arabic & Translation',
  'Event Organization',
  'Graphic Design & Media',
  'Public Speaking',
];

const DEFAULT_INTERESTS = [
  'Peer Tutoring',
  'STEM Workshops',
  'Study Material Creation',
  'Essay Reviews',
  'Live Study Room Moderation',
  'Community Outreach',
  'Mentorship Programs',
];

const AVATAR_PRESETS = [
  { emoji: '🎓', label: 'Scholar Graduate' },
  { emoji: '🎒', label: 'Student Explorer' },
  { emoji: '🔬', label: 'STEM Researcher' },
  { emoji: '📚', label: 'Literature Fellow' },
  { emoji: '💻', label: 'Code Architect' },
  { emoji: '🎨', label: 'Creative Designer' },
  { emoji: '🌱', label: 'Eco Coordinator' },
  { emoji: '⭐', label: 'Team Leader' },
];

export default function OnboardingForm({ user, onComplete, onSignOut }: OnboardingFormProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [headline, setHeadline] = useState('');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>(['Peer Tutoring']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>(['Academic Tutoring', 'Study Material Creation']);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [region, setRegion] = useState('');
  const [directoryVisible, setDirectoryVisible] = useState(true);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoError('');

    try {
      // Upload directly to Firebase Storage (never base64)
      const downloadURL = await uploadProfilePhoto(file, user.uid);
      setPhotoURL(downloadURL);
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setPhotoError(err?.message || 'Failed to upload photo to storage. Please try another image.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectPreset = (emoji: string) => {
    const dicebearUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.uid + emoji)}&backgroundColor=6366f1,3b82f6,10b981`;
    setPhotoURL(dicebearUrl);
    setPhotoError('');
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      if (skills.length < 8) {
        setSkills([...skills, skill]);
      }
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !skills.includes(clean) && skills.length < 8) {
      setSkills([...skills, clean]);
      setNewSkillInput('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      if (interests.length < 6) {
        setInterests([...interests, interest]);
      }
    }
  };

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newInterestInput.trim();
    if (clean && !interests.includes(clean) && interests.length < 6) {
      setInterests([...interests, clean]);
      setNewInterestInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setFormError('Please enter your display name.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const sanitizedName = displayName.trim();
      const sanitizedHeadline = headline.trim();
      const sanitizedPhoto = photoURL.trim() || user.photoURL || '';
      const sanitizedBio = bio.trim();
      const sanitizedRegion = region.trim();
      const isVisible = Boolean(directoryVisible);

      // 1. Private member record in /members/{user.uid}
      // Create new volunteer members with status: "active" so they can immediately participate
      const memberDocRef = doc(db, 'members', user.uid);
      const newMemberPayload = {
        uid: user.uid,
        email: user.email || '',
        displayName: sanitizedName,
        name: sanitizedName,
        photoURL: sanitizedPhoto,
        headline: sanitizedHeadline,
        bio: sanitizedBio,
        skills: skills,
        interests: interests,
        region: sanitizedRegion,
        directoryVisible: isVisible,
        role: 'member',
        status: 'active',
        totalApprovedMinutes: 0,
        hasCrown: false,
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        applicationNotes: 'Registered via Google Onboarding'
      };

      await setDoc(memberDocRef, newMemberPayload);

      // 2. Public profile record in /publicProfiles/{user.uid}
      const publicDocRef = doc(db, 'publicProfiles', user.uid);
      const newPublicPayload = {
        uid: user.uid,
        displayName: sanitizedName,
        name: sanitizedName,
        photoURL: sanitizedPhoto,
        headline: sanitizedHeadline,
        bio: sanitizedBio,
        skills: skills,
        interests: interests,
        region: sanitizedRegion,
        directoryVisible: isVisible,
        role: 'member',
        status: 'active',
        totalApprovedMinutes: 0,
        hasCrown: false,
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(publicDocRef, newPublicPayload);

      onComplete();
    } catch (err: any) {
      console.error('Member creation error:', err);
      handleFirestoreError(err, OperationType.CREATE, `members/${user.uid}`);
      setFormError(err?.message || 'Unable to save your profile. Please check connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Top Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to The Scholars Volunteer Team</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
            Set Up Your Volunteer Profile
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            You are signed in as <span className="text-amber-300 font-semibold">{user.email}</span>. Complete your profile details to submit your volunteer membership application.
          </p>
        </div>

        {/* Main Onboarding Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm"
        >
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Setup Error</p>
                <p className="mt-0.5 text-rose-300/90">{formError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Profile Picture Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                1. Profile Picture <span className="text-slate-500 normal-case font-normal">(Cloud Stored)</span>
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-400/40 shadow-inner flex items-center justify-center shrink-0">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-2xl font-black text-amber-400">
                      {displayName ? displayName[0].toUpperCase() : 'S'}
                    </span>
                  )}

                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      <span className="text-[9px] text-slate-300 font-bold mt-1">Uploading...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden" 
                      id="onboarding-photo-input"
                    />
                    <button
                      type="button"
                      id="btn-upload-photo"
                      disabled={uploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>

                    {user.photoURL && photoURL !== user.photoURL && (
                      <button
                        type="button"
                        onClick={() => setPhotoURL(user.photoURL || '')}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                      >
                        Use Google Photo
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Photos are securely hosted in Firebase Cloud Storage (max 5MB).
                  </p>

                  {photoError && (
                    <p className="text-[11px] text-rose-400 font-medium">{photoError}</p>
                  )}
                </div>
              </div>

              {/* Quick Preset Avatars */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Or choose a scholar avatar preset:</span>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => handleSelectPreset(preset.emoji)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 rounded-xl text-sm transition-all cursor-pointer flex items-center gap-1"
                      title={preset.label}
                    >
                      <span>{preset.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Display Name */}
            <div>
              <label htmlFor="onboarding-display-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Full Display Name <span className="text-rose-400">*</span></span>
              </label>
              <input
                id="onboarding-display-name"
                type="text"
                required
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Salman A. Razak or Fatimah Al-Husseini"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-medium transition-all"
              />
            </div>

            {/* 2b. Public Headline */}
            <div>
              <label htmlFor="onboarding-headline" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Public Headline (Optional)</span>
              </label>
              <input
                id="onboarding-headline"
                type="text"
                maxLength={70}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. High School Senior • Peer Math Tutor"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent font-medium transition-all"
              />
            </div>

            {/* 3. Short Bio */}
            <div>
              <label htmlFor="onboarding-bio" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. Short Bio & Volunteer Mission</span>
                </span>
                <span className="text-[10px] text-slate-500">{bio.length}/300</span>
              </label>
              <textarea
                id="onboarding-bio"
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the team about your academic interests, volunteering experience, and how you want to help other students..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* 4. Skills Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Volunteer Skills ({skills.length}/8)</span>
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {DEFAULT_SKILLS.map((skill) => {
                  const isSelected = skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm' 
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add another skill (e.g. AP Calculus)"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill(e);
                    }
                  }}
                  className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 flex-1"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={!newSkillInput.trim()}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* 5. Interests */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>5. Volunteering Interests ({interests.length}/6)</span>
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {DEFAULT_INTERESTS.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm' 
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {interest} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Add custom interest */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add another area of interest"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest(e);
                    }
                  }}
                  className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 flex-1"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={!newInterestInput.trim()}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* 6. Optional Region */}
            <div>
              <label htmlFor="onboarding-region" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>6. Region / City / School District <span className="text-slate-500 font-normal normal-case">(Optional)</span></span>
              </label>
              <input
                id="onboarding-region"
                type="text"
                maxLength={80}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Muscat, Oman or Eastern Province, KSA"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all font-medium"
              />
            </div>

            {/* 7. Directory Visibility Toggle */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="directory-visibility-toggle"
                checked={directoryVisible}
                onChange={(e) => setDirectoryVisible(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-400 bg-slate-800 border-slate-600 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="directory-visibility-toggle" className="cursor-pointer select-none">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200">
                  {directoryVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  <span>Display profile in the member volunteer directory</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Allow other team members and coordinators to view your skills, bio, and volunteer activities once your membership is approved.
                </p>
              </label>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200/90 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span>New accounts start as <strong className="text-white">pending volunteer members</strong>. Dashboard features (such as logging hours and viewing resources) unlock upon coordinator verification.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                id="btn-onboarding-signout"
                onClick={onSignOut}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cancel & Sign Out</span>
              </button>

              <button
                type="submit"
                id="btn-onboarding-submit"
                disabled={submitting || uploadingPhoto}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Submit Volunteer Profile</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

        {/* External Form Helper if configured */}
        <div className="mt-6 text-center">
          {isValidGoogleFormUrl(GOOGLE_FORM_URL) ? (
            <p className="text-xs text-slate-400">
              Have not filled out the official volunteering application form yet?{' '}
              <a 
                href={GOOGLE_FORM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Complete Google Form</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Submitting your profile above registers your application for coordinator review.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
