export type UserRole = 'visitor' | 'reader' | 'author' | 'editor' | 'administrator';

export type VerificationTier = 'none' | 'email_verified' | 'verified_scholar' | 'editorial_board' | 'verified_author';

export interface ContentReport {
  id: string;
  targetType: 'comment' | 'article' | 'research' | 'ebook' | 'post';
  targetId: string;
  targetTitle?: string;
  targetSnippet: string;
  authorName?: string;
  authorId?: string;
  reporterName: string;
  reporterEmail?: string;
  reason: 'misinformation' | 'hate_speech' | 'plagiarism' | 'defamation' | 'spam' | 'other';
  reasonDetails?: string;
  submittedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolutionAction?: 'dismissed' | 'content_edited' | 'content_deleted' | 'user_blocked';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PublicationRequest {
  id: string;
  type: 'article' | 'research' | 'ebook';
  title: string;
  subtitle?: string;
  abstractOrExcerpt: string;
  content: string;
  disciplineOrCategory: string;
  tags: string[];
  readingTimeMinutes?: number;
  doi?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAffiliation: string;
  authorAvatar: string;
  frontPhotoUrl?: string;
  frontPhotoCaption?: string;
  frontPhotoCredit?: string;
  isFrontPageHero?: boolean;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  submittedAt: string;
  status: 'pending_admin_approval' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface VerificationDetails {
  tier: VerificationTier;
  verifiedAt: string;
  badgeLabel: string;
  institution?: string;
  fieldOfStudy?: string;
  orcid?: string;
  credentialTitle?: string;
}

export interface VerificationApplication {
  id: string;
  userId: string;
  applicantName?: string;
  fullName?: string;
  email: string;
  requestedTier: 'verified_scholar' | 'editorial_board' | 'fellow';
  institution: string;
  academicTitle: string;
  department?: string;
  orcidOrProfileUrl?: string;
  orcidId?: string;
  idDocumentUrl?: string;
  credentialsStatement?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  affiliation?: string;
  isVerified?: boolean;
  emailVerified?: boolean;
  verificationTier?: VerificationTier;
  verificationDetails?: VerificationDetails;
}

export type PublicationType = 'article' | 'research' | 'ebook' | 'opinion';

export type ReadingPublicationType = 'article' | 'research' | 'ebook';

export interface ReadingHistoryItem {
  id: string;
  publicationId: string;
  publicationType: ReadingPublicationType;
  title: string;
  subtitle?: string;
  authorName: string;
  categoryOrDiscipline?: string;
  coverImage?: string;
  progress: number; // 0 to 100 percentage
  completed: boolean;
  lastReadAt: string; // ISO string
  estimatedTimeLeftMinutes?: number;
  totalTimeMinutes?: number;
  slug?: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  avatar: string;
  bio: string;
  verified: boolean;
  verificationTier?: VerificationTier;
  verificationDetails?: VerificationDetails;
}

export interface EditorialCorrection {
  date: string;
  description: string;
}

export interface Footnote {
  number: number;
  text: string;
  url?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // rich markdown-like sections or text
  type: 'article' | 'opinion';
  category: string;
  tags: string[];
  featuredImage: string;
  imageCaption?: string;
  frontPagePhotoUrl?: string;
  frontPagePhotoCaption?: string;
  frontPagePhotoCredit?: string;
  isFrontPageFeatured?: boolean;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  isFeatured?: boolean;
  isEditorsPick?: boolean;
  isTrending?: boolean;
  status: 'published' | 'pending_approval' | 'draft' | 'scheduled';
  tableOfContents?: { id: string; title: string; level: number }[];
  corrections?: EditorialCorrection[];
  footnotes?: Footnote[];
  viewCount: number;
  needsAdminApproval?: boolean;
  submittedByAuthorId?: string;
  adminReviewNotes?: string;
}

export interface CitationInfo {
  doi: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  year: number;
}

export interface ResearchPaper {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  methodology: string;
  findings: string;
  authors: Author[];
  discipline: string;
  keywords: string[];
  publishedAt: string;
  doi: string;
  citationInfo: CitationInfo;
  references: string[];
  pdfSize: string;
  pdfUrl?: string;
  isPeerReviewed: boolean;
  isOpenAccess: boolean;
  downloadCount: number;
  citationCount: number;
  version: string;
  supplementaryFiles?: { name: string; size: string }[];
  status: 'published' | 'pending_approval' | 'draft';
  frontPagePhotoUrl?: string;
  frontPagePhotoCaption?: string;
  frontPagePhotoCredit?: string;
  isFrontPageFeatured?: boolean;
  needsAdminApproval?: boolean;
  submittedByAuthorId?: string;
  adminReviewNotes?: string;
}

export type BookAccessTier = 'free' | 'registered' | 'restricted';

export interface EBook {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: Author;
  description: string;
  coverImage: string;
  genre: string;
  language: string;
  publishedYear: number;
  edition: string;
  pages: number;
  fileFormat: 'PDF' | 'EPUB';
  fileSize: string;
  accessTier: BookAccessTier;
  rating: number;
  ratingCount: number;
  tableOfContents: string[];
  sampleChapterExcerpt: string;
  downloadCount: number;
  copyrightNotice: string;
  status: 'published' | 'pending_approval' | 'draft';
  frontPagePhotoUrl?: string;
  frontPagePhotoCaption?: string;
  frontPagePhotoCredit?: string;
  isFrontPageFeatured?: boolean;
  needsAdminApproval?: boolean;
  submittedByAuthorId?: string;
  adminReviewNotes?: string;
}

export interface Comment {
  id: string;
  publicationId: string;
  publicationType: PublicationType;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    isAuthorOfPublication?: boolean;
    verificationTier?: VerificationTier;
    verificationDetails?: VerificationDetails;
  };
  content: string;
  createdAt: string;
  isQuestion: boolean;
  isResolved?: boolean;
  helpfulVotes: number;
  hasUserVoted?: boolean;
  replies?: Comment[];
  status: 'approved' | 'pending' | 'reported';
}

export interface TakedownReport {
  id: string;
  publicationTitle: string;
  claimantName: string;
  claimantEmail: string;
  organization?: string;
  infringementDetails: string;
  declarationSigned: boolean;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
}

export interface Announcement {
  id: string;
  message: string;
  linkText?: string;
  linkUrl?: string;
  isEnabled: boolean;
  type: 'breaking' | 'announcement';
}

export interface BreakingNewsItem {
  id: string;
  headline: string;
  category: string;
  timestamp: string;
  source: string;
  linkView?: string;
  linkDetailId?: string;
  isUrgent?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  topics: string[];
  subscribedAt: string;
}

export type StaffRole = 'author' | 'editor' | 'sub_administrator' | 'administrator';

export interface StaffPermission {
  canPublishDirectly: boolean;
  canReviewSubmissions: boolean;
  canModerateComments: boolean;
  canManageLibrary: boolean;
  canAccessAdminBureau: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  department: string;
  title: string;
  avatar: string;
  appointedBy: string; // "Wahab Ali Khiva (Master Administrator)"
  appointedAt: string; // ISO string
  permissions: StaffPermission;
  status: 'active' | 'suspended';
  verificationTier: VerificationTier;
  notes?: string;
}

export interface StaffAuditLog {
  id: string;
  timestamp: string;
  action: 'appointed' | 'revoked' | 'permissions_updated' | 'suspended' | 'reactivated';
  targetStaffName: string;
  targetUserName?: string;
  targetUserEmail?: string;
  targetRole: string;
  executedBy: string;
  performedBy?: string;
  details: string;
}

export interface LetterToTheEditor {
  id: string;
  writerName: string;
  writerEmail: string;
  cityOrCountry: string;
  topic: string;
  subject: string;
  content: string;
  submittedAt: string;
  status: 'published' | 'pending' | 'archived' | 'rejected';
  editorialResponse?: string;
  // Aliases for broadsheet display & form compatibility
  title?: string;
  authorName?: string;
  authorEmail?: string;
  authorLocation?: string;
  authorAffiliation?: string;
  editorialReply?: string;
}

// ----------------------------------------------------
// LMS Portal Types (Reader, Author, Admin)
// ----------------------------------------------------

export interface LMSQuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctOptionIndex?: number;
  correctAnswerIndex?: number;
  explanation?: string;
}

