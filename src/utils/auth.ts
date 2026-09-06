import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  UserCredential 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';

/**
 * Initiates Google authentication with account chooser prompt.
 * First tries signInWithPopup; if blocked by the browser, falls back to signInWithRedirect.
 */
export async function signInWithGoogleFlow(loginHint?: string): Promise<{ userCredential?: UserCredential; isRedirecting?: boolean }> {
  const provider = new GoogleAuthProvider();
  // Set account chooser and optional login_hint
  const customParams: Record<string, string> = { prompt: 'select_account' };
  if (loginHint) {
    customParams.login_hint = loginHint;
  }
  provider.setCustomParameters(customParams);

  try {
    const userCredential = await signInWithPopup(auth, provider);
    return { userCredential };
  } catch (err: any) {
    const errorCode = err?.code;
    console.warn('Google sign-in popup notice:', errorCode, err?.message);

    // If popup was blocked by browser or cancelled request, fallback to redirect
    if (errorCode === 'auth/popup-blocked' || errorCode === 'auth/cancelled-popup-request') {
      console.info('Popup blocked or cancelled, initiating redirect fallback...');
      await signInWithRedirect(auth, provider);
      return { isRedirecting: true };
    }

    // Re-throw with formatted message
    throw err;
  }
}

/**
 * Uploads a profile picture to Firebase Storage and returns its HTTPS download URL.
 * Enforces image type and 5MB size limit.
 */
export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  if (!file) {
    throw new Error('No image file selected.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files (JPEG, PNG, WebP, GIF, SVG) are supported.');
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image size must be less than 5MB.');
  }

  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const storagePath = `profile_photos/${userId}/${timestamp}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        originalName: file.name,
      }
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (err: any) {
    console.error('Firebase Storage upload error:', err);
    throw new Error(err?.message || 'Failed to upload profile photo to cloud storage.');
  }
}

/**
 * Formats Firebase Auth errors into clear, friendly messages.
 */
export function formatAuthError(error: any): string {
  if (!error) return 'An unknown authentication error occurred.';
  const code = error.code || '';
  const message = error.message || '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in was cancelled before completion. Please click Sign In again to retry.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Popup window was blocked by your browser settings. Please allow popups or use the redirect option.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This web domain is not yet in the authorized domains list in Firebase Console > Authentication > Settings.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Sign-in window was closed by a subsequent request.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google sign-in is not enabled in Firebase Console. Please ensure Google provider is enabled.';
  }
  return message || 'Failed to authenticate with Google. Please try again.';
}
