import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle, Scale, FileText, Lock } from 'lucide-react';

export const EditorialPolicyView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      {/* Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Standards & Ethics
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100">
          Editorial Policy & Fact-Checking Protocols
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-300 leading-relaxed">
          The principles governing accuracy, verification, peer review, and transparent corrections at The Patriot.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10 text-slate-800 dark:text-stone-200 font-serif leading-relaxed text-base">
        {/* Principle 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans font-bold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>1. Verification & Multi-Source Confirmation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-stone-100">
            Factual Verification Standards
          </h2>
          <p>
            Every factual assertion concerning state budgets, foreign agreements, trade data, or technological specifications must be corroborated by at least two independent primary sources: official sovereign gazettes, institutional filings (e.g. BIS, IMF, central bank accounts), or authenticated technical schematics.
          </p>
          <p>
            Secondary press reports are never cited as sole proof of contentious claims. Where primary records remain classified or disputed, our dispatches explicitly note the evidentiary boundaries and conflicting accounts.
          </p>
        </section>

        {/* Principle 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans font-bold text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>2. Academic Peer-Review Protocols</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-stone-100">
            Research Integrity & Peer Review
          </h2>
          <p>
            Monographs and preprints submitted to our Academic Repository undergo rigorous double-blind evaluation by specialist referees prior to designation as "Peer-Reviewed." We never fabricate citations, DOI identifiers, or academic affiliations.
          </p>
          <p>
            Where manuscripts represent preliminary working papers or un-refereed dispatches, they are prominently labeled as "Working Preprints" to preserve academic truth.
          </p>
        </section>

        {/* Principle 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>3. Categorical Distinctions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-stone-100">
            Separation of News, Opinion, and Research
          </h2>
          <p>
            We enforce strict typographic and structural boundaries between factual reporting, signed opinion columns, and scientific research.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm font-sans">
            <li><strong>Articles & Dispatches:</strong> Evidence-driven factual reporting and institutional analysis.</li>
            <li><strong>Opinions & Columns:</strong> Signed perspectives reflecting the author's personal philosophical or political outlook.</li>
            <li><strong>Research Papers:</strong> Formal scientific methodologies, empirical models, and reproducible data.</li>
            <li><strong>Sponsored or Commercial:</strong> Any future supported works must be prominently labeled and cordoned off from editorial deliberation.</li>
          </ul>
        </section>

        {/* Principle 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-sans font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>4. Corrections & Revisions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-stone-100">
            Unconditional Correction of Errors
          </h2>
          <p>
            When errors of fact or attribution occur, they are corrected promptly and openly at the foot of the respective article. We do not quietly overwrite text without a dated correction note explaining what was altered.
          </p>
          <p>
            Readers and scholars who identify factual inaccuracies are invited to contact the editorial bureau immediately.
          </p>
        </section>
      </div>

      <div className="pt-8 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => navigateTo('contact')}
          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
        >
          Submit a Correction or Report Misinformation →
        </button>
      </div>
    </div>
  );
};
