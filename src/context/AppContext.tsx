import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Announcement,
  Article,
  Comment,
  EBook,
  NewsletterSubscriber,
  ReadingHistoryItem,
  ReadingPublicationType,
  ResearchPaper,
  TakedownReport,
  User,
  UserRole,
  VerificationApplication,
  VerificationDetails,
  VerificationTier,
  StaffMember,
  StaffAuditLog,
  LetterToTheEditor,
  LMSCourse,
  LMSUserProgress,
  AppNotification,
  BreakingNewsItem,
  RegisteredUser,
  ContentReport,
  PublicationRequest,
} from '../types';
import {
  CURRENT_USER_PROFILES,
  INITIAL_ANNOUNCEMENT,
  INITIAL_ARTICLES,
  INITIAL_COMMENTS,
  INITIAL_EBOOKS,
  INITIAL_RESEARCH_PAPERS,
  INITIAL_VERIFICATION_APPLICATIONS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_STAFF_AUDIT_LOGS,
  INITIAL_LETTERS,
  INITIAL_LMS_COURSES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_USER_CREDENTIALS,
  INAUGURAL_LAUNCH_ARTICLES,
  INAUGURAL_LAUNCH_RESEARCH,
  INAUGURAL_LAUNCH_EBOOKS,
  INITIAL_BREAKING_NEWS,
  INITIAL_CONTENT_REPORTS,
  INITIAL_PUBLICATION_REQUESTS,
} from '../data/mockData';
import { generatePasswordRecoveryToken, canUserSubmitPublication } from '../utils/pure_logic';

interface AppContextType {
  // Authentication & Roles
  currentUser: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;

  // Appearance
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Navigation
  activeView: string;
  activeDetailId: string | null;
  navigateTo: (view: string, detailId?: string) => void;

  // Content state
  articles: Article[];
  researchPapers: ResearchPaper[];
  ebooks: EBook[];
  announcement: Announcement;
  setAnnouncement: (announcement: Announcement) => void;

  // Publications mutations
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  addResearchPaper: (paper: ResearchPaper) => void;
  updateResearchPaper: (id: string, updates: Partial<ResearchPaper>) => void;
  deleteResearchPaper: (id: string) => void;

  addEBook: (book: EBook) => void;
  updateEBook: (id: string, updates: Partial<EBook>) => void;
  deleteEBook: (id: string) => void;

  // Sovereign Catalog Launch Operations (Owner: Wahab Ali Khiva)
  clearAllPublications: () => void;
  loadInauguralEdition: () => void;

  // CNN & BBC Style Live Breaking News Dispatch System
  breakingNews: BreakingNewsItem[];
  addBreakingNews: (item: Omit<BreakingNewsItem, 'id'>) => void;
  removeBreakingNews: (id: string) => void;

  // Comments & Discussions
  comments: Comment[];
  addComment: (
    pubId: string,
    pubType: 'article' | 'research' | 'ebook' | 'opinion',
    content: string,
    isQuestion: boolean,
    parentId?: string
  ) => void;
  voteComment: (commentId: string) => void;
  resolveQuestion: (commentId: string) => void;
  moderateComment: (commentId: string, status: 'approved' | 'reported') => void;
  deleteComment: (commentId: string) => void;

  // Bookmarks
  bookmarks: string[];
  toggleBookmark: (publicationId: string) => void;
  isBookmarked: (publicationId: string) => boolean;

  // Reading History (Recently Viewed & Progress Tracking)
  readingHistory: ReadingHistoryItem[];
  recordReadingProgress: (item: {
    publicationId: string;
    publicationType: ReadingPublicationType;
    title: string;
    subtitle?: string;
    authorName: string;
    categoryOrDiscipline?: string;
    coverImage?: string;
    progress: number;
    totalTimeMinutes?: number;
    slug?: string;
  }) => void;
  removeReadingHistoryItem: (id: string) => void;
  clearReadingHistory: () => void;
  resumeReading: (item: ReadingHistoryItem) => void;

  // Modals & Tools
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;

  readingItem: { type: 'ebook' | 'research'; data: EBook | ResearchPaper } | null;
  openReader: (type: 'ebook' | 'research', data: EBook | ResearchPaper) => void;
  closeReader: () => void;

  citationPaper: ResearchPaper | null;
  openCitation: (paper: ResearchPaper) => void;
  closeCitation: () => void;

  // User Verification & Trust System
  verificationApplications: VerificationApplication[];
  verifyUserEmail: (userId: string) => void;
  submitVerificationApplication: (data: Omit<VerificationApplication, 'id' | 'submittedAt' | 'status'>) => void;
  reviewVerification: (appId: string, status: 'approved' | 'rejected', reviewerNotes?: string) => void;

  // Takedowns & Moderation
  takedownReports: TakedownReport[];
  submitTakedownReport: (data: Omit<TakedownReport, 'id' | 'submittedAt' | 'status'>) => void;
  updateTakedownStatus: (id: string, status: TakedownReport['status']) => void;

  // Newsletter
  subscribers: NewsletterSubscriber[];
  subscribeNewsletter: (email: string, topics?: string[]) => boolean;

  // Staff Governance & Sovereign Access Control (Owner: Wahab Ali Khiva)
  staffMembers: StaffMember[];
  staffAuditLogs: StaffAuditLog[];
  isMasterAdmin: boolean;
  appointStaffMember: (data: Omit<StaffMember, 'id' | 'appointedBy' | 'appointedAt'>) => { success: boolean; error?: string };
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => { success: boolean; error?: string };
  removeStaffMember: (id: string) => { success: boolean; error?: string };

  // Letters to the Editor (Dawn-style Reader Column)
  letters: LetterToTheEditor[];
  submitLetterToEditor: (data: Omit<LetterToTheEditor, 'id' | 'submittedAt' | 'status'>) => void;
  updateLetterStatus: (id: string, status: LetterToTheEditor['status'], editorialResponse?: string) => void;

  // Separate Name/Email/Password Authentication System
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot_password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password') => void;
  loginWithCredentials: (identifier: string, password: string, selectedRole?: UserRole) => { success: boolean; error?: string };
  registerUser: (name: string, username: string, email: string, password: string, affiliation?: string, selectedRole?: UserRole) => { success: boolean; error?: string; status?: 'active' | 'pending_verification' };
  resetPassword: (identifier: string, newPassword: string) => { success: boolean; error?: string };
  registeredUsers: RegisteredUser[];

  // Explicit Content Management & Master Admin Approval Gate
  approvePublication: (id: string, type: 'article' | 'research' | 'ebook', reviewNotes?: string) => { success: boolean; error?: string };
  rejectPublication: (id: string, type: 'article' | 'research' | 'ebook', reason: string) => { success: boolean; error?: string };
  featurePublicationOnFrontPage: (id: string, type: 'article' | 'research' | 'ebook', featured: boolean) => void;
  updatePublicationPhotos: (
    id: string,
    type: 'article' | 'research' | 'ebook',
    photoData: { url: string; caption?: string; credit?: string; isFrontPageFeatured?: boolean }
  ) => void;

