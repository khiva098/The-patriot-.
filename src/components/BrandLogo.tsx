import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withTagline?: boolean;
  className?: string;
  onlyP?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  withText = true,
  withTagline = false,
  className = '',
  onlyP = false,
}) => {
  // Scaling dimensions for the iconic "P" letter logo
  const sizeMap = {
    xs: {
      crest: 'w-7 h-7 text-xs',
      pText: 'text-sm font-serif font-black',
      text: 'text-base',
      star: 'w-1.5 h-1.5',
    },
    sm: {
      crest: 'w-9 h-9 text-sm',
      pText: 'text-base font-serif font-black',
      text: 'text-lg',
      star: 'w-2 h-2',
    },
    md: {
      crest: 'w-11 h-11 text-base',
      pText: 'text-xl font-serif font-black tracking-tight',
      text: 'text-2xl',
      star: 'w-2.5 h-2.5',
    },
    lg: {
      crest: 'w-14 h-14 text-xl',
      pText: 'text-2xl font-serif font-black tracking-tight',
      text: 'text-3xl',
      star: 'w-3 h-3',
    },
    xl: {
      crest: 'w-20 h-20 text-3xl',
      pText: 'text-4xl font-serif font-black tracking-tight',
      text: 'text-4xl',
      star: 'w-4 h-4',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 
        ========================================================================
        THE ICONIC "P" LETTER LOGO MEDALLION
        Designed with sovereign broadsheet heritage, gold filigree, and royal serif P
        ========================================================================
      */}
      <div
        className={`relative ${currentSize.crest} rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/80 border-2 border-amber-500/80 dark:border-amber-400 shadow-[0_4px_14px_rgba(245,158,11,0.25)] flex items-center justify-center shrink-0 group transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:shadow-[0_4px_20px_rgba(245,158,11,0.4)] ring-1 ring-amber-400/30 overflow-hidden`}
        title="THE PATRIOT — Sovereign 'P' Logo"
      >
        {/* Subtle radial sheen backdrop */}
        <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent pointer-events-none" />

        {/* Inner filigree hairline border */}
        <div className="absolute inset-1 rounded-lg border border-amber-400/40 pointer-events-none" />

        {/* Master Serif "P" Letterform in Radiant Metallic Gold */}
        <span
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className={`${currentSize.pText} text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] leading-none select-none font-black tracking-normal`}
        >
          P
        </span>

        {/* Sovereign Gold Star Dot Accent at Top Right */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-amber-300 to-amber-500 ring-1 ring-slate-950 shadow-xs"></span>
        </span>
      </div>

      {/* Brand Wordmark & Broadsheet Tagline (if not onlyP) */}
      {!onlyP && withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 ${currentSize.text} transition-colors`}
            >
              THE PATRIOT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 self-center"></span>
          </div>

          {withTagline && (
            <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500 dark:text-stone-400 mt-1">
              Ideas · Knowledge · Truth
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
