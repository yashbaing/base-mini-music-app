'use client';

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, X } from 'lucide-react';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { useState } from 'react';

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    stop,
  } = useAudioPlayerContext();

  const [showVolume, setShowVolume] = useState(false);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center text-gray-400">
        <p>No track selected</p>
        <p className="text-sm mt-2">Select a track to start playing</p>
      </div>
    );
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={14} className="sm:w-4 sm:h-4" />;
    return <Volume2 size={14} className="sm:w-4 sm:h-4" />;
  };

  return (
    <div 
      className="bg-gradient-to-br from-white/10 via-white/8 to-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 animate-fade-in border border-white/20 shadow-2xl w-full max-w-sm sm:max-w-xs mx-auto relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close/Cancel Button */}
      <button
        onClick={stop}
        className="absolute top-2 right-2 p-2.5 sm:p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/20 active:scale-95 transition-all touch-manipulation z-10 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
        aria-label="Close player"
      >
        <X size={20} className="sm:w-5 sm:h-5" />
      </button>

      {/* Square Layout */}
      <div className="flex flex-col items-center gap-4 sm:gap-4">
        {/* Album Art - Square */}
        <div className="w-full aspect-square max-w-[220px] sm:max-w-[240px]">
          {currentTrack.albumArt ? (
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-full h-full rounded-xl object-cover shadow-2xl border-2 border-orange-500/30"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-4xl sm:text-5xl shadow-2xl border-2 border-orange-400/30">
              {currentTrack.title.charAt(0)}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="w-full text-center min-w-0 px-2">
          <h3 className="text-white font-bold text-base sm:text-base truncate">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm sm:text-sm truncate mt-1.5">{currentTrack.artist}</p>
          {isPlaying && (
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
              <span className="text-orange-400 text-xs sm:text-xs font-medium">Now Playing</span>
            </div>
          )}
      </div>

      {/* Progress Bar */}
        <div className="w-full">
          <div className="flex items-center gap-2.5 sm:gap-2 mb-1.5 sm:mb-1">
            <span className="text-xs sm:text-xs text-gray-400 w-12 sm:w-10 text-right flex-shrink-0">{formatTime(currentTime)}</span>
          <div className="flex-1 relative">
              <div className="h-2 sm:h-2 bg-gray-700/30 rounded-full overflow-hidden">
              <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 transition-all duration-100 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-none"
                style={{ minHeight: '44px' }}
            />
          </div>
            <span className="text-xs sm:text-xs text-gray-400 w-12 sm:w-10 flex-shrink-0">{formatTime(duration)}</span>
        </div>
      </div>

        {/* Controls - Grid Layout */}
        <div className="w-full">
          {/* Main Playback Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-3 mb-3 sm:mb-2">
          <button
            onClick={toggleShuffle}
              className={`p-3 sm:p-2.5 rounded-full transition-all active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                shuffle ? 'text-orange-400 bg-white/15' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
              aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
              <Shuffle size={20} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={previous}
              className="p-3 sm:p-2.5 rounded-full text-white hover:bg-white/15 active:bg-white/20 active:scale-95 transition-all touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              aria-label="Previous track"
          >
              <SkipBack size={22} fill="currentColor" className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={togglePlayPause}
              className="p-4 sm:p-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500 active:scale-95 transition-all shadow-xl shadow-orange-500/30 touch-manipulation min-w-[56px] min-h-[56px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              aria-label={isPlaying ? 'Pause' : 'Play'}
          >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" className="sm:w-7 sm:h-7" />
              ) : (
                <Play size={24} fill="currentColor" className="sm:w-7 sm:h-7 ml-0.5" />
              )}
          </button>
          <button
            onClick={next}
              className="p-3 sm:p-2.5 rounded-full text-white hover:bg-white/15 active:bg-white/20 active:scale-95 transition-all touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              aria-label="Next track"
          >
              <SkipForward size={22} fill="currentColor" className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={toggleRepeat}
              className={`p-3 sm:p-2.5 rounded-full transition-all active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
                repeat !== 'none' ? 'text-orange-400 bg-white/15' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
              aria-label={`Repeat: ${repeat}`}
          >
              <Repeat size={20} className={`sm:w-5 sm:h-5 ${repeat === 'one' ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Volume Control */}
          <div className="flex items-center justify-center gap-3 sm:gap-2 w-full">
          <button
              onClick={() => setShowVolume(!showVolume)}
              onMouseEnter={() => setShowVolume(true)}
              className="p-3 sm:p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              aria-label={volume > 0 ? 'Mute' : 'Unmute'}
            >
              {getVolumeIcon()}
          </button>
            <div className="relative group flex-1 max-w-[140px] sm:max-w-[150px]">
              <div className="h-2 sm:h-1.5 bg-gray-700/50 rounded-full">
              <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-none"
                style={{ minHeight: '44px' }}
                aria-label="Volume"
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

