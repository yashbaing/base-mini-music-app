'use client';

import { Clock, Play } from 'lucide-react';
import type { PlayHistoryItem } from '@/hooks/usePlayHistory';

interface RecentPlaysProps {
  recentPlays: PlayHistoryItem[];
  onPlay: (trackUrl: string) => void;
}

export function RecentPlays({ recentPlays, onPlay }: RecentPlaysProps) {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getProgressPercentage = (item: PlayHistoryItem) => {
    if (!item.totalDuration || item.totalDuration === 0) return 0;
    return Math.min((item.playDuration / item.totalDuration) * 100, 100);
  };

  if (recentPlays.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/10 shadow-2xl mb-4 sm:mb-5 md:mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-orange-400" size={20} />
        <h2 className="text-lg sm:text-xl font-bold text-white">Recent Plays</h2>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {recentPlays.slice(0, 5).map((item) => {
          const progress = getProgressPercentage(item);
          return (
            <div
              key={`${item.trackId}-${item.playDate}`}
              onClick={() => onPlay(item.trackUrl)}
              className="group relative p-3 sm:p-3.5 rounded-xl hover:bg-white/10 active:bg-white/15 transition-all duration-200 flex items-center gap-3 cursor-pointer border border-white/5 hover:border-white/20"
            >
              {item.albumArt ? (
                <img
                  src={item.albumArt}
                  alt={item.trackTitle}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 shadow-lg border border-white/10"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-lg border border-orange-400/30">
                  {item.trackTitle.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-white truncate">
                  {item.trackTitle}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm truncate">{item.trackArtist}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{formatTime(item.playDuration)} / {formatTime(item.totalDuration)}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">{formatDate(item.playDate)}</span>
                </div>
                {/* Progress Bar */}
                <div className="mt-2 h-1 bg-gray-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(item.trackUrl);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-orange-600 hover:to-amber-600 text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 touch-manipulation flex-shrink-0"
                aria-label="Play"
              >
                <Play size={14} fill="currentColor" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

