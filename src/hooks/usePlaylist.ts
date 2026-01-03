'use client';

import { useState, useEffect } from 'react';
import type { Track, Playlist } from '@/types';

const STORAGE_KEY = 'base-music-playlists';

// List of all audio files that exist in public/audio folder
const AUDIO_FILES = [
  'Shivcharitra by Ninad Bedekar Sir Ep_01.mp3',
  'Panipat by Ninad Bedekar Sir Ep_01.mp3',
  'Panipat by Ninad Bedekar Sir Ep_02.mp3',
  'Panipat by Ninad Bedekar Sir Ep_03.mp3',
];

export function usePlaylist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

  // Get audio file duration
  const getAudioDuration = async (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration || 0);
      });
      audio.addEventListener('error', () => {
        resolve(0);
      });
      // Timeout after 5 seconds
      setTimeout(() => resolve(0), 5000);
    });
  };

  // Auto-discover audio files and create playlists
  const discoverTracks = async (): Promise<{ shivcharitra: Track[], panipat: Track[] }> => {
    const shivcharitraTracks: Track[] = [];
    const panipatTracks: Track[] = [];

    // Process each audio file and load actual duration
    for (let index = 0; index < AUDIO_FILES.length; index++) {
      const filename = AUDIO_FILES[index];
      const url = `/audio/${encodeURIComponent(filename)}`;
      
      // Load actual duration from audio file
      const duration = await getAudioDuration(url);
      
      const track: Track = {
        id: `track-${index + 1}-${filename.replace(/[^a-zA-Z0-9]/g, '-')}`,
        title: filename.replace('.mp3', '').replace(/by Ninad Bedekar Sir/g, '').trim(),
        artist: 'Ninad Bedekar Sir',
        duration: duration || 0,
        url: url,
        albumArt: '/images/Ninad%20Bedekar%20Sir.png',
      };

      // Categorize tracks
      if (filename.toLowerCase().includes('shivcharitra')) {
        shivcharitraTracks.push(track);
      } else if (filename.toLowerCase().includes('panipat')) {
        panipatTracks.push(track);
      }
    }

    return { shivcharitra: shivcharitraTracks, panipat: panipatTracks };
  };

  useEffect(() => {
    const initializePlaylists = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { shivcharitra, panipat } = await discoverTracks();
          
          const shivcharitraPlaylist: Playlist = {
            id: 'shivcharitra',
            name: 'Shivcharitra by Ninad Bedekar Sir',
            tracks: shivcharitra,
            createdAt: Date.now(),
            coverImage: '/images/Ninad%20Bedekar%20Sir.png',
          };

          const panipatPlaylist: Playlist = {
            id: 'panipat',
            name: 'Panipat by Ninad Bedekar Sir',
            tracks: panipat,
            createdAt: Date.now(),
            coverImage: '/images/Ninad%20Bedekar%20Sir.png',
          };

          const allPlaylists = [];
          if (shivcharitra.length > 0) {
            allPlaylists.push(shivcharitraPlaylist);
          }
          if (panipat.length > 0) {
            allPlaylists.push(panipatPlaylist);
          }

          setPlaylists(allPlaylists);
          if (allPlaylists.length > 0) {
            setCurrentPlaylist(allPlaylists[0]);
          }
          
          // Save to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlaylists));
        } catch (error) {
          console.error('Error initializing playlists:', error);
        }
      }
    };

    initializePlaylists();
  }, []); // Empty dependency array - run once on mount

  const savePlaylists = (newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlaylists));
    }
  };

  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks: [],
      createdAt: Date.now(),
    };
    const updated = [...playlists, newPlaylist];
    savePlaylists(updated);
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    const updated = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: [...playlist.tracks, track],
        };
      }
      return playlist;
    });
    savePlaylists(updated);
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(updated.find(p => p.id === playlistId) || null);
    }
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    const updated = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter(t => t.id !== trackId),
        };
      }
      return playlist;
    });
    savePlaylists(updated);
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(updated.find(p => p.id === playlistId) || null);
    }
  };

  const selectPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setCurrentPlaylist(playlist);
    }
  };

  const deletePlaylist = (playlistId: string) => {
    const updated = playlists.filter(p => p.id !== playlistId);
    savePlaylists(updated);
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(updated[0] || null);
    }
  };

  const setPlaylistCoverImage = (playlistId: string, imageUrl: string) => {
    const updated = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          coverImage: imageUrl,
        };
      }
      return playlist;
    });
    savePlaylists(updated);
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(updated.find(p => p.id === playlistId) || null);
    }
  };

  return {
    playlists,
    currentPlaylist,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    selectPlaylist,
    deletePlaylist,
    setPlaylistCoverImage,
    discoverTracks,
  };
}
