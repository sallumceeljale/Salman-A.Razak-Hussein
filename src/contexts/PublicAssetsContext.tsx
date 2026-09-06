import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../firebase';
import { PublicAssetDoc } from '../types';
import { isLeaderEmail } from '../utils/leader';

export interface PublicAssetResolved {
  src: string;
  alt: string;
  isCustom: boolean;
  storagePath?: string;
}

export interface ActiveEditAsset {
  assetKey: string;
  label: string;
  currentSrc: string;
  altText: string;
}

interface PublicAssetsContextValue {
  assets: Record<string, PublicAssetDoc>;
  loading: boolean;
  canEditImages: boolean;
  currentUser: User | null;
  getAsset: (assetKey: string, fallbackSrc: string, fallbackAlt?: string) => PublicAssetResolved;
  isSiteImageEditMode: boolean;
  setIsSiteImageEditMode: (enabled: boolean) => void;
  toggleSiteImageEditMode: () => void;
  activeEditAsset: ActiveEditAsset | null;
  openAssetEditor: (assetKey: string, label: string, currentSrc: string, altText?: string) => void;
  closeAssetEditor: () => void;
}

const PublicAssetsContext = createContext<PublicAssetsContextValue | undefined>(undefined);

export const PublicAssetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Record<string, PublicAssetDoc>>({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [canEditImages, setCanEditImages] = useState<boolean>(() => {
    return auth.currentUser ? isLeaderEmail(auth.currentUser.email) : false;
  });
  const [isSiteImageEditMode, setIsSiteImageEditMode] = useState(false);
  const [activeEditAsset, setActiveEditAsset] = useState<ActiveEditAsset | null>(null);

  // Monitor user authentication to strictly permit only Salman and authorized admins
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (!u) {
        setCanEditImages(false);
        setIsSiteImageEditMode(false);
        return;
      }
      const isLeader = isLeaderEmail(u.email);
      if (isLeader) {
        setCanEditImages(true);
        return;
      }
      try {
        const tokenResult = await u.getIdTokenResult();
        const hasAdmin = tokenResult.claims.admin === true || tokenResult.claims.role === 'admin';
        setCanEditImages(hasAdmin);
        if (!hasAdmin) {
          setIsSiteImageEditMode(false);
        }
      } catch {
        setCanEditImages(false);
        setIsSiteImageEditMode(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Single shared real-time listener for public assets across the entire application
  useEffect(() => {
    const assetsCollection = collection(db, 'publicAssets');
    const unsubscribe = onSnapshot(
      assetsCollection,
      (snapshot) => {
        const map: Record<string, PublicAssetDoc> = {};
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as PublicAssetDoc;
            if (data.assetKey && data.imageUrl) {
              map[data.assetKey] = data;
            }
          }
        });
        setAssets(map);
        setLoading(false);
      },
      (error) => {
        console.warn('Public assets listener notice:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getAsset = (assetKey: string, fallbackSrc: string, fallbackAlt: string = ''): PublicAssetResolved => {
    const docData = assets[assetKey];
    if (docData && docData.imageUrl) {
      return {
        src: docData.imageUrl,
        alt: docData.altText || fallbackAlt,
        isCustom: true,
        storagePath: docData.storagePath
      };
    }
    return {
      src: fallbackSrc,
      alt: fallbackAlt,
      isCustom: false
    };
  };

  const handleSetSiteImageEditMode = (enabled: boolean) => {
    if (!canEditImages && enabled) return;
    setIsSiteImageEditMode(enabled);
  };

  const toggleSiteImageEditMode = () => {
    if (!canEditImages) return;
    setIsSiteImageEditMode((prev) => !prev);
  };

  const openAssetEditor = (assetKey: string, label: string, currentSrc: string, altText: string = '') => {
    if (!canEditImages) {
      console.warn('Unauthorized attempt to open image editor.');
      return;
    }
    setActiveEditAsset({
      assetKey,
      label,
      currentSrc,
      altText
    });
  };

  const closeAssetEditor = () => {
    setActiveEditAsset(null);
  };

  return (
    <PublicAssetsContext.Provider
      value={{
        assets,
        loading,
        canEditImages,
        currentUser,
        getAsset,
        isSiteImageEditMode,
        setIsSiteImageEditMode: handleSetSiteImageEditMode,
        toggleSiteImageEditMode,
        activeEditAsset,
        openAssetEditor,
        closeAssetEditor
      }}
    >
      {children}
    </PublicAssetsContext.Provider>
  );
};

export function usePublicAssets(): PublicAssetsContextValue {
  const context = useContext(PublicAssetsContext);
  if (!context) {
    throw new Error('usePublicAssets must be used within a PublicAssetsProvider');
  }
  return context;
}

export function usePublicAsset(assetKey: string, fallbackSrc: string, fallbackAlt: string = '') {
  const { getAsset, isSiteImageEditMode, openAssetEditor, canEditImages } = usePublicAssets();
  const asset = getAsset(assetKey, fallbackSrc, fallbackAlt);

  return {
    ...asset,
    canEditImages,
    isSiteImageEditMode,
    editAsset: (label?: string) => {
      if (!canEditImages) return;
      openAssetEditor(assetKey, label || assetKey, asset.src, asset.alt);
    }
  };
}
