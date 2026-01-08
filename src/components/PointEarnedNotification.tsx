'use client';

import { Coins } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PointEarnedNotificationProps {
  show: boolean;
  onClose: () => void;
  points: number;
}

export function PointEarnedNotification({ show, onClose, points }: PointEarnedNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <button
        className="relative glass px-6 py-3 rounded-full font-semibold text-white flex items-center justify-center gap-3 shadow-2xl min-w-[200px]"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.25) 0%, rgba(255, 215, 0, 0.2) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
        }}
      >
        {/* Round light animation */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-75">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400/50 via-yellow-400/50 to-orange-400/50"></div>
        </div>
        <div className="absolute inset-0 rounded-full">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-500/30 via-yellow-500/30 to-orange-500/30 animate-pulse"></div>
        </div>
        
        {/* Content */}
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Coins size={24} className="text-yellow-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-yellow-400/40 animate-ping"></div>
            </div>
          </div>
          <span className="text-lg font-bold text-yellow-100">
            +1 Point Earned!
          </span>
        </div>
      </button>
    </div>
  );
}





