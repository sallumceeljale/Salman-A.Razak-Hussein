import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, doc, getDocs, updateDoc, deleteDoc, setDoc, 
  onSnapshot, query, orderBy, serverTimestamp, increment, Timestamp 
} from 'firebase/firestore';
import { 
  X, ShieldCheck, Users, ClipboardList, Clock, BookOpen, 
  MessageCircle, Settings, Palette, Search, Check, AlertCircle, 
  Crown, Sparkles, Filter, ChevronRight, ExternalLink, Trash2, 
  CheckCircle2, XCircle, Edit3, Plus, RefreshCw, Eye, Tag, 
  MapPin, Video, Globe, Lock, ShieldAlert, Award, UploadCloud, ImageIcon, Layers,
  Bell, Mail, Send, Activity, Monitor, UserCheck, EyeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Member, Task, Resource, VolunteerHourLog, Post } from '../types';
import { usePublicAssets } from '../contexts/PublicAssetsContext';
import { getHighResPhotoUrl, DEFAULT_FOUNDER_PHOTO } from '../utils/leader';
import { GOOGLE_FORM_URL, isValidGoogleFormUrl } from '../constants/links';
import { 
  sendTestNotificationEmail, 
  fetchNotificationStatus, 
  NotificationStatusResponse 
} from '../services/notificationService';
import teamLogoFallback from '../assets/images/svt_new_team_logo_1786419966225.jpg';
import wideIdentityBanner from '../assets/images/svt_exact_identity_banner_final_1784959210089.jpg';
import salmanPhotoFallback from '../assets/images/salman-arazak-hussein.jpg';
import najmPhotoFallback from '../assets/images/najm-bazel.jpg';
import mohamedPhotoFallback from '../assets/images/mohamed-seif.png';
import detLogoFallback from '../assets/images/det_official_logo_1787830979022.jpg';
import ieltsLogoFallback from '../assets/images/ielts_official_logo_1786161093593.jpg';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onRefreshClaims: () => Promise<void>;
  onOpenProfile: (uid: string) => void;
  customTeamLogo?: string | null;
  customWideBanner?: string | null;
  customFounderPhoto?: string | null;
  onUpdateTeamLogo: (base64: string) => Promise<void>;
  onUpdateWideBanner: (base64: string) => Promise<void>;
  onUpdateFounderPhoto: (base64: string) => Promise<void>;
}

type AdminTab = 
  | 'applications'
  | 'members'
  | 'alerts'
  | 'activities'
  | 'hours'
  | 'resources'
  | 'bulletin'
  | 'settings'
  | 'branding';

