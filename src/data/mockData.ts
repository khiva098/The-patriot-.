import { Article, Author, Comment, EBook, ResearchPaper, Announcement, User, VerificationApplication, StaffMember, StaffAuditLog, LetterToTheEditor, LMSCourse, AppNotification, BreakingNewsItem, ContentReport, PublicationRequest } from '../types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 'author-admin',
    name: 'Wahab Ali Khiva',
    title: 'Editor-in-Chief & Sovereign Founder',
    affiliation: 'The Patriot Publishing Council & Sovereign Directorate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Founder, Editor-in-Chief, and Master Administrator of THE PATRIOT. Leads international sovereign statecraft analysis, peer-review clearances, and institutional governance.',
    verified: true,
    verificationTier: 'editorial_board',
    verificationDetails: {
      tier: 'editorial_board',
      verifiedAt: '2024-01-01',
      badgeLabel: 'Editor-in-Chief',
      institution: 'The Patriot Sovereign Directorate',
      fieldOfStudy: 'Sovereign Statecraft, Monetary Policy & Computational Autonomy',
      credentialTitle: 'Master Administrator & Editor-in-Chief',
    },
  },
  {
    id: 'author-1',
    name: 'Dr. Tariq Al-Mansoor',
    title: 'Senior Fellow in Strategic Studies',
    affiliation: 'Institute for Sovereign Geopolitics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Former diplomatic adviser and scholar of Eurasian trade corridors, international monetary architecture, and regional statecraft.',
    verified: true,
    verificationTier: 'verified_scholar',
    verificationDetails: {
      tier: 'verified_scholar',
      verifiedAt: '2025-09-14',
      badgeLabel: 'Verified Scholar',
      institution: 'Institute for Sovereign Geopolitics',
      fieldOfStudy: 'Strategic Studies & Monetary Architecture',
      orcid: '0000-0002-1825-0097',
      credentialTitle: 'Ph.D. International Political Economy (Oxford)',
    },
  },
  {
    id: 'author-2',
    name: 'Dr. Evelyn Vance',
    title: 'Chair of Quantum Physics & Information Systems',
    affiliation: 'National Advanced Computing Directorate',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead investigator on quantum fault tolerance, topological qubit structures, and cryptographic resilience protocols.',
    verified: true,
    verificationTier: 'verified_scholar',
    verificationDetails: {
      tier: 'verified_scholar',
      verifiedAt: '2025-11-02',
      badgeLabel: 'Verified Scholar',
      institution: 'National Advanced Computing Directorate',
      fieldOfStudy: 'Quantum Information & Cryogenic Physics',
      orcid: '0000-0003-4912-8821',
      credentialTitle: 'Fellow, Institute of Physics (FInstP)',
    },
  },
  {
    id: 'author-3',
    name: 'Dr. Elizabeth Thorne',
    title: 'Professor of Comparative Political Economy',
    affiliation: 'Royal Society of Economic Studies',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Author of three monographs on currency mercantilism, sovereign industrial policy, and fiscal defense.',
    verified: true,
    verificationTier: 'verified_scholar',
    verificationDetails: {
      tier: 'verified_scholar',
      verifiedAt: '2025-08-20',
      badgeLabel: 'Verified Scholar',
      institution: 'Royal Society of Economic Studies',
      fieldOfStudy: 'Comparative Political Economy',
      credentialTitle: 'Chair of Comparative Economics',
    },
  },
  {
    id: 'author-4',
    name: 'Marcus Sterling',
    title: 'Chief Technology Editor',
    affiliation: 'The Patriot Editorial Board',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Investigative correspondent covering global semiconductor lithography, critical mineral supply chains, and computational sovereignty.',
    verified: true,
    verificationTier: 'editorial_board',
    verificationDetails: {
      tier: 'editorial_board',
      verifiedAt: '2024-04-10',
      badgeLabel: 'Editorial Board',
      institution: 'The Patriot Bureau',
      credentialTitle: 'Senior Technology Correspondent',
    },
  },
  {
    id: 'author-5',
    name: 'Zainab Khawar',
    title: 'Contributing Columnist & Jurist',
    affiliation: 'Constitutional Law Observatory',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Writes on institutional integrity, administrative law, public philosophy, and democratic resilience in transitioning nations.',
    verified: true,
    verificationTier: 'verified_scholar',
    verificationDetails: {
      tier: 'verified_scholar',
      verifiedAt: '2025-10-15',
      badgeLabel: 'Verified Scholar',
      institution: 'Constitutional Law Observatory',
      credentialTitle: 'LL.M. & Juris Doctor',
    },
  },
];

