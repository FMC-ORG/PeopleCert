import { Sparkles, UserCheck } from 'lucide-react';
import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUDIENCES, AudienceContext } from '@/contexts/audienceContext.js';
import { CATALOG_BY_ID, RECOMMENDATIONS_BY_AUDIENCE } from '@/mocks/catalog.js';
import { IS_MOCK_SEARCH } from '@/sdk.js';

/**
 * Audience-aware recommendation rail.
 *
 * In mock mode the recommendations are pulled from a static map keyed
 * by the currently selected audience (Professional / Organization /
 * Partner) so that the rail visibly changes when the audience switcher
 * is toggled. This illustrates the extensibility story: swap the static
 * map for a Sitecore Personalize call and the same UI surface becomes
 * 1-to-1 personalized.
 *
 * When mock mode is off we do not render anything, because the real
 * Sitecore Search account does not yet have a Recommendations widget
 * configured in this demo.
 */

const RecommendedForYou = () => {
  const { audience } = useContext(AudienceContext);
  const navigate = useNavigate();

  const recs = useMemo(() => {
    const cfg = RECOMMENDATIONS_BY_AUDIENCE[audience] || RECOMMENDATIONS_BY_AUDIENCE.professional;
    const articles = (cfg.articleIds || [])
      .map((id) => CATALOG_BY_ID[id])
      .filter(Boolean);
    return { ...cfg, articles };
  }, [audience]);

  const label = AUDIENCES.find((a) => a.value === audience)?.label || 'you';

  if (!IS_MOCK_SEARCH) return null;
  if (recs.articles.length === 0) return null;

  return (
    <section className="pc-container py-10 md:py-12">
      <div className="pc-card overflow-hidden">
        <div className="p-5 md:p-7 flex items-start md:items-center gap-4 bg-gradient-to-r from-peoplecert-navy to-peoplecert-navy-400 text-white flex-col md:flex-row">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-peoplecert-orange shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="pc-badge-ai">
                <Sparkles className="w-3.5 h-3.5" /> Personalised
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-300">
                For: {label}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold">{recs.headline}</h2>
            <p className="text-sm text-gray-300 mt-1 max-w-[720px]">{recs.tagline}</p>
          </div>
          <div className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-full hidden md:block">
            Change audience in the header to see this update
          </div>
        </div>

        <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recs.articles.map((article) => (
            <button
              key={article.id}
              onClick={() => navigate(`/detail/${article.id}`)}
              className="text-left rounded-lg border border-peoplecert-border dark:border-peoplecert-navy-300 bg-white dark:bg-peoplecert-navy-500 hover:border-peoplecert-orange hover:shadow-card-lg transition-all p-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-peoplecert-orange"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="pc-chip">{article.type}</span>
                {article.certification && (
                  <span className="text-[11px] text-peoplecert-muted dark:text-gray-400">
                    {article.certification}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-peoplecert-navy dark:text-white group-hover:text-peoplecert-orange transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-1.5 text-xs text-peoplecert-muted dark:text-gray-300 line-clamp-2">
                {article.subtitle || article.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;
