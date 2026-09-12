import React from 'react';

interface LogoEmblemProps {
  customLogoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorders?: boolean;
  className?: string;
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({
  customLogoUrl,
  size = 'md',
  showBorders = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48'
  };

  const [imgError, setImgError] = React.useState(false);

  if (customLogoUrl) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl ${sizeClasses[size]} ${
          showBorders ? 'border-2 border-[#c59b27] shadow-[0_0_15px_rgba(197,155,39,0.4)]' : ''
        } bg-[#18100a] ${className}`}
      >
        <img
          src={customLogoUrl}
          alt="Custom Mafia Logo"
          className="w-full h-full object-contain p-1"
        />
      </div>
    );
  }

  // Default Mafia Medallion Logo
  if (!imgError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${sizeClasses[size]} ${
          showBorders ? 'border-2 border-[#c59b27] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(197,155,39,0.35)]' : ''
        } bg-[#120a06] ${className}`}
      >
        <img
          src="/mafia_logo.jpg"
          alt="Mafia Emblem"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    );
  }

  // Egyptian Mafia Emblem Fallback with Eye of Horus & Double Gold Card Motif
  return (
    <div
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Vintage Octagon/Shield Frame */}
        <polygon
          points="60,6 140,6 194,60 194,140 140,194 60,194 6,140 6,60"
          fill="#1c110b"
          stroke="#c59b27"
          strokeWidth="3"
        />
        <polygon
          points="62,12 138,12 188,62 188,138 138,188 62,188 12,138 12,62"
          fill="#2a180f"
          stroke="#dfba45"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Deep Burgundy Shield Core */}
        <path
          d="M100 24 C140 24 170 45 170 85 C170 135 100 178 100 178 C100 178 30 135 30 85 C30 45 60 24 100 24 Z"
          fill="#4a0f19"
          stroke="#c59b27"
          strokeWidth="2"
        />

        {/* Crossed Daggers / Royal Scepters */}
        <path
          d="M48 48 L152 152 M152 48 L48 152"
          stroke="#947320"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Dagger Pommels */}
        <circle cx="48" cy="48" r="4" fill="#c59b27" />
        <circle cx="152" cy="48" r="4" fill="#c59b27" />
        <circle cx="48" cy="152" r="4" fill="#c59b27" />
        <circle cx="152" cy="152" r="4" fill="#c59b27" />

        {/* Eye of Horus (Wedjat) Central Sacred Glyph */}
        <g transform="translate(48, 55) scale(0.52)">
          {/* Eyebrow Arch */}
          <path
            d="M20 50 C50 15 150 15 180 50 C150 35 50 35 20 50 Z"
            fill="#f7d377"
          />
          {/* Eye Upper Outline */}
          <path
            d="M15 75 C55 35 145 35 185 75"
            stroke="#f7d377"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Eye Lower Outline */}
          <path
            d="M15 75 C60 115 140 115 185 75"
            stroke="#f7d377"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Iris & Pupil */}
          <circle cx="100" cy="75" r="22" fill="#c59b27" />
          <circle cx="100" cy="75" r="14" fill="#140a06" />
          <circle cx="106" cy="70" r="4" fill="#fdfaf2" />

          {/* Falcon Cheek Marking (Tear & Spiral) */}
          <path
            d="M60 100 L60 145 C60 160 75 160 85 145 C95 130 90 120 75 120"
            stroke="#f7d377"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M140 98 C145 130 160 150 180 160"
            stroke="#f7d377"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Card Suits Around Shield */}
        {/* Spade Top */}
        <text x="100" y="44" textAnchor="middle" fill="#c59b27" fontSize="14" fontWeight="bold">♠</text>
        {/* Diamond Left */}
        <text x="44" y="105" textAnchor="middle" fill="#dfba45" fontSize="14" fontWeight="bold">♦</text>
        {/* Club Right */}
        <text x="156" y="105" textAnchor="middle" fill="#dfba45" fontSize="14" fontWeight="bold">♣</text>
        {/* Heart Bottom */}
        <text x="100" y="166" textAnchor="middle" fill="#c59b27" fontSize="14" fontWeight="bold">♥</text>

        {/* Egyptian Solar Rays at Top */}
        <line x1="85" y1="18" x2="85" y2="10" stroke="#c59b27" strokeWidth="2" />
        <line x1="100" y1="16" x2="100" y2="8" stroke="#f7d377" strokeWidth="2.5" />
        <line x1="115" y1="18" x2="115" y2="10" stroke="#c59b27" strokeWidth="2" />
      </svg>
    </div>
  );
};
