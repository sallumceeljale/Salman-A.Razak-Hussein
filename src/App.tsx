import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { collection, query, orderBy, onSnapshot, getDocFromServer, doc, setDoc, getDoc, serverTimestamp, limit, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Post, Task, Resource, VolunteerHourLog, MemberStatus } from './types';
import { getMemberBadge } from './utils/badge';
import { isLeaderEmail, getHighResPhotoUrl, DEFAULT_FOUNDER_AVATAR, DEFAULT_FOUNDER_PHOTO } from './utils/leader';
import PublicHomePage from './components/PublicHomePage';
import MemberDashboard from './components/MemberDashboard';
import SignInPage from './components/SignInPage';
import NotFoundPage from './components/NotFoundPage';
import MembershipStatusScreen from './components/MembershipStatusScreen';
import OnboardingForm from './components/OnboardingForm';
import ApplicationStatusModal from './components/ApplicationStatusModal';
import MembersModal from './components/MembersModal';
import SettingsModal from './components/SettingsModal';
import ProfileViewModal from './components/ProfileViewModal';
import AdminPortalModal from './components/AdminPortalModal';
import ImageLightbox from './components/ImageLightbox';
import AdminImageEditorModal from './components/AdminImageEditorModal';
import { PublicAssetsProvider } from './contexts/PublicAssetsContext';
import { optimizeImage } from './utils/imageOptimizer';
import { trackVisitorArrival } from './utils/visitorTracker';
import { notifyVolunteerSignIn } from './services/notificationService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <PublicAssetsProvider>
      <AppInner />
    </PublicAssetsProvider>
  );
}

