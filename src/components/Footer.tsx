import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Check, ArrowRight, ShieldCheck, BookOpen, FileText } from 'lucide-react';
import BrandLogo from './BrandLogo';

export const Footer: React.FC = () => {
  const { navigateTo, subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeError('Please enter a valid email address.');
      return;
    }
    const success = subscribeNewsletter(email);
    if (success) {
      setIsSubscribed(true);
      setSubscribeError('');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-stone-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Callout Block */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-8 mb-16 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-xs">
              The Patriot Dispatch
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-2">
              Intellectual Clarity in an Unsettled Century
            </h3>
            <p className="text-sm text-stone-300 mb-6 leading-relaxed">
              Receive our weekly curated briefings, academic research preprints, and long-form essays delivered directly to your inbox. No advertising, no algorithmic clickbait.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 py-3 px-4 rounded-lg text-sm">
                <Check className="w-5 h-5" />
                <span>Thank you for subscribing. You have been added to the weekly editorial registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your institutional or personal email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            {subscribeError && <p className="text-rose-400 text-xs mt-2">{subscribeError}</p>}
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" withText={true} />
            <p className="text-xs uppercase tracking-widest text-amber-400 font-medium font-mono">
              Ideas. Knowledge. Truth.
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              An independent digital media and knowledge institution committed to scholarly depth, investigative rigor, and constructive public debate.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Editorial Charter Enforced</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Open Scholarly Access</span>
              </span>
            </div>
          </div>

          {/* Column 1: Editorial Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Sections
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigateTo('articles')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Lead Articles & Dispatches
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('research')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Academic Research Repository
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('books')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Digital E-Book Library
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('opinions')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Opinions & Columns
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('discussions')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Public Discussions & Q&A
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('profile')} className="text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer font-medium">
                  My Profile & Reading History
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Standards & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  About Our Charter
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('editorial-policy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Editorial & Fact-Check Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('editorial-policy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Peer Review Protocols
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Corrections & Revisions Log
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Author Submission Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Legal & Integrity
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Copyright & Takedown (DMCA)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('editorial-policy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Terms of Access
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('editorial-policy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Privacy & Data Rights
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Report Misinformation
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Contact the Bureau
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Demonstration Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 THE PATRIOT Publishing Trust. All rights reserved.</p>
          <p className="text-center sm:text-right text-stone-400">
            Independent Digital Media & Research Portal · Zurich & Washington Bureau
          </p>
        </div>
      </div>
    </footer>
  );
};
