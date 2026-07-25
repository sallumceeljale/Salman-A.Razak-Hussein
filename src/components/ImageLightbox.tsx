import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ isOpen, src, alt, onClose }: ImageLightboxProps) {
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setScale(1);
      setRotation(0);
      // Prevent body scrolling when lightbox is open
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
    
    // Create a descriptive file name based on alt text
    const cleanAlt = alt
      ? alt.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30)
      : 'scholars_volunteer_image';
    const filename = `${cleanAlt}.jpg`;

    try {
      // Try to download using fetch blob
      const response = await fetch(src, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn('Direct fetch download failed (likely CORS), falling back to alternative download:', error);
      // Fallback: open in new tab or attempt simple anchor download
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
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md select-none"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between gap-4 z-10 text-white">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              SVT Media Viewer
            </span>
            <h4 className="text-sm font-bold text-slate-200 truncate max-w-[250px] sm:max-w-md">
              {alt || 'Scholars Volunteer Image'}
            </h4>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={zoomIn}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 hover:text-indigo-400 rounded-xl transition-all cursor-pointer border border-slate-700/50"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 hover:text-indigo-400 rounded-xl transition-all cursor-pointer border border-slate-700/50"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={rotate}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 hover:text-indigo-400 rounded-xl transition-all cursor-pointer border border-slate-700/50"
              title="Rotate Image"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-650/20 transition-all cursor-pointer"
              title="Save Image to Device"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Image</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 bg-red-650/85 hover:bg-red-600 text-white rounded-xl transition-all cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centered Image Container */}
        <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center py-6 overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative max-h-full max-w-full flex items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[70vh] sm:max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800/30 bg-slate-900/40 select-none cursor-default"
              onLoad={() => setLoading(false)}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Footer info/tips */}
        <div className="text-center pb-2 text-[10px] text-slate-400 font-medium">
          💡 Drag or use controls to adjust. Click anywhere outside to close.
        </div>
      </div>
    </AnimatePresence>
  );
}
