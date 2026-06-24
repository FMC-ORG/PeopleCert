/**
 * Mock generative Q&A. Each scenario matches one or more keyphrases
 * and returns an answer grounded in articles from the CATALOG, plus
 * a set of related follow-up questions. In a real deployment this
 * would come from the Sitecore Search Q&A widget (RAG over the index).
 */

export const QA_SCENARIOS = [
  {
    match: /(itil).*?(renew|renewal|expire|expiring|expired|re-?certify)|renew.*?itil/i,
    sourceIds: ['itil-renewal-process', 'itil-renewal-fees', 'itil-renewal-deadline'],
    answer: {
      question: 'How do I renew my ITIL 4 certification?',
      answer:
        'Renewing your ITIL 4 certification is a 3-step self-service process. First, check that you have earned 20 CPD points in the 3-year cycle (30 for Managing Professional). Second, sign in to MyPeopleCert, open My Certifications, and click Renew next to your ITIL credential. Third, upload your CPD evidence and pay the renewal fee - GBP 100 for Foundation, GBP 160 for MP/SL. Your new digital certificate is issued instantly. You must renew within 90 days of your expiry date; a 6-month grace period with a GBP 35 late fee applies after that. Most candidates complete the full flow in under 2 minutes.',
    },
    related: [
      {
        question: 'How much does ITIL renewal cost?',
        answer:
          'ITIL 4 Foundation renewal is GBP 100 and ITIL MP/SL is GBP 160. A GBP 35 late fee applies during the 6-month grace period.',
      },
      {
        question: 'What happens if I miss my ITIL renewal deadline?',
        answer:
          'You enter a 6-month grace period where you can still renew by paying a late fee. After that, you must take the full exam again.',
      },
      {
        question: 'How many CPD points do I need to renew?',
        answer:
          'ITIL 4 Foundation needs 20 CPD points in the 3-year cycle. Managing Professional needs 30 points. Evidence is uploaded in MyPeopleCert.',
      },
      {
        question: 'Can I renew online without an exam?',
        answer:
          'Yes. The CPD renewal route is fully online and takes under 2 minutes. You only need to re-sit the exam if you miss the grace period.',
      },
    ],
  },
  {
    match: /(prince2).*?(renew|renewal|re-?register|re-?registration|expire)/i,
    sourceIds: ['prince2-re-registration', 'prince2-reschedule-exam'],
    answer: {
      question: 'How do I re-register my PRINCE2 Practitioner certification?',
      answer:
        'PRINCE2 Practitioner is valid for 3 years. You can stay Registered by either (a) re-sitting the shorter Practitioner Re-registration exam (1 hour, 30 questions, online) or (b) following the CPD route with 20 points per year uploaded in MyPeopleCert. Option (a) is the fastest for most candidates: the exam can be booked 24/7 and results arrive within 30 minutes.',
    },
    related: [
      {
        question: 'Can I reschedule my PRINCE2 exam?',
        answer:
          'Yes - free up to 48 hours before your slot, then a GBP 25 fee inside the 48-hour window.',
      },
      {
        question: 'Do I need to retake all PRINCE2 exams?',
        answer:
          'Only Practitioner expires. PRINCE2 Foundation is for life. Agile Practitioner follows the same 3-year cycle as Practitioner.',
      },
    ],
  },
  {
    match: /(reschedule|change|move).*?(exam|booking|test)|(exam|booking|test).*?(reschedule)/i,
    sourceIds: ['prince2-reschedule-exam', 'exam-booking-guide'],
    answer: {
      question: 'How do I reschedule my online proctored exam?',
      answer:
        'Open MyPeopleCert, go to My Exams, and click Reschedule next to the booking you want to change. Reschedules made more than 48 hours before your slot are free; inside 48 hours a GBP 25 fee applies. Your new confirmation email includes a fresh Exam Shield download link.',
    },
    related: [
      {
        question: 'How late can I reschedule?',
        answer: 'Up to 60 minutes before your slot, with the 48-hour-window fee applied.',
      },
      {
        question: 'Can I reschedule for free?',
        answer: 'Yes, if you reschedule more than 48 hours ahead of the booked time.',
      },
    ],
  },
  {
    match: /(certificate|badge).*(download|share|linked|get|receive)|download.*(certificate|badge)/i,
    sourceIds: ['download-certificate', 'digital-badge-linkedin'],
    answer: {
      question: 'How do I download my PeopleCert certificate?',
      answer:
        'Sign in at my.peoplecert.org, open My Certifications, and click Download next to the credential you want. The certificate is a signed PDF. Digital badges are issued through Credly and can be shared to LinkedIn in one click from the same screen.',
    },
    related: [
      {
        question: 'Where is my digital badge?',
        answer:
          'Badges appear in MyPeopleCert > My Certifications with a Share to LinkedIn button that uses Credly.',
      },
      {
        question: 'Can I share the badge on my CV?',
        answer:
          'Yes - Credly provides a verification URL you can copy into your CV or email signature.',
      },
    ],
  },
  {
    match: /(refund|money back|cancel.*?payment|cancel.*?booking)/i,
    sourceIds: ['refund-policy', 'invoice-download'],
    answer: {
      question: 'Can I get a refund on my exam booking?',
      answer:
        'Exam bookings are refundable up to 48 hours before the scheduled time. Course bundles are refundable within 14 days of purchase if no content has been accessed. Refunds arrive on the original payment method within 10 working days. Request the refund from MyPeopleCert > Billing > My Payments.',
    },
    related: [
      {
        question: 'How long does a refund take?',
        answer: '10 working days on the original payment method.',
      },
      {
        question: 'Can I get my invoice?',
        answer: 'Yes, from Billing > Invoices in MyPeopleCert. VAT-compliant PDFs.',
      },
    ],
  },
  {
    match: /(webcam|system check|exam shield|system requirements|technical|cannot connect)/i,
    sourceIds: ['webcam-requirements', 'technical-troubleshooting'],
    answer: {
      question: 'What do I need to take the online exam?',
      answer:
        'You need a Windows 10+ or macOS 12+ laptop, a HD webcam, a minimum 2 Mbps upload connection, a clear private workspace, and admin rights to install Exam Shield. Run the automated check at my.peoplecert.org/systemcheck 24 hours before your exam to confirm everything is ready.',
    },
    related: [
      {
        question: 'What if Exam Shield will not start?',
        answer:
          'Close any VPN or screen-share apps, re-launch as Administrator, and run the system check. Live support is available 24/7 if issues persist.',
      },
      {
        question: 'Can I use a tablet?',
        answer: 'No - Exam Shield only runs on Windows and macOS laptops or desktops.',
      },
    ],
  },
  {
    match: /(password|sign in|login|locked out|forgot)/i,
    sourceIds: ['password-reset', 'mypeoplecert-login'],
    answer: {
      question: 'How do I reset my MyPeopleCert password?',
      answer:
        'Go to my.peoplecert.org, click Forgot password, enter the email on your account, and follow the link in the reset email. The email arrives within 2 minutes; check spam if not. If the email address no longer works, contact support with a photo ID.',
    },
    related: [
      {
        question: 'Can I merge two accounts?',
        answer:
          'Yes - legacy ILX or Axelos accounts are merged automatically the first time you sign in to MyPeopleCert.',
      },
      {
        question: 'How do I update my email?',
        answer: 'Open Profile > Contact details and add a new verified email.',
      },
    ],
  },
];

