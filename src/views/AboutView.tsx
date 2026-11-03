import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, BookOpen, Compass, Award, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      {/* Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Charter & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100">
          About THE PATRIOT
        </h1>
        <p className="text-lg sm:text-xl font-serif italic text-stone-600 dark:text-stone-300 leading-relaxed">
          "Ideas. Knowledge. Truth. An independent digital institution dedicated to sovereign journalism, peer-reviewed discovery, and deep public inquiry."
        </p>
      </div>

      {/* Main Narrative */}
      <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-stone-200 font-serif leading-relaxed space-y-6 text-base">
        <p className="text-lg first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-amber-700 dark:first-letter:text-amber-400">
          Founded as an antidote to ephemeral algorithmic ephemera, <strong>THE PATRIOT</strong> was created to restore the intellectual gravity and curatorial dignity of the independent press. We believe that a resilient, sovereign republic cannot endure on sensationalized soundbites, manufactured outrage, or opaque automated feeds.
        </p>

        <p>
          We operate across three complementary pillars:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose font-sans">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
              1. Sovereign Journalism
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Uncompromising long-form dispatches examining critical resources, central banking architectures, and national statecraft.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
              2. Academic Preprints
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Rigorous, DOI-registered research papers and technical methodologies across physics, political economy, and computer systems.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-xl shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
              3. The Reader Agora
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Direct scholarly dialogue where readers pose questions directly to authors and researchers, resolving ambiguities in public view.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-stone-100 mt-8 mb-4">
          Independence & Governance Charter
        </h2>
        <p>
          The Patriot is governed by an independent publishing trust. We accept no sovereign state subsidies with editorial preconditions, no sponsored content masquerading as analytical journalism, and no programmatic banner networks that compromise reader privacy or reading speed.
        </p>

        <p>
          Our contributors include university faculty, former diplomatic envoys, institutional economists, and investigative reporters bound by our unified Editorial Standards Charter.
        </p>
      </div>

      {/* Trust links */}
      <div className="pt-8 border-t border-stone-200 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-sans">
        <button
          onClick={() => navigateTo('editorial-policy')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          Read Editorial Policy & Standards
        </button>
        <button
          onClick={() => navigateTo('contact')}
          className="px-4 py-2 border border-stone-300 dark:border-slate-700 hover:border-stone-500 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Contact the Editorial Bureau
        </button>
      </div>
    </div>
  );
};
