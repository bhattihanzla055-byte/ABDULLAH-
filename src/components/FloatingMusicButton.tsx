import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music2, ExternalLink, Play, Pause, Disc3 } from 'lucide-react';
import { weddingAudio } from '../utils/audioSynth';
import { WeddingData } from '../types/wedding';

interface FloatingMusicButtonProps {
  data: WeddingData;
}

export const FloatingMusicButton: React.FC<FloatingMusicButtonProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (data.youtubeVideoId) {
      weddingAudio.setYoutubeVideoId(data.youtubeVideoId);
    }
    if (data.musicUrl) {
      weddingAudio.setCustomUrl(data.musicUrl);
    }
  }, [data.youtubeVideoId, data.musicUrl]);

  useEffect(() => {
    const unsubscribe = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    weddingAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    weddingAudio.setVolume(val);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Expanded Wedding Music Banner */}
      {isExpanded && (
        <div
          id="expanded-music-player"
          className="w-72 rounded-2xl border border-[#D4AF37]/50 bg-[#FAF7F2]/95 p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[#D4AF37]/20 pb-2.5">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF0DC] border border-[#D4AF37] ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`}>
                <Disc3 className="h-4 w-4 text-[#A88234]" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate font-serif-luxury text-sm font-semibold text-[#2F2318]">
                  {data.musicTitle || 'Wedding Sehra'}
                </p>
                <p className="truncate text-[10px] font-sans text-[#7D6650]">
                  {data.musicArtist || 'Mazhar Rahi & Fiza Ali'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[#9C856C] hover:text-[#523F2B] text-xs p-1"
              title="Close player panel"
            >
              ✕
            </button>
          </div>

          {/* Controls: Play/Pause, Volume, and YouTube Watch Link */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleToggle}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#C59B27] to-[#B89240] text-white shadow-xs transition-transform active:scale-90"
              title={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            <div className="flex flex-1 items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-[#8A7153]" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="h-1.5 w-full cursor-pointer accent-[#C59B27]"
              />
            </div>

            {data.youtubeUrl && (
              <a
                href={data.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-md bg-[#FAF0DC] px-2 py-1 text-[10px] font-medium text-[#7D6650] hover:bg-[#F3E2C3] transition-colors"
                title="Open music video on YouTube"
              >
                <span>YouTube</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <div className="flex items-center gap-2">
        {/* Subtle pill label when playing */}
        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="hidden items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FAF7F2]/90 px-3 py-1.5 shadow-md backdrop-blur-xs transition-transform hover:scale-105 sm:flex cursor-pointer"
          >
            <span className="font-cinzel text-[10px] font-semibold tracking-wider text-[#A88234] uppercase">
              {isPlaying ? 'Now Playing' : 'Wedding Music'}
            </span>
            <span className="max-w-[120px] truncate text-[11px] font-serif-luxury text-[#4A3B2B]">
              {data.musicTitle}
            </span>
          </button>
        )}

        {/* Main Circular Music Button */}
        <button
          type="button"
          id="floating-music-toggle"
          onClick={() => {
            if (!isPlaying) {
              weddingAudio.play();
            } else {
              setIsExpanded((prev) => !prev);
            }
          }}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-white text-[#8C6D2D] shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label={isPlaying ? 'Music playing, click for options' : 'Play wedding music'}
          title={isPlaying ? 'Click to view player / pause' : 'Play wedding music'}
        >
          {/* Animated pulsing glow when playing */}
          {isPlaying && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#D4AF37]/35 opacity-75" />
          )}

          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="h-4 w-1 animate-[bounce_0.8s_infinite_100ms] rounded-full bg-[#C59B27]" />
              <span className="h-6 w-1 animate-[bounce_0.8s_infinite_200ms] rounded-full bg-[#C59B27]" />
              <span className="h-3 w-1 animate-[bounce_0.8s_infinite_300ms] rounded-full bg-[#C59B27]" />
            </div>
          ) : (
            <Music2 className="h-5 w-5 text-[#9E825A] group-hover:text-[#6F5224]" />
          )}
        </button>
      </div>
    </div>
  );
};
