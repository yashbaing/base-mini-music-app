'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Image, Music } from 'lucide-react';
import type { NFTMetadata } from '@/types';

export function NFTGallery() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder: In a real app, you would fetch NFTs from the contract
  // This is a demo implementation
  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      // Simulate fetching NFTs - replace with actual contract calls
      setTimeout(() => {
        setNfts([]);
        setLoading(false);
      }, 1000);
    } else {
      setNfts([]);
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center text-gray-400">
        <Image size={48} className="mx-auto mb-4 opacity-50" />
        <p>Connect your wallet to view NFTs</p>
        <p className="text-sm mt-2">Owned NFT album art will appear here</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white/10 rounded-lg"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center text-gray-400">
        <Music size={48} className="mx-auto mb-4 opacity-50" />
        <p>No NFTs found</p>
        <p className="text-sm mt-2">Your music NFTs will appear here</p>
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl p-6">
      <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Image size={20} />
        Your NFTs
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            className="glass rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="aspect-square relative">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-album.png';
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium text-sm truncate">{nft.name}</h3>
              {nft.description && (
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{nft.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

