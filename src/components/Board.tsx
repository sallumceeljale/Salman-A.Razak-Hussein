import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, doc, setDoc, deleteDoc, updateDoc, 
  increment, serverTimestamp, getDoc, onSnapshot 
} from 'firebase/firestore';
import { Post, MemberRole } from '../types';
import { User } from 'firebase/auth';
import { MessageSquare, Plus, Trash2, Heart, Filter, Check, Sparkles, Edit3, X, Megaphone, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import wideIdentityBanner from '../assets/images/svt_exact_identity_banner_final_1784959210089.jpg';
import EditablePublicAssetImage from './EditablePublicAssetImage';
import { getHighResPhotoUrl } from '../utils/leader';

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
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [msgText, setMsgText] = useState('');
  const [postCategory, setPostCategory] = useState<'General' | 'Announcement' | 'Idea' | 'Help Needed'>('General');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [myLikedPostIds, setMyLikedPostIds] = useState<Set<string>>(new Set());

  const userRole: MemberRole = memberProfile?.role || 'member';
  const isCoordinatorOrAdmin = userRole === 'coordinator' || userRole === 'admin';

  // Listen to current user's likes across posts
  useEffect(() => {
    if (!user) {
      setMyLikedPostIds(new Set());
      return;
    }

    const unsubs: Array<() => void> = [];
    const likedSet = new Set<string>();

    posts.forEach((post) => {
      const likeDocRef = doc(db, 'posts', post.id, 'likes', user.uid);
      const unsub = onSnapshot(likeDocRef, (snap) => {
        if (snap.exists()) {
          setMyLikedPostIds(prev => new Set(prev).add(post.id));
        } else {
          setMyLikedPostIds(prev => {
            const next = new Set(prev);
            next.delete(post.id);
            return next;
          });
        }
      }, (err) => {
        // Non-blocking like listener warning
      });
      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [user, posts]);

  const categoriesSet = ['All', 'Announcement', 'Help Needed', 'Idea', 'General'];

  const filteredPosts = posts.filter(post => {
    if (selectedCategoryFilter === 'All') return true;
    return post.category === selectedCategoryFilter;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Announcement':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Help Needed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Idea':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleOpenWrite = (postToEdit?: Post) => {
    if (postToEdit) {
      setEditingPost(postToEdit);
      setMsgText(postToEdit.message);
      setPostCategory(postToEdit.category);
    } else {
      setEditingPost(null);
      setMsgText('');
      setPostCategory('General');
    }
    setErrorMsg('');
    setIsWriteOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Please sign in first to participate on the board.");
      return;
    }
    if (!msgText.trim()) {
      setErrorMsg("Post message cannot be empty.");
      return;
    }

    if (postCategory === 'Announcement' && !isCoordinatorOrAdmin) {
      setErrorMsg("Only team coordinators and administrators can publish official announcements.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingPost) {
        // Editing existing post
        const postRef = doc(db, 'posts', editingPost.id);
        await updateDoc(postRef, {
          message: msgText.trim(),
          category: postCategory,
        });
      } else {
        // Creating new post
        const randomId = doc(collection(db, 'posts')).id;
        await setDoc(doc(db, 'posts', randomId), {
          authorName: memberProfile?.displayName || user.displayName || 'Volunteer Member',
          authorUID: user.uid,
          authorPhotoUrl: memberProfile?.photoURL || user.photoURL || '',
          authorRole: userRole,
          message: msgText.trim(),
          category: postCategory,
          createdAt: serverTimestamp(),
          likesCount: 0,
          isAnnouncement: postCategory === 'Announcement'
        });
      }

      setMsgText('');
      setIsWriteOpen(false);
      setEditingPost(null);
    } catch (err: any) {
      console.error("Error saving post:", err);
      setErrorMsg(err?.message || "Failed to publish post. Please check permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string, authorUID: string) => {
    if (!user) return;
    if (user.uid !== authorUID && !isCoordinatorOrAdmin) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `posts/${postId}`);
    }
  };

  const handleToggleLike = async (post: Post) => {
    if (!user) {
      setErrorMsg("Please sign in to react to posts.");
      return;
    }

    const likeDocRef = doc(db, 'posts', post.id, 'likes', user.uid);
    const postDocRef = doc(db, 'posts', post.id);
    const currentlyLiked = myLikedPostIds.has(post.id);

    try {
      if (currentlyLiked) {
        await deleteDoc(likeDocRef);
        await updateDoc(postDocRef, {
          likesCount: increment(-1)
        });
      } else {
        await setDoc(likeDocRef, {
          uid: user.uid,
          createdAt: serverTimestamp()
        });
        await updateDoc(postDocRef, {
          likesCount: increment(1)
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `posts/${post.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* SVT Master Identity Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
          <EditablePublicAssetImage
            assetKey="team-banner"
            fallbackSrc={customWideBanner || wideIdentityBanner}
            fallbackAlt="Scholars Volunteer Team (SVT) - Connecting Students Across Borders"
            label="Community Bulletin Banner"
            className="w-full"
            imgClassName="w-full h-auto max-h-[360px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SVT Community Bulletin</span>
          </div>
          <a
            href="https://x.com/svt_scholars"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-black/85 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md z-20"
            title="Follow @svt_scholars on X"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>@svt_scholars</span>
          </a>
        </div>
      </div>

      {/* Filters and Write Control line */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
        {/* Left: Category selections */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex gap-1.5">
            {categoriesSet.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategoryFilter === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
          onClick={() => handleOpenWrite()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-2xl cursor-pointer transition-all shrink-0 shadow-md shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Main Board Post Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mt-4">No bulletin posts found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {selectedCategoryFilter === 'All'
              ? 'Share academic initiatives, coordination thoughts, or community updates with the team.'
              : `No posts currently matching the "${selectedCategoryFilter}" category filter.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const isLikedByMe = myLikedPostIds.has(post.id);
            const isOwner = user && post.authorUID === user.uid;
            const canManage = isOwner || isCoordinatorOrAdmin;

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden relative"
              >
                {/* Header info */}
                <div className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-lg border ${getCategoryColor(post.category)}`}>
                        {post.category === 'Announcement' ? '📢 Announcement' : post.category}
                      </span>
                      {post.authorRole && post.authorRole !== 'member' && (
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          {post.authorRole}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-normal text-slate-800 mt-4 leading-relaxed whitespace-pre-wrap break-words">
                      {post.message}
                    </p>
                  </div>

                  {/* Footer profile & actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 shrink-0">
                    <div 
                      onClick={() => onViewProfile?.(post.authorUID)}
                      className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
                      title="View Member Profile"
                    >
                      {post.authorPhotoUrl ? (
                        <img
                          src={getHighResPhotoUrl(post.authorPhotoUrl)}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                          alt={post.authorName}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase border border-indigo-100">
                          {post.authorName?.[0] || 'V'}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight hover:text-indigo-600 transition-colors">
                          {post.authorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleLike(post)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isLikedByMe
                            ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                        title="React to this post"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{Math.max(0, post.likesCount || 0)}</span>
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => handleOpenWrite(post)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-indigo-100"
                          title="Edit post"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canManage && (
                        <div className="flex items-center">
                          {confirmDeleteId === post.id ? (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl p-1 shrink-0">
                              <span className="text-[11px] font-bold text-red-700 px-1 select-none">Delete?</span>
                              <button
                                onClick={() => {
                                  handleDeletePost(post.id, post.authorUID);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer uppercase transition-all"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-all"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(post.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
                              title="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* Write/Edit Post Dialog */}
      <AnimatePresence>
        {isWriteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 relative z-10 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>{editingPost ? 'Edit Bulletin Post' : 'Create Bulletin Post'}</span>
                </h2>
                <button
                  onClick={() => setIsWriteOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePost} className="mt-4 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Category Tag
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['General', 'Announcement', 'Idea', 'Help Needed'] as const).map((cat) => {
                      const isAnnouncement = cat === 'Announcement';
                      const isForbiddenAnnouncement = isAnnouncement && !isCoordinatorOrAdmin;

                      return (
                        <button
                          key={cat}
                          type="button"
                          disabled={isForbiddenAnnouncement}
                          onClick={() => setPostCategory(cat)}
                          className={`text-xs font-bold py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isForbiddenAnnouncement
                              ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : postCategory === cat
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          title={isForbiddenAnnouncement ? "Only Coordinators & Admins can post official announcements" : cat}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {!isCoordinatorOrAdmin && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Note: "Announcement" tag requires Coordinator or Administrator role.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Message Content
                  </label>
                  <textarea
                    rows={4}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Share volunteering updates, academic resources, or community coordination notes..."
                    className="w-full text-sm border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none font-normal text-slate-800"
                    maxLength={10000}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsWriteOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
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
