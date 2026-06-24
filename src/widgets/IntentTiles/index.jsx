import {
  BookOpen,
  CalendarClock,
  CreditCard,
  FileBadge,
  MonitorCheck,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INTENTS = [
  {
    id: 'renewal',
    title: 'Renew your certification',
    description: 'ITIL, PRINCE2, DevOps: CPD points, deadlines, pricing and online renewal.',
    Icon: RefreshCw,
    query: 'ITIL renewal process',
    color: 'from-peoplecert-orange-100 to-peoplecert-orange-50',
  },
  {
    id: 'exams',
    title: 'Exams',
    description: 'Book, reschedule, or prepare for your online proctored exam.',
    Icon: CalendarClock,
    query: 'exam booking reschedule',
    color: 'from-sky-100 to-sky-50',
  },
  {
    id: 'certifications',
    title: 'Certifications',
    description: 'ITIL, PRINCE2, DevOps and LanguageCert learning paths.',
    Icon: FileBadge,
    query: 'certification path ITIL PRINCE2',
    color: 'from-blue-100 to-blue-50',
  },
  {
    id: 'study',
    title: 'Study Material',
    description: 'eLearning, mock exams, official publications, and Take2.',
    Icon: BookOpen,
    query: 'study material elearning mock exam',
    color: 'from-emerald-100 to-emerald-50',
  },
  {
    id: 'account',
    title: 'Account & Billing',
    description: 'Sign-in, invoices, refunds, and membership.',
    Icon: CreditCard,
    query: 'account billing refund invoice',
    color: 'from-purple-100 to-purple-50',
  },
  {
    id: 'technical',
    title: 'Technical Support',
    description: 'Web-based exam driver, system checks and troubleshooting.',
    Icon: MonitorCheck,
    query: 'technical issue web based exam driver system check',
    color: 'from-sky-100 to-sky-50',
  },
  {
    id: 'policies',
    title: 'Policies',
    description: 'Candidate agreement, privacy, and complaint handling.',
    Icon: ShieldCheck,
    query: 'policy candidate agreement privacy',
    color: 'from-amber-100 to-amber-50',
  },
];

const IntentTiles = () => {
  return (
    <section className="pc-container py-12 md:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="pc-section-title">Browse by topic</h2>
          <p className="pc-section-sub mt-1">Jump straight to the most-asked support areas.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTENTS.map(({ id, title, description, Icon, query, color }) => (
          <Link
            key={id}
            to={`/search?q=${encodeURIComponent(query)}`}
            className="pc-card p-5 group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange"
          >
            <div
              className={`absolute inset-0 opacity-40 dark:opacity-20 bg-gradient-to-br ${color} pointer-events-none`}
              aria-hidden="true"
            />
            <div className="relative flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white dark:bg-peoplecert-navy-500 border border-peoplecert-border dark:border-peoplecert-navy-300 text-peoplecert-orange shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-peoplecert-navy dark:text-white group-hover:text-peoplecert-orange transition-colors">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-peoplecert-muted dark:text-gray-300">{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default IntentTiles;
