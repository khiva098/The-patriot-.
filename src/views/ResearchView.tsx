import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Quote, Download, Search, FileCheck, ArrowRight } from 'lucide-react';

export const ResearchView: React.FC = () => {
  const { researchPapers, navigateTo, openCitation, openReader } = useApp();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);

  const disciplines = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Quantum & Physical Sciences', label: 'Quantum & Physical Sciences' },
    { id: 'Economics & Monetary Policy', label: 'Economics & Monetary Policy' },
    { id: 'Materials & Strategic Resources', label: 'Materials & Strategic Resources' },
  ];

  const filteredPapers = researchPapers.filter(p => {
    if (selectedDiscipline !== 'all' && p.discipline !== selectedDiscipline) return false;
    if (openAccessOnly && !p.isOpenAccess) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q)) ||
        p.authors.some(a => a.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-8 space-y-10">
      {/* Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Academic Directorate
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 mt-1 mb-3">
          Research Papers & Preprints
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-base max-w-2xl font-serif leading-relaxed">
          Original scholarly investigations, empirical models, and peer-reviewed technical reports covering foundational technologies and international systems.
        </p>

        {/* Filters */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
            {disciplines.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDiscipline(d.id)}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedDiscipline === d.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={e => setOpenAccessOnly(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Open Access Only</span>
            </label>

            <div className="relative sm:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by DOI, keyword, author..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="space-y-6">
        {filteredPapers.map(paper => (
          <article
            key={paper.id}
            className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs hover:border-stone-400 dark:hover:border-slate-600 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  {paper.discipline}
                </span>
                <span aria-hidden="true">·</span>
                <span>{paper.citationInfo.journal}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Peer-Reviewed</span>
                </span>
              </div>

              <span className="font-mono text-[11px] text-stone-400">
                DOI: {paper.doi} · {paper.citationCount} Citations
              </span>
            </div>

            <h2
              onClick={() => navigateTo('research-detail', paper.id)}
              className="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
            >
              {paper.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
              {paper.abstract}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-500">
              <p>
                <strong>Authors:</strong> {paper.authors.map(a => `${a.name} (${a.affiliation})`).join(', ')}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openCitation(paper)}
                  className="hover:text-amber-600 font-medium cursor-pointer flex items-center gap-1"
                >
                  <Quote className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cite</span>
                </button>
                <button
                  onClick={() => openReader('research', paper)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Paper</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-16 px-4 border border-dashed border-stone-300 dark:border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
            {researchPapers.length === 0 ? 'Research Repository Cleared for Launch' : 'No Matching Research Papers Found'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-serif max-w-md mx-auto leading-relaxed">
            {researchPapers.length === 0
              ? 'Academic repository is primed for production launch. Authors can submit preprints with DOI registration in the publishing bureau.'
              : 'Try clearing your search query or choosing another academic discipline.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigateTo('admin')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              + Submit Research Manuscript
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
