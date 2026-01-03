'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const connectWallet = () => {
    if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const switchToBase = () => {
    if (chainId !== base.id) {
      switchChain({ chainId: base.id });
    }
  };

  return {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchToBase,
    isPending,
    isCorrectNetwork: chainId === base.id,
  };
}


