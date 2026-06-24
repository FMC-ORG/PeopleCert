import { BrowserRouter, Route, Routes } from 'react-router-dom';

import EventMonitor from '@/components/EventMonitor/index.jsx';
import Footer from '@/components/Footer/index.jsx';
import Header from '@/components/Header/index.jsx';
import MockModeBanner from '@/components/MockModeBanner/index.jsx';
import { AudienceContext } from '@/contexts/audienceContext.js';
import { LanguageContext } from '@/contexts/languageContext.js';
import useAudience from '@/hooks/useAudience.js';
import useLanguage from '@/hooks/useLanguage.js';
import '@/index.css';
import ArticleDetail from '@/pages/ArticleDetail.jsx';
import Home from '@/pages/Home.jsx';
import Search from '@/pages/Search.jsx';
import { IS_MOCK_SEARCH, SEOWidget, WidgetsProvider } from '@/sdk.js';

/**
 * Configuration object for search settings.
 * It uses Vite environment variables.
 * @see https://vitejs.dev/guide/env-and-mode.html
 */
const SEARCH_CONFIG = {
  env: import.meta.env.VITE_SEARCH_ENV,
  customerKey: import.meta.env.VITE_SEARCH_CUSTOMER_KEY,
  apiKey: import.meta.env.VITE_SEARCH_API_KEY,
};

function App() {
  const { language, setLanguage } = useLanguage();
  const { audience, setAudience } = useAudience();
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <AudienceContext.Provider value={{ audience, setAudience }}>
        <BrowserRouter>
          <div className="min-h-screen bg-peoplecert-surface dark:bg-peoplecert-navy">
            <WidgetsProvider
              env={SEARCH_CONFIG.env}
              customerKey={SEARCH_CONFIG.customerKey}
              apiKey={SEARCH_CONFIG.apiKey}
              publicSuffix={true}
            >
              <SEOWidget rfkId={'demo_search_seo'} />
              <Header />
              <MockModeBanner />
              <main
                className={`w-full m-auto min-h-[700px] ${
                  IS_MOCK_SEARCH ? 'pt-[112px]' : 'pt-[76px]'
                }`}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/detail/:id" element={<ArticleDetail />}></Route>
                </Routes>
              </main>
              <Footer />
              <EventMonitor />
            </WidgetsProvider>
          </div>
        </BrowserRouter>
      </AudienceContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;
