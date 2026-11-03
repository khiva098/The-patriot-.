import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DiscussionThread } from '../components/DiscussionThread';
import { VerificationBadge } from '../components/VerificationBadge';
import { calculateScrollProgress } from '../utils/pure_logic';
import {
  Bookmark,
  Share2,
  Clock,
  Calendar,
  Check,
  ChevronLeft,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Headphones,
  Sparkles,
  WifiOff,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { 
    activeDetailId, 
    articles, 
    navigateTo, 
    toggleBookmark, 
    isBookmarked, 
    recordReadingProgress,
    addNotification 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readLaterToast, setReadLaterToast] = useState<string | null>(null);

  // ----------------------------------------------------
  // Text-To-Speech (Web Speech API) Engine State
  // ----------------------------------------------------
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechProgress, setSpeechProgress] = useState<number>(0);
  const [isTtsSupported, setIsTtsSupported] = useState<boolean>(true);
  const [showAudioBar, setShowAudioBar] = useState<boolean>(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textChunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);

  // Find article by id or slug
  const article = articles.find(a => a.id === activeDetailId || a.slug === activeDetailId) || articles[0];

  // Document length context
  const wordCount = article?.content ? article.content.trim().split(/\s+/).length : 1200;
  const estimatedTotalMinutes = article?.readingTimeMinutes || Math.max(2, Math.ceil(wordCount / 200));
  const estimatedRemainingMinutes = Math.max(1, Math.round(estimatedTotalMinutes * (1 - scrollProgress / 100)));

  // Detect Web Speech API support
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsTtsSupported(false);
    }
  }, []);

  // Cleanup speech synthesis on unmount or article change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article?.id]);

  // Initial recording when article is viewed
  useEffect(() => {
    if (article) {
      recordReadingProgress({
        publicationId: article.id,
        publicationType: 'article',
        title: article.title,
        subtitle: article.subtitle,
        authorName: article.author.name,
        categoryOrDiscipline: article.category,
        coverImage: article.featuredImage,
        progress: 5, // minimum 5% on start
        totalTimeMinutes: estimatedTotalMinutes,
        slug: article.slug,
      });
    }
  }, [article?.id]);

  // Scroll Progress Tracking with Debounce
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;

      const progress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight);
      setScrollProgress(progress);

      if (article && progress > 5) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          recordReadingProgress({
            publicationId: article.id,
            publicationType: 'article',
            title: article.title,
            subtitle: article.subtitle,
            authorName: article.author.name,
            categoryOrDiscipline: article.category,
            coverImage: article.featuredImage,
            progress: progress,
            totalTimeMinutes: estimatedTotalMinutes,
            slug: article.slug,
          });
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeDetailId, article?.id, estimatedTotalMinutes]);

  // ----------------------------------------------------
  // TTS Narration Handlers
  // ----------------------------------------------------
  const prepareNarrationText = (): string => {
    if (!article) return '';
    // Strip markdown formatting characters for natural audio pronunciation
    const cleanContent = article.content
      .replace(/#{1,6}\s+/g, '')
      .replace(/>\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`{1,3}.*?`{1,3}/g, '');

    return `${article.title}. ${article.subtitle || ''}. Written by ${article.author.name}. ${cleanContent}`;
  };

  const handleStartSpeech = () => {
    if (!isTtsSupported || typeof window === 'undefined') return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    setShowAudioBar(true);

    const fullText = prepareNarrationText();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick English or natural sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        setSelectedVoiceName(preferredVoice.name);
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeechProgress(5);
    };

    utterance.onboundary = (e: SpeechSynthesisEvent) => {
      if (fullText.length > 0) {
        const pct = Math.min(99, Math.round((e.charIndex / fullText.length) * 100));
        setSpeechProgress(pct);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechProgress(100);
      setTimeout(() => setSpeechProgress(0), 1500);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseSpeech = () => {
    if (typeof window === 'undefined') return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechProgress(0);
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking) {
      // Re-trigger from current speech
      handleStartSpeech();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bookmarked = article ? isBookmarked(article.id) : false;

  const handleToggleReadLater = () => {
    if (!article) return;
    const nextState = !bookmarked;
    toggleBookmark(article.id);
    setReadLaterToast(
      nextState
        ? 'Saved to Read Later. Available in your profile archive for offline study.'
        : 'Removed from Read Later list.'
    );
    setTimeout(() => setReadLaterToast(null), 3000);

    if (nextState) {
      addNotification({
        title: 'Article Saved to Read Later',
        message: `"${article.title}" saved to your reading archive for offline study.`,
        category: 'new_publication',
        link: { view: 'profile', tab: 'bookmarks' },
      });
    }
  };

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-bold text-2xl text-slate-900 dark:text-stone-100">
          Publication in Bureau Clearance
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-serif max-w-md mx-auto leading-relaxed">
          The requested dispatch is not present in the catalog or is being cleared by the sovereign editorial directorate.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Return to Front Page
          </button>
          <button
            onClick={() => navigateTo('articles')}
            className="px-5 py-2.5 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-stone-100"
          >
            Browse All Dispatches
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-6 sm:py-8 space-y-8 sm:space-y-10 relative">
      {/* ============================================================= */}
      {/* 1. SCROLL-LINKED PROGRESS INDICATOR AT TOP OF VIEWPORT       */}
      {/* ============================================================= */}
      <div
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Article reading progress bar"
        className="fixed top-0 left-0 right-0 h-1.5 bg-stone-200/90 dark:bg-slate-800/90 z-50 pointer-events-none backdrop-blur-xs transition-opacity duration-300"
      >
        <div
          className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(245,158,11,0.8)] relative"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Luminous indicator head at the active progress point */}
          {scrollProgress > 0 && scrollProgress < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)] translate-x-1" />
          )}
        </div>
      </div>

      {/* Sticky Top Document Length & Navigation Ribbon (Shows on Scroll) */}
      <div 
        className={`fixed top-1.5 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800/80 shadow-xs transition-all duration-300 ${
          scrollProgress > 6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse shrink-0" />
            <h2 className="font-serif font-bold text-slate-900 dark:text-stone-100 truncate text-xs">
              {article.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-slate-500 dark:text-slate-400">
            {/* Context on Document Length */}
            <span className="hidden sm:inline text-[11px]">
              {wordCount.toLocaleString()} words · {estimatedTotalMinutes} min read
            </span>
            <span className="hidden sm:inline text-stone-300 dark:text-slate-700">·</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {scrollProgress}%
            </span>
            <span className="text-[11px] text-stone-400 hidden md:inline">
              (~{estimatedRemainingMinutes}m left)
            </span>

            {/* Quick Actions in Top Sticky HUD */}
            <button
              onClick={handleStartSpeech}
              title={isSpeaking ? 'Listening to article narration' : 'Listen to article audio narration'}
              className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-600 dark:text-stone-300 cursor-pointer"
            >
              <Headphones className={`w-3.5 h-3.5 ${isSpeaking ? 'text-amber-600 animate-bounce' : ''}`} />
            </button>

            <button
              onClick={handleToggleReadLater}
              title={bookmarked ? 'Saved in Read Later' : 'Save to Read Later'}
              className={`p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer ${
                bookmarked ? 'text-amber-600' : 'text-stone-500'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Reading Progress Pill (Bottom Right) */}
      {scrollProgress > 3 && (
        <aside
          aria-label="Live reading progress indicator"
          className="fixed bottom-6 right-6 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-stone-200 dark:border-slate-800 rounded-full pl-3.5 pr-2 py-1.5 shadow-xl flex items-center gap-2.5 text-xs font-mono text-stone-600 dark:text-stone-300 transition-all animate-in fade-in duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" aria-hidden="true" />
          <span className="font-semibold text-slate-900 dark:text-stone-100">{scrollProgress}%</span>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider">read</span>
          <span className="text-stone-300 dark:text-slate-700">·</span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">~{estimatedRemainingMinutes}m</span>
          {scrollProgress > 20 && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Return to top"
              aria-label="Scroll back to top of article"
              className="ml-1 p-1 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 rotate-90" aria-hidden="true" />
            </button>
          )}
        </aside>
      )}

      {/* Toast Feedback for Read Later / Bookmark */}
      {readLaterToast && (
        <div className="fixed bottom-6 left-6 z-50 p-3 bg-slate-950 text-white rounded-xl shadow-2xl border border-amber-500/40 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <Bookmark className="w-4 h-4 text-amber-400 fill-current shrink-0" />
          <span>{readLaterToast}</span>
        </div>
      )}

      {/* 2. Top Header Navigation & Document Length Summary */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <button
            onClick={() => navigateTo('articles')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-slate-900 dark:hover:text-stone-100 transition-colors cursor-pointer w-fit group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Articles & Dispatches</span>
          </button>

          {/* Document Length Context Strip */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 flex-wrap">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{wordCount.toLocaleString()} words</span>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
            <span>{estimatedTotalMinutes} min total read</span>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{scrollProgress}% scrolled</span>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
            <span className="text-stone-600 dark:text-stone-300">
              {scrollProgress >= 100 ? 'Completed' : `~${estimatedRemainingMinutes} min left`}
            </span>
          </div>
        </div>

        {/* Visual Progress Line */}
        <div
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Article completion progress"
          className="w-full h-1.5 bg-stone-200/70 dark:bg-slate-800/80 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Article Header & Masthead */}
      <header className="space-y-4 border-b border-stone-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <span>{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.type === 'opinion' ? 'Column & Perspective' : 'Analytical Dispatch'}</span>
          {article.isFrontPageFeatured && (
            <span className="ml-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-mono font-bold">
              ★ Front Page Feature
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 leading-tight">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl font-serif text-stone-600 dark:text-stone-300 leading-relaxed">
          {article.subtitle}
        </p>

        {/* Byline, TTS Listen CTA & Read Later Bookmark */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 dark:border-slate-800/80 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-stone-100 text-sm">
                  {article.author.name}
                </span>
                <VerificationBadge
                  tier={article.author.verificationTier || (article.author.verified ? 'verified_scholar' : 'none')}
                  details={article.author.verificationDetails}
                  authorName={article.author.name}
                  showLabel
                  size="md"
                />
              </div>
              <p className="text-[11px] text-stone-500">{article.author.title} · {article.author.affiliation}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
            <span aria-hidden="true">·</span>

            {/* ============================================================= */}
            {/* TEXT-TO-SPEECH (WEB SPEECH API) 'LISTEN' BUTTON                */}
            {/* ============================================================= */}
            <button
              onClick={() => {
                setShowAudioBar(true);
                handleStartSpeech();
              }}
              aria-label="Listen to audio narration"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isSpeaking
                  ? 'bg-amber-600 text-white font-bold ring-2 ring-amber-600/30'
                  : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}
            >
              <Headphones className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              <span>{isSpeaking ? (isPaused ? 'Resume Narration' : 'Listening...') : 'Listen'}</span>
            </button>

            {/* ============================================================= */}
            {/* 'READ LATER' BOOKMARK FEATURE                                */}
            {/* ============================================================= */}
            <button
              onClick={handleToggleReadLater}
              aria-label={bookmarked ? 'Remove from Read Later' : 'Save to Read Later for offline reading'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                bookmarked
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs'
                  : 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{bookmarked ? 'Saved to Read Later' : 'Read Later'}</span>
            </button>

            <button
              onClick={handleShare}
              aria-label="Copy share link"
              className="inline-flex items-center gap-1 p-1.5 text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 transition-colors cursor-pointer rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* INTERACTIVE AUDIO NARRATION BAR (Web Speech API)               */}
        {/* ============================================================= */}
        {showAudioBar && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-stone-900 via-slate-900 to-amber-950 text-white shadow-lg border border-amber-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                      Audio Narration
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
                      Web Speech API
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-stone-100 mt-0.5 line-clamp-1">
                    {article.title}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {selectedVoiceName ? `Voice: ${selectedVoiceName}` : 'Native Browser Speech Engine'} · {speechRate}x speed
                  </p>
                </div>
              </div>

              {/* Controls: Play/Pause, Stop, Speed */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                {/* Audio Wave Visualizer Animation */}
                {isSpeaking && !isPaused && (
                  <div className="flex items-end gap-0.5 h-5 px-2" aria-hidden="true">
                    <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
                    <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-5" />
                    <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2" />
                    <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
                  </div>
                )}

                {/* Play / Pause Toggle */}
                {isSpeaking && !isPaused ? (
                  <button
                    onClick={handlePauseSpeech}
                    className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer shadow-sm"
                    title="Pause Audio Narration"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartSpeech}
                    className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer shadow-sm"
                    title="Play / Resume Narration"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                )}

                {/* Stop Button */}
                <button
                  onClick={handleStopSpeech}
                  className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Stop Narration"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>

                {/* Speed Switchers */}
                <div className="flex items-center gap-1 bg-stone-800/80 p-1 rounded-lg border border-stone-700 text-[10px] font-mono">
                  {[0.8, 1.0, 1.25, 1.5].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        speechRate === rate
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Close Audio Bar */}
                <button
                  onClick={() => {
                    handleStopSpeech();
                    setShowAudioBar(false);
                  }}
                  className="text-stone-400 hover:text-white text-xs px-1"
                  title="Close audio player"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Audio Progress Bar */}
            {speechProgress > 0 && (
              <div className="mt-3 pt-2 border-t border-stone-800">
                <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${speechProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Featured Front-Page Image with Caption & Credit */}
      {article.featuredImage && (
        <figure className="space-y-2">
          <div className="aspect-16/9 overflow-hidden rounded-xl bg-stone-100 dark:bg-slate-800 border border-stone-200/60 dark:border-slate-800 shadow-sm relative group">
            <img
              src={article.frontPagePhotoUrl || article.featuredImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            {article.isFrontPageFeatured && (
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Front Page Editorial Photo</span>
              </div>
            )}
          </div>
          {(article.frontPagePhotoCaption || article.imageCaption) && (
            <figcaption className="text-xs text-stone-500 font-serif italic text-center flex items-center justify-center gap-2">
              <span>{article.frontPagePhotoCaption || article.imageCaption}</span>
              {article.frontPagePhotoCredit && (
                <span className="font-mono text-[10px] text-stone-400 not-italic">
                  (Credit: {article.frontPagePhotoCredit})
                </span>
              )}
            </figcaption>
          )}
        </figure>
      )}

      {/* Layout Split: Table of Contents & Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table of Contents Sticky Column (3 cols) */}
        {article.tableOfContents && article.tableOfContents.length > 0 && (
          <aside className="lg:col-span-4 space-y-4">
            <div className="sticky top-24 bg-stone-50/80 dark:bg-slate-900/80 p-5 rounded-xl border border-stone-200 dark:border-slate-800 text-xs">
              <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100 uppercase tracking-wider mb-3">
                Contents
              </h3>
              <nav className="space-y-2">
                {article.tableOfContents.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 py-1 transition-colors leading-snug"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              {/* Author short bio in sidebar */}
              <div className="pt-4 mt-4 border-t border-stone-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">Author</span>
                  <VerificationBadge
                    tier={article.author.verificationTier || (article.author.verified ? 'verified_scholar' : 'none')}
                    details={article.author.verificationDetails}
                    authorName={article.author.name}
                    size="sm"
                  />
                </div>
                <p className="text-slate-800 dark:text-stone-200 font-bold">{article.author.name}</p>
                <p className="text-stone-500 text-[11px] leading-relaxed">{article.author.bio}</p>
              </div>

              {/* Read Later Offline Readiness Badge */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-stone-500">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Available for Offline Study</span>
              </div>
            </div>
          </aside>
        )}

        {/* Main Article Body (9 or 12 cols) */}
        <div className={article.tableOfContents && article.tableOfContents.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {/* Executive Summary / Lead Paragraph */}
          {article.excerpt && (
            <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-600 text-slate-800 dark:text-stone-200 font-serif text-base sm:text-lg leading-relaxed mb-8">
              <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                Executive Synopsis
              </span>
              {article.excerpt}
            </div>
          )}

          {/* Proportional Serif Body Content (Zero-Pill Typography) */}
          <div className="prose dark:prose-invert max-w-none font-serif text-base sm:text-lg leading-relaxed text-slate-800 dark:text-stone-200 space-y-6">
            {article.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-stone-100 pt-6 pb-2 border-b border-stone-200 dark:border-slate-800"
                  >
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-stone-100 pt-4"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-amber-600 pl-4 py-1 italic font-serif text-xl sm:text-2xl text-stone-800 dark:text-stone-200 my-6 bg-stone-50 dark:bg-slate-900/60 p-4 rounded-r-xl"
                  >
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags Footer */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 mt-8 border-t border-stone-200 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono text-stone-400 text-[11px] uppercase tracking-wider">Filed Under:</span>
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 font-mono text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Completion Action Card */}
          <div className="mt-8 p-6 rounded-2xl bg-stone-100 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                  Reading Session Recorded
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Document progress preserved in your personal Reading History and Read Later archive.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReadLater}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  bookmarked
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-stone-300 dark:border-slate-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                <span>{bookmarked ? 'Saved to Read Later' : 'Save for Read Later'}</span>
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 font-bold transition-all cursor-pointer"
              >
                View Profile Archive →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion & Scholarly Inquiries Section */}
      <section className="pt-8 border-t border-stone-200 dark:border-slate-800">
        <DiscussionThread
          publicationId={article.id}
          publicationType="article"
          publicationTitle={article.title}
        />
      </section>
    </article>
  );
};

export default ArticleDetailView;
