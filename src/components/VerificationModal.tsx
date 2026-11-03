import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validateVerificationApplication } from '../utils/pure_logic';
import {
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Mail,
  X,
  Send,
  Building2,
  FileText,
  Check,
  Sparkles,
} from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, verifyUserEmail, submitVerificationApplication } = useApp();

  const [activeTab, setActiveTab] = useState<'email' | 'scholar'>('email');

  // Email verification state
  const [emailVerifiedSuccess, setEmailVerifiedSuccess] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // Scholar application state
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [institution, setInstitution] = useState(currentUser?.affiliation || '');
  const [academicTitle, setAcademicTitle] = useState('Senior Fellow / Faculty');
  const [department, setDepartment] = useState('Department of Strategic Studies');
  const [orcidOrProfileUrl, setOrcidOrProfileUrl] = useState('');
  const [credentialsStatement, setCredentialsStatement] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [scholarSubmitted, setScholarSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendEmailVerification = () => {
    setCodeSent(true);
    setEmailCode('749216'); // Simulated verification PIN
  };

  const handleConfirmEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      verifyUserEmail(currentUser.id);
    }
    setEmailVerifiedSuccess(true);
    setTimeout(() => {
      setEmailVerifiedSuccess(false);
      onClose();
    }, 2000);
  };

  const handleScholarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateVerificationApplication({
      applicantName,
      email,
      institution,
      academicTitle,
      department,
      credentialsStatement,
    });

    if (!result.isValid) {
      setFormErrors(result.errors);
      return;
    }

    submitVerificationApplication({
      userId: currentUser?.id || 'usr-reader',
      applicantName,
      email,
      requestedTier: 'verified_scholar',
      institution,
      academicTitle,
      department,
      orcidOrProfileUrl,
      credentialsStatement,
    });

    setScholarSubmitted(true);
    setFormErrors({});
    setTimeout(() => {
      setScholarSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                User Verification & Trust Attestation
              </h3>
              <p className="text-[11px] text-stone-500">
                Secure your profile identity and earn verified trust badges
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close verification modal"
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 border-b border-stone-100 dark:border-slate-800 flex gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>1. Email Verification (Readers)</span>
          </button>

          <button
            onClick={() => setActiveTab('scholar')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scholar'
                ? 'border-amber-600 text-amber-700 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>2. Scholar / Author Verification</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-stone-50 dark:bg-slate-800/40 rounded-xl border border-stone-200 dark:border-slate-700/60">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1">
                  <strong className="text-slate-900 dark:text-stone-100 font-semibold">
                    Verified Reader Trust Badge
                  </strong>
                  <p>
                    Confirms your email address to enable commenting, asking questions to researchers, and receiving editorial alerts.
                  </p>
                </div>
              </div>

              {emailVerifiedSuccess ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Email successfully verified! Your Verified Reader badge is now active across all content.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || 'reader@thepatriot.org'}
                      className="w-full p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-stone-600 dark:text-stone-300"
                    />
                  </div>

                  {!codeSent ? (
                    <button
                      onClick={handleSendEmailVerification}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Send Verification Code
                    </button>
                  ) : (
                    <form onSubmit={handleConfirmEmailVerification} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                          Enter 6-Digit Verification PIN (Demo code: 749216)
                        </label>
                        <input
                          type="text"
                          value={emailCode}
                          onChange={e => setEmailCode(e.target.value)}
                          placeholder="749216"
                          className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-sm font-mono tracking-widest text-center text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Confirm Email & Activate Badge
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'scholar' && (
            <div>
              {scholarSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>
                    Scholarly verification application received. The Patriot Editorial Bureau reviews academic credentials within 48 hours.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleScholarSubmit} className="space-y-3.5 text-xs">
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded-xl text-blue-900 dark:text-blue-300 text-[11px] leading-relaxed">
                    <strong>Peer-Attested Scholar & Author Verification:</strong> Reserved for university faculty, research fellows, and verified institutional policy experts. Grants the gold Scholar Emblem and author reply privileges.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Scholar Full Name *
                      </label>
                      <input
                        type="text"
                        value={applicantName}
                        onChange={e => setApplicantName(e.target.value)}
                        placeholder="Dr. Tariq Al-Mansoor"
                        className="w-full p-2 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      />
                      {formErrors.applicantName && (
                        <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.applicantName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="almansoor@isg.org"
                        className="w-full p-2 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      />
                      {formErrors.email && (
                        <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Affiliated Institution / University *
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        placeholder="Institute for Sovereign Geopolitics"
                        className="w-full p-2 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      />
                      {formErrors.institution && (
                        <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.institution}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Academic / Professional Title *
                      </label>
                      <input
                        type="text"
                        value={academicTitle}
                        onChange={e => setAcademicTitle(e.target.value)}
                        placeholder="Senior Fellow in Strategic Studies"
                        className="w-full p-2 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      />
                      {formErrors.academicTitle && (
                        <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.academicTitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        Department / Research Division *
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder="Monetary Statecraft Directorate"
                        className="w-full p-2 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                      />
                      {formErrors.department && (
                        <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.department}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                        ORCID ID or Faculty Profile URL
                      </label>
                      <input
                        type="text"
                        value={orcidOrProfileUrl}
                        onChange={e => setOrcidOrProfileUrl(e.target.value)}
                        placeholder="0000-0002-1825-0097 or https://isg.org/scholars/almansoor"
                        className="w-full p-2 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Credentials & Recent Scholarly Publications (Min 30 chars) *
                    </label>
                    <textarea
                      value={credentialsStatement}
                      onChange={e => setCredentialsStatement(e.target.value)}
                      rows={3}
                      placeholder="Outline your research focus, doctoral qualifications, and major recent papers or monographs..."
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                    />
                    {formErrors.credentialsStatement && (
                      <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.credentialsStatement}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Academic Credentials for Verification</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
