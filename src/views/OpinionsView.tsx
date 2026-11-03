import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ShieldCheck,
  ArrowRight,
  Mail,
  Send,
  MapPin,
  CheckCircle2,
  X,
  MessageSquare,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const OpinionsView: React.FC = () => {
  const { articles, navigateTo, letters, submitLetterToEditor, currentUser } = useApp();

  const opinionArticles = articles.filter(
    a => a.type === 'opinion' || a.category === 'Opinions' || a.category === 'Law & Governance'
  );

  const publishedLetters = letters.filter(l => l.status === 'published');

  // Letter submission modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');
  const [authorLocation, setAuthorLocation] = useState('Karachi, Pakistan');
  const [authorAffiliation, setAuthorAffiliation] = useState('');
  const [letterTitle, setLetterTitle] = useState('');
  const [letterTopic, setLetterTopic] = useState('Foreign Policy & Geopolitics');
  const [letterContent, setLetterContent] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Filter state for letters
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const topicsList = [
    'all',
    'Foreign Policy & Geopolitics',
    'Fiscal Sovereignty & Banking',
    'Technology & National Compute',
    'Energy Realism & Infrastructure',
    'Academic Research & Preprints',
  ];

  const filteredLetters =
    selectedTopic === 'all'
      ? publishedLetters
      : publishedLetters.filter(l => l.topic === selectedTopic);

  const handleSubmitLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterTitle.trim() || !letterContent.trim() || !authorName.trim() || !authorEmail.trim()) {
      return;
    }

    submitLetterToEditor({
      title: letterTitle.trim(),
      subject: letterTitle.trim(),
      authorName: authorName.trim(),
      writerName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      writerEmail: authorEmail.trim(),
      authorLocation: authorLocation.trim() || 'Karachi, Pakistan',
      cityOrCountry: authorLocation.trim() || 'Karachi, Pakistan',
      authorAffiliation: authorAffiliation.trim() || undefined,
      content: letterContent.trim(),
      topic: letterTopic,
    });

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      setLetterTitle('');
      setLetterContent('');
    }, 2800);
  };

  const handleLoadSampleLetter = () => {
    setLetterTitle('Bilateral Currency Swaps and the Stability of the Rupee');
    setLetterTopic('Fiscal Sovereignty & Banking');
    setAuthorName('Zainab Bukhari');
    setAuthorLocation('Lahore, Pakistan');
    setAuthorAffiliation('Centre for Development Economics');
    setLetterContent(
      'The recent analytical dispatch on Eurasian settlement mechanisms highlights an urgent reality for South Asian trade: reliance on third-party reserve currencies exposes regional commerce to severe supply-chain friction. Extending bilateral currency swap frameworks with emerging trade partners would provide a necessary buffer against external dollar liquidity crunches while protecting critical industrial imports.'
    );
  };

  return (
    <div className="py-8 space-y-12">
      {/* Broadsheet Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              The Patriot Agora · Editorial & Opinions
            </span>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <span className="text-xs text-stone-500 font-serif italic">
              Modeled after broadsheet opinion forums & Dawn editorial standards
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100">
            Opinions, Columns & Letters to the Editor
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl font-serif leading-relaxed mt-2">
            Signed commentary, philosophical dialogues, and reader dispatches from Karachi, Islamabad, Geneva, and Washington.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Letter to Editor</span>
          </button>
        </div>
      </div>

      {/* Featured Editorial Columns Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
          <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Senior Columns & Signed Essays</span>
          </h2>
          <span className="text-xs text-stone-400 font-serif italic">Peer-reviewed commentary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {opinionArticles.map(op => (
            <article
              key={op.id}
              className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs hover:border-stone-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={op.author.avatar}
                    alt={op.author.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-amber-600/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-stone-100 text-sm">
                        {op.author.name}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <p className="text-xs text-stone-500">{op.author.title}</p>
                  </div>
                </div>

                <h3
                  onClick={() => navigateTo('article-detail', op.id)}
                  className="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                >
                  {op.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif italic">
                  "{op.excerpt}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{op.readingTimeMinutes} min read</span>
                </span>

                <button
                  onClick={() => navigateTo('article-detail', op.id)}
                  className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                >
                  <span>Read Full Column</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dawn-Style Letters to the Editor Section */}
      <section className="bg-stone-100/70 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                Broadsheet Reader Forum
              </span>
              <span className="text-xs text-stone-500 font-mono">Dawn Broadsheet Style</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 dark:text-stone-100">
              Letters to the Editor
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif">
              Scholarly rejoinders, citizen critiques, and constructive rejoinders selected by the Editorial Board.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-stone-100 dark:text-slate-900 dark:hover:bg-white text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <span>Write to the Editor</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 shrink-0">
            Topics:
          </span>
          {topicsList.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              {topic === 'all' ? 'All Letters' : topic}
            </button>
          ))}
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLetters.map(letter => (
            <div
              key={letter.id}
              className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-slate-800 pb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {letter.topic}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(letter.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 leading-snug">
                  {letter.title || letter.subject}
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-serif leading-relaxed italic">
                  "{letter.content}"
                </p>

                {(letter.editorialReply || letter.editorialResponse) && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border-l-2 border-amber-600 rounded-r-lg text-xs space-y-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                      Editorial Board Response:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 font-serif">
                      {letter.editorialReply || letter.editorialResponse}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <strong className="text-slate-800 dark:text-stone-200">{letter.authorName || letter.writerName}</strong>
                  <span>({letter.authorLocation || letter.cityOrCountry})</span>
                </div>
                {(letter.authorAffiliation || letter.writerEmail) && (
                  <span className="text-stone-400 text-[11px] max-w-[150px] truncate" title={letter.authorAffiliation || letter.writerEmail}>
                    {letter.authorAffiliation || letter.writerEmail}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reader Letter Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Broadsheet Reader Forum
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100 mt-0.5">
                  Submit a Letter to the Editor
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleLetter}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  title="Prefill with sample broadsheet letter"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sample</span>
                </button>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isSubmittedSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-emerald-900 dark:text-emerald-100">
                  Letter Received by Editorial Desk
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed font-sans max-w-sm mx-auto">
                  Your letter has been transmitted to the Editorial Board. Published selections appear in the Broadsheet Reader Forum with editorial rejoinders.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLetter} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      placeholder="e.g. Farhan Zaidi"
                      className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-stone-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Email Address (Confidential) *
                    </label>
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={e => setAuthorEmail(e.target.value)}
                      placeholder="e.g. farhan@karachi.edu.pk"
                      className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-stone-100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      City & Country *
                    </label>
                    <input
                      type="text"
                      value={authorLocation}
                      onChange={e => setAuthorLocation(e.target.value)}
                      placeholder="e.g. Karachi, Pakistan"
                      className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Institutional Affiliation (Optional)
                    </label>
                    <input
                      type="text"
                      value={authorAffiliation}
                      onChange={e => setAuthorAffiliation(e.target.value)}
                      placeholder="e.g. IBA Karachi / Policy Analyst"
                      className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Editorial Topic / Category
                  </label>
                  <select
                    value={letterTopic}
                    onChange={e => setLetterTopic(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="Foreign Policy & Geopolitics">Foreign Policy & Geopolitics</option>
                    <option value="Fiscal Sovereignty & Banking">Fiscal Sovereignty & Banking</option>
                    <option value="Technology & National Compute">Technology & National Compute</option>
                    <option value="Energy Realism & Infrastructure">Energy Realism & Infrastructure</option>
                    <option value="Academic Research & Preprints">Academic Research & Preprints</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Subject / Letter Headline *
                  </label>
                  <input
                    type="text"
                    value={letterTitle}
                    onChange={e => setLetterTitle(e.target.value)}
                    placeholder="e.g. Industrial Strategy and Grid Resiliency"
                    className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-stone-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Letter Text (Max 250 words) *
                  </label>
                  <textarea
                    value={letterContent}
                    onChange={e => setLetterContent(e.target.value)}
                    rows={5}
                    placeholder="Provide reasoned, evidence-based commentary or analytical rejoinder..."
                    className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-serif leading-relaxed text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                    required
                  />
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Dawn editorial guidelines apply. Submissions may be edited for brevity.</span>
                    <span>{letterContent.trim().split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer shadow-md transition-colors inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Letter to Editor</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
