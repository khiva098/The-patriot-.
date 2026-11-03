import { CitationInfo, Comment, ReadingHistoryItem, ResearchPaper, TakedownReport } from '../types';

/**
 * Pure citation generator supporting standard academic formats.
 */
export function formatCitation(
  paper: {
    title: string;
    authors: { name: string }[];
    citationInfo: CitationInfo;
    publishedAt: string;
  },
  style: 'APA' | 'MLA' | 'Chicago' | 'BibTeX'
): string {
  const authorNames = paper.authors.map(a => a.name);
  const year = paper.citationInfo.year || new Date(paper.publishedAt).getFullYear() || 2026;
  const journal = paper.citationInfo.journal || 'The Patriot Review of Global Affairs';
  const doi = paper.citationInfo.doi;
  const vol = paper.citationInfo.volume ? `, ${paper.citationInfo.volume}` : '';
  const issue = paper.citationInfo.issue ? `(${paper.citationInfo.issue})` : '';
  const pages = paper.citationInfo.pages ? `, ${paper.citationInfo.pages}` : '';

  switch (style) {
    case 'APA': {
      // Author, A. A., & Author, B. B. (Year). Title of article. Title of Periodical, xx(x), pp-pp. https://doi.org/xxx
      const formattedAuthors = authorNames.join(', & ');
      return `${formattedAuthors} (${year}). ${paper.title}. ${journal}${vol}${issue}${pages}. https://doi.org/${doi}`;
    }
    case 'MLA': {
      // Author. "Title of Article." Title of Periodical, vol. x, no. x, Year, pages. DOI.
      const firstAuthor = authorNames[0] || 'Anonymous';
      const etAl = authorNames.length > 1 ? ', et al' : '';
      return `${firstAuthor}${etAl}. "${paper.title}." ${journal}${vol ? `, vol. ${paper.citationInfo.volume}` : ''}${paper.citationInfo.issue ? `, no. ${paper.citationInfo.issue}` : ''}, ${year}${pages ? `, pp. ${paper.citationInfo.pages}` : ''}. doi:${doi}.`;
    }
    case 'Chicago': {
      // Author. "Title." Journal volume, no. issue (Year): pages. https://doi.org/xxx.
      const authorsStr = authorNames.join(', and ');
      return `${authorsStr}. "${paper.title}." ${journal} ${paper.citationInfo.volume || '1'}${paper.citationInfo.issue ? `, no. ${paper.citationInfo.issue}` : ''} (${year})${pages ? `: ${paper.citationInfo.pages}` : ''}. https://doi.org/${doi}.`;
    }
    case 'BibTeX': {
      const citeKey = `${(authorNames[0] || 'patriot').split(' ').pop()?.toLowerCase() || 'paper'}${year}`;
      return `@article{${citeKey},
  author = {${authorNames.join(' and ')}},
  title = {${paper.title}},
  journal = {${journal}},
  year = {${year}},
  volume = {${paper.citationInfo.volume || '1'}},
  number = {${paper.citationInfo.issue || '1'}},
  pages = {${paper.citationInfo.pages || '1-20'}},
  doi = {${doi}}
}`;
    }
    default:
      return `${authorNames.join(', ')} (${year}). ${paper.title}. https://doi.org/${doi}`;
  }
}

/**
 * Calculates reading time in minutes based on word count (default 200 wpm).
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  if (!text || text.trim().length === 0) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Discussion statistics: count total questions, unanswered questions, and resolved questions.
 */
export function calculateDiscussionMetrics(comments: Comment[]): {
  totalCount: number;
  questionCount: number;
  unansweredCount: number;
  resolvedCount: number;
} {
  let totalCount = 0;
  let questionCount = 0;
  let unansweredCount = 0;
  let resolvedCount = 0;

  function traverse(list: Comment[]) {
    for (const item of list) {
      totalCount++;
      if (item.isQuestion) {
        questionCount++;
        const hasReplies = item.replies && item.replies.length > 0;
        if (item.isResolved) {
          resolvedCount++;
        } else if (!hasReplies) {
          unansweredCount++;
        }
      }
      if (item.replies && item.replies.length > 0) {
        traverse(item.replies);
      }
    }
  }

  traverse(comments);
  return { totalCount, questionCount, unansweredCount, resolvedCount };
}

/**
 * Strict copyright and takedown form validation.
 */
