import { User } from 'firebase/auth';
import defaultFounderPhoto from '../assets/images/salman_a_razak_founder_1788028269641.jpg';

export const DEFAULT_FOUNDER_PHOTO = defaultFounderPhoto;

export const LEADER_EMAILS = [
  'sallumrazak@gmail.com',
  'mohamedmaisara.2007@gmail.com',
  'sallumceeljale@com',
  'sallumceeljale@gmail.com'
];

export const isLeaderEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return LEADER_EMAILS.includes(normalized);
};

export const isLeaderUser = (user?: User | null | { email?: string | null }): boolean => {
  if (!user) return false;
  return isLeaderEmail(user.email);
};

export const DEFAULT_FOUNDER_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#grad)" />
  <circle cx="100" cy="100" r="92" fill="none" stroke="url(#gold)" stroke-width="4" stroke-dasharray="8 4" opacity="0.6"/>
  <text x="100" y="118" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="1">SR</text>
</svg>
`)}`;

export const getHighResPhotoUrl = (url?: string | null): string => {
  if (!url) return '';
  // If it's a Google account photo URL (e.g. lh3.googleusercontent.com), request high resolution =s800-c
  if (url.includes('googleusercontent.com')) {
    if (/=s\d+/i.test(url)) {
      return url.replace(/=s\d+(-[a-z0-9-]+)?/gi, '=s800-c');
    }
    return url.includes('?') ? `${url}&sz=800` : `${url}=s800-c`;
  }
  // If it's a Dicebear initial/identicon URL, ensure high resolution
  if (url.includes('dicebear.com')) {
    return url.replace(/scale=\d+/i, 'scale=100');
  }
  return url;
};

export const compressImageFile = (
  file: File, 
  maxWidth: number = 2400, 
  maxHeight: number = 2400, 
  quality: number = 0.95
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For files under 800KB or SVG / PNG / GIF assets, read raw data URL directly for 100% exact bit-for-bit untouched quality & transparency
    if (file.size <= 800 * 1024 || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      return;
    }

    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      // Scale down proportionally if larger than maximum bounds
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Preserve PNG output if PNG to preserve transparency and exact pixel accuracy
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const compressedBase64 = canvas.toDataURL(mimeType, quality);
      resolve(compressedBase64);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return compressImageFile(file, 2400, 2400, 0.95);
};
