# Base Mini Audio App

A decentralized music streaming platform built on Base blockchain, integrating Web3 wallet connectivity for seamless user authentication and transaction capabilities. The platform implements a gamified rewards system, distributing points based on listening duration (1 point per 5 minutes) with real-time tracking and visual feedback mechanisms. Built with Next.js and responsive architecture, featuring an intuitive music player interface, comprehensive playback controls, advanced search functionality, and a modern glass-morphism design system optimized for both mobile and desktop environments.

## Features

- 🎵 **Music Player**: Beautiful square-shaped music player with full controls
- 🔐 **Web3 Wallet Integration**: Connect your wallet using Wagmi/Viem on Base network
- 🎯 **Points System**: Earn points by listening to music (1 point per 5 minutes)
- 📱 **Responsive Design**: Optimized for both mobile and desktop
- 🔍 **Search**: Search through all tracks
- 🎨 **Modern UI**: Glass-morphism design with smooth animations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Blockchain**: Base (Ethereum L2)
- **Audio**: HTML5 Audio API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd base-mini-audio-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**Live Demo**: [https://base-mini-music-app.vercel.app/](https://base-mini-music-app.vercel.app/)

## Features in Detail

### Points System
- Connect your wallet to start earning points
- Earn 1 point for every 5 minutes of music listening
- Points are stored locally and associated with your wallet address
- Beautiful lighting animation when points are earned

### Music Player
- Square-shaped player design
- Volume controls (mobile popup, desktop hover)
- Progress tracking
- Play/pause, next, previous controls

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── public/
│   ├── audio/            # Audio files
│   └── images/           # Image assets
└── package.json
```

## License

MIT

