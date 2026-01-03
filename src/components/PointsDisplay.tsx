'use client';

import { Coins } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PointsDisplayProps {
  points: number;
  walletAddress?: string;
}

export function PointsDisplay({ points, walletAddress }: PointsDisplayProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevPoints, setPrevPoints] = useState(points);

  useEffect(() => {
    if (points > prevPoints) {
      setIsAnimating(true);
      setPrevPoints(points);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevPoints(points);
  }, [points, prevPoints]);

  if (!walletAddress) return null;

  return (
    <div className={`glass px-5 sm:px-6 py-2.5 rounded-full font-medium text-white flex items-center justify-center gap-2 w-full sm:w-auto transition-all duration-500 ${
      isAnimating ? 'scale-110 bg-gradient-to-r from-orange-600/40 via-amber-600/40 to-yellow-600/40 border-2 border-yellow-400/60' : ''
    }`} style={isAnimating ? { 
      animation: 'pulse-glow 0.5s ease-in-out',
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 200, 0, 0.4)'
    } : {}}>
      <Coins size={16} className={`sm:w-[18px] sm:h-[18px] transition-all duration-300 ${isAnimating ? 'text-yellow-300 scale-125 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]' : ''}`} />
      <span className={`text-sm sm:text-base transition-all duration-300 ${isAnimating ? 'font-bold text-yellow-200' : ''}`}>
        {points.toLocaleString()} Point{points !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

