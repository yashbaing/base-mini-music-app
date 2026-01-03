'use client';

import { Play } from 'lucide-react';
import type { Track } from '@/types';

interface MusicSectionProps {
  title: string;
  subtitle?: string;
  tracks: Track[];
  onPlay: (track: Track) => void;
  currentTrackId?: string;
  layout?: 'grid' | 'list';
}

export function MusicSection({ title, subtitle, tracks, onPlay, currentTrackId, layout = 'grid' }: MusicSectionProps) {
  if (tracks.length === 0 && title) return null;

  return (
    <section className="mb-12">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group cursor-pointer"
              onClick={() => onPlay(track)}
            >
              <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/50">
                    {track.title.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Play size={20} fill="white" className="ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm truncate">{track.title}</h3>
              <p className="text-gray-400 text-xs truncate mt-0.5">{track.artist}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => onPlay(track)}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group ${
                currentTrackId === track.id ? 'bg-orange-600/20' : ''
              }`}
            >
              <div className="w-10 text-center text-gray-400 text-sm font-medium">{index + 1}</div>
              {track.albumArt ? (
                <img
                  src={track.albumArt}
                  alt={track.title}
                  className="w-12 h-12 rounded object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  {track.title.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${currentTrackId === track.id ? 'text-orange-400' : 'text-white'}`}>
                  {track.title}
                </h4>
                <p className="text-gray-400 text-sm truncate">{track.artist}</p>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(track);
                }}
              >
                <Play size={16} fill="currentColor" className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

