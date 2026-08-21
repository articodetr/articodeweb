import { ArrowUpRight, Check, Minus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '@/components/SectionHeading';
import { CountUp, Reveal } from '@/components/motion';
import { EASE, useIsRtl } from '@/lib/motionTokens';
import { getComparisons, getStrengths } from '@/data/content';
import { useLang } from '@/i18n';

const pad = (n: number) => String(n).padStart(2, '0');

export function Strengths() {
  const { lang, t } = useLang();
  const strengths = getStrengths(lang);
  const comparisons = getComparisons(lang);
  const reduced = !!useReducedMotion();
  const isRtl = useIsRtl();

  const listItem = {
    hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.home.strengthsEyebrow}
          title={t.home.strengthsTitle}
          description={t.home.strengthsDescription}
        />

        {/* A numeric ledger: the stat is the headline, one row per claim. */}
        <Reveal className="mt-14" y={40} amount={0.1}>
          <ol className="card-surface divide-y divide-ink-100 overflow-hidden">
            {strengths.map((s, i) => (
              <li
                key={s.title}
                className="group relative grid gap-4 px-6 py-7 transition-colors duration-400 odd:bg-white even:bg-ink-50/40 hover:bg-accent-50/40 md:grid-cols-[1fr_11rem] md:items-center md:gap-8 md:px-9 md:py-8"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span
                      dir="ltr"
                      className="font-display text-sm font-black tabular-nums text-ink-300 transition-colors duration-300 group-hover:text-accent-400"
                    >
                      {pad(i + 1)}
                    </span>
                    <h3 className="font-display text-xl font-bold text-ink-950 md:text-2xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-600 md:text-[15px]">
                    {s.description}
                  </p>

                  {/* Hairline flourish — deliberately not a meter, so it can't
                      be misread as a measurement of the stat beside it. */}
                  <motion.span
                    aria-hidden="true"
                    className="mt-5 block h-px w-40 bg-gradient-to-r from-accent-500 to-transparent rtl:bg-gradient-to-l"
                    style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                  />
                </div>

                <div className="md:text-end">
                  <CountUp
                    value={s.stat}
                    className="block font-display text-4xl font-black leading-none text-accent-700 md:text-5xl"
                  />
                  <span className="mt-2 block text-xs font-semibold text-ink-500">
                    {s.statLabel}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Comparison — the difference */}
        <div className="mt-24 border-t border-ink-100 pt-20">
          <SectionHeading
            eyebrow={t.home.strengthsCompareEyebrow}
            title={t.home.strengthsCompareTitle}
          />

          <Reveal className="mt-12" y={48} scale={0.97} amount={0.15}>
            <div className="overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.07)]">
              <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-2 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
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
