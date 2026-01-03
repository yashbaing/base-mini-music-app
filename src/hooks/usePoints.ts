'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PointsEntry {
  walletAddress: string;
  totalPoints: number;
  playTimeMinutes: number;
  lastUpdated: number;
}

const STORAGE_KEY = 'base-music-points';
const POINTS_PER_MINUTE = 0.2; // 1 point per 5 minutes of play time (0.2 points per minute)

export function usePoints() {
  const [points, setPoints] = useState<PointsEntry[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Clear all existing points to start fresh with new system
        localStorage.removeItem(STORAGE_KEY);
        setPoints([]);
      } catch (error) {
        console.error('Error clearing points:', error);
      }
    }
  }, []);

  const addPoints = useCallback((walletAddress: string, playTimeSeconds: number) => {
    if (!walletAddress || playTimeSeconds <= 0) return;

    const playTimeMinutes = playTimeSeconds / 60;
    
    setPoints(prevPoints => {
      const existingIndex = prevPoints.findIndex(p => p.walletAddress.toLowerCase() === walletAddress.toLowerCase());
      
      if (existingIndex >= 0) {
        // Update existing entry - accumulate minutes
        const updated = [...prevPoints];
        updated[existingIndex] = {
          ...updated[existingIndex],
          playTimeMinutes: updated[existingIndex].playTimeMinutes + playTimeMinutes,
          lastUpdated: Date.now(),
        };
        // Calculate total points based on accumulated minutes (1 point per minute)
        const totalPointsEarned = Math.floor(updated[existingIndex].playTimeMinutes * POINTS_PER_MINUTE);
        updated[existingIndex].totalPoints = totalPointsEarned;
        
        const limited = updated.slice(0, 100);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
          } catch (error) {
            console.error('Error saving points:', error);
          }
        }
        return limited;
      } else {
        // Create new entry
        const totalPointsEarned = Math.floor(playTimeMinutes * POINTS_PER_MINUTE);
        const newEntry: PointsEntry = {
          walletAddress,
          totalPoints: totalPointsEarned,
          playTimeMinutes,
          lastUpdated: Date.now(),
        };
        const updated = [...prevPoints, newEntry];
        const limited = updated.slice(0, 100);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
          } catch (error) {
            console.error('Error saving points:', error);
          }
        }
        return limited;
      }
    });
  }, []);

  const getPoints = useCallback((walletAddress: string): number => {
    if (!walletAddress) return 0;
    const entry = points.find(p => p.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    return entry?.totalPoints || 0;
  }, [points]);

  const getPlayTimeMinutes = useCallback((walletAddress: string): number => {
    if (!walletAddress) return 0;
    const entry = points.find(p => p.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    return entry?.playTimeMinutes || 0;
  }, [points]);

  const getAllPoints = useCallback((): PointsEntry[] => {
    return [...points].sort((a, b) => b.totalPoints - a.totalPoints);
  }, [points]);

  const clearPoints = useCallback(() => {
    setPoints([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing points:', error);
      }
    }
  }, []);

  return {
    points, // Expose points state for reactivity
    addPoints,
    getPoints,
    getPlayTimeMinutes,
    getAllPoints,
    clearPoints,
  };
}
