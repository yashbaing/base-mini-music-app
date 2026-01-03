import type { Track } from '@/types';

/**
 * Create a track object from an audio file URL
 */
export function createTrackFromUrl(
  url: string,
  title: string,
  artist: string = 'Unknown Artist',
  albumArt?: string
): Track {
  return {
    id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    artist,
    duration: 0, // Will be set when audio loads
    url,
    albumArt,
  };
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get audio file duration
 */
export function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.addEventListener('error', reject);
  });
}

