import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EBook, ResearchPaper } from '../types';
import { X, Download, Type, BookOpen, Lock, Check, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

export const ReaderModal: React.FC = () => {
  const { readingItem, closeReader, role, recordReadingProgress } = useApp();
  const [fontSize, setFontSize] = useState<number>(17);
  const [isSerif, setIsSerif] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'toc' | 'details'>('text');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const isEBook = readingItem?.type === 'ebook';
  const ebook = isEBook ? (readingItem?.data as EBook) : null;
  const paper = !isEBook && readingItem ? (readingItem.data as ResearchPaper) : null;

  // Record initial reading event
  React.useEffect(() => {
    if (!readingItem) return;
    if (isEBook && ebook) {
      recordReadingProgress({
        publicationId: ebook.id,
        publicationType: 'ebook',
        title: ebook.title,
        subtitle: ebook.subtitle,
        authorName: ebook.author.name,
        categoryOrDiscipline: ebook.genre,
        coverImage: ebook.coverImage,
        progress: 25,
        totalTimeMinutes: 180,
        slug: ebook.slug,
      });
    } else if (paper) {
      recordReadingProgress({
        publicationId: paper.id,
        publicationType: 'research',
        title: paper.title,
        authorName: paper.authors.map(a => a.name).join(', '),
        categoryOrDiscipline: paper.discipline,
        coverImage: '/src/assets/images/patriot_research_quantum_lithography_1792591071239.jpg',
        progress: 35,
        totalTimeMinutes: 30,
        slug: paper.slug,
      });
    }
  }, [readingItem?.data?.id]);

  const handleContainerScroll = () => {
    if (!scrollContainerRef.current || !readingItem) return;
    const el = scrollContainerRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const progress = Math.min(100, Math.max(0, Math.round((el.scrollTop / maxScroll) * 100)));

    if (progress > 10) {
      if (isEBook && ebook) {
        recordReadingProgress({
          publicationId: ebook.id,
          publicationType: 'ebook',
          title: ebook.title,
          subtitle: ebook.subtitle,
          authorName: ebook.author.name,
          categoryOrDiscipline: ebook.genre,
          coverImage: ebook.coverImage,
          progress: progress,
          totalTimeMinutes: 180,
          slug: ebook.slug,
        });
      } else if (paper) {
        recordReadingProgress({
          publicationId: paper.id,
          publicationType: 'research',
          title: paper.title,
          authorName: paper.authors.map(a => a.name).join(', '),
          categoryOrDiscipline: paper.discipline,
          coverImage: '/src/assets/images/patriot_research_quantum_lithography_1792591071239.jpg',
          progress: progress,
          totalTimeMinutes: 30,
          slug: paper.slug,
        });
      }
    }
  };

  if (!readingItem) return null;

  const canDownload = () => {
    if (isEBook && ebook) {
      if (ebook.accessTier === 'free') return true;
      if (ebook.accessTier === 'registered' && role !== 'visitor') return true;
      if (ebook.accessTier === 'restricted' && (role === 'editor' || role === 'administrator')) return true;
      return false;
    }
    if (paper) {
      if (paper.isOpenAccess) return true;
      if (role !== 'visitor') return true;
      return false;
    }
    return false;
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex flex-col">
      {/* Top Reading Navigation Bar */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 transition-colors">
        <div className="flex items-center gap-3 overflow-hidden">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100 truncate">
            {ebook ? ebook.title : paper?.title}
          </span>
          <span className="hidden sm:inline text-xs text-stone-400 shrink-0">
            {ebook ? `· By ${ebook.author.name}` : `· ${paper?.discipline}`}
          </span>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Typography Controls */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
              aria-label="Decrease text size"
              className="px-2 py-0.5 font-bold hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer text-stone-700 dark:text-stone-300"
            >
              A-
            </button>
            <span className="px-1 text-[11px] text-stone-500 font-mono">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
              aria-label="Increase text size"
              className="px-2 py-0.5 font-bold hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer text-stone-700 dark:text-stone-300"
            >
              A+
            </button>
            <button
              onClick={() => setIsSerif(!isSerif)}
              className="ml-1 px-2 py-0.5 text-[11px] font-medium hover:bg-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer text-stone-700 dark:text-stone-300"
            >
              {isSerif ? 'Serif' : 'Sans'}
            </button>
          </div>

          {/* Download Action */}
          {canDownload() ? (
            <button
              onClick={handleDownload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Document Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF ({ebook ? ebook.fileSize : paper?.pdfSize})</span>
                </>
              )}
            </button>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-slate-800 text-stone-500 text-xs rounded">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Requires Sign-in</span>
            </div>
          )}

          {/* Close modal */}
          <button
            onClick={closeReader}
            aria-label="Close reading view"
            className="p-1.5 text-stone-500 hover:text-slate-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Reader Body */}
      <div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        className="flex-1 overflow-y-auto bg-stone-100 dark:bg-slate-950 py-8 px-4 sm:px-6"
      >
        <article
          className={`max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xl rounded-xl p-6 sm:p-12 transition-colors ${
            isSerif ? 'font-serif' : 'font-sans'
          }`}
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.85' }}
        >
          {ebook && (
            <div>
              {/* E-Book Masthead */}
              <div className="border-b border-stone-200 dark:border-slate-800 pb-6 mb-8 text-center">
                <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-sans font-semibold">
                  {ebook.genre} · {ebook.publishedYear}
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-stone-100 mt-2 mb-3">
                  {ebook.title}
                </h1>
                {ebook.subtitle && (
                  <p className="text-base text-stone-600 dark:text-stone-300 font-sans italic mb-4">
                    {ebook.subtitle}
                  </p>
                )}
                <p className="text-sm font-sans text-stone-500 dark:text-stone-400">
                  Authored by <strong className="text-slate-900 dark:text-stone-200">{ebook.author.name}</strong> ({ebook.author.affiliation})
                </p>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-sans text-stone-400">
                  <span>{ebook.pages} Pages</span>
                  <span aria-hidden="true">·</span>
                  <span>{ebook.edition}</span>
                  <span aria-hidden="true">·</span>
                  <span>Language: {ebook.language}</span>
                </div>
              </div>

              {/* Sample Reading Body */}
              <div className="text-slate-800 dark:text-stone-200 space-y-6">
                <div className="text-xs font-sans text-stone-500 uppercase tracking-widest font-semibold border-b border-stone-100 dark:border-slate-800 pb-2">
                  Sample Volume Excerpt & Chapter Preview
                </div>
                <div className="whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-amber-700 dark:first-letter:text-amber-400">
                  {ebook.sampleChapterExcerpt}
                </div>

                <div className="pt-8 border-t border-stone-200 dark:border-slate-800 mt-12">
                  <h3 className="text-lg font-bold font-serif mb-4 text-slate-900 dark:text-stone-100">
                    Table of Contents
                  </h3>
                  <ul className="divide-y divide-stone-100 dark:divide-slate-800/80 text-sm font-sans">
                    {ebook.tableOfContents.map((chap, idx) => (
                      <li key={idx} className="py-2.5 flex items-center justify-between text-stone-600 dark:text-stone-300">
                        <span>{chap}</span>
                        <span className="text-xs text-stone-400 font-mono">Sec. 0{idx + 1}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Copyright info */}
                <div className="bg-stone-50 dark:bg-slate-800/50 p-4 rounded-lg text-xs font-sans text-stone-500 border border-stone-200 dark:border-slate-700/60 mt-8">
                  {ebook.copyrightNotice}
                </div>
              </div>
            </div>
          )}

          {paper && (
            <div>
              {/* Paper Masthead */}
              <div className="border-b border-stone-200 dark:border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-2 text-xs font-sans text-stone-500 uppercase tracking-wider mb-2">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{paper.discipline}</span>
                  <span aria-hidden="true">·</span>
                  <span>{paper.citationInfo.journal}</span>
                  <span aria-hidden="true">·</span>
                  <span>{paper.version}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-stone-100 mb-4">
                  {paper.title}
                </h1>
                <div className="text-sm font-sans text-stone-600 dark:text-stone-300 space-y-1 mb-4">
                  <p>
                    <strong>Authors:</strong> {paper.authors.map(a => `${a.name} (${a.affiliation})`).join(', ')}
                  </p>
                  <p className="text-xs text-stone-500 font-mono">
                    DOI: {paper.doi} · Published {new Date(paper.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Research Structure */}
              <div className="text-slate-800 dark:text-stone-200 space-y-8">
                <section>
                  <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                    Abstract
                  </h3>
                  <p className="text-justify leading-relaxed bg-stone-50 dark:bg-slate-800/40 p-5 rounded-lg border border-stone-200 dark:border-slate-800 italic">
                    {paper.abstract}
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 dark:text-stone-100 mb-2">
                    1. Experimental Methodology
                  </h3>
                  <p className="leading-relaxed">{paper.methodology}</p>
                </section>

                <section>
                  <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 dark:text-stone-100 mb-2">
                    2. Empirical Findings & Analysis
                  </h3>
                  <p className="leading-relaxed">{paper.findings}</p>
                </section>

                <section className="pt-6 border-t border-stone-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-slate-900 dark:text-stone-100 mb-3">
                    References & Scholarly Bibliography
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2 text-xs font-sans text-stone-600 dark:text-stone-400">
                    {paper.references.map((ref, idx) => (
                      <li key={idx} className="leading-normal">{ref}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
