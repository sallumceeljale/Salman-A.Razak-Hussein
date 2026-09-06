export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

export type AllowedImageMimeType = typeof ALLOWED_IMAGE_MIME_TYPES[number];

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  extension?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check file size
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeInMB} MB) exceeds the maximum allowed limit of 5.0 MB.`
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty.' };
  }

  // Check MIME type
  const normalizedType = file.type.toLowerCase().trim();
  
  if (normalizedType === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return {
      valid: false,
      error: 'SVG vector files are not allowed for public site photos. Please upload a JPEG, PNG, or WebP photograph.'
    };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(normalizedType as AllowedImageMimeType)) {
    return {
      valid: false,
      error: `Unsupported format "${file.type || 'unknown'}". Only JPEG, PNG, and WebP images are supported.`
    };
  }

  // Extract and validate extension
  const fileName = file.name.toLowerCase();
  let ext = 'jpg';
  if (normalizedType === 'image/png' || fileName.endsWith('.png')) {
    ext = 'png';
  } else if (normalizedType === 'image/webp' || fileName.endsWith('.webp')) {
    ext = 'webp';
  } else if (normalizedType === 'image/jpeg' || fileName.endsWith('.jpeg') || fileName.endsWith('.jpg')) {
    ext = 'jpg';
  }

  return {
    valid: true,
    extension: ext
  };
}
