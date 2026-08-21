import { useReveal } from '@/hooks/useReveal';
import type { Route } from '@/hooks/useRouter';
import { PageHero } from '@/components/PageHero';
import { SectionHeading } from '@/components/SectionHeading';
import { CTASection } from '@/components/home/CTASection';
import { getServices, getProcessSteps } from '@/data/content';
import { useLang } from '@/i18n';

export function ExpertisePage({ navigate }: { navigate: (r: Route) => void }) {
  useReveal();
  const { lang, t } = useLang();
  const services = getServices(lang);
  const processSteps = getProcessSteps(lang);

  return (
    <>
      <PageHero
        eyebrow={t.expertise.eyebrow}
        title={
          <>
            {t.expertise.titleA}
            <br />
            <span className="text-gradient-accent">{t.expertise.titleB}</span>
          </>
        }
        description={t.expertise.description}
      />

      <section className="relative py-20 md:py-28">
        <div className="container-x">
          <div className="space-y-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              const reversed = i % 2 === 1;
              return (
                <article
                  key={s.id}
                  className={`reveal card-surface group grid items-center gap-8 p-8 md:grid-cols-12 md:p-10 ${
                    reversed ? 'md:text-end' : ''
                  }`}
                >
                  <div className={`md:col-span-1 ${reversed ? 'md:order-2' : ''}`}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-100 bg-accent-50 text-accent-700 transition-all duration-400 group-hover:border-accent-300 group-hover:bg-white group-hover:shadow-[0_14px_30px_-18px_rgba(53,75,232,0.55)]">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>

                  <div className={`md:col-span-7 ${reversed ? 'md:order-1' : ''}`}>
                    <div className={`flex items-center gap-3 ${reversed ? 'md:justify-end' : ''}`}>
                      <h2 className="font-display text-2xl font-semibold text-ink-950">{s.title}</h2>
                      <span className="text-xs font-medium uppercase tracking-wider text-accent-700/70">
                        {s.tagline}
                      </span>
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-ink-600">{s.description}</p>
                  </div>

                  <div className={`md:col-span-4 ${reversed ? 'md:order-3' : ''}`}>
                    <ul className={`grid grid-cols-2 gap-2 ${reversed ? 'md:justify-items-end' : ''}`}>
                      {s.features.map((f) => (
                        <li
                          key={f}
                          className="rounded-lg border border-ink-100 bg-ink-50 px-3 py-2 text-xs text-ink-700"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative border-t border-ink-100 bg-white/55 py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.expertise.processEyebrow}
            title={t.expertise.processTitle}
            description={t.expertise.processDescription}
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

      <CTASection navigate={navigate} />
    </>
  );
}
