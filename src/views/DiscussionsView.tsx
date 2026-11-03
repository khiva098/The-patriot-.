import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ThumbsUp,
  Search,
  ArrowRight,
  ShieldCheck,
  CornerDownRight,
} from 'lucide-react';

export const DiscussionsView: React.FC = () => {
  const { comments, voteComment, navigateTo } = useApp();
  const [filterMode, setFilterMode] = useState<'all' | 'unanswered' | 'resolved' | 'helpful'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComments = comments.filter(c => {
    if (filterMode === 'unanswered') return c.isQuestion && !c.isResolved && (!c.replies || c.replies.length === 0);
    if (filterMode === 'resolved') return c.isQuestion && c.isResolved;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.content.toLowerCase().includes(q) || c.author.name.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (filterMode === 'helpful') return b.helpfulVotes - a.helpfulVotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="py-8 space-y-10">
      {/* Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          The Reader Forum
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100 mt-1 mb-3">
          Public Inquiries & Scholarly Discourse
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-base max-w-2xl font-serif leading-relaxed">
          Explore discussions, technical inquiries, and author clarifications attached to articles, research papers, and books across The Patriot.
        </p>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
            {[
              { id: 'all', label: `All Inquiries (${comments.length})` },
              { id: 'unanswered', label: 'Unanswered Questions' },
              { id: 'resolved', label: 'Resolved Inquiries' },
              { id: 'helpful', label: 'Most Upvoted' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id as any)}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterMode === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search inquiries or scholars..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>
      </div>

      {/* List of Discussion Threads */}
      <div className="space-y-4">
        {filteredComments.map(c => {
          const targetView =
            c.publicationType === 'article'
              ? 'article-detail'
              : c.publicationType === 'research'
              ? 'research-detail'
              : 'book-detail';

          return (
            <div
              key={c.id}
              className={`p-6 rounded-xl border transition-colors ${
                c.isQuestion
                  ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40'
                  : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                    Attached to {c.publicationType}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  {c.isQuestion && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className={`font-bold uppercase text-[10px] ${
                        c.isResolved ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>
                        {c.isResolved ? 'Resolved Question' : 'Unanswered Question'}
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => navigateTo(targetView, c.publicationId)}
                  className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  <span>View Original Publication</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Author & Question */}
              <div className="flex items-start gap-3 mt-3">
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-stone-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-stone-100">
                      {c.author.name}
                    </span>
                    {c.author.isAuthorOfPublication && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Author</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-serif text-slate-800 dark:text-stone-200 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>

              {/* Thread metrics & upvote */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => voteComment(c.id)}
                    className="inline-flex items-center gap-1 hover:text-amber-600 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{c.helpfulVotes} Helpful</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-stone-400" />
                    <span>{c.replies?.length || 0} Responses</span>
                  </span>
                </div>

                <button
                  onClick={() => navigateTo(targetView, c.publicationId)}
                  className="text-stone-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-stone-100 font-medium cursor-pointer"
                >
                  Join Conversation
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