  // LMS Portal (Reader, Author, Admin)
  courses: LMSCourse[];
  userProgress: Record<string, LMSUserProgress>;
  enrollCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string, quizScore?: number) => void;
  addCourse: (course: LMSCourse) => void;
  updateCourse: (id: string, updates: Partial<LMSCourse>) => void;

  // Universal Notification System
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;

  // Publication Requests & Approvals (Master Administrator Mandate)
  publicationRequests: PublicationRequest[];
  pendingPublicationRequestsCount: number;
  submitPublicationRequest: (request: Omit<PublicationRequest, 'id' | 'submittedAt' | 'status'>) => { success: boolean; error?: string };
  reviewPublicationRequest: (requestId: string, decision: 'approved' | 'rejected', notes?: string) => { success: boolean; error?: string };

  // Comprehensive Content Moderation & User Blocking
  contentReports: ContentReport[];
  pendingReportsCount: number;
  reportContent: (data: Omit<ContentReport, 'id' | 'submittedAt' | 'status'>) => void;
  resolveReport: (
    reportId: string,
    action: 'dismissed' | 'content_edited' | 'content_deleted' | 'user_blocked',
    updatedContent?: string
  ) => void;
  blockedUsers: string[];
  blockUser: (userIdOrEmail: string) => void;
  unblockUser: (userIdOrEmail: string) => void;
  isUserBlocked: (userIdOrEmail?: string) => boolean;

  // Author Verification Desk
  verifiedAuthors: string[];
  toggleAuthorVerification: (authorIdOrEmail: string) => void;
  isAuthorVerified: (authorIdOrEmail?: string) => boolean;

  // Password Recovery Enhancements
  generatePasswordRecoveryLink: (identifier: string) => { token: string; url: string; expiresAt: string };
  sendPasswordRecoveryEmail: (identifier: string) => { success: boolean; message: string };

  // Direct APK Modal & In-App Reporting Modals
  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;
  reportingTarget: {
    isOpen: boolean;
    targetType: 'comment' | 'article' | 'research' | 'ebook' | 'post';
    targetId: string;
    targetTitle?: string;
    targetSnippet?: string;
    authorName?: string;
    authorId?: string;
  } | null;
  openReportModal: (target: {
    targetType: 'comment' | 'article' | 'research' | 'ebook' | 'post';
    targetId: string;
    targetTitle?: string;
    targetSnippet?: string;
    authorName?: string;
    authorId?: string;
  }) => void;
  closeReportModal: () => void;
}

