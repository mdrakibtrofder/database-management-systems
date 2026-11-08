import { useEffect, useState } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  queryParams: Record<string, string>;
}

export function useHashRouter() {
  const parseHash = (): RouteState => {
    const raw = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = raw.split('?');

    const queryParams: Record<string, string> = {};
    if (queryPart) {
      const sp = new URLSearchParams(queryPart);
      sp.forEach((val, key) => {
        queryParams[key] = val;
      });
    }

    const segments = pathPart.split('/').filter(Boolean);
    const params: Record<string, string> = {};

    // Match /week/:id
    if (segments[0] === 'week' && segments[1]) {
      params.id = segments[1];
    }
    // Match /lab/:id
    if (segments[0] === 'lab' && segments[1]) {
      params.id = segments[1];
    }

    return {
      path: pathPart.startsWith('/') ? pathPart : `/${pathPart}`,
      params,
      queryParams,
    };
  };

  const [route, setRoute] = useState<RouteState>(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    const cleanTo = to.startsWith('/') ? `#${to}` : `/#${to}`;
    window.location.hash = cleanTo.replace('/#', '#');
  };

  return { route, navigate };
}
