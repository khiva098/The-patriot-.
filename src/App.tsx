import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { CitationModal } from './components/CitationModal';
import { ReaderModal } from './components/ReaderModal';
import { VerificationModal } from './components/VerificationModal';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { HomeView } from './views/HomeView';
import { ArticlesView } from './views/ArticlesView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { ResearchView } from './views/ResearchView';
import { ResearchDetailView } from './views/ResearchDetailView';
import { BooksView } from './views/BooksView';
import { BookDetailView } from './views/BookDetailView';
import { OpinionsView } from './views/OpinionsView';
import { DiscussionsView } from './views/DiscussionsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView } from './views/AboutView';
import { EditorialPolicyView } from './views/EditorialPolicyView';
import { ContactView } from './views/ContactView';
import { ProfileView } from './views/ProfileView';
import { LMSPortalView } from './views/LMSPortalView';

const AppContent: React.FC = () => {
  const { activeView, isVerificationModalOpen, setIsVerificationModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-stone-100 transition-colors">
      {/* Top Announcement Strip */}
      <AnnouncementBar />

      {/* Primary Newspaper Header (Top Bar Contract) */}
      <Header />

      {/* Main Reading Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeView === 'home' && <HomeView />}
        {activeView === 'articles' && <ArticlesView />}
        {activeView === 'article-detail' && <ArticleDetailView />}
        {activeView === 'research' && <ResearchView />}
        {activeView === 'research-detail' && <ResearchDetailView />}
        {activeView === 'books' && <BooksView />}
        {activeView === 'book-detail' && <BookDetailView />}
        {activeView === 'lms' && <LMSPortalView />}
        {activeView === 'opinions' && <OpinionsView />}
        {activeView === 'discussions' && <DiscussionsView />}
        {activeView === 'profile' && <ProfileView />}
        {activeView === 'admin' && <AdminDashboardView />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'editorial-policy' && <EditorialPolicyView />}
        {activeView === 'contact' && <ContactView />}
      </main>

      {/* Institutional Broadside Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <GlobalSearchModal />
      <CitationModal />
      <ReaderModal />
      <AuthModal />
      <NotificationDrawer />
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
