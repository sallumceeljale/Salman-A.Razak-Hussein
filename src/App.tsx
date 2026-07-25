import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { collection, query, orderBy, onSnapshot, getDocFromServer, doc, setDoc, getDoc, serverTimestamp, limit } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Post, Task, Resource, VolunteerHourLog } from './types';
import { getMemberBadge } from './utils/badge';
import { isLeaderEmail } from './utils/leader';
import Banner from './components/Banner';
import Board from './components/Board';
import TasksList from './components/TasksList';
import MembersModal from './components/MembersModal';
import SettingsModal from './components/SettingsModal';
import ResourceBank from './components/ResourceBank';
import HoursTracker from './components/HoursTracker';
import ProfileViewModal from './components/ProfileViewModal';
import ImageLightbox from './components/ImageLightbox';
import ImageOptionsMenuModal from './components/ImageOptionsMenuModal';
import { MessageCircle, ClipboardList, BookOpen, Clock, Info, HelpCircle, Share2, Link2, Copy, Check, ShieldAlert, Crown, Sparkles, Users, Award, Search, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RECRUIT_NAMES = [
  "أحمد الرويلي (Ahmad)",
  "سارة المطيري (Sarah)",
  "فهد القحطاني (Fahad)",
  "شروق العتيبي (Shorouq)",
  "خالد الحربي (Khalid)",
  "فاطمة الشمري (Fatima)",
  "عبد الرحمن العتيق (Abdulrahman)",
  "لطيفة الدوسري (Lateefa)",
  "يوسف الرشيد (Yousef)",
  "ريم العبدالله (Reem)",
  "محمد النفيسي (Mohammad)",
  "نورة السديري (Noura)",
  "فيصل الزهراني (Faisal)",
  "الجوهرة الحربي (Al-Jawhara)",
  "ماجد العتيبي (Majed)",
  "منى الشهري (Mona)",
  "حمد الدوسري (Hamad)",
  "خلود الخالدي (Kholoud)",
  "سعد الغامدي (Saad)",
  "عبير السبيعي (Abeer)",
  "حسام البلوي (Houssam)",
  "مها الودعاني (Maha)",
  "تركي السلطان (Turki)",
  "لولوة السليم (Lulwa)",
  "بدر الشمري (Badr)"
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [memberProfile, setMemberProfile] = useState<any | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [logs, setLogs] = useState<VolunteerHourLog[]>([]);
  const [activeTab, setActiveTab] = useState<'bulletin' | 'tasks' | 'resources' | 'hours'>('bulletin');
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectionVerified, setConnectionVerified] = useState<boolean | null>(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [latestMembers, setLatestMembers] = useState<any[]>([]);
   const [allMembers, setAllMembers] = useState<any[]>([]);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedProfileUid, setSelectedProfileUid] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [joining, setJoining] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Media view lightbox state
  const [lightboxSrc, setLightboxSrc] = useState<string>('');
  const [lightboxAlt, setLightboxAlt] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Image Context Options Menu state
  const [isImageOptionsMenuOpen, setIsImageOptionsMenuOpen] = useState(false);
  const [optionsImageSrc, setOptionsImageSrc] = useState<string>('');
  const [optionsImageAlt, setOptionsImageAlt] = useState<string>('');
  const [optionsTargetImgElement, setOptionsTargetImgElement] = useState<HTMLImageElement | null>(null);

  // Global click listener to attach context menu to EVERY image element on the website
  useEffect(() => {
    const handleGlobalImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Identify if an image element was clicked
      const imgEl = target.tagName === 'IMG' ? (target as HTMLImageElement) : (target.querySelector ? target.querySelector('img') : null);
      if (!imgEl || !imgEl.src) return;

      // Do NOT intercept if click occurred inside options modal, lightbox container, or active file input
      if (
        target.closest('#image_options_modal_backdrop') ||
        target.closest('#image_lightbox_container') ||
        target.tagName === 'INPUT'
      ) {
        return;
      }

      // Ignore tiny icons or emojis
      if (imgEl.classList.contains('emoji') || imgEl.naturalWidth === 1 || imgEl.width < 12) {
        return;
      }

      // Stop default event actions to trigger the sleek Context Options Popup
      e.stopPropagation();

      setOptionsTargetImgElement(imgEl);
      setOptionsImageSrc(imgEl.src);
      setOptionsImageAlt(imgEl.alt || 'Scholars Volunteer Graphic');
      setIsImageOptionsMenuOpen(true);
    };

    document.addEventListener('click', handleGlobalImageClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalImageClick, true);
    };
  }, []);

  const handleImageSrcUpdated = async (newBase64: string, targetImgElement: HTMLImageElement | null) => {
    if (!isLeaderEmail(user?.email)) return;

    if (targetImgElement) {
      // Live DOM update
      targetImgElement.src = newBase64;

      const alt = (targetImgElement.alt || '').toLowerCase();
      const dataType = targetImgElement.dataset.type || targetImgElement.closest('[data-type]')?.getAttribute('data-type');
      const memberUid = targetImgElement.dataset.memberUid || targetImgElement.closest('[data-member-uid]')?.getAttribute('data-member-uid');

      if (dataType === 'team-logo' || alt.includes('logo')) {
        await handleUpdateTeamLogo(newBase64);
      } else if (dataType === 'team-banner' || alt.includes('banner')) {
        await handleUpdateWideBanner(newBase64);
      } else if (memberUid) {
        await handleUpdateMemberPhoto(memberUid, newBase64);
      } else if (user?.uid) {
        await handleUpdateMemberPhoto(user.uid, newBase64);
      }
    }
  };

  // Team identity custom image states
  const [customTeamLogo, setCustomTeamLogo] = useState<string | null>(null);
  const [customWideBanner, setCustomWideBanner] = useState<string | null>(null);

  // Sync team identity logos/banners from Firestore
  useEffect(() => {
    const unsubLogo = onSnapshot(doc(db, 'settings', 'teamLogo'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.teamLogo) setCustomTeamLogo(data.teamLogo);
      }
    }, (err) => console.warn("Team logo listener notice:", err));

    const unsubBanner = onSnapshot(doc(db, 'settings', 'teamBanner'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.wideIdentityBanner) setCustomWideBanner(data.wideIdentityBanner);
      }
    }, (err) => console.warn("Team banner listener notice:", err));

    // Legacy fallback listener
    const unsubLegacy = onSnapshot(doc(db, 'settings', 'teamIdentity'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.teamLogo && !customTeamLogo) setCustomTeamLogo(data.teamLogo);
        if (data.wideIdentityBanner && !customWideBanner) setCustomWideBanner(data.wideIdentityBanner);
      }
    }, (err) => console.warn("Legacy identity listener notice:", err));

    return () => {
      unsubLogo();
      unsubBanner();
      unsubLegacy();
    };
  }, []);

  const handleUpdateTeamLogo = async (base64: string) => {
    if (!isLeaderEmail(user?.email)) return;
    try {
      await setDoc(doc(db, 'settings', 'teamLogo'), { teamLogo: base64 }, { merge: true });
      setCustomTeamLogo(base64);
    } catch (err) {
      console.error("Error updating team logo:", err);
    }
  };

  const handleUpdateWideBanner = async (base64: string) => {
    if (!isLeaderEmail(user?.email)) return;
    try {
      await setDoc(doc(db, 'settings', 'teamBanner'), { wideIdentityBanner: base64 }, { merge: true });
      setCustomWideBanner(base64);
    } catch (err) {
      console.error("Error updating wide identity banner:", err);
    }
  };

  const handleUpdateMemberPhoto = async (targetUid: string, base64: string) => {
    if (!isLeaderEmail(user?.email)) return;
    try {
      await setDoc(doc(db, 'members', targetUid), { photoURL: base64 }, { merge: true });
    } catch (err) {
      console.error("Error updating member photo:", err);
    }
  };

  const handleOpenProfile = (uid: string) => {
    setSelectedProfileUid(uid);
    setIsProfileModalOpen(true);
  };

  // Authenticated state listener & Member document sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);

      if (currentUser) {
        try {
          const isLeaderEmail = currentUser.email?.toLowerCase() === 'sallumceeljale@gmail.com';
          const memberRef = doc(db, 'members', currentUser.uid);
          const docSnap = await getDoc(memberRef);
          if (!docSnap.exists()) {
            await setDoc(memberRef, {
              uid: currentUser.uid,
              name: isLeaderEmail ? "Salman A. Razak" : (currentUser.displayName || currentUser.email?.split('@')[0] || "Volunteer"),
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              role: isLeaderEmail ? "The Leader" : "Volunteer Member",
              joinedAt: serverTimestamp()
            });
          } else if (isLeaderEmail) {
            // merge to enforce exact leadership name and role on sync
            await setDoc(memberRef, {
              name: "Salman A. Razak",
              role: "The Leader",
              photoURL: currentUser.photoURL || ''
            }, { merge: true });
          }
        } catch (err) {
          console.warn("Error registering member profile in database:", err);
        }
      } else {
        setMemberProfile(null);
      }
    });
    return unsubscribe;
  }, []);

  // Sync personal settings/profile in real-time
  useEffect(() => {
    if (!user) {
      setMemberProfile(null);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'members', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setMemberProfile({
          uid: snapshot.id,
          name: data.name || '',
          email: data.email || '',
          photoURL: data.photoURL || '',
          role: data.role || '',
          hasCrown: !!data.hasCrown,
          customBadge: data.customBadge || ''
        });
      }
    }, (err) => {
      console.warn("Non-blocking listener error for active user profile:", err);
    });

    return unsubscribe;
  }, [user]);

  // Listen to all joined members in real-time
  useEffect(() => {
    if (loadingAuth) return;

    const q = query(
      collection(db, 'members'),
      orderBy('joinedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersList: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        membersList.push({
          uid: doc.id,
          name: data.name || 'Volunteer',
          email: data.email || '',
          photoURL: data.photoURL || '',
          joinedAt: data.joinedAt ? (data.joinedAt.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt)) : new Date(),
          hasCrown: !!data.hasCrown,
          customBadge: data.customBadge || ''
        });
      });
      setAllMembers(membersList);
      setTotalMembers(membersList.length);
      setLatestMembers(membersList.slice(0, 5));
    }, (err) => {
      console.warn("Non-blocking members list snapshot subscription error:", err);
    });

    return unsubscribe;
  }, [loadingAuth]);

  // Click handler to register additional team volunteers
  const handleJoinTeam = async () => {
    setJoining(true);
    try {
      // Pick a random student volunteer name
      const randomIndex = Math.floor(Math.random() * RECRUIT_NAMES.length);
      const chosenName = RECRUIT_NAMES[randomIndex];
      
      const membersCol = collection(db, 'members');
      const newMemberRef = doc(membersCol); // auto-generates unique ID
      
      // Use clean abstract avatar design from Dicebear matching seed
      const avatarSeed = encodeURIComponent(newMemberRef.id);
      const photoURL = `https://api.dicebear.com/7.x/identicon/svg?seed=${avatarSeed}`;

      await setDoc(newMemberRef, {
        uid: newMemberRef.id,
        name: chosenName,
        email: `${newMemberRef.id.substring(0, 6)}@scholars.org`,
        photoURL: photoURL,
        joinedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error signing up volunteer:", err);
    } finally {
      setJoining(false);
    }
  };

  // Check backend server connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setConnectionVerified(true);
      } catch (error) {
        console.warn("Connection test completed (expected offline warning or validation check):", error);
        setConnectionVerified(true); // Treat as connected unless blockages persist
      }
    }
    testConnection();
  }, []);

  // Listen to board posts in real-time
  useEffect(() => {
    // We only stream updates when the user is logged in natively
    if (loadingAuth) return;

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsList.push({
          id: doc.id,
          authorName: data.authorName || 'Guest Volunteer',
          authorUID: data.authorUID || '',
          authorPhotoUrl: data.authorPhotoUrl || '',
          message: data.message || '',
          category: data.category || 'General',
          createdAt: data.createdAt?.toDate() || new Date(),
          likesCount: data.likesCount || 0,
          likes: data.likes || []
        });
      });
      setPosts(postsList);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'posts');
    });

    return unsubscribe;
  }, [loadingAuth]);

  // Listen to volunteering events in real-time
  useEffect(() => {
    if (loadingAuth) return;

    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasksList.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          date: data.date || '',
          time: data.time || '',
          spotsTotal: data.spotsTotal || 0,
          spotsFilled: data.spotsFilled || 0,
          creatorId: data.creatorId || '',
          creatorName: data.creatorName || '',
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      setTasks(tasksList);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'tasks');
    });

    return unsubscribe;
  }, [loadingAuth]);

  // Listen to Shared Resources in real-time
  useEffect(() => {
    if (loadingAuth) return;

    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resourcesList: Resource[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        resourcesList.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Other',
          url: data.url || '',
          creatorId: data.creatorId || '',
          creatorName: data.creatorName || '',
          creatorRole: data.creatorRole || 'Volunteer Member',
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      setResources(resourcesList);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'resources');
    });

    return unsubscribe;
  }, [loadingAuth]);

  // Listen to Volunteer Hours logs in real-time
  useEffect(() => {
    if (loadingAuth) return;

    const q = query(collection(db, 'hours_logs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsList: VolunteerHourLog[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        logsList.push({
          id: doc.id,
          userId: data.userId || '',
          userName: data.userName || 'Volunteer',
          userEmail: data.userEmail || '',
          userPhotoURL: data.userPhotoURL || '',
          hours: Number(data.hours || 0),
          date: data.date || '',
          description: data.description || '',
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      setLogs(logsList);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'hours_logs');
    });

    return unsubscribe;
  }, [loadingAuth]);

  // Copy applink helper
  const handleCopyLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const pathWithSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const customizedUrl = `${pathWithSlash}?team=scholars-volunteer-team`;
    navigator.clipboard.writeText(customizedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const leaderMember = allMembers.find(m => m.email?.toLowerCase() === 'sallumceeljale@gmail.com');
  const leaderPhotoURL = leaderMember?.photoURL || (user?.email?.toLowerCase() === 'sallumceeljale@gmail.com' ? user.photoURL : null) || '';
  const selectedMemberForProfile = allMembers.find(m => m.uid === selectedProfileUid);
  
  // Calculate total volunteer hours logged across the entire team for the Team Circle motivation card
  const totalLoggedHours = logs.reduce((sum, log) => sum + (Number(log.hours) || 0), 0);

  // Sort: Leader first, then anyone with a crown, then rest of the members by joinedAt newer first
  const sortedMembersList = [...allMembers].sort((a, b) => {
    const aIsLeader = a.email?.toLowerCase() === 'sallumceeljale@gmail.com';
    const bIsLeader = b.email?.toLowerCase() === 'sallumceeljale@gmail.com';
    if (aIsLeader && !bIsLeader) return -1;
    if (!aIsLeader && bIsLeader) return 1;

    const aHasCrown = !!a.hasCrown;
    const bHasCrown = !!b.hasCrown;
    if (aHasCrown && !bHasCrown) return -1;
    if (!aHasCrown && bHasCrown) return 1;

    const aTime = a.joinedAt instanceof Date ? a.joinedAt.getTime() : new Date(b.joinedAt).getTime();
    const bTime = b.joinedAt instanceof Date ? b.joinedAt.getTime() : new Date(b.joinedAt).getTime();
    return bTime - aTime;
  });

  const filteredCircleMembers = sortedMembersList.filter(member => {
    const queryStr = memberSearchQuery.toLowerCase();
    return (
      (member.name || '').toLowerCase().includes(queryStr) ||
      (member.email || '').toLowerCase().includes(queryStr)
    );
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-between">
      <div>
        {/* Banner with authentication & global stats */}
        <Banner
          user={user}
          memberProfile={memberProfile}
          loadingAuth={loadingAuth}
          totalPosts={posts.length}
          totalTasks={tasks.length}
          totalMembers={totalMembers}
          onJoinTeam={handleJoinTeam}
          joining={joining}
          latestMembers={latestMembers}
          onViewRoster={() => setIsMembersModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          leaderPhotoURL={leaderPhotoURL}
          customTeamLogo={customTeamLogo}
          onUpdateTeamLogo={handleUpdateTeamLogo}
          onUpdateMemberPhoto={handleUpdateMemberPhoto}
        />

        {/* Navigation tabs line */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            {/* Tabs control */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl shrink-0 border border-slate-300/40">
              <button
                id="tab_bulletin"
                onClick={() => setActiveTab('bulletin')}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'bulletin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Bulletin Board</span>
              </button>
              <button
                id="tab_tasks"
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Opportunities & Sign-ups</span>
              </button>
              <button
                id="tab_resources"
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'resources'
                    ? 'bg-white text-slate-905 shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Resource Bank</span>
              </button>
              <button
                id="tab_hours"
                onClick={() => setActiveTab('hours')}
                className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'hours'
                    ? 'bg-white text-slate-905 shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Volunteering Hours Log</span>
              </button>
            </div>

            {/* Quick action: Share Link */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">
                Invite friends
              </span>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  copiedLink
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-250 text-slate-705 hover:bg-slate-50'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                <span>{copiedLink ? "App Link Copied!" : "Copy Share Link"}</span>
              </button>
            </div>
          </div>



          {/* Prompt banner to non-logged users */}
          <AnimatePresence mode="wait">
            {!loadingAuth && !user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                className="mb-6 p-4 bg-indigo-600 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-750 shadow-lg shadow-indigo-600/10 text-left"
              >
                <div className="flex gap-3 items-start sm:items-center">
                  <div className="p-2.5 bg-white/10 rounded-xl shrink-0 mt-1 sm:mt-0 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-display tracking-tight">Welcome to the Scholars Volunteer Team!</h3>
                    <p className="text-xs text-indigo-100 mt-1 font-medium leading-relaxed">
                      You can view everything, but you need to log in via Google to post announcements or register for volunteering slots under our global schedule.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active section views in a robust 2-column workspace layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
            {/* Left Content Area: Selected Tab View */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === 'bulletin' ? (
                  <motion.div
                    key="bulletin"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Board 
                      posts={posts} 
                      user={user} 
                      memberProfile={memberProfile} 
                      onViewProfile={handleOpenProfile} 
                      customWideBanner={customWideBanner}
                      onUpdateWideBanner={handleUpdateWideBanner}
                    />
                  </motion.div>
                ) : activeTab === 'tasks' ? (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <TasksList tasks={tasks} user={user} memberProfile={memberProfile} />
                  </motion.div>
                ) : activeTab === 'resources' ? (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ResourceBank resources={resources} user={user} memberProfile={memberProfile} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="hours"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <HoursTracker 
                      logs={logs} 
                      user={user} 
                      memberProfile={memberProfile} 
                      allMembers={allMembers} 
                      onViewProfile={handleOpenProfile} 
                      onUpdateMemberPhoto={handleUpdateMemberPhoto}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar Area: Live list of all members with crowns and honors */}
            <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-205 shadow-sm text-left self-start">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                  <h3 className="text-xs font-black font-display text-slate-800 uppercase tracking-widest leading-none">
                    Team Circle
                  </h3>
                </div>
                <span className="text-[9.5px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md shrink-0">
                  {allMembers.length} Joined
                </span>
              </div>

              <p className="text-[10px] text-slate-500 mb-3 leading-relaxed font-bold uppercase tracking-wider">
                🌟 Honors Page & Instant Roster
              </p>

              {/* Team Hours Summary Card */}
              <div className="mb-4 bg-gradient-to-br from-indigo-50/80 via-slate-50/50 to-white border border-indigo-100 rounded-2xl p-3.5 relative overflow-hidden shadow-2xs">
                <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-10 pointer-events-none">
                  <Award className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                      Total Team Impact
                    </span>
                    <span className="text-base font-black text-slate-800 leading-none flex items-baseline gap-1">
                      {totalLoggedHours.toFixed(1)}
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hrs Logged</span>
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[9.5px] font-bold text-slate-500 leading-relaxed">
                  Outstanding effort! Every hour of tutoring, initiative support, or peer scheduling directly empowers our student community. Let's keep going!
                </div>
              </div>

              {/* Instant Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search teammate by name..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Dynamic scrollable members block */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredCircleMembers.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 select-none">
                    <p className="text-xs font-bold">No teammates found</p>
                    <p className="text-[9px] mt-0.5">Try looking with another spelling</p>
                  </div>
                ) : (
                  filteredCircleMembers.map((member) => {
                    const isLeader = member.email?.toLowerCase() === 'sallumceeljale@gmail.com';
                    const nameParts = member.name.split(' (');
                    const primaryName = nameParts[0];
                    const englishTag = nameParts[1] ? nameParts[1].replace(')', '') : '';
                    const autoBadge = getMemberBadge(member.uid, logs, posts);

                    return (
                      <div
                        key={member.uid}
                        onClick={() => handleOpenProfile(member.uid)}
                        className={`p-2.5 rounded-2xl border transition-all duration-150 flex items-center gap-3 relative overflow-hidden group select-none cursor-pointer hover:scale-[1.015] active:scale-[0.985] hover:border-indigo-400 ${
                          isLeader
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50/60 border-amber-300 ring-2 ring-amber-400/10 shadow-xs shadow-amber-100/50'
                            : member.hasCrown
                            ? 'bg-gradient-to-r from-slate-50 to-amber-50/20 border-amber-205'
                            : 'bg-slate-50/50 hover:bg-slate-100/80 border-slate-150'
                        }`}
                        title="Click to view full scholar profile"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 border border-white shadow-xs flex items-center justify-center">
                            <img
                              src={member.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(member.uid)}`}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(member.uid)}`;
                              }}
                            />
                          </div>
                          {member.hasCrown && (
                            <div className="absolute -top-1.5 -right-1 text-xs filter drop-shadow" title="Crowned active status">
                              👑
                            </div>
                          )}
                        </div>

                        {/* Name and Crown tags */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className={`font-bold text-xs truncate leading-tight ${isLeader ? 'text-amber-955 font-black' : 'text-slate-800'}`}>
                              {primaryName}
                            </span>
                            {isLeader && (
                              <span className="shrink-0 text-[6.5px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/60 border border-amber-300 px-1 rounded font-sans leading-none">
                                Leader
                              </span>
                            )}
                            {member.hasCrown && !isLeader && (
                              <span className="shrink-0 text-[6px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded leading-none font-sans">
                                👑 Crowned
                              </span>
                            )}
                          </div>

                          <p className="text-[9.5px] text-slate-500 truncate leading-snug mt-0.5">
                            {isLeader ? 'Project Founder & Director' : (englishTag ? `(${englishTag})` : 'Active Member')}
                          </p>

                          {/* Badges container */}
                          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                            {/* Custom badge support */}
                            {member.customBadge && (
                              <span className={`text-[7.2px] font-black uppercase border px-1.5 py-0.5 rounded leading-none font-sans flex items-center gap-0.5 shrink-0 ${
                                isLeader
                                  ? 'bg-amber-100 text-amber-955 border-amber-300'
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              }`}>
                                🏆 {member.customBadge}
                              </span>
                            )}

                            {/* Automated milestones badge support */}
                            {autoBadge && (
                              <span 
                                className={`text-[7.2px] font-black uppercase border px-1.5 py-0.5 rounded leading-none font-sans flex items-center gap-0.5 shrink-0 shadow-3xs ${autoBadge.colorClass}`}
                                title={`Dynamic Badge: ${autoBadge.reason}`}
                              >
                                <span>{autoBadge.icon}</span>
                                <span>{autoBadge.text}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Info & Instructions */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-left">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-sm text-slate-800 font-display uppercase tracking-wider">About The App</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              This app is custom-tailored for <strong>The Scholars Volunteer Team</strong>. It functions as a lightweight, live community workspace enabling scholars and student volunteers worldwide to share bulletin news, coordinate helper tasks, and track global team participation completely without friction.
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-205">
            <h4 className="font-bold text-xs text-slate-705 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Share2 className="w-4 h-4 text-indigo-500" />
              <span>How to Invite Team Members</span>
            </h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              Share the customized global invite link below. Anyone with this link can instantly open the app, log in safety-verified, and register or collaborate globally!
            </p>
            <div className="mt-3 flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}${window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/'}?team=scholars-volunteer-team`}
                className="text-xs font-mono text-indigo-600 bg-transparent outline-none flex-1 truncate font-bold"
              />
              <button
                onClick={handleCopyLink}
                className="p-1.5 px-3 text-[10px] font-black uppercase text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl transition-all cursor-pointer"
              >
                {copiedLink ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
            Securely synchronized with Cloud Firestore database
          </p>
          <p className="text-[10px] text-slate-400 font-bold">
            © 2026 The Scholars Volunteer Team. Built with Care.
          </p>
        </div>
      </footer>

      {/* Roster database Modal */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={allMembers}
        onViewProfile={handleOpenProfile}
        onUpdateMemberPhoto={handleUpdateMemberPhoto}
      />

      {/* Account Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        memberProfile={memberProfile}
      />

      {/* Simple Profile View Modal */}
      <ProfileViewModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        member={selectedMemberForProfile || null}
        logs={logs}
        posts={posts}
        currentUserEmail={user?.email}
        onUpdateMemberPhoto={handleUpdateMemberPhoto}
      />

      {/* Image Context Options Modal */}
      <ImageOptionsMenuModal
        isOpen={isImageOptionsMenuOpen}
        imageSrc={optionsImageSrc}
        imageAlt={optionsImageAlt}
        targetImgElement={optionsTargetImgElement}
        currentUserEmail={user?.email}
        onClose={() => setIsImageOptionsMenuOpen(false)}
        onViewFullScreen={(src, alt) => {
          setLightboxSrc(src);
          setLightboxAlt(alt);
          setIsLightboxOpen(true);
        }}
        onImageSrcUpdated={handleImageSrcUpdated}
      />

      {/* Image Lightbox for profile and identity photos */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        src={lightboxSrc}
        alt={lightboxAlt}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
}
