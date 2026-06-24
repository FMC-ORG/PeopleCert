import { Activity, Eye, EyeOff, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Dev-only observability overlay.
 * Activated with ?debug=1 in the URL. Surfaces every Sitecore Search
 * API call the SDK makes (requests and response summary), plus any
 * custom events dispatched by this app. Useful during a customer
 * demo to prove that all surfaces go through a single telemetry funnel.
 */

const SITECORE_HOST_PATTERN = /(discover|sitecorecloud|search)\.?(sitecorecloud\.io|sitecore\.com|ai)/i;

const shortUrl = (url) => {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname}`;
  } catch {
    return String(url);
  }
};

const deriveKind = (url, body) => {
  const u = String(url).toLowerCase();
  if (u.includes('/event')) return 'event';
  if (u.includes('/page')) return 'page';
  let bodyStr = '';
  try {
    bodyStr = typeof body === 'string' ? body : body ? JSON.stringify(body) : '';
  } catch {
    bodyStr = '';
  }
  if (bodyStr.includes('"question"')) return 'question';
  if (bodyStr.includes('"preview"') || bodyStr.includes('preview_search')) return 'preview';
  if (bodyStr.includes('"search"') || bodyStr.includes('search_results')) return 'search';
  return 'api';
};

const kindClass = (kind) => {
  switch (kind) {
    case 'search':
      return 'bg-peoplecert-orange text-white';
    case 'preview':
      return 'bg-purple-500 text-white';
    case 'question':
      return 'bg-emerald-500 text-white';
    case 'event':
      return 'bg-blue-500 text-white';
    case 'page':
      return 'bg-sky-500 text-white';
    case 'custom':
      return 'bg-amber-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};

const EventMonitor = () => {
  const { search } = useLocation();
  const active = useMemo(() => new URLSearchParams(search).get('debug') === '1', [search]);

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(true);
  const hookInstalled = useRef(false);

  useEffect(() => {
    if (!active || hookInstalled.current || typeof window === 'undefined') return;
    hookInstalled.current = true;

    const originalFetch = window.fetch.bind(window);
    const push = (entry) => {
      setEvents((prev) => [{ ...entry, id: Date.now() + Math.random() }, ...prev].slice(0, 60));
    };

    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      const started = performance.now();
      let ok = true;
      let status = 0;
      try {
        const res = await originalFetch(input, init);
        status = res.status;
        ok = res.ok;
        return res;
      } catch (err) {
        ok = false;
        throw err;
      } finally {
        if (SITECORE_HOST_PATTERN.test(url)) {
          const kind = deriveKind(url, init?.body);
          push({
            at: new Date(),
            url: shortUrl(url),
            fullUrl: url,
            method: (init?.method || 'GET').toUpperCase(),
            status,
            ok,
            kind,
            duration: Math.round(performance.now() - started),
          });
        }
      }
    };

    const onCustom = (e) => {
      const detail = e.detail || {};
      const label = detail.kind || detail.type || e.type.replace(/^pc:/, '') || 'event';
      push({
        at: new Date(),
        url: `window.${e.type} ${label}`,
        method: 'CUSTOM',
        status: 200,
        ok: true,
        kind: 'custom',
        payload: detail,
        duration: 0,
      });
    };
    window.addEventListener('pc:feedback', onCustom);
    window.addEventListener('pc:mock-event', onCustom);
    window.addEventListener('pc:recovery', onCustom);

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('pc:feedback', onCustom);
      window.removeEventListener('pc:mock-event', onCustom);
      window.removeEventListener('pc:recovery', onCustom);
      hookInstalled.current = false;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[2000] w-[400px] max-w-[95vw] font-sans">
      <div className="pc-card overflow-hidden flex flex-col max-h-[60vh]">
        <div className="flex items-center justify-between px-4 py-2.5 bg-peoplecert-navy text-white">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-peoplecert-orange" />
            <span className="font-semibold text-sm">Sitecore Search event monitor</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-peoplecert-orange">
              demo
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEvents([])}
              title="Clear"
              className="p-1 rounded hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              title={open ? 'Hide' : 'Show'}
              className="p-1 rounded hover:bg-white/10"
            >
              {open ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <a
              href={typeof window !== 'undefined' ? window.location.pathname : '/'}
              title="Close"
              className="p-1 rounded hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </a>
          </div>
        </div>

        {open && (
          <div className="flex-1 overflow-y-auto bg-white dark:bg-peoplecert-navy-400 text-xs">
            {events.length === 0 ? (
              <div className="p-4 text-center text-peoplecert-muted dark:text-gray-400">
                Interact with the page to see Search API traffic here.
              </div>
            ) : (
              <ul className="divide-y divide-peoplecert-border dark:divide-peoplecert-navy-300">
                {events.map((e) => (
                  <li key={e.id} className="px-3 py-2 flex items-start gap-2">
                    <span
                      className={`shrink-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${kindClass(
                        e.kind,
                      )}`}
                    >
                      {e.kind}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono truncate text-peoplecert-navy dark:text-gray-100">
                        {e.method} {e.url}
                      </div>
                      <div className="text-peoplecert-muted dark:text-gray-400 mt-0.5">
                        {e.at.toLocaleTimeString()} ·{' '}
                        <span className={e.ok ? 'text-emerald-600' : 'text-red-500'}>
                          {e.status || 'custom'}
                        </span>{' '}
                        · {e.duration}ms
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="px-3 py-1.5 bg-peoplecert-surface dark:bg-peoplecert-navy-500 border-t border-peoplecert-border dark:border-peoplecert-navy-300 text-[10px] text-peoplecert-muted dark:text-gray-400">
          All surfaces speak to the same index — one source of truth.
        </div>
      </div>
    </div>
  );
};

export default EventMonitor;
