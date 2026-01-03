'use client';

import { useWallet } from '@/hooks/useWallet';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

export function WalletButton() {
  const { address, isConnected, connectWallet, disconnectWallet, isCorrectNetwork, switchToBase, isPending } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isPending}
        className="glass px-5 sm:px-6 py-2.5 rounded-full font-medium text-white hover:bg-white/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base touch-manipulation w-full sm:w-auto"
      >
        <Wallet size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      {!isCorrectNetwork && (
        <button
          onClick={switchToBase}
          className="glass px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white hover:bg-white/20 active:scale-95 transition-all duration-200 flex items-center gap-2 text-yellow-300 touch-manipulation"
        >
          <AlertCircle size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Switch to Base</span>
          <span className="sm:hidden">Switch</span>
        </button>
      )}
      <div className="glass px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white">
        {formatAddress(address || '')}
      </div>
      <button
        onClick={disconnectWallet}
        className="glass px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white hover:bg-white/20 active:scale-95 transition-all duration-200 flex items-center gap-2 touch-manipulation"
        aria-label="Disconnect wallet"
      >
        <LogOut size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}

