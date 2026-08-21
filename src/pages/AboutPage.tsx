import { useReveal } from '@/hooks/useReveal';
import type { Route } from '@/hooks/useRouter';
import { PageHero } from '@/components/PageHero';
import { SectionHeading } from '@/components/SectionHeading';
import { StatsCard } from '@/components/StatsCard';
import { TeamShowcase } from '@/components/TeamShowcase';
import { CTASection } from '@/components/home/CTASection';
import { getStats, getStrengths, getTeam, getProcessSteps } from '@/data/content';
import { Orbs } from '@/components/Background';
import { useLang } from '@/i18n';

export function AboutPage({ navigate }: { navigate: (r: Route) => void }) {
  useReveal();
  const { lang, t } = useLang();
  const stats = getStats(lang);
  const strengths = getStrengths(lang);
  const team = getTeam(lang);
  const processSteps = getProcessSteps(lang);

  return (
    <>
      <PageHero
        eyebrow={t.about.eyebrow}
        title={
          <>
            {t.about.titleA}
            <br />
            <span className="text-gradient-accent">{t.about.titleB}</span>
          </>
        }
        description={t.about.description}
      />

      {/* Story + stats */}
      <section className="relative py-20 md:py-28">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <div className="reveal md:col-span-7">
            <h2 className="font-display text-2xl font-semibold leading-tight text-ink-950 sm:text-3xl">
              {t.about.storyTitle}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-600">
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
              <p>{t.about.storyP3}</p>
            </div>
          </div>

          <div className="reveal reveal-delay-1 md:col-span-5">
            <StatsCard title={t.about.byTheNumbers} stats={stats} />
          </div>
        </div>
      </section>

      {/* Values / strengths */}
      <section className="relative border-t border-ink-100 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.about.valuesEyebrow}
            title={t.about.valuesTitle}
            description={t.about.valuesDescription}
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {strengths.map((s, i) => (
              <article key={s.title} className={`reveal reveal-delay-${(i % 2) + 1} card-surface p-7`}>
                <div className="flex items-baseline gap-3">
                  <span dir="ltr" className="font-display text-3xl font-semibold text-accent-700">{s.stat}</span>
                  <span className="text-xs uppercase tracking-wider text-ink-500">{s.statLabel}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative border-t border-ink-100 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.about.teamEyebrow}
            title={t.about.teamTitle}
            description={t.about.teamDescription}
          />
          <TeamShowcase members={team} />
        </div>
      </section>

      {/* Process */}
      <section className="relative border-t border-ink-100 bg-white/55 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.about.processEyebrow}
            title={t.about.processTitle}
            description={t.about.processDescription}
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <div key={step.title} className={`reveal reveal-delay-${Math.min(i + 1, 5)} card-surface p-6`}>
                <span className="font-mono text-xs text-accent-700/70">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy band */}
      <section className="relative overflow-hidden border-t border-ink-100 py-24">
        <Orbs />
        <div className="container-x relative z-10">
          <blockquote className="reveal mx-auto max-w-3xl text-center">
            <p className="font-display text-2xl font-medium leading-snug tracking-tight text-ink-950 sm:text-3xl md:text-4xl">
              {t.about.quote}
            </p>
            <footer className="mt-6 text-sm uppercase tracking-[0.2em] text-ink-500">
              {t.about.quoteAttribution}
            </footer>
          </blockquote>
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}
