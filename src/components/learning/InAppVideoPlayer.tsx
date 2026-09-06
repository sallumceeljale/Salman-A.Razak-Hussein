import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Info, 
  Maximize2,
  Tv
} from 'lucide-react';

export interface InAppVideoPlayerProps {
  title: string;
  creator: string;
  creatorDescription: string;
  embedUrl?: string;
  sourceUrl: string;
  durationLabel: string;
  transcriptSummary?: string;
  keyTakeaways?: string[];
  isWatched?: boolean;
  onToggleWatched?: (watched: boolean) => void;
  className?: string;
}

export default function InAppVideoPlayer({
  title,
  creator,
  creatorDescription,
  embedUrl,
  sourceUrl,
  durationLabel,
  transcriptSummary,
  keyTakeaways,
  isWatched = false,
  onToggleWatched,
  className = ''
}: InAppVideoPlayerProps) {
  // On-demand load state: does not load iframe until student requests playback
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const [showFallbackDetails, setShowFallbackDetails] = useState(false);

  // Normalize YouTube Embed URL with privacy-enhanced domain and essential params
  const formatEmbedUrl = (rawUrl?: string): string => {
    if (!rawUrl) return '';
    
    // Ensure we use privacy-enhanced domain if it is a standard youtube link
    let formatted = rawUrl.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
    
    // Append standard parameters for optimal in-app playback
    const delimiter = formatted.includes('?') ? '&' : '?';
    // autoplay=1 (since user explicitly clicked play), rel=0 (hide non-related videos), modestbranding=1
    formatted = `${formatted}${delimiter}autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
    return formatted;
  };

  const formattedUrl = formatEmbedUrl(embedUrl);

  const handleStartPlayback = () => {
    setIsLoaded(true);
    setHasPlaybackError(false);
  };

  const handleToggleWatchedClick = () => {
    if (onToggleWatched) {
      onToggleWatched(!isWatched);
    }
  };

  return (
    <div id="in-app-video-player-container" className={`space-y-4 font-sans text-left ${className}`}>
      
      {/* 1. Main Video Stage (16:9 Responsive Container) */}
      <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center text-white">
        
        {/* State A: Not yet loaded (On-demand poster state) */}
        {!isLoaded && !hasPlaybackError && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-8 flex flex-col justify-between items-center text-center">
            
            {/* Top Bar inside Poster */}
            <div className="w-full flex items-center justify-between text-xs text-slate-300">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200">
                <Tv className="w-3.5 h-3.5 text-teal-400" />
                <span>In-App Lesson Player</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{durationLabel}</span>
              </div>
            </div>

            {/* Center Play Button & Title */}
            <div className="space-y-3 max-w-xl px-2">
              <button
                type="button"
                onClick={handleStartPlayback}
                className="group relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-600 hover:bg-teal-500 text-white shadow-lg hover:shadow-teal-500/25 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 mx-auto"
                aria-label={`Play video: ${title}`}
                title="Watch lesson in-app"
              >
                <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20 pointer-events-none group-hover:opacity-30" />
                <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
              </button>

              <div className="space-y-1">
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Educator: <strong className="text-teal-300">{creator}</strong>
                </p>
              </div>
            </div>

            {/* Bottom Notice */}
            <div className="w-full flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Loads on-demand via privacy-enhanced player</span>
              </span>

              <button
                type="button"
                onClick={() => setShowFallbackDetails(!showFallbackDetails)}
                className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Playback notes & source
              </button>
            </div>
          </div>
        )}

        {/* State B: Active Embedded Iframe Player */}
        {isLoaded && !hasPlaybackError && formattedUrl && (
          <div className="w-full h-full relative">
            <iframe
              src={formattedUrl}
              title={title}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setHasPlaybackError(true)}
            />
          </div>
        )}

        {/* State C: Fallback / Playback Error Screen */}
        {(hasPlaybackError || (!formattedUrl && isLoaded)) && (
          <div className="p-6 sm:p-8 text-center max-w-lg space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white">In-App Playback Unavailable</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The content provider may restrict third-party embeds in some browser settings or network firewalls. You can open the official educator video on the source platform, or continue using the complete notes and practice exercises below.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Open on {creator}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setHasPlaybackError(false);
                  setIsLoaded(false);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Video Controls & Information Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Left: Watched Toggle (Explicit Self-Reported, distinct from practice) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleWatchedClick}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer border min-h-[38px] ${
              isWatched
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="Mark whether you have watched this lesson video (Self-reported)"
          >
            <CheckCircle2 className={`w-4 h-4 ${isWatched ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>{isWatched ? 'Watched (Self-reported)' : 'Mark as watched (Self-reported)'}</span>
          </button>

          {isWatched && (
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium hidden sm:inline-block">
              Progress saved
            </span>
          )}
        </div>

        {/* Right: Source Attribution & Direct External Fallback */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap text-slate-600">
          <span>Educator: <strong className="text-slate-800">{creator}</strong></span>
          <span className="text-slate-300">•</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold hover:underline"
            title="Open original resource on educator portal"
          >
            <span>Original source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 3. Expandable Educational Attribution & Disclaimer Notice */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-[#FAF9F5] text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>Educational Fair Use & Attribution:</span>
        </div>
        <p className="leading-relaxed">
          {creatorDescription} Teaching content belongs strictly to the original educator/institution. SVT embeds verified lessons for student convenience and supplies structured notes, guided practice exercises, and study outlines. Watching inside SVT does not satisfy external exam or certificate requirements.
        </p>
      </div>

      {/* 4. Optional Collapsible Video Summary & Takeaways (Guarantees accessibility without video) */}
      {transcriptSummary && (
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Video Summary & Core Takeaways
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {transcriptSummary}
          </p>
          {keyTakeaways && keyTakeaways.length > 0 && (
            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 list-disc list-inside pt-1">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

    </div>
  );
}
