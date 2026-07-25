import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { X, Settings, User, Image, Hash, Check, Compass, Sparkles, Upload, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { convertFileToBase64, isLeaderEmail } from '../utils/leader';

interface MemberProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  linkedinURL?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberProfile: MemberProfile | null;
}

// Preset modern avatar vectors (gorgeous scholar-themed emoji items) for instant setup
const AVATAR_PRESETS = [
  { emoji: "🎒", label: "Backpack Student", color: "bg-indigo-50 border-indigo-200" },
  { emoji: "🎓", label: "Graduate Scholar", color: "bg-emerald-50 border-emerald-200" },
  { emoji: "🍎", label: "Volunteering Teacher", color: "bg-rose-50 border-rose-200" },
  { emoji: "🎨", label: "Creative Artist", color: "bg-amber-50 border-amber-200" },
  { emoji: "🏀", label: "Athletic Team", color: "bg-orange-50 border-orange-200" },
  { emoji: "📚", label: "Library Helper", color: "bg-cyan-50 border-cyan-200" },
  { emoji: "💻", label: "Tech Coordinator", color: "bg-purple-50 border-purple-200" },
  { emoji: "🌱", label: "Eco Gardener", color: "bg-green-50 border-green-200" },
];

export default function SettingsModal({ isOpen, onClose, memberProfile }: SettingsModalProps) {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [role, setRole] = useState('');
  const [linkedinURL, setLinkedinURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state whenever the profile changes or modal opens
  useEffect(() => {
    if (memberProfile) {
      setName(memberProfile.name || '');
      setPhotoURL(memberProfile.photoURL || '');
      setRole(memberProfile.role || 'Volunteer Member');
      setLinkedinURL(memberProfile.linkedinURL || '');
    }
  }, [memberProfile, isOpen]);

  if (!memberProfile) return null;

  const handleLocalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      setPhotoURL(base64);
    } catch (err) {
      console.error("Error reading profile image file:", err);
    }
  };

  const handlePresetSelect = (emoji: string) => {
    // Generate a high-quality stylized avatar URL using dicebear or safe placeholder
    const generatedUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(emoji)}&chars=1&radius=50&backgroundColor=6366f1,3b82f6,10b981`;
    setPhotoURL(generatedUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg({ text: 'Name cannot be empty', type: 'error' });
      return;
    }

    setSaving(true);
    setMsg({ text: '', type: '' });

    try {
      const docRef = doc(db, 'members', memberProfile.uid);
      await updateDoc(docRef, {
        name: name.trim(),
        photoURL: photoURL.trim(),
        role: role.trim() || 'Volunteer Member',
        linkedinURL: linkedinURL.trim()
      });

      setMsg({ text: 'Changes saved successfully!', type: 'success' });
      setTimeout(() => {
        setMsg({ text: '', type: '' });
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMsg({ text: err?.message || 'Failed to update, please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-10 text-left"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/40 via-white to-pink-50/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100/80 rounded-2xl flex items-center justify-center text-indigo-700 shadow-md shadow-indigo-600/10 shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-base text-slate-800 tracking-tight">
                    Personal Account Settings
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">
                    Customize your team volunteer badge
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {msg.text && (
                <div
                  className={`p-3 text-xs rounded-2xl font-bold border ${
                    msg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Live Preview badge card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 py-1 px-3 bg-indigo-50 border-l border-b border-indigo-100 text-indigo-700 text-[8px] font-bold uppercase tracking-widest rounded-bl-xl">
                  Live Badge Preview
                </div>
                
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0 flex items-center justify-center">
                  {photoURL ? (
                    <img src={photoURL} alt="Preview Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {name?.[0] || memberProfile.email[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider">
                    {role || 'Volunteer Member'}
                  </p>
                  <h4 className="font-bold text-sm text-slate-800 tracking-tight truncate leading-snug">
                    {name || 'Your name here'}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {memberProfile.email} (Google Verified)
                  </p>
                </div>
              </div>

              {/* Form Input: Name */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Display Name (appears on posts & signups)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abdullah bin Majid"
                  className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-semibold text-slate-705"
                />
              </div>

              {/* Form Input: Role/Grade/Class */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1 flex-row">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Your Role or Grade tag</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Global Coordinator / Mentor / Scholar"
                  className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-semibold text-slate-705"
                />
              </div>

              {/* Preset Avatar Selection Grid */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Select Avatar Preset Style</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.emoji}
                      onClick={() => handlePresetSelect(preset.emoji)}
                      className={`p-2 rounded-xl text-lg border hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center ${preset.color}`}
                      title={preset.label}
                    >
                      <span>{preset.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input: Avatar Upload or URL */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1 justify-between">
                  <span className="flex items-center gap-1">
                    <Image className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload or Enter Profile Photo</span>
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLocalFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase rounded-lg border border-indigo-200 cursor-pointer transition-all"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from laptop</span>
                  </button>
                </label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="Paste URL or click 'Upload from laptop'"
                  className="w-full text-xs border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-mono"
                />
                <p className="text-[9px] text-[#64748b] font-medium leading-relaxed mt-1">
                  Click 'Upload from laptop' to select a photo directly from your device, or use a web image link.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Saving Badge...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
