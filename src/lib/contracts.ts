// Contract addresses and ABIs for Base blockchain
// These are placeholder interfaces - replace with actual contract addresses when deploying

export const CONTRACT_ADDRESSES = {
  PLAYLIST: process.env.NEXT_PUBLIC_PLAYLIST_CONTRACT || '0x0000000000000000000000000000000000000000',
  NFT: process.env.NEXT_PUBLIC_NFT_CONTRACT || '0x0000000000000000000000000000000000000000',
  TOKEN: process.env.NEXT_PUBLIC_TOKEN_CONTRACT || '0x0000000000000000000000000000000000000000',
};

// Placeholder ABI - replace with actual contract ABIs
export const PLAYLIST_ABI = [
  {
    inputs: [{ name: 'name', type: 'string' }],
    name: 'createPlaylist',
    outputs: [{ name: 'playlistId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUserPlaylists',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'trackCount', type: 'uint256' },
        ],
        name: 'playlists',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const NFT_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;


