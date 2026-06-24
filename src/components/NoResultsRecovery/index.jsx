import {
  ArrowRight,
  FileSearch,
  FileText,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AUDIENCES, AudienceContext } from '@/contexts/audienceContext.js';
import { KNOWN_PHRASES } from '@/lib/phrases.js';
import {
  detectCertification,
  didYouMean,
  disambiguationChips,
} from '@/lib/suggest.js';
import { CATALOG_BY_ID, RECOMMENDATIONS_BY_AUDIENCE } from '@/mocks/catalog.js';
import PropTypes from 'prop-types';

const IS_ASKAI_ENABLED = import.meta.env.VITE_ASKAI_ENABLED === 'true';

const dispatchRecovery = (kind, detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('pc:recovery', { detail: { kind, ...detail } }),
  );
};

const toQueryUrl = (q) => `/search?q=${encodeURIComponent(q)}`;

/**
 * Recovery card rendered when a search returns nothing.
 *
 * Props:
 *  - query   : the failing query string
 *  - variant : 'full' (default, used on /search) or 'inline' (compact
 *              card rendered inside the AI Answer slot when the AI can
 *              not ground an answer).
 */
const NoResultsRecovery = ({ query, variant = 'full' }) => {
  const navigate = useNavigate();
  const { audience } = useContext(AudienceContext);
  const audienceLabel =
    AUDIENCES.find((a) => a.value === audience)?.label.toLowerCase() || 'you';

  const detectedCert = useMemo(() => detectCertification(query), [query]);

  const suggestions = useMemo(
    () => didYouMean(query, KNOWN_PHRASES, { max: 3, minScore: 0.3 }),
    [query],
  );

  const certChips = useMemo(
    () => disambiguationChips(query, detectedCert),
    [query, detectedCert],
  );

  const fallbackArticles = useMemo(() => {
    const cfg =
      RECOMMENDATIONS_BY_AUDIENCE[audience] || RECOMMENDATIONS_BY_AUDIENCE.professional;
    const ids = Array.isArray(cfg?.articleIds) ? cfg.articleIds : [];
    const pool = ids.map((id) => CATALOG_BY_ID[id]).filter(Boolean);
    if (detectedCert) {
      const matching = pool.filter((a) => a.certification === detectedCert);
      const others = pool.filter((a) => a.certification !== detectedCert);
      return [...matching, ...others].slice(0, 3);
    }
    return pool.slice(0, 3);
  }, [audience, detectedCert]);

  useEffect(() => {
    dispatchRecovery('zero-result', {
      query,
      audience,
      certification_guess: detectedCert,
      suggestions_offered: suggestions.length,
      variant,
    });
  }, [query, audience, detectedCert, suggestions.length, variant]);

  const goTo = (to, type) => {
    dispatchRecovery('suggestion-click', { from: query, to, type });
    navigate(toQueryUrl(to));
  };

  const openAskAI = () => {
    dispatchRecovery('askai-open', { query });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('pc:askai-open', { detail: { query } }),
      );
    }
  };

  const isInline = variant === 'inline';

  // ---------------------------------------------------------------------

  const Header = (
    <div className="flex items-start gap-3">
      <div
        className={`inline-flex items-center justify-center rounded-full bg-peoplecert-orange-50 text-peoplecert-orange shrink-0 ${
          isInline ? 'w-9 h-9' : 'w-12 h-12'
        }`}
      >
        <FileSearch className={isInline ? 'w-5 h-5' : 'w-6 h-6'} />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-bold text-peoplecert-navy dark:text-white ${
            isInline ? 'text-base' : 'text-xl md:text-2xl'
          }`}
        >
          {isInline
            ? 'I could not confidently answer that yet'
            : 'We did not find a match in your knowledge base'}
        </h3>
        {query && (
          <p
            className={`mt-1 text-peoplecert-muted dark:text-gray-300 ${
              isInline ? 'text-xs' : 'text-sm'
            }`}
          >
            No results for
            <span className="mx-1 font-semibold text-peoplecert-navy dark:text-white">
              &ldquo;{query}&rdquo;
            </span>
            {detectedCert ? (
              <>
                in the
                <span className="ml-1 font-semibold text-peoplecert-orange">
                  {detectedCert}
                </span>{' '}
                articles we indexed.
              </>
            ) : (
              <>yet. Try one of these paths instead.</>
            )}
          </p>
        )}
      </div>
    </div>
  );

  const DidYouMean = suggestions.length > 0 && (
    <div className={isInline ? 'mt-3' : 'mt-6'}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-peoplecert-muted dark:text-gray-400 mb-2">
        <Wand2 className="w-3.5 h-3.5 text-peoplecert-orange" />
        Did you mean
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(({ phrase }) => (
          <button
            key={phrase}
            type="button"
            onClick={() => goTo(phrase, 'didyoumean')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-peoplecert-surface dark:bg-peoplecert-navy-500 border border-peoplecert-border dark:border-peoplecert-navy-300 text-peoplecert-navy dark:text-gray-100 hover:border-peoplecert-orange hover:text-peoplecert-orange transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );

  const Disambiguation = !isInline && certChips.length > 0 && (
    <div className="mt-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-peoplecert-muted dark:text-gray-400 mb-2">
        <Lightbulb className="w-3.5 h-3.5 text-peoplecert-orange" />
        Are you asking about
      </div>
      <div className="flex flex-wrap gap-2">
        {certChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => goTo(chip.query, 'disambiguate')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-white dark:bg-peoplecert-navy-500 border border-peoplecert-border dark:border-peoplecert-navy-300 text-peoplecert-navy dark:text-gray-100 hover:border-peoplecert-orange hover:text-peoplecert-orange transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );

  const Fallback = !isInline && fallbackArticles.length > 0 && (
    <div className="mt-7">
      <div className="text-xs font-semibold uppercase tracking-wider text-peoplecert-muted dark:text-gray-400 mb-3">
        Popular for {audienceLabel}s
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {fallbackArticles.map((a) => (
          <Link
            key={a.id}
            to={`/detail/${a.id}`}
            onClick={() =>
              dispatchRecovery('suggestion-click', {
                from: query,
                to: a.id,
                type: 'fallback-article',
              })
            }
            className="block text-left rounded-lg border border-peoplecert-border dark:border-peoplecert-navy-300 bg-white dark:bg-peoplecert-navy-500 hover:border-peoplecert-orange hover:shadow-card-lg transition-all p-4 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="pc-chip">{a.type}</span>
              {a.certification && (
                <span className="text-[11px] text-peoplecert-muted dark:text-gray-400">
                  {a.certification}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-peoplecert-navy dark:text-white group-hover:text-peoplecert-orange transition-colors line-clamp-2 text-sm">
              {a.title}
            </h4>
            {a.subtitle && (
              <p className="mt-1.5 text-xs text-peoplecert-muted dark:text-gray-300 line-clamp-2">
                {a.subtitle}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  const CTA = (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-3 ${
        isInline ? 'mt-4' : 'mt-8'
      }`}
    >
      {IS_ASKAI_ENABLED ? (
        <>
          <button
            type="button"
            onClick={openAskAI}
            className="pc-btn-primary shadow-card-lg"
          >
            <Sparkles className="w-4 h-4" />
            Ask our AI assistant
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#contact"
            className="text-sm text-peoplecert-muted dark:text-gray-400 hover:text-peoplecert-orange transition-colors"
          >
            Still stuck? Contact support
          </a>
        </>
      ) : (
        <>
          <a href="#contact" className="pc-btn-primary">
            <MessageCircle className="w-4 h-4" />
            Contact support
          </a>
          {!isInline && (
            <a href="/" className="pc-btn-secondary">
              <FileText className="w-4 h-4" />
              Back to Help Center
            </a>
          )}
        </>
      )}
    </div>
  );

  if (isInline) {
    return (
      <article className="relative rounded-2xl border border-dashed border-peoplecert-border dark:border-peoplecert-navy-300 bg-peoplecert-surface/60 dark:bg-peoplecert-navy-500/60 p-5">
        {Header}
        {DidYouMean}
        {CTA}
      </article>
    );
  }

  return (
    <section className="pc-card p-6 md:p-10 max-w-[920px] mx-auto">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-peoplecert-orange to-peoplecert-orange-700 -mt-6 -mx-6 md:-mt-10 md:-mx-10 rounded-t-xl" />
        {Header}
        {DidYouMean}
        {Disambiguation}
        {Fallback}
        {CTA}
      </div>
    </section>
  );
};

NoResultsRecovery.propTypes = {
  query: PropTypes.string,
  variant: PropTypes.oneOf(['full', 'inline']),
};

export default NoResultsRecovery;