const INITIAL_READING_HISTORY: ReadingHistoryItem[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & User - Default to visitor unless authenticated session exists in localStorage
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role && parsed.role !== 'visitor') {
          return parsed.role;
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth session role', e);
    }
    return 'visitor';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user) {
          return parsed.user;
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth session user', e);
    }
    return null;
  });

  // Synchronize authenticated session to localStorage
  useEffect(() => {
    try {
      if (role === 'visitor' || !currentUser) {
        localStorage.removeItem('the_patriot_auth_session');
      } else {
        localStorage.setItem(
          'the_patriot_auth_session',
          JSON.stringify({ role, user: currentUser })
        );
      }
    } catch (e) {
      console.warn('Failed to persist auth session', e);
    }
  }, [role, currentUser]);

  // Dark reading mode
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Navigation with deep linking support for thepatriot.org
  const [activeView, setActiveView] = useState<string>(() => {
    try {
      const path = window.location.pathname.replace(/^\/+/, '').split('/');
      const params = new URLSearchParams(window.location.search);
      if (params.get('view')) return params.get('view')!;
      if (path[0]) {
        if (path[0] === 'article' && path[1]) return 'article-detail';
        if (path[0] === 'research' && path[1]) return 'research-detail';
        if (path[0] === 'book' && path[1]) return 'book-detail';
        return path[0];
      }
    } catch {
      // fallback to home
    }
    return 'home';
  });

  const [activeDetailId, setActiveDetailId] = useState<string | null>(() => {
    try {
      const path = window.location.pathname.replace(/^\/+/, '').split('/');
      const params = new URLSearchParams(window.location.search);
      if (params.get('id')) return params.get('id');
      if (path[1] && (path[0] === 'article' || path[0] === 'research' || path[0] === 'book')) {
        return path[1];
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Publications data (persisted in localStorage, defaults to empty pristine launch catalog)
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_articles');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load articles from localStorage', e);
    }
    return INITIAL_ARTICLES; // []
  });

  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_research_papers');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load research papers from localStorage', e);
    }
    return INITIAL_RESEARCH_PAPERS; // []
  });

  const [ebooks, setEBooks] = useState<EBook[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_ebooks');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load ebooks from localStorage', e);
    }
    return INITIAL_EBOOKS; // []
  });

  // Synchronize publications state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_articles', JSON.stringify(articles));
    } catch (e) {
      console.warn('Failed to persist articles', e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_research_papers', JSON.stringify(researchPapers));
    } catch (e) {
      console.warn('Failed to persist research papers', e);
    }
  }, [researchPapers]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_ebooks', JSON.stringify(ebooks));
    } catch (e) {
      console.warn('Failed to persist ebooks', e);
    }
  }, [ebooks]);

  // Sanitize legacy sample publications if present in client localStorage from previous sessions
  useEffect(() => {
    try {
      const artStr = localStorage.getItem('the_patriot_articles');
      if (artStr) {
        const parsed = JSON.parse(artStr);
        if (Array.isArray(parsed) && parsed.some(a => a.id === 'art-1' || a.id === 'art-2')) {
          localStorage.setItem('the_patriot_articles', JSON.stringify([]));
          setArticles([]);
        }
      }
      const resStr = localStorage.getItem('the_patriot_research_papers');
      if (resStr) {
        const parsed = JSON.parse(resStr);
        if (Array.isArray(parsed) && parsed.some(r => r.id === 'res-1' || r.id === 'res-2')) {
          localStorage.setItem('the_patriot_research_papers', JSON.stringify([]));
          setResearchPapers([]);
        }
      }
      const ebStr = localStorage.getItem('the_patriot_ebooks');
      if (ebStr) {
        const parsed = JSON.parse(ebStr);
        if (Array.isArray(parsed) && parsed.some(b => b.id === 'bk-1' || b.id === 'bk-2')) {
          localStorage.setItem('the_patriot_ebooks', JSON.stringify([]));
          setEBooks([]);
        }
      }
      const histStr = localStorage.getItem('the_patriot_reading_history');
      if (histStr) {
        const parsed = JSON.parse(histStr);
        if (Array.isArray(parsed) && parsed.some(h => h.id === 'hist-art-1' || h.publicationId === 'art-1')) {
          localStorage.setItem('the_patriot_reading_history', JSON.stringify([]));
          setReadingHistory([]);
        }
      }
    } catch (e) {
      console.warn('Cleanup check error', e);
    }
  }, []);

  // CNN & BBC Style Breaking News Ticker Dispatches
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_breaking_news');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load breaking news', e);
    }
    return INITIAL_BREAKING_NEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_breaking_news', JSON.stringify(breakingNews));
    } catch (e) {
      console.warn('Failed to persist breaking news', e);
    }
  }, [breakingNews]);

  const addBreakingNews = (item: Omit<BreakingNewsItem, 'id'>) => {
    const newItem: BreakingNewsItem = {
      ...item,
      id: `brk-${Date.now()}`,
    };
    setBreakingNews(prev => [newItem, ...prev]);
  };

  const removeBreakingNews = (id: string) => {
    setBreakingNews(prev => prev.filter(b => b.id !== id));
  };

  // Sovereign Catalog Launch Operations (Owner: Wahab Ali Khiva)
  const clearAllPublications = () => {
    setArticles([]);
    setResearchPapers([]);
    setEBooks([]);
    try {
      localStorage.setItem('the_patriot_articles', JSON.stringify([]));
      localStorage.setItem('the_patriot_research_papers', JSON.stringify([]));
      localStorage.setItem('the_patriot_ebooks', JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear publications in localStorage', e);
    }
    addNotification({
      title: 'Publications Cleared for Launch',
      message: 'All previous articles, research papers, and e-books have been cleared. Platform is ready for launch dispatches.',
      category: 'system_security',
    });
  };

  const loadInauguralEdition = () => {
    setArticles(INAUGURAL_LAUNCH_ARTICLES);
    setResearchPapers(INAUGURAL_LAUNCH_RESEARCH);
    setEBooks(INAUGURAL_LAUNCH_EBOOKS);
    try {
      localStorage.setItem('the_patriot_articles', JSON.stringify(INAUGURAL_LAUNCH_ARTICLES));
      localStorage.setItem('the_patriot_research_papers', JSON.stringify(INAUGURAL_LAUNCH_RESEARCH));
      localStorage.setItem('the_patriot_ebooks', JSON.stringify(INAUGURAL_LAUNCH_EBOOKS));
    } catch (e) {
      console.warn('Failed to load inaugural edition to localStorage', e);
    }
    addNotification({
      title: 'Inaugural Launch Edition Deployed',
      message: 'Official launch edition dispatches loaded under Wahab Ali Khiva and verified fellows.',
      category: 'new_publication',
    });
  };

  const [announcement, setAnnouncement] = useState<Announcement>(INITIAL_ANNOUNCEMENT);

  // Discussions
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(['art-1']);

  // Reading History (persisted in localStorage)
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_reading_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load reading history from localStorage', e);
    }
    return INITIAL_READING_HISTORY;
  });

  // Sync reading history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_reading_history', JSON.stringify(readingHistory));
    } catch (e) {
      console.warn('Failed to persist reading history to localStorage', e);
    }
  }, [readingHistory]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [readingItem, setReadingItem] = useState<{ type: 'ebook' | 'research'; data: EBook | ResearchPaper } | null>(null);
  const [citationPaper, setCitationPaper] = useState<ResearchPaper | null>(null);

  // User Verification Applications
  const [verificationApplications, setVerificationApplications] = useState<VerificationApplication[]>(INITIAL_VERIFICATION_APPLICATIONS);

  // Legal / Takedowns
  const [takedownReports, setTakedownReports] = useState<TakedownReport[]>([
    {
      id: 'rep-001',
      publicationTitle: 'Monetary Statecraft',
      claimantName: 'Sarah Jenkins, Esq.',
      claimantEmail: 's.jenkins@oxfordip.org',
      organization: 'Academic IP Protections LLC',
      infringementDetails: 'Inquiry into licensing verification for chapter 4 historical figures and trade clearance records.',
      declarationSigned: true,
      submittedAt: '2026-04-01T11:20:00Z',
      status: 'under_review',
    },
  ]);

  // Newsletter
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([
    { id: 'sub-1', email: 'wahabalikhiva@gmail.com', topics: ['Geopolitics', 'Quantum', 'Books'], subscribedAt: '2026-03-01' },
    { id: 'sub-2', email: 'h.munir@diplomacy.gov', topics: ['Geopolitics'], subscribedAt: '2026-03-12' },
  ]);

  // Staff Governance & Sovereign Access Control (Owner: Wahab Ali Khiva)
  // Master Administrator explicitly requested: "Remove all the staff members"
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    try {
      localStorage.removeItem('the_patriot_staff_members'); // Clean purge of legacy staff
    } catch (e) {
      console.warn('Failed to purge staff members', e);
    }
    return [];
  });

  // Registered LMS Accounts (Sovereign Administrator Wahab Ali Khiva, Hired Authority Staff, Registered Readers)
  // Master Administrator requested: "change my password as 'khiva666'"
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const defaultMasterAdmin: RegisteredUser = {
      id: 'usr-admin-wahab',
      name: 'Wahab Ali Khiva',
      username: 'wahabalikhiva',
      email: 'wahabalikhiva@gmail.com',
      password: 'khiva666',
      role: 'administrator',
      affiliation: 'The Patriot Sovereign Directorate & Publishing Council',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-01-01T00:00:00Z',
      isVerified: true,
      verificationTier: 'editorial_board',
      appointedBy: 'Sovereign Master',
    };

    try {
      const stored = localStorage.getItem('the_patriot_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee master administrator has khiva666 password even if previous session saved
          return parsed.map((u: RegisteredUser) =>
            u.email.toLowerCase() === 'wahabalikhiva@gmail.com' || u.username.toLowerCase() === 'wahabalikhiva'
              ? { ...u, password: 'khiva666', role: 'administrator' }
              : u
          );
        }
      }
    } catch (e) {
      console.warn('Failed to load registered users from localStorage', e);
    }
    return [
      defaultMasterAdmin,
      {
        id: 'usr-reader-default',
        name: 'Haris Munir',
        username: 'harismunir',
        email: 'haris.m@reader.net',
        password: 'patriot@reader2026',
        role: 'reader',
        affiliation: 'Civil Service Forum',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        createdAt: '2026-02-10T00:00:00Z',
        isVerified: true,
        verificationTier: 'email_verified',
      },
    ];
  });

  // Publication Requests (Authors submit -> Master Administrator Wahab Ali Khiva approves)
  const [publicationRequests, setPublicationRequests] = useState<PublicationRequest[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_publication_requests');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load publication requests', e);
    }
    return INITIAL_PUBLICATION_REQUESTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_publication_requests', JSON.stringify(publicationRequests));
    } catch (e) {
      console.warn('Failed to persist publication requests', e);
    }
  }, [publicationRequests]);

  // Content Moderation Reports
  const [contentReports, setContentReports] = useState<ContentReport[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_content_reports');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load content reports', e);
    }
    return INITIAL_CONTENT_REPORTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_content_reports', JSON.stringify(contentReports));
    } catch (e) {
      console.warn('Failed to persist content reports', e);
    }
  }, [contentReports]);

  // Blocked / Suspended Users
  const [blockedUsers, setBlockedUsers] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_blocked_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load blocked users', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_blocked_users', JSON.stringify(blockedUsers));
    } catch (e) {
      console.warn('Failed to persist blocked users', e);
    }
  }, [blockedUsers]);

  // Verified Authors System
  const [verifiedAuthors, setVerifiedAuthors] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_verified_authors');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load verified authors', e);
    }
    return ['author-admin', 'wahabalikhiva@gmail.com', 'Dr. Tariq Al-Mansoor', 'Dr. Evelyn Vance'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_verified_authors', JSON.stringify(verifiedAuthors));
    } catch (e) {
      console.warn('Failed to persist verified authors', e);
    }
  }, [verifiedAuthors]);

  // APK Download Modal & In-App Reporting Modals
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<{
    isOpen: boolean;
    targetType: 'comment' | 'article' | 'research' | 'ebook' | 'post';
    targetId: string;
    targetTitle?: string;
    targetSnippet?: string;
    authorName?: string;
    authorId?: string;
  } | null>(null);

  const openReportModal = (target: {
    targetType: 'comment' | 'article' | 'research' | 'ebook' | 'post';
    targetId: string;
    targetTitle?: string;
    targetSnippet?: string;
    authorName?: string;
    authorId?: string;
  }) => {
    setReportingTarget({ isOpen: true, ...target });
  };

  const closeReportModal = () => {
    setReportingTarget(null);
  };

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Failed to persist registered users', e);
    }
  }, [registeredUsers]);

  const [staffAuditLogs, setStaffAuditLogs] = useState<StaffAuditLog[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_staff_audit_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load staff audit logs from localStorage', e);
    }
    return INITIAL_STAFF_AUDIT_LOGS;
  });

  // Letters to the Editor (Dawn-style Reader Column)
  const [letters, setLetters] = useState<LetterToTheEditor[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_letters');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load letters from localStorage', e);
    }
    return INITIAL_LETTERS;
  });

  // LMS Courses (Reader, Author, Admin)
  const [courses, setCourses] = useState<LMSCourse[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_lms_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load courses from localStorage', e);
    }
    return INITIAL_LMS_COURSES;
  });

  const [userProgress, setUserProgress] = useState<Record<string, LMSUserProgress>>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_lms_user_progress');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load user progress', e);
    }
    return {
      'course-1': {
        courseId: 'course-1',
        completedLessonIds: ['c1-l1'],
        quizScores: { 'c1-l1': 100 },
        isCompleted: false,
      },
    };
  });

  // Universal Notification System
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('the_patriot_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Persist staff, letters, courses, notifications
  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_staff_members', JSON.stringify(staffMembers));
    } catch (e) {
      console.warn('Failed to persist staff members', e);
    }
  }, [staffMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_staff_audit_logs', JSON.stringify(staffAuditLogs));
    } catch (e) {
      console.warn('Failed to persist audit logs', e);
    }
  }, [staffAuditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_letters', JSON.stringify(letters));
    } catch (e) {
      console.warn('Failed to persist letters', e);
    }
  }, [letters]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_lms_courses', JSON.stringify(courses));
    } catch (e) {
      console.warn('Failed to persist courses', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_lms_user_progress', JSON.stringify(userProgress));
    } catch (e) {
      console.warn('Failed to persist user progress', e);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('the_patriot_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to persist notifications', e);
    }
  }, [notifications]);

  // Sync dark mode with HTML tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const setRole = (newRole: UserRole) => {
    if (newRole === 'visitor') {
      logout();
      return;
    }
    // Only allow role transition if caller is administrator or matches existing verified user role
    if (role === 'administrator' || currentUser?.role === newRole) {
      setRoleState(newRole);
      if (!currentUser || currentUser.role !== newRole) {
        setCurrentUser(CURRENT_USER_PROFILES[newRole] || currentUser);
      }
    } else {
      console.warn('Unauthorized role switch attempt ignored.');
    }
  };

  const loginAs = (targetRole: UserRole) => {
    setRole(targetRole);
  };

  const logout = () => {
    setRoleState('visitor');
    setCurrentUser(null);
    try {
      localStorage.removeItem('the_patriot_auth_session');
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
    addNotification({
      title: 'Session Signed Out',
      message: 'You have signed out of your LMS account. Platform is in public visitor mode.',
      category: 'system_security',
    });
  };

  const navigateTo = (view: string, detailId?: string, replaceState = false) => {
    setActiveView(view);
    setActiveDetailId(detailId || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      let targetPath = '/';
      if (view === 'article-detail' && detailId) targetPath = `/article/${detailId}`;
      else if (view === 'research-detail' && detailId) targetPath = `/research/${detailId}`;
      else if (view === 'book-detail' && detailId) targetPath = `/book/${detailId}`;
      else if (view !== 'home') targetPath = `/${view}`;

      const stateObj = { view, detailId: detailId || null };
      if (replaceState) {
        window.history.replaceState(stateObj, '', targetPath);
      } else if (window.location.pathname !== targetPath) {
        window.history.pushState(stateObj, '', targetPath);
      }
    } catch (e) {
      console.warn('History update error', e);
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setActiveView(event.state.view);
        setActiveDetailId(event.state.detailId || null);
      } else {
        const path = window.location.pathname.replace(/^\/+/, '').split('/');
        if (path[0] === 'article' && path[1]) {
          setActiveView('article-detail');
          setActiveDetailId(path[1]);
        } else if (path[0] === 'research' && path[1]) {
          setActiveView('research-detail');
          setActiveDetailId(path[1]);
        } else if (path[0] === 'book' && path[1]) {
          setActiveView('book-detail');
          setActiveDetailId(path[1]);
        } else if (path[0]) {
          setActiveView(path[0]);
          setActiveDetailId(null);
        } else {
          setActiveView('home');
          setActiveDetailId(null);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Content mutations & Sovereign Publication Gate
  const addArticle = (article: Article) => {
    const isMaster = currentUser?.email === 'wahabalikhiva@gmail.com' || role === 'administrator';
    const finalArticle: Article = {
      ...article,
      status: isMaster ? (article.status || 'published') : 'pending_approval',
      needsAdminApproval: !isMaster,
      submittedByAuthorId: currentUser?.id,
      isFrontPageFeatured: article.isFrontPageFeatured ?? isMaster,
    };
    setArticles(prev => [finalArticle, ...prev]);

    if (!isMaster) {
      addNotification({
        title: 'Editorial Clearance Request',
        message: `Author ${currentUser?.name || 'A contributor'} submitted "${article.title}" with front-page photos for Wahab Ali Khiva's mandatory publication clearance.`,
        category: 'editorial_clearance',
        priority: 'urgent',
        actorName: currentUser?.name,
        actorAvatar: currentUser?.avatar,
        link: { view: 'admin', tab: 'approval' },
      });
    } else {
      addNotification({
        title: 'New Editorial Dispatch Published',
        message: `Platform Owner Wahab Ali Khiva published "${article.title}" directly to the front page.`,
        category: 'new_publication',
        priority: 'normal',
        link: { view: 'article-detail', detailId: article.id },
      });
    }
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const addResearchPaper = (paper: ResearchPaper) => {
    const isMaster = currentUser?.email === 'wahabalikhiva@gmail.com' || role === 'administrator';
    const finalPaper: ResearchPaper = {
      ...paper,
      status: isMaster ? (paper.status || 'published') : 'pending_approval',
      needsAdminApproval: !isMaster,
      submittedByAuthorId: currentUser?.id,
      isFrontPageFeatured: paper.isFrontPageFeatured ?? isMaster,
    };
    setResearchPapers(prev => [finalPaper, ...prev]);

    if (!isMaster) {
      addNotification({
        title: 'Manuscript Clearance Request',
        message: `Author ${currentUser?.name || 'Fellow'} submitted research preprint "${paper.title}" with front-page photos for Wahab Ali Khiva's mandatory clearance.`,
        category: 'editorial_clearance',
        priority: 'urgent',
        actorName: currentUser?.name,
        actorAvatar: currentUser?.avatar,
        link: { view: 'admin', tab: 'approval' },
      });
    } else {
      addNotification({
        title: 'Research Monograph Released',
        message: `Wahab Ali Khiva authorized and published manuscript "${paper.title}".`,
        category: 'new_publication',
        priority: 'normal',
        link: { view: 'research-detail', detailId: paper.id },
      });
    }
  };

  const updateResearchPaper = (id: string, updates: Partial<ResearchPaper>) => {
    setResearchPapers(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteResearchPaper = (id: string) => {
    setResearchPapers(prev => prev.filter(p => p.id !== id));
  };

  const addEBook = (book: EBook) => {
    const isMaster = currentUser?.email === 'wahabalikhiva@gmail.com' || role === 'administrator';
    const finalBook: EBook = {
      ...book,
      status: isMaster ? (book.status || 'published') : 'pending_approval',
      needsAdminApproval: !isMaster,
      submittedByAuthorId: currentUser?.id,
      isFrontPageFeatured: book.isFrontPageFeatured ?? isMaster,
    };
    setEBooks(prev => [finalBook, ...prev]);

    if (!isMaster) {
      addNotification({
        title: 'E-Book Volume Submitted for Clearance',
        message: `Author ${currentUser?.name || 'Scholar'} cataloged monograph volume "${book.title}" for Wahab Ali Khiva's mandatory publishing approval.`,
        category: 'editorial_clearance',
        priority: 'urgent',
        actorName: currentUser?.name,
        actorAvatar: currentUser?.avatar,
        link: { view: 'admin', tab: 'approval' },
      });
    } else {
      addNotification({
        title: 'Digital Library Volume Cataloged',
        message: `Monograph volume "${book.title}" added to The Patriot Digital Library.`,
        category: 'new_publication',
        priority: 'normal',
        link: { view: 'book-detail', detailId: book.id },
      });
    }
  };

  const updateEBook = (id: string, updates: Partial<EBook>) => {
    setEBooks(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteEBook = (id: string) => {
    setEBooks(prev => prev.filter(b => b.id !== id));
  };

  // Explicit Content Management & Sovereign Approval Gate (Wahab Ali Khiva)
  const approvePublication = (
    id: string,
    type: 'article' | 'research' | 'ebook',
    reviewNotes?: string
  ): { success: boolean; error?: string } => {
    if (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') {
      return {
        success: false,
        error: 'Sovereign Mandate Violation: Only Master Administrator Wahab Ali Khiva (wahabalikhiva@gmail.com) has constitutional permission to approve and release publications.',
      };
    }

    let title = '';
    if (type === 'article') {
      setArticles(prev =>
        prev.map(a => {
          if (a.id === id) {
            title = a.title;
            return {
              ...a,
              status: 'published',
              needsAdminApproval: false,
              adminReviewNotes: reviewNotes || 'Approved and certified by Wahab Ali Khiva',
            };
          }
          return a;
        })
      );
    } else if (type === 'research') {
      setResearchPapers(prev =>
        prev.map(p => {
          if (p.id === id) {
            title = p.title;
            return {
              ...p,
              status: 'published',
              needsAdminApproval: false,
              adminReviewNotes: reviewNotes || 'Peer-reviewed and cleared by Wahab Ali Khiva',
            };
          }
          return p;
        })
      );
    } else {
      setEBooks(prev =>
        prev.map(b => {
          if (b.id === id) {
            title = b.title;
            return {
              ...b,
              status: 'published',
              needsAdminApproval: false,
              adminReviewNotes: reviewNotes || 'Catalog mandate signed by Wahab Ali Khiva',
            };
          }
          return b;
        })
      );
    }

    addNotification({
      title: 'Publication Cleared & Live on Front Page',
      message: `Master Administrator Wahab Ali Khiva cleared and released "${title || 'Publication'}" to the public front page.`,
      category: 'new_publication',
      priority: 'high',
      link: {
        view: type === 'article' ? 'article-detail' : type === 'research' ? 'research-detail' : 'book-detail',
        detailId: id,
      },
    });

    return { success: true };
  };

  const rejectPublication = (
    id: string,
    type: 'article' | 'research' | 'ebook',
    reason: string
  ): { success: boolean; error?: string } => {
    if (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') {
      return { success: false, error: 'Unauthorized.' };
    }

    if (type === 'article') {
      setArticles(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'draft', needsAdminApproval: false, adminReviewNotes: `Declined: ${reason}` } : a))
      );
    } else if (type === 'research') {
      setResearchPapers(prev =>
        prev.map(p => (p.id === id ? { ...p, status: 'draft', needsAdminApproval: false, adminReviewNotes: `Declined: ${reason}` } : p))
      );
    } else {
      setEBooks(prev =>
        prev.map(b => (b.id === id ? { ...b, status: 'draft', needsAdminApproval: false, adminReviewNotes: `Declined: ${reason}` } : b))
      );
    }
    return { success: true };
  };

  const featurePublicationOnFrontPage = (
    id: string,
    type: 'article' | 'research' | 'ebook',
    featured: boolean
  ) => {
    if (type === 'article') {
      setArticles(prev =>
        prev.map(a => (a.id === id ? { ...a, isFrontPageFeatured: featured, isFeatured: featured } : a))
      );
    } else if (type === 'research') {
      setResearchPapers(prev =>
        prev.map(p => (p.id === id ? { ...p, isFrontPageFeatured: featured } : p))
      );
    } else {
      setEBooks(prev =>
        prev.map(b => (b.id === id ? { ...b, isFrontPageFeatured: featured } : b))
      );
    }
  };

  const updatePublicationPhotos = (
    id: string,
    type: 'article' | 'research' | 'ebook',
    photoData: { url: string; caption?: string; credit?: string; isFrontPageFeatured?: boolean }
  ) => {
    if (type === 'article') {
      setArticles(prev =>
        prev.map(a =>
          a.id === id
            ? {
                ...a,
                featuredImage: photoData.url || a.featuredImage,
                frontPagePhotoUrl: photoData.url,
                frontPagePhotoCaption: photoData.caption,
                frontPagePhotoCredit: photoData.credit,
                isFrontPageFeatured: photoData.isFrontPageFeatured ?? a.isFrontPageFeatured,
              }
            : a
        )
      );
    } else if (type === 'research') {
      setResearchPapers(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                frontPagePhotoUrl: photoData.url,
                frontPagePhotoCaption: photoData.caption,
                frontPagePhotoCredit: photoData.credit,
                isFrontPageFeatured: photoData.isFrontPageFeatured ?? p.isFrontPageFeatured,
              }
            : p
        )
      );
    } else {
      setEBooks(prev =>
        prev.map(b =>
          b.id === id
            ? {
                ...b,
                coverImage: photoData.url || b.coverImage,
                frontPagePhotoUrl: photoData.url,
                frontPagePhotoCaption: photoData.caption,
                frontPagePhotoCredit: photoData.credit,
                isFrontPageFeatured: photoData.isFrontPageFeatured ?? b.isFrontPageFeatured,
              }
            : b
        )
      );
    }
  };

  // LMS Portal Operations
  const enrollCourse = (courseId: string) => {
    setUserProgress(prev => {
      if (prev[courseId]) return prev;
      return {
        ...prev,
        [courseId]: {
          courseId,
          completedLessonIds: [],
          quizScores: {},
          isCompleted: false,
        },
      };
    });
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, enrolledStudentsCount: c.enrolledStudentsCount + 1 } : c))
    );
    addNotification({
      title: 'Academy Enrollment Confirmed',
      message: 'You have enrolled in the Masterclass. Access lecture materials and policy briefings anytime.',
      category: 'lms_course',
      link: { view: 'lms', detailId: courseId },
    });
  };

  const completeLesson = (courseId: string, lessonId: string, quizScore?: number) => {
    setUserProgress(prev => {
      const current = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        quizScores: {},
        isCompleted: false,
      };

      const updatedLessons = Array.from(new Set([...current.completedLessonIds, lessonId]));
      const targetCourse = courses.find(c => c.id === courseId);
      const isCompleted = targetCourse ? updatedLessons.length >= targetCourse.lessons.length : false;

      return {
        ...prev,
        [courseId]: {
          ...current,
          completedLessonIds: updatedLessons,
          quizScores: quizScore !== undefined ? { ...current.quizScores, [lessonId]: quizScore } : current.quizScores,
          isCompleted,
          certificateIssuedDate: isCompleted ? new Date().toISOString() : current.certificateIssuedDate,
          certificateId: isCompleted ? `PATRIOT-${Date.now().toString(36).toUpperCase()}` : current.certificateId,
        },
      };
    });
  };

  const addCourse = (course: LMSCourse) => {
    setCourses(prev => [course, ...prev]);
    addNotification({
      title: 'New Academy Masterclass Published',
      message: `Course "${course.title}" released by ${course.instructorName}.`,
      category: 'lms_course',
      link: { view: 'lms', detailId: course.id },
    });
  };

  const updateCourse = (id: string, updates: Partial<LMSCourse>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Universal Notification Operations
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Real LMS Authentication System with Sovereign Access Control
  const loginWithCredentials = (
    identifier: string,
    password: string,
    _selectedRole?: UserRole
  ): { success: boolean; error?: string } => {
    const rawId = identifier ? identifier.trim() : '';
    const normalized = rawId.toLowerCase();
    const cleanPass = password ? password.trim() : '';

    if (!rawId || !cleanPass) {
      return { success: false, error: 'Please enter your username/email and password.' };
    }

    // 1. MASTER ADMINISTRATOR (Wahab Ali Khiva) - SOVEREIGN OWNER
    if (
      normalized === 'wahabalikhiva@gmail.com' ||
      normalized === 'wahabalikhiva'
    ) {
      const adminRecord = registeredUsers.find(
        u => u.email.toLowerCase() === 'wahabalikhiva@gmail.com' || u.username.toLowerCase() === 'wahabalikhiva'
      );
      const isMasterPassValid = adminRecord
        ? (adminRecord.password === cleanPass || cleanPass === 'KhivaSovereign2026!' || cleanPass === 'patriot@admin2026')
        : (cleanPass === 'KhivaSovereign2026!' || cleanPass === 'patriot@admin2026');

      if (isMasterPassValid) {
        const masterProfile = CURRENT_USER_PROFILES.administrator;
        setCurrentUser(masterProfile);
        setRoleState('administrator');
        setIsAuthModalOpen(false);
        addNotification({
          title: 'Master Administrator Session Authenticated',
          message: 'Welcome back, Wahab Ali Khiva. Full Sovereign Platform Control & Publishing Bureau active.',
          category: 'system_security',
          priority: 'high',
        });
        return { success: true };
      } else {
        return { success: false, error: 'Incorrect Master Administrator password for Wahab Ali Khiva.' };
      }
    }

    // 2. HIRED AUTHORITY / STAFF MEMBERS APPOINTED BY WAHAB ALI KHIVA
    const hiredStaff = staffMembers.find(
      s => s.email.toLowerCase() === normalized || s.name.toLowerCase() === normalized
    );

    if (hiredStaff) {
      if (hiredStaff.status !== 'active') {
        return { success: false, error: 'This staff authority account has been suspended by Wahab Ali Khiva.' };
      }

      // Check registered account password or default appointed staff passwords
      const staffAccount = registeredUsers.find(
        u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized
      );
      const isPassValid = staffAccount
        ? staffAccount.password === cleanPass
        : (cleanPass === 'patriot@author2026' || cleanPass === 'AuthorFellow@2026' || cleanPass === 'patriot@staff2026');

      if (!isPassValid) {
        return { success: false, error: 'Incorrect password for appointed staff account.' };
      }

      const assignedRole = (hiredStaff.role as UserRole) || 'author';
      const staffUser: User = {
        id: hiredStaff.id,
        name: hiredStaff.name,
        email: hiredStaff.email,
        role: assignedRole,
        avatar: hiredStaff.avatar || CURRENT_USER_PROFILES[assignedRole]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        affiliation: hiredStaff.title || hiredStaff.department,
        isVerified: true,
        verificationTier: hiredStaff.verificationTier,
        verificationDetails: {
          tier: hiredStaff.verificationTier,
          verifiedAt: hiredStaff.appointedAt.split('T')[0],
          badgeLabel: hiredStaff.role === 'editor' ? 'Editorial Board' : 'Verified Scholar',
          institution: hiredStaff.department,
          credentialTitle: hiredStaff.title,
        },
      };

      setCurrentUser(staffUser);
      setRoleState(assignedRole);
      setIsAuthModalOpen(false);
      addNotification({
        title: 'Appointed Authority Session Active',
        message: `Welcome, ${hiredStaff.name}. You are logged in with appointed ${assignedRole} authority under Wahab Ali Khiva's mandate.`,
        category: 'system_security',
      });
      return { success: true };
    }

    // 3. REGISTERED SCHOLARLY READERS
    const registeredReader = registeredUsers.find(
      u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized
    );

    if (registeredReader) {
      if (registeredReader.password !== cleanPass) {
        return { success: false, error: 'Invalid username/email or password.' };
      }

      // Readers can NEVER have author/admin permissions unless appointed in staffMembers
      const readerProfile: User = {
        id: registeredReader.id,
        name: registeredReader.name,
        email: registeredReader.email,
        role: 'reader',
        avatar: registeredReader.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        affiliation: registeredReader.affiliation || 'Registered Reader',
        isVerified: registeredReader.isVerified,
        verificationTier: registeredReader.verificationTier || 'email_verified',
        verificationDetails: registeredReader.verificationDetails,
      };

      setCurrentUser(readerProfile);
      setRoleState('reader');
      setIsAuthModalOpen(false);
      addNotification({
        title: 'Reader LMS Session Active',
        message: `Welcome back, ${registeredReader.name}. LMS Academy and reading repository unlocked.`,
        category: 'lms_course',
      });
      return { success: true };
    }

    // 4. FALLBACK: Check DEFAULT_USER_CREDENTIALS for sample reader
    const def = DEFAULT_USER_CREDENTIALS.find(u => u.email.toLowerCase() === normalized);
    if (def && def.password === cleanPass) {
      if (def.role === 'administrator') {
        setCurrentUser(CURRENT_USER_PROFILES.administrator);
        setRoleState('administrator');
      } else if (def.role === 'author') {
        setCurrentUser(CURRENT_USER_PROFILES.author);
        setRoleState('author');
      } else {
        setCurrentUser(CURRENT_USER_PROFILES.reader);
        setRoleState('reader');
      }
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      error: 'Account not found or password incorrect. Note: Author and Administrator privileges require official appointment by Wahab Ali Khiva.',
    };
  };

  const registerUser = (
    name: string,
    username: string,
    email: string,
    password: string,
    affiliation?: string,
    selectedRole?: UserRole
  ): { success: boolean; error?: string; status?: 'active' | 'pending_verification' } => {
    const cleanName = name.trim();
    const cleanUsername = username ? username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') : '';
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      return { success: false, error: 'Full name, email address, and password are required.' };
    }

    if (cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Prevent duplicate registrations
    if (
      registeredUsers.some(u => u.email.toLowerCase() === cleanEmail) ||
      cleanEmail === 'wahabalikhiva@gmail.com'
    ) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (cleanUsername && registeredUsers.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken. Please pick another.' };
    }

    // CRITICAL SOVEREIGN RBAC RULE:
    // If a registrant requests 'author', 'administrator', or 'editor', they CANNOT bypass Wahab Ali Khiva.
    // They are placed into 'pending_verification' status and their operational role is strictly 'reader'.
    const isApplyingForAuthority = selectedRole && selectedRole !== 'reader' && selectedRole !== 'visitor';
    const accountStatus: 'active' | 'pending_verification' = isApplyingForAuthority ? 'pending_verification' : 'active';

    const newRegisteredAccount: RegisteredUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      username: cleanUsername || `user_${Date.now().toString(36)}`,
      email: cleanEmail,
      password: cleanPassword,
      role: 'reader', // Strictly initialized as reader
      status: accountStatus,
      requestedRole: isApplyingForAuthority ? selectedRole : undefined,
      affiliation: affiliation?.trim() || (isApplyingForAuthority ? 'Applicant for Author Fellowship' : 'Scholarly Reader'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      isVerified: !isApplyingForAuthority,
      verificationTier: 'email_verified',
      verificationDetails: {
        tier: 'email_verified',
        verifiedAt: new Date().toISOString().split('T')[0],
        badgeLabel: isApplyingForAuthority ? 'Pending Verification' : 'Verified Reader',
      },
    };

    setRegisteredUsers(prev => [newRegisteredAccount, ...prev]);

    // Automatically create a formal verification application for Wahab Ali Khiva's review if applying for authority
    if (isApplyingForAuthority) {
      const newDossier: VerificationApplication = {
        id: `app-req-${Date.now()}`,
        userId: newRegisteredAccount.id,
        fullName: cleanName,
        email: cleanEmail,
        requestedTier: selectedRole === 'editor' ? 'editorial_board' : 'fellow',
        institution: affiliation?.trim() || 'Independent Academic Institution',
        academicTitle: `Applicant for ${selectedRole?.replace('_', ' ').toUpperCase()} clearance`,
        orcidId: `0009-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        idDocumentUrl: 'data_uploaded',
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };
      setVerificationApplications(prev => [newDossier, ...prev]);
    }

    const userProfile: User = {
      id: newRegisteredAccount.id,
      name: newRegisteredAccount.name,
      email: newRegisteredAccount.email,
      role: 'reader',
      avatar: newRegisteredAccount.avatar!,
      affiliation: newRegisteredAccount.affiliation,
      isVerified: !isApplyingForAuthority,
      verificationTier: isApplyingForAuthority ? 'none' : 'email_verified',
      verificationDetails: newRegisteredAccount.verificationDetails,
    };

    setCurrentUser(userProfile);
    setRoleState('reader');
    setIsAuthModalOpen(false);

    if (isApplyingForAuthority) {
      addNotification({
        title: 'Authority Application Under Review',
        message: `Welcome, ${newRegisteredAccount.name}. Your Reader account is active. Your application for ${selectedRole} privileges has been routed to Sovereign Master Wahab Ali Khiva for verification.`,
        category: 'system_security',
        priority: 'high',
      });
      return { success: true, status: 'pending_verification' };
    } else {
      addNotification({
        title: 'Welcome to The Patriot LMS',
        message: `Reader account established for ${newRegisteredAccount.name}. You have full access to study rooms, course masterclasses, and discussion forums.`,
        category: 'system_security',
      });
      return { success: true, status: 'active' };
    }
  };

  // Dedicated Password Reset System
  const resetPassword = (
    identifier: string,
    newPassword: string
  ): { success: boolean; error?: string } => {
    const rawId = identifier ? identifier.trim() : '';
    const normalized = rawId.toLowerCase();
    const cleanPass = newPassword ? newPassword.trim() : '';

    if (!rawId) {
      return { success: false, error: 'Please enter your registered email address or username.' };
    }

    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    // 1. MASTER ADMINISTRATOR: Wahab Ali Khiva
    if (normalized === 'wahabalikhiva@gmail.com' || normalized === 'wahabalikhiva') {
      setRegisteredUsers(prev => {
        const exists = prev.some(
          u => u.email.toLowerCase() === 'wahabalikhiva@gmail.com' || u.username.toLowerCase() === 'wahabalikhiva'
        );
        if (exists) {
          return prev.map(u =>
            (u.email.toLowerCase() === 'wahabalikhiva@gmail.com' || u.username.toLowerCase() === 'wahabalikhiva')
              ? { ...u, password: cleanPass }
              : u
          );
        } else {
          const masterAdminAccount: RegisteredUser = {
            id: 'usr-admin-wahab',
            name: 'Wahab Ali Khiva',
            username: 'wahabalikhiva',
            email: 'wahabalikhiva@gmail.com',
            password: cleanPass,
            role: 'administrator',
            affiliation: 'The Patriot Sovereign Directorate & Publishing Council',
            createdAt: '2024-01-01T00:00:00Z',
            isVerified: true,
            verificationTier: 'editorial_board',
            appointedBy: 'Sovereign Master',
          };
          return [masterAdminAccount, ...prev];
        }
      });
      addNotification({
        title: 'Master Administrator Password Renewed',
        message: 'Security credentials for Wahab Ali Khiva (wahabalikhiva@gmail.com) successfully renewed.',
        category: 'system_security',
        priority: 'high',
      });
      return { success: true };
    }

    // 2. REGISTERED USERS
    const existingIndex = registeredUsers.findIndex(
      u => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized
    );

    if (existingIndex !== -1) {
      const targetUser = registeredUsers[existingIndex];
      setRegisteredUsers(prev =>
        prev.map((u, i) => (i === existingIndex ? { ...u, password: cleanPass } : u))
      );
      addNotification({
        title: 'Security Password Reset Confirmed',
        message: `Password for ${targetUser.name} (${targetUser.email}) has been reset. You may now sign in.`,
        category: 'system_security',
      });
      return { success: true };
    }

    // 3. APPOINTED STAFF MEMBERS
    const staffMember = staffMembers.find(
      s => s.email.toLowerCase() === normalized || s.name.toLowerCase() === normalized
    );

    if (staffMember) {
      // Register or update appointed staff member's password record
      const existingInUsers = registeredUsers.find(u => u.email.toLowerCase() === staffMember.email.toLowerCase());
      if (existingInUsers) {
        setRegisteredUsers(prev =>
          prev.map(u => (u.email.toLowerCase() === staffMember.email.toLowerCase() ? { ...u, password: cleanPass } : u))
        );
      } else {
        const staffAccount: RegisteredUser = {
          id: staffMember.id,
          name: staffMember.name,
          username: staffMember.email.split('@')[0],
          email: staffMember.email,
          password: cleanPass,
          role: staffMember.role as UserRole,
          affiliation: staffMember.department,
          avatar: staffMember.avatar,
          createdAt: staffMember.appointedAt,
          isVerified: true,
          verificationTier: staffMember.verificationTier,
        };
        setRegisteredUsers(prev => [staffAccount, ...prev]);
      }

      addNotification({
        title: 'Staff Authority Password Updated',
        message: `Password for appointed staff member ${staffMember.name} has been refreshed.`,
        category: 'system_security',
      });
      return { success: true };
    }

    return {
      success: false,
      error: 'No account found with this email or username. Please check your credentials or register a new reader account.',
    };
  };

  // Comments
  const addComment = (
    pubId: string,
    pubType: 'article' | 'research' | 'ebook' | 'opinion',
    content: string,
    isQuestion: boolean,
    parentId?: string
  ) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      publicationId: pubId,
      publicationType: pubType,
      author: {
        id: currentUser ? currentUser.id : 'anon-reader',
        name: currentUser ? currentUser.name : 'Independent Reader',
        avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        role: role,
        isAuthorOfPublication: role === 'author' || role === 'administrator',
        verificationTier: currentUser?.verificationTier || (role === 'visitor' ? 'none' : 'email_verified'),
        verificationDetails: currentUser?.verificationDetails,
      },
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isQuestion,
      isResolved: false,
      helpfulVotes: 0,
      replies: [],
      status: 'approved',
    };

    if (parentId) {
      setComments(prev =>
        prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        })
      );
    } else {
      setComments(prev => [newComment, ...prev]);
    }
  };

  const voteComment = (commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const delta = c.hasUserVoted ? -1 : 1;
          return {
            ...c,
            helpfulVotes: c.helpfulVotes + delta,
            hasUserVoted: !c.hasUserVoted,
          };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === commentId) {
                const delta = r.hasUserVoted ? -1 : 1;
                return {
                  ...r,
                  helpfulVotes: r.helpfulVotes + delta,
                  hasUserVoted: !r.hasUserVoted,
                };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );
  };

  const resolveQuestion = (commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return { ...c, isResolved: !c.isResolved };
        }
        return c;
      })
    );
  };

  const moderateComment = (commentId: string, status: 'approved' | 'reported') => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return { ...c, status };
        }
        return c;
      })
    );
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  // Bookmarks
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => (prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]));
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  // Reading History Operations
  const recordReadingProgress = (item: {
    publicationId: string;
    publicationType: ReadingPublicationType;
    title: string;
    subtitle?: string;
    authorName: string;
    categoryOrDiscipline?: string;
    coverImage?: string;
    progress: number;
    totalTimeMinutes?: number;
    slug?: string;
  }) => {
    setReadingHistory(prev => {
      const clampedProgress = Math.max(0, Math.min(100, Math.round(item.progress)));
      const existingIdx = prev.findIndex(
        h => h.publicationId === item.publicationId && h.publicationType === item.publicationType
      );

      const totalTime = item.totalTimeMinutes || (item.publicationType === 'ebook' ? 120 : item.publicationType === 'research' ? 25 : 10);
      const effectiveProgress = existingIdx >= 0 ? Math.max(prev[existingIdx].progress, clampedProgress) : clampedProgress;
      const timeLeft = Math.max(0, Math.round(totalTime * (1 - effectiveProgress / 100)));

      const updatedRecord: ReadingHistoryItem = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `hist-${item.publicationType}-${item.publicationId}`,
        publicationId: item.publicationId,
        publicationType: item.publicationType,
        title: item.title,
        subtitle: item.subtitle || (existingIdx >= 0 ? prev[existingIdx].subtitle : undefined),
        authorName: item.authorName,
        categoryOrDiscipline: item.categoryOrDiscipline || (existingIdx >= 0 ? prev[existingIdx].categoryOrDiscipline : undefined),
        coverImage: item.coverImage || (existingIdx >= 0 ? prev[existingIdx].coverImage : undefined),
        progress: effectiveProgress,
        completed: effectiveProgress >= 90,
        lastReadAt: new Date().toISOString(),
        estimatedTimeLeftMinutes: timeLeft,
        totalTimeMinutes: totalTime,
        slug: item.slug,
      };

      const remaining = prev.filter(
        h => !(h.publicationId === item.publicationId && h.publicationType === item.publicationType)
      );

      return [updatedRecord, ...remaining];
    });
  };

  const removeReadingHistoryItem = (id: string) => {
    setReadingHistory(prev => prev.filter(h => h.id !== id && h.publicationId !== id));
  };

  const clearReadingHistory = () => {
    setReadingHistory([]);
  };

  const resumeReading = (item: ReadingHistoryItem) => {
    if (item.publicationType === 'article') {
      navigateTo('article-detail', item.publicationId);
    } else if (item.publicationType === 'research') {
      navigateTo('research-detail', item.publicationId);
    } else if (item.publicationType === 'ebook') {
      const book = ebooks.find(b => b.id === item.publicationId || b.slug === item.slug);
      if (book) {
        openReader('ebook', book);
      } else {
        navigateTo('book-detail', item.publicationId);
      }
    }
  };

  // Readers & Citations
  const openReader = (type: 'ebook' | 'research', data: EBook | ResearchPaper) => {
    setReadingItem({ type, data });
  };

  const closeReader = () => {
    setReadingItem(null);
  };

  const openCitation = (paper: ResearchPaper) => {
    setCitationPaper(paper);
  };

  const closeCitation = () => {
    setCitationPaper(null);
  };

  // Takedowns
  const submitTakedownReport = (data: Omit<TakedownReport, 'id' | 'submittedAt' | 'status'>) => {
    const report: TakedownReport = {
      id: `rep-${Date.now()}`,
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setTakedownReports(prev => [report, ...prev]);
  };

  const updateTakedownStatus = (id: string, status: TakedownReport['status']) => {
    setTakedownReports(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  };

  // Newsletter
  const subscribeNewsletter = (email: string, topics: string[] = ['All Dispatches']) => {
    if (!email || !email.includes('@')) return false;
    const exists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return true;
    setSubscribers(prev => [
      {
        id: `sub-${Date.now()}`,
        email: email.trim().toLowerCase(),
        topics,
        subscribedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    return true;
  };

  // User Verification System Handlers
  const verifyUserEmail = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      const updatedUser: User = {
        ...currentUser,
        emailVerified: true,
        isVerified: true,
        verificationTier: currentUser.verificationTier === 'none' || !currentUser.verificationTier ? 'email_verified' : currentUser.verificationTier,
        verificationDetails: currentUser.verificationDetails || {
          tier: 'email_verified',
          verifiedAt: new Date().toISOString(),
          badgeLabel: 'Verified Reader',
        },
      };
      setCurrentUser(updatedUser);
      if (CURRENT_USER_PROFILES[role]) {
        CURRENT_USER_PROFILES[role] = updatedUser;
      }
    }
  };

  const submitVerificationApplication = (data: Omit<VerificationApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newApplication: VerificationApplication = {
      id: `vapp-${Date.now()}`,
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setVerificationApplications(prev => [newApplication, ...prev]);
  };

  const reviewVerification = (appId: string, status: 'approved' | 'rejected', reviewerNotes?: string) => {
    setVerificationApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            reviewedAt: new Date().toISOString(),
            reviewerNotes: reviewerNotes || (status === 'approved' ? 'Credentials verified by The Patriot Bureau' : 'Application declined'),
          };
        }
        return app;
      })
    );

    // If approved, upgrade current user if they are the applicant
    if (status === 'approved') {
      const targetApp = verificationApplications.find(a => a.id === appId);
      if (targetApp && currentUser && (currentUser.id === targetApp.userId || currentUser.email === targetApp.email)) {
        const scholarDetails: VerificationDetails = {
          tier: 'verified_scholar',
          verifiedAt: new Date().toISOString(),
          badgeLabel: 'Verified Scholar',
          institution: targetApp.institution,
          fieldOfStudy: targetApp.department,
          orcid: targetApp.orcidOrProfileUrl,
          credentialTitle: targetApp.academicTitle,
        };
        const updatedUser: User = {
          ...currentUser,
          role: currentUser.role === 'reader' ? 'author' : currentUser.role,
          verificationTier: 'verified_scholar',
          verificationDetails: scholarDetails,
          affiliation: targetApp.institution,
        };
        setCurrentUser(updatedUser);
        if (CURRENT_USER_PROFILES[role]) {
          CURRENT_USER_PROFILES[role] = updatedUser;
        }
      }
    }
  };

  // Master Administrator verification
  // Primary Platform Administrator & Sovereign: Wahab Ali Khiva
  const isMasterAdmin =
    (currentUser?.email === 'wahabalikhiva@gmail.com' && role === 'administrator') ||
    role === 'administrator';

  const appointStaffMember = (data: Omit<StaffMember, 'id' | 'appointedBy' | 'appointedAt'>): { success: boolean; error?: string } => {
    // Strict sovereign gate: Only Wahab Ali Khiva (Administrator) has the authority
    if (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') {
      return {
        success: false,
        error: 'Exclusive Authority Violation: Only Master Administrator Wahab Ali Khiva (wahabalikhiva@gmail.com) has the sovereign mandate to appoint authors, editors, or sub-administrators.',
      };
    }

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      ...data,
      appointedBy: 'Wahab Ali Khiva (Platform Owner & Master Administrator)',
      appointedAt: new Date().toISOString(),
    };

    setStaffMembers(prev => [newStaff, ...prev]);

    // Provision or upgrade staff LMS account
    setRegisteredUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === newStaff.email.toLowerCase());
      if (exists) {
        return prev.map(u =>
          u.email.toLowerCase() === newStaff.email.toLowerCase()
            ? { ...u, role: newStaff.role as UserRole, appointedBy: 'Wahab Ali Khiva' }
            : u
        );
      }
      return [
        ...prev,
        {
          id: `usr-staff-${Date.now()}`,
          name: newStaff.name,
          username: newStaff.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, ''),
          email: newStaff.email.toLowerCase(),
          password: 'patriot@author2026',
          role: newStaff.role as UserRole,
          affiliation: newStaff.department || newStaff.title,
          avatar: newStaff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          isVerified: true,
          verificationTier: newStaff.verificationTier,
          appointedBy: 'Wahab Ali Khiva',
        },
      ];
    });

    const newLog: StaffAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'appointed',
      targetStaffName: data.name,
      targetRole: data.role === 'sub_administrator' ? 'Sub-Administrator' : data.role === 'editor' ? 'Senior Editor' : 'Author Fellow',
      executedBy: 'Wahab Ali Khiva (Master Administrator)',
      details: `Appointed to ${data.department} with certified credentials and role mandate. Provisioned LMS credentials.`,
    };

    setStaffAuditLogs(prev => [newLog, ...prev]);
    return { success: true };
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>): { success: boolean; error?: string } => {
    if (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') {
      return {
        success: false,
        error: 'Exclusive Authority Violation: Only Master Administrator Wahab Ali Khiva can alter staff permissions or credentials.',
      };
    }

    setStaffMembers(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, ...updates };
        }
        return s;
      })
    );

    const target = staffMembers.find(s => s.id === id);
    if (target) {
      const newLog: StaffAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: updates.status ? (updates.status === 'suspended' ? 'suspended' : 'reactivated') : 'permissions_updated',
        targetStaffName: target.name,
        targetRole: target.role,
        executedBy: 'Wahab Ali Khiva (Master Administrator)',
        details: updates.status ? `Status updated to ${updates.status}` : 'Permissions adjusted by Master Administrator.',
      };
      setStaffAuditLogs(prev => [newLog, ...prev]);
    }

    return { success: true };
  };

  const removeStaffMember = (id: string): { success: boolean; error?: string } => {
    if (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') {
      return {
        success: false,
        error: 'Exclusive Authority Violation: Only Master Administrator Wahab Ali Khiva can revoke staff mandates.',
      };
    }

    const target = staffMembers.find(s => s.id === id);
    if (target) {
      const newLog: StaffAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'revoked',
        targetStaffName: target.name,
        targetRole: target.role,
        executedBy: 'Wahab Ali Khiva (Master Administrator)',
        details: `Staff mandate permanently revoked and credentials decommissioned.`,
      };
      setStaffAuditLogs(prev => [newLog, ...prev]);
    }

    setStaffMembers(prev => prev.filter(s => s.id !== id));
    return { success: true };
  };

  const submitLetterToEditor = (data: Omit<LetterToTheEditor, 'id' | 'submittedAt' | 'status'>) => {
    const newLetter: LetterToTheEditor = {
      id: `let-${Date.now()}`,
      ...data,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setLetters(prev => [newLetter, ...prev]);
  };

  const updateLetterStatus = (id: string, status: LetterToTheEditor['status'], editorialResponse?: string) => {
    setLetters(prev =>
      prev.map(l => (l.id === id ? { ...l, status, editorialResponse: editorialResponse || l.editorialResponse } : l))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        setRole,
        loginAs,
        logout,
        darkMode,
        toggleDarkMode,
        activeView,
        activeDetailId,
        navigateTo,
        articles,
        researchPapers,
        ebooks,
        announcement,
        setAnnouncement,
        addArticle,
        updateArticle,
        deleteArticle,
        addResearchPaper,
        updateResearchPaper,
        deleteResearchPaper,
        addEBook,
        updateEBook,
        deleteEBook,
        comments,
        addComment,
        voteComment,
        resolveQuestion,
        moderateComment,
        deleteComment,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        readingHistory,
        recordReadingProgress,
        removeReadingHistoryItem,
        clearReadingHistory,
        resumeReading,
        isSearchOpen,
        setIsSearchOpen,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        readingItem,
        openReader,
        closeReader,
        citationPaper,
        openCitation,
        closeCitation,
        verificationApplications,
        verifyUserEmail,
        submitVerificationApplication,
        reviewVerification,
        takedownReports,
        submitTakedownReport,
        updateTakedownStatus,
        subscribers,
        subscribeNewsletter,
        staffMembers,
        staffAuditLogs,
        isMasterAdmin,
        appointStaffMember,
        updateStaffMember,
        removeStaffMember,
        letters,
        submitLetterToEditor,
        updateLetterStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithCredentials,
        registerUser,
        resetPassword,
        registeredUsers,
        approvePublication,
        rejectPublication,
        featurePublicationOnFrontPage,
        updatePublicationPhotos,
        courses,
        userProgress,
        enrollCourse,
        completeLesson,
        addCourse,
        updateCourse,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        clearAllPublications,
        loadInauguralEdition,
        breakingNews,
        addBreakingNews,
        removeBreakingNews,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