export function validateTakedownRequest(data: {
  publicationTitle?: string;
  claimantName?: string;
  claimantEmail?: string;
  infringementDetails?: string;
  declarationSigned?: boolean;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.publicationTitle || data.publicationTitle.trim().length < 3) {
    errors.publicationTitle = 'Publication title is required (at least 3 characters)';
  }

  if (!data.claimantName || data.claimantName.trim().length < 2) {
    errors.claimantName = 'Claimant full legal name is required';
  }

  if (!data.claimantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.claimantEmail)) {
    errors.claimantEmail = 'A valid contact email address is required';
  }

  if (!data.infringementDetails || data.infringementDetails.trim().length < 20) {
    errors.infringementDetails = 'Please provide detailed specifics of the copyrighted work and alleged infringement (minimum 20 characters)';
  }

  if (!data.declarationSigned) {
    errors.declarationSigned = 'You must affirm under penalty of perjury that the information is accurate';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Converts a string into a clean URL-friendly slug.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Calculates reading progress percentage from scroll coordinates (0 to 100).
 */
export function calculateScrollProgress(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  if (scrollHeight <= clientHeight || scrollHeight <= 0) {
    return 100;
  }
  const maxScroll = scrollHeight - clientHeight;
  const progress = (scrollTop / maxScroll) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

/**
 * Validates scholar/expert verification applications.
 */
export function validateVerificationApplication(data: {
  applicantName?: string;
  email?: string;
  institution?: string;
  academicTitle?: string;
  department?: string;
  credentialsStatement?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.applicantName || data.applicantName.trim().length < 2) {
    errors.applicantName = 'Full legal/scholarly name is required';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'A valid institutional or professional email address is required';
  }

  if (!data.institution || data.institution.trim().length < 3) {
    errors.institution = 'Academic institution, think tank, or research organization is required';
  }

  if (!data.academicTitle || data.academicTitle.trim().length < 2) {
    errors.academicTitle = 'Professional or academic title is required (e.g., Professor, Senior Fellow, Postdoctoral Researcher)';
  }

  if (!data.department || data.department.trim().length < 2) {
    errors.department = 'Department or research division is required';
  }

  if (!data.credentialsStatement || data.credentialsStatement.trim().length < 30) {
    errors.credentialsStatement = 'Please provide a statement of credentials and recent publications (minimum 30 characters)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats an ISO date into human-readable relative time (e.g. "Just now", "25m ago", "3h ago", "Yesterday").
 */
export function formatRelativeTime(isoString: string, currentTimestamp: number = Date.now()): string {
  try {
    const timestamp = new Date(isoString).getTime();
    if (isNaN(timestamp)) return 'Recently';

    const diffMs = currentTimestamp - timestamp;
    if (diffMs < 0) return 'Just now';

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: diffDays > 300 ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Filter reading history items by type tab and search keywords.
 */
export function filterReadingHistory(
  items: ReadingHistoryItem[],
  typeFilter: string,
  searchQuery: string = ''
): ReadingHistoryItem[] {
  let filtered = [...items];

  // Filter by category/type or completion status
  if (typeFilter === 'article') {
    filtered = filtered.filter(i => i.publicationType === 'article');
  } else if (typeFilter === 'research') {
    filtered = filtered.filter(i => i.publicationType === 'research');
  } else if (typeFilter === 'ebook') {
    filtered = filtered.filter(i => i.publicationType === 'ebook');
  } else if (typeFilter === 'in_progress') {
    filtered = filtered.filter(i => !i.completed && i.progress > 0);
  } else if (typeFilter === 'completed') {
    filtered = filtered.filter(i => i.completed || i.progress >= 90);
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const authorMatch = item.authorName.toLowerCase().includes(query);
      const catMatch = item.categoryOrDiscipline?.toLowerCase().includes(query);
      return titleMatch || authorMatch || catMatch;
    });
  }

  // Sort by lastReadAt descending (most recent first)
  filtered.sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime());

  return filtered;
}

/**
 * Calculates reading metrics summary for the user profile.
 */
export function calculateReadingMetrics(items: ReadingHistoryItem[]): {
  totalRead: number;
  inProgress: number;
  completed: number;
  articleCount: number;
  researchCount: number;
  ebookCount: number;
  estimatedMinutesRead: number;
} {
  const totalRead = items.length;
  const inProgress = items.filter(i => !i.completed && i.progress > 0 && i.progress < 90).length;
  const completed = items.filter(i => i.completed || i.progress >= 90).length;
  const articleCount = items.filter(i => i.publicationType === 'article').length;
  const researchCount = items.filter(i => i.publicationType === 'research').length;
  const ebookCount = items.filter(i => i.publicationType === 'ebook').length;

  const estimatedMinutesRead = items.reduce((acc, item) => {
    const totalMinutes = item.totalTimeMinutes || (item.publicationType === 'ebook' ? 120 : item.publicationType === 'research' ? 30 : 10);
    const fraction = (item.progress || 0) / 100;
    return acc + Math.round(totalMinutes * fraction);
  }, 0);

  return {
    totalRead,
    inProgress,
    completed,
    articleCount,
    researchCount,
    ebookCount,
    estimatedMinutesRead,
  };
}

/**
 * Pure validation helper for account password reset requests.
 */
export function validatePasswordReset(
  identifier: string,
  newPassword: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (!identifier || !identifier.trim()) {
    return { valid: false, error: 'Email address or username is required.' };
  }
  if (!newPassword || newPassword.trim().length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (newPassword !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }
  return { valid: true };
}

/**
 * Pure authorization helper for sovereign RBAC clearance checks.
 */
export function checkSovereignRoleClearance(
  requestedRole: string,
  email: string
): { granted: boolean; status: 'active' | 'pending_verification'; message: string } {
  const normEmail = (email || '').toLowerCase().trim();
  const normRole = (requestedRole || 'reader').toLowerCase().trim();

  if (normRole === 'reader') {
    return { granted: true, status: 'active', message: 'Reader clearance granted immediately.' };
  }

  if (normRole === 'administrator') {
    if (normEmail === 'wahabalikhiva@gmail.com') {
      return { granted: true, status: 'active', message: 'Master Administrator verified.' };
    }
    return {
      granted: false,
      status: 'pending_verification',
      message: 'Master Administrator clearance strictly reserved for Wahab Ali Khiva.',
    };
  }

  // Author and sub-admins
  if (normEmail === 'wahabalikhiva@gmail.com') {
    return { granted: true, status: 'active', message: 'Sovereign Master pre-approved.' };
  }

  return {
    granted: false,
    status: 'pending_verification',
    message: 'Author/Sub-Admin privileges placed in Pending Verification status under Wahab Ali Khiva.',
  };
}

/**
 * Validates a reader's content moderation report.
 */
export function validateContentReport(data: {
  reason?: string;
  reasonDetails?: string;
  targetId?: string;
  reporterName?: string;
}): { isValid: boolean; error?: string } {
  if (!data.targetId) {
    return { isValid: false, error: 'Target content identifier is required.' };
  }
  if (!data.reason || !['misinformation', 'hate_speech', 'plagiarism', 'defamation', 'spam', 'other'].includes(data.reason)) {
    return { isValid: false, error: 'A valid moderation violation category must be selected.' };
  }
  if (!data.reasonDetails || data.reasonDetails.trim().length < 5) {
    return { isValid: false, error: 'Please describe why this content violates community guidelines (minimum 5 characters).' };
  }
  return { isValid: true };
}

/**
 * Checks if a user is permitted to submit manuscripts for publication.
 * Readers and visitors are strictly prohibited.
 */
export function canUserSubmitPublication(role: string, email?: string): { allowed: boolean; reason?: string } {
  const normEmail = (email || '').toLowerCase().trim();
  if (normEmail === 'wahabalikhiva@gmail.com') {
    return { allowed: true };
  }
  if (role === 'visitor' || role === 'reader') {
    return {
      allowed: false,
      reason: 'Readers and visitors cannot publish content. Only hired staff and authors appointed by Master Administrator Wahab Ali Khiva may submit.',
    };
  }
  return { allowed: true };
}

/**
 * Generates an encrypted/structured password recovery payload.
 */
export function generatePasswordRecoveryToken(identifier: string): { token: string; url: string; expiresAt: string } {
  const cleanId = (identifier || '').trim().toLowerCase();
  const token = `patriot_sec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
  const url = `https://thepatriot.media/auth/reset?token=${token}&account=${encodeURIComponent(cleanId)}`;
  return { token, url, expiresAt };
}



