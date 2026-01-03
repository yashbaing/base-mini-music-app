'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Track } from '@/types';

export function useAudioPlayer(tracks: Track[]) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      const updateTime = () => setCurrentTime(audioRef.current?.currentTime || 0);
      const updateDuration = () => setDuration(audioRef.current?.duration || 0);
      const handleEnded = () => {
        if (repeat === 'one') {
          audioRef.current?.play();
        } else if (repeat === 'all') {
          handleNext();
        } else {
          setIsPlaying(false);
        }
      };

      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        audioRef.current?.removeEventListener('timeupdate', updateTime);
        audioRef.current?.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current?.removeEventListener('ended', handleEnded);
        audioRef.current?.pause();
        audioRef.current = null;
      };
    }
  }, [repeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const play = useCallback((track?: Track) => {
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  }, [currentTrack, isPlaying]);

  const handleNext = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex: number;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= tracks.length) {
        nextIndex = 0;
      }
    }

    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  }, [currentTrack, tracks, shuffle]);

  const handlePrevious = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    let prevIndex: number;

    if (shuffle) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = tracks.length - 1;
      }
    }

    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  }, [currentTrack, tracks, shuffle]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(!shuffle);
  }, [shuffle]);

  const toggleRepeat = useCallback(() => {
    setRepeat(
      repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none'
    );
  }, [repeat]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    play,
    pause,
    stop,
    togglePlayPause,
    next: handleNext,
    previous: handlePrevious,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  };
}

