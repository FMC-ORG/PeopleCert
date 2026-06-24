import { Sparkles } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AudienceSwitcher from '@/components/AudienceSwitcher/index.jsx';
import { AUDIENCES, AudienceContext } from '@/contexts/audienceContext.js';
import PreviewSearch from '@/widgets/PreviewSearch/index.jsx';

export const POPULAR_QUERIES = [
  'ITIL renewal process',
  'Reschedule my exam',
  'Download my certificate',
  'Webcam requirements',
  'Refund policy',
];

const SupportHero = () => {
  const navigate = useNavigate();
  const { audience } = useContext(AudienceContext);
  const audienceLabel =
    AUDIENCES.find((a) => a.value === audience)?.label.toLowerCase() || 'professional';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-peoplecert-navy via-peoplecert-navy-400 to-peoplecert-navy-500 text-white">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #E35D3A 0, transparent 45%), radial-gradient(circle at 85% 80%, #E35D3A 0, transparent 40%)',
        }}
      />
      <div className="pc-container relative py-16 md:py-24">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-peoplecert-orange" />
            AI-powered Help Center
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            How can we help, <span className="text-peoplecert-orange">{audienceLabel}</span>?
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300">
            Ask a question in plain language. Our AI reads your certification knowledge base and
            answers instantly, with links back to the source articles.
          </p>

          <div className="mt-8">
            <PreviewSearch rfkId="rfkid_6" defaultItemsPerPage={6} variant="hero" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-400">Try:</span>
            {POPULAR_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <AudienceSwitcher />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportHero;
