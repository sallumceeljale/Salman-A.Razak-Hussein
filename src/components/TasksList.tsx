import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, doc, setDoc, deleteDoc, updateDoc, 
  serverTimestamp, query, orderBy, onSnapshot, getDoc, getDocs,
  writeBatch, Timestamp 
} from 'firebase/firestore';
import { Activity, ActivityDeliveryMode, ActivityStatus, MemberRole, Member } from '../types';
import { User } from 'firebase/auth';
import { 
  Calendar, MapPin, Clock, Users, Plus, Trash2, CheckCircle2, 
  AlertCircle, Sparkles, UserCheck, Video, Globe, X, Edit3, 
  Link as LinkIcon, Check, Eye, ChevronRight, ShieldAlert,
  Search, RefreshCw, UserMinus, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TasksListProps {
  tasks: Activity[];
  user: User | null;
  memberProfile?: Member | null;
}

const TIME_ZONE_OPTIONS = [
  'GMT+4 (GST / Oman & UAE)',
  'GMT+3 (AST / Arabia Standard Time)',
  'GMT+2 (EET / Eastern European Time)',
  'GMT+0 (UTC / Greenwich Mean Time)',
  'GMT+1 (BST / British Summer Time)',
  'GMT-5 (EST / US Eastern Time)',
  'GMT-8 (PST / US Pacific Time)',
  'GMT+5:30 (IST / India Standard Time)',
  'GMT+8 (SGT / Singapore Time)',
];

// Helper: Convert Firestore Timestamp or Date or string to a valid Date object
export function toJsDate(val: any): Date | null {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) return val;
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Helper: Convert Date to HTML datetime-local input string YYYY-MM-DDTHH:mm
export function toDatetimeLocalString(date: Date | null): string {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Helper: Format schedule for human readable display
export function formatSchedule(val: any): string {
  const d = toJsDate(val);
  if (!d) return 'TBD';
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function TasksList({ tasks, user, memberProfile }: TasksListProps) {
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'in-person' | 'my-signups' | 'drafts'>('all');
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewingRosterActivity, setViewingRosterActivity] = useState<Activity | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formMeetingLink, setFormMeetingLink] = useState('');
  const [formStartsAt, setFormStartsAt] = useState('');
  const [formEndsAt, setFormEndsAt] = useState('');
  const [formTimeZone, setFormTimeZone] = useState('GMT+4 (GST / Oman & UAE)');
  const [formDeliveryMode, setFormDeliveryMode] = useState<ActivityDeliveryMode>('in-person');
  const [formCapacity, setFormCapacity] = useState<number>(5);
  const [formStatus, setFormStatus] = useState<ActivityStatus>('published');
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // User's own registered activity IDs for quick filtering
  const [mySignedUpActivityIds, setMySignedUpActivityIds] = useState<Set<string>>(new Set());

  const userRole: MemberRole = memberProfile?.role || 'member';
  const isCoordinatorOrAdmin = userRole === 'coordinator' || userRole === 'admin';

  // Listen to user's personal signups across activities
  useEffect(() => {
    if (!user || tasks.length === 0) {
      setMySignedUpActivityIds(new Set());
      return;
    }

    const unsubs: Array<() => void> = [];
    tasks.forEach((act) => {
      const signupRef = doc(db, 'activities', act.id, 'signups', user.uid);
      const unsub = onSnapshot(signupRef, (snap) => {
        setMySignedUpActivityIds((prev) => {
          const next = new Set(prev);
          if (snap.exists()) {
            next.add(act.id);
          } else {
            next.delete(act.id);
          }
          return next;
        });
      }, () => {
        // Ignored non-blocking
      });
      unsubs.push(unsub);
    });

    return () => {
      unsubs.forEach(u => u());
    };
  }, [tasks, user]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const now = new Date();
    const defaultStart = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    defaultStart.setMinutes(0, 0, 0);
    const defaultEnd = new Date(defaultStart.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    setFormTitle('');
    setFormDescription('');
    setFormLocation('');
    setFormMeetingLink('');
    setFormStartsAt(toDatetimeLocalString(defaultStart));
    setFormEndsAt(toDatetimeLocalString(defaultEnd));
    setFormTimeZone('GMT+4 (GST / Oman & UAE)');
    setFormDeliveryMode('in-person');
    setFormCapacity(5);
    setFormStatus('published');
    setFormError('');
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormTitle(activity.title || '');
    setFormDescription(activity.description || '');
    setFormLocation(activity.location || '');
    setFormMeetingLink(activity.meetingLink || '');
    setFormStartsAt(toDatetimeLocalString(toJsDate(activity.startsAt)));
    setFormEndsAt(toDatetimeLocalString(toJsDate(activity.endsAt)));
    setFormTimeZone(activity.timeZone || 'GMT+4 (GST / Oman & UAE)');
    setFormDeliveryMode(activity.deliveryMode || 'in-person');
    setFormCapacity(activity.capacity || 5);
    setFormStatus(activity.status || 'published');
    setFormError('');
  };

  // Submit Create or Edit Activity
  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!isCoordinatorOrAdmin) {
      setFormError("Only Coordinators and Administrators may manage volunteer activities.");
      return;
    }

    if (!formTitle.trim()) {
      setFormError("Activity title is required.");
      return;
    }
    if (!formDescription.trim()) {
      setFormError("Activity description is required.");
      return;
    }
    if (!formStartsAt || !formEndsAt) {
      setFormError("Please provide both start and end dates/times.");
      return;
    }

    const startDate = new Date(formStartsAt);
    const endDate = new Date(formEndsAt);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setFormError("Please enter valid start and end dates.");
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setFormError("End time must be after the start time.");
      return;
    }

    if (formDeliveryMode === 'online' && !formMeetingLink.trim() && !formLocation.trim()) {
      setFormError("Please provide a virtual meeting link or platform details.");
      return;
    }
    if (formDeliveryMode === 'in-person' && !formLocation.trim()) {
      setFormError("Please specify the physical location or venue.");
      return;
    }
    if (formCapacity < 1) {
      setFormError("Total volunteer capacity must be at least 1.");
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const sanitizedLocation = formLocation.trim() || (formDeliveryMode === 'online' ? 'Online / Virtual' : 'TBD');
      const sanitizedMeetingLink = formMeetingLink.trim();
      const cap = Math.max(1, Number(formCapacity));

      // Firestore Timestamp objects for start and end times
      const startsAtTimestamp = Timestamp.fromDate(startDate);
      const endsAtTimestamp = Timestamp.fromDate(endDate);

      if (editingActivity) {
        // Edit existing activity
        const actRef = doc(db, 'activities', editingActivity.id);
        const currentFilled = editingActivity.filledSpots || 0;
        
        let finalStatus = formStatus;
        if (formStatus === 'published' && currentFilled >= cap) {
          finalStatus = 'full';
        } else if (formStatus === 'full' && currentFilled < cap) {
          finalStatus = 'published';
        }

        await updateDoc(actRef, {
          title: formTitle.trim(),
          description: formDescription.trim(),
          location: sanitizedLocation,
          meetingLink: sanitizedMeetingLink,
          startsAt: startsAtTimestamp,
          endsAt: endsAtTimestamp,
          timeZone: formTimeZone,
          deliveryMode: formDeliveryMode,
          capacity: cap,
          status: finalStatus,
          updatedAt: serverTimestamp()
        });

        setActionSuccess('Activity updated successfully.');
        setEditingActivity(null);
      } else {
        // Create new activity
        const newDocId = doc(collection(db, 'activities')).id;
        await setDoc(doc(db, 'activities', newDocId), {
          title: formTitle.trim(),
          description: formDescription.trim(),
          location: sanitizedLocation,
          meetingLink: sanitizedMeetingLink,
          startsAt: startsAtTimestamp,
          endsAt: endsAtTimestamp,
          timeZone: formTimeZone,
          deliveryMode: formDeliveryMode,
          capacity: cap,
          filledSpots: 0,
          status: formStatus,
          creatorId: user.uid,
          creatorName: memberProfile?.displayName || user.displayName || 'Coordinator',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        setActionSuccess('Volunteer activity published successfully.');
        setIsCreateOpen(false);
      }

      setTimeout(() => setActionSuccess(''), 3500);
    } catch (err: any) {
      console.error('Activity save error:', err);
      setFormError(err?.message || "Failed to save activity. Please check administrative permissions.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Activity (Safely cascades deletion to all signups in subcollection)
  const handleDeleteActivity = async (activityId: string) => {
    if (!user || !isCoordinatorOrAdmin) return;
    try {
      // 1. Fetch subcollection signups
      const signupsSnap = await getDocs(collection(db, 'activities', activityId, 'signups'));
      const batch = writeBatch(db);
      
      // 2. Add each signup to the batch delete
      signupsSnap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      // 3. Add activity document itself to the batch delete
      batch.delete(doc(db, 'activities', activityId));
      
      // 4. Commit atomic batch delete
      await batch.commit();

      setActionSuccess('Activity and all registered volunteer records removed safely.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      console.error('Delete error:', err);
      alert("Failed to delete activity: " + (err?.message || "Permission denied"));
    }
  };

  // Quick Status Update for Coordinator (e.g. Publish draft, Complete, Cancel)
  const handleQuickStatusChange = async (activity: Activity, newStatus: ActivityStatus) => {
    if (!user || !isCoordinatorOrAdmin) return;
    try {
      const actRef = doc(db, 'activities', activity.id);
      await updateDoc(actRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setActionSuccess(`Activity status changed to "${newStatus}".`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      console.error('Status change error:', err);
      alert("Failed to update status: " + (err?.message || "Permission denied"));
    }
  };

  // Filter activities
  const filteredActivities = tasks.filter(activity => {
    // If not coordinator/admin, hide drafts
    if (!isCoordinatorOrAdmin && activity.status === 'draft') {
      return false;
    }

    // Filter mode
    if (filterMode === 'online' && activity.deliveryMode !== 'online' && activity.deliveryMode !== 'virtual') {
      return false;
    }
    if (filterMode === 'in-person' && activity.deliveryMode !== 'in-person') {
      return false;
    }
    if (filterMode === 'my-signups' && !mySignedUpActivityIds.has(activity.id)) {
      return false;
    }
    if (filterMode === 'drafts' && activity.status !== 'draft') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = activity.title?.toLowerCase().includes(q);
      const matchDesc = activity.description?.toLowerCase().includes(q);
      const matchLoc = activity.location?.toLowerCase().includes(q);
      const matchCoord = activity.creatorName?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchLoc || matchCoord;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Control Header & Filters */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-activities-input"
              placeholder="Search volunteer activities by title, venue, or coordinator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-9.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 text-slate-800 placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Coordinator Action button */}
          {isCoordinatorOrAdmin && (
            <button
              id="btn_create_activity"
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create Activity</span>
            </button>
          )}
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Filter:</span>
          
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Activities ({tasks.filter(t => isCoordinatorOrAdmin || t.status !== 'draft').length})
          </button>

          <button
            onClick={() => setFilterMode('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              filterMode === 'online'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Online</span>
          </button>

          <button
            onClick={() => setFilterMode('in-person')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              filterMode === 'in-person'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>In-Person</span>
          </button>

          {user && (
            <button
              onClick={() => setFilterMode('my-signups')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                filterMode === 'my-signups'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <UserCheck className="w-3 h-3 text-amber-700" />
              <span>My Signups ({mySignedUpActivityIds.size})</span>
            </button>
          )}

          {isCoordinatorOrAdmin && (
            <button
              onClick={() => setFilterMode('drafts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                filterMode === 'drafts'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>Drafts ({tasks.filter(t => t.status === 'draft').length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery || filterMode !== 'all' 
              ? 'No matching volunteer activities found' 
              : 'No volunteer activities scheduled'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? 'Try changing your search terms or clearing the current filter.'
              : filterMode === 'my-signups'
              ? 'You have not signed up for any activities yet. Browse the full list to join upcoming sessions.'
              : isCoordinatorOrAdmin
              ? 'Click "Create Activity" above to schedule tutoring drives, workshops, or community projects.'
              : 'Team coordinators will post upcoming volunteer activities, peer workshops, and study sessions here.'}
          </p>

          {isCoordinatorOrAdmin && filterMode === 'all' && !searchQuery && (
            <button
              onClick={handleOpenCreateModal}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create First Volunteer Activity</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              user={user}
              memberProfile={memberProfile}
              isCoordinatorOrAdmin={isCoordinatorOrAdmin}
              isSignedUp={mySignedUpActivityIds.has(activity.id)}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteActivity}
              onQuickStatusChange={handleQuickStatusChange}
              onViewRoster={() => setViewingRosterActivity(activity)}
            />
          ))}
        </div>
      )}

      {/* Activity Create / Edit Modal */}
      <AnimatePresence>
        {(isCreateOpen || editingActivity) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreateOpen(false);
                setEditingActivity(null);
              }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-7 z-10 text-left my-auto max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    {editingActivity ? <Edit3 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      {editingActivity ? 'Edit Volunteer Activity' : 'Create Volunteer Activity'}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Coordinators & Administrators Team Portal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingActivity(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSubmitActivity} className="mt-4 space-y-4 overflow-y-auto pr-1">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Peer Cambridge Test Preparation Workshop"
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all text-slate-800"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Objectives *
                  </label>
                  <textarea
                    required
                    rows={3}
                    maxLength={3000}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide details about objectives, target student cohort, materials required, and volunteer duties..."
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all resize-none text-slate-800 leading-relaxed font-medium"
                  />
                </div>

                {/* Format & Capacity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Format *
                    </label>
                    <select
                      value={formDeliveryMode}
                      onChange={(e) => setFormDeliveryMode(e.target.value as ActivityDeliveryMode)}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 bg-white text-slate-800"
                    >
                      <option value="in-person">In-Person</option>
                      <option value="online">Online / Virtual</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Spaces *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={200}
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(Math.max(1, Number(e.target.value)))}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ActivityStatus)}
                      className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 bg-white text-slate-800"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Private)</option>
                      <option value="full">Full</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Location / Meeting Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {formDeliveryMode === 'online' ? 'Platform Name / Host' : 'Physical Location / Campus *'}
                    </label>
                    <input
                      type="text"
                      required={formDeliveryMode !== 'online'}
                      placeholder={formDeliveryMode === 'online' ? 'e.g., Google Meet' : 'e.g., Campus Study Hall 3'}
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {formDeliveryMode === 'online' ? 'Meeting URL / Link *' : 'Optional Virtual Link'}
                    </label>
                    <input
                      type="text"
                      placeholder="https://meet.google.com/xyz-abc"
                      value={formMeetingLink}
                      onChange={(e) => setFormMeetingLink(e.target.value)}
                      className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formStartsAt}
                      onChange={(e) => setFormStartsAt(e.target.value)}
                      className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formEndsAt}
                      onChange={(e) => setFormEndsAt(e.target.value)}
                      className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Time Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Zone *
                  </label>
                  <select
                    value={formTimeZone}
                    onChange={(e) => setFormTimeZone(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 bg-white text-slate-800"
                  >
                    {TIME_ZONE_OPTIONS.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setEditingActivity(null);
                    }}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-slate-900/10 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                        <span>Saving Activity...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{editingActivity ? 'Save Changes' : 'Publish Activity'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Volunteer Roster Modal for Coordinators */}
      <AnimatePresence>
        {viewingRosterActivity && (
          <VolunteerRosterModal
            activity={viewingRosterActivity}
            onClose={() => setViewingRosterActivity(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Activity Card sub-component
interface ActivityCardProps {
  activity: Activity;
  user: User | null;
  memberProfile?: Member | null;
  isCoordinatorOrAdmin: boolean;
  isSignedUp: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void | Promise<void>;
  onQuickStatusChange: (activity: Activity, status: ActivityStatus) => void;
  onViewRoster: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  user, 
  memberProfile, 
  isCoordinatorOrAdmin, 
  isSignedUp,
  onEdit,
  onDelete, 
  onQuickStatusChange,
  onViewRoster
}) => {
  const [acting, setActing] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [liveSignupCount, setLiveSignupCount] = useState<number | null>(null);

  // For coordinators, listen to live signups count
  useEffect(() => {
    if (!isCoordinatorOrAdmin) return;
    const q = collection(db, 'activities', activity.id, 'signups');
    const unsub = onSnapshot(q, (snap) => {
      setLiveSignupCount(snap.size);
    }, (err) => {
      // Ignored for non-coordinators
    });
    return unsub;
  }, [activity.id, isCoordinatorOrAdmin]);

  const capacity = Math.max(1, Number(activity.capacity || 1));
  const filledSpots = liveSignupCount !== null 
    ? liveSignupCount 
    : Math.max(0, Number(activity.filledSpots || 0));
  const spotsLeft = Math.max(0, capacity - filledSpots);
  const isFull = filledSpots >= capacity || activity.status === 'full';
  const isCancelled = activity.status === 'cancelled';
  const isCompleted = activity.status === 'completed';
  const isDraft = activity.status === 'draft';

  const fillPercent = Math.min(100, Math.round((filledSpots / capacity) * 100));

  // Secure Join / Leave Action:
  // Members modify ONLY their own signup document at /activities/{activityId}/signups/{userId}.
  // Ordinary members never directly modify the activity document or counters.
  const handleSignUpToggle = async () => {
    if (!user) {
      setFeedback({ message: "Please sign in to register for activities.", type: 'error' });
      return;
    }

    if (memberProfile?.status && memberProfile.status !== 'active') {
      setFeedback({ message: "Your membership must be in active standing to sign up for volunteer activities.", type: 'error' });
      return;
    }

    if (activity.status === 'cancelled') {
      setFeedback({ message: "This activity has been cancelled and is not accepting signups.", type: 'error' });
      return;
    }
    if (activity.status === 'completed') {
      setFeedback({ message: "This activity has already concluded.", type: 'error' });
      return;
    }
    if (activity.status === 'draft' && !isCoordinatorOrAdmin) {
      setFeedback({ message: "This activity is currently in draft mode.", type: 'error' });
      return;
    }

    setActing(true);
    setFeedback(null);

    const signupDocRef = doc(db, 'activities', activity.id, 'signups', user.uid);

    try {
      if (isSignedUp) {
        // Withdraw volunteer signup
        await deleteDoc(signupDocRef);
        setFeedback({ message: "Volunteer registration withdrawn successfully.", type: 'success' });
      } else {
        // Check capacity if published status is full
        if (isFull && activity.status !== 'published') {
          throw new Error("This activity has reached maximum volunteer capacity.");
        }

        // Register: Write strictly validated payload (userId and serverTimestamp only)
        // No client-provided names, no emails, no counter updates.
        await setDoc(signupDocRef, {
          userId: user.uid,
          signedUpAt: serverTimestamp()
        });

        setFeedback({ message: "Successfully registered! We look forward to your contribution.", type: 'success' });
      }

      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error('Signup error:', err);
      const friendlyMsg = err?.message || "Could not complete registration. Please try again.";
      setFeedback({ message: friendlyMsg, type: 'error' });
    } finally {
      setActing(false);
    }
  };

  // Format delivery badge
  const renderDeliveryBadge = () => {
    const mode = activity.deliveryMode || 'in-person';
    if (mode === 'online' || mode === 'virtual') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Video className="w-3 h-3" />
          <span>Online</span>
        </span>
      );
    }
    if (mode === 'hybrid') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          <Globe className="w-3 h-3" />
          <span>Hybrid</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <MapPin className="w-3 h-3" />
        <span>In-Person</span>
      </span>
    );
  };

  // Format status badge
  const renderStatusBadge = () => {
    switch (activity.status) {
      case 'draft':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 border-dashed">
            Draft (Coordinator Only)
          </span>
        );
      case 'full':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
            Full Capacity
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Open for Signups
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border rounded-3xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isDraft 
          ? 'border-slate-300 border-dashed bg-slate-50/50' 
          : isCancelled 
          ? 'border-rose-200 bg-rose-50/20' 
          : 'border-slate-200 hover:border-amber-200'
      }`}
    >
      <div className="p-6 flex-1 text-left">
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {renderDeliveryBadge()}
            {renderStatusBadge()}
            {isSignedUp && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                <Check className="w-3 h-3" />
                <span>You're Registered</span>
              </span>
            )}
          </div>

          {/* Coordinator Administrative Menu */}
          {isCoordinatorOrAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onEdit(activity)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                title="Edit Activity Details"
                aria-label="Edit Activity"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl p-1">
                  <span className="text-[10px] font-bold text-red-700 px-1 select-none">Delete?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(activity.id);
                      setConfirmDelete(false);
                    }}
                    className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-all"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove activity"
                  aria-label="Delete Activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title & Coordinator */}
        <h3 className="font-bold text-base text-slate-900 leading-snug pt-3 font-display">
          {activity.title}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Posted by: <span className="text-slate-700 font-semibold">{activity.creatorName || 'Team Coordinator'}</span>
        </p>

        {/* Description */}
        <p className="text-xs font-normal text-slate-700 mt-3 leading-relaxed whitespace-pre-wrap line-clamp-4">
          {activity.description}
        </p>

        {/* Schedule & Location Metadata Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-start gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Schedule</p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {formatSchedule(activity.startsAt)}
              </p>
              {activity.endsAt && (
                <p className="text-[11px] font-medium text-slate-500">
                  to {formatSchedule(activity.endsAt)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Time Zone</p>
              <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                {activity.timeZone || 'GMT+4 (GST / Oman & UAE)'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-600 col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/60">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Location / Venue</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">{activity.location}</p>
              {activity.meetingLink && (
                <a
                  href={activity.meetingLink.startsWith('http') ? activity.meetingLink : `https://${activity.meetingLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline mt-1 break-all"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Join Online Meeting</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Volunteer Capacity Progress Meter */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Volunteer Capacity</span>
            </span>
            <span className="font-bold text-slate-800">
              {filledSpots} / {capacity} Spaces ({spotsLeft} left)
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isFull 
                  ? 'bg-amber-500' 
                  : isCancelled 
                  ? 'bg-rose-400' 
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>

          {/* Coordinator link to view full roster */}
          {isCoordinatorOrAdmin && (
            <div className="mt-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={onViewRoster}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>View Registered Volunteers Roster ({filledSpots})</span>
              </button>
              
              {activity.status === 'draft' && (
                <button
                  type="button"
                  onClick={() => onQuickStatusChange(activity, 'published')}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  Publish Now →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`mt-3 p-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        {isCancelled ? (
          <div className="w-full py-2.5 px-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Activity Cancelled by Coordinator</span>
          </div>
        ) : isCompleted ? (
          <div className="w-full py-2.5 px-4 bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs rounded-2xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Activity Concluded</span>
          </div>
        ) : isDraft && !isCoordinatorOrAdmin ? (
          <div className="w-full py-2.5 px-4 bg-slate-100 border border-slate-200 text-slate-500 font-bold text-xs rounded-2xl flex items-center justify-center gap-2">
            <span>Pending Publication</span>
          </div>
        ) : isSignedUp ? (
          <button
            onClick={handleSignUpToggle}
            disabled={acting}
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-50"
          >
            {acting ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            ) : (
              <UserMinus className="w-3.5 h-3.5" />
            )}
            <span>Withdraw Volunteer Signup</span>
          </button>
        ) : isFull ? (
          <button
            disabled
            className="w-full py-2.5 px-4 bg-slate-200 border border-slate-200 text-slate-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Activity Fully Booked</span>
          </button>
        ) : (
          <button
            onClick={handleSignUpToggle}
            disabled={acting}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
          >
            {acting ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-300/30 border-t-amber-300 animate-spin" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Sign Up as Volunteer</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Volunteer Roster Modal Component (Coordinators & Administrators only)
interface VolunteerRosterModalProps {
  activity: Activity;
  onClose: () => void;
}

interface EnrichedSignup {
  userId: string;
  signedUpAt: any;
  userName: string;
  userPhotoURL?: string;
  userBadge?: string;
  userRole?: string;
  userRegion?: string;
}

const VolunteerRosterModal: React.FC<VolunteerRosterModalProps> = ({ activity, onClose }) => {
  const [signups, setSignups] = useState<EnrichedSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'activities', activity.id, 'signups'), orderBy('signedUpAt', 'asc'));
    const unsub = onSnapshot(q, async (snapshot) => {
      const rawList: Array<{ userId: string; signedUpAt: any }> = [];
      snapshot.forEach((docSnap) => {
        rawList.push({
          userId: docSnap.id,
          signedUpAt: docSnap.data().signedUpAt
        });
      });

      // Obtain display information strictly from the member's verified safe public profile (never trust untrusted client fields)
      const enrichedList: EnrichedSignup[] = await Promise.all(
        rawList.map(async (item) => {
          try {
            const publicDocRef = doc(db, 'publicProfiles', item.userId);
            const publicSnap = await getDoc(publicDocRef);
            if (publicSnap.exists()) {
              const pData = publicSnap.data();
              return {
                userId: item.userId,
                signedUpAt: item.signedUpAt,
                userName: pData.displayName || pData.name || 'Volunteer Member',
                userPhotoURL: pData.photoURL || '',
                userBadge: pData.customBadge || '',
                userRole: pData.role || 'member',
                userRegion: pData.region || ''
              };
            }

            // Fallback for coordinator reading members collection
            const memberDocRef = doc(db, 'members', item.userId);
            const memberSnap = await getDoc(memberDocRef);
            if (memberSnap.exists()) {
              const mData = memberSnap.data();
              return {
                userId: item.userId,
                signedUpAt: item.signedUpAt,
                userName: mData.displayName || mData.name || 'Volunteer Member',
                userPhotoURL: mData.photoURL || '',
                userBadge: mData.customBadge || '',
                userRole: mData.role || 'member',
                userRegion: mData.region || ''
              };
            }
          } catch (e) {
            console.warn("Could not fetch safe profile for roster member:", e);
          }

          return {
            userId: item.userId,
            signedUpAt: item.signedUpAt,
            userName: 'Volunteer Member'
          };
        })
      );

      setSignups(enrichedList);
      setLoading(false);
    }, (err) => {
      console.error('Roster fetch error:', err);
      setLoading(false);
    });

    return unsub;
  }, [activity.id]);

  // Coordinator removal of a volunteer from the roster
  const handleRemoveVolunteer = async (volunteerUid: string) => {
    if (!confirm("Are you sure you want to remove this volunteer from the activity?")) return;
    setRemovingId(volunteerUid);

    try {
      const signupRef = doc(db, 'activities', activity.id, 'signups', volunteerUid);
      await deleteDoc(signupRef);
    } catch (err: any) {
      alert("Failed to remove volunteer: " + (err?.message || "Permission denied"));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 z-10 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Registered Volunteers Roster
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate max-w-sm">
              {activity.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Privacy Notice Banner */}
        <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Privacy Guard:</strong> Student contact info and emails are protected and never broadcasted.
          </span>
        </div>

        <div className="mt-3 max-h-[55vh] overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading roster...</span>
            </div>
          ) : signups.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs italic">
              No volunteers registered for this activity yet.
            </div>
          ) : (
            signups.map((s, idx) => (
              <div
                key={s.userId}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/70 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800">{s.userName}</h4>
                      {s.userBadge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {s.userBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      ID: {s.userId.slice(0, 8)}... {s.userRegion ? `• ${s.userRegion}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={removingId === s.userId}
                  onClick={() => handleRemoveVolunteer(s.userId)}
                  className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Remove from roster"
                >
                  {removingId === s.userId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Total registered: <strong className="text-slate-800">{signups.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs cursor-pointer"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
};
