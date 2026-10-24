import React from 'react';

interface ArchMindLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  theme?: 'light' | 'dark';
}

export const ArchMindLogo: React.FC<ArchMindLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  theme = 'light',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const isLight = theme === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Minimal Architectural Logo Symbol: Intersecting Cantilevered Spatial Planes */}
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Exterior architectural frame boundary */}
        <rect
          x="3"
          y="3"
          width="26"
          height="26"
          stroke={isLight ? '#FFFFFF' : '#20211F'}
          strokeWidth="1.5"
        />
        {/* Cantilevered interior structural diagonal */}
        <path
          d="M3 21L21 3"
          stroke={isLight ? '#FFFFFF' : '#20211F'}
          strokeWidth="1.5"
        />
        {/* Accent cyan architectural focal axis */}
        <line
          x1="12"
          y1="12"
          x2="29"
          y2="29"
          stroke="#55C7D9"
          strokeWidth="2"
        />
        {/* Floating spatial datum plane */}
        <rect
          x="10"
          y="10"
          width="6"
          height="6"
          fill={isLight ? '#FFFFFF' : '#20211F'}
        />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-semibold tracking-tight whitespace-nowrap ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-[#20211F]'
          }`}
          style={{ letterSpacing: '-0.02em' }}
        >
          ArchMind
        </span>
        {showTagline && (
          <span className={`text-[10px] tracking-widest uppercase mt-0.5 ${isLight ? 'text-zinc-400' : 'text-[#747670]'}`}>
            Architecture & Design
          </span>
        )}
      </div>
    </div>
  );
};
