import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  FileText,
  Bookmark,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Download,
  HelpCircle,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Plus,
  FileUp,
  Layers,
  Award,
  Globe,
  Radio,
  Send,
  GraduationCap,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export const HomeView: React.FC = () => {
  const {
    articles,
    researchPapers,
    ebooks,
    comments,
    navigateTo,
    openReader,
    openCitation,
    toggleBookmark,
    isBookmarked,
    loadInauguralEdition,
    letters,
    role,
    currentUser,
  } = useApp();

  const publishedLetters = letters.filter(l => l.status === 'published').slice(0, 3);
  const activeQuestions = comments
    .filter(c => c.isQuestion)
    .sort((a, b) => b.helpfulVotes - a.helpfulVotes)
    .slice(0, 3);

  // -------------------------------------------------------------------------
  // CLEAN LAUNCHPAD: When publications catalog has been cleared for launch
  // -------------------------------------------------------------------------
  if (articles.length === 0) {
    return (
      <div className="py-10 space-y-16">
        {/* Broadsheet Inaugural Masthead Banner */}
        <section aria-label="Inaugural Launch Masthead" className="border-b border-stone-200 dark:border-slate-800 pb-12">
          <div className="bg-radial from-amber-500/10 via-stone-100/60 to-white dark:from-amber-950/20 dark:via-slate-900/60 dark:to-slate-950 border border-amber-600/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span>Official Platform Launch Bureau</span>
            </div>

            <div className="flex justify-center mb-6">
              <BrandLogo size="lg" withText={true} />
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 max-w-3xl mx-auto leading-tight">
              Sovereign Platform Online & Ready for Inaugural Dispatches
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-serif max-w-2xl mx-auto mt-4 leading-relaxed">
              All prior placeholder items have been purged. The platform is calibrated and operating under the sovereign editorial authority of <strong>Wahab Ali Khiva</strong>.
            </p>

            {/* Sovereign Authority & System Status Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs font-mono">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Master Admin: Wahab Ali Khiva</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-stone-300">
                <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Editions: Karachi · Islamabad · Geneva</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-stone-300">
                <Radio className="w-4 h-4 text-red-500" />
                <span>CNN/BBC Live Wire: Transmitting</span>
              </div>
            </div>

            {/* Launchpad Action Bureau Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <button
                onClick={() => navigateTo('admin')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish First Dispatch (Admin Bureau)</span>
              </button>

              <button
                onClick={loadInauguralEdition}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-500/40 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                title="Populate catalog with certified inaugural launch edition dispatches"
              >
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Deploy Official Inaugural Edition (1-Click)</span>
              </button>

              <button
                onClick={() => navigateTo('opinions')}
                className="inline-flex items-center gap-2 px-5 py-3 border border-stone-300 dark:border-slate-700 hover:border-stone-500 text-stone-700 dark:text-stone-200 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>View Reader Letters (Dawn Forum)</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3 Pillar Catalog Launch Readiness Indicators */}
        <section aria-label="Launch Readiness" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
                Investigative Journalism
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                Broadsheet dispatches adhering to the journalistic standards of Dawn, The Guardian, and BBC News. No commercial interference.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400">0 Articles in Circulation</span>
              <button
                onClick={() => navigateTo('admin')}
                className="text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                + Write Article
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
                Academic Research Repository
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                Peer-reviewed preprints, empirical methodologies, and DOI registered treatises covering physical sciences and statecraft.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400">0 Papers Cataloged</span>
              <button
                onClick={() => navigateTo('admin')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                + Import Paper
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100">
                LMS Academy & E-Books
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                Integrated learning management system for readers and authors, paired with an authorized digital monograph library.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400">3 Courses Active</span>
              <button
                onClick={() => navigateTo('lms')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Open Academy
              </button>
            </div>
          </div>
        </section>

        {/* Dawn Standard: Letters to the Editor Showcase */}
        {publishedLetters.length > 0 && (
          <section aria-label="Dawn-style Letters to Editor" className="border-t border-stone-200 dark:border-slate-800 pt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Broadsheet Reader Forum · Dawn Standard
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-stone-100 mt-0.5">
                  Letters to the Editor
                </h2>
              </div>
              <button
                onClick={() => navigateTo('opinions')}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                View All Letters ({letters.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedLetters.map(letter => (
                <div
                  key={letter.id}
                  onClick={() => navigateTo('opinions')}
                  className="bg-stone-50 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400">
                      {letter.topic}
                    </span>
                    <h3 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-base leading-snug line-clamp-2">
                      {letter.subject || letter.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 font-serif italic">
                      "{letter.content}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-800 text-[11px] text-stone-500 flex items-center justify-between">
                    <span>— {letter.writerName || letter.authorName}</span>
                    <span className="text-stone-400">{letter.cityOrCountry || letter.authorLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* The Guardian Style: Editorial Independence & Trust Charter */}
        <section aria-label="Editorial Independence Charter" className="bg-slate-900 text-stone-100 rounded-2xl p-8 border border-stone-800">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              The Guardian & BBC Trust Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-snug">
              "We report without fear, publish without commercial bias, and answer exclusively to truth."
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-serif">
              THE PATRIOT was founded to establish an independent bastion of scholarly inquiry, geopolitical analysis, and empirical science. Our platform operates free from algorithmic sensationalism and corporate sponsorships.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-stone-400">
              <span>Sole Sovereign Authority: Wahab Ali Khiva</span>
              <span>·</span>
              <span>Published Worldwide</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // FULL BROADSHEET VIEW: When publications are present
  // -------------------------------------------------------------------------
  const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
  const secondaryArticles = articles.filter(a => a.id !== featuredArticle?.id).slice(0, 3);
  const featuredPapers = researchPapers.slice(0, 2);
  const featuredBooks = ebooks.slice(0, 2);

  return (
    <div className="space-y-16 py-8">
      {/* Editorial Front Page Salience Tier 1: Lead Story & Hero Split */}
      {featuredArticle && (
        <section aria-label="Lead Story" className="border-b border-stone-200 dark:border-slate-800 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Lead Story (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>Front Page Special Dispatch</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.category}</span>
              </div>

              <h1
                onClick={() => navigateTo('article-detail', featuredArticle.id)}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-[1.15]"
              >
                {featuredArticle.title}
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
                {featuredArticle.subtitle}
              </p>

              {/* Featured Image */}
              <div
                onClick={() => navigateTo('article-detail', featuredArticle.id)}
                className="relative aspect-16/9 overflow-hidden rounded-xl bg-stone-100 dark:bg-slate-800 cursor-pointer group shadow-sm border border-stone-200/60 dark:border-slate-800"
              >
                <img
                  src={featuredArticle.featuredImage}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                {featuredArticle.imageCaption && (
                  <div className="absolute bottom-3 left-4 right-4 text-xs text-stone-200 font-serif italic drop-shadow-sm">
                    {featuredArticle.imageCaption}
                  </div>
                )}
              </div>

              {/* CNN/BBC Executive Takeaway Highlights */}
              <div className="bg-amber-500/10 dark:bg-slate-900 border-l-4 border-amber-600 dark:border-amber-500 p-4 rounded-r-lg space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>At a Glance · Core Analytical Thesis</span>
                </span>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Author Byline & Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredArticle.author.avatar}
                    alt={featuredArticle.author.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-stone-200 dark:border-slate-700"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-stone-200">
                      {featuredArticle.author.name}
                    </span>
                    <span className="hidden sm:inline">, {featuredArticle.author.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span>{new Date(featuredArticle.publishedAt).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredArticle.readingTimeMinutes} min read</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => toggleBookmark(featuredArticle.id)}
                    aria-label={isBookmarked(featuredArticle.id) ? 'Remove bookmark' : 'Bookmark story'}
                    className={`cursor-pointer transition-colors ${
                      isBookmarked(featuredArticle.id) ? 'text-amber-600' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Column: Trending Analyses (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-stone-200 lg:dark:border-slate-800 lg:pl-8">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Trending Analyses</span>
                </h2>
                <button
                  onClick={() => navigateTo('articles')}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-6 divide-y divide-stone-100 dark:divide-slate-800/80">
                {secondaryArticles.map((art, idx) => (
                  <article key={art.id} className={idx > 0 ? 'pt-6' : ''}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                      {art.category}
                    </div>
                    <h3
                      onClick={() => navigateTo('article-detail', art.id)}
                      className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                    >
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {art.excerpt}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-stone-400">
                      <span>By {art.author.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.readingTimeMinutes} min read</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Quick Editorial Quote Box */}
              <div className="bg-stone-100/70 dark:bg-slate-800/50 p-5 rounded-xl border border-stone-200 dark:border-slate-800">
                <p className="font-serif italic text-sm text-slate-800 dark:text-stone-200 leading-relaxed">
                  "An informed citizenry is the only reliable sanctuary against the quiet atrophy of sovereignty."
                </p>
                <p className="text-xs text-stone-500 font-sans mt-2 font-medium">
                  — The Patriot Sovereign Charter · Wahab Ali Khiva
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Salience Tier 2: Academic Discoveries & Research Papers */}
      {featuredPapers.length > 0 && (
        <section aria-label="Academic Research Repository" className="border-b border-stone-200 dark:border-slate-800 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-stone-100">
                  Academic Discoveries & Preprints
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Peer-reviewed monographs and technical papers across physics, strategic resources, and political economy.
              </p>
            </div>

            <button
              onClick={() => navigateTo('research')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-600 cursor-pointer"
            >
              <span>Explore Research Archive ({researchPapers.length} Papers)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPapers.map(paper => (
              <article
                key={paper.id}
                className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs hover:border-stone-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      {paper.discipline}
                    </span>
                    <span>{paper.isOpenAccess ? 'Open Access' : 'Registered Access'}</span>
                  </div>

                  <h3
                    onClick={() => navigateTo('research-detail', paper.id)}
                    className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                  >
                    {paper.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>

                  <div className="pt-2 text-xs text-stone-500 space-y-1">
                    <p>
                      <strong>Authors:</strong> {paper.authors.map(a => a.name).join(', ')}
                    </p>
                    <p className="font-mono text-[11px] text-stone-400">
                      DOI: {paper.doi} · {paper.citationCount} Citations
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => openCitation(paper)}
                    className="text-stone-600 dark:text-stone-300 hover:text-amber-600 font-medium cursor-pointer"
                  >
                    Cite Paper (APA/MLA)
                  </button>

                  <button
                    onClick={() => openReader('research', paper)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded font-medium transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Paper</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Salience Tier 3: Digital E-Book Library Showcase */}
      {featuredBooks.length > 0 && (
        <section aria-label="E-Book Library Showcase" className="border-b border-stone-200 dark:border-slate-800 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-stone-100">
                  The Patriot E-Book Library
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Curated monographs, historical treatises, and statecraft volumes with built-in reading experience.
              </p>
            </div>

            <button
              onClick={() => navigateTo('books')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-600 cursor-pointer"
            >
              <span>Browse Library Catalog ({ebooks.length} Books)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredBooks.map(book => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row gap-6 items-start"
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
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">{book.genre}</span>
                    <span aria-hidden="true">·</span>
                    <span>{book.publishedYear}</span>
                  </div>

                  <h3
                    onClick={() => navigateTo('book-detail', book.id)}
                    className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                  >
                    {book.title}
                  </h3>

                  <p className="text-xs text-stone-500">
                    By <strong className="text-slate-800 dark:text-stone-200">{book.author.name}</strong> ({book.author.affiliation})
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
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
                      View Volume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Salience Tier 4: Public Discussions & Unanswered Inquiries */}
      {activeQuestions.length > 0 && (
        <section aria-label="Reader Discussions & Unanswered Questions" className="border-b border-stone-200 dark:border-slate-800 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-stone-100">
                  Public Inquiries & Reader Discourse
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Scholarly questions posed directly to our contributors. Help answer or participate in ongoing inquiries.
              </p>
            </div>

            <button
              onClick={() => navigateTo('discussions')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-600 cursor-pointer"
            >
              <span>All Discussions ({comments.length} Threads)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeQuestions.map(q => (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold uppercase text-[10px] tracking-wider ${
                      q.isResolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                    }`}>
                      {q.isResolved ? 'Resolved Question' : 'Open Inquiry'}
                    </span>
                    <span className="text-stone-400 text-[11px]">{q.helpfulVotes} helpful votes</span>
                  </div>

                  <p className="font-serif text-sm font-semibold text-slate-900 dark:text-stone-100 line-clamp-3 leading-snug">
                    "{q.content}"
                  </p>

                  <p className="text-[11px] text-stone-400">
                    Asked by <strong className="text-slate-700 dark:text-stone-300">{q.author.name}</strong> on {q.publicationType}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    {q.replies?.length || 0} Responses
                  </span>
                  <button
                    onClick={() => navigateTo('discussions')}
                    className="text-amber-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                  >
                    Join Thread
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
