import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCitation } from '../utils/pure_logic';
import { X, Copy, Check, ExternalLink, Quote } from 'lucide-react';

export const CitationModal: React.FC = () => {
  const { citationPaper, closeCitation } = useApp();
  const [style, setStyle] = useState<'APA' | 'MLA' | 'Chicago' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  if (!citationPaper) return null;

  const citationText = formatCitation(citationPaper, style);

  const handleCopy = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
              Generate Academic Citation
            </h3>
          </div>
          <button
            onClick={closeCitation}
            aria-label="Close citation modal"
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper title info */}
        <div className="px-5 py-3 bg-stone-50 dark:bg-slate-800/40 border-b border-stone-200 dark:border-slate-800 text-xs">
          <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">Title:</span>
          <p className="font-medium text-slate-800 dark:text-stone-200 mt-0.5 line-clamp-1">{citationPaper.title}</p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-2">
            <span>DOI: {citationPaper.doi}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Peer-Reviewed Article</span>
          </p>
        </div>

        {/* Style Selector */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Citation Standard
            </label>
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg">
              {(['APA', 'MLA', 'Chicago', 'BibTeX'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setStyle(fmt)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    style === fmt
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Formatted Citation Block */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Formatted Text
            </label>
            <div className="relative">
              <pre
                className={`w-full p-4 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-lg text-xs leading-relaxed text-slate-800 dark:text-stone-200 whitespace-pre-wrap select-all font-mono`}
              >
                {citationText}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-stone-50 dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <a
            href={`https://doi.org/${citationPaper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>Resolve DOI at CrossRef</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={closeCitation}
              className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
