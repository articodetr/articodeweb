import { ArrowUpRight, Check, Minus, Award, Shield, Zap, Code2, Clock, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/SectionHeading';
import { CountUp, Reveal } from '@/components/motion';
import { EASE } from '@/lib/motionTokens';
import { getComparisons, getStrengths } from '@/data/content';
import { useLang } from '@/i18n';

const ICONS = [Award, Shield, Zap, Code2, Clock, Lock];

const CARD_COLORS = [
  {
    bg: 'from-accent-600/10 to-accent-400/5',
    icon: 'bg-accent-600/15 text-accent-600',
    stat: 'text-accent-600',
    border: 'border-accent-200/60',
    glow: 'shadow-accent-500/10',
  },
  {
    bg: 'from-cyan-600/10 to-cyan-400/5',
    icon: 'bg-cyan-600/15 text-cyan-600',
    stat: 'text-cyan-600',
    border: 'border-cyan-200/60',
    glow: 'shadow-cyan-500/10',
  },
  {
    bg: 'from-violet-600/10 to-violet-400/5',
    icon: 'bg-violet-600/15 text-violet-600',
    stat: 'text-violet-600',
    border: 'border-violet-200/60',
    glow: 'shadow-violet-500/10',
  },
  {
    bg: 'from-emerald-600/10 to-emerald-400/5',
    icon: 'bg-emerald-600/15 text-emerald-600',
    stat: 'text-emerald-600',
    border: 'border-emerald-200/60',
    glow: 'shadow-emerald-500/10',
  },
  {
    bg: 'from-amber-500/10 to-amber-400/5',
    icon: 'bg-amber-500/15 text-amber-600',
    stat: 'text-amber-600',
    border: 'border-amber-200/60',
    glow: 'shadow-amber-500/10',
  },
  {
    bg: 'from-rose-600/10 to-rose-400/5',
    icon: 'bg-rose-600/15 text-rose-600',
    stat: 'text-rose-600',
    border: 'border-rose-200/60',
    glow: 'shadow-rose-500/10',
  },
];

/** Bento cell sizes — a 2-col grid on md, 3-col on lg.
 *  Pattern: big | big | small | small | small | small
 *  Row 1: cards 0,1 span the full width (each col-span-1 of 2 → half)
 *  Row 2: cards 2,3,4,5 each take 1 col
 */
const SPANS = [
  'md:col-span-1 lg:col-span-1',  // 0 — medium
  'md:col-span-1 lg:col-span-2',  // 1 — large (2 cols on lg)
  'md:col-span-1 lg:col-span-1',  // 2 — medium
  'md:col-span-1 lg:col-span-1',  // 3 — medium
  'md:col-span-1 lg:col-span-1',  // 4 — medium
  'md:col-span-1 lg:col-span-2',  // 5 — large (2 cols on lg)
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cell = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

const listItem = {
  hidden: { opacity: 0, x: 14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export function Strengths() {
  const { lang, t } = useLang();
  const strengths = getStrengths(lang);
  const comparisons = getComparisons(lang);
  const reduced = !!useReducedMotion();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -start-40 top-1/4 h-96 w-96 rounded-full bg-accent-400/8 blur-3xl" />
        <div className="absolute -end-40 bottom-1/4 h-80 w-80 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      <div className="container-x">
        <SectionHeading
          eyebrow={t.home.strengthsEyebrow}
          title={t.home.strengthsTitle}
          description={t.home.strengthsDescription}
        />

        {/* ── Bento Grid ── */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={reduced ? undefined : container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {strengths.map((s, i) => {
            const color = CARD_COLORS[i % CARD_COLORS.length];
            const Icon = ICONS[i % ICONS.length];
            const span = SPANS[i] ?? '';
            const isLarge = span.includes('col-span-2');

            return (
              <motion.div
                key={s.title}
                variants={reduced ? undefined : cell}
                className={`group relative overflow-hidden rounded-2xl border bg-white/80 p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl ${color.border} ${color.glow} shadow-lg ${span}`}
              >
                {/* Gradient background */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100 ${color.bg}`}
                />

                {/* Glow orb */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ background: `currentColor` }}
                />

                <div className="relative flex h-full flex-col items-center gap-5 text-center">
                  {/* Icon — centered */}
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color.icon}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>

                  {/* Title & description */}
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-extrabold leading-snug text-ink-950 md:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-semibold leading-relaxed text-ink-600 md:text-base">
                      {s.description}
                    </p>
                  </div>

                  {/* Stat — centered at bottom */}
                  <div className="mt-auto flex flex-col items-center gap-1">
                    {/* Decorative line above stat */}
                    <motion.span
                      aria-hidden="true"
                      className={`mb-2 block h-0.5 w-10 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${color.stat}`}
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                    />
                    <CountUp
                      value={s.stat}
                      className={`block font-display text-4xl font-black leading-none ${color.stat} md:text-5xl`}
                    />
                    <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-ink-400">
                      {s.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Comparison section ── */}
        <div className="mt-24 border-t border-ink-100 pt-20">
          <SectionHeading
            eyebrow={t.home.strengthsCompareEyebrow}
            title={t.home.strengthsCompareTitle}
          />

          <Reveal className="mt-12" y={48} scale={0.97} amount={0.15}>
            <div className="overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.07)]">
              <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-2 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
                {/* Typical vendor */}
                <div className="bg-ink-50/60 p-7 md:p-9">
                  <span className="pill bg-ink-100 text-ink-500">
                    {t.home.strengthsTypical}
                  </span>
                  <motion.ul
                    className="mt-6 space-y-4"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.07 }}
                  >
                    {comparisons.map((c) => (
                      <motion.li key={c.typical} variants={listItem} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-400">
                          <Minus className="h-3 w-3" />
                        </span>
                        <span className="text-sm leading-relaxed text-ink-500">{c.typical}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* ArtiCode */}
                <div className="relative overflow-hidden bg-gradient-to-br from-white via-accent-50/50 to-cyan-50/60 p-7 md:p-9">
                  <div className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-accent-500/10 blur-2xl animate-float-slow" />
                  <span className="pill relative">{t.home.strengthsUs}</span>
                  <motion.ul
                    className="relative mt-6 space-y-4"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.07, delayChildren: 0.12 }}
                  >
                    {comparisons.map((c) => (
                      <motion.li key={c.ours} variants={listItem} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white shadow-[0_8px_18px_-10px_rgba(41,57,199,0.9)]">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-medium leading-relaxed text-ink-800">
                          {c.ours}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex flex-col items-start gap-6 border-t border-ink-100 bg-white p-7 md:flex-row md:items-center md:justify-between md:p-9">
                <div>
                  <h3 className="card-title text-lg md:text-xl">{t.home.strengthsCtaTitle}</h3>
                  <p className="card-text mt-1.5 max-w-xl">{t.home.strengthsCtaDescription}</p>
                </div>
                <a href="#contact" className="btn-primary group shrink-0">
                  {t.home.strengthsCtaAction}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
