import { ArrowUpRight, Check, Minus, Award, Shield, Zap, Code2, Clock, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/SectionHeading';
import { CountUp, Reveal } from '@/components/motion';
import { EASE } from '@/lib/motionTokens';
import { getComparisons, getStrengths } from '@/data/content';
import { useLang } from '@/i18n';

const ICONS = [Award, Shield, Zap, Code2, Clock, Lock];

/* Brand-aligned color tokens — accent (blue/purple) + cyan, matching the site palette */
const CARD_STYLES = [
  { stat: 'text-accent-300',  border: 'border-accent-700/50',  icon: 'bg-accent-600/20 text-accent-300',  glow: 'rgba(53,75,232,0.25)' },
  { stat: 'text-cyan-300',    border: 'border-cyan-700/50',    icon: 'bg-cyan-600/20 text-cyan-300',      glow: 'rgba(22,194,218,0.25)' },
  { stat: 'text-accent-200',  border: 'border-accent-600/50',  icon: 'bg-accent-700/20 text-accent-200',  glow: 'rgba(41,57,199,0.30)' },
  { stat: 'text-cyan-200',    border: 'border-cyan-600/50',    icon: 'bg-cyan-700/20 text-cyan-200',      glow: 'rgba(8,169,200,0.25)' },
  { stat: 'text-accent-300',  border: 'border-accent-800/60',  icon: 'bg-accent-500/20 text-accent-300',  glow: 'rgba(53,75,232,0.20)' },
  { stat: 'text-cyan-300',    border: 'border-cyan-800/60',    icon: 'bg-cyan-500/20 text-cyan-300',      glow: 'rgba(22,194,218,0.20)' },
];

/* Bento layout: 3-col grid on lg.
   Cards 0 & 5 span 1 col; cards 1 & 4 span 2 cols — creates visual rhythm */
const SPANS = [
  'lg:col-span-1',
  'lg:col-span-2',
  'lg:col-span-1',
  'lg:col-span-2',
  'lg:col-span-1',
  'lg:col-span-1',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const cell = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
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
    <section className="relative py-24 md:py-32">
      {/* ── Dark section backdrop — uses site's ink palette ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-ink-900"
      >
        {/* Brand gradient top-left orb */}
        <div className="absolute -start-32 -top-24 h-[500px] w-[500px] rounded-full bg-accent-600/10 blur-[120px]" />
        {/* Cyan orb bottom-right */}
        <div className="absolute -end-24 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(170,178,191,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container-x">
        {/* Section heading — dark tone */}
        <SectionHeading
          eyebrow={t.home.strengthsEyebrow}
          title={t.home.strengthsTitle}
          description={t.home.strengthsDescription}
          tone="dark"
        />

        {/* ── Bento Grid ── */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={reduced ? undefined : container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
        >
          {strengths.map((s, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            const Icon = ICONS[i % ICONS.length];
            const span = SPANS[i] ?? '';

            return (
              <motion.div
                key={s.title}
                variants={reduced ? undefined : cell}
                className={`group relative overflow-hidden rounded-2xl border bg-ink-800/60 backdrop-blur-sm
                  transition-all duration-500
                  hover:-translate-y-1 hover:shadow-2xl
                  ${style.border} ${span}`}
                style={{
                  ['--glow' as string]: style.glow,
                }}
              >
                {/* Glassmorphism inner shine */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

                {/* Hover glow */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(280px circle at 50% 0%, ${style.glow}, transparent 70%)`,
                  }}
                />

                {/* Top brand-line accent */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex h-full flex-col items-center gap-5 p-6 text-center md:p-7">
                  {/* Icon */}
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 ${style.icon} transition-transform duration-500 group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>

                  {/* Title */}
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-extrabold leading-snug text-white md:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink-300 md:text-base">
                      {s.description}
                    </p>
                  </div>

                  {/* Stat */}
                  <div className="mt-auto flex flex-col items-center gap-1">
                    {/* Hairline above stat */}
                    <motion.span
                      aria-hidden="true"
                      className="mb-2 block h-px w-10 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease: EASE }}
                    />
                    <CountUp
                      value={s.stat}
                      className={`block font-display text-4xl font-black leading-none md:text-5xl ${style.stat}`}
                    />
                    <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-ink-400">
                      {s.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Comparison ── */}
        <div className="mt-24 border-t border-white/10 pt-20">
          <SectionHeading
            eyebrow={t.home.strengthsCompareEyebrow}
            title={t.home.strengthsCompareTitle}
            tone="dark"
          />

          <Reveal className="mt-12" y={48} scale={0.97} amount={0.15}>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-ink-800/60 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">

                {/* Typical vendor */}
                <div className="p-7 md:p-9">
                  <span className="pill bg-ink-700/80 text-ink-300 ring-1 ring-white/10">
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
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-600 bg-ink-700 text-ink-400">
                          <Minus className="h-3 w-3" />
                        </span>
                        <span className="text-sm leading-relaxed text-ink-400">{c.typical}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* ArtiCode */}
                <div className="relative overflow-hidden p-7 md:p-9">
                  {/* Brand gradient bg */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-700/15 via-accent-600/8 to-cyan-600/10" />
                  <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full bg-accent-500/15 blur-3xl" />

                  <span className="pill relative bg-accent-600/20 text-accent-200 ring-1 ring-accent-500/40">
                    {t.home.strengthsUs}
                  </span>
                  <motion.ul
                    className="relative mt-6 space-y-4"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.07, delayChildren: 0.12 }}
                  >
                    {comparisons.map((c) => (
                      <motion.li key={c.ours} variants={listItem} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white shadow-[0_6px_18px_-6px_rgba(53,75,232,0.8)]">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-semibold leading-relaxed text-white/90">
                          {c.ours}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex flex-col items-start gap-6 border-t border-white/10 p-7 md:flex-row md:items-center md:justify-between md:p-9">
                <div>
                  <h3 className="font-display text-lg font-bold text-white md:text-xl">
                    {t.home.strengthsCtaTitle}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-400 md:text-[15px]">
                    {t.home.strengthsCtaDescription}
                  </p>
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
