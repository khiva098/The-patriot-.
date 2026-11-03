import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Star, Lock, Search } from 'lucide-react';

export const BooksView: React.FC = () => {
  const { ebooks, navigateTo, openReader } = useApp();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Dynamically derive genres from catalog to support any new admin-published book genres
  const availableGenres = Array.from(new Set(ebooks.map(b => b.genre))).filter(Boolean);
  const genres = [
    { id: 'all', label: 'All Genres' },
    ...availableGenres.map(g => ({ id: g, label: g })),
  ];

  const filteredBooks = ebooks.filter(b => {
    if (selectedGenre !== 'all' && b.genre !== selectedGenre) return false;
    if (accessFilter !== 'all' && b.accessTier !== accessFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-8 space-y-10">
      {/* Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          The Patriot Digital Library
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 mt-1 mb-3">
          Scholarly E-Books & Monograph Archive
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-base max-w-2xl font-serif leading-relaxed">
          Authorized digital editions of foundational treatises, national development studies, and strategic textbooks formatted for online reading and offline reference.
        </p>

        {/* Filters */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
            {genres.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedGenre === g.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={accessFilter}
              onChange={e => setAccessFilter(e.target.value)}
              className="text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-stone-300"
            >
              <option value="all">All Access Tiers</option>
              <option value="free">Free Public Access</option>
              <option value="registered">Registered Reader Access</option>
              <option value="restricted">Restricted / Institutional</option>
            </select>

            <div className="relative sm:w-56">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="search"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredBooks.map(book => (
          <article
            key={book.id}
            className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row gap-6 items-start hover:border-stone-400 dark:hover:border-slate-600 transition-all"
          >
            <div
              onClick={() => navigateTo('book-detail', book.id)}
              className="w-full sm:w-40 aspect-3/4 rounded-lg overflow-hidden bg-stone-100 dark:bg-slate-800 shrink-0 shadow-md border border-stone-200 dark:border-slate-700 cursor-pointer group"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-amber-700 dark:text-amber-400">{book.genre}</span>
                <span className="uppercase text-[10px] font-bold text-stone-400">{book.accessTier}</span>
              </div>

              <h2
                onClick={() => navigateTo('book-detail', book.id)}
                className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
              >
                {book.title}
              </h2>

              <p className="text-xs text-stone-500">
                By <strong className="text-slate-800 dark:text-stone-200">{book.author.name}</strong>
              </p>

              <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{book.rating}</span>
                <span className="text-stone-400 font-normal">({book.ratingCount} reviews) · {book.pages} pages</span>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                {book.description}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs">
                <button
                  onClick={() => openReader('ebook', book)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors cursor-pointer"
                >
                  Read Online
                </button>
                <button
                  onClick={() => navigateTo('book-detail', book.id)}
                  className="px-3 py-1.5 border border-stone-200 dark:border-slate-700 hover:border-stone-400 text-stone-700 dark:text-stone-200 rounded font-medium transition-colors cursor-pointer"
                >
                  Details & TOC
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-16 px-4 border border-dashed border-stone-300 dark:border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
            {ebooks.length === 0 ? 'Digital Monograph Library Cleared for Launch' : 'No Matching E-Books Found'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif max-w-md mx-auto leading-relaxed">
            {ebooks.length === 0
              ? 'Digital monograph and treatise library is cleared for launch. Authors and editors can catalog digital volumes through the sovereign bureau.'
              : 'Try clearing your search terms or selecting another genre.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigateTo('admin')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              + Catalog E-Book (Bureau)
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
