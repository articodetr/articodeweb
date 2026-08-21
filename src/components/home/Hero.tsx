import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { BackgroundGrid, Orbs } from '@/components/Background';
import { CountUp, SplitWords } from '@/components/motion';
import { EASE } from '@/lib/motionTokens';
import { getStats } from '@/data/content';
import type { Route } from '@/hooks/useRouter';
import { useLang } from '@/i18n';

export function Hero({ navigate }: { navigate: (r: Route) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { lang, t } = useLang();
  const stats = getStats(lang);
  const reduced = !!useReducedMotion();

  // Scroll-out: the whole hero recedes as the next section climbs over it.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });
  const contentY = useTransform(smooth, [0, 1], ['0%', '18%']);
  const contentScale = useTransform(smooth, [0, 1], [1, 0.94]);
  const contentOpacity = useTransform(smooth, [0, 0.75], [1, 0]);
  const orbsY = useTransform(smooth, [0, 1], ['0%', '38%']);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      el.style.setProperty('--mx', `${x * 12}px`);
      el.style.setProperty('--my', `${y * 12}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.85, delay, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-svh scroll-mt-20 overflow-hidden pt-28 md:scroll-mt-24 md:pt-32"
    >
      <BackgroundGrid />
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: orbsY }}>
        <Orbs />
      </motion.div>

      <div className="container-x relative z-10" ref={ref}>
        {/* Only the headline block recedes — the stats strip sits low in the
            section and would fade out before it is ever readable. */}
        <motion.div
          className="mx-auto max-w-4xl text-center"
          style={
            reduced
              ? undefined
              : {
                  y: contentY,
                  scale: contentScale,
                  opacity: contentOpacity,
                  transformOrigin: 'top',
                }
          }
        >
          <motion.div
            {...rise(0.1)}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-white/80 px-4 py-2 text-xs font-medium text-ink-700 shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-600" />
            {t.hero.badge}
          </motion.div>

          <h1
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-ink-950 sm:text-6xl md:text-7xl lg:text-[5.25rem]"
            style={{ transform: 'translate(var(--mx,0), var(--my,0))' }}
          >
            <SplitWords
              as="span"
              text={t.hero.line1}
              className="block text-gradient"
              delay={0.18}
              blur={0}
            />
            <SplitWords
              as="span"
              text={t.hero.line2}
              className="block text-gradient-accent text-shadow-glow"
              delay={0.34}
              blur={0}
            />
            <SplitWords
              as="span"
              text={t.hero.line3}
              className="block text-gradient"
              delay={0.5}
              blur={0}
            />
          </h1>

          <motion.p
            {...rise(0.68)}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-600"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            {...rise(0.8)}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
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
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div {...rise(0.92)} className="mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-2 divide-x divide-y divide-ink-100 overflow-hidden rounded-[28px] border border-ink-100 bg-white/85 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:grid-cols-4 sm:divide-y-0 rtl:divide-x-reverse">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group px-6 py-7 text-center transition-colors duration-300 hover:bg-accent-50/60"
              >
                <CountUp
                  value={s.value}
                  className="block font-display text-3xl font-bold text-ink-950 sm:text-4xl"
                />
                <div className="mt-1.5 text-xs font-medium text-ink-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
        style={reduced ? undefined : { opacity: contentOpacity }}
      >
        <div className="flex h-9 w-5.5 items-start justify-center rounded-full border border-ink-300 bg-white/60 p-1.5">
          <div className="h-1.5 w-1 rounded-full bg-accent-400 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
