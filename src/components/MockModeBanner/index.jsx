import { Database, X } from 'lucide-react';
import { useState } from 'react';

import { IS_MOCK_SEARCH } from '@/sdk.js';

/**
 * Thin banner that makes it unambiguous during a demo that the app is
 * serving data from a local PeopleCert mock knowledge base rather than
 * the live Sitecore Search account. Dismissible; re-appears on reload.
 */
const MockModeBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!IS_MOCK_SEARCH || !visible) return null;

  return (
    <div className="fixed top-[76px] left-0 right-0 z-[450] bg-peoplecert-orange text-white shadow-md">
      <div className="pc-container py-1.5 flex items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Database className="w-4 h-4 shrink-0" />
          <span className="font-semibold">Mock knowledge base</span>
          <span className="hidden sm:inline opacity-90 truncate">
            Content served from a local PeopleCert D365 / MyPeopleCert FAQ mock. No live Sitecore Search API calls.
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss mock-mode banner"
          className="p-1 rounded hover:bg-white/20 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MockModeBanner;
