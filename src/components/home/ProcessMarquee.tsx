import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Compass, DraftingCompass, Code2, ShieldCheck, TrendingUp } from 'lucide-react';
import { SplitWords } from '@/components/motion';
import { EASE } from '@/lib/motionTokens';
import { getProcessSteps, clientLogos } from '@/data/content';
import { useLang } from '@/i18n';

const STEP_ICONS = [Compass, DraftingCompass, Code2, ShieldCheck, TrendingUp];

const pad = (n: number) => String(n).padStart(2, '0');

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

type Step = { title: string; description: string };

function JourneyHeading({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'max-w-2xl text-start' : 'max-w-xl text-start'}>
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {eyebrow}
        </span>
      </motion.div>
      <h2 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink-950 md:text-4xl">
        <SplitWords text={title} />
      </h2>
      <motion.p
        className="mt-4 text-sm leading-relaxed text-ink-600 md:text-base"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
      >
        {description}
      </motion.p>
    </div>
  );
}

function StationCard({
  step,
  index,
  total,
  active,
  stepLabel,
  reduced,
  pinned,
}: {
  step: Step;
  index: number;
  total: number;
  active: boolean;
  stepLabel: string;
  reduced: boolean;
  pinned: boolean;
}) {
  const Icon = STEP_ICONS[index % STEP_ICONS.length];
  const isLast = index === total - 1;
  return (
    <motion.article
      animate={
        pinned && !reduced
          ? { scale: active ? 1 : 0.94, opacity: active ? 1 : 0.72, y: active ? 0 : 10 }
          : undefined
      }
      transition={{ duration: 0.45, ease: EASE }}
      className={`station-card group ${isLast ? 'station-card-invert' : ''} ${
        active && !isLast ? 'border-accent-200 shadow-[0_28px_70px_rgba(15,23,42,0.14)]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="pill">
          {stepLabel}
          <span dir="ltr" className="tabular-nums">
            {pad(index + 1)}
          </span>
        </span>
        <span className="station-icon">
          <Icon className="h-5 w-5" aria-hidden="true" />
          {active && !reduced && (
            <span
              aria-hidden="true"
              className={`absolute inset-0 -z-10 animate-ping rounded-2xl ${
                isLast ? 'bg-white/40' : 'bg-accent-400/40'
              }`}
              style={{ animationDuration: '1.8s' }}
            />
          )}
        </span>
      </div>

      <span aria-hidden="true" className="station-ghost mt-6">
        {pad(index + 1)}
      </span>

      <h3 className="card-title mt-3">{step.title}</h3>
      <p className="card-text mb-6 mt-3">{step.description}</p>

      <span aria-hidden="true" className={`station-bar ${active ? 'w-full' : 'w-12'}`} />
    </motion.article>
  );
}

/** Fallback: vertical timeline (mobile / reduced motion) */
function JourneyStatic({
  eyebrow,
  title,
  description,
  stepLabel,
  steps,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  steps: Step[];
}) {
  const reduced = !!useReducedMotion();
  const item = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
  return (
    <div className="container-x">
      <JourneyHeading eyebrow={eyebrow} title={title} description={description} compact />
      <ol className="relative mt-10 space-y-5 ps-8">
        <span
          aria-hidden="true"
          className="absolute bottom-6 start-[0.45rem] top-6 w-px bg-accent-100"
        />
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <span
              aria-hidden="true"
              className="absolute -start-8 top-7 h-4 w-4 rounded-full border-4 border-white bg-accent-600 shadow-[0_0_0_3px_rgba(220,227,255,1)]"
            />
            <StationCard
              step={step}
              index={i}
              total={steps.length}
              active
              stepLabel={stepLabel}
              reduced={reduced}
              pinned={false}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** Pinned: vertical scroll drives the horizontal track (desktop) */
function JourneyPinned({
  eyebrow,
  title,
  description,
  stepLabel,
  steps,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  steps: Step[];
}) {
  const { lang } = useLang();
  const isRtl = lang === 'ar';

  const outerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5 });
  const x = useTransform(progress, [0, 1], [0, isRtl ? maxShift : -maxShift]);
  const lineScale = useTransform(progress, [0, 1], [0.06, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setMaxShift(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [steps.length]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.round(v * (steps.length - 1))));
    setActive((prev) => (prev === next ? prev : next));
  });

  const runway = `${Math.max(220, steps.length * 65)}vh`;

  return (
    <div ref={outerRef} style={{ height: runway }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x w-full">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <JourneyHeading eyebrow={eyebrow} title={title} description={description} />

            {/* Progress mini-card */}
            <div className="min-w-[220px] rounded-2xl border border-ink-100 bg-white p-4 text-start shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
                <span>
                  {stepLabel}{' '}
                  <span dir="ltr" className="tabular-nums">
                    {pad(active + 1)}
                  </span>
                </span>
                <span dir="ltr" className="tabular-nums text-ink-400">
                  {pad(active + 1)} / {pad(steps.length)}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-accent-50">
                <motion.div
                  className="h-full rounded-full bg-accent-600"
                  style={{ scaleX: lineScale, transformOrigin: isRtl ? 'right' : 'left' }}
                />
              </div>
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-2.5 text-sm font-bold text-ink-900"
              >
                {steps[active]?.title ?? ''}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Track */}
        <div ref={viewportRef} className="relative mt-10 w-full overflow-hidden">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute start-0 top-1/2 z-0 h-px w-full -translate-y-1/2 bg-accent-100"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleX: lineScale, transformOrigin: isRtl ? 'right' : 'left' }}
            className="pointer-events-none absolute start-0 top-1/2 z-0 h-px w-full -translate-y-1/2 bg-gradient-to-r from-accent-600 via-accent-500 to-cyan-400 rtl:bg-gradient-to-l"
          />
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="relative z-10 flex w-max items-stretch gap-6 px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] py-6 sm:px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))]"
          >
            {steps.map((step, i) => (
              <li key={step.title} className="w-[min(78vw,24rem)] shrink-0 md:w-[24rem]">
                <StationCard
                  step={step}
                  index={i}
                  total={steps.length}
                  active={i === active}
                  stepLabel={stepLabel}
                  reduced={false}
                  pinned
                />
              </li>
            ))}
            <li aria-hidden="true" className="w-[10vw] shrink-0" />
          </motion.ol>
        </div>
      </div>
    </div>
  );
}

export function ProcessMarquee() {
  const { lang, t } = useLang();
  const processSteps = getProcessSteps(lang);
  const reduced = !!useReducedMotion();
  const pinned = useMediaQuery('(min-width: 1024px) and (min-height: 640px)') && !reduced;

  const journeyProps = {
    eyebrow: t.home.processEyebrow,
    title: t.home.processTitle,
    description: t.home.processDescription,
    stepLabel: t.home.processStation,
    steps: processSteps,
  };

  return (
    <section className="relative border-y border-ink-100 bg-white/55">
      <div className={pinned ? 'py-0' : 'py-16 md:py-24'}>
        {pinned ? <JourneyPinned {...journeyProps} /> : <JourneyStatic {...journeyProps} />}
      </div>

      {/* Client marquee */}
      <div className="overflow-hidden py-10 mask-fade-x" dir="ltr">
        <div className="flex w-max animate-marquee items-center gap-12 px-6">
          {[...clientLogos, ...clientLogos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-xl font-semibold tracking-tight text-ink-400 transition-colors hover:text-accent-700"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
