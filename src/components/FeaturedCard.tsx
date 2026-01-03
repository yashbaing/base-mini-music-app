'use client';

import { Play } from 'lucide-react';
import type { Track } from '@/types';

interface FeaturedCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  label?: string;
}

export function FeaturedCard({ track, onPlay, label }: FeaturedCardProps) {
  return (
    <div
      className="group relative w-full h-80 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => onPlay(track)}
    >
      {/* Background Image */}
      {track.albumArt ? (
        <img
          src={track.albumArt}
          alt={track.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        {label && (
          <span className="text-orange-400 text-xs font-semibold uppercase mb-3 tracking-wider">
            {label}
          </span>
        )}
        <h3 className="text-white text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          {track.title}
        </h3>
        <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-md">
          {track.artist}
        </p>
        <button
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-200 transform"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(track);
          }}
        >
          <Play size={32} fill="white" className="ml-1" />
        </button>
      </div>
    </div>
  );
}
