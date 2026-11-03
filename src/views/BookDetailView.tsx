import React from 'react';
import { useApp } from '../context/AppContext';
import { DiscussionThread } from '../components/DiscussionThread';
import {
  BookOpen,
  Download,
  Star,
  ChevronLeft,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const BookDetailView: React.FC = () => {
  const {
    activeDetailId,
    ebooks,
    navigateTo,
    openReader,
    role,
    recordReadingProgress,
  } = useApp();

  const book = ebooks.find(b => b.id === activeDetailId || b.slug === activeDetailId) || ebooks[0];

  React.useEffect(() => {
    if (book) {
      recordReadingProgress({
        publicationId: book.id,
        publicationType: 'ebook',
        title: book.title,
        subtitle: book.subtitle,
        authorName: book.author.name,
        categoryOrDiscipline: book.genre,
        coverImage: book.coverImage,
        progress: 15,
        totalTimeMinutes: 180,
        slug: book.slug,
      });
    }
  }, [book?.id]);

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-bold text-2xl text-slate-900 dark:text-stone-100">
          Monograph in Digital Archive Clearance
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-serif max-w-md mx-auto leading-relaxed">
          The requested monograph or e-book is not currently in the catalog or is being prepared for cataloging.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Return to Front Page
          </button>
          <button
            onClick={() => navigateTo('books')}
            className="px-5 py-2.5 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-stone-100"
          >
            Browse E-Book Library
          </button>
        </div>
      </div>
    );
  }

  const canDownload = () => {
    if (book.accessTier === 'free') return true;
    if (book.accessTier === 'registered' && role !== 'visitor') return true;
    if (book.accessTier === 'restricted' && (role === 'editor' || role === 'administrator')) return true;
    return false;
  };

  return (
    <article className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('books')}
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-slate-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to E-Book Library</span>
        </button>
      </div>

      {/* Book Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-start">
        {/* Book Cover */}
        <div className="w-full md:w-56 aspect-3/4 rounded-lg overflow-hidden bg-stone-100 dark:bg-slate-800 shrink-0 shadow-lg border border-stone-200 dark:border-slate-700">
          <img
            src={book.coverImage}
            alt={book.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Book Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {book.genre}
            </span>
            <span aria-hidden="true">·</span>
            <span>Edition: {book.edition}</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase text-[10px] font-bold tracking-wider text-slate-700 dark:text-stone-300">
              {book.accessTier} ACCESS
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 leading-tight">
            {book.title}
          </h1>

          {book.subtitle && (
            <p className="text-sm font-serif italic text-stone-600 dark:text-stone-300">
              {book.subtitle}
            </p>
          )}

          <div className="text-xs text-stone-500 space-y-1">
            <p>
              Authored by <strong className="text-slate-900 dark:text-stone-100">{book.author.name}</strong> ({book.author.affiliation})
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{book.rating}</span>
              </span>
              <span className="text-stone-400 font-mono">({book.ratingCount} reader reviews)</span>
              <span aria-hidden="true">·</span>
              <span>{book.pages} Pages</span>
              <span aria-hidden="true">·</span>
              <span>{book.fileFormat} ({book.fileSize})</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-2">
            {book.description}
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openReader('ebook', book)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Online (Free Preview)</span>
            </button>

            {canDownload() ? (
              <button
                onClick={() => openReader('ebook', book)}
                className="px-4 py-2 border border-stone-300 dark:border-slate-700 hover:border-stone-500 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {book.fileFormat} ({book.fileSize})</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-slate-800 text-stone-500 text-xs rounded-lg">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Requires Sign-in to Download</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table of Contents & Sample Reader */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
            Table of Contents
          </h2>
          <ul className="divide-y divide-stone-100 dark:divide-slate-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
            {book.tableOfContents.map((chap, idx) => (
              <li key={idx} className="py-2.5 flex items-center justify-between">
                <span>{chap}</span>
                <span className="text-xs text-stone-400 font-mono">Sec. {idx + 1}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright & Takedown notice */}
        <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
          <p>{book.copyrightNotice}</p>
          <button
            onClick={() => navigateTo('contact')}
            className="text-amber-700 dark:text-amber-400 hover:underline shrink-0 cursor-pointer"
          >
            File Copyright or Takedown Notice
          </button>
        </div>
      </div>

      {/* Reader Discussion and Inquiries */}
      <DiscussionThread
        publicationId={book.id}
        publicationType="ebook"
        publicationTitle={book.title}
      />
    </article>
  );
};
