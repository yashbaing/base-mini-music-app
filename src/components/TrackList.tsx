'use client';

import { Play, Plus, X } from 'lucide-react';
import type { Track } from '@/types';

interface TrackListProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  currentTrackId?: string;
  onAddToPlaylist?: (track: Track) => void;
  onRemove?: (trackId: string) => void;
  showRemove?: boolean;
}

export function TrackList({ tracks, onPlay, currentTrackId, onAddToPlaylist, onRemove, showRemove }: TrackListProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center text-gray-400">
        <p>No tracks available</p>
        <p className="text-sm mt-2">Add audio files to the public/audio folder</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          onClick={() => onPlay(track)}
          className={`group relative w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 active:bg-white/15 transition-all duration-300 flex items-center gap-3 sm:gap-4 cursor-pointer ${
            currentTrackId === track.id 
              ? 'bg-gradient-to-r from-orange-600/40 to-amber-600/40 border-2 border-orange-500/60 shadow-xl shadow-orange-500/30 scale-[1.02]' 
              : 'border border-white/5 hover:border-white/20'
          }`}
        >
          <div className="w-8 sm:w-10 text-center text-gray-400 text-xs sm:text-sm font-medium group-hover:text-white transition-colors flex-shrink-0">
            {currentTrackId === track.id ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 flex items-center justify-center mx-auto animate-pulse">
                <Play size={10} fill="white" className="sm:w-3 sm:h-3" />
              </div>
            ) : (
              <span className="block">{index + 1}</span>
            )}
          </div>
          
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt={track.title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-xl border-2 border-white/10 flex-shrink-0 group-hover:border-orange-500/30 transition-all"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xl border-2 border-orange-400/30 flex-shrink-0 group-hover:scale-105 transition-transform">
              {track.title.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold truncate text-sm sm:text-base ${
              currentTrackId === track.id ? 'text-orange-400' : 'text-white'
            }`}>
              {track.title}
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm truncate mt-0.5">{track.artist}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {onAddToPlaylist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToPlaylist(track);
                }}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
                title="Add to playlist"
              >
                <Plus size={16} className="sm:w-4 sm:h-4" />
              </button>
            )}
            {showRemove && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(track.id);
                }}
                className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/10 active:bg-white/20 transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
                title="Remove"
              >
                <X size={16} className="sm:w-4 sm:h-4" />
              </button>
            )}
            <div className="p-2 sm:p-3 rounded-full bg-white/10 sm:bg-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-600 text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 touch-manipulation">
              <Play size={14} fill="currentColor" className="sm:w-4 sm:h-4" />
            </div>
            <span className="text-gray-400 text-xs sm:text-sm w-12 sm:w-14 text-right font-medium">
              {formatDuration(track.duration)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

