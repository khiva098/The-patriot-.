import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BrandLogo from './BrandLogo';
import { UserRole } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  KeyRound,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  AtSign,
  Building,
  RefreshCw,
  HelpCircle,
  FileCheck,
  ArrowLeft,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithCredentials,
    registerUser,
    resetPassword,
  } = useApp();

  // Sign In inputs
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAffiliation, setRegAffiliation] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('reader');

  // Forgot Password inputs
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (mode: 'login' | 'register' | 'forgot_password') => {
    setAuthModalMode(mode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginWithCredentials(identifier, loginPassword);
      if (result.success) {
        setSuccessMessage('Credentials authenticated. Logging into LMS Portal...');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setIsSubmitting(false);
          setIdentifier('');
          setLoginPassword('');
        }, 500);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = registerUser(regName, regUsername, regEmail, regPassword, regAffiliation, regRole);
      if (result.success) {
        if (result.status === 'pending_verification') {
          setSuccessMessage(
            'Account registered! Reader privileges active. Your application for Author / Sub-Admin status is in Pending Verification status under Wahab Ali Khiva.'
          );
        } else {
          setSuccessMessage('Reader LMS account created successfully! Full access granted.');
        }
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setIsSubmitting(false);
          setRegName('');
          setRegUsername('');
          setRegEmail('');
          setRegPassword('');
          setRegAffiliation('');
          setRegRole('reader');
        }, 1200);
      } else {
        setErrorMessage(result.error || 'Registration failed.');
        setIsSubmitting(false);
      }
    }, 250);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetIdentifier.trim()) {
      setErrorMessage('Please enter your registered email address or username.');
      return;
    }

    if (resetNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMessage('New passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = resetPassword(resetIdentifier, resetNewPassword);
      if (result.success) {
        setSuccessMessage('Password reset successfully! You can now sign in with your new credentials.');
        setTimeout(() => {
          setIsSubmitting(false);
          setResetIdentifier('');
          setResetNewPassword('');
          setResetConfirmPassword('');
          handleTabSwitch('login');
        }, 1500);
      } else {
        setErrorMessage(result.error || 'Password reset failed.');
        setIsSubmitting(false);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 px-6 py-5 text-white border-b border-amber-900/40 relative shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 mb-2">
            <BrandLogo size="md" withText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest font-mono text-amber-400 font-bold">
                  The Patriot LMS Gateway
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
                  Sovereign RBAC
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                {authModalMode === 'login'
                  ? 'Sign In to Your LMS Account'
                  : authModalMode === 'register'
                  ? 'Join The Patriot Community'
                  : 'Reset Account Password'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {authModalMode === 'login'
              ? 'Enter with your verified email or username and password. Sovereign access control verifies permissions.'
              : authModalMode === 'register'
              ? 'Establish your reader profile or apply for author/sub-admin credentials under Wahab Ali Khiva.'
              : 'Recover your account access by verifying your email/username and updating security credentials.'}
          </p>
        </div>

        {/* Portal Mode Switcher */}
        <div className="bg-stone-50 dark:bg-slate-800/60 p-2 border-b border-stone-200 dark:border-slate-800 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-sm font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-sm font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Register Account</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('forgot_password')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authModalMode === 'forgot_password'
                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-sm font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Forgot Password</span>
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Status feedback alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: SIGN IN */}
          {/* ======================================================== */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-stone-100 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Sovereign Access Control Active</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  Sign in with your email or username and password. Author and administrative privileges are strictly governed by <strong>Wahab Ali Khiva</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="wahabalikhiva@gmail.com, appointed staff, or reader email"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('forgot_password')}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Sign In */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authenticate & Enter LMS</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: REGISTER ACCOUNT WITH PENDING VERIFICATION STATE */}
          {/* ======================================================== */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Sovereign Registration & Access Gate</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-slate-400 leading-relaxed">
                  Readers gain instant access. Users applying for <strong>Author Fellow</strong> or <strong>Sub-Admin</strong> status are granted Reader access immediately while their authority dossier enters <strong>Pending Verification</strong> status under Wahab Ali Khiva.
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Membership Clearance Request
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('reader')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      regRole === 'reader'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-600'
                        : 'border-stone-200 dark:border-slate-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Reader</span>
                      {regRole === 'reader' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      Instant Access
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('author')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      regRole === 'author'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-600'
                        : 'border-stone-200 dark:border-slate-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Author Fellow</span>
                      {regRole === 'author' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5 font-medium">
                      Pending Approval
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('editor')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      regRole === 'editor'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-600'
                        : 'border-stone-200 dark:border-slate-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Sub-Admin</span>
                      {regRole === 'editor' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5 font-medium">
                      Pending Approval
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      placeholder="e.g. sarah_j"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="sarah.jenkins@academic.org"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Create Password (minimum 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Affiliation {regRole !== 'reader' ? '(Required for verification)' : '(Optional)'}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required={regRole !== 'reader'}
                    value={regAffiliation}
                    onChange={e => setRegAffiliation(e.target.value)}
                    placeholder="e.g. Oxford Institute of Public Policy"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Registration...</span>
                  </span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>
                      {regRole === 'reader'
                        ? 'Create Reader LMS Account'
                        : `Register & Submit for ${regRole === 'editor' ? 'Sub-Admin' : 'Author'} Clearance`}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 3: FORGOT PASSWORD RESET */}
          {/* ======================================================== */}
          {authModalMode === 'forgot_password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-stone-100 mb-1">
                  <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Credential Reset & Security Restoration</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  Enter your registered email address or username and define your new secure password. Your account credentials will be updated immediately.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={e => setResetIdentifier(e.target.value)}
                    placeholder="wahabalikhiva@gmail.com, appointed staff, or reader email"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password (minimum 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={resetNewPassword}
                    onChange={e => setResetNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={resetConfirmPassword}
                    onChange={e => setResetConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              {/* Submit Password Reset */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting Credentials...</span>
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password & Restore Access</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-slate-800/40 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shrink-0">
          <div>
            {authModalMode === 'login' ? (
              <span>
                New reader?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </span>
            ) : authModalMode === 'register' ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Sign In Here
                </button>
              </span>
            ) : (
              <span>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
