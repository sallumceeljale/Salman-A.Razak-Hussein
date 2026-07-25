import React, { useState } from 'react';
import { X, Search, Users, Award, Shield, Crown, Edit3, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import LeaderImageUploader from './LeaderImageUploader';
import { isLeaderEmail } from '../utils/leader';

interface MemberData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  hasCrown?: boolean;
  customBadge?: string;
}

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberData[];
  onViewProfile?: (uid: string) => void;
  onUpdateMemberPhoto?: (uid: string, base64: string) => void;
}

export default function MembersModal({ isOpen, onClose, members, onViewProfile, onUpdateMemberPhoto }: MembersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editBadgeText, setEditBadgeText] = useState('');

  const isLeader = isLeaderEmail(auth.currentUser?.email);

  // Sorter / Filter to find members by name or email
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCrown = async (memberUid: string, currentCrown: boolean) => {
    try {
      const memberRef = doc(db, 'members', memberUid);
      await updateDoc(memberRef, {
        hasCrown: !currentCrown
      });
    } catch (err) {
      console.error("Error setting crown:", err);
    }
  };

  const handleSaveMemberChanges = async (memberUid: string) => {
    try {
      if (!editName.trim()) return;
      const memberRef = doc(db, 'members', memberUid);
      await updateDoc(memberRef, {
        name: editName.trim(),
        photoURL: editPhotoURL.trim(),
        customBadge: editBadgeText.trim()
      });
      setEditingUid(null);
    } catch (err) {
      console.error("Error saving custom member changes:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
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
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
            {/* Header with decorative details */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-indigo-50/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100/80 rounded-2xl flex items-center justify-center text-emerald-700 shadow-md shadow-emerald-600/10 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-sans font-bold text-lg text-slate-800 tracking-tight">
                    Volunteer Team Roster
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">
                    {members.length} Registered Volunteers
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sticky Search bar filter */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search volunteer by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            {/* List Body with Custom Styling */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredMembers.map((member, idx) => {
                    const seedHex = encodeURIComponent(member.uid || idx);
                    const defaultAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seedHex}`;
                    const nameParts = member.name.split(' (');
                    const primaryName = nameParts[0];
                    const englishTag = nameParts[1] ? nameParts[1].replace(')', '') : '';
                    const isEditingThis = editingUid === member.uid;

                    return (
                      <div
                        key={member.uid || idx}
                        className="p-3 bg-slate-50 hover:bg-indigo-50/20 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all duration-150 flex flex-col gap-2 relative overflow-hidden text-left"
                      >
                        <div className="flex items-center gap-3 w-full">
                          {/* Custom Modern Avatar with overlapping crown */}
                          <div className="relative shrink-0 select-none">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
                              <LeaderImageUploader
                                currentUserEmail={auth.currentUser?.email}
                                currentImageSrc={member.photoURL || defaultAvatar}
                                altText={member.name}
                                onImageUploaded={(base64) => onUpdateMemberPhoto?.(member.uid, base64)}
                                typeLabel="Photo"
                                className="w-full h-full"
                                imgClassName="w-full h-full object-cover"
                              />
                            </div>
                            {member.hasCrown && (
                              <div className="absolute -top-1.5 -right-1 text-sm filter drop-shadow animate-pulse pointer-events-none" title="Crowned Member">
                                👑
                              </div>
                            )}
                          </div>

                          <div 
                            onClick={() => onViewProfile?.(member.uid)}
                            className="min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                            title="Click to view scholar profile"
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                              <span className="font-bold text-xs text-slate-800 truncate" title={member.name}>
                                {primaryName}
                              </span>
                              {member.hasCrown && (
                                <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[6.5px] font-black uppercase px-1 rounded tracking-wide leading-none py-0.5">
                                  👑 CROWNED
                                </span>
                              )}
                            </div>
                            
                            <p className="text-[10px] text-slate-500 truncate leading-snug">
                              {member.email === 'sallumceeljale@gmail.com' ? 'Project Founder & Leader' : (englishTag ? `(${englishTag})` : 'Active Member')}
                            </p>

                            {member.customBadge && !isEditingThis && (
                              <div className="mt-1">
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded leading-none shrink-0 font-sans">
                                  🏆 {member.customBadge}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Leader Control Box */}
                          {isLeader && (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleToggleCrown(member.uid, !!member.hasCrown)}
                                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                                  member.hasCrown 
                                    ? 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200 hover:scale-105' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:scale-105'
                                }`}
                                title={member.hasCrown ? "Revoke Crown" : "Gift Golden Crown!"}
                              >
                                <Crown className="w-3.5 h-3.5" />
                              </button>

                              {!isEditingThis && (
                                <button
                                  onClick={() => {
                                    setEditingUid(member.uid);
                                    setEditName(member.name);
                                    setEditPhotoURL(member.photoURL || '');
                                    setEditBadgeText(member.customBadge || '');
                                  }}
                                  className="p-1.5 rounded-xl border bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-250 hover:scale-105 transition-all cursor-pointer"
                                  title="Edit member credentials"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Inline custom details editor */}
                        {isEditingThis && (
                          <div className="pt-2 border-t border-slate-100/80 w-full space-y-2 mt-1">
                            <p className="text-[9px] font-black uppercase tracking-wider text-indigo-700 font-sans">Leader Administrative Controls</p>
                            
                            <div className="space-y-1 text-left">
                              <label className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Display Name</label>
                              <input
                                type="text"
                                placeholder="Edit display name..."
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full text-[10px] font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Avatar URL / Logo Link</label>
                              <input
                                type="text"
                                placeholder="Paste image/avatar URL..."
                                value={editPhotoURL}
                                onChange={(e) => setEditPhotoURL(e.target.value)}
                                className="w-full text-[10px] font-mono px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 text-ellipsis shrink-0"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Custom Badge / Role Identifier</label>
                              <input
                                type="text"
                                placeholder="e.g. Lead Scholar, Web Designer, Mentor"
                                value={editBadgeText}
                                onChange={(e) => setEditBadgeText(e.target.value)}
                                className="w-full text-[10px] font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 pt-1.5 justify-end">
                              <button
                                onClick={() => handleSaveMemberChanges(member.uid)}
                                className="px-2.5 py-1 text-[9px] font-black uppercase text-white bg-emerald-600 hover:bg-emerald-750 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                title="Commit Changes"
                              >
                                <Check className="w-3 h-3" />
                                <span>Save</span>
                              </button>
                              <button
                                onClick={() => setEditingUid(null)}
                                className="px-2.5 py-1 text-[9px] font-black uppercase text-slate-605 bg-slate-200 hover:bg-slate-300 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">No volunteers found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different term</p>
                </div>
              )}
            </div>

            {/* Footer with helpful hint */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-left">
              <p className="text-[10px] text-slate-400 font-medium leading-normal flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>All registered committee members are verified and authenticated securely under the Scholars platform.</span>
              </p>
              <button
                onClick={onClose}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0 cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