export const CURRENT_USER_PROFILES: Record<string, User> = {
  administrator: {
    id: 'usr-admin',
    name: 'Wahab Ali Khiva',
    email: 'wahabalikhiva@gmail.com',
    role: 'administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    bio: 'Editor-in-Chief & Platform Administrator for The Patriot.',
    affiliation: 'The Patriot Publishing Council',
    isVerified: true,
    emailVerified: true,
    verificationTier: 'editorial_board',
    verificationDetails: {
      tier: 'editorial_board',
      verifiedAt: '2024-01-01',
      badgeLabel: 'Editorial Board',
      institution: 'The Patriot Publishing Council',
      credentialTitle: 'Editor-in-Chief & Founder',
    },
  },
  editor: {
    id: 'usr-editor',
    name: 'Eleanor Gray',
    email: 'e.gray@thepatriot.org',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
    bio: 'Senior Desk Editor overseeing Geopolitics and Macroeconomics.',
    affiliation: 'The Patriot Editorial Desk',
    isVerified: true,
    emailVerified: true,
    verificationTier: 'editorial_board',
    verificationDetails: {
      tier: 'editorial_board',
      verifiedAt: '2024-03-15',
      badgeLabel: 'Editorial Board',
      institution: 'The Patriot Editorial Desk',
      credentialTitle: 'Senior Desk Editor',
    },
  },
  author: {
    id: 'usr-author',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'almansoor@thepatriot.org',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    bio: 'Senior Fellow and contributing writer.',
    affiliation: 'Institute for Sovereign Geopolitics',
    isVerified: true,
    emailVerified: true,
    verificationTier: 'verified_scholar',
    verificationDetails: {
      tier: 'verified_scholar',
      verifiedAt: '2025-09-14',
      badgeLabel: 'Verified Scholar',
      institution: 'Institute for Sovereign Geopolitics',
      fieldOfStudy: 'Strategic Studies',
      orcid: '0000-0002-1825-0097',
      credentialTitle: 'Senior Fellow',
    },
  },
  reader: {
    id: 'usr-reader',
    name: 'Haris Munir',
    email: 'haris.m@reader.net',
    role: 'reader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    bio: 'Independent researcher, reader, and policy enthusiast.',
    affiliation: 'Civil Service Forum',
    isVerified: true,
    emailVerified: true,
    verificationTier: 'email_verified',
    verificationDetails: {
      tier: 'email_verified',
      verifiedAt: '2026-02-10',
      badgeLabel: 'Verified Reader',
    },
  },
};

export const INITIAL_VERIFICATION_APPLICATIONS: VerificationApplication[] = [
  {
    id: 'vapp-101',
    userId: 'usr-reader-5',
    applicantName: 'Dr. Arsalan Qureshi',
    email: 'a.qureshi@qau.edu.pk',
    requestedTier: 'verified_scholar',
    institution: 'Quaid-i-Azam University',
    academicTitle: 'Associate Professor of Computational Economics',
    department: 'School of Economics & Data Intelligence',
    orcidOrProfileUrl: 'https://orcid.org/0000-0001-9243-7714',
    credentialsStatement: 'Tenured faculty member researching algorithmic trade balancing, sovereign debt dynamics in developing nations, and macroeconomic modeling. Author of 14 peer-reviewed journal papers in the Journal of International Money and Finance and Applied Economics.',
    submittedAt: '2026-04-02T09:15:00Z',
    status: 'pending',
  },
  {
    id: 'vapp-102',
    userId: 'usr-scholar-2',
    applicantName: 'Dr. Fatima Zahra',
    email: 'f.zahra@oxfordalumni.org',
    requestedTier: 'verified_scholar',
    institution: 'Oxford Institute for Energy Studies',
    academicTitle: 'Senior Energy Transition Fellow',
    department: 'Geopolitics of Minerals & Energy',
    orcidOrProfileUrl: 'https://orcid.org/0000-0002-5510-3941',
    credentialsStatement: 'Ph.D. from Oxford in Resource Geopolitics. Primary advisor to regional decarbonization corridors and author of "Critical Mineral Dependencies in Eurasian Logistics" (2025).',
    submittedAt: '2026-03-28T14:30:00Z',
    status: 'approved',
    reviewedAt: '2026-03-29T10:00:00Z',
    reviewerNotes: 'Verified institutional credentials and published research portfolio via ORCID record.',
  },
];

