import { ArrowUpRight } from 'lucide-react';
import { Orbs } from '@/components/Background';
import type { Route } from '@/hooks/useRouter';
import { useLang } from '@/i18n';

export function CTASection({ navigate }: { navigate: (r: Route) => void }) {
  const { t } = useLang();
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="reveal relative overflow-hidden rounded-3xl border border-accent-100 bg-gradient-to-br from-white via-accent-50/70 to-cyan-50 p-10 text-center shadow-[0_28px_70px_-45px_rgba(41,57,199,0.45)] md:p-16">
          <Orbs />
          <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid-md opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink-950 sm:text-4xl md:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              {t.cta.description}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button onClick={() => navigate('contact')} className="btn-primary group">
                {t.nav.startProject}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </button>
              <button onClick={() => navigate('projects')} className="btn-ghost">
                {t.cta.seeOurWork}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
