import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { usePublicAssets } from '../contexts/PublicAssetsContext';

interface EditablePublicAssetImageProps {
  assetKey: string;
  fallbackSrc: string;
  fallbackAlt: string;
  label?: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  objectPosition?: string;
}

export default function EditablePublicAssetImage({
  assetKey,
  fallbackSrc,
  fallbackAlt,
  label,
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover',
  imgStyle,
  loading = 'lazy',
  objectPosition
}: EditablePublicAssetImageProps) {
  const { getAsset, isSiteImageEditMode, openAssetEditor, canEditImages } = usePublicAssets();
  const asset = getAsset(assetKey, fallbackSrc, fallbackAlt);
  
  // Track image load error to fall back cleanly to bundled asset if external URL fails
  const [imgError, setImgError] = useState(false);

  const displaySrc = imgError ? fallbackSrc : asset.src;
  const displayAlt = asset.alt || fallbackAlt;

  const handleEditClick = (e: React.MouseEvent) => {
    if (!canEditImages) return;
    e.preventDefault();
    e.stopPropagation();
    openAssetEditor(
      assetKey, 
      label || fallbackAlt || assetKey, 
      displaySrc, 
      displayAlt
    );
  };

  return (
    <div className={`relative ${className} ${canEditImages ? 'group/asset-img' : ''}`}>
      <img
        src={displaySrc}
        alt={displayAlt}
        referrerPolicy="no-referrer"
        loading={loading}
        onError={() => setImgError(true)}
        className={imgClassName}
        style={{
          ...(objectPosition ? { objectPosition } : {}),
          ...imgStyle
        }}
      />

      {/* Verified Admin Controls: Strictly rendered ONLY for Salman & authorized admins */}
      {canEditImages && (
        <>
          {/* Full overlay mode when 'In-Page Edit Mode' is toggled ON */}
          {isSiteImageEditMode ? (
            <button
              type="button"
              onClick={handleEditClick}
              aria-label={`Replace image for ${label || assetKey}`}
              title={`Click to replace ${label || assetKey}`}
              className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors flex flex-col items-center justify-center text-white z-20 cursor-pointer p-2 rounded-inherit backdrop-blur-xs"
            >
              <div className="p-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl flex items-center gap-1.5 text-xs font-bold transition-transform transform group-hover/asset-img:scale-105">
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Change Image</span>
              </div>
              <span className="text-[10px] text-amber-200 mt-1 font-mono font-medium">
                {assetKey}
              </span>
            </button>
          ) : (
            /* Discreet hover button when edit mode is toggled OFF */
            <div className="absolute top-2 right-2 opacity-0 group-hover/asset-img:opacity-100 transition-opacity z-20 pointer-events-auto">
              <button
                type="button"
                onClick={handleEditClick}
                title={`Admin Quick Edit: Change ${label || assetKey}`}
                className="p-1.5 px-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 text-white border border-amber-400/60 shadow-lg text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-xs cursor-pointer transition-transform hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Edit Image</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
