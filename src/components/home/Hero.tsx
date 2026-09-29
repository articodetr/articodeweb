import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { CountUp } from '@/components/motion';
import { HeroVisual } from './HeroVisual';
import { EASE } from '@/lib/motionTokens';
import { getStats } from '@/data/content';
import type { Route } from '@/hooks/useRouter';
import { useLang } from '@/i18n';
import './Hero.css';

export function Hero({ navigate }: { navigate: (r: Route) => void }) {
  const { lang, t } = useLang();
  const stats = getStats(lang).slice(0, 4);
  const reduced = !!useReducedMotion();

  const rise = (delay: number, y = 22) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  const go = (event: React.MouseEvent<HTMLAnchorElement>, route: Route) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(route);
  };

  return (
    <section id="home" className="hero-section scroll-mt-20 md:scroll-mt-24">
      <div className="hero-section__grid" aria-hidden="true" />
      <div className="container-x relative z-10">
        <div className="hero-layout">
          <div className="hero-copy text-start">
            <motion.div {...rise(0.05, 14)} className="hero-availability">
              <span className="hero-availability__dot" aria-hidden="true" />
              {t.hero.badge}
            </motion.div>
            <motion.h1
              {...rise(0.12)}
              aria-label={`${t.hero.line1} ${t.hero.line2} ${t.hero.line3}`}
              className="hero-title font-display font-semibold text-ink-950"
            >
              <span aria-hidden="true" className="block">{t.hero.line1}</span>
              <span aria-hidden="true" className="hero-title__accent block">{t.hero.line2}</span>
              <span aria-hidden="true" className="block">{t.hero.line3}</span>
            </motion.h1>
            <motion.p {...rise(0.2)} className="hero-description">
              {t.hero.description}
            </motion.p>
            <motion.div
              {...rise(0.28)}
              className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <a href="#contact" onClick={(event) => go(event, 'contact')} className="btn-primary group">
                {t.nav.startProject}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <a href="#projects" onClick={(event) => go(event, 'projects')} className="btn-ghost group">
                {t.hero.exploreExpertise}
                <ArrowUpRight
                  className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
            <motion.div {...rise(0.34)} className="hero-trust">
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
              <div>
                <p>{t.hero.trustBadge}</p>
                <p className="mt-1 text-ink-400">{t.hero.verifiedDelivery}</p>
              </div>
            </motion.div>
          </div>
          <motion.div {...rise(0.18, 24)} className="hero-artwork">
            <HeroVisual />
          </motion.div>
        </div>
        <motion.div {...rise(0.36, 18)} className="hero-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-stat">
              <CountUp value={stat.value} className="block font-display text-2xl font-bold text-ink-950 sm:text-3xl" />
              <div className="mt-1.5 text-xs font-medium leading-6 text-ink-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