export const INITIAL_ANNOUNCEMENT: Announcement = {
  id: 'ann-1',
  type: 'breaking',
  isEnabled: true,
  message: 'SPECIAL REPORT: Global central banks formalize multi-currency settlement corridor across 24 emerging markets.',
  linkText: 'Read Dispatch',
  linkUrl: '/articles/the-post-bretton-woods-realignment',
};

export const INITIAL_ARTICLES: Article[] = [];
export const INITIAL_RESEARCH_PAPERS: ResearchPaper[] = [];
export const INITIAL_EBOOKS: EBook[] = [];

export const INAUGURAL_LAUNCH_ARTICLES: Article[] = [];
export const INAUGURAL_LAUNCH_RESEARCH: ResearchPaper[] = [];
export const INAUGURAL_LAUNCH_EBOOKS: EBook[] = [];

export const INITIAL_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'brk-1',
    headline: 'Geneva Multilateral Summit: Central Banks Ratify Sovereign Non-Dollar Clearing Protocol',
    category: 'GEOPOLITICS & ECONOMY',
    timestamp: 'Just now',
    source: 'Geneva Bureau',
    isUrgent: true,
  },
  {
    id: 'brk-2',
    headline: 'High-NA EUV Lithography: 1.4nm Sovereign Semiconductor Milestone Verified in Directorate Cleanroom',
    category: 'TECHNOLOGY & DEFENSE',
    timestamp: '14m ago',
    source: 'Zurich Technology Desk',
  },
  {
    id: 'brk-3',
    headline: 'Karachi Financial Bureau: Benchmark KSE-100 Surpasses 90,000 Points on Regional Trade Volume',
    category: 'FINANCIAL DESK',
    timestamp: '32m ago',
    source: 'Karachi Edition',
  },
  {
    id: 'brk-4',
    headline: 'The Patriot Academic Directorate: 2026 Sovereign Fellowship Peer-Review Submissions Open',
    category: 'ACADEMIC REPOSITORY',
    timestamp: '1h ago',
    source: 'Editorial Council',
  },
];

export const INITIAL_COMMENTS: Comment[] = [];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [];

export const INITIAL_CONTENT_REPORTS: ContentReport[] = [];

export const INITIAL_PUBLICATION_REQUESTS: PublicationRequest[] = [];

export const INITIAL_STAFF_AUDIT_LOGS: StaffAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-01-08T10:15:00Z',
    action: 'appointed',
    targetStaffName: 'Dr. Evelyn Vance',
    targetRole: 'Author Fellow',
    executedBy: 'Wahab Ali Khiva (Master Administrator)',
    details: 'Appointed as Chair of Scientific Publishing with direct publication rights.',
  },
  {
    id: 'log-2',
    timestamp: '2025-11-20T14:30:00Z',
    action: 'appointed',
    targetStaffName: 'Marcus Sterling',
    targetRole: 'Sub-Administrator',
    executedBy: 'Wahab Ali Khiva (Master Administrator)',
    details: 'Appointed as Deputy Systems Administrator for technical moderation & repository operations.',
  },
  {
    id: 'log-3',
    timestamp: '2025-06-10T11:00:00Z',
    action: 'appointed',
    targetStaffName: 'Eleanor Gray',
    targetRole: 'Senior Managing Editor',
    executedBy: 'Wahab Ali Khiva (Master Administrator)',
    details: 'Full editorial board privileges assigned.',
  },
];

