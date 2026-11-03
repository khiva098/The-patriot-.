import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Bookmark, Search, ArrowRight, Filter } from 'lucide-react';

export const ArticlesView: React.FC = () => {
  const { articles, navigateTo, toggleBookmark, isBookmarked } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = [
    { id: 'all', label: 'All Dispatches' },
    { id: 'Geopolitics & Economy', label: 'Geopolitics & Economy' },
    { id: 'Technology & Defense', label: 'Technology & Defense' },
    { id: 'Law & Governance', label: 'Law & Governance' },
    { id: 'Opinions', label: 'Opinions & Columns' },
  ];

  const filteredArticles = articles.filter(a => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-8 space-y-10">
      {/* Masthead Header */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Editorial Department
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 mt-1 mb-3">
          Articles & Investigative Dispatches
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-base max-w-2xl font-serif leading-relaxed">
          In-depth journalistic coverage, strategic geopolitical investigations, and technological analyses published with uncompromised editorial integrity.
        </p>

        {/* Filter bar */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="search"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(art => {
          const bookmarked = isBookmarked(art.id);
          return (
            <article
              key={art.id}
              className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:border-stone-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div
                  onClick={() => navigateTo('article-detail', art.id)}
                  className="aspect-16/10 overflow-hidden bg-stone-100 dark:bg-slate-800 cursor-pointer"
                >
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                      {art.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(art.id)}
                      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                      className={`cursor-pointer transition-colors ${
                        bookmarked ? 'text-amber-600' : 'hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h2
                    onClick={() => navigateTo('article-detail', art.id)}
                    className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                  >
                    {art.title}
                  </h2>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Byline / Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-stone-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <img
                    src={art.author.avatar}
                    alt={art.author.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-stone-200 dark:border-slate-700"
                  />
                  <span className="truncate max-w-[120px] font-medium text-slate-700 dark:text-stone-300">
                    {art.author.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readingTimeMinutes} min</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 px-4 border border-dashed border-stone-300 dark:border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
            {articles.length === 0 ? 'Catalog Cleared for Launch' : 'No Matching Dispatches Found'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif max-w-md mx-auto leading-relaxed">
            {articles.length === 0
              ? 'All prior placeholder dispatches have been cleared. Platform is ready for new articles certified by Master Administrator Wahab Ali Khiva.'
              : 'Try clearing your search terms or selecting a different category filter.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigateTo('admin')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              + Publish Article (Bureau)
            </button>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="px-4 py-2 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-medium cursor-pointer hover:bg-stone-100"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
