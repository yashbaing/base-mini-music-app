'use client';

import { WalletButton } from '@/components/WalletButton';
import { MusicPlayer } from '@/components/MusicPlayer';
import { TrackList } from '@/components/TrackList';
import { SearchBar } from '@/components/SearchBar';
import { PointsDisplay } from '@/components/PointsDisplay';
import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlayHistory } from '@/hooks/usePlayHistory';
import { usePoints } from '@/hooks/usePoints';
import { useWallet } from '@/hooks/useWallet';
import { AudioPlayerProvider, useAudioPlayerContext } from '@/contexts/AudioPlayerContext';
import { Play, Music2 } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import type { Track } from '@/types';

function HomeContent() {
  const { playlists } = usePlaylist();
  const { play, currentTrack, currentTime, isPlaying, stop } = useAudioPlayerContext();
  const { address, isConnected } = useWallet();
  const { addPlayHistory, updatePlayHistory } = usePlayHistory();
  const { addPoints, getPoints, points: pointsState } = usePoints();
  
  // Recalculate points when pointsState changes for real-time updates
  const userPoints = useMemo(() => {
    return isConnected && address ? getPoints(address) : 0;
  }, [isConnected, address, getPoints, pointsState]);
  const [searchQuery, setSearchQuery] = useState('');
  const playTimeRef = useRef<{ startTime: number; lastSaveTime: number; trackId: string | null }>({
    startTime: 0,
    lastSaveTime: 0,
    trackId: null,
  });

  // Get all tracks from all playlists combined
  const allTracks: Track[] = playlists.flatMap(playlist => playlist.tracks);

  // Initialize Farcaster miniapp SDK
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  // Track play time for history and points - save every 5 seconds
  useEffect(() => {
    if (!currentTrack || !isPlaying) {
      // Save accumulated time when stopping
      if (playTimeRef.current.trackId && playTimeRef.current.lastSaveTime > 0) {
        const timePlayed = Date.now() - playTimeRef.current.lastSaveTime;
        if (timePlayed > 0) {
          const playTimeSeconds = Math.floor(timePlayed / 1000);
          updatePlayHistory(
            playTimeRef.current.trackId,
            playTimeSeconds,
            isConnected ? address : undefined
          );
          // Add points for Maharajancha Mavla
          if (isConnected && address) {
            addPoints(address, playTimeSeconds);
          }
        }
        playTimeRef.current.lastSaveTime = 0;
      }
      return;
    }

    // New track started
    if (playTimeRef.current.trackId !== currentTrack.id) {
      // Save previous track if any
      if (playTimeRef.current.trackId && playTimeRef.current.lastSaveTime > 0) {
        const timePlayed = Date.now() - playTimeRef.current.lastSaveTime;
        if (timePlayed > 0) {
          const playTimeSeconds = Math.floor(timePlayed / 1000);
          updatePlayHistory(
            playTimeRef.current.trackId,
            playTimeSeconds,
            isConnected ? address : undefined
          );
          // Add points for Maharajancha Mavla
          if (isConnected && address) {
            addPoints(address, playTimeSeconds);
          }
        }
      }
      // Add new track to history
      addPlayHistory(currentTrack, 0, isConnected ? address : undefined);
      playTimeRef.current = {
        startTime: Date.now(),
        lastSaveTime: Date.now(),
        trackId: currentTrack.id,
      };
    }

    // Save play time every 5 seconds
    const interval = setInterval(() => {
      if (currentTrack && isPlaying && playTimeRef.current.trackId === currentTrack.id && playTimeRef.current.lastSaveTime > 0) {
        const timePlayed = Date.now() - playTimeRef.current.lastSaveTime;
        if (timePlayed >= 5000) { // Save every 5 seconds
          const playTimeSeconds = Math.floor(timePlayed / 1000);
          updatePlayHistory(
            currentTrack.id,
            playTimeSeconds,
            isConnected ? address : undefined
          );
          // Add points for Maharajancha Mavla
          if (isConnected && address) {
            addPoints(address, playTimeSeconds);
          }
          playTimeRef.current.lastSaveTime = Date.now();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTrack, isPlaying, allTracks, isConnected, address, updatePlayHistory, addPlayHistory, addPoints]);

  // Save play history and points when component unmounts
  useEffect(() => {
    return () => {
      if (playTimeRef.current.trackId && playTimeRef.current.lastSaveTime > 0) {
        const timePlayed = Date.now() - playTimeRef.current.lastSaveTime;
        if (timePlayed > 0) {
          const playTimeSeconds = Math.floor(timePlayed / 1000);
          updatePlayHistory(
            playTimeRef.current.trackId,
            playTimeSeconds,
            isConnected ? address : undefined
          );
          // Add points for Maharajancha Mavla
          if (isConnected && address) {
            addPoints(address, playTimeSeconds);
          }
        }
      }
    };
  }, [isConnected, address, updatePlayHistory, addPoints]);

  // Filter tracks based on search query
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    const query = searchQuery.toLowerCase();
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(query) || 
      track.artist.toLowerCase().includes(query)
    );
  }, [allTracks, searchQuery]);

  const handlePlay = (track: Track) => {
    play(track);
  };

  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      play(filteredTracks[0]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-4 md:py-6 lg:py-8">
        {/* Header */}
        <header className="mb-5 sm:mb-5 md:mb-6">
          <div className="flex flex-col gap-3 sm:gap-3 md:gap-4">
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-1 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent leading-tight">
                Shivcharitra by Ninad Bedekar Sir
              </h1>
              <p className="text-gray-400 text-sm sm:text-sm">Chhatrapati Shivaji Maharaj&apos;s Musical Legacy</p>
            </div>
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Points Display - Show when wallet is connected */}
              {isConnected && address && (
                <PointsDisplay points={userPoints} walletAddress={address} />
              )}
              <WalletButton />
            </div>
          </div>
        </header>

        {/* Main Content - All Tracks (Primary Focus) */}
        {allTracks.length > 0 ? (
          <div className="bg-gradient-to-br from-white/5 via-white/3 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-4 md:p-5 border border-white/10 shadow-2xl">
            {/* Search Bar */}
            <div className="mb-4 sm:mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-3 mb-4 sm:mb-4">
              <div className="flex items-center gap-2.5 sm:gap-2">
                <div className="p-2 sm:p-2 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-lg border border-orange-500/20 flex-shrink-0">
                  <Music2 className="text-orange-400" size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-lg md:text-xl font-bold text-white truncate">All Tracks</h2>
                  <p className="text-gray-400 text-sm sm:text-sm mt-0.5">
                    {filteredTracks.length} {filteredTracks.length === 1 ? 'song' : 'songs'}
                    {searchQuery && filteredTracks.length !== allTracks.length && ` of ${allTracks.length}`}
                  </p>
                </div>
              </div>
              {filteredTracks.length > 0 && (
                <button
                  onClick={handlePlayAll}
                  className="w-full sm:w-auto px-5 sm:px-5 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-sm touch-manipulation min-h-[44px] sm:min-h-0"
                >
                  <Play size={16} fill="white" />
                  <span>Play All</span>
                </button>
              )}
            </div>
            {filteredTracks.length > 0 ? (
              <TrackList
                tracks={filteredTracks}
                onPlay={handlePlay}
                currentTrackId={currentTrack?.id}
              />
            ) : (
              <div className="text-center py-16">
                <Music2 className="mx-auto mb-4 text-gray-500/50" size={48} />
                <p className="text-gray-400 text-lg">No tracks found</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-32">
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10">
              <Music2 size={56} className="mx-auto mb-6 text-orange-400/50" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome to Shivcharitra by Ninad Bedekar Sir</h2>
              <p className="text-gray-400 text-base sm:text-lg px-4">
                Add audio files to the <code className="bg-white/10 px-2 py-1 rounded-lg text-orange-400 text-sm">public/audio</code> folder to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Popup Music Player Modal */}
      {currentTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop - Clickable to close */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-backdrop-fade"
            onClick={stop}
          />
          
          {/* Player Popup */}
          <div className="relative z-10 w-full max-w-sm sm:max-w-md animate-modal-popup">
            <MusicPlayer />
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  const { playlists } = usePlaylist();
  // Get all tracks from all playlists
  const allTracks = playlists.flatMap(playlist => playlist.tracks);

  return (
    <AudioPlayerProvider tracks={allTracks}>
      <HomeContent />
    </AudioPlayerProvider>
  );
}
