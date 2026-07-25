import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Copy, Edit3, X, Check, Image as ImageIcon, ShieldCheck, Crown } from 'lucide-react';
import { isLeaderEmail, compressImageFile } from '../utils/leader';

interface ImageOptionsMenuModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  targetImgElement: HTMLImageElement | null;
  currentUserEmail?: string | null;
  onClose: () => void;
  onViewFullScreen: (src: string, alt: string) => void;
  onImageSrcUpdated?: (newBase64: string, targetImgElement: HTMLImageElement | null) => void;
}

export default function ImageOptionsMenuModal({
  isOpen,
  imageSrc,
  imageAlt,
  targetImgElement,
  currentUserEmail,
  onClose,
  onViewFullScreen,
  onImageSrcUpdated
}: ImageOptionsMenuModalProps) {
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isLeader = isLeaderEmail(currentUserEmail);

  if (!isOpen) return null;

  const currentSrc = targetImgElement?.src || imageSrc;

  // 1. Full Screen View
  const handleViewFullScreen = () => {
    onViewFullScreen(currentSrc, imageAlt || 'Scholars Volunteer Team Image');
    onClose();
  };

  // 2. Copy Image Link
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentSrc);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentSrc;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setToastMsg('Image link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setToastMsg(null);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy image link:', err);
    }
  };

  // 3. Change Photo (LEADER ONLY) with File Uploader
  const handleChangePhoto = () => {
    if (!isLeader) return;

    // Create file input programmatically
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      try {
        setToastMsg('Processing and compressing photo...');
        const base64Data = await compressImageFile(file, 1400, 1400, 0.82);

        // a. Live DOM update on clicked image
        if (targetImgElement) {
          targetImgElement.src = base64Data;
        }

        // b. Callback to app state and persistence
        onImageSrcUpdated?.(base64Data, targetImgElement);

        setToastMsg('Photo replaced successfully!');
        setTimeout(() => {
          setToastMsg(null);
          onClose();
        }, 1200);
      } catch (err) {
        console.error('Error changing photo:', err);
        setToastMsg('Failed to process image file.');
        setTimeout(() => setToastMsg(null), 3000);
      }
    };

    fileInput.click();
  };

  return (
    <AnimatePresence>
      <div
        id="image_options_modal_backdrop"
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Image Preview Thumbnail */}
          <div className="flex items-center gap-4 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs">
              <img
                src={currentSrc}
                alt={imageAlt || 'Selected image preview'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Image Context Menu
                </span>
                {isLeader ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-full">
                    <Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-400 shrink-0" />
                    <span>Leader Access</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>Public Visitor</span>
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                {imageAlt || 'Scholars Volunteer Graphic'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Select an action for this graphic
              </p>
            </div>
          </div>

          {/* Toast feedback if active */}
          {toastMsg && (
            <div className="mb-4 p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Context Options Buttons */}
          <div className="space-y-2.5 text-left">
            {/* 1. View Full Screen */}
            <button
              onClick={handleViewFullScreen}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all font-semibold text-xs sm:text-sm cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-100 dark:border-slate-600 group-hover:scale-105 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span>🖼️ View Full Screen</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    Open in high resolution lightbox
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Open &rarr;
              </span>
            </button>

            {/* 2. Copy Image Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all font-semibold text-xs sm:text-sm cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs border border-slate-100 dark:border-slate-600 group-hover:scale-105 transition-transform">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span>📋 Copy Image Link</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    Copy image source URL or base64 to clipboard
                  </span>
                </div>
              </div>
            </button>

            {/* 3. Change Photo (LEADER ONLY) */}
            {isLeader ? (
              <button
                onClick={handleChangePhoto}
                className="w-full flex items-center justify-between p-3.5 bg-amber-50/90 hover:bg-amber-100/90 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 rounded-2xl border border-amber-300/80 dark:border-amber-700/60 transition-all font-bold text-xs sm:text-sm cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5">
                      <span>✏️ Change Photo</span>
                      <span className="text-[9px] uppercase tracking-wider bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-1.5 py-0.2 rounded font-black">
                        Leader
                      </span>
                    </span>
                    <span className="text-[10px] font-medium text-amber-700/80 dark:text-amber-300/80">
                      Upload and replace from your device
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                  Upload &rarr;
                </span>
              </button>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl text-[11px] text-slate-400 flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Photo replacement is reserved for Team Leader (Salman A. Razak)</span>
              </div>
            )}

            {/* 4. Close */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-xs rounded-2xl transition-all cursor-pointer mt-2"
            >
              ❌ Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
