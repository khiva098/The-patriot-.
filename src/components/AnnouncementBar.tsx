import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { breakingNews, navigateTo, announcement, role } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through breaking news every 7 seconds if not paused
  useEffect(() => {
    if (breakingNews.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % breakingNews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [breakingNews.length, isPaused]);

  if (isDismissed || (breakingNews.length === 0 && !announcement.isEnabled)) {
    return null;
  }

  const currentItem = breakingNews[currentIndex] || {
    id: 'ann-default',
    headline: announcement.message || 'Sovereign Publishing Platform Operational',
    category: 'SPECIAL DISPATCH',
    timestamp: 'Live',
    source: 'Central Bureau',
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + breakingNews.length) % breakingNews.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % breakingNews.length);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `Breaking News from ${currentItem.source}. Category: ${currentItem.category}. ${currentItem.headline}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <aside
      aria-label="CNN & BBC Standard Live Breaking News Bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-slate-950 text-stone-100 border-b border-amber-600/30 text-xs font-sans transition-colors relative z-50 select-none shadow-md"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        {/* Left: CNN / BBC Style Pulsing Live Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/90 text-white font-bold text-[10px] tracking-wider uppercase animate-pulse shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <Radio className="w-3 h-3" />
            <span>Live Wire</span>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-400 uppercase tracking-widest border-r border-stone-800 pr-3">
            {currentItem.category}
          </span>
        </div>

        {/* Center: Live Headline & Source */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
          <p className="truncate text-stone-200 text-xs sm:text-[13px] font-medium leading-tight">
            {currentItem.headline}
          </p>

          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-stone-400 shrink-0 bg-stone-900/80 px-1.5 py-0.5 rounded border border-stone-800">
            <span>{currentItem.source}</span>
            <span>·</span>
            <span>{currentItem.timestamp}</span>
          </span>
        </div>

        {/* Right Controls: Audio Listen, Nav Arrows, Counter, Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {/* TTS Listen Button */}
          <button
            onClick={handleSpeak}
            aria-label={isSpeaking ? 'Mute audio narration' : 'Listen to breaking dispatch'}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 font-medium ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
            title="Listen to live bulletin (Text-to-Speech)"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline text-[11px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>

          {/* Prev/Next arrows if multiple */}
          {breakingNews.length > 1 && (
            <div className="hidden sm:flex items-center gap-0.5 bg-stone-900 border border-stone-800 rounded px-1 py-0.5 text-[11px] font-mono text-stone-400">
              <button
                onClick={handlePrev}
                aria-label="Previous breaking bulletin"
                className="p-0.5 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="px-1 text-[10px]">
                {currentIndex + 1}/{breakingNews.length}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next breaking bulletin"
                className="p-0.5 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick link to Bureau or Articles */}
          <button
            onClick={() => {
              if (currentItem.linkView) {
                navigateTo(currentItem.linkView, currentItem.linkDetailId);
              } else {
                navigateTo('articles');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss breaking news bar"
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-stone-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