export interface LMSLesson {
  id: string;
  title: string;
  order?: number;
  durationMinutes: number;
  summary?: string;
  briefingNotes?: string;
  keyTakeaways?: string[];
  readingMaterialSlug?: string;
  content?: string;
  type?: 'briefing' | 'lecture' | 'seminar';
  quiz?: LMSQuizQuestion[];
}

export interface LMSCourse {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  discipline: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced Diplomatic' | 'Foundational' | 'Advanced' | 'Executive';
  durationWeeks?: number;
  estimatedHours?: number;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  coverImage: string;
  overview?: string;
  curriculumObjectives?: string[];
  lessons: LMSLesson[];
  enrolledStudentsCount: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  certifiedBy?: string; // e.g., 'Wahab Ali Khiva (The Patriot Academy)'
}

export interface LMSUserProgress {
  courseId: string;
  completedLessonIds: string[];
  quizScores: Record<string, number>; // lessonId -> percentage
  isCompleted: boolean;
  certificateIssuedDate?: string;
  certificateId?: string;
}

// ----------------------------------------------------
// Universal Notification Types
// ----------------------------------------------------

export type NotificationCategory =
  | 'editorial_clearance'
  | 'new_publication'
  | 'lms_course'
  | 'system_security'
  | 'letter_reply'
  | 'reader_letter'
  | 'moderation';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string; // ISO string
  read: boolean;
  priority?: 'high' | 'normal' | 'urgent';
  actorName?: string;
  actorAvatar?: string;
  link?: {
    view: string;
    detailId?: string;
    tab?: string;
  };
}

export interface RegisteredUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  affiliation?: string;
  avatar?: string;
  createdAt: string;
  isVerified?: boolean;
  verificationTier?: VerificationTier;
  verificationDetails?: VerificationDetails;
  appointedBy?: string;
  status?: 'active' | 'pending_verification' | 'suspended';
  requestedRole?: UserRole;
}




