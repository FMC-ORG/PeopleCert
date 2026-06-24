/**
 * Mock PeopleCert knowledge base.
 *
 * Represents content that would typically be pulled from a CRM knowledge
 * base (Dynamics 365 Customer Service), candidate portal FAQs, policy
 * documents, and LMS course descriptions. The narrative for the demo is
 * that all of these sources are federated into a single Sitecore Search
 * index so that every support surface (help center, AI answer, chat,
 * detail page) speaks to the same source of truth.
 *
 * Field shape matches what the Sitecore Search SDK returns for the
 * `content` entity of a SearchResults widget:
 *   { id, title, name, description, subtitle, type, url, image_url,
 *     source_id, certification, language, audience }
 *
 * The `certification`, `language` and `audience` fields drive facets.
 */

export const SOURCES = {
  D365: 'D365 Customer Service KB',
  CANDIDATE_PORTAL: 'MyPeopleCert FAQ',
  POLICY: 'Policy library',
  LMS: 'LearnPeopleCert LMS',
};

const IMG = {
  itil: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=800&q=70',
  prince2: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=70',
  devops: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=800&q=70',
  language: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=70',
  exam: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70',
  certificate: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=70',
  account: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=70',
  technical: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=70',
  policy: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=70',
  support: 'https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=800&q=70',
};

