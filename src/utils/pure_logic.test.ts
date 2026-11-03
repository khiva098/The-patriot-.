import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCitation,
  calculateReadingTime,
  calculateDiscussionMetrics,
  validateTakedownRequest,
  generateSlug,
  calculateScrollProgress,
  validateVerificationApplication,
  formatRelativeTime,
  filterReadingHistory,
  calculateReadingMetrics,
  validatePasswordReset,
  checkSovereignRoleClearance,
  validateContentReport,
  canUserSubmitPublication,
  generatePasswordRecoveryToken,
} from './pure_logic';
import { Comment } from '../types';

test('formatCitation generates APA 7th style correctly', () => {
  const paper = {
    title: 'Decoherence Mitigation in 128-Qubit Transmon Processors',
    authors: [{ name: 'Dr. Evelyn Vance' }, { name: 'Tariq Al-Mansoor' }],
    citationInfo: {
      doi: '10.1038/s41586-026-0042-8',
      journal: 'Patriot Review of Applied Physics',
      volume: '14',
      issue: '2',
      pages: '104-118',
      year: 2026,
    },
    publishedAt: '2026-03-15',
  };

  const citation = formatCitation(paper, 'APA');
  assert.ok(citation.includes('Dr. Evelyn Vance, & Tariq Al-Mansoor'));
  assert.ok(citation.includes('(2026).'));
  assert.ok(citation.includes('Decoherence Mitigation'));
  assert.ok(citation.includes('Patriot Review of Applied Physics, 14(2), 104-118'));
  assert.ok(citation.includes('https://doi.org/10.1038/s41586-026-0042-8'));
});

test('formatCitation generates MLA and BibTeX styles correctly', () => {
  const paper = {
    title: 'The Arch of Sovereignty',
    authors: [{ name: 'Dr. Alistair Vance' }],
    citationInfo: {
      doi: '10.1093/patriot.2026.01',
      journal: 'Global Affairs Review',
      year: 2026,
    },
    publishedAt: '2026-01-10',
  };

  const mla = formatCitation(paper, 'MLA');
  assert.ok(mla.includes('Dr. Alistair Vance. "The Arch of Sovereignty."'));

  const bibtex = formatCitation(paper, 'BibTeX');
  assert.ok(bibtex.includes('@article{vance2026,'));
  assert.ok(bibtex.includes('author = {Dr. Alistair Vance}'));
});

test('calculateReadingTime handles various text lengths', () => {
  assert.equal(calculateReadingTime(''), 1);
  const words250 = new Array(250).fill('word').join(' ');
  assert.equal(calculateReadingTime(words250, 200), 2);
  const words600 = new Array(600).fill('word').join(' ');
  assert.equal(calculateReadingTime(words600, 200), 3);
});

test('calculateDiscussionMetrics counts questions, unanswered, and resolved', () => {
  const comments: Comment[] = [
    {
      id: 'c1',
      publicationId: 'p1',
      publicationType: 'article',
      author: { id: 'u1', name: 'Reader A', avatar: '', role: 'reader' },
      content: 'General comment on the essay',
      createdAt: '2026-03-01',
      isQuestion: false,
      helpfulVotes: 2,
      status: 'approved',
    },
    {
      id: 'c2',
      publicationId: 'p1',
      publicationType: 'article',
      author: { id: 'u2', name: 'Reader B', avatar: '', role: 'reader' },
      content: 'Could the author clarify the methodology in section 3?',
      createdAt: '2026-03-02',
      isQuestion: true,
      isResolved: false,
      helpfulVotes: 5,
      status: 'approved',
      replies: [], // unanswered
    },
    {
      id: 'c3',
      publicationId: 'p1',
      publicationType: 'article',
      author: { id: 'u3', name: 'Reader C', avatar: '', role: 'reader' },
      content: 'What dataset was used for table 2?',
      createdAt: '2026-03-03',
      isQuestion: true,
      isResolved: true,
      helpfulVotes: 3,
      status: 'approved',
      replies: [
        {
          id: 'c3-r1',
          publicationId: 'p1',
          publicationType: 'article',
          author: { id: 'u4', name: 'Author Vance', avatar: '', role: 'author', isAuthorOfPublication: true },
          content: 'We utilized the 2025 IMF Bilateral Clearing database.',
          createdAt: '2026-03-03',
          isQuestion: false,
          helpfulVotes: 4,
          status: 'approved',
        },
      ],
    },
  ];

  const metrics = calculateDiscussionMetrics(comments);
  assert.equal(metrics.totalCount, 4); // 3 root + 1 reply
  assert.equal(metrics.questionCount, 2);
  assert.equal(metrics.unansweredCount, 1);
  assert.equal(metrics.resolvedCount, 1);
});

