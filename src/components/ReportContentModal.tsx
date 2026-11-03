import React, { useState } from 'react';
import { Flag, X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'comment' | 'article' | 'research' | 'ebook' | 'post';
  targetId: string;
  targetTitle?: string;
  targetSnippet?: string;
  authorName?: string;
  authorId?: string;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  targetSnippet,
  authorName,
  authorId,
}) => {
  const { reportContent, currentUser } = useApp();

  const [reason, setReason] = useState<
    'misinformation' | 'hate_speech' | 'plagiarism' | 'defamation' | 'spam' | 'other'
  >('misinformation');
  const [reasonDetails, setReasonDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonDetails.trim() || reasonDetails.trim().length < 5) {
      setError('Please provide a brief explanation (at least 5 characters) of the issue.');
      return;
    }

    reportContent({
      targetType,
      targetId,
      targetTitle: targetTitle || 'Scholarly Discourse Item',
      targetSnippet: targetSnippet || 'No excerpt provided',
      authorName: authorName || 'Unknown Contributor',
      authorId: authorId || 'unknown',
      reporterName: currentUser ? currentUser.name : 'Anonymous Scholarly Reader',
      reporterEmail: currentUser ? currentUser.email : undefined,
      reason,
      reasonDetails: reasonDetails.trim(),
    });

    setSubmitted(true);
    setError(null);
    setTimeout(() => {
      setSubmitted(false);
      setReasonDetails('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-stone-100 dark:bg-slate-800/80 border-b border-stone-200 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-base">
                Report Content for Moderation
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Routed directly to Master Administrator Wahab Ali Khiva's safety queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
              Report Successfully Logged
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
              Thank you for upholding the rigor and integrity of THE PATRIOT. The editorial bureau will review this submission immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Target snippet briefing */}
            {targetSnippet && (
              <div className="p-3 bg-stone-50 dark:bg-slate-950/60 rounded-xl border border-stone-200/70 dark:border-slate-800 text-xs">
                <span className="font-mono text-[10px] uppercase text-stone-400 block mb-1">
                  Reported {targetType} by {authorName || 'Author'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 italic line-clamp-2 font-serif">
                  "{targetSnippet}"
                </p>
              </div>
            )}

            {/* Violation category picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-stone-200 mb-1.5">
                Primary Reason for Report
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="misinformation">Misinformation / Unverified Empirical Claims</option>
                <option value="hate_speech">Hate Speech, Harassment or Targeted Abuse</option>
                <option value="plagiarism">Plagiarism / Intellectual Property Violation</option>
                <option value="defamation">Defamation or Personal Attacks</option>
                <option value="spam">Commercial Solicitation or Link Spam</option>
                <option value="other">Other Editorial Policy Breach</option>
              </select>
            </div>

            {/* Additional context textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-stone-200 mb-1.5">
                Details & Context
              </label>
              <textarea
                rows={3}
                value={reasonDetails}
                onChange={e => setReasonDetails(e.target.value)}
                placeholder="Explain why this material violates academic standards or community guidelines..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Submit Report to Sovereign Desk</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportContentModal;
