import { ArrowUpRight, Check, Minus } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { getComparisons, getStrengths } from '@/data/content';
import { useLang } from '@/i18n';

export function Strengths() {
  const { lang, t } = useLang();
  const strengths = getStrengths(lang);
  const comparisons = getComparisons(lang);

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.home.strengthsEyebrow}
          title={t.home.strengthsTitle}
          description={t.home.strengthsDescription}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((s, i) => (
            <article
              key={s.title}
              className={`reveal reveal-delay-${(i % 3) + 1} card-surface group relative overflow-hidden p-7 transition-all duration-400 hover:border-accent-200 hover:shadow-[0_22px_55px_-36px_rgba(41,57,199,0.35)]`}
            >
              <div className="pointer-events-none absolute end-6 top-6 font-display text-5xl font-bold text-ink-100 transition-colors duration-400 group-hover:text-accent-100">
                <span dir="ltr">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="relative">
                <div className="flex items-baseline gap-3">
                  <span dir="ltr" className="font-display text-3xl font-semibold text-accent-700">{s.stat}</span>
                  <span className="text-xs uppercase tracking-wider text-ink-500">{s.statLabel}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{s.description}</p>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent-400/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>

        {/* Comparison — the difference */}
        <div className="mt-24 border-t border-ink-100 pt-20">
          <SectionHeading
            eyebrow={t.home.strengthsCompareEyebrow}
            title={t.home.strengthsCompareTitle}
          />

          <div className="reveal mt-12 overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
            <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-2 md:divide-x md:divide-y-0 md:rtl:divide-x-reverse">
              <div className="bg-ink-50/60 p-7 md:p-9">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-400">
                  {t.home.strengthsTypical}
                </span>
                <ul className="mt-6 space-y-4">
                  {comparisons.map((c) => (
                    <li key={c.typical} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-400">
                        <Minus className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-500">{c.typical}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-white via-accent-50/50 to-cyan-50/60 p-7 md:p-9">
                <div className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-accent-500/10 blur-2xl" />
                <span className="relative text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">
                  {t.home.strengthsUs}
                </span>
                <ul className="relative mt-6 space-y-4">
                  {comparisons.map((c) => (
                    <li key={c.ours} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white shadow-[0_8px_18px_-10px_rgba(41,57,199,0.9)]">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm font-medium leading-relaxed text-ink-800">{c.ours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 border-t border-ink-100 bg-white p-7 md:flex-row md:items-center md:justify-between md:p-9">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink-950">
                  {t.home.strengthsCtaTitle}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-600">
                  {t.home.strengthsCtaDescription}
                </p>
              </div>
              <a href="#contact" className="btn-primary group shrink-0">
                {t.home.strengthsCtaAction}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
