import { useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { BackgroundGrid, Orbs } from '@/components/Background';
import { getStats } from '@/data/content';
import type { Route } from '@/hooks/useRouter';
import { useLang } from '@/i18n';

export function Hero({ navigate }: { navigate: (r: Route) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();
  const stats = getStats(lang);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      el.style.setProperty('--mx', `${x * 12}px`);
      el.style.setProperty('--my', `${y * 12}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="home" className="relative min-h-svh scroll-mt-20 overflow-hidden pt-28 md:scroll-mt-24 md:pt-32">
      <BackgroundGrid />
      <Orbs />

      <div className="container-x relative z-10" ref={ref}>
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="reveal mb-7 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-white/80 px-4 py-2 text-xs font-medium text-ink-700 shadow-sm backdrop-blur-sm"
            style={{ animationDelay: '0.1s' }}
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-600" />
            {t.hero.badge}
          </div>

          <h1
            className="reveal reveal-delay-1 font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-ink-950 sm:text-6xl md:text-7xl lg:text-[5.25rem]"
            style={{ transform: 'translate(var(--mx,0), var(--my,0))' }}
          >
            <span className="text-gradient">{t.hero.line1}</span>
            <br />
            <span className="text-gradient-accent text-shadow-glow">{t.hero.line2}</span>
            <br />
            <span className="text-gradient">{t.hero.line3}</span>
          </h1>

          <p className="reveal reveal-delay-2 mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-600">
            {t.hero.description}
          </p>

          <div className="reveal reveal-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                navigate('contact');
              }}
              className="btn-primary group"
            >
              {t.nav.startProject}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </a>
            <a
              href="#expertise"
              onClick={(event) => {
                event.preventDefault();
                navigate('expertise');
              }}
              className="btn-ghost"
            >
              {t.hero.exploreExpertise}
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="reveal reveal-delay-4 mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-2 divide-x divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white/85 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:grid-cols-4 sm:divide-y-0 rtl:divide-x-reverse">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-7 text-center">
                <div dir="ltr" className="font-display text-3xl font-semibold text-ink-950 sm:text-4xl">{s.value}</div>
                <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-ink-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="flex h-9 w-5.5 items-start justify-center rounded-full border border-ink-300 bg-white/60 p-1.5">
          <div className="h-1.5 w-1 rounded-full bg-accent-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
