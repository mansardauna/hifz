import React from 'react';

interface AnkabitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  spiderColor?: string;
}

export const AnkabitSpiderIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 28,
  color = 'currentColor',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sleek Minimalist Spider Monogram (Ankabit / عنكبوت) */}
      {/* Spider Head & Abdomen */}
      <circle cx="24" cy="18" r="4.5" fill={color} />
      <ellipse cx="24" cy="29" rx="6" ry="8" fill={color} />
      
      {/* Abdomen Tech/Geometric Accent Line */}
      <path
        d="M24 23V35M21 28H27M22 32H26"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* 8 Geometric Curved Spider Legs */}
      {/* Top Left Leg 1 */}
      <path
        d="M21 17C16 13 13 14 8 18"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top Right Leg 1 */}
      <path
        d="M27 17C32 13 35 14 40 18"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Middle Left Leg 2 */}
      <path
        d="M19 21C13 19 9 22 6 27"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle Right Leg 2 */}
      <path
        d="M29 21C35 19 39 22 42 27"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lower Left Leg 3 */}
      <path
        d="M19 28C13 30 10 36 8 42"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Right Leg 3 */}
      <path
        d="M29 28C35 30 38 36 40 42"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Left Leg 4 */}
      <path
        d="M20 34C16 38 14 43 14 46"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Right Leg 4 */}
      <path
        d="M28 34C32 38 34 43 34 46"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle Glowing Chelicerae / Fangs */}
      <path d="M22.5 13.5L21.5 11M25.5 13.5L26.5 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

export const AnkabitLogo: React.FC<AnkabitLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-slate-900',
  spiderColor,
}) => {
  const sizeMap = {
    sm: { icon: 22, text: 'text-sm', badge: 'text-[9px]' },
    md: { icon: 28, text: 'text-base sm:text-lg', badge: 'text-[10px]' },
    lg: { icon: 36, text: 'text-xl sm:text-2xl', badge: 'text-xs' },
    xl: { icon: 48, text: 'text-3xl', badge: 'text-xs' },
  };

  const config = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-sans select-none ${className}`}>
      {/* Spider Icon */}
      <div className="shrink-0 text-emerald-600 transition-transform hover:scale-105">
        <AnkabitSpiderIcon size={config.icon} color={spiderColor || 'currentColor'} />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${textColor} ${config.text}`}>
              Ankabit
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
              LMS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
