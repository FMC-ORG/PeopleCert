import { Accordion, Content, Header, Item, Trigger } from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import NoResultsRecovery from '@/components/NoResultsRecovery/index.jsx';
import { WidgetDataType, useQuestions, widget } from '@/sdk.js';
import { FileText, MessageSquare, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const deriveSources = (questionText, relatedQuestions) => {
  const pool = [];
  if (questionText) {
    pool.push({
      id: questionText.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'source-1',
      title: questionText,
    });
  }
  relatedQuestions.slice(0, 3).forEach((rq, i) => {
    pool.push({
      id: (rq.question || `source-${i + 2}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40),
      title: rq.question,
    });
  });
  return pool.slice(0, 3);
};

const AiAnswerCard = ({ answer, question, relatedQuestions }) => {
  const sources = deriveSources(question, relatedQuestions);
  return (
    <article className="relative rounded-2xl border border-peoplecert-border dark:border-peoplecert-navy-300 bg-white dark:bg-peoplecert-navy-400 shadow-card-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-peoplecert-orange to-peoplecert-orange-700" />
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="pc-badge-ai">
            <Sparkles className="w-3.5 h-3.5" /> AI Answer
          </span>
          <span className="text-xs text-peoplecert-muted dark:text-gray-400">
            Generated from your knowledge base
          </span>
        </div>
        {question && (
          <h3 className="text-lg md:text-xl font-semibold text-peoplecert-navy dark:text-white mb-2">
            {question}
          </h3>
        )}
        <p className="text-[15px] leading-relaxed text-peoplecert-ink dark:text-gray-200">{answer}</p>

        {sources.length > 0 && (
          <div className="mt-5 pt-4 border-t border-peoplecert-border dark:border-peoplecert-navy-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-peoplecert-muted dark:text-gray-400 mb-2">
              Sources
            </div>
            <ol className="flex flex-col md:flex-row flex-wrap gap-2">
              {sources.map((s, i) => (
                <li key={`${s.id}-${i}`}>
                  <Link
                    to={`/search?q=${encodeURIComponent(s.title || '')}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-peoplecert-surface dark:bg-peoplecert-navy-500 border border-peoplecert-border dark:border-peoplecert-navy-300 text-peoplecert-navy dark:text-gray-100 hover:border-peoplecert-orange hover:text-peoplecert-orange transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    <span className="truncate max-w-[22ch]">{`${i + 1}. ${s.title}`}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        {relatedQuestions.length > 0 && (
          <Accordion className="w-full mt-5" type="multiple">
            <div className="text-xs font-semibold uppercase tracking-wider text-peoplecert-muted dark:text-gray-400 mb-2">
              People also ask
            </div>
            {relatedQuestions.map(({ answer: ra, question: rq }, index) => (
              <Item
                key={index}
                className="border-b last:border-b-0 border-peoplecert-border dark:border-peoplecert-navy-300"
                value={`${rq}-${index}`}
              >
                <Header>
                  <Trigger className="w-full flex justify-between items-center gap-x-2 text-left text-sm font-medium text-peoplecert-navy dark:text-gray-100 py-3 hover:text-peoplecert-orange transition-colors">
                    <span>{rq}</span>
                    <ChevronDownIcon height={18} width={18} />
                  </Trigger>
                </Header>
                <Content className="pb-4 text-sm text-peoplecert-muted dark:text-gray-300 leading-relaxed">
                  {ra}
                </Content>
              </Item>
            ))}
          </Accordion>
        )}
      </div>
    </article>
  );
};

AiAnswerCard.propTypes = {
  answer: PropTypes.string,
  question: PropTypes.string,
  relatedQuestions: PropTypes.array,
};

const MostAskedCard = ({ relatedQuestions }) => {
  if (!relatedQuestions || relatedQuestions.length === 0) return null;
  return (
    <section className="pc-container py-10 md:py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="pc-section-title">Most asked questions</h2>
          <p className="pc-section-sub mt-1">Answers generated from your certification knowledge base.</p>
        </div>
        <MessageSquare className="w-6 h-6 text-peoplecert-orange hidden sm:block" />
      </div>
      <Accordion className="pc-card divide-y divide-peoplecert-border dark:divide-peoplecert-navy-300" type="multiple">
        {relatedQuestions.map(({ answer, question }, index) => (
          <Item key={index} value={`${question}-${index}`} className="first:rounded-t-xl last:rounded-b-xl">
            <Header>
              <Trigger className="w-full flex justify-between items-center gap-x-3 text-left p-4 md:p-5 hover:bg-peoplecert-surface dark:hover:bg-peoplecert-navy-500 transition-colors">
                <span className="font-semibold text-peoplecert-navy dark:text-white">{question}</span>
                <ChevronDownIcon height={20} width={20} className="text-peoplecert-muted shrink-0" />
              </Trigger>
            </Header>
            <Content className="px-4 md:px-5 pb-5 text-sm text-peoplecert-muted dark:text-gray-300 leading-relaxed">
              {answer}
            </Content>
          </Item>
        ))}
      </Accordion>
    </section>
  );
};

MostAskedCard.propTypes = {
  relatedQuestions: PropTypes.array,
};

export const QuestionsAnswersComponent = ({
  defaultKeyphrase = '',
  defaultRelatedQuestions = 5,
  variant = 'answer',
}) => {
  const {
    queryResult: {
      data: {
        related_questions: relatedQuestionsResponse = [],
        answer: { answer, question } = {
          answer: undefined,
          question: undefined,
        },
      } = {},
    },
  } = useQuestions({
    state: {
      keyphrase: defaultKeyphrase,
      relatedQuestions: defaultRelatedQuestions,
    },
  });

  const hasAnyContent = (answer && question) || relatedQuestionsResponse.length > 0;

  if (!hasAnyContent) {
    // On the home "most asked" rail we keep the original behaviour of
    // hiding the section entirely - recovery belongs on the search
    // page, not on the landing page.
    if (variant === 'mostAsked') return null;
    // If the user did not even type a query (e.g. an empty hero submit)
    // there is nothing to recover from yet.
    if (!defaultKeyphrase) return null;
    return <NoResultsRecovery query={defaultKeyphrase} variant="inline" />;
  }

  if (variant === 'mostAsked') {
    return <MostAskedCard relatedQuestions={relatedQuestionsResponse} />;
  }

  return (
    <AiAnswerCard
      answer={answer}
      question={question}
      relatedQuestions={relatedQuestionsResponse}
    />
  );
};

QuestionsAnswersComponent.propTypes = {
  defaultKeyphrase: PropTypes.string,
  defaultRelatedQuestions: PropTypes.number,
  variant: PropTypes.oneOf(['answer', 'mostAsked']),
};

const QuestionsAnswersWidget = widget(QuestionsAnswersComponent, WidgetDataType.QUESTIONS, 'content');

export default QuestionsAnswersWidget;
