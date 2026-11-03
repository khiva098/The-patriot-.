import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, BookOpen, FileText, Bookmark, MessageSquare, ArrowRight, User } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, articles, researchPapers, ebooks, comments, navigateTo } = useApp();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'article' | 'research' | 'ebook' | 'discussion'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Unified search logic
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: {
      id: string;
      title: string;
      subtitle?: string;
      type: 'article' | 'research' | 'ebook' | 'discussion';
      category?: string;
      meta: string;
      targetView: string;
      targetId: string;
    }[] = [];

    // Articles
    if (filterType === 'all' || filterType === 'article') {
      for (const a of articles) {
        if (
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        ) {
          results.push({
            id: a.id,
            title: a.title,
            subtitle: a.excerpt,
            type: 'article',
            category: a.category,
            meta: `By ${a.author.name} · ${a.readingTimeMinutes} min read`,
            targetView: 'article-detail',
            targetId: a.id,
          });
        }
      }
    }

    // Research Papers
    if (filterType === 'all' || filterType === 'research') {
      for (const p of researchPapers) {
        if (
          p.title.toLowerCase().includes(q) ||
          p.abstract.toLowerCase().includes(q) ||
          p.authors.some(auth => auth.name.toLowerCase().includes(q)) ||
          p.keywords.some(k => k.toLowerCase().includes(q))
        ) {
          results.push({
            id: p.id,
            title: p.title,
            subtitle: p.abstract.slice(0, 150) + '...',
            type: 'research',
            category: p.discipline,
            meta: `DOI: ${p.doi} · ${p.citationCount} Citations`,
            targetView: 'research-detail',
            targetId: p.id,
          });
        }
      }
    }

    // E-Books
    if (filterType === 'all' || filterType === 'ebook') {
      for (const b of ebooks) {
        if (
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.author.name.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
        ) {
          results.push({
            id: b.id,
            title: b.title,
            subtitle: b.description.slice(0, 150) + '...',
            type: 'ebook',
            category: b.genre,
            meta: `By ${b.author.name} · ${b.pages} pages · ${b.accessTier.toUpperCase()} ACCESS`,
            targetView: 'book-detail',
            targetId: b.id,
          });
        }
      }
    }

    // Discussions
    if (filterType === 'all' || filterType === 'discussion') {
      for (const c of comments) {
        if (c.content.toLowerCase().includes(q) || c.author.name.toLowerCase().includes(q)) {
          results.push({
            id: c.id,
            title: c.content,
            subtitle: `Commented by ${c.author.name} on ${c.publicationType}`,
            type: 'discussion',
            meta: `${c.helpfulVotes} helpful votes · ${c.isQuestion ? (c.isResolved ? 'Resolved Question' : 'Unanswered Question') : 'Discussion'}`,
            targetView: 'discussions',
            targetId: c.id,
          });
        }
      }
    }

    return results;
  }, [query, filterType, articles, researchPapers, ebooks, comments]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-20">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transition-colors">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search dispatches, research, e-books, questions, or scholars..."
            className="w-full bg-transparent text-base sm:text-lg text-slate-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Segmented Controls */}
        <div className="px-4 py-2 bg-stone-50 dark:bg-slate-800/50 border-b border-stone-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'article', label: 'Articles' },
            { id: 'research', label: 'Research Papers' },
            { id: 'ebook', label: 'E-Books' },
            { id: 'discussion', label: 'Discussions & Q&A' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-stone-100 dark:divide-slate-800">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">
              <p className="font-serif italic text-base text-stone-500 dark:text-stone-300 mb-1">
                "Ideas. Knowledge. Truth."
              </p>
              <p>Type keywords to discover scholarly research, analytical essays, and library volumes.</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">
              <p className="font-medium text-slate-700 dark:text-stone-300">No matching publications found.</p>
              <p className="text-xs text-stone-500 mt-1">Try broader terms like "sovereignty", "quantum", "monetary", or "chokepoint".</p>
            </div>
          ) : (
            searchResults.map(item => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => {
                  navigateTo(item.targetView, item.targetId);
                  setIsSearchOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-stone-50 dark:hover:bg-slate-800/70 rounded-lg transition-colors group cursor-pointer flex items-start gap-3"
              >
                <div className="mt-1 text-amber-600 dark:text-amber-400 shrink-0">
                  {item.type === 'article' && <FileText className="w-4 h-4" />}
                  {item.type === 'research' && <BookOpen className="w-4 h-4" />}
                  {item.type === 'ebook' && <Bookmark className="w-4 h-4" />}
                  {item.type === 'discussion' && <MessageSquare className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-0.5">
                    <span className="uppercase font-semibold tracking-wider text-amber-700 dark:text-amber-400">
                      {item.type}
                    </span>
                    {item.category && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.category}</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 line-clamp-1">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 mt-1">{item.meta}</p>
                </div>

                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-slate-900 border-t border-stone-100 dark:border-slate-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span>{searchResults.length} results matching</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
