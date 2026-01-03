'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Coins, Trophy, TrendingUp } from 'lucide-react';

interface TokenRewardsData {
  balance: string;
  totalEarned: string;
  listeningTime: number;
  level: number;
}

export function TokenRewards() {
  const { address, isConnected } = useAccount();
  const [rewards, setRewards] = useState<TokenRewardsData>({
    balance: '0',
    totalEarned: '0',
    listeningTime: 0,
    level: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      // Simulate fetching token data - replace with actual contract calls
      setTimeout(() => {
        setRewards({
          balance: '0',
          totalEarned: '0',
          listeningTime: 0,
          level: 1,
        });
        setLoading(false);
      }, 1000);
    } else {
      setRewards({
        balance: '0',
        totalEarned: '0',
        listeningTime: 0,
        level: 1,
      });
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="glass-dark rounded-2xl p-6 text-center text-gray-400">
        <Coins size={48} className="mx-auto mb-4 opacity-50" />
        <p>Connect your wallet to earn tokens</p>
        <p className="text-sm mt-2">Earn tokens by listening to music</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-dark rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="glass-dark rounded-2xl p-6">
      <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Coins size={20} />
        Token Rewards
      </h2>

      <div className="space-y-4">
        {/* Token Balance */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Current Balance</span>
            <TrendingUp size={16} className="text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{rewards.balance}</div>
          <div className="text-xs text-gray-500 mt-1">BASE Tokens</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total Earned</div>
            <div className="text-lg font-semibold text-white">{rewards.totalEarned}</div>
          </div>
          <div className="glass rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Listening Time</div>
            <div className="text-lg font-semibold text-white">{formatTime(rewards.listeningTime)}</div>
          </div>
        </div>

        {/* Level Badge */}
        <div className="glass rounded-lg p-4 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-600/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-full">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-xs">Your Level</div>
              <div className="text-xl font-bold text-white">Level {rewards.level}</div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-500 text-center pt-2">
          Earn tokens by listening to music and completing challenges
        </div>
      </div>
    </div>
  );
}

