import { ArrowRight, MessageCircle } from 'lucide-react';

import { PAGE_EVENTS_HOME } from '@/data/constants';
import withPageTracking from '@/hocs/withPageTracking';
import HomeHighlighted from '@/widgets/HomeHighlighted/index.jsx';
import IntentTiles from '@/widgets/IntentTiles/index.jsx';
import QuestionsAnswers from '@/widgets/QuestionsAnswers/index.jsx';
import RecommendedForYou from '@/widgets/RecommendedForYou/index.jsx';
import SupportHero from '@/widgets/SupportHero/index.jsx';

const Home = () => {
  return (
    <>
      <SupportHero />
      <IntentTiles />
      <RecommendedForYou />
      <QuestionsAnswers
        rfkId="rfkid_qa"
        defaultKeyphrase="itil renewal"
        defaultRelatedQuestions={6}
        variant="mostAsked"
      />
      <HomeHighlighted rfkId="search_home_highlight_articles" />

      {/* Still need help deflection */}
      <section className="pc-container pb-16">
        <div className="pc-card p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 bg-gradient-to-br from-peoplecert-orange-50 to-white dark:from-peoplecert-navy-400 dark:to-peoplecert-navy-500 border-peoplecert-orange-100">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-peoplecert-orange text-white shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-peoplecert-navy dark:text-white">Still need help?</h3>
            <p className="mt-1 text-sm text-peoplecert-muted dark:text-gray-300">
              Our support team is available 24/7 on exam day. Chat, email, or call us and we will
              get back to you within one business day.
            </p>
          </div>
          <a href="#contact" className="pc-btn-primary">
            Contact support <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  );
};

export default withPageTracking(Home, PAGE_EVENTS_HOME);
