import React, { useState } from 'react';

interface UniversityIdentityProps {
  name: string;
  logoPath?: string;
  monogram?: string;
  className?: string;
}

export const UniversityIdentity: React.FC<UniversityIdentityProps> = ({
  name,
  logoPath,
  monogram,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Compute a default clean monogram if none provided
  const displayMonogram = monogram || (() => {
    const clean = name
      .replace(/University of |College of |The |at |in |–|-|,/gi, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (clean.length >= 2) {
      return (clean[0][0] + clean[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  })();

  const showImage = Boolean(logoPath) && !hasError;

  return (
    <div
      className={`w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center overflow-hidden shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          src={logoPath}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <div className="w-full h-full rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs tracking-wider">
          {displayMonogram}
        </div>
      )}
    </div>
  );
};