test('validateTakedownRequest validates mandatory legal fields', () => {
  const invalid = validateTakedownRequest({});
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.publicationTitle);
  assert.ok(invalid.errors.claimantName);
  assert.ok(invalid.errors.claimantEmail);
  assert.ok(invalid.errors.declarationSigned);

  const valid = validateTakedownRequest({
    publicationTitle: 'Monetary Statecraft',
    claimantName: 'Sarah Jenkins, Esq.',
    claimantEmail: 'legal@oxfordip.org',
    infringementDetails: 'Chapter 4 incorporates verbatim excerpts from our 2024 proprietary monograph without citation license.',
    declarationSigned: true,
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateSlug generates clean URL slugs', () => {
  assert.equal(generateSlug('The Post-Bretton Woods Realignment! (2026)'), 'the-post-bretton-woods-realignment-2026');
});

test('calculateScrollProgress accurately computes percentage clamped between 0 and 100', () => {
  // Top of page
  assert.equal(calculateScrollProgress(0, 2000, 1000), 0);
  // Halfway
  assert.equal(calculateScrollProgress(500, 2000, 1000), 50);
  // Bottom of page
  assert.equal(calculateScrollProgress(1000, 2000, 1000), 100);
  // Beyond bottom (overscroll)
  assert.equal(calculateScrollProgress(1200, 2000, 1000), 100);
  // Short page where scrollHeight <= clientHeight
  assert.equal(calculateScrollProgress(0, 800, 1000), 100);
});

test('validateVerificationApplication checks required academic credentials', () => {
  const invalid = validateVerificationApplication({});
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.applicantName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.institution);
  assert.ok(invalid.errors.academicTitle);
  assert.ok(invalid.errors.credentialsStatement);

  const valid = validateVerificationApplication({
    applicantName: 'Dr. Tariq Al-Mansoor',
    email: 'almansoor@isg.org',
    institution: 'Institute for Sovereign Geopolitics',
    academicTitle: 'Senior Fellow',
    department: 'Department of Strategic Monetary Architecture',
    credentialsStatement: 'Published 14 peer-reviewed monographs on Eurasian monetary corridors and multilateral central banking arrangements.',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('formatRelativeTime produces accurate human friendly labels', () => {
  const now = 1776700000000;
  // Just now (<60s)
  assert.equal(formatRelativeTime(new Date(now - 30000).toISOString(), now), 'Just now');
  // 15m ago
  assert.equal(formatRelativeTime(new Date(now - 15 * 60 * 1000).toISOString(), now), '15m ago');
  // 3h ago
  assert.equal(formatRelativeTime(new Date(now - 3 * 3600 * 1000).toISOString(), now), '3h ago');
  // Yesterday
  assert.equal(formatRelativeTime(new Date(now - 28 * 3600 * 1000).toISOString(), now), 'Yesterday');
  // 4d ago
  assert.equal(formatRelativeTime(new Date(now - 4 * 24 * 3600 * 1000).toISOString(), now), '4d ago');
});

test('filterReadingHistory filters by type, search, and sorts descending', () => {
  const sampleItems: any[] = [
    {
      id: 'h1',
      publicationId: 'art-1',
      publicationType: 'article',
      title: 'The Great Monetary Shift',
      authorName: 'Dr. Tariq Al-Mansoor',
      categoryOrDiscipline: 'Geopolitics',
      progress: 60,
      completed: false,
      lastReadAt: '2026-04-10T10:00:00Z',
    },
    {
      id: 'h2',
      publicationId: 'res-1',
      publicationType: 'research',
      title: 'Decoherence Mitigation in 128-Qubit Transmon Processors',
      authorName: 'Dr. Evelyn Vance',
      categoryOrDiscipline: 'Quantum Physics',
      progress: 95,
      completed: true,
      lastReadAt: '2026-04-11T12:00:00Z',
    },
    {
      id: 'h3',
      publicationId: 'bk-1',
      publicationType: 'ebook',
      title: 'The Architecture of Sovereignty',
      authorName: 'Dr. Alistair Vance',
      categoryOrDiscipline: 'Political Philosophy',
      progress: 25,
      completed: false,
      lastReadAt: '2026-04-09T08:00:00Z',
    },
  ];

  // All filter: sorts most recent first (res-1 at 2026-04-11, then art-1, then bk-1)
  const all = filterReadingHistory(sampleItems, 'all');
  assert.equal(all.length, 3);
  assert.equal(all[0].id, 'h2');
  assert.equal(all[1].id, 'h1');
  assert.equal(all[2].id, 'h3');

  // Type filter: article
  const articles = filterReadingHistory(sampleItems, 'article');
  assert.equal(articles.length, 1);
  assert.equal(articles[0].id, 'h1');

  // Status filter: in_progress
  const inProgress = filterReadingHistory(sampleItems, 'in_progress');
  assert.equal(inProgress.length, 2);

  // Status filter: completed
  const completed = filterReadingHistory(sampleItems, 'completed');
  assert.equal(completed.length, 1);
  assert.equal(completed[0].id, 'h2');

  // Search filter
  const searchResult = filterReadingHistory(sampleItems, 'all', 'quantum');
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].id, 'h2');
});

test('calculateReadingMetrics computes correct profile totals', () => {
  const sampleItems: any[] = [
    {
      id: 'h1',
      publicationId: 'art-1',
      publicationType: 'article',
      title: 'Essay',
      authorName: 'Author A',
      progress: 50,
      completed: false,
      totalTimeMinutes: 10,
      lastReadAt: '2026-04-10T10:00:00Z',
    },
    {
      id: 'h2',
      publicationId: 'res-1',
      publicationType: 'research',
      title: 'Paper',
      authorName: 'Author B',
      progress: 100,
      completed: true,
      totalTimeMinutes: 30,
      lastReadAt: '2026-04-11T12:00:00Z',
    },
  ];

  const metrics = calculateReadingMetrics(sampleItems);
  assert.equal(metrics.totalRead, 2);
  assert.equal(metrics.inProgress, 1);
  assert.equal(metrics.completed, 1);
  assert.equal(metrics.articleCount, 1);
  assert.equal(metrics.researchCount, 1);
  assert.equal(metrics.ebookCount, 0);
  assert.equal(metrics.estimatedMinutesRead, 35); // 50% of 10 = 5 + 100% of 30 = 30 => 35
});

test('validatePasswordReset requires valid identifier, min 6 char password and match', () => {
  // Empty identifier
  assert.equal(validatePasswordReset('', 'secret123', 'secret123').valid, false);
  // Short password (<6 chars)
  assert.equal(validatePasswordReset('reader@patriot.org', '123', '123').valid, false);
  // Passwords mismatch
  assert.equal(validatePasswordReset('reader@patriot.org', 'secret123', 'different456').valid, false);
  // Valid reset request
  assert.equal(validatePasswordReset('wahabalikhiva@gmail.com', 'Sovereign2026!', 'Sovereign2026!').valid, true);
});

test('checkSovereignRoleClearance protects Master Administrator and verifies author status', () => {
  // Master Administrator clearance allowed for Wahab Ali Khiva
  const master = checkSovereignRoleClearance('administrator', 'wahabalikhiva@gmail.com');
  assert.equal(master.granted, true);
  assert.equal(master.status, 'active');

  // Master Administrator rejected for random user
  const imposter = checkSovereignRoleClearance('administrator', 'stranger@example.com');
  assert.equal(imposter.granted, false);
  assert.equal(imposter.status, 'pending_verification');

  // Reader granted immediately
  const reader = checkSovereignRoleClearance('reader', 'newreader@example.com');
  assert.equal(reader.granted, true);
  assert.equal(reader.status, 'active');

  // Author requesting account placed in pending verification
  const authorApplicant = checkSovereignRoleClearance('author', 'scholar@oxford.edu');
  assert.equal(authorApplicant.granted, false);
  assert.equal(authorApplicant.status, 'pending_verification');
});

test('validateContentReport validates moderation submission criteria', () => {
  const invalid = validateContentReport({ targetId: '' });
  assert.equal(invalid.isValid, false);

  const missingCategory = validateContentReport({ targetId: 'c1', reason: 'unknown' });
  assert.equal(missingCategory.isValid, false);

  const shortDetails = validateContentReport({ targetId: 'c1', reason: 'hate_speech', reasonDetails: 'bad' });
  assert.equal(shortDetails.isValid, false);

  const valid = validateContentReport({ targetId: 'c1', reason: 'misinformation', reasonDetails: 'Provides inaccurate sovereign statistics' });
  assert.equal(valid.isValid, true);
});

test('canUserSubmitPublication restricts readers and permits sovereign master', () => {
  const readerCheck = canUserSubmitPublication('reader', 'reader@patriot.org');
  assert.equal(readerCheck.allowed, false);

  const visitorCheck = canUserSubmitPublication('visitor');
  assert.equal(visitorCheck.allowed, false);

  const masterCheck = canUserSubmitPublication('reader', 'wahabalikhiva@gmail.com');
  assert.equal(masterCheck.allowed, true);

  const authorCheck = canUserSubmitPublication('author', 'appointed.author@thepatriot.org');
  assert.equal(authorCheck.allowed, true);
});

test('generatePasswordRecoveryToken generates secure token and URL', () => {
  const result = generatePasswordRecoveryToken('wahabalikhiva@gmail.com');
  assert.ok(result.token.startsWith('patriot_sec_'));
  assert.ok(result.url.includes('wahabalikhiva%40gmail.com'));
  assert.ok(result.expiresAt);
});




