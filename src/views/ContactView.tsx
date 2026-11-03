import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validateTakedownRequest } from '../utils/pure_logic';
import { Mail, MapPin, Send, Check, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { submitTakedownReport } = useApp();

  // General contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Editorial Inquiry');
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // DMCA / Takedown form state
  const [pubTitle, setPubTitle] = useState('');
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [org, setOrg] = useState('');
  const [infringement, setInfringement] = useState('');
  const [declared, setDeclared] = useState(false);
  const [takedownErrors, setTakedownErrors] = useState<Record<string, string>>({});
  const [takedownSuccess, setTakedownSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setContactSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const handleTakedownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateTakedownRequest({
      publicationTitle: pubTitle,
      claimantName,
      claimantEmail,
      infringementDetails: infringement,
      declarationSigned: declared,
    });

    if (!result.isValid) {
      setTakedownErrors(result.errors);
      return;
    }

    submitTakedownReport({
      publicationTitle: pubTitle,
      claimantName,
      claimantEmail,
      organization: org,
      infringementDetails: infringement,
      declarationSigned: declared,
    });

    setTakedownSuccess(true);
    setTakedownErrors({});
    setPubTitle('');
    setClaimantName('');
    setClaimantEmail('');
    setOrg('');
    setInfringement('');
    setDeclared(false);
    setTimeout(() => setTakedownSuccess(false), 6000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      {/* Masthead */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-8 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Inquiries & Legal Bureau
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100">
          Contact & Editorial Submissions
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-300 leading-relaxed">
          Direct communication channels with our editorial desks, submission guidelines for authors, and formal copyright takedown requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left: Bureau Info & General Contact (7 cols) */}
        <div className="md:col-span-7 space-y-8">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 mb-2">
              Send a Dispatch to the Editors
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              For story tips, scholarly corrections, or pitch submissions, reach out through our encrypted editorial gateway.
            </p>

            {contactSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Your message has been securely submitted to the editorial desk. An editor will reply if your inquiry fits our charter.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Dr. Alexander Wright"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="wright@oxford.ac.uk"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Inquiry Nature
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="Editorial Inquiry">General Editorial Inquiry</option>
                    <option value="Research Submission">Research Paper Manuscript Pitch</option>
                    <option value="Factual Correction">Factual Correction Notice</option>
                    <option value="Institutional Access">Institutional Library Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Provide detailed background, primary documentation citations, or abstract..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-serif"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Bureau</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Bureau Locations & Author Submission Specs (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Bureau Locations
            </h3>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-stone-100">European Bureau:</strong>
                  <p>Rue du Rhône 42, 1204 Geneva, Switzerland</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-stone-100">North American Desk:</strong>
                  <p>1775 Pennsylvania Avenue NW, Washington, D.C. 20006</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-stone-100">Editorial Direct Line:</strong>
                  <p className="font-mono text-[11px]">desk@thepatriot.org</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Author Submission Guidelines</span>
            </h3>
            <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Analytical dispatches must range between 1,800 and 4,500 words.</li>
              <li>Academic research must include reproducible methodologies and BibTeX/DOI references.</li>
              <li>All claims must be referenced to primary sources.</li>
              <li>Dual submissions are strictly prohibited during the 14-day review window.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formal DMCA & Copyright Takedown Section */}
      <section className="pt-8 border-t border-stone-200 dark:border-slate-800 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100">
              DMCA & Copyright Takedown Complaint Portal
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            THE PATRIOT respects intellectual property rights. Rights holders or authorized legal representatives may submit formal notices of alleged infringement below.
          </p>
        </div>

        {takedownSuccess ? (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-5 h-5" />
            <div>
              <p className="font-bold">Copyright Complaint Received.</p>
              <p className="mt-0.5">Your filing has been logged into the compliance queue and assigned to legal counsel for review.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTakedownSubmit} className="bg-stone-50 dark:bg-slate-900 p-6 rounded-xl border border-stone-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Target Publication Title *
                </label>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={e => setPubTitle(e.target.value)}
                  placeholder="e.g. Monetary Statecraft"
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
                {takedownErrors.publicationTitle && (
                  <p className="text-rose-500 text-[11px] mt-1">{takedownErrors.publicationTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Claimant Legal Name *
                </label>
                <input
                  type="text"
                  value={claimantName}
                  onChange={e => setClaimantName(e.target.value)}
                  placeholder="Sarah Jenkins, Esq."
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
                {takedownErrors.claimantName && (
                  <p className="text-rose-500 text-[11px] mt-1">{takedownErrors.claimantName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Claimant Official Email *
                </label>
                <input
                  type="email"
                  value={claimantEmail}
                  onChange={e => setClaimantEmail(e.target.value)}
                  placeholder="legal@oxfordip.org"
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
                {takedownErrors.claimantEmail && (
                  <p className="text-rose-500 text-[11px] mt-1">{takedownErrors.claimantEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Representing Organization / Rights Holder
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Academic Publishing Trust LLC"
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Specific Infringement Description & Original Work Details *
              </label>
              <textarea
                value={infringement}
                onChange={e => setInfringement(e.target.value)}
                rows={4}
                placeholder="Describe the exact copyrighted work, specific passages or figures, and why publication on The Patriot is unauthorized (at least 20 characters)..."
                className="w-full p-3 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
              />
              {takedownErrors.infringementDetails && (
                <p className="text-rose-500 text-[11px] mt-1">{takedownErrors.infringementDetails}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={e => setDeclared(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span>
                  I affirm under penalty of perjury that I am the copyright owner or authorized to act on behalf of the owner, and that the information in this notice is accurate.
                </span>
              </label>
              {takedownErrors.declarationSigned && (
                <p className="text-rose-500 text-[11px]">{takedownErrors.declarationSigned}</p>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              Submit Formal Takedown Notice
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
