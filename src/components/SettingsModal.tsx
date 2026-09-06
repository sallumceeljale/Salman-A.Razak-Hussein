import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  X, 
  Settings, 
  User, 
  Image, 
  Check, 
  Sparkles, 
  Upload, 
  BookOpen, 
  Globe, 
  Tag, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  Lock,
  Award,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadProfilePhoto } from '../utils/auth';
import { Member } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberProfile: Member | null;
}

const DEFAULT_AVAILABLE_SKILLS = [
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

const DEFAULT_AVAILABLE_INTERESTS = [
  'Peer Tutoring',
  'STEM Workshops',
  'Study Material Creation',
  'Essay Reviews',
  'Live Study Room Moderation',
  'Community Outreach',
  'Mentorship Programs',
];

const AVATAR_PRESETS = [
  { emoji: '🎒', label: 'Student', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { emoji: '🎓', label: 'Scholar', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { emoji: '🍎', label: 'Teacher', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { emoji: '🎨', label: 'Artist', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { emoji: '📚', label: 'Library', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  { emoji: '💻', label: 'Tech', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { emoji: '🌱', label: 'Eco', color: 'bg-green-50 border-green-200 text-green-700' },
  { emoji: '⭐', label: 'Honor', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
];

export default function SettingsModal({ isOpen, onClose, memberProfile }: SettingsModalProps) {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [region, setRegion] = useState('');
  const [directoryVisible, setDirectoryVisible] = useState(true);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever the profile changes or modal opens
  useEffect(() => {
    if (memberProfile) {
      setName(memberProfile.displayName || memberProfile.name || '');
      setHeadline(memberProfile.headline || '');
      setPhotoURL(memberProfile.photoURL || '');
      setBio(memberProfile.bio || '');
      setSkills(Array.isArray(memberProfile.skills) ? memberProfile.skills : []);
      setInterests(Array.isArray(memberProfile.interests) ? memberProfile.interests : []);
      setRegion(memberProfile.region || '');
      setDirectoryVisible(memberProfile.directoryVisible !== false);
      setMsg({ text: '', type: '' });
      setPhotoError('');
    }
  }, [memberProfile, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Unauthenticated or permission-denied state
  if (!auth.currentUser || !memberProfile) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 text-center z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Sign-in Required</h3>
            <p className="text-xs text-slate-500 mt-1">
              You must be logged in to view and edit profile settings.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </AnimatePresence>
    );
  }

  const handleLocalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation
    if (!file.type.startsWith('image/')) {
      setPhotoError('Invalid file type. Please choose a JPEG, PNG, or WebP picture.');
      return;
    }

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE_BYTES) {
      setPhotoError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setUploadingPhoto(true);
    setPhotoError('');

    try {
      // Upload to Firebase Storage and retrieve HTTPS download URL (NO Base64 in Firestore)
      const downloadURL = await uploadProfilePhoto(file, memberProfile.uid);
      setPhotoURL(downloadURL);
      setMsg({ text: 'Profile picture uploaded to cloud storage successfully.', type: 'success' });
    } catch (err: any) {
      console.error('Error uploading profile image:', err);
      setPhotoError(err?.message || 'Failed to upload image to Firebase Storage.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePresetSelect = (emoji: string) => {
    const generatedUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(memberProfile.uid + emoji)}&backgroundColor=6366f1,3b82f6,10b981`;
    setPhotoURL(generatedUrl);
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else if (skills.length < 8) {
      setSkills([...skills, skill]);
    }
  };

  const addCustomSkill = () => {
    const clean = newSkill.trim();
    if (clean && !skills.includes(clean) && skills.length < 8) {
      setSkills([...skills, clean]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 6) {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    const clean = newInterest.trim();
    if (clean && !interests.includes(clean) && interests.length < 6) {
      setInterests([...interests, clean]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg({ text: 'Display Name cannot be empty.', type: 'error' });
      return;
    }

    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
      const sanitizedName = name.trim();
      const sanitizedHeadline = headline.trim();
      const sanitizedPhotoURL = photoURL.trim();
      const sanitizedBio = bio.trim();
      const sanitizedRegion = region.trim();
      const isVisible = Boolean(directoryVisible);

      // 1. Update private member document: /members/{uid}
      // Members are forbidden from editing role, status, totalApprovedMinutes, or hasCrown.
      const memberDocRef = doc(db, 'members', memberProfile.uid);
      await updateDoc(memberDocRef, {
        displayName: sanitizedName,
        name: sanitizedName,
        photoURL: sanitizedPhotoURL,
        headline: sanitizedHeadline,
        bio: sanitizedBio,
        skills: skills,
        interests: interests,
        region: sanitizedRegion,
        directoryVisible: isVisible,
        updatedAt: serverTimestamp(),
      });

      // 2. Synchronize to public profile document: /publicProfiles/{uid}
      // Keeps public directory data isolated from private emails and admin fields
      const publicDocRef = doc(db, 'publicProfiles', memberProfile.uid);
      await setDoc(publicDocRef, {
        uid: memberProfile.uid,
        displayName: sanitizedName,
        name: sanitizedName,
        photoURL: sanitizedPhotoURL,
        headline: sanitizedHeadline,
        bio: sanitizedBio,
        skills: skills,
        interests: interests,
        region: sanitizedRegion,
        directoryVisible: isVisible,
        status: memberProfile.status || 'active',
        role: memberProfile.role || 'member',
        hasCrown: !!memberProfile.hasCrown,
        customBadge: memberProfile.customBadge || '',
        totalApprovedMinutes: memberProfile.totalApprovedMinutes || 0,
        joinedAt: memberProfile.joinedAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setMsg({ text: '✓ Profile changes saved and synced successfully!', type: 'success' });
      setTimeout(() => {
        setMsg({ text: '', type: '' });
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setMsg({ text: err?.message || 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const totalHours = Math.round(((memberProfile.totalApprovedMinutes || 0) / 60) * 10) / 10;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-10 text-left my-auto"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 via-white to-amber-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 shadow-md shadow-indigo-600/10 shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sans font-bold text-base text-slate-800 tracking-tight">
                  Profile & Privacy Settings
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Manage your public volunteer presence and directory visibility
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto max-h-[72vh]">
            {/* Feedback Notifications */}
            {msg.text && (
              <div
                className={`p-3.5 text-xs rounded-2xl font-bold border flex items-center gap-2 ${
                  msg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {msg.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{msg.text}</span>
              </div>
            )}

            {/* Read-Only Verified Administrative Status Card */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Verified Member Credentials</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>Protected Fields</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Role</span>
                  <span className="text-xs font-bold text-slate-800 capitalize flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3 h-3 text-indigo-500" />
                    {memberProfile.role || 'Member'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Status</span>
                  <span className="text-xs font-bold text-emerald-600 capitalize flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {memberProfile.status || 'Active'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Hours</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {totalHours} hrs
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Account</span>
                  <span className="text-xs font-bold text-slate-700 truncate block mt-0.5" title={memberProfile.email}>
                    {memberProfile.email.split('@')[0]}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                * Role status, verified hours, and leadership honors are maintained by team coordinators.
              </p>
            </div>

            {/* Profile Picture (Firebase Storage URL upload & validation) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-indigo-600" />
                  <span>Profile Picture</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Cloud Storage Only (Max 5MB)</span>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0 flex items-center justify-center">
                  {photoURL ? (
                    <img 
                      src={photoURL} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                      {name?.[0] || 'V'}
                    </div>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLocalFileUpload}
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingPhoto ? 'Uploading to Storage...' : 'Upload Image'}</span>
                    </button>
                    {photoURL && (
                      <button
                        type="button"
                        onClick={() => setPhotoURL('')}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Supports PNG, JPG, or WebP. Stored securely on Firebase Cloud Storage.
                  </p>
                </div>
              </div>
              {photoError && (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{photoError}</span>
                </p>
              )}

              {/* Avatar Presets */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or pick a scholar avatar:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.emoji}
                      onClick={() => handlePresetSelect(preset.emoji)}
                      className={`p-2 rounded-xl text-lg border hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center ${preset.color}`}
                      title={preset.label}
                    >
                      <span>{preset.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Display Name & Public Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Display Name *</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Salman A. Razak"
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Public Headline</span>
                </label>
                <input
                  type="text"
                  maxLength={70}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Grade 11 • Peer Math Tutor"
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Short Bio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Short Bio</span>
                </label>
                <span className="text-[10px] text-slate-400">{bio.length}/300</span>
              </div>
              <textarea
                rows={2}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your volunteering interests, study goals, or areas where you love helping peers..."
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all leading-relaxed text-slate-800"
              />
            </div>

            {/* Skills & Peer Specializations */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Skills & Subjects ({skills.length}/8)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Click to toggle</span>
              </label>

              {/* Selected skills tag chips */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5 p-2 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white text-[11px] font-bold rounded-lg shadow-xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rose-200 cursor-pointer"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {DEFAULT_AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {skill} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={30}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                  placeholder="Add custom skill or subject..."
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={!newSkill.trim() || skills.length >= 8}
                  className="px-3.5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Volunteering Interests */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Volunteering Interests ({interests.length}/6)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Select areas of interest</span>
              </label>

              {interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5 p-2 bg-amber-50/50 border border-amber-100 rounded-xl">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 text-white text-[11px] font-bold rounded-lg shadow-xs"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-amber-200 cursor-pointer"
                        aria-label={`Remove ${interest}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mb-2">
                {DEFAULT_AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-amber-100 text-amber-800 border-amber-300' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {interest} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={30}
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomInterest(); } }}
                  placeholder="Add custom interest..."
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={!newInterest.trim() || interests.length >= 6}
                  className="px-3.5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 disabled:opacity-40 cursor-pointer transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Optional Region */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chapter / Optional Region</span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Muscat Chapter, Oman / Global Online"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-slate-800"
              />
            </div>

            {/* Directory Visibility Toggle Switch */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="settings-directory-visibility"
                checked={directoryVisible}
                onChange={(e) => setDirectoryVisible(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="settings-directory-visibility" className="cursor-pointer select-none flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  {directoryVisible ? (
                    <>
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>Visible in Volunteer Directory</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-slate-400" />
                      <span>Hidden from Volunteer Directory</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  When enabled, active scholars can view your public badge, skills, and volunteering achievements. Your email and private hours logs are always kept private.
                </p>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingPhoto}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