export default function AdminPortalModal({
  isOpen,
  onClose,
  isAdmin,
  onRefreshClaims,
  onOpenProfile,
  customTeamLogo,
  customWideBanner,
  customFounderPhoto,
  onUpdateTeamLogo,
  onUpdateWideBanner,
  onUpdateFounderPhoto
}: AdminPortalModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('applications');
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Email Notification & Traffic states
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatusResponse | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [alertsFilter, setAlertsFilter] = useState<'all' | 'visitor' | 'volunteer_signin'>('all');

  // Data states
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [activities, setActivities] = useState<Task[]>([]);
  const [hourLogs, setHourLogs] = useState<VolunteerHourLog[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search & Filter states
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [hoursFilter, setHoursFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Activity Create / Edit State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityMeetingLink, setActivityMeetingLink] = useState('');
  const [activityStartsAt, setActivityStartsAt] = useState('');
  const [activityEndsAt, setActivityEndsAt] = useState('');
  const [activityDelivery, setActivityDelivery] = useState<'in-person' | 'online' | 'hybrid'>('in-person');
  const [activityCapacity, setActivityCapacity] = useState(10);
  const [savingActivity, setSavingActivity] = useState(false);

  // Settings State
  const [applicationFormUrl, setApplicationFormUrl] = useState(GOOGLE_FORM_URL);
  const [bannerNoticeText, setBannerNoticeText] = useState('');
  const [isBannerNoticeActive, setIsBannerNoticeActive] = useState(false);
  const [teamMotto, setTeamMotto] = useState('Educate • Empower • Elevate');
  const [savingSettings, setSavingSettings] = useState(false);

  // Load Real-Time Admin Datasets when Admin is Verified
  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    setLoadingData(true);

    // 1. Members
    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
      const list: Member[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          uid: d.id,
          name: data.displayName || data.name || 'Volunteer',
          displayName: data.displayName || data.name || 'Volunteer',
          email: data.email || '',
          photoURL: data.photoURL || '',
          role: data.role || 'member',
          status: data.status || 'pending',
          bio: data.bio || '',
          skills: data.skills || [],
          interests: data.interests || [],
          region: data.region || '',
          hasCrown: !!data.hasCrown,
          customBadge: data.customBadge || '',
          totalApprovedMinutes: data.totalApprovedMinutes || 0,
          joinedAt: data.joinedAt ? (data.joinedAt.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt)) : new Date(),
          directoryVisible: data.directoryVisible !== false
        });
      });
      setAllMembers(list);
    }, (err) => console.warn("Admin members sync warning:", err));

    // 2. Activities
    const unsubActivities = onSnapshot(query(collection(db, 'activities'), orderBy('createdAt', 'desc')), (snap) => {
      const list: Task[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as Task);
      });
      setActivities(list);
    }, (err) => console.warn("Admin activities sync warning:", err));

    // 3. Hours Logs
    const unsubHours = onSnapshot(query(collection(db, 'hours_logs'), orderBy('submittedAt', 'desc')), (snap) => {
      const list: VolunteerHourLog[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as VolunteerHourLog);
      });
      setHourLogs(list);
    }, (err) => console.warn("Admin hours sync warning:", err));

    // 4. Resources
    const unsubResources = onSnapshot(query(collection(db, 'resources'), orderBy('submittedAt', 'desc')), (snap) => {
      const list: Resource[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as Resource);
      });
      setResources(list);
    }, (err) => console.warn("Admin resources sync warning:", err));

    // 5. Posts
    const unsubPosts = onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc')), (snap) => {
      const list: Post[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({ id: d.id, ...data } as Post);
      });
      setPosts(list);
      setLoadingData(false);
    }, (err) => {
      console.warn("Admin posts sync warning:", err);
      setLoadingData(false);
    });

    // 6. Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.applicationFormUrl) setApplicationFormUrl(data.applicationFormUrl);
        if (data.bannerNoticeText) setBannerNoticeText(data.bannerNoticeText);
        if (data.isBannerNoticeActive !== undefined) setIsBannerNoticeActive(data.isBannerNoticeActive);
        if (data.teamMotto) setTeamMotto(data.teamMotto);
      }
    }, (err) => console.warn("Admin settings sync warning:", err));

    return () => {
      unsubMembers();
      unsubActivities();
      unsubHours();
      unsubResources();
      unsubPosts();
      unsubSettings();
    };
  }, [isOpen, isAdmin]);

  // Load notification status & logs
  const loadNotificationInfo = async () => {
    setLoadingStatus(true);
    const data = await fetchNotificationStatus();
    if (data) {
      setNotificationStatus(data);
    }
    setLoadingStatus(false);
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadNotificationInfo();
    }
  }, [isOpen, isAdmin, activeTab]);

  const handleTriggerTestEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await sendTestNotificationEmail('sallumrazak@gmail.com');
      if (res.success) {
        showToast("Test notification sent successfully to sallumrazak@gmail.com!");
        await loadNotificationInfo();
      } else {
        showToast(res.error || "Could not dispatch test email", 'error');
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to trigger test email", 'error');
    } finally {
      setTestingEmail(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefreshClaims();
      showToast("Firebase custom claims successfully checked & refreshed.", 'success');
    } catch (err: any) {
      showToast("Could not refresh token: " + (err?.message || "Please check network"), 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // Membership Actions
  const handleUpdateMemberStatus = async (uid: string, status: 'active' | 'pending' | 'suspended' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'members', uid), { status, updatedAt: serverTimestamp() });
      await updateDoc(doc(db, 'publicProfiles', uid), { status, updatedAt: serverTimestamp() }).catch(() => {});
      showToast(`Member status updated to ${status}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to update member status", 'error');
    }
  };

  const handleUpdateMemberRole = async (uid: string, role: 'admin' | 'coordinator' | 'member') => {
    try {
      await updateDoc(doc(db, 'members', uid), { role, updatedAt: serverTimestamp() });
      await updateDoc(doc(db, 'publicProfiles', uid), { role, updatedAt: serverTimestamp() }).catch(() => {});
      showToast(`Member role updated to ${role}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to update member role", 'error');
    }
  };

  const handleToggleCrown = async (uid: string, currentCrown: boolean) => {
    try {
      await updateDoc(doc(db, 'members', uid), { hasCrown: !currentCrown, updatedAt: serverTimestamp() });
      await updateDoc(doc(db, 'publicProfiles', uid), { hasCrown: !currentCrown, updatedAt: serverTimestamp() }).catch(() => {});
      showToast(`Crown ${!currentCrown ? 'awarded' : 'removed'}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to toggle crown", 'error');
    }
  };

  const handleSaveBadge = async (uid: string, badgeText: string) => {
    try {
      await updateDoc(doc(db, 'members', uid), { customBadge: badgeText.trim(), updatedAt: serverTimestamp() });
      await updateDoc(doc(db, 'publicProfiles', uid), { customBadge: badgeText.trim(), updatedAt: serverTimestamp() }).catch(() => {});
      showToast("Member badge updated.");
    } catch (err: any) {
      showToast(err?.message || "Failed to update badge", 'error');
    }
  };

  // Hours Approval Workflow
  const handleApproveHours = async (log: VolunteerHourLog) => {
    try {
      const minutes = Number(log.minutes) || Math.round((Number(log.hours) || 0) * 60);
      await updateDoc(doc(db, 'hours_logs', log.id), {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: auth.currentUser?.uid || 'admin'
      });
      // Increment member's total approved minutes
      if (log.userId) {
        await updateDoc(doc(db, 'members', log.userId), {
          totalApprovedMinutes: increment(minutes)
        }).catch(() => {});
        await updateDoc(doc(db, 'publicProfiles', log.userId), {
          totalApprovedMinutes: increment(minutes)
        }).catch(() => {});
      }
      showToast(`Approved ${minutes / 60} hours for volunteer.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to approve hour log", 'error');
    }
  };

  const handleRejectHours = async (logId: string) => {
    try {
      await updateDoc(doc(db, 'hours_logs', logId), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewedBy: auth.currentUser?.uid || 'admin'
      });
      showToast("Volunteer hour log marked as rejected.");
    } catch (err: any) {
      showToast(err?.message || "Failed to reject hour log", 'error');
    }
  };

  // Resource Approval Workflow
  const handleApproveResource = async (resourceId: string) => {
    try {
      await updateDoc(doc(db, 'resources', resourceId), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      showToast("Resource approved and published to the Student Bank.");
    } catch (err: any) {
      showToast(err?.message || "Failed to approve resource", 'error');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to remove this academic resource?")) return;
    try {
      await deleteDoc(doc(db, 'resources', resourceId));
      showToast("Resource deleted successfully.");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete resource", 'error');
    }
  };

  // Bulletin Moderation
  const handleTogglePinAnnouncement = async (postId: string, currentCategory: string) => {
    try {
      const newCategory = currentCategory === 'Announcement' ? 'General' : 'Announcement';
      await updateDoc(doc(db, 'posts', postId), { category: newCategory });
      showToast(`Post category set to ${newCategory}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to update post category", 'error');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this bulletin post from all members?")) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
      showToast("Post removed from circle bulletin.");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete post", 'error');
    }
  };

  // Activity Management
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim() || !activityStartsAt || !activityEndsAt) {
      showToast("Please provide title, start time, and end time.", 'error');
      return;
    }
    const start = new Date(activityStartsAt);
    const end = new Date(activityEndsAt);
    if (end.getTime() <= start.getTime()) {
      showToast("End time must be after the start time.", 'error');
      return;
    }

    setSavingActivity(true);
    try {
      const actRef = doc(collection(db, 'activities'));
      await setDoc(actRef, {
        id: actRef.id,
        title: activityTitle.trim(),
        description: activityDesc.trim(),
        location: activityLocation.trim(),
        meetingLink: activityMeetingLink.trim(),
        startsAt: Timestamp.fromDate(start),
        endsAt: Timestamp.fromDate(end),
        deliveryMode: activityDelivery,
        capacity: Number(activityCapacity) || 10,
        filledSpots: 0,
        status: 'published',
        creatorId: auth.currentUser?.uid || 'admin',
        createdAt: serverTimestamp()
      });
      setIsActivityModalOpen(false);
      setActivityTitle('');
      setActivityDesc('');
      setActivityLocation('');
      setActivityMeetingLink('');
      showToast("New volunteering activity created & published.");
    } catch (err: any) {
      showToast(err?.message || "Failed to create activity", 'error');
    } finally {
      setSavingActivity(false);
    }
  };

  const handleUpdateActivityStatus = async (actId: string, status: 'published' | 'draft' | 'completed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'activities', actId), { status, updatedAt: serverTimestamp() });
      showToast(`Activity status changed to ${status}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to update status", 'error');
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    if (!confirm("Delete this activity and its volunteer roster?")) return;
    try {
      await deleteDoc(doc(db, 'activities', actId));
      showToast("Activity deleted.");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete activity", 'error');
    }
  };

  // Settings Save
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        applicationFormUrl: applicationFormUrl.trim(),
        bannerNoticeText: bannerNoticeText.trim(),
        isBannerNoticeActive,
        teamMotto: teamMotto.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      showToast("Website settings saved successfully.");
    } catch (err: any) {
      showToast(err?.message || "Failed to save settings", 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!isOpen) return null;

  // Filtered lists
  const pendingApplications = allMembers.filter(m => m.status === 'pending');
  const filteredMembersList = allMembers.filter(m => {
    const queryStr = memberSearch.toLowerCase();
    const matchesSearch = (m.name || '').toLowerCase().includes(queryStr) || (m.email || '').toLowerCase().includes(queryStr);
    const matchesStatus = memberStatusFilter === 'all' || m.status === memberStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const filteredHourLogs = hourLogs.filter(l => hoursFilter === 'all' || l.status === hoursFilter);
  const filteredResources = resources.filter(r => resourceFilter === 'all' || r.status === resourceFilter);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative bg-slate-900 w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col z-10 text-left text-white"
        >
          
          {/* Top Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-400/10 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-base sm:text-lg text-white tracking-tight">
                    SVT Executive Administration Hub
                  </h2>
                  <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Founder Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Authoritative administrative controls backed by cryptographic custom claims
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Refresh Firebase Token Custom Claims"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Refresh Claims</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-transparent hover:border-slate-700"
                aria-label="Close administration hub"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mx-4 sm:mx-6 mt-3 p-3 rounded-2xl flex items-center gap-2 text-xs font-bold ${
                  feedback.type === 'error'
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{feedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verification Guard Banner if not an admin */}
          {!isAdmin ? (
            <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-black text-white">
                  Administrator access has not been configured for this account.
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Administrator privileges require a verified Firebase ID token containing the <code className="text-amber-300 font-mono">admin: true</code> custom claim. If permissions were recently assigned via the Firebase Admin SDK, refresh your token credentials below.
                </p>
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Check & Refresh Token Claims</span>
              </button>
            </div>
          ) : (
            /* Administration Tabs and Main Working Area */
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              
              {/* Left Navigation Sidebar */}
              <nav className="w-full md:w-60 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-2 sm:p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col no-scrollbar">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    <span>Applications</span>
                  </div>
                  {pendingApplications.length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'applications' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950'
                    }`}>
                      {pendingApplications.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('members')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'members'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Member Roster</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{allMembers.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'alerts'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 shrink-0" />
                    <span>Email Alerts & Traffic</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold">
                    Active
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('activities')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'activities'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Activities</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{activities.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('hours')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'hours'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>Hours Review</span>
                  </div>
                  {hourLogs.filter(l => l.status === 'pending').length > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === 'hours' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-400 text-slate-950'
                    }`}>
                      {hourLogs.filter(l => l.status === 'pending').length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'resources'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Resources</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{resources.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('bulletin')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'bulletin'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Bulletin Posts</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{posts.length}</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>Site Settings</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between shrink-0 cursor-pointer ${
                    activeTab === 'branding'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 shrink-0" />
                    <span>Branding & Media</span>
                  </div>
                </button>
              </nav>

              {/* Tab Content Panel */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* 1. APPLICATIONS TAB */}
                {activeTab === 'applications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Membership Applications ({pendingApplications.length} Pending)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Review new candidate submissions and grant verified active membership standing.
                        </p>
                      </div>
                    </div>

                    {pendingApplications.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="text-sm font-bold text-white">No Pending Applications</p>
                        <p className="text-xs text-slate-400">All registered scholars have been reviewed and activated.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingApplications.map((member) => (
                          <div
                            key={member.uid}
                            className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                                {member.photoURL ? (
                                  <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                  member.name[0] || 'V'
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white">{member.name}</h4>
                                <p className="text-xs text-slate-400">{member.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Pending Review
                                  </span>
                                  {member.region && (
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" /> {member.region}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <button
                                onClick={() => onOpenProfile(member.uid)}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleUpdateMemberStatus(member.uid, 'active')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve & Activate</span>
                              </button>
                              <button
                                onClick={() => handleUpdateMemberStatus(member.uid, 'rejected')}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. MEMBERS TAB */}
                {activeTab === 'members' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Full Volunteer Roster ({filteredMembersList.length} Members)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Manage member roles, permissions, honor crowns, and status.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            placeholder="Search name or email..."
                            className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-48"
                          />
                        </div>

                        <select
                          value={memberStatusFilter}
                          onChange={(e: any) => setMemberStatusFilter(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {filteredMembersList.map((member) => (
                        <div
                          key={member.uid}
                          className="p-3.5 bg-slate-950/70 border border-slate-800/90 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                              {member.photoURL ? (
                                <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.name[0] || 'V'
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{member.name}</h4>
                                {member.hasCrown && (
                                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                )}
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                  member.role === 'admin'
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                    : member.role === 'coordinator'
                                    ? 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {member.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">{member.email} • {((member.totalApprovedMinutes || 0) / 60).toFixed(1)} hrs</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                            <button
                              onClick={() => handleToggleCrown(member.uid, !!member.hasCrown)}
                              className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                member.hasCrown
                                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                              }`}
                              title={member.hasCrown ? "Remove Crown" : "Award Crown"}
                            >
                              <Crown className="w-3.5 h-3.5" />
                            </button>

                            <select
                              value={member.role || 'member'}
                              onChange={(e: any) => handleUpdateMemberRole(member.uid, e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                            >
                              <option value="member">Role: Member</option>
                              <option value="coordinator">Role: Coordinator</option>
                              <option value="admin">Role: Admin</option>
                            </select>

                            <select
                              value={member.status || 'pending'}
                              onChange={(e: any) => handleUpdateMemberStatus(member.uid, e.target.value)}
                              className={`border rounded-xl px-2 py-1 text-[11px] font-bold focus:outline-none ${
                                member.status === 'active'
                                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                  : member.status === 'suspended'
                                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                                  : 'bg-amber-950/60 border-amber-800 text-amber-300'
                              }`}
                            >
                              <option value="active">Status: Active</option>
                              <option value="pending">Status: Pending</option>
                              <option value="suspended">Status: Suspended</option>
                              <option value="rejected">Status: Rejected</option>
                            </select>

                            <button
                              onClick={() => onOpenProfile(member.uid)}
                              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EMAIL ALERTS & TRAFFIC TAB */}
                {activeTab === 'alerts' && (
                  <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Mail className="w-4 h-4 text-amber-400" />
                            <span>Executive Email Notifications</span>
                          </h3>
                          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live System
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Automated email alerts dispatched to <strong className="text-amber-300 font-mono">sallumrazak@gmail.com</strong> whenever visitors arrive or volunteers log in.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={loadNotificationInfo}
                          disabled={loadingStatus}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
                          <span>Refresh Logs</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleTriggerTestEmail}
                          disabled={testingEmail}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className={`w-3.5 h-3.5 ${testingEmail ? 'animate-bounce' : ''}`} />
                          <span>{testingEmail ? 'Sending Test...' : 'Send Test Alert Email'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Overview Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Recipient</span>
                          <Mail className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-xs font-mono font-bold text-amber-300 truncate">
                          sallumrazak@gmail.com
                        </p>
                        <div className="text-[10px] text-slate-500">
                          Founder & Executive Lead
                        </div>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Triggers</span>
                          <Activity className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md">
                            🌐 Site Visitors
                          </span>
                          <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                            🤝 Volunteer Logins
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Real-time dispatch via Express & Nodemailer
                        </div>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Stream</span>
                          <ClipboardList className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-lg font-black text-white">
                          {notificationStatus?.totalLogsCount ?? (notificationStatus?.recentLogs?.length || 0)} <span className="text-xs font-normal text-slate-400">Events Logged</span>
                        </p>
                        <div className="text-[10px] text-slate-500">
                          Live session activity buffer
                        </div>
                      </div>
                    </div>

                    {/* Filter Bar & Audit Stream */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-400" />
                          <span>Recent Dispatched Alerts & Live Activity</span>
                        </h4>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAlertsFilter('all')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              alertsFilter === 'all'
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            All ({notificationStatus?.recentLogs?.length || 0})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAlertsFilter('visitor')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              alertsFilter === 'visitor'
                                ? 'bg-blue-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            Visitors ({notificationStatus?.recentLogs?.filter(l => l.type === 'visitor').length || 0})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAlertsFilter('volunteer_signin')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              alertsFilter === 'volunteer_signin'
                                ? 'bg-purple-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            Volunteer Logins ({notificationStatus?.recentLogs?.filter(l => l.type === 'volunteer_signin').length || 0})
                          </button>
                        </div>
                      </div>

                      {/* Log List */}
                      {(!notificationStatus?.recentLogs || notificationStatus.recentLogs.length === 0) ? (
                        <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                          <p className="font-bold text-slate-300">No activity events recorded in this session yet.</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            When someone visits the site or a volunteer logs in, real-time alerts appear here and deliver to <code className="text-amber-300 font-mono">sallumrazak@gmail.com</code>.
                          </p>
                          <button
                            type="button"
                            onClick={handleTriggerTestEmail}
                            className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            Trigger Sample Test Alert
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                          {notificationStatus.recentLogs
                            .filter(l => alertsFilter === 'all' || l.type === alertsFilter)
                            .map((log) => {
                              const isVisitor = log.type === 'visitor';
                              return (
                                <div
                                  key={log.id}
                                  className="p-3.5 bg-slate-950/80 border border-slate-800/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors text-left"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                      isVisitor 
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    }`}>
                                      {isVisitor ? <Monitor className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md ${
                                          isVisitor ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                                        }`}>
                                          {isVisitor ? 'Website Visitor' : 'Volunteer Login'}
                                        </span>
                                        <h5 className="text-xs font-bold text-white">
                                          {log.subject}
                                        </h5>
                                      </div>
                                      <p className="text-[11px] text-slate-300 mt-1">
                                        {log.summary}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0 text-right">
                                    <span className="text-[10px] font-mono text-slate-400">
                                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                                      Dispatched
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. ACTIVITIES TAB */}
                {activeTab === 'activities' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Volunteering Activities & Shifts ({activities.length})
                        </h3>
                        <p className="text-xs text-slate-400">
                          Create, schedule, publish, or modify official volunteering opportunities.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsActivityModalOpen(true)}
                        className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Activity</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activities.map((act) => (
                        <div
                          key={act.id}
                          className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 max-w-lg">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{act.title}</h4>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                act.status === 'published'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : act.status === 'draft'
                                  ? 'bg-slate-700 text-slate-300'
                                  : act.status === 'completed'
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}>
                                {act.status || 'published'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{act.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                              <span>Capacity: {act.capacity || 10}</span>
                              <span>Mode: {act.deliveryMode || 'in-person'}</span>
                              {act.location && <span>Loc: {act.location}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <select
                              value={act.status || 'published'}
                              onChange={(e: any) => handleUpdateActivityStatus(act.id, e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition-all cursor-pointer"
                              title="Delete Activity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. HOURS TAB */}
                {activeTab === 'hours' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Volunteer Hours Review ({filteredHourLogs.length})
                        </h3>
                        <p className="text-xs text-slate-400">
                          Approve or reject scholar volunteer service submissions.
                        </p>
                      </div>

                      <select
                        value={hoursFilter}
                        onChange={(e: any) => setHoursFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved Logs</option>
                        <option value="rejected">Rejected Logs</option>
                        <option value="all">All Submissions</option>
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      {filteredHourLogs.map((log) => {
                        const hrs = Number(log.hours) || ((Number(log.minutes) || 0) / 60);
                        return (
                          <div
                            key={log.id}
                            className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{log.taskTitle || log.title || 'Volunteer Activity'}</h4>
                                <span className="text-xs font-black text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded-md">
                                  {hrs.toFixed(1)} hrs
                                </span>
                                <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                                  log.status === 'approved'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : log.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {log.status || 'pending'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{log.description || 'No notes provided'}</p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                Submitter UID: {log.userId} • Date: {log.date || 'Recent'}
                              </p>
                            </div>

                            {log.status === 'pending' && (
                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <button
                                  onClick={() => handleApproveHours(log)}
                                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectHours(log.id)}
                                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. RESOURCES TAB */}
                {activeTab === 'resources' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Shared Resource Submissions ({filteredResources.length})
                        </h3>
                        <p className="text-xs text-slate-400">
                          Moderate study materials, formula sheets, and past papers.
                        </p>
                      </div>

                      <select
                        value={resourceFilter}
                        onChange={(e: any) => setResourceFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="all">All Resources</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      {filteredResources.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{res.title}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                {res.category}
                              </span>
                              <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                                res.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {res.status || 'approved'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{res.description}</p>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 mt-1 inline-flex"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{res.url}</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {res.status === 'pending' && (
                              <button
                                onClick={() => handleApproveResource(res.id)}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteResource(res.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. BULLETIN TAB */}
                {activeTab === 'bulletin' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Bulletin Moderation ({posts.length} Posts)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Pin official leadership broadcasts or delete spam posts.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{post.authorName || 'Scholar'}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                post.category === 'Announcement'
                                  ? 'bg-amber-400 text-slate-950 font-black'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {post.category || 'General'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap">{post.content}</p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleTogglePinAnnouncement(post.id, post.category)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              {post.category === 'Announcement' ? 'Unpin' : 'Pin Announcement'}
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Website & Portal Settings
                      </h3>
                      <p className="text-xs text-slate-400">
                        Configure application endpoints, banner announcements, and team identity.
                      </p>
                    </div>

                    <div className="space-y-4 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Official Volunteer Application Google Form URL
                        </label>
                        <input
                          type="url"
                          value={applicationFormUrl}
                          onChange={(e) => setApplicationFormUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          placeholder="https://forms.gle/..."
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Controls the destination when prospective volunteers click "Apply to Join SVT".
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          Team Motto / Global Tagline
                        </label>
                        <input
                          type="text"
                          value={teamMotto}
                          onChange={(e) => setTeamMotto(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">Broadcast Announcement Bar</h4>
                          <p className="text-[11px] text-slate-400">Display emergency alert at top of website</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isBannerNoticeActive}
                          onChange={(e) => setIsBannerNoticeActive(e.target.checked)}
                          className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                        />
                      </div>

                      {isBannerNoticeActive && (
                        <div>
                          <input
                            type="text"
                            value={bannerNoticeText}
                            onChange={(e) => setBannerNoticeText(e.target.value)}
                            placeholder="Enter announcement text..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      )}

                      <div className="pt-3">
                        <button
                          onClick={handleSaveSettings}
                          disabled={savingSettings}
                          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {savingSettings ? "Saving..." : "Save Website Settings"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. BRANDING TAB */}
                {activeTab === 'branding' && (() => {
                  const { 
                    assets, 
                    getAsset, 
                    openAssetEditor, 
                    isSiteImageEditMode, 
                    setIsSiteImageEditMode 
                  } = usePublicAssets();

                  const manageableAssets = [
                    {
                      key: 'svt-logo',
                      label: 'Official Team Logo',
                      category: 'Brand Identity',
                      desc: 'Square crest used in headers, hero badges, and brand identity cards',
                      fallback: customTeamLogo || teamLogoFallback,
                      aspect: 'aspect-square max-w-[120px]'
                    },
                    {
                      key: 'team-banner',
                      label: 'Wide Identity Banner',
                      category: 'Brand Identity',
                      desc: 'Horizontal artwork used across community bulletin boards and modals',
                      fallback: customWideBanner || wideIdentityBanner,
                      aspect: 'aspect-[3/1] max-w-[280px]'
                    },
                    {
                      key: 'founder-portrait',
                      label: 'Salman A.razak Hussein (Founder Story)',
                      category: 'Founder & Leadership',
                      desc: 'Founder profile portrait on Section 5 and leadership dialogue',
                      fallback: customFounderPhoto || salmanPhotoFallback,
                      aspect: 'aspect-square max-w-[120px] rounded-full'
                    },
                    {
                      key: 'leadership-salman',
                      label: 'Salman A.razak Hussein (Leadership Team Card)',
                      category: 'Leadership Team',
                      desc: 'Founder & Leader official card in Leadership Section',
                      fallback: salmanPhotoFallback,
                      aspect: 'aspect-square max-w-[120px]'
                    },
                    {
                      key: 'leadership-najm',
                      label: 'Najm Bazel (Leadership Team Card)',
                      category: 'Leadership Team',
                      desc: 'Senior Project Manager official card in Leadership Section',
                      fallback: najmPhotoFallback,
                      aspect: 'aspect-square max-w-[120px]'
                    },
                    {
                      key: 'leadership-mohamed',
                      label: 'Mohamed Seif (Leadership Team Card)',
                      category: 'Leadership Team',
                      desc: 'Design Manager official card in Leadership Section',
                      fallback: mohamedPhotoFallback,
                      aspect: 'aspect-square max-w-[120px]'
                    },
                    {
                      key: 'guide-det',
                      label: 'Duolingo English Test (DET) Official Logo',
                      category: 'Study Resources & Guides',
                      desc: 'Official test card and detail modal logo for DET',
                      fallback: detLogoFallback,
                      aspect: 'aspect-[4/3] max-w-[160px]'
                    },
                    {
                      key: 'guide-ielts',
                      label: 'IELTS Official Examination Logo',
                      category: 'Study Resources & Guides',
                      desc: 'Official test card and detail modal logo for IELTS Academic',
                      fallback: ieltsLogoFallback,
                      aspect: 'aspect-[4/3] max-w-[160px]'
                    }
                  ];

                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-amber-400" />
                            <span>Persistent Site Images & Brand Assets</span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Images are validated, uploaded directly to Firebase Storage, and published instantly to all devices.
                          </p>
                        </div>

                        {/* In-Page Edit Mode Toggle */}
                        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">In-Page Edit Mode</span>
                            <span className="text-[10px] text-slate-400 block">Show hover badges on live pages</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSiteImageEditMode(!isSiteImageEditMode)}
                            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                              isSiteImageEditMode ? 'bg-amber-400' : 'bg-slate-800'
                            }`}
                            aria-label="Toggle in-page site image edit mode"
                          >
                            <span
                              className={`block w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                                isSiteImageEditMode ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {manageableAssets.map((assetItem) => {
                          const assetDoc = getAsset(assetItem.key, assetItem.fallback);
                          const isCustomized = Boolean(assetDoc.src && assetDoc.src !== assetItem.fallback);

                          return (
                            <div
                              key={assetItem.key}
                              className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                                    {assetItem.category}
                                  </span>
                                  {isCustomized ? (
                                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                      Cloud Synced
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                                      Default Asset
                                    </span>
                                  )}
                                </div>

                                <h4 className="text-xs font-bold text-white">
                                  {assetItem.label}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2">
                                  {assetItem.desc}
                                </p>
                              </div>

                              {/* Asset Image Preview Container */}
                              <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-center min-h-[140px] overflow-hidden">
                                <img
                                  src={assetDoc.src}
                                  alt={assetDoc.alt || assetItem.label}
                                  className={`object-contain max-h-[120px] ${assetItem.aspect}`}
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="space-y-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => openAssetEditor(assetItem.key, assetItem.label, assetDoc.src)}
                                  className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                                >
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>Replace Photo (Storage)</span>
                                </button>
                                <div className="text-[10px] text-slate-500 font-mono text-center truncate">
                                  Key: <code className="text-slate-400">{assetItem.key}</code>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          )}

          {/* Activity Create Sub-Modal */}
          {isActivityModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsActivityModalOpen(false)} />
              <div className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Create Volunteering Activity</h3>
                  <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateActivity} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={activityTitle}
                      onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder="e.g., Peer Math Tutoring Session"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={activityDesc}
                      onChange={(e) => setActivityDesc(e.target.value)}
                      placeholder="Activity objectives and details..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Start Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={activityStartsAt}
                        onChange={(e) => setActivityStartsAt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">End Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={activityEndsAt}
                        onChange={(e) => setActivityEndsAt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Delivery Mode</label>
                      <select
                        value={activityDelivery}
                        onChange={(e: any) => setActivityDelivery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="in-person">In-Person</option>
                        <option value="online">Online / Virtual</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Volunteer Capacity</label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={activityCapacity}
                        onChange={(e) => setActivityCapacity(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Location or Meeting Link</label>
                    <input
                      type="text"
                      value={activityDelivery === 'online' ? activityMeetingLink : activityLocation}
                      onChange={(e) => activityDelivery === 'online' ? setActivityMeetingLink(e.target.value) : setActivityLocation(e.target.value)}
                      placeholder={activityDelivery === 'online' ? "https://meet.google.com/..." : "Campus Library Hall B"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsActivityModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingActivity}
                      className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-sm disabled:opacity-50"
                    >
                      {savingActivity ? "Creating..." : "Publish Activity"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
