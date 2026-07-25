import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, increment, serverTimestamp } from 'firebase/firestore';
import { Post } from '../types';
import { User } from 'firebase/auth';
import { MessageSquare, Plus, Trash2, Heart, Filter, Calendar, Tag, Check, Sparkles } from 'lucide-react';
import { animate, motion, AnimatePresence } from 'motion/react';
import teamLogo from '../assets/images/svt_official_square_avatar_1784958605672.jpg';
import wideIdentityBanner from '../assets/images/svt_exact_identity_banner_final_1784959210089.jpg';
import LeaderImageUploader from './LeaderImageUploader';

interface BoardProps {
  posts: Post[];
  user: User | null;
  memberProfile?: any | null;
  onViewProfile?: (uid: string) => void;
  customWideBanner?: string | null;
  onUpdateWideBanner?: (base64: string) => void;
}

export default function Board({ 
  posts, 
  user, 
  memberProfile, 
  onViewProfile,
  customWideBanner,
  onUpdateWideBanner 
}: BoardProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [postCategory, setPostCategory] = useState<'General' | 'Announcement' | 'Idea' | 'Help Needed'>('General');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const categoriesSet = ['All', 'Announcement', 'Help Needed', 'Idea', 'General'];

  const filteredPosts = posts.filter(post => {
    if (selectedCategoryFilter === 'All') return true;
    return post.category === selectedCategoryFilter;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Announcement':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Help Needed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Idea':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Please sign in first to write a message.");
      return;
    }
    if (!msgText.trim()) {
      setErrorMsg("Message cannot be empty.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const randomId = doc(collection(db, 'posts')).id;
    const postPath = `posts/${randomId}`;

    try {
      await setDoc(doc(db, 'posts', randomId), {
        authorName: memberProfile?.name || user.displayName || user.email?.split('@')[0] || "Volunteer",
        authorUID: user.uid,
        authorPhotoUrl: memberProfile?.photoURL || user.photoURL || '',
        message: msgText,
        category: postCategory,
        createdAt: serverTimestamp(),
        likesCount: 0,
        likes: []
      });

      setMsgText('');
      setPostCategory('General');
      setIsWriteOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to post. Please try again.");
      try {
        handleFirestoreError(err, OperationType.CREATE, postPath);
      } catch (logErr) {
        console.error("UI logged Firestore error:", logErr);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLeader = user?.email?.toLowerCase() === 'sallumceeljale@gmail.com';

  const handleDeletePost = async (postId: string, authorUID: string) => {
    if (!user) return;
    if (user.uid !== authorUID && !isLeader) return;
    const postPath = `posts/${postId}`;

    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, postPath);
    }
  };

  const handleToggleLike = async (post: Post) => {
    if (!user) {
      alert("Please sign in with Google to like posts!");
      return;
    }

    const hasLiked = post.likes.includes(user.uid);
    const postPath = `posts/${post.id}`;

    try {
      await updateDoc(doc(db, 'posts', post.id), {
        likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
        likesCount: increment(hasLiked ? -1 : 1)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, postPath);
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Scholars Volunteer Team Master Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-205 shadow-xs p-4 sm:p-5">
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-inner group">
          <LeaderImageUploader
            currentUserEmail={user?.email}
            currentImageSrc={customWideBanner || wideIdentityBanner}
            altText="Scholars Volunteer Team (SVT) - Connecting Students Across Borders"
            onImageUploaded={(base64) => onUpdateWideBanner?.(base64)}
            typeLabel="Identity Banner"
            className="w-full"
            imgClassName="w-full h-auto max-h-[360px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Official SVT Identity Banner</span>
          </div>
          <a
            href="https://x.com/svt_scholars"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-black/85 hover:bg-black text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md z-20"
            title="Follow @svt_scholars on X"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Follow @svt_scholars</span>
          </a>
        </div>
      </div>

      {/* Filters and Write Control line */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
        {/* Left: Category selections */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex gap-1.5">
            {categoriesSet.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-2xl border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Write Button */}
        <button
          id="btn_open_write"
          onClick={() => {
            if (!user) {
              alert("Please sign in first to write a message on the board!");
              return;
            }
            setIsWriteOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-2xl cursor-pointer transition-all shrink-0 shadow-lg shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>Write Post</span>
        </button>
      </div>

      {/* Main Board Post Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 px-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-705 mt-4">No posts yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedCategoryFilter === 'All'
              ? 'Be the first one of the team to share something with everyone!'
              : `No posts found under "${selectedCategoryFilter}" filter.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const isLikedByMe = user && post.likes.includes(user.uid);
            const isOwner = user && (post.authorUID === user.uid || isLeader);

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col justify-between hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden relative"
              >
                {/* Header info */}
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-700 mt-4 leading-relaxed whitespace-pre-wrap break-words">
                      {post.message}
                    </p>
                  </div>

                  {/* Footer profile & actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 shrink-0">
                    <div 
                      onClick={() => onViewProfile?.(post.authorUID)}
                      className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
                      title="Click to view full scholar profile"
                    >
                      {post.authorPhotoUrl ? (
                        <img
                          src={post.authorPhotoUrl}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                          alt={post.authorName}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center uppercase">
                          {post.authorName[0]}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1 leading-tight hover:text-indigo-650 transition-colors">
                          {post.authorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleLike(post)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isLikedByMe
                            ? 'bg-rose-50 border-rose-100 text-rose-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likesCount}</span>
                      </button>

                      {isOwner && (
                        <div className="flex items-center gap-1.5">
                          {confirmDeleteId === post.id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-xl p-1 animate-none shrink-0">
                              <span className="text-[9px] font-bold text-red-600 px-1 select-none">Delete?</span>
                              <button
                                onClick={() => {
                                  handleDeletePost(post.id, post.authorUID);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-0.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-[9px] font-black cursor-pointer uppercase transition-all"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-[9px] font-bold cursor-pointer transition-all"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(post.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-150"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Write Post Modal Dialog */}
      <AnimatePresence>
        {isWriteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-205 rounded-3xl shadow-xl max-w-lg w-full p-6 relative z-10"
            >
              <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>Write to the Scholars Volunteer Team Board</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Your post will immediately be visible to all global team members in real-time.
              </p>

              <form onSubmit={handleCreatePost} className="mt-5 space-y-4 text-left">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Category Tag
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['General', 'Announcement', 'Idea', 'Help Needed'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPostCategory(cat)}
                        className={`text-xs font-bold py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                          postCategory === cat
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50/50 border-slate-100 text-slate-550 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Message Update
                  </label>
                  <textarea
                    rows={4}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Write details about community opportunities, general feedback, notes, or helpful updates..."
                    className="w-full text-sm border border-slate-200 rounded-2xl p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium"
                    maxLength={10000}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteOpen(false)}
                    className="px-4 py-2 border border-slate-205 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/15"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Publish Update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
