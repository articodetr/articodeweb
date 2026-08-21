import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, Languages } from 'lucide-react';
import type { Route } from '@/hooks/useRouter';
import { useLang } from '@/i18n';
import { publicAsset } from '@/lib/publicAsset';

export function Navbar({ route, navigate }: { route: Route; navigate: (r: Route) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const links: { id: Route; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'expertise', label: t.nav.expertise },
    { id: 'projects', label: t.nav.projects },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (r: Route) => {
    setOpen(false);
    navigate(r);
  };

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-ink-100 bg-white/90 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            go('home');
          }}
          className="group flex items-center gap-2.5"
          aria-label="ArtiCode home"
        >
          <img src={publicAsset('logo_1.png')} alt="ArtiCode" className="h-9 w-9 rounded-lg object-cover shadow-[0_0_20px_-4px_rgba(53,75,232,0.6)]" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink-950" dir="ltr">
            Arti<span className="text-gradient-accent">Code</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(l.id);
                }}
                aria-current={route === l.id ? 'location' : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  route === l.id ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950'
                }`}
              >
                {l.label}
                {route === l.id && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white/70 px-3.5 py-2 text-sm font-medium text-ink-700 transition-all duration-300 hover:border-accent-300 hover:text-accent-700"
            aria-label={t.nav.switchLang}
          >
            <Languages className="h-4 w-4" />
            {t.nav.switchLang}
          </button>
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              go('contact');
            }}
            className="btn-primary !px-5 !py-2.5"
          >
            {t.nav.startProject}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleLang}
            className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-ink-900"
            aria-label={t.nav.switchLang}
          >
            <Languages className="h-4.5 w-4.5" />
            {t.nav.switchLang}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-900"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.toggleMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-ink-100 bg-white/95 shadow-lg backdrop-blur-xl transition-[max-height,opacity] duration-400 md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="container-x flex flex-col gap-1 py-4">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(l.id);
                }}
                aria-current={route === l.id ? 'location' : undefined}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  route === l.id ? 'bg-accent-50 text-accent-800' : 'text-ink-700 hover:bg-ink-50'
                }`}
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 opacity-50 rtl:-scale-x-100" />
              </a>
            </li>
          ))}
          <li className="mt-2">
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                go('contact');
              }}
              className="btn-primary w-full"
            >
              {t.nav.startProject}
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