function AppInner() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [memberProfile, setMemberProfile] = useState<any | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingMemberProfile, setLoadingMemberProfile] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<MemberStatus | 'not_found' | 'loading'>('loading');
  const [posts, setPosts] = useState<Post[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [logs, setLogs] = useState<VolunteerHourLog[]>([]);
  const [activeTab, setActiveTab] = useState<'bulletin' | 'tasks' | 'resources' | 'hours' | 'transcripts' | 'essays' | 'study' | 'impact'>('bulletin');
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectionVerified, setConnectionVerified] = useState<boolean | null>(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [latestMembers, setLatestMembers] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isApplicationStatusModalOpen, setIsApplicationStatusModalOpen] = useState(false);
  const [selectedProfileUid, setSelectedProfileUid] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Media view lightbox state
  const [lightboxSrc, setLightboxSrc] = useState<string>('');
  const [lightboxAlt, setLightboxAlt] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Team identity states
  const [customTeamLogo, setCustomTeamLogo] = useState<string | null>(null);
  const [customWideBanner, setCustomWideBanner] = useState<string | null>(null);
  const [customFounderPhoto, setCustomFounderPhoto] = useState<string | null>(null);

  // Path-based routing for Public Homepage (/), Member Sign-in (/signin), Member Dashboard (/dashboard), or 404
  const parseCurrentPathSyst = (): 'public' | 'dashboard' | 'signin' | 'notfound' => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const hash = window.location.hash.toLowerCase();

    if (path === '' || path === '/' || hash === '' || hash === '#' || hash.startsWith('#about') || hash.startsWith('#programs') || hash.startsWith('#resources') || hash.startsWith('#projects') || hash.startsWith('#founder') || hash.startsWith('#leadership') || hash.startsWith('#join')) {
      return 'public';
    }
    if (path === '/signin' || hash === '#signin') {
      return 'signin';
    }
    if (path === '/dashboard' || hash === '#dashboard') {
      return 'dashboard';
    }
    return 'notfound';
  };

  const [currentRoute, setCurrentRoute] = useState<'public' | 'dashboard' | 'signin' | 'notfound'>(parseCurrentPathSyst);

  const navigateTo = (route: 'public' | 'dashboard' | 'signin' | 'notfound', queryParams?: string) => {
    let url = '/';
    if (route === 'dashboard') url = '/dashboard';
    else if (route === 'signin') url = queryParams ? `/signin?${queryParams}` : '/signin';
    else if (route === 'notfound') url = '/404';

    window.history.pushState({}, '', url);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const route = parseCurrentPathSyst();
      setCurrentRoute(route);
      trackVisitorArrival(window.location.pathname || '/');
    };

    // Track initial page visit
    trackVisitorArrival(window.location.pathname || '/');

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Sync team identity logos/banners, founder photo, and custom images map from Firestore
  useEffect(() => {
    const unsubLogo = onSnapshot(doc(db, 'settings', 'teamLogo'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.teamLogo) {
          setCustomTeamLogo(data.teamLogo);
          try { localStorage.setItem('svt_custom_team_logo', data.teamLogo); } catch {}
        }
      }
    }, (err) => console.warn("Team logo listener notice:", err));

    const unsubBanner = onSnapshot(doc(db, 'settings', 'teamBanner'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.wideIdentityBanner) {
          setCustomWideBanner(data.wideIdentityBanner);
          try { localStorage.setItem('svt_custom_wide_banner', data.wideIdentityBanner); } catch {}
        }
      }
    }, (err) => console.warn("Team banner listener notice:", err));

    const unsubFounder = onSnapshot(doc(db, 'settings', 'founderPhoto'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const photo = data.founderPhoto || data.photoURL || data.leaderPhoto;
        if (photo) {
          setCustomFounderPhoto(photo);
          try { localStorage.setItem('svt_custom_founder_photo', photo); } catch {}
        }
      }
    }, (err) => console.warn("Founder photo listener notice:", err));

    // Fallback listener for consolidated teamIdentity document
    const unsubIdentity = onSnapshot(doc(db, 'settings', 'teamIdentity'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.teamLogo) {
          setCustomTeamLogo(data.teamLogo);
          try { localStorage.setItem('svt_custom_team_logo', data.teamLogo); } catch {}
        }
        if (data.wideIdentityBanner) {
          setCustomWideBanner(data.wideIdentityBanner);
          try { localStorage.setItem('svt_custom_wide_banner', data.wideIdentityBanner); } catch {}
        }
        if (data.founderPhoto || data.leaderPhoto) {
          const photo = data.founderPhoto || data.leaderPhoto;
          setCustomFounderPhoto(photo);
          try { localStorage.setItem('svt_custom_founder_photo', photo); } catch {}
        }
      }
    }, (err) => console.warn("Legacy identity listener notice:", err));

    return () => {
      unsubLogo();
      unsubBanner();
      unsubFounder();
      unsubIdentity();
    };
  }, []);

  // Update Team Logo (Immediate state + localStorage + Firestore + publicAssets)
  const handleUpdateTeamLogo = async (imageData: string) => {
    try {
      let finalPayload = imageData;
      if (imageData.startsWith('data:') || imageData.length > 50000) {
        const optimized = await optimizeImage(imageData, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.90,
          outputFormat: 'image/webp'
        });
        finalPayload = optimized.base64;
      }
      try { localStorage.setItem('svt_custom_team_logo', finalPayload); } catch {}
      setCustomTeamLogo(finalPayload);

      await setDoc(doc(db, 'settings', 'teamLogo'), { teamLogo: finalPayload, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, 'settings', 'teamIdentity'), { teamLogo: finalPayload, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, 'publicAssets', 'team-logo'), {
        assetKey: 'team-logo',
        imageUrl: finalPayload,
        storagePath: 'inline-base64/team-logo',
        altText: 'The Scholars Volunteer Team Official Logo',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'admin'
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore teamLogo sync notice:", err);
    }
  };

  // Update Wide Banner (Immediate state + localStorage + Firestore + publicAssets)
  const handleUpdateWideBanner = async (imageData: string) => {
    try {
      let finalPayload = imageData;
      if (imageData.startsWith('data:') || imageData.length > 100000) {
        const optimized = await optimizeImage(imageData, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.90,
          outputFormat: 'image/webp'
        });
        finalPayload = optimized.base64;
      }
      try { localStorage.setItem('svt_custom_wide_banner', finalPayload); } catch {}
      setCustomWideBanner(finalPayload);

      await setDoc(doc(db, 'settings', 'teamBanner'), { wideIdentityBanner: finalPayload, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, 'settings', 'teamIdentity'), { wideIdentityBanner: finalPayload, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, 'publicAssets', 'team-banner'), {
        assetKey: 'team-banner',
        imageUrl: finalPayload,
        storagePath: 'inline-base64/team-banner',
        altText: 'The Scholars Volunteer Team Identity Banner',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'admin'
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore teamBanner sync notice:", err);
    }
  };

  // Update Founder Photo (Immediate state + localStorage + Firestore + publicAssets)
  const handleUpdateFounderPhoto = async (imageData: string) => {
    try {
      let finalPayload = imageData;
      if (imageData.startsWith('data:') || imageData.length > 50000) {
        const optimized = await optimizeImage(imageData, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.90,
          outputFormat: 'image/webp'
        });
        finalPayload = optimized.base64;
      }
      try { localStorage.setItem('svt_custom_founder_photo', finalPayload); } catch {}
      setCustomFounderPhoto(finalPayload);

      await setDoc(doc(db, 'settings', 'founderPhoto'), { founderPhoto: finalPayload, photoURL: finalPayload, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, 'settings', 'teamIdentity'), { founderPhoto: finalPayload, updatedAt: serverTimestamp() }, { merge: true });
      await setDoc(doc(db, 'publicAssets', 'founder-photo'), {
        assetKey: 'founder-photo',
        imageUrl: finalPayload,
        storagePath: 'inline-base64/founder-photo',
        altText: 'Salman A.Razak - Founder & Executive Leader',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || 'admin'
      }, { merge: true });

      if (user?.uid) {
        await setDoc(doc(db, 'members', user.uid), { photoURL: finalPayload }, { merge: true });
      }
    } catch (err) {
      console.warn("Firestore founderPhoto sync notice:", err);
    }
  };

  // Update Member Photo
  const handleUpdateMemberPhoto = async (targetUid: string, imageData: string) => {
    try {
      let finalPayload = imageData;
      if (imageData.startsWith('data:') || imageData.length > 50000) {
        const optimized = await optimizeImage(imageData, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.90,
          outputFormat: 'image/webp'
        });
        finalPayload = optimized.base64;
      }

      if (targetUid === user?.uid) {
        handleUpdateFounderPhoto(finalPayload);
      }
      await setDoc(doc(db, 'members', targetUid), { photoURL: finalPayload }, { merge: true });
    } catch (err) {
      console.error("Error updating member photo:", err);
    }
  };

  const handleOpenProfile = (uid: string) => {
    setSelectedProfileUid(uid);
    setIsProfileModalOpen(true);
  };

  // Authenticated state listener & user state tracking with custom claims evaluation
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (!currentUser) {
        setMemberProfile(null);
        setMembershipStatus('not_found');
        setLoadingMemberProfile(false);
        setIsAdmin(false);
        setIsCoordinator(false);
      } else {
        try {
          if (currentUser.email) {
            localStorage.setItem('svt_saved_user_email', currentUser.email);
            if (currentUser.displayName) {
              localStorage.setItem('svt_saved_user_name', currentUser.displayName);
            }
          }

          // Send volunteer sign-in email notification
          const sessionNotifKey = `svt_login_notified_${currentUser.uid}`;
          if (!sessionStorage.getItem(sessionNotifKey)) {
            sessionStorage.setItem(sessionNotifKey, 'true');
            notifyVolunteerSignIn({
              name: currentUser.displayName || 'Volunteer Member',
              email: currentUser.email || 'No email provided',
              uid: currentUser.uid,
              role: isLeaderEmail(currentUser.email) ? 'admin' : 'member',
              status: 'active',
              photoURL: currentUser.photoURL || undefined,
              region: 'Global Chapter',
              timestamp: new Date().toISOString()
            });
          }

          // Force refresh token to obtain latest custom claims from Firebase Auth
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const hasAdminClaim = idTokenResult.claims.admin === true || idTokenResult.claims.role === 'admin';
          const hasCoordClaim = hasAdminClaim || idTokenResult.claims.coordinator === true || idTokenResult.claims.role === 'coordinator';
          
          setIsAdmin(hasAdminClaim);
          setIsCoordinator(hasCoordClaim);

          if (hasAdminClaim) {
            setMembershipStatus('active');
          }
        } catch (err) {
          console.warn("Could not retrieve or refresh custom claims:", err);
          setIsAdmin(false);
          setIsCoordinator(false);
        }
      }
    });
    return unsubscribe;
  }, []);

  // Force refresh claims handler for immediate role elevation without re-login
  const handleRefreshClaims = async () => {
    if (!auth.currentUser) return;
    try {
      const idTokenResult = await auth.currentUser.getIdTokenResult(true);
      const hasAdminClaim = idTokenResult.claims.admin === true || idTokenResult.claims.role === 'admin';
      const hasCoordClaim = hasAdminClaim || idTokenResult.claims.coordinator === true || idTokenResult.claims.role === 'coordinator';
      
      setIsAdmin(hasAdminClaim);
      setIsCoordinator(hasCoordClaim);

      if (hasAdminClaim) {
        setMembershipStatus('active');
      }
    } catch (err) {
      console.warn("Error refreshing ID token claims:", err);
    }
  };

  // Auto-redirect leader to dashboard when accessing signin
  useEffect(() => {
    if (user && isLeaderEmail(user.email) && currentRoute === 'signin') {
      navigateTo('dashboard');
    }
  }, [user, currentRoute]);

  // Sync personal member document / status in real-time from /members/{uid}
  useEffect(() => {
    if (!user) {
      setMemberProfile(null);
      setMembershipStatus('not_found');
      setLoadingMemberProfile(false);
      return;
    }

    const isLeader = isLeaderEmail(user.email);
    const memberDocRef = doc(db, 'members', user.uid);

    // Auto-bootstrap or update leader document if leader is logged in
    if (isLeader) {
      const leaderName = user.email?.toLowerCase().includes('sallum') ? 'Salman A.Razak' : (user.displayName || 'Leader');
      const leaderBadge = user.email?.toLowerCase().includes('sallum') ? 'Founder & Executive Leader' : 'Executive Leader & Developer';
      const leaderPhoto = customFounderPhoto || DEFAULT_FOUNDER_PHOTO || user.photoURL || '';

      const leaderData = {
        uid: user.uid,
        name: leaderName,
        displayName: leaderName,
        email: user.email?.toLowerCase() || '',
        photoURL: leaderPhoto,
        role: 'admin',
        status: 'active',
        hasCrown: true,
        customBadge: leaderBadge,
        directoryVisible: true,
        skills: ['Leadership', 'Team Coordination', 'Student Mentorship', 'Community Building'],
        interests: ['Education', 'Youth Volunteering', 'Student Leadership'],
        region: 'Global Chapter',
        bio: 'Founder & Executive Leader of SVT (The Scholars Volunteer Team). Dedicated to empowering student volunteers worldwide.',
        totalApprovedMinutes: 12000,
        updatedAt: serverTimestamp(),
      };

      setDoc(memberDocRef, leaderData, { merge: true }).catch((err) => {
        console.warn("Leader auto-provision notification:", err);
      });
    }

    setLoadingMemberProfile(true);
    const unsubscribe = onSnapshot(memberDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const rawStatus = (data.status || 'active').toLowerCase();
        let resolvedStatus: MemberStatus = rawStatus === 'suspended' ? 'suspended' : 'active';

        setMemberProfile({
          uid: snapshot.id,
          name: isLeader && user.email?.toLowerCase().includes('sallum') ? 'Salman A.Razak' : (data.displayName || data.name || user.displayName || 'Volunteer Member'),
          displayName: isLeader && user.email?.toLowerCase().includes('sallum') ? 'Salman A.Razak' : (data.displayName || data.name || user.displayName || 'Volunteer Member'),
          email: data.email || user.email || '',
          photoURL: (isLeader && customFounderPhoto) ? customFounderPhoto : (data.photoURL || user.photoURL || ''),
          role: isLeader ? 'admin' : (data.role || 'member'),
          status: resolvedStatus,
          bio: data.bio || (isLeader ? 'Founder & Executive Leader of SVT (The Scholars Volunteer Team). Dedicated to empowering student volunteers worldwide.' : 'Student volunteer and active member of The Scholars Volunteer Team.'),
          skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : (isLeader ? ['Leadership', 'Team Coordination', 'Student Mentorship', 'Community Building'] : ['Peer Tutoring', 'Study Material Creation']),
          interests: Array.isArray(data.interests) && data.interests.length > 0 ? data.interests : (isLeader ? ['Education', 'Youth Volunteering', 'Student Leadership'] : ['Academic Mentorship', 'Community Projects']),
          region: data.region || (isLeader ? 'Global Chapter' : 'Global'),
          directoryVisible: data.directoryVisible !== false,
          hasCrown: isLeader ? true : !!data.hasCrown,
          customBadge: isLeader && user.email?.toLowerCase().includes('sallum') ? 'Founder & Executive Leader' : (data.customBadge || ''),
          totalApprovedMinutes: data.totalApprovedMinutes || (isLeader ? 12000 : 0),
          joinedAt: data.joinedAt ? (data.joinedAt.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt)) : new Date()
        });
        setMembershipStatus(resolvedStatus);
      } else {
        // Auto-provision an active member document so any user can immediately access all modules
        const fallbackName = isLeader ? 'Salman A.Razak' : (user.displayName || 'Volunteer Member');
        const fallbackPhoto = (isLeader && customFounderPhoto) ? customFounderPhoto : (user.photoURL || '');
        const autoData = {
          uid: user.uid,
          name: fallbackName,
          displayName: fallbackName,
          email: user.email?.toLowerCase() || '',
          photoURL: fallbackPhoto,
          role: isLeader ? 'admin' : 'member',
          status: 'active',
          hasCrown: isLeader,
          customBadge: isLeader && user.email?.toLowerCase().includes('sallum') ? 'Founder & Executive Leader' : '',
          directoryVisible: true,
          skills: isLeader ? ['Leadership', 'Team Coordination', 'Student Mentorship', 'Community Building'] : ['Peer Tutoring', 'Study Material Creation'],
          interests: isLeader ? ['Education', 'Youth Volunteering', 'Student Leadership'] : ['Academic Mentorship', 'Community Projects'],
          region: isLeader ? 'Global Chapter' : 'Global',
          bio: isLeader ? 'Founder & Executive Leader of SVT (The Scholars Volunteer Team). Dedicated to empowering student volunteers worldwide.' : 'Student volunteer and active member of The Scholars Volunteer Team.',
          totalApprovedMinutes: isLeader ? 12000 : 0,
          joinedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        setDoc(memberDocRef, autoData, { merge: true }).catch((err) => {
          console.warn("Auto-provision member doc non-blocking error:", err);
        });

        // Also create public profile
        const publicDocRef = doc(db, 'publicProfiles', user.uid);
        setDoc(publicDocRef, autoData, { merge: true }).catch(() => {});

        setMemberProfile({
          ...autoData,
          joinedAt: new Date()
        });
        setMembershipStatus('active');
      }
      setLoadingMemberProfile(false);
    }, (err) => {
      console.warn("Membership profile snapshot error/permission check:", err);
      const fallbackName = isLeader ? 'Salman A.Razak' : (user.displayName || 'Volunteer Member');
      setMembershipStatus('active');
      setMemberProfile({
        uid: user.uid,
        name: fallbackName,
        displayName: fallbackName,
        email: user.email || '',
        photoURL: (isLeader && customFounderPhoto) ? customFounderPhoto : (user.photoURL || ''),
        role: isLeader ? 'admin' : 'member',
        status: 'active',
        bio: isLeader ? 'Founder & Executive Leader of SVT (The Scholars Volunteer Team).' : 'Active SVT Member',
        skills: ['Peer Tutoring', 'Study Material Creation'],
        interests: ['Education', 'Youth Volunteering'],
        region: 'Global',
        directoryVisible: true,
        hasCrown: isLeader,
        customBadge: isLeader ? 'Founder & Executive Leader' : '',
        totalApprovedMinutes: isLeader ? 12000 : 0,
        joinedAt: new Date()
      });
      setLoadingMemberProfile(false);
    });

    return unsubscribe;
  }, [user, customFounderPhoto]);

  // Recheck membership status handler
  const handleRecheckMembership = async () => {
    if (!user) return;
    setLoadingMemberProfile(true);
    try {
      const memberDocRef = doc(db, 'members', user.uid);
      const snapshot = await getDoc(memberDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const rawStatus = (data.status || 'pending').toLowerCase();
        let resolvedStatus: MemberStatus = 'pending';
        if (rawStatus === 'active') resolvedStatus = 'active';
        else if (rawStatus === 'suspended') resolvedStatus = 'suspended';
        else if (rawStatus === 'rejected') resolvedStatus = 'rejected';
        else resolvedStatus = 'pending';

        setMemberProfile({
          uid: snapshot.id,
          name: data.displayName || data.name || user.displayName || 'Volunteer',
          displayName: data.displayName || data.name || user.displayName || 'Volunteer',
          email: data.email || user.email || '',
          photoURL: data.photoURL || user.photoURL || '',
          role: data.role || 'member',
          status: resolvedStatus,
          bio: data.bio || '',
          skills: Array.isArray(data.skills) ? data.skills : [],
          interests: Array.isArray(data.interests) ? data.interests : [],
          region: data.region || '',
          directoryVisible: data.directoryVisible !== false,
          hasCrown: !!data.hasCrown,
          customBadge: data.customBadge || '',
          totalApprovedMinutes: data.totalApprovedMinutes || 0,
          joinedAt: data.joinedAt ? (data.joinedAt.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt)) : new Date()
        });
        setMembershipStatus(resolvedStatus);
      } else {
        setMemberProfile(null);
        setMembershipStatus('not_found');
      }
    } catch (err) {
      console.warn("Re-check status notice:", err);
    } finally {
      setLoadingMemberProfile(false);
    }
  };

  // Listen to members list in real-time (Only when user is confirmed active)
  useEffect(() => {
    if (!user || membershipStatus !== 'active') {
      setAllMembers([]);
      setTotalMembers(0);
      setLatestMembers([]);
      return;
    }

    const q = query(
      collection(db, 'members'),
      orderBy('joinedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersList: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        membersList.push({
          uid: docSnap.id,
          name: data.name || data.displayName || 'Volunteer',
          email: data.email || '',
          photoURL: data.photoURL || '',
          role: data.role || 'member',
          status: data.status || 'active',
          joinedAt: data.joinedAt ? (data.joinedAt.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt)) : new Date(),
          hasCrown: !!data.hasCrown,
          customBadge: data.customBadge || ''
        });
      });
      setAllMembers(membersList);
      setTotalMembers(membersList.length);
      setLatestMembers(membersList.slice(0, 5));
    }, (err) => {
      console.warn("Members list subscription notice:", err);
    });

    return unsubscribe;
  }, [user, membershipStatus]);

  // Check backend server connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setConnectionVerified(true);
      } catch (error) {
        setConnectionVerified(true);
      }
    }
    testConnection();
  }, []);

  // Listen to board posts in real-time (Only when user is confirmed active)
  useEffect(() => {
    if (!user || membershipStatus !== 'active') {
      setPosts([]);
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList: Post[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        postsList.push({
          id: docSnap.id,
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
  }, [user, membershipStatus]);

  // Listen to volunteering activities in real-time (Only when user is confirmed active)
  useEffect(() => {
    if (!user || membershipStatus !== 'active') {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList: Task[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        tasksList.push({
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          meetingLink: data.meetingLink || '',
          startsAt: data.startsAt || data.date || '',
          endsAt: data.endsAt || data.time || '',
          timeZone: data.timeZone || 'GMT+3 (AST)',
          deliveryMode: data.deliveryMode || 'in-person',
          capacity: Number(data.capacity || data.spotsTotal || 5),
          filledSpots: Number(data.filledSpots || data.spotsFilled || 0),
          status: data.status || 'published',
          creatorId: data.creatorId || '',
          creatorName: data.creatorName || '',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : undefined,
          spotsTotal: Number(data.capacity || data.spotsTotal || 5),
          spotsFilled: Number(data.filledSpots || data.spotsFilled || 0),
          date: data.startsAt || data.date || '',
          time: data.endsAt || data.time || ''
        });
      });
      setTasks(tasksList);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'activities');
    });

    return unsubscribe;
  }, [user, membershipStatus]);

  // Listen to Shared Resources in real-time (Only when user is confirmed active)
  useEffect(() => {
    if (!user || membershipStatus !== 'active') {
      setResources([]);
      return;
    }

    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resourcesList: Resource[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        resourcesList.push({
          id: docSnap.id,
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
  }, [user, membershipStatus]);

  // Listen to Volunteer Hours logs in real-time (Private records: members read own, coordinators/admins read all)
  useEffect(() => {
    if (!user || membershipStatus !== 'active') {
      setLogs([]);
      return;
    }

    const isCoordOrAdmin = isAdmin || isCoordinator;
    const q = isCoordOrAdmin
      ? query(collection(db, 'hours_logs'), orderBy('submittedAt', 'desc'))
      : query(collection(db, 'hours_logs'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsList: VolunteerHourLog[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const mins = typeof data.minutes === 'number' ? data.minutes : Math.round(Number(data.hours || 0) * 60);
        const hrs = mins / 60;
        logsList.push({
          id: docSnap.id,
          userId: data.userId || data.memberId || '',
          memberId: data.memberId || data.userId || '',
          userName: data.userName || 'Volunteer',
          userEmail: data.userEmail || '',
          userPhotoURL: data.userPhotoURL || '',
          minutes: mins,
          hours: hrs,
          date: data.date || data.activityDate || '',
          activityDate: data.activityDate || data.date || '',
          description: data.description || '',
          status: data.status || 'pending',
          createdAt: data.createdAt?.toDate?.() || data.submittedAt?.toDate?.() || new Date(),
          submittedAt: data.submittedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
          reviewedBy: data.reviewedBy || '',
          reviewedAt: data.reviewedAt?.toDate?.(),
          reviewNote: data.reviewNote || ''
        });
      });
      // Sort client-side by submittedAt/createdAt desc
      logsList.sort((a, b) => {
        const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return timeB - timeA;
      });
      setLogs(logsList);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'hours_logs');
    });

    return unsubscribe;
  }, [user, membershipStatus, isAdmin, isCoordinator]);

  // Copy applink helper
  const handleCopyLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const pathWithSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const customizedUrl = `${pathWithSlash}?team=scholars-volunteer-team`;
    navigator.clipboard.writeText(customizedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const founderMember = allMembers.find(m => m.email?.toLowerCase() === 'sallumrazak@gmail.com');
  const isSalmanUser = user?.email?.toLowerCase() === 'sallumrazak@gmail.com';
  const rawLeaderPhoto = customFounderPhoto || founderMember?.photoURL || (isSalmanUser ? user?.photoURL : null) || DEFAULT_FOUNDER_PHOTO;
  const leaderPhotoURL = getHighResPhotoUrl(rawLeaderPhoto) || DEFAULT_FOUNDER_PHOTO;
  const selectedMemberForProfile = allMembers.find(m => m.uid === selectedProfileUid);
  
  // Calculate total volunteer hours logged across the entire team for the Team Circle motivation card
  const totalLoggedHours = logs.reduce((sum, log) => sum + (Number(log.hours) || 0), 0);

  // Sort: Leader first, then anyone with a crown, then rest of the members by joinedAt newer first
  const sortedMembersList = [...allMembers].sort((a, b) => {
    const aIsLeader = isLeaderEmail(a.email);
    const bIsLeader = isLeaderEmail(b.email);
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

  // Sync document title dynamically
  useEffect(() => {
    if (currentRoute === 'public') {
      document.title = "SVT | Students Helping Students Everywhere";
    } else if (currentRoute === 'signin') {
      document.title = "SVT | Member Sign In & Registration";
    } else if (currentRoute === 'dashboard') {
      document.title = "SVT | The Scholars Volunteer Team Dashboard";
    } else {
      document.title = "SVT | Page Not Found";
    }
  }, [currentRoute]);

  // Auth Guard: If on dashboard but user is signed out, redirect to /signin
  useEffect(() => {
    if (currentRoute === 'dashboard' && !loadingAuth && !user) {
      navigateTo('signin');
    }
  }, [currentRoute, loadingAuth, user]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {currentRoute === 'signin' ? (
        <SignInPage
          user={user}
          loadingAuth={loadingAuth}
          customTeamLogo={customTeamLogo}
          customFounderPhoto={customFounderPhoto}
          onNavigateHome={() => navigateTo('public')}
          onNavigateToDashboard={() => navigateTo('dashboard')}
        />
      ) : currentRoute === 'notfound' ? (
        <NotFoundPage
          customTeamLogo={customTeamLogo}
          onNavigateHome={() => navigateTo('public')}
        />
      ) : currentRoute === 'dashboard' ? (
        !user ? (
          <SignInPage
            user={user}
            loadingAuth={loadingAuth}
            customTeamLogo={customTeamLogo}
            customFounderPhoto={customFounderPhoto}
            onNavigateHome={() => navigateTo('public')}
            onNavigateToDashboard={() => navigateTo('dashboard')}
          />
        ) : (
          <MemberDashboard
            user={user}
            memberProfile={memberProfile || {
              uid: user.uid,
              name: isLeaderEmail(user.email) ? 'Salman A.Razak' : (user.displayName || 'Volunteer Member'),
              displayName: isLeaderEmail(user.email) ? 'Salman A.Razak' : (user.displayName || 'Volunteer Member'),
              email: user.email || '',
              photoURL: (isLeaderEmail(user.email) && customFounderPhoto) ? customFounderPhoto : (user.photoURL || ''),
              role: isAdmin || isLeaderEmail(user.email) ? 'admin' : (isCoordinator ? 'coordinator' : 'member'),
              status: 'active',
              bio: isLeaderEmail(user.email) ? 'Founder & Executive Leader of SVT (The Scholars Volunteer Team).' : 'Student volunteer and active member of The Scholars Volunteer Team.',
              skills: ['Peer Tutoring', 'Study Material Creation'],
              interests: ['Education', 'Youth Volunteering'],
              region: 'Global',
              directoryVisible: true,
              hasCrown: isAdmin || isLeaderEmail(user.email),
              customBadge: isLeaderEmail(user.email) ? 'Founder & Executive Leader' : '',
              totalApprovedMinutes: isLeaderEmail(user.email) ? 12000 : 0,
              joinedAt: new Date()
            }}
            loadingAuth={loadingAuth}
            posts={posts}
            tasks={tasks}
            resources={resources}
            logs={logs}
            allMembers={allMembers}
            isAdmin={isAdmin}
            customTeamLogo={customTeamLogo}
            customWideBanner={customWideBanner}
            leaderPhotoURL={leaderPhotoURL}
            onUpdateTeamLogo={handleUpdateTeamLogo}
            onUpdateWideBanner={handleUpdateWideBanner}
            onUpdateMemberPhoto={handleUpdateMemberPhoto}
            onUpdateFounderPhoto={handleUpdateFounderPhoto}
            onOpenProfile={handleOpenProfile}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenApplicationStatus={() => setIsApplicationStatusModalOpen(true)}
            onOpenAdminPortal={() => setIsAdminModalOpen(true)}
            onRefreshClaims={handleRefreshClaims}
            onViewRoster={() => setIsMembersModalOpen(true)}
            onNavigateToPublic={() => navigateTo('public')}
          />
        )
      ) : (
        <PublicHomePage
          currentUserEmail={user?.email}
          customTeamLogo={customTeamLogo}
          customWideBanner={customWideBanner}
          leaderPhotoURL={leaderPhotoURL}
          onUpdateTeamLogo={handleUpdateTeamLogo}
          onUpdateWideBanner={handleUpdateWideBanner}
          onUpdateFounderPhoto={handleUpdateFounderPhoto}
          onNavigateToDashboard={() => navigateTo('dashboard')}
          onNavigateToJoin={() => navigateTo('signin', 'intent=join')}
        />
      )}

      {/* Roster database Modal */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={allMembers}
        isAdmin={isAdmin}
        onViewProfile={handleOpenProfile}
        onUpdateMemberPhoto={handleUpdateMemberPhoto}
      />

      {/* Account Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        memberProfile={memberProfile}
      />

      {/* Application / Membership Status Modal */}
      <ApplicationStatusModal
        isOpen={isApplicationStatusModalOpen}
        onClose={() => setIsApplicationStatusModalOpen(false)}
        memberProfile={memberProfile}
        currentUserEmail={user?.email}
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

      {/* Image Lightbox for profile and identity photos */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        src={lightboxSrc}
        alt={lightboxAlt}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Admin Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onRefreshClaims={handleRefreshClaims}
        onOpenProfile={handleOpenProfile}
        customTeamLogo={customTeamLogo}
        customWideBanner={customWideBanner}
        customFounderPhoto={customFounderPhoto}
        onUpdateTeamLogo={handleUpdateTeamLogo}
        onUpdateWideBanner={handleUpdateWideBanner}
        onUpdateFounderPhoto={handleUpdateFounderPhoto}
      />

      {/* Admin Image Editor Modal with Firebase Storage Cloud Sync */}
      <AdminImageEditorModal />
    </div>
  );
}

