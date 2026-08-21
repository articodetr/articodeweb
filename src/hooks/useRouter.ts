import { useCallback, useEffect, useState } from 'react';

export type Route = 'home' | 'expertise' | 'projects' | 'about' | 'contact';

const routes: Route[] = ['home', 'expertise', 'projects', 'about', 'contact'];

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const updateActiveSection = () => {
      const activationLine = 120;
      let active: Route = 'home';

      routes.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          active = id;
        }
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        active = 'contact';
      }

      setRoute(active);
    };

    const onHistoryNavigation = () => {
      const next = parseHash();
      setRoute(next);
      scrollToSection(next, prefersReducedMotion() ? 'auto' : 'smooth');
    };

    const initial = parseHash();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(initial, 'auto');
        updateActiveSection();
      });
    });

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('hashchange', onHistoryNavigation);
    window.addEventListener('popstate', onHistoryNavigation);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('hashchange', onHistoryNavigation);
      window.removeEventListener('popstate', onHistoryNavigation);
    };
  }, []);

  const navigate = useCallback((next: Route) => {
    const hash = `#${next}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }

    setRoute(next);
    scrollToSection(next, prefersReducedMotion() ? 'auto' : 'smooth');
  }, []);

  return { route, navigate };
}

function parseHash(): Route {
  const raw = window.location.hash.replace('#/', '').replace('#', '') as Route;
  return routes.includes(raw) ? raw : 'home';
}

function scrollToSection(route: Route, behavior: ScrollBehavior) {
  const section = document.getElementById(route);
  if (!section) return;

  if (behavior === 'auto') {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    section.scrollIntoView({ behavior: 'auto', block: 'start' });
    root.style.scrollBehavior = previousBehavior;
    return;
  }

  section.scrollIntoView({ behavior, block: 'start' });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
