'use client';

import { useState } from 'react';
import { Plus, Music, X } from 'lucide-react';
import { usePlaylist } from '@/hooks/usePlaylist';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { TrackList } from './TrackList';
import type { Track } from '@/types';

interface PlaylistViewProps {
  availableTracks?: Track[];
}

export function PlaylistView({ availableTracks = [] }: PlaylistViewProps) {
  const { play, currentTrack } = useAudioPlayerContext();
  const { playlists, currentPlaylist, createPlaylist, selectPlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist, setPlaylistCoverImage } = usePlaylist();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlist = createPlaylist(newPlaylistName.trim());
      selectPlaylist(playlist.id);
      setNewPlaylistName('');
      setShowCreateDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Playlist Selector */}
      <div className="glass-dark rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <Music size={20} />
            Playlists
          </h2>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="glass px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        {showCreateDialog && (
          <div className="mb-4 p-4 bg-white/5 rounded-lg">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreatePlaylist();
                if (e.key === 'Escape') setShowCreateDialog(false);
              }}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-1.5 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors ${
                currentPlaylist?.id === playlist.id
                  ? 'bg-orange-600 text-white'
                  : 'glass text-white hover:bg-white/10'
              }`}
              onClick={() => selectPlaylist(playlist.id)}
            >
              <span className="text-sm font-medium">{playlist.name}</span>
              {playlists.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${playlist.name}"?`)) {
                      deletePlaylist(playlist.id);
                    }
                  }}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Playlist Tracks */}
      {currentPlaylist && (
        <div>
          <div className="mb-4">
            {/* Playlist Cover Image */}
            {currentPlaylist.coverImage ? (
              <div className="glass-dark rounded-2xl overflow-hidden mb-4">
                <img
                  src={currentPlaylist.coverImage}
                  alt={currentPlaylist.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="glass-dark rounded-2xl h-48 mb-4 flex items-center justify-center bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-600/20">
                <div className="text-center text-gray-400">
                  <Music size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No cover image</p>
                </div>
              </div>
            )}
            <div className="px-2">
              <h3 className="text-white font-medium text-xl">{currentPlaylist.name}</h3>
              <p className="text-gray-400 text-sm">{currentPlaylist.tracks.length} tracks</p>
            </div>
          </div>
          <TrackList
            tracks={currentPlaylist.tracks}
            onPlay={(track) => play(track)}
            currentTrackId={currentTrack?.id}
            onRemove={removeTrackFromPlaylist.bind(null, currentPlaylist.id)}
            showRemove
          />
        </div>
      )}

      {/* Available Tracks to Add */}
      {availableTracks.length > 0 && currentPlaylist && (
        <div>
          <div className="mb-2 px-2">
            <h3 className="text-white font-medium">Available Tracks</h3>
            <p className="text-gray-400 text-sm">Click + to add to playlist</p>
          </div>
          <TrackList
            tracks={availableTracks.filter(t => !currentPlaylist.tracks.some(pt => pt.id === t.id))}
            onPlay={(track) => play(track)}
            onAddToPlaylist={addTrackToPlaylist.bind(null, currentPlaylist.id)}
          />
        </div>
      )}
    </div>
  );
}