export const INITIAL_LETTERS: LetterToTheEditor[] = [
  {
    id: 'let-1',
    writerName: 'Zahid Hussain Bokhari',
    writerEmail: 'zh.bokhari@lums.edu.pk',
    cityOrCountry: 'Lahore, Pakistan',
    topic: 'Monetary Sovereignty & Bilateral Clearing',
    subject: 'Rethinking Bilateral Currency Swaps in South Asia',
    content: 'Dr. Al-Mansoor’s analysis on currency mercantilism hits the heart of the emerging global financial order. However, small developing economies face acute liquidity squeezes when local currency reserves accumulate without multilateral convertible clearing unions. The Patriot’s proposals for sovereign debt-backed parities must be taken seriously by the central banks in Karachi and Islamabad.',
    submittedAt: '2026-04-12T15:20:00Z',
    status: 'published',
    editorialResponse: 'Editor’s Note: A timely contribution. We are preparing a follow-up symposium addressing bilateral clearing mechanisms in developing markets next month.',
  },
  {
    id: 'let-2',
    writerName: 'Prof. Amira Al-Husseini',
    writerEmail: 'a.husseini@georgetown.edu',
    cityOrCountry: 'Washington D.C. & Doha',
    topic: 'Critical Minerals & Transit Chokepoints',
    subject: 'Littoral Security and the Red Sea Passages',
    content: 'Regarding your lead investigation on chokepoint vulnerabilities: landward railways cannot entirely substitute for deep-draft bulk maritime transport. The true solution lies in distributed regional security architectures rather than isolated national autarky.',
    submittedAt: '2026-04-14T08:45:00Z',
    status: 'published',
  },
];

// ----------------------------------------------------------------------
// LMS Portal Courses & Modules
// ----------------------------------------------------------------------