export const CATALOG = [
  // --- ITIL renewal scenario (Maria) -------------------------------------
  {
    id: 'itil-renewal-process',
    title: 'How to renew your ITIL 4 certification',
    subtitle: 'Step-by-step renewal instructions for ITIL 4 Foundation, Managing Professional and Strategic Leader.',
    description:
      'ITIL 4 certifications are valid for 3 years. To renew, (1) earn 20 CPD points in the active 3-year cycle, (2) sign in to MyPeopleCert and open My Certifications, (3) click Renew next to your certification, upload your CPD evidence, and pay the renewal fee. The whole process takes under 10 minutes and your new digital certificate is issued instantly.',
    type: 'Article',
    url: '/detail/itil-renewal-process',
    image_url: IMG.itil,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['renewal', 'itil', 'cpd'],
  },
  {
    id: 'itil-renewal-fees',
    title: 'ITIL renewal fees and pricing',
    subtitle: 'What you pay to keep your ITIL 4 certification active.',
    description:
      'ITIL 4 Foundation renewal is GBP 100 (or equivalent in local currency). Managing Professional and Strategic Leader renewals are GBP 160. A late-renewal surcharge of GBP 35 applies inside the 6-month grace period. All fees include your updated digital certificate and LinkedIn-ready digital badge.',
    type: 'FAQ',
    url: '/detail/itil-renewal-fees',
    image_url: IMG.itil,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['pricing', 'renewal', 'itil'],
  },
  {
    id: 'itil-renewal-deadline',
    title: 'ITIL renewal deadlines and grace period',
    subtitle: 'Key dates you need to know before your ITIL certification expires.',
    description:
      'Your ITIL 4 certification expires exactly 3 years after it was awarded. PeopleCert recommends you start the renewal process 90 days before expiry. If you miss the expiry date, a 6-month grace period lets you renew with a small late fee. After the grace period ends you must retake the full exam.',
    type: 'Policy',
    url: '/detail/itil-renewal-deadline',
    image_url: IMG.policy,
    source_id: SOURCES.POLICY,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['deadline', 'renewal', 'itil', 'grace-period'],
  },
  {
    id: 'itil-cpd-requirements',
    title: 'CPD points requirements for ITIL renewal',
    subtitle: 'How many Continuing Professional Development points you need and how to claim them.',
    description:
      'ITIL 4 Foundation requires 20 CPD points over 3 years. Managing Professional requires 30 points. You earn points by attending webinars, publishing articles, speaking at events or completing further PeopleCert courses. CPD evidence is uploaded directly inside MyPeopleCert - no paperwork.',
    type: 'Article',
    url: '/detail/itil-cpd-requirements',
    image_url: IMG.itil,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['cpd', 'renewal', 'itil'],
  },
  {
    id: 'itil-renew-online-portal',
    title: 'Renew your ITIL certification online in MyPeopleCert',
    subtitle: 'Walk-through of the self-service renewal flow.',
    description:
      'Sign in at my.peoplecert.org, open My Certifications, pick the ITIL credential you want to renew, and click Renew now. Upload CPD evidence, confirm your details, pay by card or invoice, and download the new certificate. Most candidates complete the full flow in under 2 minutes.',
    type: 'Article',
    url: '/detail/itil-renew-online-portal',
    image_url: IMG.account,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['online', 'renewal', 'itil', 'mypeoplecert'],
  },
  {
    id: 'itil-grace-period',
    title: 'What happens if I miss my ITIL renewal date?',
    subtitle: 'The 6-month grace period and what it means for your certification status.',
    description:
      'If you do not renew before your expiry date, your ITIL certification enters a 6-month grace period. During the grace period your badge shows as Expired - Renewal Pending and you can still renew by paying a GBP 35 late fee. After 6 months, renewal is no longer possible and you must sit the full exam again.',
    type: 'FAQ',
    url: '/detail/itil-grace-period',
    image_url: IMG.policy,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['grace-period', 'renewal', 'itil'],
  },

  // --- PRINCE2 ------------------------------------------------------------
  {
    id: 'prince2-reschedule-exam',
    title: 'Reschedule your PRINCE2 exam',
    subtitle: 'Change the date or time of your online proctored PRINCE2 exam.',
    description:
      'You can reschedule a PRINCE2 Foundation or Practitioner exam up to 48 hours before the booked time at no cost. Sign in to MyPeopleCert, open My Exams, and pick a new slot. Reschedules inside the 48-hour window incur a GBP 25 fee.',
    type: 'Article',
    url: '/detail/prince2-reschedule-exam',
    image_url: IMG.prince2,
    source_id: SOURCES.D365,
    certification: 'PRINCE2',
    language: 'English',
    audience: 'Professional',
    tags: ['reschedule', 'prince2', 'exam'],
  },
  {
    id: 'prince2-re-registration',
    title: 'PRINCE2 Re-registration exam',
    subtitle: 'Keep your PRINCE2 Practitioner certification active.',
    description:
      'PRINCE2 Practitioner is valid for 3 years. To stay Registered you can either re-sit the Practitioner exam or renew through the CPD route with 20 points per year. The Re-registration exam is shorter (1 hour, 30 questions) and can be taken online.',
    type: 'Article',
    url: '/detail/prince2-re-registration',
    image_url: IMG.prince2,
    source_id: SOURCES.LMS,
    certification: 'PRINCE2',
    language: 'English',
    audience: 'Professional',
    tags: ['re-registration', 'prince2', 'renewal'],
  },

  // --- DevOps -------------------------------------------------------------
  {
    id: 'devops-levels',
    title: 'DevOps Institute certification levels explained',
    subtitle: 'From DOFD Foundation to DevOps Leader - which one is right for you?',
    description:
      'DevOps Institute offers a full learning path: DevOps Foundation, SRE Foundation, DevSecOps, Value Stream Management Foundation and DevOps Leader. Each level builds on the previous one and maps cleanly to common job roles.',
    type: 'Course',
    url: '/detail/devops-levels',
    image_url: IMG.devops,
    source_id: SOURCES.LMS,
    certification: 'DevOps',
    language: 'English',
    audience: 'Professional',
    tags: ['devops', 'levels', 'learning-path'],
  },
  {
    id: 'devops-cpd-renewal',
    title: 'DevOps Institute CPD renewal',
    subtitle: 'How to maintain your DevOps Institute certification.',
    description:
      'DevOps Institute certifications are valid for 2 years. Earn 20 CPD points per cycle, log them in MyPeopleCert, and pay the GBP 75 renewal fee. Evidence can include blog posts, conference talks or further PeopleCert courses.',
    type: 'FAQ',
    url: '/detail/devops-cpd-renewal',
    image_url: IMG.devops,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'DevOps',
    language: 'English',
    audience: 'Professional',
    tags: ['devops', 'cpd', 'renewal'],
  },

  // --- LanguageCert -------------------------------------------------------
  {
    id: 'languagecert-speaking',
    title: 'LanguageCert speaking test format',
    subtitle: 'What to expect on exam day.',
    description:
      'The LanguageCert International ESOL Speaking test is a 15-minute online interview with a live examiner. You will talk about a familiar topic, describe a picture and discuss an abstract theme. Results are released within 5 working days.',
    type: 'Article',
    url: '/detail/languagecert-speaking',
    image_url: IMG.language,
    source_id: SOURCES.D365,
    certification: 'LanguageCert',
    language: 'English',
    audience: 'Professional',
    tags: ['languagecert', 'speaking', 'exam-format'],
  },
  {
    id: 'languagecert-levels',
    title: 'Understanding LanguageCert CEFR levels',
    subtitle: 'From A1 to C2 - which LanguageCert exam should you book?',
    description:
      'LanguageCert exams are aligned with the Common European Framework of Reference (CEFR). Choose A1 Preliminary for basic travel conversations, B2 Communicator for professional use, C1 Expert for university admission, or C2 Mastery for native-level proficiency.',
    type: 'Article',
    url: '/detail/languagecert-levels',
    image_url: IMG.language,
    source_id: SOURCES.LMS,
    certification: 'LanguageCert',
    language: 'English',
    audience: 'Professional',
    tags: ['languagecert', 'cefr', 'levels'],
  },

  // --- Candidate portal / exam day ----------------------------------------
  {
    id: 'exam-booking-guide',
    title: 'Book your online proctored exam',
    subtitle: 'Pick a time, confirm your ID and pay - all in one flow.',
    description:
      'Sign in to MyPeopleCert, open Book Exam, choose your certification, pick a 24/7 slot in the next 12 weeks, confirm your photo ID matches your booking name, and pay. You will receive a confirmation email with the Exam Shield download link.',
    type: 'Article',
    url: '/detail/exam-booking-guide',
    image_url: IMG.exam,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['booking', 'exam', 'online-proctoring'],
  },
  {
    id: 'webcam-requirements',
    title: 'Webcam and system requirements for online exams',
    subtitle: 'Check your setup before exam day.',
    description:
      'PeopleCert Exam Shield runs on Windows 10+ and macOS 12+. You need a minimum 2 Mbps upload, a HD webcam, a clear workspace, and admin rights to install Exam Shield. Our automated system check at my.peoplecert.org/systemcheck tells you in 30 seconds whether you are ready.',
    type: 'Article',
    url: '/detail/webcam-requirements',
    image_url: IMG.technical,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['webcam', 'system-check', 'technical', 'exam'],
  },
  {
    id: 'technical-troubleshooting',
    title: 'Troubleshoot exam day issues',
    subtitle: 'Quick fixes for the most common Exam Shield problems.',
    description:
      'If Exam Shield will not start, (1) close VPN and screen-sharing apps, (2) re-launch with Run as Administrator, (3) run the system check. If you still cannot connect, contact 24/7 support via chat - we will reschedule at no cost and credit a voucher.',
    type: 'Article',
    url: '/detail/technical-troubleshooting',
    image_url: IMG.technical,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['technical', 'exam-shield', 'troubleshooting'],
  },
  {
    id: 'download-certificate',
    title: 'Download your digital certificate',
    subtitle: 'Find, download and share your PeopleCert certificate as PDF.',
    description:
      'Sign in to MyPeopleCert, open My Certifications, and click Download. Your certificate is available as a signed PDF and as a shareable digital badge for LinkedIn, Twitter and email signatures. Badges are issued through Credly.',
    type: 'FAQ',
    url: '/detail/download-certificate',
    image_url: IMG.certificate,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['certificate', 'digital-badge', 'credly'],
  },
  {
    id: 'digital-badge-linkedin',
    title: 'Share your digital badge on LinkedIn',
    subtitle: 'Get your certification in front of recruiters in 30 seconds.',
    description:
      'From MyPeopleCert, click Share Badge and choose LinkedIn. The badge is added to your Licenses & Certifications section automatically, with a verification link back to PeopleCert.',
    type: 'Article',
    url: '/detail/digital-badge-linkedin',
    image_url: IMG.certificate,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['digital-badge', 'linkedin', 'credly'],
  },
  {
    id: 'exam-results-timing',
    title: 'When will I get my exam results?',
    subtitle: 'Timing for online proctored, paper-based and speaking tests.',
    description:
      'Online proctored exam results are available in MyPeopleCert within 30 minutes. LanguageCert speaking tests take up to 5 working days. Paper-based sittings take 3 to 5 working days after the examiner receives the script.',
    type: 'FAQ',
    url: '/detail/exam-results-timing',
    image_url: IMG.exam,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['results', 'exam'],
  },
  {
    id: 'take2-feature',
    title: 'How Take2 gives you a second chance',
    subtitle: 'Free resit with every eligible ITIL and PRINCE2 exam.',
    description:
      'Take2 is included with most PeopleCert exam bookings at no extra cost. If you do not pass first time, you get a free second attempt within 6 months. Book your Take2 attempt directly from your results page in MyPeopleCert.',
    type: 'FAQ',
    url: '/detail/take2-feature',
    image_url: IMG.exam,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['take2', 'resit', 'exam'],
  },

  // --- Account, billing, policies -----------------------------------------
  {
    id: 'password-reset',
    title: 'Reset your MyPeopleCert account password',
    subtitle: 'Recover access to your candidate portal in minutes.',
    description:
      'Go to my.peoplecert.org, click Forgot password, enter the email registered on your account, and follow the link in the reset email. The email arrives within 2 minutes; check spam if it does not.',
    type: 'FAQ',
    url: '/detail/password-reset',
    image_url: IMG.account,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['account', 'password', 'login'],
  },
  {
    id: 'mypeoplecert-login',
    title: 'Sign in to MyPeopleCert',
    subtitle: 'One account for all your certifications, exams and payments.',
    description:
      'Your MyPeopleCert account is the single sign-on across all PeopleCert brands - ITIL, PRINCE2, DevOps Institute and LanguageCert. If you have a legacy ILX or Axelos account, MyPeopleCert merges it automatically the first time you sign in.',
    type: 'Article',
    url: '/detail/mypeoplecert-login',
    image_url: IMG.account,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['account', 'sso', 'login'],
  },
  {
    id: 'invoice-download',
    title: 'How to download your invoice',
    subtitle: 'Get a VAT-compliant invoice for any exam or renewal payment.',
    description:
      'Open MyPeopleCert, go to Billing > Invoices, and click Download PDF next to the transaction. You can also email the invoice to a second address (useful for your employer) directly from the same screen.',
    type: 'FAQ',
    url: '/detail/invoice-download',
    image_url: IMG.account,
    source_id: SOURCES.CANDIDATE_PORTAL,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['invoice', 'billing', 'vat'],
  },
  {
    id: 'refund-policy',
    title: 'PeopleCert refund policy',
    subtitle: 'When refunds are possible and how to request one.',
    description:
      'Exam bookings can be refunded up to 48 hours before the scheduled time. Course bundles are refundable within 14 days of purchase if no content has been accessed. Refunds arrive on the original payment method within 10 working days.',
    type: 'Policy',
    url: '/detail/refund-policy',
    image_url: IMG.policy,
    source_id: SOURCES.POLICY,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['refund', 'policy', 'billing'],
  },
  {
    id: 'study-materials-access',
    title: 'Access your official study materials',
    subtitle: 'Download publications, eBooks and access eLearning.',
    description:
      'All study materials bundled with your exam booking are available in MyPeopleCert > My Learning. eBooks open inside our reader; PDFs are DRM-protected and bound to your account. eLearning is valid for 12 months from purchase.',
    type: 'Article',
    url: '/detail/study-materials-access',
    image_url: IMG.exam,
    source_id: SOURCES.LMS,
    certification: 'ITIL',
    language: 'English',
    audience: 'Professional',
    tags: ['study', 'elearning', 'publications'],
  },

  // --- Organization ------------------------------------------------------
  {
    id: 'organization-bulk-booking',
    title: 'Book exams for multiple candidates',
    subtitle: 'Bulk booking for L&D teams and training providers.',
    description:
      'Organizations can purchase exam vouchers in bulk and assign them to team members by email. Manage the full pipeline from the PeopleCert for Business portal - bookings, reminders, results and CPD reports in one place.',
    type: 'Article',
    url: '/detail/organization-bulk-booking',
    image_url: IMG.support,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Organization',
    tags: ['bulk', 'organization', 'voucher'],
  },
  {
    id: 'organization-reporting',
    title: 'Certification reporting for your team',
    subtitle: 'Track progress, pass rates and renewal dates across your organization.',
    description:
      'PeopleCert for Business includes a live dashboard of every certification held by your team, renewal deadlines, and CPD compliance. Export to CSV or push directly to your LMS through the REST API.',
    type: 'Article',
    url: '/detail/organization-reporting',
    image_url: IMG.support,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Organization',
    tags: ['organization', 'reporting', 'dashboard'],
  },

  // --- Partner -----------------------------------------------------------
  {
    id: 'partner-portal-access',
    title: 'Partner portal access and resources',
    subtitle: 'Everything an Accredited Training Organization (ATO) needs.',
    description:
      'Accredited partners get a dedicated portal with training materials, co-branded marketing assets, lead pipelines, and a direct line to PeopleCert partner success managers. Request access through partners.peoplecert.org.',
    type: 'Article',
    url: '/detail/partner-portal-access',
    image_url: IMG.support,
    source_id: SOURCES.D365,
    certification: 'ITIL',
    language: 'English',
    audience: 'Partner',
    tags: ['partner', 'ato', 'portal'],
  },
  {
    id: 'partner-marketing-assets',
    title: 'Co-branded marketing assets for partners',
    subtitle: 'Download brochures, web banners and case studies.',
    description:
      'All partner marketing assets are available under the Assets tab of the Partner Portal. Co-branded versions are generated on demand with your logo. New ITIL 4 assets are published quarterly.',
    type: 'Article',
    url: '/detail/partner-marketing-assets',
    image_url: IMG.support,
    source_id: SOURCES.LMS,
    certification: 'ITIL',
    language: 'English',
    audience: 'Partner',
    tags: ['partner', 'marketing', 'assets'],
  },
];

