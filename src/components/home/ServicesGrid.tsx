import { getServices, type Service } from '@/data/content';
import { useLang } from '@/i18n';

export function ServicesGrid() {
  const { lang, t } = useLang();
  const services = getServices(lang);
  return (
    <section id="expertise" className="relative scroll-mt-20 py-24 md:scroll-mt-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="reveal max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-accent-400" />
              {t.home.servicesEyebrow}
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink-950 sm:text-4xl md:text-[2.75rem]">
              {t.home.servicesTitle}
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.5)] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <article
      className={`reveal group relative overflow-hidden bg-white p-7 transition-colors duration-400 hover:bg-accent-50/50 reveal-delay-${(index % 3) + 1}`}
    >
      <div className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-accent-500/0 blur-2xl transition-all duration-500 group-hover:bg-accent-500/12" />

      <div className="relative flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-100 bg-accent-50 text-accent-700 transition-all duration-400 group-hover:border-accent-300 group-hover:bg-white group-hover:text-accent-600 group-hover:shadow-[0_12px_28px_-16px_rgba(53,75,232,0.6)]">
          <Icon className="h-5.5 w-5.5" />
        </span>
        <span className="font-mono text-xs text-ink-500">0{index + 1}</span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-semibold text-ink-950">{service.title}</h3>
      <p className="relative mt-1 text-xs font-medium uppercase tracking-wider text-accent-700/80">{service.tagline}</p>
      <p className="relative mt-3 text-sm leading-relaxed text-ink-600">{service.description}</p>

      <ul className="relative mt-5 flex flex-wrap gap-2">
        {service.features.map((f) => (
          <li key={f} className="rounded-full border border-ink-100 bg-ink-50 px-3 py-1 text-[0.7rem] text-ink-600">
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}