export const INITIAL_LMS_COURSES: LMSCourse[] = [
  {
    id: 'course-1',
    slug: 'grand-strategy-maritime-chokepoints',
    title: 'Grand Strategy & Maritime Chokepoint Defense',
    subtitle: 'Navigating Great Power Rivalries, Critical Straits, and Asymmetric Littoral Fortifications',
    discipline: 'Geopolitics & Defense',
    difficulty: 'Advanced Diplomatic',
    durationWeeks: 4,
    instructorName: 'Dr. Tariq Al-Mansoor',
    instructorTitle: 'Senior Fellow in Strategic Studies',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/patriot_hero_diplomacy_1792591089041.jpg',
    overview: 'An advanced policy masterclass examining maritime vulnerabilities across the Bab-el-Mandeb, Strait of Malacca, and Strait of Hormuz. Designed for diplomatic officers, intelligence analysts, and strategic policy researchers.',
    curriculumObjectives: [
      'Master the three cardinal laws of chokepoint vulnerability and multimodal transit hedges.',
      'Evaluate land-based anti-ship cruise missile (ASCM) doctrines versus traditional blue-water battle fleets.',
      'Formulate bilateral sovereign transit agreements insulated from foreign sanctions.',
    ],
    enrolledStudentsCount: 1420,
    rating: 4.95,
    status: 'published',
    certifiedBy: 'Wahab Ali Khiva (The Patriot Academy of Statecraft)',
    lessons: [
      {
        id: 'c1-l1',
        title: 'Lesson 1: The Geography of Maritime Straits & Economic Exposure',
        order: 1,
        durationMinutes: 35,
        summary: 'Examines why 60% of international petroleum shipments and 80% of regional trade navigate narrow 18-mile littoral passages.',
        briefingNotes: `
### Executive Policy Briefing:
Maritime choke points are physical bottlenecks that connect two larger bodies of water. For sovereign nations, reliance on third-party naval security represents an unacceptable vulnerability.

1. **The Malacca Dilemma**: Over 80,000 vessels traverse this waterway annually. Any interruption creates catastrophic supply chain friction within 72 hours.
2. **Littoral Denial Protocols**: Coastal defense batteries provide asymmetric cost advantages (a $150k missile against a $2B warship).
3. **Multimodal Infrastructure**: Over-land railways and pipeline networks serve as strategic insurance policies.
        `,
        keyTakeaways: [
          'Chokepoint transit must be accompanied by multimodal overland rail corridors.',
          'Coastal fortresses negate foreign expeditionary naval superiority.',
          'Bilateral currency clearing mechanisms stabilize fuel imports during blockades.',
        ],
        readingMaterialSlug: 'the-arch-of-sovereignty',
        quiz: [
          {
            id: 'q1',
            question: 'What is the primary strategic vulnerability of maritime chokepoints?',
            options: [
              'High transit tariffs levied by coastal port authorities',
              'Single-point vulnerability where minimal naval force can interdict vital commerce',
              'Fluctuations in international maritime legal jurisdiction',
              'Seasonal typhoons in open ocean basins',
            ],
            correctOptionIndex: 1,
            explanation: 'Chokepoints concentrate commercial shipping into predictable, narrow channels easily blocked by mines or coastal batteries.',
          },
          {
            id: 'q2',
            question: 'According to asymmetric deterrence doctrine, what renders hostile naval intrusion cost-prohibitive?',
            options: [
              'Expanding blue-water aircraft carrier strike groups',
              'Land-based anti-ship missile defense arrays along the coastline',
              'Relying exclusively on international arbitration courts',
              'Subsidizing foreign merchant vessels',
            ],
            correctOptionIndex: 1,
            explanation: 'Modern coastal anti-ship missile batteries cost a tiny fraction of capital ships while imposing decisive denial of area.',
          },
        ],
      },
      {
        id: 'c1-l2',
        title: 'Lesson 2: Asymmetric Coastal Fortification & Littoral Doctrine',
        order: 2,
        durationMinutes: 45,
        summary: 'Operational mechanics of mobile coastal radar, anti-ship ballistic batteries, and naval mine warfare.',
        briefingNotes: `
### Tactical Doctrine & Strategic Autonomy:
Small-to-medium sovereign powers cannot match the defense budgets of superpower armadas. Asymmetric doctrine turns geographic proximity into an impenetrable barrier.
        `,
        keyTakeaways: [
          'Dispersed mobile batteries cannot be targeted by preemptive strikes.',
          'Smart naval mines create persistent psychological and kinetic deterrence.',
        ],
        quiz: [
          {
            id: 'q3',
            question: 'What is the key advantage of mobile coastal defense systems over fixed bases?',
            options: [
              'Zero maintenance costs',
              'High survivability against preemptive standoff strikes through rapid redeployment',
              'Complete immunity to electronic jamming',
              'Requires no trained personnel',
            ],
            correctOptionIndex: 1,
            explanation: 'Mobility prevents enemy satellite reconnaissance from locking coordinates for cruise missile strikes.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    slug: 'sovereign-monetary-architecture',
    title: 'Sovereign Monetary Architecture & Central Banking',
    subtitle: 'Bilateral Clearing Unions, Defensive Capital Controls, and De-Dollarization Mechanics',
    discipline: 'Economics & Statecraft',
    difficulty: 'Intermediate',
    durationWeeks: 3,
    instructorName: 'Dr. Elizabeth Thorne',
    instructorTitle: 'Professor of Comparative Political Economy',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/patriot_book_economic_history_1792591091807.jpg',
    overview: 'A rigorous curriculum exploring how independent economies construct non-dollar bilateral trade clearing mechanisms, protect national balance sheets against speculative contagion, and allocate strategic credit.',
    curriculumObjectives: [
      'Examine the mechanics of bilateral central bank currency swap agreements.',
      'Deploy targeted capital controls that defend exchange rates while stimulating domestic production.',
      'Structure sovereign wealth reserves in tangible gold, bilateral credit, and critical commodity inventories.',
    ],
    enrolledStudentsCount: 1180,
    rating: 4.88,
    status: 'published',
    certifiedBy: 'Wahab Ali Khiva (The Patriot Academy of Statecraft)',
    lessons: [
      {
        id: 'c2-l1',
        title: 'Lesson 1: The Currency Weapon & Vulnerability of Foreign Reserves',
        order: 1,
        durationMinutes: 40,
        summary: 'Historical case studies of sovereign reserve freezes and the legal mechanics of extraterritorial financial sanctions.',
        briefingNotes: `
Central bank reserves stored in foreign correspondent accounts are not sovereign assets; they are unsecured credit obligations subject to foreign political jurisdictions.
        `,
        keyTakeaways: [
          'Repatriating gold reserves eliminates counterparty seizure risks.',
          'Bilateral currency swaps remove foreign banking intermediaries from trade settlement.',
        ],
        quiz: [
          {
            id: 'q4',
            question: 'What occurs when a nation stores its foreign exchange reserves in third-party correspondent accounts?',
            options: [
              'It earns guaranteed non-taxable compound interest',
              'It subjects its national balance sheet to foreign jurisdictional freeze risk',
              'It automatically becomes a member of the IMF board',
              'Its domestic currency gains gold parity',
            ],
            correctOptionIndex: 1,
            explanation: 'Foreign correspondent accounts operate under the territorial laws of the host state and can be frozen at will.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    slug: 'quantum-computing-cryptographic-resilience',
    title: 'Quantum Information & Computational Sovereignty',
    subtitle: 'Superconducting Transmon Coherence, Cryogenic Dilution, and Post-Quantum Security',
    discipline: 'Advanced Technologies',
    difficulty: 'Advanced Diplomatic',
    durationWeeks: 3,
    instructorName: 'Dr. Evelyn Vance',
    instructorTitle: 'Chair of Quantum Physics & Information Systems',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/patriot_research_quantum_lithography_1792591071239.jpg',
    overview: 'Technical masterclass on sovereign computational security: quantum error syndrome decoding, topological qubit shielding at 12 mK, and national post-quantum encryption protocols.',
    curriculumObjectives: [
      'Understand the Decoherence threshold and topological stabilizer code engineering.',
      'Assess sovereign compute vulnerability to Shor’s algorithm and public-key deciphering.',
      'Formulate national domestic quantum testbed roadmaps.',
    ],
    enrolledStudentsCount: 890,
    rating: 4.98,
    status: 'published',
    certifiedBy: 'Wahab Ali Khiva (The Patriot Academy of Statecraft)',
    lessons: [
      {
        id: 'c3-l1',
        title: 'Lesson 1: Topological Stabilizers & Cryogenic Shielding at 15 mK',
        order: 1,
        durationMinutes: 50,
        summary: 'Decoherence suppression protocols using superconducting niobium-titanium arrays.',
        briefingNotes: `
Quantum computers require isolation from ambient electromagnetic radiation and thermal noise. The Patriot testbed demonstrated a 4.2x coherence increase using topological surface codes.
        `,
        keyTakeaways: [
          'Surface codes provide fault-tolerance thresholds of ~99.8%.',
          'Sovereign compute security mandates domestic cryptographic algorithms.',
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------
// Universal Notification Feed
// ----------------------------------------------------------------------

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Editorial Clearance Request',
    message: 'Author Dr. Evelyn Vance submitted manuscript "Quantum Information & Systems" with front-page photos for Wahab Ali Khiva\'s mandatory publication approval.',
    category: 'editorial_clearance',
    timestamp: '2026-10-30T09:12:00Z',
    read: false,
    priority: 'urgent',
    actorName: 'Dr. Evelyn Vance',
    actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    link: { view: 'admin', tab: 'approval' },
  },
  {
    id: 'notif-2',
    title: 'New LMS Masterclass Available',
    message: 'Academy course "Grand Strategy & Maritime Chokepoint Defense" by Dr. Tariq Al-Mansoor is now open for Reader and Scholar enrollment.',
    category: 'lms_course',
    timestamp: '2026-10-29T16:30:00Z',
    read: false,
    priority: 'normal',
    link: { view: 'lms', detailId: 'course-1' },
  },
  {
    id: 'notif-3',
    title: 'Broadsheet Letter Response Published',
    message: 'The Editorial Desk published an official response to Zahid Hussain Bokhari’s letter on South Asian currency swap clearing.',
    category: 'letter_reply',
    timestamp: '2026-10-29T11:45:00Z',
    read: true,
    priority: 'normal',
    link: { view: 'opinions' },
  },
  {
    id: 'notif-4',
    title: 'Sovereign Platform Security Attestation',
    message: 'Platform Owner Wahab Ali Khiva verified sovereign RBAC security protocols. Only Primary Administrator can appoint staff or release author publications.',
    category: 'system_security',
    timestamp: '2026-10-28T08:00:00Z',
    read: true,
    priority: 'normal',
    link: { view: 'admin', tab: 'staff' },
  },
];

// ----------------------------------------------------------------------
// Default User Credentials for Separate Logins
// ----------------------------------------------------------------------

export const DEFAULT_USER_CREDENTIALS = [
  {
    role: 'administrator' as const,
    name: 'Wahab Ali Khiva',
    email: 'wahabalikhiva@gmail.com',
    password: 'khiva666',
    title: 'Platform Owner & Master Administrator',
    badge: 'Exclusive Master Authority',
  },
  {
    role: 'author' as const,
    name: 'Dr. Tariq Al-Mansoor',
    email: 'almansoor@thepatriot.org',
    password: 'patriot@author2026',
    title: 'Contributing Author Fellow',
    badge: 'Verified Scholar Fellow',
  },
  {
    role: 'reader' as const,
    name: 'Haris Munir',
    email: 'haris.m@reader.net',
    password: 'patriot@reader2026',
    title: 'Registered Scholarly Reader',
    badge: 'Verified Reader',
  },
];


