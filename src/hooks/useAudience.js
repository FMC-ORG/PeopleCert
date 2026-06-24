import { useEffect } from 'react';

import useStorage from '@/hooks/useStorage.js';
import { PageController } from '@/sdk.js';

/**
 * Audience/role the visitor is browsing as.
 * The selection is persisted in localStorage and written to the Sitecore Search
 * PageController context so that CEC relevance rules, boosting and analytics
 * can segment by it. This is the extensibility hook that a Sitecore Personalize
 * integration would plug into.
 */
function useAudience() {
  const [audience, setAudience] = useStorage('pc_audience', 'professional');

  useEffect(() => {
    try {
      const ctx = PageController.getContext();
      if (typeof ctx.setAttribute === 'function') {
        ctx.setAttribute('audience', audience);
      } else if (typeof ctx.setUserContext === 'function') {
        ctx.setUserContext({ audience });
      }
    } catch (err) {
      console.warn('[useAudience] could not set PageController attribute', err);
    }
  }, [audience]);

  return { audience, setAudience };
}

export default useAudience;
