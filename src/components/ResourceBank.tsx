import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Resource, MemberRole } from '../types';
import { 
  BookOpen, Search, Plus, Trash2, ExternalLink, 
  Copy, Check, Sparkles, FileText, Compass, GraduationCap, 
  Link, FileCheck, Share2, ClipboardList, ShieldCheck, Download,
  Eye, X, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CambridgePdfViewerModal from './CambridgePdfViewerModal';

interface ResourceBankProps {
  resources: Resource[];
  user: User | null;
  memberProfile: any | null;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  "Study Aid": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: GraduationCap },
  "Worksheets": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: FileText },
  "Volunteering Guide": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", icon: Compass },
  "Event Template": { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200", icon: ClipboardList },
  "Educational Link": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: Link },
  "Other": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: BookOpen }
};

export default function ResourceBank({ resources, user, memberProfile }: ResourceBankProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  
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

  const userRole: MemberRole = memberProfile?.role || 'member';
  const isCoordinatorOrAdmin = userRole === 'coordinator' || userRole === 'admin';

  const handleCopyLink = (urlStr: string, id: string) => {
    navigator.clipboard.writeText(urlStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadPdf = () => {
    const pdfContent = `CAMBRIDGE ENGLISH: PRELIMINARY (PET) VOCABULARY LIST
Cambridge University Press & Assessment
Level: CEFR B1

Cambridge vocabulary list to help students improve their English vocabulary and prepare for Preliminary examinations.

Source: Cambridge English Preliminary Wordlist
© UCLES Cambridge English Language Assessment`;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'Cambridge_English_Preliminary_Vocabulary_List.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    let finalUrl = url.trim();
    if (/^http:\/\//i.test(finalUrl)) {
      finalUrl = finalUrl.replace(/^http:\/\//i, 'https://');
    } else if (!/^https:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const randomId = doc(collection(db, 'resources')).id;
      await setDoc(doc(db, 'resources', randomId), {
        title: title.trim(),
        description: description.trim(),
        category,
        url: finalUrl,
        creatorId: user.uid,
        creatorName: memberProfile?.displayName || user.displayName || 'Volunteer Member',
        creatorRole: userRole,
        status: isCoordinatorOrAdmin ? 'approved' : 'pending',
        submittedAt: serverTimestamp(),
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
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to publish resource. Please check permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId: string, creatorId: string) => {
    if (!user) return;
    if (user.uid !== creatorId && !isCoordinatorOrAdmin) return;

    try {
      await deleteDoc(doc(db, 'resources', resourceId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `resources/${resourceId}`);
    }
  };

  // Filter resources
  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="resource_bank" className="space-y-6">
      {/* Interactive PDF Reader Modal */}
      <CambridgePdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Intro Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="max-w-2xl text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Repository</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3">
            Academic & Volunteering Resource Bank
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-normal mt-1.5">
            Access Cambridge English vocabulary lists, curriculum test aids, and community learning resources.
          </p>
        </div>

        {user && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Resource</span>
          </button>
        )}
      </div>

      {/* Featured Cambridge Material Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Red PDF Logo Badge */}
            <div 
              onClick={() => setIsPdfModalOpen(true)}
              className="w-16 h-20 sm:w-20 sm:h-24 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-600/30 shrink-0 cursor-pointer border border-rose-400/40 transition-transform group-hover:scale-105"
            >
              <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-[10px] font-black uppercase tracking-widest bg-rose-800 px-2 py-0.5 rounded">PDF</span>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Official Syllabus
                </span>
                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Cambridge Assessment
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CEFR B1 Level • 51 Pages</span>
                </span>
              </div>

              <h3 
                onClick={() => setIsPdfModalOpen(true)}
                className="text-lg sm:text-xl font-bold text-white tracking-tight hover:text-rose-200 cursor-pointer transition-colors"
              >
                Cambridge English Vocabulary List (B1 Preliminary)
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-3xl">
                Cambridge vocabulary list to help students improve their English vocabulary and prepare for Preliminary examinations.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Read Document</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-rose-400" />
              <span>Download Text</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search learning materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {['All', 'Study Aid', 'Worksheets', 'Volunteering Guide', 'Event Template', 'Educational Link', 'Other'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid list */}
      {filteredResources.length === 0 ? (
        <div id="resources_empty" className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">No community resources found</h3>
            <p className="text-xs text-slate-500 mt-1 font-normal leading-relaxed">
              Explore the Cambridge English syllabus above or publish an academic resource for the team.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all border border-indigo-100 flex items-center gap-1.5 mx-auto cursor-pointer"
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
            const canDelete = user && (user.uid === res.creatorId || isCoordinatorOrAdmin);
            
            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between text-left group gap-4 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${CatConfig.bg} ${CatConfig.text} ${CatConfig.border}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{res.category}</span>
                    </span>

                    {canDelete && (
                      <div>
                        {confirmDeleteResourceId === res.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg p-1 shrink-0">
                            <span className="text-[10px] font-bold text-red-700 px-1 select-none">Delete?</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteResource(res.id, res.creatorId);
                                setConfirmDeleteResourceId(null);
                              }}
                              className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer uppercase transition-all"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteResourceId(null)}
                              className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-all"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteResourceId(res.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Delete resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors mt-3 leading-snug">
                    {res.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1.5 line-clamp-3">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer truncate border border-slate-200 hover:border-indigo-600"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Open Resource</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(res.url, res.id)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer shrink-0 border border-slate-200"
                      title="Copy URL"
                    >
                      {copiedId === res.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                        {res.creatorName?.[0] || 'V'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-none">
                          {res.creatorName}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                          {res.creatorRole || 'Member'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Catalog Resource Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 text-left"
            >
              <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Publish Academic Resource
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Share notes, study links, or training guides
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateResource} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Resource['category'])}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-white text-slate-800"
                  >
                    <option value="Study Aid">📖 Study Aid (Notes, Flashcards, Summaries)</option>
                    <option value="Worksheets">📝 Worksheets (Practice Tests, Problem Sets)</option>
                    <option value="Volunteering Guide">🎒 Volunteering Guide (Manuals, Procedures)</option>
                    <option value="Event Template">📅 Event Template (Rosters, Agendas)</option>
                    <option value="Educational Link">🔗 Educational Link (Lectures, Video Resources)</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., IGCSE Physics Formula Guide & Questions"
                    className="w-full text-xs border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Description
                  </label>
                  <textarea
                    required
                    maxLength={300}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide context and how this resource aids student preparation..."
                    className="w-full text-xs border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-normal text-slate-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                    <Link className="w-3.5 h-3.5 text-slate-400" />
                    <span>Resource URL / Cloud Document Link</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full text-xs font-mono border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all flex items-center gap-1.5"
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
