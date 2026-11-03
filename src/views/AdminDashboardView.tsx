import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Article, ResearchPaper, EBook, UserRole, StaffMember, StaffRole, StaffAuditLog, LetterToTheEditor } from '../types';
import { VerificationBadge } from '../components/VerificationBadge';
import { DocumentImportSection, ExtractedDocumentData } from '../components/DocumentImportSection';
import { FrontPhotoImportSection } from '../components/FrontPhotoImportSection';
import { EngagementAnalyticsChart } from '../components/EngagementAnalyticsChart';
import {
  Shield,
  FileText,
  BookOpen,
  Bookmark,
  MessageSquare,
  Users,
  Megaphone,
  AlertTriangle,
  Mail,
  Plus,
  Trash2,
  Edit,
  Check,
  Eye,
  TrendingUp,
  Download,
  CheckCircle2,
  GraduationCap,
  ExternalLink,
  XCircle,
  Sparkles,
  Layers,
  X,
  Lock,
  UserCheck,
  UserX,
  ShieldAlert,
  FileUp,
  Award,
  History,
  Image as ImageIcon,
  Star,
  Radio,
  KeyRound,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    articles,
    addArticle,
    deleteArticle,
    updateArticle,
    researchPapers,
    addResearchPaper,
    deleteResearchPaper,
    ebooks,
    addEBook,
    deleteEBook,
    comments,
    moderateComment,
    deleteComment,
    announcement,
    setAnnouncement,
    takedownReports,
    updateTakedownStatus,
    verificationApplications,
    reviewVerification,
    subscribers,
    role,
    setRole,
    currentUser,
    navigateTo,
    staffMembers,
    staffAuditLogs,
    isMasterAdmin,
    appointStaffMember,
    updateStaffMember,
    removeStaffMember,
    letters,
    updateLetterStatus,
    approvePublication,
    rejectPublication,
    featurePublicationOnFrontPage,
    updatePublicationPhotos,
    clearAllPublications,
    loadInauguralEdition,
    breakingNews,
    addBreakingNews,
    removeBreakingNews,
    setIsAuthModalOpen,
    resetPassword,
  } = useApp();

  const [renewPasswordModalOpen, setRenewPasswordModalOpen] = useState(false);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminPassMessage, setAdminPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [newBreakingHeadline, setNewBreakingHeadline] = useState('');
  const [newBreakingCategory, setNewBreakingCategory] = useState('GEOPOLITICS & ECONOMY');
  const [newBreakingSource, setNewBreakingSource] = useState('Central Bureau');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [launchActionToast, setLaunchActionToast] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'approval'
    | 'articles'
    | 'research'
    | 'books'
    | 'moderation'
    | 'staff'
    | 'letters'
    | 'homepage'
    | 'verifications'
    | 'takedowns'
    | 'subscribers'
  >('overview');

  const [reviewNoteInput, setReviewNoteInput] = useState<Record<string, string>>({});
  const [clearanceNoteInput, setClearanceNoteInput] = useState<Record<string, string>>({});

  // Announcement state edit
  const [annMessage, setAnnMessage] = useState(announcement.message);
  const [annEnabled, setAnnEnabled] = useState(announcement.isEnabled);
  const [annSaved, setAnnSaved] = useState(false);

  // Publishing Notification Toast
  const [publishToast, setPublishToast] = useState<{
    id: string;
    title: string;
    type: 'article' | 'book';
  } | null>(null);

  // New Article Modal Form State (With Front Page Photos)
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('Geopolitics & Economy');
  const [newArticleType, setNewArticleType] = useState<'article' | 'opinion'>('article');
  const [newContent, setNewContent] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newTags, setNewTags] = useState('Geopolitics, National Sovereignty, Economy');
  const [newFeaturedImage, setNewFeaturedImage] = useState('/src/assets/images/patriot_hero_diplomacy_1792591089041.jpg');
  const [newFrontPagePhotoUrl, setNewFrontPagePhotoUrl] = useState('/src/assets/images/patriot_hero_diplomacy_1792591089041.jpg');
  const [newFrontPagePhotoCaption, setNewFrontPagePhotoCaption] = useState('Delegation heads convene for sovereign trade talks and corridor access protocols.');
  const [newFrontPagePhotoCredit, setNewFrontPagePhotoCredit] = useState('The Patriot Diplomatic Wire / Reuters');
  const [newIsFrontPageFeatured, setNewIsFrontPageFeatured] = useState(true);
  const [newAuthorName, setNewAuthorName] = useState(currentUser?.name || 'Marcus Vance');
  const [newAuthorAffiliation, setNewAuthorAffiliation] = useState('Senior Fellow, The Patriot Bureau of Geopolitics');

  // New E-Book Modal Form State
  const [isNewBookOpen, setIsNewBookOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSubtitle, setNewBookSubtitle] = useState('');
  const [newBookAuthorName, setNewBookAuthorName] = useState(currentUser?.name || 'Dr. Julian Vane');
  const [newBookAuthorAffiliation, setNewBookAuthorAffiliation] = useState('Institute for Monetary & Sovereign Strategy');
  const [newBookGenre, setNewBookGenre] = useState('Geopolitics & Strategy');
  const [newBookYear, setNewBookYear] = useState(2026);
  const [newBookPages, setNewBookPages] = useState(280);
  const [newBookEdition, setNewBookEdition] = useState('1st Critical Edition');
  const [newBookLanguage, setNewBookLanguage] = useState('English');
  const [newBookFormat, setNewBookFormat] = useState<'PDF' | 'EPUB'>('PDF');
  const [newBookFileSize, setNewBookFileSize] = useState('4.8 MB');
  const [newBookAccessTier, setNewBookAccessTier] = useState<'free' | 'registered' | 'restricted'>('free');
  const [newBookCoverImage, setNewBookCoverImage] = useState('/src/assets/images/patriot_book_geopolitics_1792591090680.jpg');
  const [newBookDescription, setNewBookDescription] = useState('');
  const [newBookToc, setNewBookToc] = useState(
    'Chapter 1: The Modern State\nChapter 2: Resource Security & Energy Realism\nChapter 3: Sovereign Trade Alliances\nChapter 4: Technological Hegemony\nChapter 5: Conclusions and Horizons'
  );
  const [newBookExcerpt, setNewBookExcerpt] = useState('');
  const [newBookCopyright, setNewBookCopyright] = useState('© 2026 The Patriot Publishing Council. Open Access CC BY-NC-ND 4.0.');
  const [newBookImportedFile, setNewBookImportedFile] = useState<string | null>(null);

  // New Research Paper Modal Form State
  const [isNewResearchOpen, setIsNewResearchOpen] = useState(false);
  const [newResearchTitle, setNewResearchTitle] = useState('');
  const [newResearchAbstract, setNewResearchAbstract] = useState('');
  const [newResearchMethodology, setNewResearchMethodology] = useState('');
  const [newResearchFindings, setNewResearchFindings] = useState('');
  const [newResearchAuthors, setNewResearchAuthors] = useState(currentUser?.name || 'Dr. Evelyn Vance');
  const [newResearchAffiliation, setNewResearchAffiliation] = useState('National Advanced Computing Directorate');
  const [newResearchDiscipline, setNewResearchDiscipline] = useState('Quantum Information & Systems');
  const [newResearchKeywords, setNewResearchKeywords] = useState('Quantum Fault Tolerance, Topological Qubits, Cryogenics');
  const [newResearchDoi, setNewResearchDoi] = useState('10.1038/patriot.2026.1042');
  const [newResearchJournal, setNewResearchJournal] = useState('The Patriot Review of Applied Physics');
  const [newResearchYear, setNewResearchYear] = useState(2026);
  const [newResearchPdfSize, setNewResearchPdfSize] = useState('3.8 MB');
  const [newResearchReferences, setNewResearchReferences] = useState(
    'Al-Mansoor, T. (2025). The Architecture of Sovereign Resilience. Geneva Press.\nVance, E. (2025). Decoherence Protocols in 128-Qubit Arrays. Nature Physics 21:112.'
  );
  const [newResearchIsOpenAccess, setNewResearchIsOpenAccess] = useState(true);
  const [newResearchImportedFile, setNewResearchImportedFile] = useState<string | null>(null);
  const [newResearchFrontPagePhotoUrl, setNewResearchFrontPagePhotoUrl] = useState('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80');
  const [newResearchFrontPagePhotoCaption, setNewResearchFrontPagePhotoCaption] = useState('Cryogenic dilution refrigerator and quantum topological bus array.');
  const [newResearchFrontPagePhotoCredit, setNewResearchFrontPagePhotoCredit] = useState('The Patriot Applied Physics Laboratory');
  const [newResearchIsFrontPageFeatured, setNewResearchIsFrontPageFeatured] = useState(true);

  // Appoint Staff / Sub-Administrator Modal State (Restricted to Wahab Ali Khiva)
  const [isAppointStaffOpen, setIsAppointStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('author');
  const [newStaffDepartment, setNewStaffDepartment] = useState('Geopolitics & Strategic Studies');
  const [newStaffTitle, setNewStaffTitle] = useState('Research Fellow');
  const [newStaffNotes, setNewStaffNotes] = useState('');
  const [newStaffVerificationTier, setNewStaffVerificationTier] = useState<any>('verified_scholar');
  const [newStaffPermissions, setNewStaffPermissions] = useState({
    canPublishDirectly: true,
    canReviewSubmissions: false,
    canModerateComments: false,
    canManageLibrary: false,
    canAccessAdminBureau: true,
  });
  const [staffActionError, setStaffActionError] = useState<string | null>(null);
  const [staffActionSuccess, setStaffActionSuccess] = useState<string | null>(null);

  // Letter to Editor Response State
  const [editorialReplyInput, setEditorialReplyInput] = useState<Record<string, string>>({});

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncement({
      ...announcement,
      message: annMessage,
      isEnabled: annEnabled,
    });
    setAnnSaved(true);
    setTimeout(() => setAnnSaved(false), 2500);
  };

  const handleLoadSampleArticle = () => {
    setNewTitle('The Strategic Autonomy Doctrine: Reimagining Energy Corridors in Eurasia');
    setNewSubtitle('How shifting bilateral currency swaps and trans-continental networks are transforming maritime security.');
    setNewCategory('Geopolitics & Economy');
    setNewArticleType('article');
    setNewTags('Geopolitics, Energy Security, Eurasia, Trade');
    setNewFeaturedImage('/src/assets/images/patriot_hero_diplomacy_1792591089041.jpg');
    setNewAuthorName(currentUser?.name || 'Editorial Fellow Marcus Vance');
    setNewAuthorAffiliation('Senior Fellow in Geopolitics, The Patriot Editorial Desk');
    setNewExcerpt('An investigative briefing on sovereign infrastructure initiatives and the reconfiguration of intercontinental logistics networks across key maritime chokepoints.');
    setNewContent(`## Executive Summary

Across the Eurasian landmass, the architecture of maritime shipping and sovereign debt settlement is undergoing a historic realignment. Over the past twenty-four months, multilateral trade arrangements have increasingly settled transactions outside conventional reserve currency clearing systems.

## I. The Infrastructure Dimension

The emergence of direct land-based multimodal transit corridors has diminished the strategic leverage historically maintained at maritime chokepoints.

> "True sovereignty in the twenty-first century is determined not merely by legal charters, but by physical resilience in energy, computing hardware, and currency settlement."

Rail connectivity between industrial manufacturing hubs and consumer ports now permits forty-eight-hour transit guarantees, bypassing vulnerabilities in traditional maritime choke points.

## II. Institutional Implications

For policy architects in Geneva and Washington, this paradigm shifts the calculus of national vulnerability. Capital account openness is no longer treated as an unmitigated virtue; rather, targeted strategic credit allocation has re-emerged as the primary instrument of state resilience.

## III. Editorial Outlook

The Patriot will continue to track these bilateral agreements as new customs harmonizations take effect in the upcoming quarter.`);
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const calculatedWords = newContent.trim().split(/\s+/).length;
    const readingTime = Math.max(2, Math.ceil(calculatedWords / 200));

    const newArt: Article = {
      id: `art-${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Analytical investigation by The Patriot Editorial Desk.',
      excerpt: newExcerpt.trim() || (newContent.slice(0, 160) + '...'),
      content: newContent.trim() || 'Full comprehensive editorial report will be dispatched shortly.',
      type: newArticleType,
      category: newCategory,
      tags: parsedTags.length > 0 ? parsedTags : ['Geopolitics', 'National Security'],
      featuredImage: newFeaturedImage,
      frontPagePhotoUrl: newFrontPagePhotoUrl || newFeaturedImage,
      frontPagePhotoCaption: newFrontPagePhotoCaption || 'Investigative visual dispatch by The Patriot Editorial Desk.',
      frontPagePhotoCredit: newFrontPagePhotoCredit || 'The Patriot Archives / Wire',
      isFrontPageFeatured: newIsFrontPageFeatured,
      author: {
        id: currentUser ? currentUser.id : `auth-${Date.now()}`,
        name: newAuthorName.trim() || (currentUser ? currentUser.name : 'Editorial Staff'),
        title: 'Editorial Fellow',
        affiliation: newAuthorAffiliation.trim() || 'The Patriot Publishing Council',
        avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        bio: 'Senior correspondent for The Patriot editorial council.',
        verified: true,
      },
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: readingTime,
      status: 'published',
      viewCount: 1,
    };

    addArticle(newArt);
    setIsNewArticleOpen(false);
    setPublishToast({
      id: newArt.id,
      title: newArt.title,
      type: 'article',
    });

    // Reset article form
    setNewTitle('');
    setNewSubtitle('');
    setNewContent('');
    setNewExcerpt('');
  };

  const handleLoadSampleBook = () => {
    setNewBookTitle('Sovereign Statecraft: The Architecture of Modern Strategic Independence');
    setNewBookSubtitle('Institutions, Industrial Planning, and National Resilience in an Era of Multipolarity');
    setNewBookAuthorName(currentUser?.name || 'Ambassador Julian Reed & Dr. Sarah Lin');
    setNewBookAuthorAffiliation('Patriot Institute for Advanced Geopolitics');
    setNewBookGenre('Geopolitics & Strategy');
    setNewBookYear(2026);
    setNewBookPages(312);
    setNewBookEdition('1st Critical Monograph Edition');
    setNewBookLanguage('English');
    setNewBookFormat('PDF');
    setNewBookFileSize('5.4 MB');
    setNewBookAccessTier('free');
    setNewBookCoverImage('/src/assets/images/patriot_book_geopolitics_1792591090680.jpg');
    setNewBookDescription('A comprehensive institutional treatise exploring how contemporary nation-states navigate supply chain vulnerability, sovereign credit systems, energy resilience, and critical technological sovereignty in an evolving international order.');
    setNewBookToc(
      'Chapter 1: The Return of Industrial Strategy\nChapter 2: Chokepoints and Sovereign Supply Chains\nChapter 3: Currency Clearing Networks Beyond Hegemony\nChapter 4: Technological Autonomy & Critical Minerals\nChapter 5: Defense Architecture and Domestic Innovation\nChapter 6: Synthesis and Future State Doctrines'
    );
    setNewBookExcerpt(
      'Chapter 1: The Return of Industrial Strategy\n\nFor nearly four decades, prevailing institutional consensus held that market integration alone could guarantee geopolitical stability. Today, that hypothesis faces historic headwinds. Strategic independence is not isolation; rather, it is the deliberate cultivation of foundational domestic capabilities—energy generation, industrial metallurgy, secure telecommunications, and sovereign computational capacity. Without these domestic bastions, diplomatic freedom is an illusion.'
    );
    setNewBookCopyright('© 2026 The Patriot Publishing Council. Open Access CC BY-NC-ND 4.0.');
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    const parsedToc = newBookToc
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    const newVolume: EBook = {
      id: `book-${Date.now()}`,
      slug: newBookTitle.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      title: newBookTitle.trim(),
      subtitle: newBookSubtitle.trim() || undefined,
      author: {
        id: currentUser ? currentUser.id : `auth-${Date.now()}`,
        name: newBookAuthorName.trim() || (currentUser ? currentUser.name : 'The Patriot Editorial Board'),
        title: 'Monograph Author',
        affiliation: newBookAuthorAffiliation.trim() || 'The Patriot Publishing Council',
        avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        bio: 'Scholar and contributor to the Patriot Digital E-Book Library.',
        verified: true,
      },
      description: newBookDescription.trim() || 'Scholarly monograph published under the authority of The Patriot Digital Media and Library Archive.',
      coverImage: newBookCoverImage,
      genre: newBookGenre,
      language: newBookLanguage,
      publishedYear: Number(newBookYear) || 2026,
      edition: newBookEdition.trim() || '1st Edition',
      pages: Number(newBookPages) || 200,
      fileFormat: newBookFormat,
      fileSize: newBookFileSize.trim() || '4.0 MB',
      accessTier: newBookAccessTier,
      rating: 5.0,
      ratingCount: 1,
      tableOfContents: parsedToc.length > 0 ? parsedToc : ['Chapter 1: Introduction', 'Chapter 2: Analysis', 'Chapter 3: Conclusion'],
      sampleChapterExcerpt: newBookExcerpt.trim() || 'Preview chapter excerpt is being digitized by the editorial archives.',
      downloadCount: 0,
      copyrightNotice: newBookCopyright.trim() || '© 2026 The Patriot Publishing Council.',
      status: 'published',
    };

    addEBook(newVolume);
    setIsNewBookOpen(false);
    setPublishToast({
      id: newVolume.id,
      title: newVolume.title,
      type: 'book',
    });

    // Reset book form
    setNewBookTitle('');
    setNewBookSubtitle('');
    setNewBookDescription('');
    setNewBookExcerpt('');
    setNewBookImportedFile(null);
  };

  const handleResearchFileImported = (data: ExtractedDocumentData) => {
    setNewResearchImportedFile(data.fileName || null);
    if (data.title) setNewResearchTitle(data.title);
    if (data.abstractOrExcerpt) setNewResearchAbstract(data.abstractOrExcerpt);
    if (data.authors) setNewResearchAuthors(data.authors);
    if (data.disciplineOrGenre) setNewResearchDiscipline(data.disciplineOrGenre);
    if (data.methodology) setNewResearchMethodology(data.methodology);
    if (data.findings) setNewResearchFindings(data.findings);
    if (data.doi) setNewResearchDoi(data.doi);
    if (data.keywords) setNewResearchKeywords(data.keywords);
    if (data.fileSize) setNewResearchPdfSize(data.fileSize);
    if (data.references && data.references.length > 0) {
      setNewResearchReferences(data.references.join('\n'));
    }
  };

  const handleBookFileImported = (data: ExtractedDocumentData) => {
    setNewBookImportedFile(data.fileName || null);
    if (data.title) setNewBookTitle(data.title);
    if (data.subtitle) setNewBookSubtitle(data.subtitle);
    if (data.authors) setNewBookAuthorName(data.authors);
    if (data.disciplineOrGenre) setNewBookGenre(data.disciplineOrGenre);
    if (data.pageCount) setNewBookPages(data.pageCount);
    if (data.fileSize) setNewBookFileSize(data.fileSize);
    if (data.fileFormat === 'EPUB') setNewBookFormat('EPUB');
    if (data.fileFormat === 'PDF') setNewBookFormat('PDF');
    if (data.abstractOrExcerpt) {
      setNewBookExcerpt(data.abstractOrExcerpt);
      if (!newBookDescription) setNewBookDescription(data.abstractOrExcerpt.slice(0, 200) + '...');
    }
    if (data.tableOfContents && data.tableOfContents.length > 0) {
      setNewBookToc(data.tableOfContents.join('\n'));
    }
  };

  const handleCreateResearchPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResearchTitle.trim()) return;

    const parsedKeywords = newResearchKeywords
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const parsedRefs = newResearchReferences
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const newPaper: ResearchPaper = {
      id: `res-${Date.now()}`,
      slug: newResearchTitle.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
      title: newResearchTitle.trim(),
      abstract: newResearchAbstract.trim() || 'Scholarly paper registered with The Patriot Research Repository.',
      methodology: newResearchMethodology.trim() || 'Empirical research methodology details filed with repository archives.',
      findings: newResearchFindings.trim() || 'Empirical findings and results documented in full manuscript.',
      authors: [
        {
          id: currentUser ? currentUser.id : `auth-${Date.now()}`,
          name: newResearchAuthors.trim() || (currentUser ? currentUser.name : 'Dr. Evelyn Vance'),
          title: 'Principal Investigator',
          affiliation: newResearchAffiliation.trim() || 'The Patriot Directorate of Research',
          avatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
          bio: 'Investigator contributing peer-reviewed research to The Patriot Repository.',
          verified: true,
          verificationTier: 'verified_scholar',
        },
      ],
      discipline: newResearchDiscipline,
      keywords: parsedKeywords.length > 0 ? parsedKeywords : ['Research', 'Sovereignty', 'Applied Science'],
      publishedAt: new Date().toISOString(),
      doi: newResearchDoi.trim() || `10.1038/patriot.2026.${Math.floor(1000 + Math.random() * 9000)}`,
      citationInfo: {
        doi: newResearchDoi.trim() || '10.1038/patriot.2026.1042',
        journal: newResearchJournal.trim() || 'The Patriot Review of Applied Physics',
        year: Number(newResearchYear) || 2026,
        volume: '15',
        issue: '1',
        pages: '1-24',
      },
      references: parsedRefs.length > 0 ? parsedRefs : ['The Patriot Repository of Research, Vol 1 (2026).'],
      pdfSize: newResearchPdfSize.trim() || '3.5 MB',
      isPeerReviewed: true,
      isOpenAccess: newResearchIsOpenAccess,
      downloadCount: 0,
      citationCount: 0,
      version: 'v1.0 (Preprint)',
      status: 'published',
      frontPagePhotoUrl: newResearchFrontPagePhotoUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
      frontPagePhotoCaption: newResearchFrontPagePhotoCaption || 'Topological stabilizer validation array apparatus.',
      frontPagePhotoCredit: newResearchFrontPagePhotoCredit || 'The Patriot Applied Physics Laboratory',
      isFrontPageFeatured: newResearchIsFrontPageFeatured,
    };

    addResearchPaper(newPaper);
    setIsNewResearchOpen(false);
    setPublishToast({
      id: newPaper.id,
      title: newPaper.title,
      type: 'book',
    });

    // Reset research form
    setNewResearchTitle('');
    setNewResearchAbstract('');
    setNewResearchMethodology('');
    setNewResearchFindings('');
    setNewResearchImportedFile(null);
  };

  const handleAppointStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffActionError(null);
    setStaffActionSuccess(null);

    if (!newStaffName.trim() || !newStaffEmail.trim()) {
      setStaffActionError('Candidate name and institutional email are required.');
      return;
    }

    const result = appointStaffMember({
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      department: newStaffDepartment.trim(),
      title: newStaffTitle.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      permissions: newStaffPermissions,
      status: 'active',
      verificationTier: newStaffVerificationTier,
      notes: newStaffNotes.trim(),
    });

    if (result.success) {
      setStaffActionSuccess(`Staff Mandate Successfully Issued for ${newStaffName} as ${newStaffRole.replace('_', ' ').toUpperCase()}.`);
      setIsAppointStaffOpen(false);
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffNotes('');
      setTimeout(() => setStaffActionSuccess(null), 4000);
    } else {
      setStaffActionError(result.error || 'Failed to appoint staff member.');
    }
  };

  const handleToggleStaffStatus = (staff: StaffMember) => {
    setStaffActionError(null);
    const newStatus = staff.status === 'active' ? 'suspended' : 'active';
    const result = updateStaffMember(staff.id, { status: newStatus });
    if (!result.success) {
      setStaffActionError(result.error || 'Unauthorized action.');
      setTimeout(() => setStaffActionError(null), 4000);
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    setStaffActionError(null);
    if (!window.confirm('Are you sure you want to permanently revoke this staff mandate and decommission their administrative/editorial privileges?')) {
      return;
    }
    const result = removeStaffMember(staffId);
    if (!result.success) {
      setStaffActionError(result.error || 'Unauthorized action.');
      setTimeout(() => setStaffActionError(null), 4000);
    }
  };

  const handlePublishLetter = (letterId: string) => {
    const response = editorialReplyInput[letterId];
    updateLetterStatus(letterId, 'published', response);
  };

  const handleExportArchiveManifest = () => {
    const manifest = {
      platform: 'THE PATRIOT',
      sovereignAuthority: 'Wahab Ali Khiva (wahabalikhiva@gmail.com)',
      exportedAt: new Date().toISOString(),
      articlesCount: articles.length,
      researchCount: researchPapers.length,
      ebooksCount: ebooks.length,
      articles,
      researchPapers,
      ebooks,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-patriot-catalog-manifest-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setLaunchActionToast('Sovereign Publication Manifest exported successfully.');
    setTimeout(() => setLaunchActionToast(null), 3000);
  };

  const handleCreateBreakingNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBreakingHeadline.trim()) return;
    addBreakingNews({
      headline: newBreakingHeadline.trim(),
      category: newBreakingCategory,
      timestamp: 'Just now',
      source: newBreakingSource.trim() || 'Central Bureau',
      isUrgent: true,
    });
    setNewBreakingHeadline('');
    setLaunchActionToast('Live Breaking bulletin transmitted to broadsheet.');
    setTimeout(() => setLaunchActionToast(null), 3000);
  };

  const handleConfirmClearCatalog = () => {
    clearAllPublications();
    setClearConfirmOpen(false);
    setLaunchActionToast('All publications cleared. Catalog initialized for launch.');
    setTimeout(() => setLaunchActionToast(null), 3000);
  };

  const handleDeployInaugural = () => {
    loadInauguralEdition();
    setLaunchActionToast('Official Inaugural Launch Edition deployed under Wahab Ali Khiva.');
    setTimeout(() => setLaunchActionToast(null), 3000);
  };

  // Metrics
  const totalViews = articles.reduce((acc, a) => acc + a.viewCount, 0);
  const totalDownloads = ebooks.reduce((acc, b) => acc + b.downloadCount, 0) + researchPapers.reduce((acc, p) => acc + p.downloadCount, 0);
  const reportedComments = comments.filter(c => c.status === 'reported');
  const pendingVerifications = verificationApplications.filter(v => v.status === 'pending');

  // Sovereign Editorial Clearance Queue (Wahab Ali Khiva Gatekeeper)
  const pendingArticles = articles.filter(a => a.status === 'pending_approval' || a.needsAdminApproval);
  const pendingResearch = researchPapers.filter(p => p.status === 'pending_approval' || p.needsAdminApproval);
  const pendingBooks = ebooks.filter(b => b.status === 'pending_approval' || b.needsAdminApproval);
  const pendingClearancesCount = pendingArticles.length + pendingResearch.length + pendingBooks.length;

  // Strict Sovereign Access Control Check
  const hasBureauAccess =
    isMasterAdmin ||
    role === 'administrator' ||
    role === 'editor' ||
    staffMembers.some(s => s.email.toLowerCase() === currentUser?.email?.toLowerCase() && s.status === 'active') ||
    currentUser?.email === 'wahabalikhiva@gmail.com';

  if (!currentUser || !hasBureauAccess) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
            Sovereign Access Control Gatekeeper
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Editorial Bureau Clearance Required
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            The Central Editorial & Publishing Bureau is strictly restricted to Sovereign Master{' '}
            <strong>Wahab Ali Khiva</strong> (<code>wahabalikhiva@gmail.com</code>) and appointed Bureau editors. Readers and non-credentialed accounts do not hold publishing or administrative authority.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Sign In with Bureau Credentials
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            Return to Front Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 dark:text-stone-100">
              The Patriot Editorial & Platform Bureau
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Logged in as <strong className="text-slate-800 dark:text-stone-200">{currentUser?.name}</strong> ({role.toUpperCase()})
            {isMasterAdmin && (
              <span className="ml-2 font-mono text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                Master Sovereign: Wahab Ali Khiva
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-center">
          <button
            onClick={() => setIsNewArticleOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Article</span>
          </button>
          <button
            onClick={() => setIsNewResearchOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import & Publish Research</span>
          </button>
          <button
            onClick={() => setIsNewBookOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Import & Publish E-Book</span>
          </button>
          {isMasterAdmin && (
            <button
              onClick={() => setIsAppointStaffOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-stone-100 dark:text-slate-900 dark:hover:bg-white text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs border border-amber-500/40"
              title="Exclusive Platform Owner Authority (Wahab Ali Khiva)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Appoint Author / Sub-Admin</span>
            </button>
          )}
          {isMasterAdmin && (
            <button
              onClick={() => {
                setAdminPassMessage(null);
                setAdminNewPassword('');
                setAdminConfirmPassword('');
                setRenewPasswordModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs border border-amber-300 dark:border-amber-700"
              title="Renew Master Administrator Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Renew Admin Password</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Action Feedback Banners */}
      {staffActionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{staffActionSuccess}</span>
          </div>
          <button onClick={() => setStaffActionSuccess(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {staffActionError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{staffActionError}</span>
          </div>
          <button onClick={() => setStaffActionError(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-xl text-xs overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
          { 
            id: 'approval', 
            label: `Clearance Queue (${pendingClearancesCount} pending)`, 
            icon: ShieldAlert, 
            highlight: pendingClearancesCount > 0,
            badge: pendingClearancesCount > 0 ? `${pendingClearancesCount}` : undefined
          },
          { id: 'staff', label: `Staff & Access Control (${staffMembers.length})`, icon: Lock, highlight: true },
          { id: 'articles', label: `Articles (${articles.length})`, icon: FileText },
          { id: 'research', label: `Research & Manuscripts (${researchPapers.length})`, icon: BookOpen },
          { id: 'books', label: `E-Books & Volumes (${ebooks.length})`, icon: Bookmark },
          { id: 'letters', label: `Letters to Editor (${letters.length})`, icon: Mail, dawnTag: true },
          { id: 'moderation', label: `Moderation (${reportedComments.length} flagged)`, icon: MessageSquare },
          { id: 'verifications', label: `Verifications (${pendingVerifications.length} pending)`, icon: GraduationCap },
          { id: 'homepage', label: 'Homepage & Dispatches', icon: Megaphone },
          { id: 'takedowns', label: `Takedown Inquiries (${takedownReports.length})`, icon: AlertTriangle },
          { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              } ${tab.highlight ? 'text-amber-700 dark:text-amber-400 font-semibold' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview & KPIs */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Readership</span>
              <p className="text-3xl font-serif font-black text-slate-900 dark:text-stone-100 mt-2 tabular-nums">
                {totalViews.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">+18.4% weekly traffic</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Document Downloads</span>
              <p className="text-3xl font-serif font-black text-slate-900 dark:text-stone-100 mt-2 tabular-nums">
                {totalDownloads.toLocaleString()}
              </p>
              <span className="text-[11px] text-stone-400">PDF & EPUB publications</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Discussions</span>
              <p className="text-3xl font-serif font-black text-slate-900 dark:text-stone-100 mt-2 tabular-nums">
                {comments.length}
              </p>
              <span className="text-[11px] text-amber-600 font-medium">{comments.filter(c => c.isQuestion).length} technical inquiries</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Editorial Subscribers</span>
              <p className="text-3xl font-serif font-black text-slate-900 dark:text-stone-100 mt-2 tabular-nums">
                {subscribers.length.toLocaleString()}
              </p>
              <span className="text-[11px] text-stone-400">Verified email recipients</span>
            </div>
          </div>

          {/* Launch Action Feedback Toast Banner */}
          {launchActionToast && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-medium text-sm">{launchActionToast}</span>
              </div>
              <button onClick={() => setLaunchActionToast(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SOVEREIGN CATALOG LAUNCH OPERATIONS BUREAU (Exclusive to Wahab Ali Khiva) */}
          <div className="bg-gradient-to-r from-stone-900 via-slate-900 to-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-amber-600/40 shadow-lg relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sovereign Governance · Master Bureau</span>
                  <span className="text-stone-600">|</span>
                  <span>Owner: Wahab Ali Khiva</span>
                </div>
                <h2 className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-white">
                  Catalog Launch Operations & Sovereign Purge Bureau
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-serif leading-relaxed">
                  Manage platform launch state, wipe previous publications to establish a clean broadsheet slate, or deploy certified inaugural dispatches.
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2.5 text-center">
                  <span className="block text-[10px] font-mono uppercase text-stone-400">Articles</span>
                  <span className="font-serif font-bold text-xl text-amber-400">{articles.length}</span>
                </div>
                <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2.5 text-center">
                  <span className="block text-[10px] font-mono uppercase text-stone-400">Research</span>
                  <span className="font-serif font-bold text-xl text-blue-400">{researchPapers.length}</span>
                </div>
                <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2.5 text-center">
                  <span className="block text-[10px] font-mono uppercase text-stone-400">E-Books</span>
                  <span className="font-serif font-bold text-xl text-emerald-400">{ebooks.length}</span>
                </div>
              </div>
            </div>

            {/* Launch Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* 1-Click Clear Catalog */}
                <button
                  onClick={() => setClearConfirmOpen(true)}
                  className="px-4 py-2.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  title="Purge all existing articles, research papers, and e-books to initialize clean launch slate"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Publications (Pristine Launch Slate)</span>
                </button>

                {/* 1-Click Deploy Inaugural Launch Edition */}
                <button
                  onClick={handleDeployInaugural}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  title="Deploy certified launch dispatches authored by Wahab Ali Khiva and verified scholars"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Deploy Sovereign Inaugural Edition</span>
                </button>
              </div>

              {/* JSON Export Button */}
              <button
                onClick={handleExportArchiveManifest}
                className="px-4 py-2.5 border border-stone-700 hover:border-stone-500 hover:bg-stone-800 text-stone-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                title="Download complete JSON archive manifest of publications"
              >
                <Download className="w-4 h-4" />
                <span>Export Catalog Manifest (JSON)</span>
              </button>
            </div>
          </div>

          {/* CNN & BBC STYLE LIVE BREAKING WIRE TRANSMISSION CONSOLE */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>CNN & BBC Standard · Live Breaking Wire Console</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 mt-1">
                  Transmit Live Breaking Dispatch to Viewport
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                {breakingNews.length} active live wire dispatches
              </span>
            </div>

            {/* Form to Push Urgent Bulletin */}
            <form onSubmit={handleCreateBreakingNews} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7">
                  <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                    Breaking Dispatch Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={newBreakingHeadline}
                    onChange={e => setNewBreakingHeadline(e.target.value)}
                    placeholder="e.g. Sovereign Central Banks Formalize Non-Dollar Trade Settlement Protocol"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newBreakingCategory}
                    onChange={e => setNewBreakingCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                  >
                    <option value="GEOPOLITICS & ECONOMY">GEOPOLITICS & ECONOMY</option>
                    <option value="TECHNOLOGY & DEFENSE">TECHNOLOGY & DEFENSE</option>
                    <option value="FINANCIAL DESK">FINANCIAL DESK</option>
                    <option value="ACADEMIC REPOSITORY">ACADEMIC REPOSITORY</option>
                    <option value="SPECIAL DISPATCH">SPECIAL DISPATCH</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                    Bureau Source
                  </label>
                  <input
                    type="text"
                    value={newBreakingSource}
                    onChange={e => setNewBreakingSource(e.target.value)}
                    placeholder="Geneva Bureau"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Transmit Live Wire Bulletin</span>
                </button>
              </div>
            </form>

            {/* List of Active Breaking News */}
            <div className="pt-2 divide-y divide-stone-100 dark:divide-slate-800/80">
              {breakingNews.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold uppercase shrink-0">
                      {item.category}
                    </span>
                    <span className="truncate font-medium text-slate-800 dark:text-stone-200">
                      {item.headline}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                      ({item.source} · {item.timestamp})
                    </span>
                  </div>
                  <button
                    onClick={() => removeBreakingNews(item.id)}
                    className="text-stone-400 hover:text-rose-600 cursor-pointer p-1 shrink-0"
                    title="Remove breaking bulletin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CONFIRM CLEAR CATALOG MODAL */}
          {clearConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 border border-rose-500/50 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-8 h-8 shrink-0" />
                  <div>
                    <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100">
                      Confirm Sovereign Catalog Purge
                    </h3>
                    <p className="text-xs text-stone-500">Master Administrator Authority: Wahab Ali Khiva</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
                  Are you certain you want to clear all currently loaded articles ({articles.length}), research papers ({researchPapers.length}), and e-books ({ebooks.length})?
                  <br /><br />
                  This will place the platform in a pristine launch state. You can restore the certified inaugural launch edition at any time using the 1-click restore button.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setClearConfirmOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClearCatalog}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Wipe & Clear All Publications
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recharts Analytics Visualization Component */}
          <EngagementAnalyticsChart />

          {/* Admin Publishing Bureau Action Consoles (4-Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Article Dispatch */}
            <div className="bg-gradient-to-br from-amber-50/70 to-stone-50 dark:from-slate-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Editorial Dispatches</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 mt-1.5">
                  Publish Article
                </h3>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                  Investigative briefings, geopolitical analyses, and frontpage broadsheets.
                </p>
              </div>
              <button
                onClick={() => setIsNewArticleOpen(true)}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Author Article</span>
              </button>
            </div>

            {/* 2. Research Paper with Import */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-stone-50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Research & Preprints</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 mt-1.5">
                  Import Research Paper
                </h3>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                  Import PDF/DOCX manuscripts with auto metadata & citation extraction.
                </p>
              </div>
              <button
                onClick={() => setIsNewResearchOpen(true)}
                className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Import & Publish</span>
              </button>
            </div>

            {/* 3. E-Book with Import */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-stone-50 dark:from-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>E-Book Library</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 mt-1.5">
                  Import E-Book Volume
                </h3>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                  Catalog monographs with PDF/EPUB import, chapter TOC, and excerpts.
                </p>
              </div>
              <button
                onClick={() => setIsNewBookOpen(true)}
                className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Import & Catalog</span>
              </button>
            </div>

            {/* 4. Sovereign Access Control (Owner: Wahab Ali Khiva) */}
            <div className="bg-gradient-to-br from-stone-900 to-slate-950 text-stone-100 border border-amber-500/40 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sovereign Access</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-white mt-1.5">
                  Appoint Staff
                </h3>
                <p className="text-[11px] text-stone-300 mt-1">
                  Appoint new Authors, Senior Editors, or Sub-Administrators. Exclusive to Wahab Ali Khiva.
                </p>
              </div>
              <button
                onClick={() => {
                  if (isMasterAdmin) {
                    setIsAppointStaffOpen(true);
                  } else {
                    setActiveTab('staff');
                  }
                }}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff Control</span>
              </button>
            </div>
          </div>

          {/* Recent Editorial Content Table */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                Latest Editorial Dispatches
              </h3>
              <button onClick={() => setActiveTab('articles')} className="text-xs text-amber-700 dark:text-amber-400 hover:underline">
                View All Dispatches
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Reads</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                  {articles.slice(0, 4).map(a => (
                    <tr key={a.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-serif font-semibold">{a.title}</td>
                      <td className="p-4 text-stone-500">{a.category}</td>
                      <td className="p-4">{a.author.name}</td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-emerald-600">{a.status}</span>
                      </td>
                      <td className="p-4 tabular-nums">{a.viewCount.toLocaleString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => navigateTo('article-detail', a.id)}
                          className="text-amber-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sovereign Editorial Clearance Queue (Wahab Ali Khiva Gatekeeper) */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          {/* Sovereign Security & Approval Mandate Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white border border-amber-900/50 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-[11px] font-semibold tracking-wider uppercase font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sovereign Gatekeeper · Editorial Clearance Bureau</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                  Mandatory Publication Clearances
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  Authors submitting articles or research papers must have mandatory sign-off from{' '}
                  <strong className="text-amber-400">Wahab Ali Khiva (wahabalikhiva@gmail.com)</strong>. No content is released to the front page without executive clearance.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span>Pending Review: <strong className="text-amber-400">{pendingClearancesCount} Submissions</strong></span>
                  <span>•</span>
                  <span>Authority: <strong className={isMasterAdmin ? 'text-emerald-400' : 'text-slate-400'}>Wahab Ali Khiva</strong></span>
                </div>
              </div>

              <div className="shrink-0">
                {isMasterAdmin ? (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Sovereign Key Active · 1-Click Clearances Enabled</span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-400 text-xs flex items-center gap-2 font-mono">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Approvals Locked to Wahab Ali Khiva</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pending Submissions Queue List */}
          {pendingClearancesCount === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                All Submissions Cleared & Up to Date
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                There are currently no author articles, research papers, or monograph volumes waiting in the editorial clearance queue.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Pending Articles */}
              {pendingArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono">
                          Editorial Article Submission
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {new Date(art.publishedAt).toLocaleDateString()}
                        </span>
                        {art.isFrontPageFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-950" /> Front Page Hero Requested
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {art.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">By {art.author.name}</span>
                        <span>•</span>
                        <span>{art.author.affiliation}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('article-detail', art.id)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Draft</span>
                      </button>
                    </div>
                  </div>

                  {/* Front-Page Photos Verification Block */}
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                      <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Author's Front Page Visual Package</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-stone-200 dark:border-slate-700 shadow-sm">
                        <img
                          src={art.frontPagePhotoUrl || art.featuredImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5 text-xs">
                        <div>
                          <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">Front Page Caption:</span>
                          <p className="text-slate-800 dark:text-slate-200 italic mt-0.5">
                            "{art.frontPagePhotoCaption || 'No caption provided.'}"
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">Photo Attribution / Credit:</span>
                          <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] mt-0.5">
                            {art.frontPagePhotoCredit || 'Independent Author Contribution'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Actions (Wahab Ali Khiva) */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Add reviewer notes or certification instructions..."
                      value={clearanceNoteInput[art.id] || ''}
                      onChange={e => setClearanceNoteInput({ ...clearanceNoteInput, [art.id]: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectPublication(art.id, 'article', clearanceNoteInput[art.id] || 'Requires revision prior to release.')}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => approvePublication(art.id, 'article', clearanceNoteInput[art.id])}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Release to Front Page</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 2. Pending Research Papers */}
              {pendingResearch.map(paper => (
                <div
                  key={paper.id}
                  className="bg-white dark:bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                          Academic Research Preprint
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          DOI: {paper.doi}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Authors: {paper.authors.map(a => a.name).join(', ')}</span>
                        <span>•</span>
                        <span>{paper.discipline}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('research-detail', paper.id)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Paper</span>
                      </button>
                    </div>
                  </div>

                  {/* Front-Page Photos Verification Block */}
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Front Page Visual & Experimental Imagery</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-stone-200 dark:border-slate-700 shadow-sm">
                        <img
                          src={paper.frontPagePhotoUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5 text-xs">
                        <div>
                          <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">Photo Caption:</span>
                          <p className="text-slate-800 dark:text-slate-200 italic mt-0.5">
                            "{paper.frontPagePhotoCaption || 'Empirical research validation laboratory.'}"
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">Credit:</span>
                          <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] mt-0.5">
                            {paper.frontPagePhotoCredit || 'Research Group Archives'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clearance Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Add peer review clearance notes..."
                      value={clearanceNoteInput[paper.id] || ''}
                      onChange={e => setClearanceNoteInput({ ...clearanceNoteInput, [paper.id]: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => rejectPublication(paper.id, 'research', clearanceNoteInput[paper.id] || 'Requires methodological peer review.')}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => approvePublication(paper.id, 'research', clearanceNoteInput[paper.id])}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Release to Repository</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Sovereign Staff Governance & Access Control (Owner: Wahab Ali Khiva) */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Sovereign Mandate Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-slate-950 text-white border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-[11px] font-semibold tracking-wider uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sovereign Platform Governance · Exclusive Master Authority</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-stone-100">
                  Wahab Ali Khiva Executive Registry
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  Only <strong className="text-amber-400 font-semibold">Wahab Ali Khiva (wahabalikhiva@gmail.com)</strong> possesses 
                  the constitutional power to appoint Authors, Senior Editors, or Sub-Administrators across The Patriot platform. 
                  Sub-administrators and other personnel are strictly prevented from appointing or promoting any staff members.
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-stone-400 font-mono">
                  <span>Platform Owner: wahabalikhiva@gmail.com</span>
                  <span>·</span>
                  <span className={isMasterAdmin ? 'text-emerald-400 font-bold' : 'text-stone-400'}>
                    {isMasterAdmin ? '● You are verified as Sovereign Owner' : '○ Non-Owner Session (Read-Only Mandate)'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {isMasterAdmin ? (
                  <button
                    onClick={() => setIsAppointStaffOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all border border-amber-400/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Appoint Author / Sub-Admin</span>
                  </button>
                ) : (
                  <div className="px-4 py-3 bg-stone-800/80 border border-stone-700 rounded-xl text-stone-400 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Appointments Restricted to Wahab Ali Khiva</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Staff Roster & Directory */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100 flex items-center gap-2">
                  <span>Authorized Staff & Editorial Fellows</span>
                  <span className="text-xs font-normal text-stone-500 font-sans">({staffMembers.length} active appointees)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Complete directory of certified authors, peer-review editors, and administrative fellows.
                </p>
              </div>

              {isMasterAdmin && (
                <button
                  onClick={() => setIsAppointStaffOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Appointment</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider border-b border-stone-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Staff Member & Title</th>
                    <th className="p-4">Appointed Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Granted Permissions</th>
                    <th className="p-4">Appointed By</th>
                    <th className="p-4">Status</th>
                    {isMasterAdmin && <th className="p-4">Sovereign Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                  {staffMembers.map(staff => {
                    const isOwner = staff.email === 'wahabalikhiva@gmail.com';
                    return (
                      <tr key={staff.id} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-9 h-9 rounded-full object-cover border border-amber-600/30"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="font-serif text-sm font-bold text-slate-900 dark:text-stone-100">
                                  {staff.name}
                                </strong>
                                {isOwner && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded text-[9px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-700">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-500 font-mono">{staff.email}</p>
                              <p className="text-[11px] text-stone-600 dark:text-stone-400">{staff.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                              staff.role === 'administrator'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                                : staff.role === 'sub_administrator'
                                ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-800'
                                : staff.role === 'editor'
                                ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-800'
                                : 'bg-stone-100 text-stone-900 dark:bg-slate-800 dark:text-stone-200 border border-stone-200 dark:border-slate-700'
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            <span>{staff.role.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="p-4 text-stone-600 dark:text-stone-400 font-medium">
                          {staff.department}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {staff.permissions.canPublishDirectly && (
                              <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-medium border border-emerald-200 dark:border-emerald-800">
                                Publish
                              </span>
                            )}
                            {staff.permissions.canReviewSubmissions && (
                              <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium border border-blue-200 dark:border-blue-800">
                                Review
                              </span>
                            )}
                            {staff.permissions.canModerateComments && (
                              <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-medium border border-indigo-200 dark:border-indigo-800">
                                Moderate
                              </span>
                            )}
                            {staff.permissions.canManageLibrary && (
                              <span className="px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded text-[10px] font-medium border border-teal-200 dark:border-teal-800">
                                Library
                              </span>
                            )}
                            {staff.permissions.canAccessAdminBureau && (
                              <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded text-[10px] font-medium border border-amber-200 dark:border-amber-800">
                                Bureau
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-stone-500 font-mono text-[11px]">
                          {staff.appointedBy}
                          <span className="block text-[10px] text-stone-400">{new Date(staff.appointedAt).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              staff.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                            <span>{staff.status}</span>
                          </span>
                        </td>
                        {isMasterAdmin && (
                          <td className="p-4">
                            {isOwner ? (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold italic">
                                Permanent Sovereign
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleStaffStatus(staff)}
                                  className="px-2.5 py-1 text-xs font-medium rounded border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                  title={staff.status === 'active' ? 'Suspend privileges' : 'Reactivate privileges'}
                                >
                                  {staff.status === 'active' ? 'Suspend' : 'Reactivate'}
                                </button>
                                <button
                                  onClick={() => handleRemoveStaff(staff.id)}
                                  className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
                                  title="Permanently revoke staff mandate"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff Governance Audit Log */}
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                <h4 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                  Sovereign Staff Governance Audit Log
                </h4>
              </div>
              <span className="text-xs text-stone-500 font-mono">{staffAuditLogs.length} immutable events recorded</span>
            </div>

            <div className="space-y-3">
              {staffAuditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-stone-50/70 dark:bg-slate-800/40 border border-stone-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900">
                        {log.action.replace('_', ' ')}
                      </span>
                      <strong className="text-slate-900 dark:text-stone-100 font-semibold">{log.targetStaffName || log.targetUserName}</strong>
                      <span className="text-stone-500 font-mono">({log.targetRole || log.targetUserEmail || 'Staff'})</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400">{log.details}</p>
                  </div>
                  <div className="text-right shrink-0 text-[11px] text-stone-400 font-mono">
                    <div>By: {log.executedBy || log.performedBy}</div>
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Letters to the Editor (Dawn Broadside Forum) */}
      {activeTab === 'letters' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs space-y-6 p-6">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold uppercase tracking-wider">
                  Dawn Broadsheet Editorial Standard
                </span>
                <span className="text-xs text-stone-400">· Public Reader Agora</span>
              </div>
              <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100 mt-1">
                Letters to the Editor Forum Management
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Review, publish, and formulate editorial replies for reader letters from Karachi, Islamabad, Geneva, and Washington.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {letters.map(letter => (
              <div
                key={letter.id}
                className="p-5 border border-stone-200 dark:border-slate-800 rounded-xl bg-stone-50/50 dark:bg-slate-800/30 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-slate-700/60 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {letter.topic}
                    </span>
                    <h4 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100 mt-0.5">
                      {letter.title || letter.subject}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      By <strong className="text-slate-800 dark:text-stone-200">{letter.authorName || letter.writerName}</strong> ({letter.authorLocation || letter.cityOrCountry})
                      {(letter.authorAffiliation || letter.writerEmail) && ` · ${letter.authorAffiliation || letter.writerEmail}`}
                      <span className="font-mono text-stone-400"> · {letter.authorEmail || letter.writerEmail}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      letter.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : letter.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-stone-200 text-stone-800 dark:bg-slate-700 dark:text-stone-300'
                    }`}
                  >
                    ● {letter.status}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-stone-100 dark:border-slate-800 text-sm font-serif leading-relaxed text-slate-800 dark:text-stone-200 italic">
                  "{letter.content}"
                </div>

                {(letter.editorialReply || letter.editorialResponse) && (
                  <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                    <span className="font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 text-[10px] block mb-1">
                      Editorial Desk Reply Published:
                    </span>
                    <p className="font-serif text-slate-800 dark:text-stone-200">
                      {letter.editorialReply || letter.editorialResponse}
                    </p>
                  </div>
                )}

                {/* Editorial Reply & Action Console */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    placeholder="Draft optional Editorial Board reply for the broadsheet edition..."
                    value={editorialReplyInput[letter.id] !== undefined ? editorialReplyInput[letter.id] : (letter.editorialReply || letter.editorialResponse || '')}
                    onChange={e => setEditorialReplyInput({ ...editorialReplyInput, [letter.id]: e.target.value })}
                    className="flex-1 p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePublishLetter(letter.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{letter.status === 'published' ? 'Update Reply' : 'Publish to Forum'}</span>
                    </button>
                    {letter.status !== 'archived' && (
                      <button
                        onClick={() => updateLetterStatus(letter.id, 'archived')}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                      >
                        Archive
                      </button>
                    )}
                    {letter.status !== 'rejected' && (
                      <button
                        onClick={() => updateLetterStatus(letter.id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Articles Management */}
      {activeTab === 'articles' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
              Manage Articles & Analytical Essays
            </h3>
            <button
              onClick={() => setIsNewArticleOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg cursor-pointer"
            >
              + Create Article
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Headline</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Published</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-serif font-semibold max-w-sm truncate">{a.title}</td>
                    <td className="p-4 text-stone-500">{a.category}</td>
                    <td className="p-4">{a.author.name}</td>
                    <td className="p-4">{new Date(a.publishedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select
                        value={a.status}
                        onChange={e => updateArticle(a.id, { status: e.target.value as any })}
                        className="bg-transparent border border-stone-300 dark:border-slate-700 rounded p-1 text-xs"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('article-detail', a.id)}
                        className="text-stone-600 hover:text-amber-600 cursor-pointer"
                        title="View article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteArticle(a.id)}
                        className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Research Management */}
      {activeTab === 'research' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                Manage Academic Papers & Preprints
              </h3>
              <span className="text-xs text-stone-500">{researchPapers.length} monographs registered</span>
            </div>
            <button
              onClick={() => setIsNewResearchOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>+ Import & Publish Research</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Title & DOI</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Citations</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Access</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                {researchPapers.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <p className="font-serif font-semibold">{p.title}</p>
                      <p className="font-mono text-[10px] text-stone-400">DOI: {p.doi}</p>
                    </td>
                    <td className="p-4 text-stone-500">{p.discipline}</td>
                    <td className="p-4 tabular-nums">{p.citationCount}</td>
                    <td className="p-4 tabular-nums">{p.downloadCount.toLocaleString()}</td>
                    <td className="p-4">{p.isOpenAccess ? 'Open Access' : 'Registered'}</td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('research-detail', p.id)}
                        className="text-stone-600 hover:text-amber-600 cursor-pointer"
                        title="View paper"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteResearchPaper(p.id)}
                        className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete paper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: E-Books Management */}
      {activeTab === 'books' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                Manage Digital E-Book Library
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">{ebooks.length} volumes in catalog · Open Access & Monograph Publications</p>
            </div>
            <button
              onClick={() => setIsNewBookOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish New E-Book</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Genre</th>
                  <th className="p-4">Pages</th>
                  <th className="p-4">Access Tier</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                {ebooks.map(b => (
                  <tr key={b.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-serif font-semibold">{b.title}</td>
                    <td className="p-4">{b.author.name}</td>
                    <td className="p-4 text-stone-500">{b.genre}</td>
                    <td className="p-4 tabular-nums">{b.pages}</td>
                    <td className="p-4 uppercase font-bold text-[10px] text-amber-600">{b.accessTier}</td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('book-detail', b.id)}
                        className="text-stone-600 hover:text-amber-600 cursor-pointer"
                        title="View volume"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEBook(b.id)}
                        className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
              Community Inquiries & Moderation Queue
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Review flagged reader comments, approve pending inquiries, and maintain scholarly discourse standards.
            </p>
          </div>

          <div className="space-y-4">
            {comments.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <strong className="text-slate-900 dark:text-stone-100">{c.author.name}</strong>
                    <span className="text-stone-400">· {c.publicationType}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      c.status === 'reported' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-stone-200 leading-relaxed font-serif">
                    {c.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {c.status === 'reported' && (
                    <button
                      onClick={() => moderateComment(c.id, 'approved')}
                      className="px-2.5 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500 cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                    title="Remove comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Homepage & Announcement Controls */}
      {activeTab === 'homepage' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
              Homepage Announcements & Breaking News Ticker
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Toggle and customize the top announcement bar appearing across all pages of the portal.
            </p>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4 max-w-xl">
            <label className="flex items-center gap-2 text-xs text-slate-800 dark:text-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={annEnabled}
                onChange={e => setAnnEnabled(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="font-semibold">Enable Breaking News / Announcement Banner</span>
            </label>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Announcement Text
              </label>
              <textarea
                value={annMessage}
                onChange={e => setAnnMessage(e.target.value)}
                rows={3}
                className="w-full p-3 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Save Announcement
              </button>
              {annSaved && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Live Front Page</span>
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tab: Verifications & Scholar Credentials Attestation */}
      {activeTab === 'verifications' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-8">
          <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                Scholarly Credential Attestation & Trust Badges
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Review and authenticate applications for Verified Scholar trust badges and faculty affiliations. Confirms doctoral research, university positions, and author byline privileges.
            </p>
          </div>

          {/* Pending Applications Queue */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Pending Credential Applications ({pendingVerifications.length})</span>
              <span className="text-[10px] text-amber-600 font-normal">Requires Editorial Bureau Review</span>
            </h4>

            {pendingVerifications.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs bg-stone-50/50 dark:bg-slate-800/30 rounded-xl border border-stone-200/60 dark:border-slate-800">
                No pending verification applications at this time. All academic credential submissions have been authenticated.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map(app => (
                  <div
                    key={app.id}
                    className="p-5 border border-stone-200 dark:border-slate-800 rounded-xl bg-stone-50/50 dark:bg-slate-800/20 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                            {app.applicantName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                            <GraduationCap className="w-3 h-3" />
                            <span>Requested: Verified Scholar</span>
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          {app.academicTitle} · <strong className="text-slate-800 dark:text-stone-200">{app.institution}</strong> ({app.department})
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Institutional Email: <span className="font-mono text-slate-700 dark:text-stone-300">{app.email}</span> · Submitted: {new Date(app.submittedAt).toLocaleString()}
                        </p>
                      </div>

                      {app.orcidOrProfileUrl && (
                        <a
                          href={app.orcidOrProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline shrink-0"
                        >
                          <span className="font-mono text-[11px]">Academic Profile</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-stone-200 dark:border-slate-800 text-xs">
                      <span className="block font-semibold uppercase tracking-wider text-[10px] text-stone-400 mb-1">
                        Credentials & Scholarly Statement:
                      </span>
                      <p className="text-slate-800 dark:text-stone-200 font-serif leading-relaxed italic">
                        "{app.credentialsStatement}"
                      </p>
                    </div>

                    {/* Reviewer Note Input & Action Buttons */}
                    <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Optional reviewer attestation notes..."
                          value={reviewNoteInput[app.id] || ''}
                          onChange={e => setReviewNoteInput({ ...reviewNoteInput, [app.id]: e.target.value })}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => reviewVerification(app.id, 'approved', reviewNoteInput[app.id] || 'Verified credentials and publications verified')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve as Verified Scholar</span>
                        </button>
                        <button
                          onClick={() => reviewVerification(app.id, 'rejected', reviewNoteInput[app.id] || 'Declined: Insufficient institutional documentation')}
                          className="px-3 py-1.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Verified Scholars / Registry */}
          <div className="space-y-4 pt-6 border-t border-stone-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Attestation Archive & Decision Registry ({verificationApplications.length})
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Applicant / Scholar</th>
                    <th className="p-3">Institution & Title</th>
                    <th className="p-3">Trust Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Attestation Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                  {verificationApplications.map(app => (
                    <tr key={app.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-semibold">{app.applicantName}</span>
                        <span className="block text-[11px] font-mono text-stone-400">{app.email}</span>
                      </td>
                      <td className="p-3">
                        <span>{app.academicTitle}</span>
                        <span className="block text-[11px] text-stone-500">{app.institution}</span>
                      </td>
                      <td className="p-3">
                        <VerificationBadge tier="verified_scholar" size="sm" showLabel />
                      </td>
                      <td className="p-3">
                        <span
                          className={`uppercase font-bold text-[10px] px-2 py-0.5 rounded ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-stone-500 max-w-xs truncate">
                        {app.reviewerNotes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Takedown & Copyright Queue */}
      {activeTab === 'takedowns' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
              Copyright Reports & DMCA Takedown Inquiries
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Legally certified infringement claims submitted through the public legal portal.
            </p>
          </div>

          <div className="space-y-4">
            {takedownReports.map(rep => (
              <div
                key={rep.id}
                className="p-5 border border-stone-200 dark:border-slate-800 rounded-xl bg-stone-50/50 dark:bg-slate-800/20 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Target: {rep.publicationTitle}</span>
                    <span className="text-stone-400"> · Filed {new Date(rep.submittedAt).toLocaleDateString()}</span>
                  </div>

                  <span className={`uppercase font-bold text-[10px] px-2 py-0.5 rounded ${
                    rep.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : rep.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-800'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300">
                  <strong>Claimant:</strong> {rep.claimantName} ({rep.claimantEmail}) {rep.organization && `· ${rep.organization}`}
                </p>

                <p className="text-xs text-slate-800 dark:text-stone-200 bg-white dark:bg-slate-900 p-3 rounded border border-stone-100 dark:border-slate-800 font-serif leading-relaxed">
                  "{rep.infringementDetails}"
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => updateTakedownStatus(rep.id, 'resolved')}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500 cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => updateTakedownStatus(rep.id, 'dismissed')}
                    className="px-3 py-1 bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-stone-200 text-xs rounded hover:bg-stone-300 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Subscribers */}
      {activeTab === 'subscribers' && (
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">
                Editorial Newsletter Registry
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {subscribers.length} verified subscribers enrolled for weekly editorial dispatches.
              </p>
            </div>
            <button
              onClick={() => {
                const csv = 'Email,SubscribedAt,Topics\n' + subscribers.map(s => `"${s.email}","${s.subscribedAt}","${s.topics.join(';')}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `patriot_subscribers_${Date.now()}.csv`;
                a.click();
              }}
              className="px-3 py-1.5 border border-stone-300 dark:border-slate-700 hover:border-stone-500 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-slate-800/60 text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Subscriber Email</th>
                  <th className="p-3">Enrolled Date</th>
                  <th className="p-3">Topics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800 text-slate-800 dark:text-stone-200">
                {subscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-stone-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-medium">{sub.email}</td>
                    <td className="p-3 text-stone-500">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-stone-400">{sub.topics.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Publication Success Toast Notification */}
      {publishToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-900 p-4 rounded-xl shadow-2xl border border-stone-700 dark:border-stone-300 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400 dark:text-amber-700">
                {publishToast.type === 'article' ? 'Article Published' : 'E-Book Volume Cataloged'}
              </p>
              <h4 className="text-sm font-serif font-bold line-clamp-1 mt-0.5">
                {publishToast.title}
              </h4>
              <p className="text-[11px] opacity-80 mt-1">
                Now available across The Patriot platform and library archives.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (publishToast.type === 'article') {
                  navigateTo('article-detail', publishToast.id);
                } else {
                  navigateTo('book-detail', publishToast.id);
                }
                setPublishToast(null);
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
            >
              View Now →
            </button>
            <button
              onClick={() => setPublishToast(null)}
              className="p-1 opacity-60 hover:opacity-100 cursor-pointer text-xs"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal: Author & Publish Editorial Article */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Editorial Desk · Admin Publishing
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100 mt-0.5">
                  Author & Publish Editorial Dispatch
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleArticle}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  title="Prefill with realistic investigative dispatch"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Load Sample Dispatch</span>
                </button>
                <button
                  onClick={() => setIsNewArticleOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Article Headline *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Maritime Logistics and Sovereign Currency Defenses"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Subtitle / Deck
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  placeholder="Explanatory sentence summarizing the investigative thesis"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Editorial Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="Geopolitics & Economy">Geopolitics & Economy</option>
                    <option value="Technology & Defense">Technology & Defense</option>
                    <option value="Law & Governance">Law & Governance</option>
                    <option value="Opinions">Opinions</option>
                    <option value="Foreign Affairs">Foreign Affairs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Format / Publication Type
                  </label>
                  <select
                    value={newArticleType}
                    onChange={e => setNewArticleType(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="article">Investigative Article</option>
                    <option value="opinion">Editorial Opinion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="Geopolitics, Security, Economy"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Author Attribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Author Byline Name
                  </label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={e => setNewAuthorName(e.target.value)}
                    placeholder="Author name"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Author Affiliation & Title
                  </label>
                  <input
                    type="text"
                    value={newAuthorAffiliation}
                    onChange={e => setNewAuthorAffiliation(e.target.value)}
                    placeholder="e.g. Senior Fellow, Patriot Council"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Front Picture & Visual Package Section (Manual Device Import + Live Preview) */}
              <FrontPhotoImportSection
                publicationType="article"
                currentPhotoUrl={newFeaturedImage || newFrontPagePhotoUrl}
                currentCaption={newFrontPagePhotoCaption}
                currentCredit={newFrontPagePhotoCredit}
                isFrontPageFeatured={newIsFrontPageFeatured}
                onPhotoChanged={(data) => {
                  setNewFeaturedImage(data.url);
                  setNewFrontPagePhotoUrl(data.url);
                  setNewFrontPagePhotoCaption(data.caption || '');
                  setNewFrontPagePhotoCredit(data.credit || '');
                  setNewIsFrontPageFeatured(!!data.isFrontPageFeatured);
                }}
              />
              {role !== 'administrator' && (
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-mono -mt-2">
                  🔒 Sovereign Publishing Protocol: As an Author Fellow, this article and front-page photos will be submitted to Master Administrator Wahab Ali Khiva for clearance prior to appearing on the front page.
                </p>
              )}

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Executive Excerpt / Abstract
                </label>
                <textarea
                  value={newExcerpt}
                  onChange={e => setNewExcerpt(e.target.value)}
                  rows={2}
                  placeholder="A concise 2-sentence summary that appears on frontpage cards..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Full Body */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Full Investigation Body (Markdown Supported) *
                </label>
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={7}
                  placeholder="Draft the complete editorial dispatch. You can use Markdown headers (##), blockquotes (>), and bullet points..."
                  className="w-full p-3 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-serif leading-relaxed text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-stone-400">
                  Published immediately under Administrator clearance
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewArticleOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs transition-colors"
                  >
                    Publish to The Patriot Frontpage
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Author & Publish New E-Book / Monograph */}
      {isNewBookOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Digital Library Repository · Admin Publishing
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100 mt-0.5">
                  Publish New Monograph or E-Book Volume
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleBook}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  title="Prefill with realistic academic treatise"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Load Sample Monograph</span>
                </button>
                <button
                  onClick={() => setIsNewBookOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-5">
              {/* Automated Manuscript & E-Book File Import Section */}
              <DocumentImportSection
                type="ebook"
                onFileImported={handleBookFileImported}
              />

              {newBookImportedFile && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>File parsed & mapped: <strong>{newBookImportedFile}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewBookImportedFile(null)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer text-[11px]"
                  >
                    Clear File
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Book / Monograph Title *
                </label>
                <input
                  type="text"
                  value={newBookTitle}
                  onChange={e => setNewBookTitle(e.target.value)}
                  placeholder="e.g. Sovereign Statecraft: The Architecture of Modern Strategic Independence"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={newBookSubtitle}
                  onChange={e => setNewBookSubtitle(e.target.value)}
                  placeholder="Institutions, Industrial Planning, and National Resilience in an Era of Multipolarity"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Author & Affiliation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Author Name / Scholar Attribution
                  </label>
                  <input
                    type="text"
                    value={newBookAuthorName}
                    onChange={e => setNewBookAuthorName(e.target.value)}
                    placeholder="e.g. Ambassador Julian Reed"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Author Academic Affiliation
                  </label>
                  <input
                    type="text"
                    value={newBookAuthorAffiliation}
                    onChange={e => setNewBookAuthorAffiliation(e.target.value)}
                    placeholder="e.g. Patriot Institute of Advanced Geopolitics"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Genre, Year, Pages, Edition */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Discipline / Genre
                  </label>
                  <select
                    value={newBookGenre}
                    onChange={e => setNewBookGenre(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="Geopolitics & Strategy">Geopolitics & Strategy</option>
                    <option value="Economics & History">Economics & History</option>
                    <option value="Law & Governance">Law & Governance</option>
                    <option value="Defense & Security">Defense & Security</option>
                    <option value="Technology Sovereignty">Technology Sovereignty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newBookYear}
                    onChange={e => setNewBookYear(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={newBookPages}
                    onChange={e => setNewBookPages(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Edition
                  </label>
                  <input
                    type="text"
                    value={newBookEdition}
                    onChange={e => setNewBookEdition(e.target.value)}
                    placeholder="1st Edition"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Format, File Size, Access Tier, Language */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    File Format
                  </label>
                  <select
                    value={newBookFormat}
                    onChange={e => setNewBookFormat(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="EPUB">EPUB E-Reader</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={newBookFileSize}
                    onChange={e => setNewBookFileSize(e.target.value)}
                    placeholder="4.8 MB"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Access Tier
                  </label>
                  <select
                    value={newBookAccessTier}
                    onChange={e => setNewBookAccessTier(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="free">Free / Public Open Access</option>
                    <option value="registered">Registered Readers Only</option>
                    <option value="restricted">Restricted / Editorial Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={newBookLanguage}
                    onChange={e => setNewBookLanguage(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Volume Cover Picture Package (Manual Device Import + Live Preview) */}
              <FrontPhotoImportSection
                publicationType="ebook"
                currentPhotoUrl={newBookCoverImage}
                currentCaption={newBookTitle ? `Monograph: ${newBookTitle}` : 'Patriot Digital Library Monograph'}
                currentCredit={newBookAuthorName || 'Patriot Publishing Council'}
                isFrontPageFeatured={false}
                onPhotoChanged={(data) => {
                  setNewBookCoverImage(data.url);
                }}
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Book Synopsis / Executive Overview *
                </label>
                <textarea
                  value={newBookDescription}
                  onChange={e => setNewBookDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide an overview of the monograph's core theses, methodological approach, and policy conclusions..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                  required
                />
              </div>

              {/* Table of Contents */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Table of Contents (One chapter per line)
                </label>
                <textarea
                  value={newBookToc}
                  onChange={e => setNewBookToc(e.target.value)}
                  rows={3}
                  placeholder="Chapter 1: The Modern State&#10;Chapter 2: Resource Security..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Sample Excerpt */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Sample Chapter Excerpt (In-browser reader preview)
                </label>
                <textarea
                  value={newBookExcerpt}
                  onChange={e => setNewBookExcerpt(e.target.value)}
                  rows={4}
                  placeholder="Paste preview text from Chapter 1 so readers can inspect the volume prior to downloading..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-serif text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-stone-400">
                  Added directly to The Patriot Digital Library catalog
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewBookOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs transition-colors"
                  >
                    Publish Volume to Digital Library
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import & Publish Academic Research Paper / Preprint */}
      {isNewResearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-4xl rounded-xl shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Research Directorate · Academic Repository
                </span>
                <h3 className="font-serif font-black text-xl text-slate-900 dark:text-stone-100 mt-0.5">
                  Import & Publish Research Manuscript / Preprint
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResearchFileImported({
                      title: 'Decoherence Suppression in Topological Quantum Architectures via Cryogenic Shielding',
                      abstractOrExcerpt: 'We report a 4.2x increase in operational qubit coherence times utilizing novel niobium-titanium superconducting shielding coupled with real-time error syndrome monitoring.',
                      authors: 'Dr. Evelyn Vance & Prof. Chen Wei',
                      disciplineOrGenre: 'Quantum Information & Systems',
                      doi: '10.1038/patriot.2026.1042',
                      keywords: 'Quantum Computing, Coherence, Superconductivity, Topology',
                      methodology: 'Simulations calibrated against physical cryogenic dilution systems operating at 15mK with microwave control pulses.',
                      findings: 'Error syndrome recovery achieved 99.82% fidelity threshold required for sustained fault-tolerant computation.',
                      references: [
                        'Al-Mansoor, T. (2025). The Architecture of Sovereign Resilience. Geneva Press.',
                        'Vance, E. (2025). Decoherence Protocols in 128-Qubit Arrays. Nature Physics 21:112.',
                      ],
                      fileSize: '3.8 MB',
                      fileFormat: 'PDF',
                      fileName: 'topological_quantum_shielding_preprint.pdf',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-stone-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                  title="Prefill with sample research data"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Load Sample Manuscript</span>
                </button>
                <button
                  onClick={() => setIsNewResearchOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateResearchPaper} className="space-y-5">
              {/* Automated Manuscript Import Section */}
              <DocumentImportSection
                type="research"
                onFileImported={handleResearchFileImported}
              />

              {newResearchImportedFile && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Manuscript extracted & mapped: <strong>{newResearchImportedFile}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewResearchImportedFile(null)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer text-[11px]"
                  >
                    Clear File
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Research Manuscript Title *
                </label>
                <input
                  type="text"
                  value={newResearchTitle}
                  onChange={e => setNewResearchTitle(e.target.value)}
                  placeholder="e.g. Cross-Border Settlement Mechanisms in Sovereign Financial Architectures"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-stone-100 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              {/* Discipline & DOI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Scholarly Discipline / Field *
                  </label>
                  <select
                    value={newResearchDiscipline}
                    onChange={e => setNewResearchDiscipline(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="Quantum Information & Systems">Quantum Information & Systems</option>
                    <option value="International Monetary Economics">International Monetary Economics</option>
                    <option value="Strategic Studies & Geopolitics">Strategic Studies & Geopolitics</option>
                    <option value="Energy Systems & Decarbonization">Energy Systems & Decarbonization</option>
                    <option value="Jurisprudence & Constitutional Law">Jurisprudence & Constitutional Law</option>
                    <option value="Artificial Intelligence & Compute Governance">Artificial Intelligence & Compute Governance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    DOI Identifier
                  </label>
                  <input
                    type="text"
                    value={newResearchDoi}
                    onChange={e => setNewResearchDoi(e.target.value)}
                    placeholder="10.1038/patriot.2026.1042"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Author & Affiliation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Author(s) / Investigators *
                  </label>
                  <input
                    type="text"
                    value={newResearchAuthors}
                    onChange={e => setNewResearchAuthors(e.target.value)}
                    placeholder="e.g. Dr. Evelyn Vance, Prof. Chen Wei"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Primary Academic / Institutional Affiliation
                  </label>
                  <input
                    type="text"
                    value={newResearchAffiliation}
                    onChange={e => setNewResearchAffiliation(e.target.value)}
                    placeholder="e.g. National Advanced Computing Directorate"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Abstract / Executive Synopsis *
                </label>
                <textarea
                  value={newResearchAbstract}
                  onChange={e => setNewResearchAbstract(e.target.value)}
                  rows={4}
                  placeholder="Provide comprehensive summary of hypotheses, methodology, and empirical findings..."
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed text-slate-900 dark:text-stone-100 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              {/* Methodology & Findings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Methodology & Experimental Design
                  </label>
                  <textarea
                    value={newResearchMethodology}
                    onChange={e => setNewResearchMethodology(e.target.value)}
                    rows={3}
                    placeholder="Statistical techniques, econometric models, empirical datasets..."
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Key Findings & Empirical Results
                  </label>
                  <textarea
                    value={newResearchFindings}
                    onChange={e => setNewResearchFindings(e.target.value)}
                    rows={3}
                    placeholder="Primary conclusions, measured outcomes, policy recommendations..."
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Keywords, Journal, Year, File Size */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newResearchKeywords}
                    onChange={e => setNewResearchKeywords(e.target.value)}
                    placeholder="Quantum, Cryogenics, Superconductivity"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Manuscript Size
                  </label>
                  <input
                    type="text"
                    value={newResearchPdfSize}
                    onChange={e => setNewResearchPdfSize(e.target.value)}
                    placeholder="3.8 MB"
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Access License
                  </label>
                  <select
                    value={newResearchIsOpenAccess ? 'open' : 'restricted'}
                    onChange={e => setNewResearchIsOpenAccess(e.target.value === 'open')}
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  >
                    <option value="open">Open Access (CC BY 4.0)</option>
                    <option value="restricted">Restricted Repository</option>
                  </select>
                </div>
              </div>

              {/* Front Page Photos & Experimental Visuals (Manual Device Import + Live Preview) */}
              <FrontPhotoImportSection
                publicationType="research"
                currentPhotoUrl={newResearchFrontPagePhotoUrl}
                currentCaption={newResearchFrontPagePhotoCaption}
                currentCredit={newResearchFrontPagePhotoCredit}
                isFrontPageFeatured={newResearchIsFrontPageFeatured}
                onPhotoChanged={(data) => {
                  setNewResearchFrontPagePhotoUrl(data.url);
                  setNewResearchFrontPagePhotoCaption(data.caption || '');
                  setNewResearchFrontPagePhotoCredit(data.credit || '');
                  setNewResearchIsFrontPageFeatured(!!data.isFrontPageFeatured);
                }}
              />
              {role !== 'administrator' && (
                <p className="text-[10px] text-indigo-800 dark:text-indigo-300 font-mono -mt-2">
                  🔒 Sovereign Publishing Protocol: Research manuscripts submitted by authors are held for Wahab Ali Khiva's mandatory clearance before front-page release.
                </p>
              )}

              {/* References */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  References & Scholarly Citations (One per line)
                </label>
                <textarea
                  value={newResearchReferences}
                  onChange={e => setNewResearchReferences(e.target.value)}
                  rows={3}
                  placeholder="Author, A. (Year). Title of paper. Journal Name, Vol(Issue), pages."
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-stone-100 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-stone-400">
                  Published to The Patriot Academic Repository with DOI indexing
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewResearchOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs transition-colors"
                  >
                    Register & Publish Manuscript
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Appoint Author or Sub-Administrator (Exclusive to Wahab Ali Khiva) */}
      {isAppointStaffOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 my-8">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  <span>Sovereign Platform Mandate</span>
                </div>
                <h3 className="font-serif font-black text-2xl text-slate-900 dark:text-stone-100">
                  Appoint Staff Member or Sub-Admin
                </h3>
                <p className="text-xs text-stone-500">
                  Exclusive platform authority vested solely in <strong className="text-amber-600 dark:text-amber-400">Wahab Ali Khiva</strong>.
                </p>
              </div>
              <button
                onClick={() => setIsAppointStaffOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isMasterAdmin ? (
              <div className="p-5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-semibold text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Access Denied: Sovereign Permission Required</span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-sans">
                  Under the Patriot Platform Charter, only <strong>Wahab Ali Khiva (wahabalikhiva@gmail.com)</strong> has 
                  the authority to appoint authors, editors, or sub-administrators. Sub-administrators and standard administrators 
                  cannot appoint or promote other users.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAppointStaffOpen(false)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleAppointStaff} className="space-y-5">
                {/* Candidate Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Appointee Full Name *
                    </label>
                    <input
                      type="text"
                      value={newStaffName}
                      onChange={e => setNewStaffName(e.target.value)}
                      placeholder="e.g. Dr. Ayesha Siddiqui"
                      className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-stone-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Institutional Email Address *
                    </label>
                    <input
                      type="email"
                      value={newStaffEmail}
                      onChange={e => setNewStaffEmail(e.target.value)}
                      placeholder="e.g. ayesha.siddiqui@patriot.org"
                      className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-stone-100"
                      required
                    />
                  </div>
                </div>

                {/* Mandate Role */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Appointed Mandate & Role *
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={e => {
                      const r = e.target.value as StaffRole;
                      setNewStaffRole(r);
                      if (r === 'sub_administrator') {
                        setNewStaffPermissions({
                          canPublishDirectly: true,
                          canReviewSubmissions: true,
                          canModerateComments: true,
                          canManageLibrary: true,
                          canAccessAdminBureau: true,
                        });
                        setNewStaffTitle('Sub-Administrator & Desk Director');
                      } else if (r === 'editor') {
                        setNewStaffPermissions({
                          canPublishDirectly: true,
                          canReviewSubmissions: true,
                          canModerateComments: true,
                          canManageLibrary: false,
                          canAccessAdminBureau: true,
                        });
                        setNewStaffTitle('Senior Broadsheet Editor');
                      } else {
                        setNewStaffPermissions({
                          canPublishDirectly: true,
                          canReviewSubmissions: false,
                          canModerateComments: false,
                          canManageLibrary: false,
                          canAccessAdminBureau: true,
                        });
                        setNewStaffTitle('Contributing Author Fellow');
                      }
                    }}
                    className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-stone-100"
                  >
                    <option value="author">Author Fellow (Can publish articles and research monographs)</option>
                    <option value="editor">Senior Editor (Can edit, review submissions, and manage dispatches)</option>
                    <option value="sub_administrator">Sub-Administrator (Operational governance under Wahab Ali Khiva)</option>
                  </select>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Note: Sub-administrators can oversee daily operations but <strong>cannot</strong> appoint other authors or sub-administrators.
                  </p>
                </div>

                {/* Department & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Editorial / Research Department
                    </label>
                    <select
                      value={newStaffDepartment}
                      onChange={e => setNewStaffDepartment(e.target.value)}
                      className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                    >
                      <option value="Geopolitics & Strategic Studies">Geopolitics & Strategic Studies</option>
                      <option value="Monetary Economics & Statecraft">Monetary Economics & Statecraft</option>
                      <option value="Dawn Broadsheet & Letters Desk">Dawn Broadsheet & Letters Desk</option>
                      <option value="Quantum & Advanced Technologies">Quantum & Advanced Technologies</option>
                      <option value="Digital Library & Monographs">Digital Library & Monographs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                      Institutional Title
                    </label>
                    <input
                      type="text"
                      value={newStaffTitle}
                      onChange={e => setNewStaffTitle(e.target.value)}
                      placeholder="e.g. Senior Fellow in Geopolitics"
                      className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                {/* Granular Permissions Matrix */}
                <div className="p-4 bg-stone-50 dark:bg-slate-950 rounded-xl border border-stone-200 dark:border-slate-800 space-y-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Granular Privileges & Authorizations
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800 dark:text-stone-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.canPublishDirectly}
                        onChange={e => setNewStaffPermissions({ ...newStaffPermissions, canPublishDirectly: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Direct Article / Monograph Publishing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.canReviewSubmissions}
                        onChange={e => setNewStaffPermissions({ ...newStaffPermissions, canReviewSubmissions: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Peer-Review Submissions & Edits</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.canModerateComments}
                        onChange={e => setNewStaffPermissions({ ...newStaffPermissions, canModerateComments: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Scholarly Comment & Discourse Moderation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.canManageLibrary}
                        onChange={e => setNewStaffPermissions({ ...newStaffPermissions, canManageLibrary: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Manage Digital Library Catalog</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={newStaffPermissions.canAccessAdminBureau}
                        onChange={e => setNewStaffPermissions({ ...newStaffPermissions, canAccessAdminBureau: e.target.checked })}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Access The Patriot Platform Bureau Console</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    Appointment Mandate Justification / Notes
                  </label>
                  <textarea
                    value={newStaffNotes}
                    onChange={e => setNewStaffNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Mandate granted by Wahab Ali Khiva pursuant to verified academic publications in Eurasian strategic studies..."
                    className="w-full p-2 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-slate-800">
                  <span className="text-[11px] text-stone-400 font-mono">
                    Signed by: Wahab Ali Khiva
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAppointStaffOpen(false)}
                      className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer shadow-md transition-colors inline-flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Issue Sovereign Mandate</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Renew Master Administrator Password (Wahab Ali Khiva) */}
      {renewPasswordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  <KeyRound className="w-3 h-3" />
                  <span>Sovereign Security</span>
                </div>
                <h3 className="font-serif font-black text-2xl text-slate-900 dark:text-stone-100">
                  Renew Administrator Password
                </h3>
                <p className="text-xs text-stone-500">
                  Direct credential renewal for Master Sovereign <strong>Wahab Ali Khiva</strong>.
                </p>
              </div>
              <button
                onClick={() => setRenewPasswordModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminPassMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  adminPassMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                }`}
              >
                {adminPassMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span>{adminPassMessage.text}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAdminPassMessage(null);
                if (adminNewPassword.length < 6) {
                  setAdminPassMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
                  return;
                }
                if (adminNewPassword !== adminConfirmPassword) {
                  setAdminPassMessage({ text: 'Passwords do not match. Please re-enter.', type: 'error' });
                  return;
                }
                const res = resetPassword('wahabalikhiva@gmail.com', adminNewPassword);
                if (res.success) {
                  setAdminPassMessage({
                    text: 'Master Administrator password renewed successfully! Your new password is now active.',
                    type: 'success',
                  });
                  setTimeout(() => {
                    setRenewPasswordModalOpen(false);
                    setAdminNewPassword('');
                    setAdminConfirmPassword('');
                  }, 1200);
                } else {
                  setAdminPassMessage({ text: res.error || 'Failed to update credentials.', type: 'error' });
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Master Account Target
                </label>
                <input
                  type="text"
                  disabled
                  value="Wahab Ali Khiva (wahabalikhiva@gmail.com)"
                  className="w-full p-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-xs font-mono text-stone-600 dark:text-stone-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  New Sovereign Password (minimum 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="Enter new master password"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  placeholder="Re-enter new master password"
                  className="w-full p-2.5 bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-stone-400 font-mono">
                  Sovereign Directorate Security
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRenewPasswordModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer shadow-md transition-colors inline-flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