// A fallback Q&A for any query that does not match a scenario.
export const FALLBACK_QA = {
  sourceIds: ['itil-renewal-process', 'exam-booking-guide', 'download-certificate'],
  answer: {
    question: 'How can the PeopleCert Help Center help you?',
    answer:
      'Ask a question in plain language - for example "How do I renew my ITIL certification?", "Reschedule my exam" or "Where is my digital badge?". The AI reads across your MyPeopleCert FAQ, D365 Customer Service KB, policies and LMS, and replies with a single answer plus links to the original articles.',
  },
  related: [
    {
      question: 'How do I renew my ITIL certification?',
      answer:
        'Earn CPD points, upload evidence in MyPeopleCert, pay the renewal fee. Takes under 2 minutes.',
    },
    {
      question: 'How do I reschedule my exam?',
      answer: 'From My Exams in MyPeopleCert - free up to 48 hours before your slot.',
    },
    {
      question: 'How do I download my certificate?',
      answer: 'My Certifications in MyPeopleCert - PDF and LinkedIn badge.',
    },
  ],
};

/**
 * Flattened list of known-good question phrases. Used by the
 * zero-result recovery flow to power "Did you mean..." suggestions.
 */
export const KNOWN_QA_PHRASES = (() => {
  const out = [];
  for (const s of QA_SCENARIOS) {
    if (s.answer?.question) out.push(s.answer.question);
    if (Array.isArray(s.related)) {
      for (const r of s.related) if (r.question) out.push(r.question);
    }
  }
  if (FALLBACK_QA.answer?.question) out.push(FALLBACK_QA.answer.question);
  return out;
})();

/**
 * Picks the best-matching scenario for a given keyphrase.
 *
 * Returns:
 *  - FALLBACK_QA when the keyphrase is blank (home page "most asked"
 *    and any surface that wants a canned answer instead of silence).
 *  - A matched scenario when the query hits one of the regexes or has
 *    meaningful whole-word overlap with a source article id.
 *  - `null` when nothing matches. The AI answer widget uses this to
 *    trigger the zero-result recovery card instead of pretending to
 *    have an answer.
 */
export function matchScenario(keyphrase) {
  if (!keyphrase) return FALLBACK_QA;
  const trimmed = keyphrase.trim();
  if (!trimmed) return FALLBACK_QA;
  for (const s of QA_SCENARIOS) {
    if (s.match.test(trimmed)) return s;
  }
  // Whole-word fuzzy fallback on source article IDs. Splits IDs like
  // "download-certificate" into ["download","certificate"] so that the
  // query token "cat" does NOT match "certifi<cat>e" as a substring.
  // Tokens shorter than 3 chars are ignored as stopwords.
  const queryTokens = trimmed
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length >= 3);
  if (queryTokens.length > 0) {
    for (const s of QA_SCENARIOS) {
      const sourceWords = new Set(
        s.sourceIds.flatMap((id) => id.toLowerCase().split(/[-_/]+/)),
      );
      if (queryTokens.some((qt) => sourceWords.has(qt))) return s;
    }
  }
  return null;
}
