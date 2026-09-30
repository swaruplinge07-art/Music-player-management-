import React from 'react';

interface RhythmBoxLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const RhythmBoxLogo: React.FC<RhythmBoxLogoProps> = ({
  className = '',
  size = 36,
  animated = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none flex-shrink-0 ${className}`}
    >
      <defs>
        {/* Neon Gradient for Box Edges */}
        <linearGradient id="rbGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F59B" />
          <stop offset="50%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Top Face Gradient */}
        <linearGradient id="rbTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
        </linearGradient>

        {/* Left Face Gradient */}
        <linearGradient id="rbLeftFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Right Face Gradient */}
        <linearGradient id="rbRightFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Ambient Neon Glow Filter */}
        <filter id="rbGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 3D Isometric "Box" Container */}
      <g filter="url(#rbGlow)">
        {/* Top Face of the Box */}
        <path
          d="M24 5L41.3 15L24 25L6.7 15L24 5Z"
          fill="url(#rbTopFace)"
          stroke="url(#rbGrad1)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Left Face */}
        <path
          d="M6.7 15V33L24 43V25L6.7 15Z"
          fill="url(#rbLeftFace)"
          stroke="url(#rbGrad1)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Right Face */}
        <path
          d="M41.3 15V33L24 43V25L41.3 15Z"
          fill="url(#rbRightFace)"
          stroke="url(#rbGrad1)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Inner Isometric Grid Accent Lines */}
        <path
          d="M24 25V43M6.7 15L24 25L41.3 15"
          stroke="url(#rbGrad1)"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
      </g>

      {/* Rhythmic Soundwave Equalizer Bars rising from the center of the Box */}
      <g transform="translate(24, 23)">
        {/* Bar 1 (Left-most) */}
        <rect
          x="-11"
          y="-9"
          width="3.2"
          height="18"
          rx="1.6"
          fill="#00F59B"
          className={animated ? 'animate-pulse' : ''}
          style={{ animationDuration: '1.2s' }}
        />
        {/* Bar 2 (Mid-left) */}
        <rect
          x="-5.2"
          y="-14"
          width="3.2"
          height="28"
          rx="1.6"
          fill="#00F59B"
          className={animated ? 'animate-pulse' : ''}
          style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}
        />
        {/* Bar 3 (Center Peak) */}
        <rect
          x="0.6"
          y="-19"
          width="3.6"
          height="38"
          rx="1.8"
          fill="#00E5FF"
          className={animated ? 'animate-pulse' : ''}
          style={{ animationDuration: '1.0s', animationDelay: '0.4s' }}
        />
        {/* Bar 4 (Mid-right) */}
        <rect
          x="6.8"
          y="-13"
          width="3.2"
          height="26"
          rx="1.6"
          fill="#38BDF8"
          className={animated ? 'animate-pulse' : ''}
          style={{ animationDuration: '0.9s', animationDelay: '0.1s' }}
        />
      </g>

      {/* Modern Center Play / Node Accent */}
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
    </svg>
  );
};
