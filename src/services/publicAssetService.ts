import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { PublicAssetDoc } from '../types';
import { optimizeImage } from '../utils/imageOptimizer';

export interface UploadAssetParams {
  file: File | Blob | string;
  assetKey: string;
  altText: string;
  adminUid: string;
  onProgress?: (percent: number) => void;
  onStatusChange?: (status: string) => void;
}

export interface UploadAssetResult {
  success: boolean;
  imageUrl?: string;
  storagePath?: string;
  error?: string;
}

/**
 * Uploads an image file to Firebase Storage under site-assets/{assetKey}/
 * and updates the shared Firestore record in /publicAssets/{assetKey}.
 * 
 * Includes:
 * - High-speed client-side image optimization (< 100ms)
 * - Timeout safeguards (no infinite saving)
 * - Automatic optimistic caching
 * - Cross-collection synchronization (publicAssets + settings)
 */
export async function uploadPublicSiteAsset({
  file,
  assetKey,
  altText,
  adminUid,
  onProgress,
  onStatusChange
}: UploadAssetParams): Promise<UploadAssetResult> {
  try {
    // Step 1: Ultra-fast local optimization
    onStatusChange?.('Optimizing image for fast delivery...');
    onProgress?.(15);

    const isLogo = assetKey.includes('logo') || assetKey.includes('avatar');
    const isBanner = assetKey.includes('banner');

    const optimized = await optimizeImage(file, {
      maxWidth: isBanner ? 1920 : isLogo ? 800 : 1200,
      maxHeight: isBanner ? 1080 : isLogo ? 800 : 1200,
      quality: 0.90,
      outputFormat: 'image/webp',
      targetFileName: `${assetKey}_${Date.now()}`
    });

    onProgress?.(35);
    onStatusChange?.('Uploading to secure cloud storage...');

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newStoragePath = `site-assets/${assetKey}/${timestamp}_${randomSuffix}.webp`;

    // Step 2: Read previous asset doc for clean replacement
    let previousStoragePath: string | null = null;
    try {
      const docSnap = await getDoc(doc(db, 'publicAssets', assetKey));
      if (docSnap.exists()) {
        const data = docSnap.data() as PublicAssetDoc;
        if (data.storagePath && data.storagePath.startsWith('site-assets/')) {
          previousStoragePath = data.storagePath;
        }
      }
    } catch {
      // Non-blocking lookup
    }

    // Step 3: Fast upload with strict 15-second timeout safeguard
    let downloadUrl: string = optimized.base64;
    let savedStoragePath: string = newStoragePath;
    let storageSucceeded = false;

    try {
      const storageRef = ref(storage, newStoragePath);
      const metadata = {
        contentType: 'image/webp',
        customMetadata: {
          assetKey,
          uploadedBy: adminUid,
          originalSize: String(optimized.originalSizeBytes),
          optimizedSize: String(optimized.optimizedSizeBytes)
        }
      };

      const uploadTask = uploadBytesResumable(storageRef, optimized.blob, metadata);

      // Wrap upload with a 12-second timeout to prevent hanging forever
      const uploadPromise = new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (snapshot.totalBytes > 0 && onProgress) {
              const uploadPct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 50);
              onProgress(35 + uploadPct); // 35% -> 85%
            }
          },
          (uploadError) => {
            reject(uploadError);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (urlErr) {
              reject(urlErr);
            }
          }
        );
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Storage upload timeout')), 12000);
      });

      downloadUrl = await Promise.race([uploadPromise, timeoutPromise]);
      storageSucceeded = true;
    } catch (storageErr) {
      console.warn('Direct Storage upload notice (falling back to direct Firestore optimized payload):', storageErr);
      // Fallback directly to optimized high-efficiency webp base64 (typically ~60-150KB)
      downloadUrl = optimized.base64;
      savedStoragePath = `inline-base64/${assetKey}`;
    }

    onProgress?.(90);
    onStatusChange?.('Saving & publishing live update...');

    // Step 4: Save record in Firestore /publicAssets/{assetKey}
    const assetDocRef = doc(db, 'publicAssets', assetKey);
    await setDoc(assetDocRef, {
      assetKey,
      imageUrl: downloadUrl,
      storagePath: savedStoragePath,
      altText: altText || 'Scholars Volunteer Team public image asset',
      updatedAt: serverTimestamp(),
      updatedBy: adminUid,
      sizeBytes: optimized.optimizedSizeBytes
    });

    // Step 5: Dual-sync with legacy settings docs for instant backward compatibility
    try {
      if (assetKey === 'team-logo' || assetKey.includes('logo')) {
        await setDoc(doc(db, 'settings', 'teamLogo'), { teamLogo: downloadUrl, updatedAt: serverTimestamp() }, { merge: true });
        await setDoc(doc(db, 'settings', 'teamIdentity'), { teamLogo: downloadUrl, updatedAt: serverTimestamp() }, { merge: true });
        try { localStorage.setItem('svt_custom_team_logo', downloadUrl); } catch {}
      } else if (assetKey === 'team-banner' || assetKey.includes('banner')) {
        await setDoc(doc(db, 'settings', 'teamBanner'), { wideIdentityBanner: downloadUrl, updatedAt: serverTimestamp() }, { merge: true });
        await setDoc(doc(db, 'settings', 'teamIdentity'), { wideIdentityBanner: downloadUrl, updatedAt: serverTimestamp() }, { merge: true });
        try { localStorage.setItem('svt_custom_wide_banner', downloadUrl); } catch {}
      } else if (assetKey === 'founder-photo' || assetKey.includes('founder') || assetKey.includes('salman')) {
        await setDoc(doc(db, 'settings', 'founderPhoto'), { founderPhoto: downloadUrl, photoURL: downloadUrl, updatedAt: serverTimestamp() }, { merge: true });
        await setDoc(doc(db, 'settings', 'teamIdentity'), { founderPhoto: downloadUrl, updatedAt: serverTimestamp() }, { merge: true });
        if (adminUid) {
          await setDoc(doc(db, 'members', adminUid), { photoURL: downloadUrl }, { merge: true });
        }
        try { localStorage.setItem('svt_custom_founder_photo', downloadUrl); } catch {}
      }
    } catch (syncErr) {
      console.info('Legacy settings sync notice:', syncErr);
    }

    // Step 6: Safe background cleanup of old storage object if new storage succeeded
    if (storageSucceeded && previousStoragePath && previousStoragePath !== newStoragePath) {
      try {
        const oldRef = ref(storage, previousStoragePath);
        deleteObject(oldRef).catch(() => {});
      } catch {
        // Ignore background deletion
      }
    }

    onProgress?.(100);
    onStatusChange?.('Update published successfully!');

    return {
      success: true,
      imageUrl: downloadUrl,
      storagePath: savedStoragePath
    };
  } catch (error: any) {
    console.error('uploadPublicSiteAsset error:', error);
    let errorMessage = error?.message || 'Failed to update image. Please check your connection.';
    if (error?.code === 'permission-denied') {
      errorMessage = 'Permission denied: Administrator privileges are required to replace site images.';
    }
    return {
      success: false,
      error: errorMessage
    };
  }
}
