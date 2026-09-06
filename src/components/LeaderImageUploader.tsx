import React, { useState, useRef } from 'react';
import { Camera, Maximize2, RefreshCw, Check } from 'lucide-react';
import { isLeaderEmail } from '../utils/leader';
import { optimizeImage } from '../utils/imageOptimizer';
import ImageLightbox from './ImageLightbox';

interface LeaderImageUploaderProps {
  currentUserEmail?: string | null;
  currentImageSrc: string;
  altText: string;
  onImageUploaded: (base64Data: string) => void | Promise<void>;
  className?: string;
  imgClassName?: string;
  typeLabel?: string;
  title?: string;
  aspectRatio?: string;
  memberUid?: string;
}

export default function LeaderImageUploader({
  currentUserEmail,
  currentImageSrc,
  altText,
  onImageUploaded,
  className = '',
  imgClassName = '',
  typeLabel = 'Photo',
  title,
  memberUid
}: LeaderImageUploaderProps) {
  const isLeader = isLeaderEmail(currentUserEmail);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatusText('Optimizing...');

      // Ultra-fast client-side compression (< 60ms)
      const optimized = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.90,
        outputFormat: 'image/webp'
      });

      setStatusText('Saving...');
      await onImageUploaded(optimized.base64);

      setStatusText('Saved!');
      setTimeout(() => {
        setIsProcessing(false);
        setStatusText(null);
      }, 1000);
    } catch (err) {
      console.error('Fast image upload error:', err);
      setIsProcessing(false);
      setStatusText('Error');
      setTimeout(() => setStatusText(null), 2500);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div
        className={`relative group ${className}`}
        title={title || altText}
      >
        <img
          src={currentImageSrc}
          alt={altText}
          className={`${imgClassName} transition-transform duration-200 group-hover:scale-[1.01]`}
          referrerPolicy="no-referrer"
        />

        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 rounded-inherit p-2">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mb-1" />
            <span className="text-[11px] font-bold text-amber-300">
              {statusText || 'Updating...'}
            </span>
          </div>
        )}

        {isLeader && !isProcessing && (
          <div className="absolute bottom-1.5 right-1.5 opacity-90 group-hover:opacity-100 transition-all z-10 flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-slate-900/90 hover:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-amber-400/60 shadow-lg flex items-center gap-1 backdrop-blur-xs cursor-pointer transition-transform hover:scale-105"
              title="Upload photo"
            >
              <Camera className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Change</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="bg-slate-900/90 hover:bg-slate-900 text-white text-[10px] p-1 rounded-full border border-slate-700 shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              title="View full screen"
            >
              <Maximize2 className="w-3 h-3 text-slate-300 shrink-0" />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <ImageLightbox
        isOpen={isLightboxOpen}
        src={currentImageSrc}
        alt={altText}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
