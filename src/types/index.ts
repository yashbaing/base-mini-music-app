export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  albumArt?: string;
  nftTokenId?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
  onChainId?: string;
  coverImage?: string;
}

export interface NFTMetadata {
  tokenId: string;
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

