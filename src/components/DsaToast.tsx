import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Cpu, Zap } from 'lucide-react';

export const DsaToast: React.FC = () => {
  const { dsaToast } = useMusicPlayer();

  if (!dsaToast) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounce duration-500 max-w-md bg-neutral-900/95 border border-[#1DB954]/50 shadow-[0_0_20px_rgba(29,185,84,0.25)] rounded-xl p-3.5 backdrop-blur-md text-white pointer-events-none transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#1DB954]/20 border border-[#1DB954]/40 rounded-lg text-[#1DB954] mt-0.5">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-[#1DB954] tracking-wide">
              {dsaToast.title}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
              <Zap className="w-3 h-3 text-[#1DB954]" />
              {dsaToast.complexity}
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            {dsaToast.detail}
          </p>
        </div>
      </div>
    </div>
  );
};
