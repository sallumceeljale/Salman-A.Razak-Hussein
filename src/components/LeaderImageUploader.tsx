import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { isLeaderEmail, convertFileToBase64 } from '../utils/leader';

interface LeaderImageUploaderProps {
  currentUserEmail?: string | null;
  currentImageSrc: string;
  altText: string;
  onImageUploaded: (base64Data: string) => void | Promise<void>;
  className?: string;
  imgClassName?: string;
  typeLabel?: string; // e.g. "Logo", "Banner", "Profile Photo"
  title?: string;
  aspectRatio?: string;
}

export default function LeaderImageUploader({
  currentUserEmail,
  currentImageSrc,
  altText,
  onImageUploaded,
  className = '',
  imgClassName = '',
  typeLabel = 'Photo',
  title
}: LeaderImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isLeader = isLeaderEmail(currentUserEmail);

  const handleClick = (e: React.MouseEvent) => {
    if (isLeader) {
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);
      await onImageUploaded(base64);
    } catch (err) {
      console.error("Error converting uploaded image file:", err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isLeader) {
    // Non-leader view: Completely static and non-clickable
    return (
      <div className={`relative inline-block ${className}`}>
        <img
          src={currentImageSrc}
          alt={altText}
          className={`${imgClassName} select-none pointer-events-none`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Leader view: Interactive, clickable to open local laptop file picker
  return (
    <div
      onClick={handleClick}
      className={`relative group cursor-pointer ${className}`}
      title={title || `Click to upload & replace ${typeLabel} directly from your device (Leader Admin)`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <img
        src={currentImageSrc}
        alt={altText}
        className={`${imgClassName} transition-all duration-200 group-hover:brightness-95 group-hover:scale-[1.01]`}
        referrerPolicy="no-referrer"
      />
      
      {/* Visual Leader Edit Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit] pointer-events-none z-10 backdrop-blur-[1px]">
        <div className="bg-slate-900/90 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/30 shadow-lg flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
          <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Replace {typeLabel}</span>
        </div>
      </div>
    </div>
  );
}