// A lookup for fast retrieval by id.
export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((a) => [a.id, a]));

// --- Facet sort choices ---------------------------------------------------
export const SORT_CHOICES = [
  { name: 'featured_desc', label: 'Most relevant' },
  { name: 'recent_desc', label: 'Newest first' },
  { name: 'title_asc', label: 'Title A-Z' },
  { name: 'title_desc', label: 'Title Z-A' },
];

// --- Dynamic recommendations keyed by audience ----------------------------
export const RECOMMENDATIONS_BY_AUDIENCE = {
  professional: {
    headline: 'Recommended for professionals',
    tagline:
      'Keep your skills current - based on certifications you hold and what others in your role are reading.',
    articleIds: ['itil-renewal-process', 'itil-cpd-requirements', 'take2-feature', 'digital-badge-linkedin'],
  },
  organization: {
    headline: 'Recommended for your organization',
    tagline:
      'Scale training and keep your team compliant - the top reads for L&D and training managers.',
    articleIds: [
      'organization-bulk-booking',
      'organization-reporting',
      'itil-renewal-deadline',
      'refund-policy',
    ],
  },
  partner: {
    headline: 'Recommended for Accredited Training Organizations',
    tagline: 'Grow your ATO practice - the partner resources most used this week.',
    articleIds: [
      'partner-portal-access',
      'partner-marketing-assets',
      'devops-levels',
      'languagecert-levels',
    ],
  },
};
