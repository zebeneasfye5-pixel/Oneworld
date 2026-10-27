import React from 'react';

interface OneWorldLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const OneWorldLogo: React.FC<OneWorldLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Radiant Global Unity Emblem Vector */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-indigo-600 p-[2px] shadow-lg shadow-emerald-500/20 group cursor-pointer transition-transform hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <div className="w-full h-full bg-[#0a0d14] rounded-[14px] flex items-center justify-center overflow-hidden relative">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-emerald-500/25 to-indigo-500/20 animate-pulse"></div>

          {/* Detailed SVG Planetary & Human Unity Icon */}
          <svg
            viewBox="0 0 100 100"
            className="w-[85%] h-[85%] z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="ringGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Outer Orbital Ring of Unity */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#ringGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              className="opacity-70 animate-spin"
              style={{ animationDuration: '30s' }}
            />

            {/* Glowing World Sphere Base */}
            <circle cx="50" cy="50" r="36" fill="#0f172a" stroke="url(#globeGrad)" strokeWidth="3" />

            {/* Latitude & Longitude Interconnecting Grid */}
            <ellipse cx="50" cy="50" rx="36" ry="16" stroke="#10b981" strokeWidth="1.2" opacity="0.4" />
            <ellipse cx="50" cy="50" rx="16" ry="36" stroke="#fbbf24" strokeWidth="1.2" opacity="0.4" />
            <line x1="14" y1="50" x2="86" y2="50" stroke="#38bdf8" strokeWidth="1.2" opacity="0.5" />
            <line x1="50" y1="14" x2="50" y2="86" stroke="#6366f1" strokeWidth="1.2" opacity="0.5" />

            {/* Stylized Continents / United Hands of Humanity */}
            <path
              d="M38 32C42 26 58 26 62 32C66 38 64 48 58 54C54 58 46 58 42 54C36 48 34 38 38 32Z"
              fill="url(#globeGrad)"
              opacity="0.85"
            />
            {/* Horn of Africa & Continental Core Spark */}
            <circle cx="50" cy="46" r="5" fill="#fef08a" />
            <circle cx="50" cy="46" r="9" stroke="#f59e0b" strokeWidth="1.5" className="animate-ping" opacity="0.6" />

            {/* Radiating Star of Wisdom at the Apex */}
            <polygon
              points="50,18 53,26 61,29 55,34 57,42 50,37 43,42 45,34 39,29 47,26"
              fill="#fbbf24"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark & Slogan */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight bg-gradient-to-r from-amber-300 via-emerald-300 to-indigo-300 bg-clip-text text-transparent ${currentSize.text}`}>
              Oneworld
            </span>
          </div>
          <span className={`text-slate-400 font-medium tracking-wide mt-0.5 ${currentSize.sub}`}>
            15ቱ ዋና ዋና ቤቶች ማህበራዊ አጎራ
          </span>
        </div>
      )}
    </div>
  );
};
