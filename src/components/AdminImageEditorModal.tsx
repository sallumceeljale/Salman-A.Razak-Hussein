import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Image as ImageIcon, 
  ShieldCheck, 
  Laptop,
  Sparkles,
  Zap
} from 'lucide-react';
import { auth } from '../firebase';
import { validateImageFile } from '../utils/assetValidation';
import { uploadPublicSiteAsset } from '../services/publicAssetService';
import { usePublicAssets } from '../contexts/PublicAssetsContext';
import { optimizeImage, OptimizedImageResult } from '../utils/imageOptimizer';

interface AdminImageEditorModalProps {
  isOpen?: boolean;
  isAdmin?: boolean;
  assetKey?: string;
  assetLabel?: string;
  currentImageSrc?: string;
  initialAltText?: string;
  onClose?: () => void;
  onSuccess?: (newUrl: string) => void;
}

export default function AdminImageEditorModal(props: AdminImageEditorModalProps) {
  const context = usePublicAssets();
  const activeEdit = context.activeEditAsset;

  const isOpen = props.isOpen !== undefined ? props.isOpen : !!activeEdit;
  const assetKey = props.assetKey || activeEdit?.assetKey || '';
  const assetLabel = props.assetLabel || activeEdit?.label || 'Site Asset';
  const currentImageSrc = props.currentImageSrc || activeEdit?.currentSrc || '';
  const initialAltText = props.initialAltText !== undefined ? props.initialAltText : (activeEdit?.altText || '');
  const onClose = props.onClose || context.closeAssetEditor;
  const onSuccess = props.onSuccess;
  const isAdmin = props.isAdmin !== undefined ? props.isAdmin : context.canEditImages;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Selected file & optimization state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedImageResult | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState(initialAltText);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cleanupPreviewUrl = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  };

  useEffect(() => {
    setAltText(initialAltText);
  }, [initialAltText]);

  useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, [previewBlobUrl]);

  if (!isOpen) return null;

  const handleFileSelected = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate selected file format
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file format.');
      return;
    }

    cleanupPreviewUrl();
    setSelectedFile(file);

    const isLogo = assetKey.includes('logo') || assetKey.includes('avatar');
    const isBanner = assetKey.includes('banner');

    try {
      setIsOptimizing(true);
      // Run ultra-fast client-side optimization in milliseconds
      const optimized = await optimizeImage(file, {
        maxWidth: isBanner ? 1920 : isLogo ? 800 : 1200,
        maxHeight: isBanner ? 1080 : isLogo ? 800 : 1200,
        quality: 0.90,
        outputFormat: 'image/webp',
        targetFileName: assetKey
      });

      setOptimizedResult(optimized);
      const blobUrl = URL.createObjectURL(optimized.blob);
      setPreviewBlobUrl(blobUrl);
    } catch (err: any) {
      console.warn('Fast preview fallback notice:', err);
      // Direct fallback preview if canvas fails
      const blobUrl = URL.createObjectURL(file);
      setPreviewBlobUrl(blobUrl);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleCancel = () => {
    if (isUploading) return;
    cleanupPreviewUrl();
    setSelectedFile(null);
    setOptimizedResult(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleSave = async () => {
    const targetPayload = optimizedResult?.file || selectedFile;
    if (!targetPayload) {
      setErrorMsg('Please select an image file first.');
      return;
    }

    if (!isAdmin) {
      setErrorMsg('Unauthorized: Administrator privileges are required to replace public website images.');
      return;
    }

    const adminUid = auth.currentUser?.uid;
    if (!adminUid) {
      setErrorMsg('Please sign in with your verified administrator account to proceed.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setStatusText('Optimizing image...');
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await uploadPublicSiteAsset({
      file: targetPayload,
      assetKey,
      altText: altText || `${assetLabel} - Scholars Volunteer Team`,
      adminUid,
      onProgress: (percent) => {
        setUploadProgress(percent);
      },
      onStatusChange: (status) => {
        setStatusText(status);
      }
    });

    setIsUploading(false);

    if (result.success && result.imageUrl) {
      setSuccessMsg('Image saved and updated live for all visitors.');
      onSuccess?.(result.imageUrl);
      
      // Fast close
      setTimeout(() => {
        cleanupPreviewUrl();
        setSelectedFile(null);
        setOptimizedResult(null);
        setSuccessMsg(null);
        onClose();
      }, 900);
    } else {
      setErrorMsg(result.error || 'Failed to update image. Please check your connection.');
    }
  };

  const activeDisplaySrc = previewBlobUrl || currentImageSrc;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-image-editor-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) {
          handleCancel();
        }
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity" />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-left z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Verified Admin Editor
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                key: {assetKey}
              </span>
            </div>
            <h2 id="admin-image-editor-title" className="text-xl font-bold text-white font-display">
              {assetLabel || 'Replace Site Image'}
            </h2>
          </div>
          
          <button
            onClick={handleCancel}
            disabled={isUploading}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning / Notice for Non-Admin */}
        {!isAdmin && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Administrator privilege is required to publish image replacements.</span>
          </div>
        )}

        {/* Image Preview & Picker Zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Image Preview & File Selection
            </label>
            {optimizedResult && (
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Optimized {(optimizedResult.optimizedSizeBytes / 1024).toFixed(0)} KB WebP
              </span>
            )}
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all min-h-[200px] ${
              isDragging
                ? 'border-indigo-500 bg-indigo-950/30'
                : selectedFile
                  ? 'border-emerald-500/60 bg-slate-950/60'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
            }`}
          >
            {activeDisplaySrc ? (
              <div className="relative w-full max-h-56 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950">
                <img
                  src={activeDisplaySrc}
                  alt={altText || assetLabel}
                  className="max-h-48 max-w-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
                {previewBlobUrl && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-bold shadow-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Ready to Save
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center space-y-2 py-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-300 font-medium">No image currently selected</p>
              </div>
            )}

            {/* Selection Buttons */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isOptimizing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>{selectedFile ? 'Select Different Image' : 'Choose Image from Device'}</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Drag and drop any image (automatically optimized in milliseconds)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between text-xs bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-mono truncate max-w-[240px]">
                {selectedFile.name}
              </span>
              <span className="text-slate-400 shrink-0 font-mono text-[11px]">
                {optimizedResult 
                  ? `${(selectedFile.size / 1024).toFixed(0)} KB ➔ ${(optimizedResult.optimizedSizeBytes / 1024).toFixed(0)} KB WebP`
                  : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`}
              </span>
            </div>
          )}
        </div>

        {/* Alt Text Input */}
        <div className="space-y-1.5">
          <label htmlFor="asset-alt-input" className="block text-xs font-semibold text-slate-300">
            Accessible Image Description (Alt Text)
          </label>
          <input
            id="asset-alt-input"
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            disabled={isUploading}
            placeholder="Describe what is pictured for accessibility..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="flex items-center gap-1.5 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                {statusText || 'Saving image update...'}
              </span>
              <span className="font-mono font-bold text-amber-300">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedFile || isUploading || isOptimizing || !isAdmin}
            className="min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Fast...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
