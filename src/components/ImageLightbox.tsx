import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ isOpen, src, alt, onClose }: ImageLightboxProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(false);
      setScale(1);
      setRotation(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, src]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const cleanAlt = alt
      ? alt.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30)
      : 'svt_media_view';
    const filename = `${cleanAlt}.jpg`;

    try {
      const response = await fetch(src, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct fetch download failed (likely CORS), opening media in new tab:', err);
      const link = document.createElement('a');
      link.href = src;
      link.target = '_blank';
      link.download = filename;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const rotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <AnimatePresence>
      <div 
        id="image_lightbox_container"
        role="dialog"
        aria-modal="true"
        aria-label={alt || "Image preview"}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md select-none"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between gap-4 z-10 text-white">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
              SVT Media Viewer
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-200 truncate max-w-[200px] sm:max-w-md">
              {alt || 'Scholars Volunteer Graphic'}
            </h4>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={zoomIn}
              className="min-h-[44px] min-w-[44px] p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-700 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="min-h-[44px] min-w-[44px] p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-700 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="min-h-[44px] min-w-[44px] p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-700 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Rotate Image"
              aria-label="Rotate image clockwise"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Save Image to Device"
              aria-label="Download image"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="min-h-[44px] min-w-[44px] p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title="Close (Esc)"
              aria-label="Close image viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centered Image Container */}
        <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center py-6 overflow-hidden">
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 max-w-sm">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-200">Unable to load image.</p>
              <p className="text-xs text-slate-400">The file may have been moved or is currently unavailable.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative max-h-full max-w-full flex items-center justify-center pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[70vh] sm:max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800 bg-slate-900/60 select-none"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>

        {/* Accessible helper hint */}
        <div className="text-center pb-2 text-xs text-slate-400 font-medium">
          Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Esc</kbd> or click outside to close.
        </div>
      </div>
    </AnimatePresence>
  );
}
