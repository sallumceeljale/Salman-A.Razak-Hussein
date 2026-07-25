import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Resource } from '../types';
import { 
  BookOpen, Search, Filter, Plus, Trash2, ExternalLink, 
  Copy, Check, Sparkles, FileText, Compass, GraduationCap, 
  Link, FileCheck, Share2, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResourceBankProps {
  resources: Resource[];
  user: User | null;
  memberProfile: any | null;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  "Study Aid": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-150", icon: GraduationCap },
  "Worksheets": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-150", icon: FileText },
  "Volunteering Guide": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-150", icon: Compass },
  "Event Template": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-150", icon: ClipboardList },
  "Educational Link": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-150", icon: Link },
  "Other": { bg: "bg-slate-50", text: "text-slate-705", border: "border-slate-200", icon: BookOpen }
};

export default function ResourceBank({ resources, user, memberProfile }: ResourceBankProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Resource['category']>('Study Aid');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteResourceId, setConfirmDeleteResourceId] = useState<string | null>(null);

  const handleCopyLink = (urlStr: string, id: string) => {
    navigator.clipboard.writeText(urlStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be signed in to contribute resources.');
      return;
    }
    if (!title.trim() || !description.trim() || !url.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    // Force validation of link structure
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await setDoc(doc(db, 'resources', randomId), {
        title: title.trim(),
        description: description.trim(),
        category,
        url: finalUrl,
        creatorId: user.uid,
        creatorName: memberProfile?.name || user.displayName || user.email?.split('@')[0] || "Volunteer",
        creatorRole: memberProfile?.role || "Volunteer Member",
        createdAt: serverTimestamp()
      });

      setSuccessMsg('Resource cataloged successfully!');
      setTitle('');
      setDescription('');
      setCategory('Study Aid');
      setUrl('');
      
      setTimeout(() => {
        setIsFormOpen(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to publish resource. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLeader = user?.email?.toLowerCase() === 'sallumceeljale@gmail.com';

  const handleDeleteResource = async (resourceId: string, creatorId: string) => {
    if (!user) return;
    if (user.uid !== creatorId && !isLeader) return;

    try {
       await deleteDoc(doc(db, 'resources', resourceId));
    } catch (err) {
       console.error("Failed to delete resource:", err);
       alert('Could not delete resource.');
    }
  };

  // Filter resources
  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="resource_bank" className="space-y-6">
      {/* Intro Tutorial Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-pink-500/5 to-slate-500/0 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100/70 border border-indigo-200/50 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-705">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Team Hub</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-3">
            Academic & Volunteering Resource Bank
          </h2>
          <p className="text-xs text-[#64748b] leading-relaxed font-medium mt-1.5">
            A collaborative virtual library. Volunteers can contribute revision folders, tutoring aids, event guides, educational materials, or study worksheets. Help other scholars, tutors, and learning circles study smarter together.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-705 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-650/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish a Resource</span>
          </button>
        ) : (
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-3 rounded-2xl border border-slate-200">
            Sign in to share your resources!
          </div>
        )}
      </div>

      {/* Filter and Search Bar Row */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources, templates, past sheets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 focus:bg-white transition-all text-slate-700"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {['All', 'Study Aid', 'Worksheets', 'Volunteering Guide', 'Event Template', 'Educational Link', 'Other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white border-slate-200 text-[#64748b] hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid list */}
      {filteredResources.length === 0 ? (
        <div id="resources_empty" className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-200 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">No resources matched your search</h3>
            <p className="text-xs text-[#64748b] mt-1 font-medium leading-relaxed">
              Be the first to upload class materials, event checklists, past tests, or useful educational drives to our volunteer community database!
            </p>
          </div>
          {user && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-705 text-xs font-bold rounded-xl transition-all border border-indigo-100 flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish First Resource</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const CatConfig = CATEGORY_STYLES[res.category] || CATEGORY_STYLES.Other;
            const CatIcon = CatConfig.icon;
            
            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-5 hover:border-slate-350 hover:shadow-md transition-all flex flex-col justify-between text-left group gap-4 relative overflow-hidden"
              >
                <div>
                  {/* Category Badge & Top buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-wider ${CatConfig.bg} ${CatConfig.text} ${CatConfig.border}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{res.category}</span>
                    </span>

                    {/* Deletion of individual post if owner */}
                    {user && (user.uid === res.creatorId || isLeader) && (
                      <div className="flex items-center gap-1">
                        {confirmDeleteResourceId === res.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-lg p-1 animate-none shrink-0">
                            <span className="text-[8px] font-bold text-red-650 px-1 select-none">Sure?</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteResource(res.id, res.creatorId);
                                setConfirmDeleteResourceId(null);
                              }}
                              className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[8px] font-black cursor-pointer uppercase transition-all"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteResourceId(null)}
                              className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[8px] font-bold cursor-pointer transition-all"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteResourceId(res.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title and Body */}
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight mt-3 text-left group-hover:text-indigo-655 transition-colors">
                    {res.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1 text-left line-clamp-3">
                    {res.description}
                  </p>
                </div>

                <div className="space-y-3.5 pt-3.5 border-t border-slate-100">
                  {/* Action row to launch resource link */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-705 text-[11px] font-bold rounded-xl border border-indigo-150 transition-all text-center cursor-pointer"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(res.url, res.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-205 transition-all cursor-pointer"
                    >
                      {copiedId === res.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-black">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Creator credentials */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-750 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                      {res.creatorName?.[0] || 'V'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-700 truncate leading-none">
                        {res.creatorName}
                      </p>
                      <p className="text-[8px] font-bold text-indigo-500 tracking-wider truncate uppercase mt-0.5">
                        {res.creatorRole || 'Volunteer Member'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Creation Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col z-10 text-left"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/40 via-white to-amber-50/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-150 rounded-2xl flex items-center justify-center text-indigo-705 shadow-sm shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-slate-800 tracking-tight">
                      Catalog Volunteer Resource
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">
                      Add worksheets, past guides, links
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateResource} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-705 text-xs font-bold rounded-2xl">
                    {successMsg}
                  </div>
                )}

                {/* Form Field: Category */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Resource['category'])}
                    className="w-full text-xs font-bold border border-slate-200 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 bg-white"
                  >
                    <option value="Study Aid">📖 Study Aid (E-books, Revision Notes, Flashcards)</option>
                    <option value="Worksheets">📝 Worksheets (Classroom Tests, Prep PDF, Math Sheets)</option>
                    <option value="Volunteering Guide">🎒 Volunteering Guide (Manuals, Training Rules)</option>
                    <option value="Event Template">📅 Event Template (Rosters, Planners, Sign-ups Sheets)</option>
                    <option value="Educational Link">🔗 Educational Link (YouTube tutoring, Class Intranet)</option>
                    <option value="Other">✨ Other (Useful material)</option>
                  </select>
                </div>

                {/* Form Field: Title */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 10th Grade Calculus Revision Sheets"
                    className="w-full text-xs border border-slate-205 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 font-semibold"
                  />
                </div>

                {/* Form Field: Description */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    A Brief Description (Explaining how this helps)
                  </label>
                  <textarea
                    required
                    maxLength={250}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide context e.g. 'A curated list of guides, past research, or workshop checklists. Great helper for coordinating community and volunteer events.'"
                    className="w-full text-xs border border-slate-205 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 font-medium"
                  />
                </div>

                {/* Form Field: URL Link */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <Link className="w-3.5 h-3.5" />
                    <span>Resource URL / Cloud Location</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="e.g. drive.google.com/drive/... or any web link"
                    className="w-full text-xs font-mono border border-slate-205 rounded-2xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600"
                  />
                  <span className="text-[9px] text-[#64748b] leading-tight mt-1 block">
                    Ensure this link is accessible for class members (e.g., share Google Drive files as "Anyone with link can view").
                  </span>
                </div>

                {/* Submit Row */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-605 hover:bg-indigo-705 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" />
                        <span>Share Resource</span>
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
