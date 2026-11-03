import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from './VerificationBadge';
import {
  Search,
  Moon,
  Sun,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Menu,
  X,
  Bookmark,
  ChevronDown,
  History,
  Bell,
  GraduationCap,
  Lock,
  LogOut,
} from 'lucide-react';
import { UserRole } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import BrandLogo from './BrandLogo';

export const Header: React.FC = () => {
  const {
    activeView,
    navigateTo,
    darkMode,
    toggleDarkMode,
    setIsSearchOpen,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    role,
    setRole,
    currentUser,
    logout,
    bookmarks,
    readingHistory,
    unreadNotificationsCount,
    setIsNotificationsDrawerOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState('Karachi');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'articles', label: 'Articles' },
    { id: 'research', label: 'Research' },
    { id: 'books', label: 'E-Books' },
    { id: 'lms', label: 'LMS Academy' },
    { id: 'opinions', label: 'Opinions' },
    { id: 'discussions', label: 'Discussions' },
  ];



  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors">
      {/* Editorial Masthead Ribbon (Dawn Broadsheet Style) */}
      <div className="border-b border-stone-100 dark:border-slate-800/60 text-[11px] text-stone-500 dark:text-stone-400 py-1.5 px-4 sm:px-6 lg:px-8 hidden md:block bg-stone-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: City Editions (Dawn Standard) */}
          <div className="flex items-center gap-3">
            <span className="font-serif font-semibold text-slate-800 dark:text-stone-200">Edition:</span>
            <div className="flex items-center gap-1.5">
              {['Karachi', 'Islamabad', 'Lahore', 'Geneva', 'Washington'].map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedEdition(city)}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[10px] font-medium ${
                    selectedEdition === city
                      ? 'bg-amber-600 text-white font-bold'
                      : 'hover:text-slate-900 dark:hover:text-stone-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">|</span>
            <span className="font-serif italic">Wednesday, October 21, 2026</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">|</span>
            {/* Live Financial / Weather Index (Dawn Standard) */}
            <div className="flex items-center gap-2 font-mono text-[10px] text-stone-600 dark:text-stone-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">KSE-100 89,420 ▲ +0.8%</span>
              <span>·</span>
              <span>Gold $2,735/oz</span>
              <span>·</span>
              <span>{selectedEdition} 26°C Clear</span>
            </div>
          </div>

          {/* Right: Platform Credo & Quick Links */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('opinions')}
              className="text-amber-700 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Letters to Editor
            </button>
            <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">·</span>
            <button
              onClick={() => navigateTo('profile')}
              className="inline-flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
              title="View your reading history and profile"
            >
              <History className="w-3 h-3 text-amber-600" />
              <span>Reading History {readingHistory.length > 0 && `(${readingHistory.length})`}</span>
            </button>
            {bookmarks.length > 0 && (
              <>
                <span aria-hidden="true" className="text-stone-300 dark:text-slate-700">·</span>
                <button
                  onClick={() => navigateTo('profile')}
                  className="inline-flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
                  title="View saved bookmarks"
                >
                  <Bookmark className="w-3 h-3 text-amber-600" />
                  <span>{bookmarks.length} Saved</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav) - Zone 3 (Primary Action / Utilities) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Sovereign "P" Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
              aria-label="THE PATRIOT Homepage"
            >
              <BrandLogo size="md" withText={true} />
            </button>
          </div>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = activeView === link.id || 
                (link.id === 'articles' && activeView === 'article-detail') || 
                (link.id === 'research' && activeView === 'research-detail') || 
                (link.id === 'books' && activeView === 'book-detail') ||
                (link.id === 'lms' && activeView === 'lms');
              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-slate-900 dark:text-stone-100 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-600 dark:after:bg-amber-400'
                      : 'text-stone-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Global Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search articles, research, and books"
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Global Notification Bell with Unread Badge */}
            <button
              onClick={() => setIsNotificationsDrawerOpen(true)}
              aria-label={`Open notifications (${unreadNotificationsCount} unread)`}
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
                </span>
              )}
            </button>

            {/* Dark / Light Reading Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark reading mode'}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* PWA In-App Install Button */}
            <PWAInstallButton />

            {/* Authentication Gateway & Profile */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  title="Sign in with your LMS credentials"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-stone-300 transition-all cursor-pointer"
                  title="Register for a Reader LMS Account"
                >
                  <span>Register</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Direct Bureau CTA for Master Admin & Editor */}
                {(role === 'administrator' || role === 'editor') && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      activeView === 'admin'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-900 text-stone-100 hover:bg-slate-800 dark:bg-stone-100 dark:text-slate-900 dark:hover:bg-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Bureau</span>
                  </button>
                )}

                {/* Authenticated Account Menu */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs text-stone-800 dark:text-stone-200 hover:border-amber-500 transition-colors cursor-pointer"
                    aria-expanded={roleMenuOpen}
                    aria-label="User Account Menu"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-500"
                      />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                    <div className="flex flex-col text-left leading-tight hidden sm:flex">
                      <span className="font-semibold text-xs truncate max-w-[120px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        {role === 'administrator'
                          ? 'Master Admin'
                          : role === 'author'
                          ? 'Author Fellow'
                          : role === 'editor'
                          ? 'Senior Editor'
                          : 'Scholarly Reader'}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>

                  {roleMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-stone-200 dark:border-slate-700 py-2 z-50 animate-fadeIn"
                    >
                      {/* User Identity Header */}
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-slate-700 bg-stone-50/60 dark:bg-slate-800/80">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {currentUser.name}
                          </span>
                          {currentUser.verificationTier && currentUser.verificationTier !== 'none' && (
                            <VerificationBadge
                              tier={currentUser.verificationTier}
                              details={currentUser.verificationDetails}
                              size="sm"
                            />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {currentUser.email}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>
                            {role === 'administrator'
                              ? 'Sovereign Administrator'
                              : role === 'author'
                              ? 'Appointed Author Fellow'
                              : role === 'editor'
                              ? 'Appointed Senior Editor'
                              : 'Registered Scholarly Reader'}
                          </span>
                        </div>
                      </div>

                      {/* Authorized Navigation Actions */}
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            navigateTo('profile');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <History className="w-4 h-4 text-amber-600" />
                            <span>Reading History & Profile</span>
                          </span>
                          {readingHistory.length > 0 && (
                            <span className="bg-amber-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                              {readingHistory.length}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            navigateTo('lms');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 text-amber-600" />
                          <span>LMS Academy Masterclasses</span>
                        </button>

                        {(role === 'administrator' || role === 'editor') && (
                          <button
                            onClick={() => {
                              setRoleMenuOpen(false);
                              navigateTo('admin');
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span>Sovereign Bureau & Publishing</span>
                          </button>
                        )}
                      </div>

                      {/* Sign Out */}
                      <div className="pt-2 border-t border-stone-100 dark:border-slate-700 px-2">
                        <button
                          onClick={() => {
                            setRoleMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-stone-600 dark:text-stone-300 lg:hidden rounded hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 transition-colors">
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  navigateTo(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded text-sm font-medium cursor-pointer ${
                  activeView === link.id
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigateTo('profile');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded text-sm font-medium flex items-center justify-between cursor-pointer ${
                activeView === 'profile'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                <span>Reading History & Profile</span>
              </span>
              {readingHistory.length > 0 && (
                <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-mono">
                  {readingHistory.length}
                </span>
              )}
            </button>
            {(role === 'administrator' || role === 'editor') && (
              <button
                onClick={() => {
                  navigateTo('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}
            <div className="border-t border-stone-200 dark:border-slate-800 pt-3 mt-2 flex flex-col gap-2">
              {!currentUser ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 px-3 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 px-3 rounded border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center cursor-pointer"
                  >
                    <span>Register Reader</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({currentUser.name})</span>
                </button>
              )}
              <div className="flex flex-col gap-1 text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-slate-800">
                <button onClick={() => { navigateTo('about'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-stone-900 cursor-pointer">About Us</button>
                <button onClick={() => { navigateTo('editorial-policy'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-stone-900 cursor-pointer">Editorial Policy</button>
                <button onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }} className="text-left py-1 hover:text-stone-900 cursor-pointer">Contact & Submissions</button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
