'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Track } from '@/types';

export interface PlayHistoryItem {
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  trackUrl: string;
  albumArt?: string;
  playDate: number;
  playDuration: number; // Time played in seconds
  totalDuration: number; // Total track duration
  walletAddress?: string; // Wallet address if logged in
}

const STORAGE_KEY = 'base-music-play-history';
const MAX_HISTORY_ITEMS = 50;

export function usePlayHistory() {
  const [playHistory, setPlayHistory] = useState<PlayHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPlayHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading play history:', error);
      }
    }
  }, []);


  const addPlayHistory = useCallback((
    track: Track,
    playDuration: number,
    walletAddress?: string
  ) => {
    setPlayHistory(prevHistory => {
      const historyItem: PlayHistoryItem = {
        trackId: track.id,
        trackTitle: track.title,
        trackArtist: track.artist,
        trackUrl: track.url,
        albumArt: track.albumArt,
        playDate: Date.now(),
        playDuration,
        totalDuration: track.duration,
        walletAddress,
      };

      const updated = [historyItem, ...prevHistory.filter(item => item.trackId !== track.id)];
      const limited = updated.slice(0, MAX_HISTORY_ITEMS);
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
        } catch (error) {
          console.error('Error saving play history:', error);
        }
      }
      
      return limited;
    });
  }, []);

  const updatePlayHistory = useCallback((
    trackId: string,
    playDuration: number,
    walletAddress?: string
  ) => {
    setPlayHistory(prevHistory => {
      const existingIndex = prevHistory.findIndex(item => item.trackId === trackId);
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prevHistory];
        updated[existingIndex] = {
          ...updated[existingIndex],
          playDuration: updated[existingIndex].playDuration + playDuration,
          playDate: Date.now(),
          walletAddress: walletAddress || updated[existingIndex].walletAddress,
        };
        // Move to top (most recent)
        const [moved] = updated.splice(existingIndex, 1);
        const limited = [moved, ...updated].slice(0, MAX_HISTORY_ITEMS);
        
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
          } catch (error) {
            console.error('Error saving play history:', error);
          }
        }
        
        return limited;
      }
      
      return prevHistory;
    });
  }, []);

  const clearPlayHistory = useCallback(() => {
    setPlayHistory([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing play history:', error);
      }
    }
  }, []);

  const getRecentPlays = (limit: number = 10): PlayHistoryItem[] => {
    return playHistory.slice(0, limit);
  };

  const getPlayProgress = (trackId: string): number => {
    const item = playHistory.find(h => h.trackId === trackId);
    if (!item || item.totalDuration === 0) return 0;
    return (item.playDuration / item.totalDuration) * 100;
  };

  return {
    playHistory,
    addPlayHistory,
    updatePlayHistory,
    clearPlayHistory,
    getRecentPlays,
    getPlayProgress,
  };
}

