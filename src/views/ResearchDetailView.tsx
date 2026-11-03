import React from 'react';
import { useApp } from '../context/AppContext';
import { DiscussionThread } from '../components/DiscussionThread';
import {
  BookOpen,
  Download,
  Quote,
  FileCheck,
  ChevronLeft,
  ExternalLink,
  Tag,
  Paperclip,
  Share2,
} from 'lucide-react';

export const ResearchDetailView: React.FC = () => {
  const {
    activeDetailId,
    researchPapers,
    navigateTo,
    openCitation,
    openReader,
    recordReadingProgress,
  } = useApp();

  const paper = researchPapers.find(p => p.id === activeDetailId || p.slug === activeDetailId) || researchPapers[0];

  React.useEffect(() => {
    if (paper) {
      recordReadingProgress({
        publicationId: paper.id,
        publicationType: 'research',
        title: paper.title,
        authorName: paper.authors.map(a => a.name).join(', '),
        categoryOrDiscipline: paper.discipline,
        coverImage: '/src/assets/images/patriot_research_quantum_lithography_1792591071239.jpg',
        progress: 25,
        totalTimeMinutes: 30,
        slug: paper.slug,
      });
    }
  }, [paper?.id]);

  if (!paper) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-bold text-2xl text-slate-900 dark:text-stone-100">
          Research Paper in Peer Review
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-serif max-w-md mx-auto leading-relaxed">
          The requested scholarly preprint is not available or is undergoing peer-review verification.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Return to Front Page
          </button>
          <button
            onClick={() => navigateTo('research')}
            className="px-5 py-2.5 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-stone-100"
          >
            Browse Research Repository
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('research')}
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-slate-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Research Repository</span>
        </button>
      </div>

      {/* Paper Masthead */}
      <header className="border-b border-stone-200 dark:border-slate-800 pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              {paper.discipline}
            </span>
            <span aria-hidden="true">·</span>
            <span>{paper.citationInfo.journal}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Peer-Reviewed</span>
            </span>
          </div>

          <span className="font-mono text-[11px] bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {paper.version}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 leading-tight">
          {paper.title}
        </h1>

        {/* Authors with Affiliations */}
        <div className="pt-2 text-sm text-slate-800 dark:text-stone-200 space-y-1.5">
          <p className="font-medium">
            {paper.authors.map((a, i) => (
              <span key={a.id}>
                <strong>{a.name}</strong>
                <span className="text-xs text-stone-500"> ({a.affiliation})</span>
                {i < paper.authors.length - 1 ? '; ' : ''}
              </span>
            ))}
          </p>

          <p className="text-xs text-stone-500 font-mono flex items-center gap-3">
            <span>Published: {new Date(paper.publishedAt).toLocaleDateString()}</span>
            <span aria-hidden="true">·</span>
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>DOI: {paper.doi}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        {/* Action Ribbon: Cite, Read, Download */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => openReader('research', paper)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Full Paper</span>
          </button>

          <button
            onClick={() => openCitation(paper)}
            className="px-4 py-2 border border-stone-300 dark:border-slate-700 hover:border-stone-500 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Quote className="w-4 h-4 text-amber-600" />
            <span>Cite (APA, MLA, Chicago, BibTeX)</span>
          </button>

          <button
            onClick={() => openReader('research', paper)}
            className="px-4 py-2 border border-stone-300 dark:border-slate-700 hover:border-stone-500 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF ({paper.pdfSize})</span>
          </button>
        </div>
      </header>

      {/* Main Research Sections */}
      <div className="space-y-8 text-slate-800 dark:text-stone-200">
        {/* Abstract Box */}
        <section className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Abstract
          </h2>
          <p className="text-sm sm:text-base font-serif italic leading-relaxed text-justify">
            {paper.abstract}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans">
            <span className="font-semibold text-stone-400">Subject Keywords:</span>
            {paper.keywords.map(kw => (
              <span key={kw} className="text-amber-800 dark:text-amber-300">
                {kw} ·
              </span>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-stone-100">
            1. Research Methodology & Experimental Architecture
          </h2>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {paper.methodology}
          </p>
        </section>

        {/* Findings */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-stone-100">
            2. Empirical Findings & Statistical Significance
          </h2>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {paper.findings}
          </p>
        </section>

        {/* Supplementary Files */}
        {paper.supplementaryFiles && paper.supplementaryFiles.length > 0 && (
          <section className="pt-6 border-t border-stone-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              <span>Supplementary Materials & Calibration Data</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {paper.supplementaryFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span className="font-mono text-stone-700 dark:text-stone-300 truncate">{file.name}</span>
                  <span className="text-stone-400 shrink-0">{file.size}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References & Bibliography */}
        <section className="pt-6 border-t border-stone-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Scholarly References & Primary Literature
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-stone-600 dark:text-stone-400">
            {paper.references.map((ref, idx) => (
              <li key={idx} className="leading-normal">{ref}</li>
            ))}
          </ol>
        </section>

        {/* Discussion Thread */}
        <DiscussionThread
          publicationId={paper.id}
          publicationType="research"
          publicationTitle={paper.title}
        />
      </div>
    </article>
  );
};
