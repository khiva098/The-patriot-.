import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Comment, PublicationType } from '../types';
import { VerificationBadge } from './VerificationBadge';
import {
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ThumbsUp,
  CornerDownRight,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  Send,
  Sparkles,
} from 'lucide-react';

interface DiscussionThreadProps {
  publicationId: string;
  publicationType: PublicationType;
  publicationTitle: string;
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({
  publicationId,
  publicationType,
  publicationTitle,
}) => {
  const {
    comments,
    addComment,
    voteComment,
    resolveQuestion,
    deleteComment,
    moderateComment,
    role,
    currentUser,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'questions' | 'unanswered' | 'helpful'>('all');
  const [content, setContent] = useState('');
  const [isQuestionMode, setIsQuestionMode] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Publication-specific comments
  const pubComments = comments.filter(c => c.publicationId === publicationId);

  // Filtered
  const filteredComments = pubComments.filter(c => {
    if (filterMode === 'questions') return c.isQuestion;
    if (filterMode === 'unanswered') return c.isQuestion && !c.isResolved && (!c.replies || c.replies.length === 0);
    return true;
  }).sort((a, b) => {
    if (filterMode === 'helpful') return b.helpfulVotes - a.helpfulVotes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(publicationId, publicationType, content, isQuestionMode);
    setContent('');
    setIsQuestionMode(false);
  };

  const handlePostReply = (parentId: string) => {
    if (!replyText.trim()) return;
    addComment(publicationId, publicationType, replyText, false, parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  const isModeratorOrAuthor = role === 'administrator' || role === 'editor' || role === 'author';

  return (
    <section aria-label="Reader Discussions & Scholarly Inquiries" className="pt-12 border-t border-stone-200 dark:border-slate-800">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100">
              Reader Inquiries & Academic Discourse
            </h3>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Engage with authors and scholars. Questions can be marked as verified or resolved by editorial staff.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
          {[
            { id: 'all', label: `All (${pubComments.length})` },
            { id: 'questions', label: 'Questions' },
            { id: 'unanswered', label: 'Unanswered' },
            { id: 'helpful', label: 'Most Helpful' },
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
      </div>

      {/* Input Composer Box */}
      <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-5 mb-8 shadow-xs">
        <form onSubmit={handlePost} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {isQuestionMode ? 'Ask the Author / Researcher' : 'Share an Editorial Opinion'}
            </span>

            {/* Question Mode Switcher */}
            <button
              type="button"
              onClick={() => setIsQuestionMode(!isQuestionMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                isQuestionMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isQuestionMode ? 'Question Mode Active' : 'Switch to Question'}</span>
            </button>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            placeholder={
              isQuestionMode
                ? 'State your technical question clearly for the author or reviewer...'
                : 'Offer critical analysis, historical context, or thoughtful critique...'
            }
            className="w-full p-3 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600 transition-colors"
            required
          />

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-stone-400">
              Posting as: <strong className="text-slate-700 dark:text-stone-300">{currentUser ? currentUser.name : 'Guest Reader'}</strong> ({role})
            </p>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isQuestionMode ? 'Submit Question' : 'Post Reflection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-stone-200 dark:border-slate-800 rounded-xl">
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
              No comments match this filter.
            </p>
            <p className="text-xs text-stone-400 mt-1">Be the first to submit an inquiry or observation.</p>
          </div>
        ) : (
          filteredComments.map(c => {
            const isOwnComment = currentUser && c.author.id === currentUser.id;
            const isAuthorPost = c.author.isAuthorOfPublication;

            return (
              <div
                key={c.id}
                className={`p-5 rounded-xl border transition-colors ${
                  c.isQuestion
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/40'
                    : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800'
                }`}
              >
                {/* Author Info & Badges */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.author.avatar}
                      alt={c.author.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-stone-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs text-slate-900 dark:text-stone-100">
                          {c.author.name}
                        </span>

                        <VerificationBadge
                          tier={c.author.verificationTier || (isAuthorPost ? 'verified_scholar' : 'email_verified')}
                          details={c.author.verificationDetails}
                          authorName={c.author.name}
                          size="sm"
                        />

                        {isAuthorPost && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Author</span>
                          </span>
                        )}

                        {c.isQuestion && (
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${
                            c.isResolved
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}>
                            {c.isResolved ? '· Resolved Question' : '· Unanswered Inquiry'}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(c.createdAt).toLocaleDateString()} at{' '}
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Author / Admin */}
                  <div className="flex items-center gap-2">
                    {c.isQuestion && isModeratorOrAuthor && (
                      <button
                        onClick={() => resolveQuestion(c.id)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                          c.isResolved
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                        }`}
                        title="Toggle resolved answer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{c.isResolved ? 'Resolved' : 'Mark Resolved'}</span>
                      </button>
                    )}

                    {(isOwnComment || role === 'administrator') && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        aria-label="Delete comment"
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="mt-3 text-sm text-slate-800 dark:text-stone-200 leading-relaxed">
                  {c.content}
                </p>

                {/* Bottom Bar: Votes & Reply */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => voteComment(c.id)}
                      className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                        c.hasUserVoted
                          ? 'text-amber-700 dark:text-amber-400 font-semibold'
                          : 'hover:text-slate-900 dark:hover:text-stone-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{c.helpfulVotes} Helpful</span>
                    </button>

                    <button
                      onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                      className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-stone-200 cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>

                  <button
                    onClick={() => moderateComment(c.id, 'reported')}
                    className="text-stone-400 hover:text-rose-500 text-[11px] cursor-pointer"
                  >
                    Report
                  </button>
                </div>

                {/* Reply Form */}
                {replyingToId === c.id && (
                  <div className="mt-3 pl-4 border-l-2 border-amber-600 pt-2 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={2}
                      placeholder="Write an academic response or follow-up..."
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostReply(c.id)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded cursor-pointer"
                      >
                        Post Response
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Threaded Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div className="mt-4 pl-4 sm:pl-6 space-y-3 border-l border-stone-200 dark:border-slate-800">
                    {c.replies.map(r => (
                      <div
                        key={r.id}
                        className="bg-stone-50/70 dark:bg-slate-800/40 p-3.5 rounded-lg border border-stone-200/70 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-900 dark:text-stone-100">
                              {r.author.name}
                            </span>
                            <VerificationBadge
                              tier={r.author.verificationTier || (r.author.isAuthorOfPublication ? 'verified_scholar' : 'email_verified')}
                              details={r.author.verificationDetails}
                              authorName={r.author.name}
                              size="sm"
                            />
                            {r.author.isAuthorOfPublication && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Author Response</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-stone-300 leading-relaxed">
                          {r.content}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                          <button
                            onClick={() => voteComment(r.id)}
                            className="inline-flex items-center gap-1 hover:text-amber-600 cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{r.helpfulVotes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
