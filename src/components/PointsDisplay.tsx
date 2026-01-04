'use client';

import { Coins } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface PointsDisplayProps {
  points: number;
  walletAddress?: string;
}

export function PointsDisplay({ points, walletAddress }: PointsDisplayProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const prevPointsRef = useRef(points);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial mount/refresh
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPointsRef.current = points;
      return;
    }

    // Only blink when points increase (new point earned)
    if (points > prevPointsRef.current) {
      setIsBlinking(true);
      prevPointsRef.current = points;
      
      // Stop blinking after 3 seconds
      const timer = setTimeout(() => {
        setIsBlinking(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // Update ref even if points didn't increase
      prevPointsRef.current = points;
    }
  }, [points]);

  if (!walletAddress) return null;

  return (
    <div className={`glass px-5 sm:px-6 py-2.5 rounded-full font-medium text-white flex items-center justify-center gap-2 w-full sm:w-auto transition-all duration-300 relative ${
      isBlinking ? 'scale-105' : ''
    }`}>
      {/* Round light animation - only when blinking */}
      {isBlinking && (
        <>
          <div className="absolute inset-0 rounded-full animate-ping opacity-75">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400/60 via-yellow-400/60 to-orange-400/60"></div>
          </div>
          <div className="absolute inset-0 rounded-full">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-500/40 via-yellow-500/40 to-orange-500/40 animate-pulse"></div>
          </div>
        </>
      )}
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        <Coins size={16} className={`sm:w-[18px] sm:h-[18px] transition-all duration-300 ${isBlinking ? 'text-yellow-300 scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]' : ''}`} />
        <span className={`text-sm sm:text-base transition-all duration-300 ${isBlinking ? 'font-bold text-yellow-100' : ''}`}>
          {points.toLocaleString()} Point{points !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
