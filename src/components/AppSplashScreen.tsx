import React, { useEffect, useState } from 'react';
import BrandLogo from './BrandLogo';

export const AppSplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if splash was already presented in this session
    const hasSeenSplash = sessionStorage.getItem('the_patriot_splash_shown');
    if (hasSeenSplash) {
      setVisible(false);
      return;
    }

    // Mark as shown and begin fade out after 1.2s
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('the_patriot_splash_shown', 'true');
      }, 400);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => {
        setFading(true);
        setTimeout(() => setVisible(false), 200);
      }}
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050E1B] text-white transition-opacity duration-300 cursor-pointer select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial gold sheen */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Centerpiece Emblem */}
      <div className="relative flex flex-col items-center text-center space-y-5 px-6 animate-in zoom-in-95 duration-500">
        {/* Royal Gold "P" Monogram */}
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <BrandLogo size="xl" withText={false} />
          {/* Subtle pulse ring */}
          <div className="absolute -inset-3 rounded-2xl border border-amber-400/20 animate-ping opacity-30 pointer-events-none" />
        </div>

        {/* Broadsheet Masthead */}
        <div className="space-y-1.5">
          <h1
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500"
          >
            THE PATRIOT
          </h1>
          <p className="text-[11px] font-mono tracking-widest uppercase text-amber-400/80">
            Ideas · Knowledge · Truth
          </p>
        </div>

        {/* Editorial Subtitle */}
        <p className="text-xs text-stone-400 max-w-xs font-serif italic">
          An Independent Digital Media, Research Repository & E-Book Library
        </p>

        {/* Minimal loading bar */}
        <div className="w-32 h-0.5 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full animate-pulse" />
        </div>

        <span className="text-[10px] text-stone-500 font-mono">
          Tap anywhere to enter
        </span>
      </div>
    </div>
  );
};

export default AppSplashScreen;
