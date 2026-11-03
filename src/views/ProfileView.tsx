import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';
import { formatRelativeTime, filterReadingHistory, calculateReadingMetrics } from '../utils/pure_logic';
import { ReadingHistoryItem } from '../types';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  History,
  Layers,
  MessageSquare,
  Play,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BookMarked,
  Library,
  KeyRound,
  Lock,
  AlertCircle,
  X,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    role,
    setRole,
    bookmarks,
    toggleBookmark,
    readingHistory,
    removeReadingHistoryItem,
    clearReadingHistory,
    resumeReading,
    navigateTo,
    setIsVerificationModalOpen,
    articles,
    researchPapers,
    ebooks,
    comments,
    verificationApplications,
    resetPassword,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'bookmarks' | 'verification' | 'discussions'>('history');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<boolean>(false);
  const [renewPassModalOpen, setRenewPassModalOpen] = useState<boolean>(false);
  const [profileNewPass, setProfileNewPass] = useState<string>('');
  const [profileConfirmPass, setProfileConfirmPass] = useState<string>('');
  const [profilePassFeedback, setProfilePassFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Compute metrics
  const metrics = calculateReadingMetrics(readingHistory);
  const filteredHistory = filterReadingHistory(readingHistory, historyTypeFilter, searchQuery);

  // Resolve bookmarked items
  const bookmarkedArticles = articles.filter(a => bookmarks.includes(a.id));
  const bookmarkedPapers = researchPapers.filter(p => bookmarks.includes(p.id));
  const bookmarkedBooks = ebooks.filter(b => bookmarks.includes(b.id));
  const totalBookmarks = bookmarks.length;

  // Resolve user comments
  const userComments = comments.filter(c => c.author.id === currentUser?.id || c.author.name === currentUser?.name);

  // Export reading record
  const handleExportHistory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(
        {
          platform: 'THE PATRIOT',
          reader: currentUser ? currentUser.name : 'Independent Reader',
          exportedAt: new Date().toISOString(),
          totalItems: readingHistory.length,
          readingHistory,
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the-patriot-reading-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      {/* Editorial Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs font-mono text-stone-500">
        <button
          onClick={() => navigateTo('home')}
          className="hover:text-slate-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-amber-700 dark:text-amber-400 font-semibold">User Profile & Reading History</span>
      </nav>

      {/* User Identity Masthead Card */}
      <section className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Reader Avatar'}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-stone-200 dark:border-slate-700 shadow-md"
              />
              <span className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-xs border border-stone-200 dark:border-slate-700">
                <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100">
                  {currentUser?.name || 'Guest Reader'}
                </h1>

                {currentUser?.verificationTier && currentUser.verificationTier !== 'none' && (
                  <VerificationBadge
                    tier={currentUser.verificationTier}
                    details={currentUser.verificationDetails}
                    size="md"
                  />
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-mono flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{currentUser?.email || 'guest@thepatriot.org'}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-800/40">
                  {role} Role
                </span>
                {currentUser?.affiliation && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="italic">{currentUser.affiliation}</span>
                  </>
                )}
              </p>

              {currentUser?.bio && (
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl pt-1">
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>

          {/* Verification CTA & Quick Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Scholar Credentials</span>
            </button>

            {(role === 'administrator' || role === 'editor') && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-4 py-2 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Publishing & Admin Bureau</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  setProfilePassFeedback(null);
                  setProfileNewPass('');
                  setProfileConfirmPass('');
                  setRenewPassModalOpen(true);
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-200 dark:border-slate-700"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Renew Password</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Interactive Reading Activity Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-stone-100 dark:border-slate-800/80">
          <div className="bg-stone-50 dark:bg-slate-800/50 p-4 rounded-lg border border-stone-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-mono mb-1">
              <span>Total Read</span>
              <History className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900 dark:text-stone-100">
              {metrics.totalRead}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Publications logged
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-slate-800/50 p-4 rounded-lg border border-stone-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-mono mb-1">
              <span>In Progress</span>
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <div className="text-2xl font-bold font-serif text-amber-700 dark:text-amber-400">
              {metrics.inProgress}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Ready to pick up
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-slate-800/50 p-4 rounded-lg border border-stone-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-mono mb-1">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400">
              {metrics.completed}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              ≥90% read through
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-slate-800/50 p-4 rounded-lg border border-stone-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs font-mono mb-1">
              <span>Read Later & Saved</span>
              <Bookmark className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900 dark:text-stone-100">
              {totalBookmarks}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Available offline
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Navigation Tabs */}
      <div className="border-b border-stone-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-amber-600 text-slate-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-slate-800 dark:hover:text-stone-300'
            }`}
          >
            <History className="w-4 h-4 text-amber-600" />
            <span>Reading History</span>
            <span className="text-xs font-mono bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full">
              {readingHistory.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'border-amber-600 text-slate-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-slate-800 dark:hover:text-stone-300'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>Read Later & Bookmarks</span>
            <span className="text-xs font-mono bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full">
              {totalBookmarks}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'verification'
                ? 'border-amber-600 text-slate-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-slate-800 dark:hover:text-stone-300'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>Credentials & Trust</span>
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`pb-3 px-3 sm:px-4 text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'discussions'
                ? 'border-amber-600 text-slate-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-slate-800 dark:hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>My Inquiries</span>
            <span className="text-xs font-mono bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full">
              {userComments.length}
            </span>
          </button>
        </div>

        {/* Export Record Status */}
        {exportNotice && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>History exported</span>
          </span>
        )}
      </div>

      {/* TAB 1: READING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Section Header with Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
                <span>Reading History & In-Progress Reads</span>
                <span className="text-xs font-sans font-normal text-stone-500">
                  (Pick up exactly where you left off)
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Your reading progress across editorial essays, scholarly monographs, and peer-reviewed research papers is automatically saved locally.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {readingHistory.length > 0 && (
                <>
                  <button
                    onClick={handleExportHistory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-md hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Export your reading record as JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export History</span>
                  </button>

                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                    title="Clear reading history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Clear Confirmation Prompt */}
          {showClearConfirm && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center justify-between gap-4 text-xs">
              <span className="text-rose-800 dark:text-rose-200">
                Are you sure you want to clear your entire reading history? Saved bookmarks will not be affected.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded text-stone-700 dark:text-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearReadingHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium cursor-pointer"
                >
                  Yes, Clear History
                </button>
              </div>
            </div>
          )}

          {/* Filters & Search Toolbar */}
          <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Reads', count: readingHistory.length },
                { id: 'in_progress', label: 'In Progress', count: metrics.inProgress },
                { id: 'article', label: 'Articles', count: metrics.articleCount },
                { id: 'research', label: 'Research', count: metrics.researchCount },
                { id: 'ebook', label: 'E-Books', count: metrics.ebookCount },
                { id: 'completed', label: 'Completed', count: metrics.completed },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setHistoryTypeFilter(f.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    historyTypeFilter === f.id
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700 border border-stone-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    historyTypeFilter === f.id ? 'bg-amber-700 text-amber-100' : 'bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-stone-400'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search history by title or author..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Reading History Items List */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((item: ReadingHistoryItem) => {
                const isFinished = item.completed || item.progress >= 90;
                const isArticle = item.publicationType === 'article';
                const isResearch = item.publicationType === 'research';
                const isEBook = item.publicationType === 'ebook';

                // Badge styling by type
                const badgeColor = isArticle
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
                  : isResearch
                  ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/50'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';

                const typeLabel = isArticle ? 'Editorial Article' : isResearch ? 'Research Paper' : 'E-Book Monograph';

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center group"
                  >
                    {/* Thumbnail / Cover */}
                    <div className="w-full sm:w-28 sm:h-28 aspect-16/9 sm:aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-slate-800 shrink-0 border border-stone-200 dark:border-slate-700 relative">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          {isArticle ? <FileText className="w-8 h-8" /> : isResearch ? <Layers className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                        </div>
                      )}

                      {/* Small progress overlay circle */}
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-stone-100 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                        {item.progress}%
                      </div>
                    </div>

                    {/* Metadata & Progress Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className={`px-2 py-0.5 rounded font-semibold border ${badgeColor}`}>
                          {typeLabel}
                        </span>

                        {item.categoryOrDiscipline && (
                          <>
                            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">•</span>
                            <span className="text-stone-500 dark:text-stone-400 font-medium">
                              {item.categoryOrDiscipline}
                            </span>
                          </>
                        )}

                        <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">•</span>
                        <span className="text-stone-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Last read {formatRelativeTime(item.lastReadAt)}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => resumeReading(item)}
                        className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {item.title}
                      </h3>

                      {item.subtitle && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1">
                          {item.subtitle}
                        </p>
                      )}

                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        <span>By </span>
                        <strong className="text-slate-800 dark:text-stone-200 font-medium">
                          {item.authorName}
                        </strong>
                      </div>

                      {/* Visual Reading Progress Bar */}
                      <div className="pt-1 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5">
                            {isFinished ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Finished</span>
                              </span>
                            ) : (
                              <span className="text-amber-700 dark:text-amber-400 font-medium">
                                {item.progress}% Completed
                              </span>
                            )}
                          </div>

                          <span className="text-stone-400">
                            {isFinished
                              ? 'Read complete'
                              : item.estimatedTimeLeftMinutes
                              ? `~${item.estimatedTimeLeftMinutes} min left`
                              : `${item.progress}% scrolled`}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isFinished
                                ? 'bg-emerald-500 dark:bg-emerald-400'
                                : 'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions: "Pick Up Where You Left Off" CTA + Remove */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                      <button
                        onClick={() => resumeReading(item)}
                        className={`w-full sm:w-44 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isFinished
                            ? 'bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200'
                            : 'bg-amber-600 hover:bg-amber-500 text-white hover:shadow-md'
                        }`}
                      >
                        {isFinished ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Read Again</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Pick Up Where You Left Off</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => removeReadingHistoryItem(item.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Remove from reading history"
                        aria-label={`Remove ${item.title} from reading history`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                  {searchQuery ? 'No matching history found' : 'Your reading history is clean'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {searchQuery
                    ? `No publications match "${searchQuery}". Try a different keyword or reset filters.`
                    : 'Whenever you read an editorial essay, inspect a peer-reviewed research paper, or open an e-book volume, your progress will be preserved here so you can easily pick up where you left off.'}
                </p>
              </div>

              {/* Quick Jump Recommendations */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
                <button
                  onClick={() => navigateTo('articles')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Explore Articles</span>
                </button>
                <button
                  onClick={() => navigateTo('research')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Research Repository</span>
                </button>
                <button
                  onClick={() => navigateTo('books')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-800 dark:text-stone-200 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Library className="w-3.5 h-3.5" />
                  <span>E-Book Library</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: READ LATER & SAVED BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                  Personal Reader Storage
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono text-[10px] font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Offline Cached
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-stone-100">
                Read Later & Saved Offline Stash
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Investigative essays, academic preprints, and monograph volumes preserved for offline reading or future study.
              </p>
            </div>

            {totalBookmarks > 0 && (
              <button
                onClick={handleExportHistory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-stone-200 transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Saved List</span>
              </button>
            )}
          </div>

          {totalBookmarks > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4 relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                          {art.category} · Article
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-slate-800 text-stone-500 font-mono text-[10px]">
                          Offline Ready
                        </span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(art.id)}
                        className="text-amber-600 hover:text-stone-400 transition-colors cursor-pointer p-1"
                        title="Remove from Read Later"
                        aria-label={`Remove ${art.title} from Read Later`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h3
                      onClick={() => navigateTo('article-detail', art.id)}
                      className="font-serif font-bold text-base text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer line-clamp-2"
                    >
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800 text-xs">
                    <span className="text-stone-500 text-[11px]">
                      By {art.author.name} · {art.readingTimeMinutes} min read
                    </span>
                    <button
                      onClick={() => navigateTo('article-detail', art.id)}
                      className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Read Offline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {bookmarkedPapers.map(paper => (
                <div
                  key={paper.id}
                  className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider text-[11px]">
                        {paper.discipline} · Research
                      </span>
                      <button
                        onClick={() => toggleBookmark(paper.id)}
                        className="text-amber-600 hover:text-stone-400 transition-colors cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h3
                      onClick={() => navigateTo('research-detail', paper.id)}
                      className="font-serif font-bold text-base text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer line-clamp-2"
                    >
                      {paper.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                      {paper.abstract}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800 text-xs">
                    <span className="text-stone-500">DOI: {paper.doi}</span>
                    <button
                      onClick={() => navigateTo('research-detail', paper.id)}
                      className="text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>View Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {bookmarkedBooks.map(book => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                        {book.genre} · E-Book
                      </span>
                      <button
                        onClick={() => toggleBookmark(book.id)}
                        className="text-amber-600 hover:text-stone-400 transition-colors cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h3
                      onClick={() => navigateTo('book-detail', book.id)}
                      className="font-serif font-bold text-base text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer line-clamp-2"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                      {book.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-slate-800 text-xs">
                    <span className="text-stone-500">By {book.author.name}</span>
                    <button
                      onClick={() => navigateTo('book-detail', book.id)}
                      className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Book Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                No Bookmarks Saved Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Click the bookmark icon on any article, research paper, or monograph to curate your personal library.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CREDENTIALS & TRUST */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-slate-800">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
                  Institutional Verification & Trust Record
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  THE PATRIOT operates a verifiable trust architecture for independent researchers, authors, and fellows.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <VerificationBadge
                  tier={currentUser?.verificationTier || 'none'}
                  details={currentUser?.verificationDetails}
                  size="md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 bg-stone-50 dark:bg-slate-800/40 p-4 rounded-lg border border-stone-200/80 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Active Trust Status
                </div>
                <div className="space-y-1.5 text-stone-700 dark:text-stone-300 font-sans">
                  <p><strong>Tier:</strong> <span className="capitalize">{currentUser?.verificationTier?.replace('_', ' ') || 'Unverified'}</span></p>
                  <p><strong>Affiliation:</strong> {currentUser?.affiliation || 'Independent Scholar'}</p>
                  {currentUser?.verificationDetails?.credentialTitle && (
                    <p><strong>Credentials:</strong> {currentUser.verificationDetails.credentialTitle}</p>
                  )}
                  {currentUser?.verificationDetails?.orcid && (
                    <p className="font-mono"><strong>ORCID:</strong> {currentUser.verificationDetails.orcid}</p>
                  )}
                  {currentUser?.verificationDetails?.verifiedAt && (
                    <p><strong>Verified On:</strong> {new Date(currentUser.verificationDetails.verifiedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 bg-stone-50 dark:bg-slate-800/40 p-4 rounded-lg border border-stone-200/80 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Scholarly Privileges
                </div>
                <ul className="space-y-1.5 text-stone-600 dark:text-stone-400 list-disc pl-4">
                  <li>Author badge beside peer inquiries and comments</li>
                  <li>Direct submission privileges to peer-reviewed repositories</li>
                  <li>Immutable digital signature attached to publications</li>
                  <li>Fast-track editorial review for monographs and essays</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Need to update your institutional affiliation or submit new credentials?
              </span>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Submit Credentials Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DISCUSSIONS & INQUIRIES */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100">
              My Inquiries & Peer Discussions
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Scholarly questions and responses submitted across the platform.
            </p>
          </div>

          {userComments.length > 0 ? (
            <div className="space-y-4">
              {userComments.map(c => (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                    <span className="capitalize">{c.publicationType} Discussion</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-stone-200 leading-relaxed font-sans">
                    {c.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-slate-800">
                    <span>{c.helpfulVotes} helpful votes</span>
                    {c.isQuestion && (
                      <span className={c.isResolved ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                        {c.isResolved ? 'Resolved by Author' : 'Open Question'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                No Discussions Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Engage with fellow scholars and authors by asking questions in the discussion thread at the bottom of any article or study.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Renew Profile Account Password */}
      {renewPassModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  <KeyRound className="w-3 h-3" />
                  <span>Account Security</span>
                </div>
                <h3 className="font-serif font-black text-2xl text-slate-900 dark:text-stone-100">
                  Renew Account Password
                </h3>
                <p className="text-xs text-stone-500">
                  Update security password for <strong>{currentUser.name}</strong> ({currentUser.email}).
                </p>
              </div>
              <button
                onClick={() => setRenewPassModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profilePassFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  profilePassFeedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                }`}
              >
                {profilePassFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span>{profilePassFeedback.text}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setProfilePassFeedback(null);
                if (profileNewPass.length < 6) {
                  setProfilePassFeedback({ text: 'New password must be at least 6 characters.', type: 'error' });
                  return;
                }
                if (profileNewPass !== profileConfirmPass) {
                  setProfilePassFeedback({ text: 'Passwords do not match. Please re-enter.', type: 'error' });
                  return;
                }
                const res = resetPassword(currentUser.email, profileNewPass);
                if (res.success) {
                  setProfilePassFeedback({
                    text: 'Password renewed successfully! Your new password is now active.',
                    type: 'success',
                  });
                  setTimeout(() => {
                    setRenewPassModalOpen(false);
                    setProfileNewPass('');
                    setProfileConfirmPass('');
                  }, 1200);
                } else {
                  setProfilePassFeedback({ text: res.error || 'Failed to update credentials.', type: 'error' });
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Account Identifier
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.name} (${currentUser.email})`}
                  className="w-full p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-stone-600 dark:text-stone-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  New Password (minimum 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={profileNewPass}
                  onChange={(e) => setProfileNewPass(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={profileConfirmPass}
                  onChange={(e) => setProfileConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-stone-400 font-mono">
                  Encrypted Security Handshake
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRenewPassModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer shadow-md transition-colors inline-flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
