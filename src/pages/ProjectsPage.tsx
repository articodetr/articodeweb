import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import type { Route } from '@/hooks/useRouter';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/home/CTASection';
import { getProjects } from '@/data/content';
import { useLang } from '@/i18n';

export function ProjectsPage({ navigate }: { navigate: (r: Route) => void }) {
  useReveal();
  const { lang, t } = useLang();
  // Filter state is keyed by the English category so it survives language switches.
  const [filter, setFilter] = useState('All');

  const projects = getProjects(lang);
  const projectsEn = getProjects('en');
  const categoryKeys = ['All', ...Array.from(new Set(projectsEn.map((p) => p.category)))];
  const categoryLabel = (key: string) => {
    if (key === 'All') return t.projects.all;
    const idx = projectsEn.findIndex((p) => p.category === key);
    return projects[idx].category;
  };

  const filtered = projects.filter((_, i) => filter === 'All' || projectsEn[i].category === filter);

  return (
    <>
      <PageHero
        eyebrow={t.projects.eyebrow}
        title={
          <>
            {t.projects.titleA}
            <br />
            <span className="text-gradient-accent">{t.projects.titleB}</span>
          </>
        }
        description={t.projects.description}
      />

      <section className="relative py-16 md:py-24">
        <div className="container-x">
          {/* Filters */}
          <div className="reveal mb-12 flex flex-wrap gap-2">
            {categoryKeys.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  filter === c
                    ? 'border-accent-300 bg-accent-50 text-accent-800 shadow-sm'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-accent-200 hover:text-accent-700'
                }`}
              >
                {categoryLabel(c)}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <a
                key={p.id}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`reveal reveal-delay-${(i % 3) + 1} group block cursor-pointer overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_20px_50px_-36px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-[0_24px_55px_-32px_rgba(41,57,199,0.32)]`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                  <div className="absolute start-4 top-4 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {p.category}
                  </div>
                  <div className="absolute bottom-4 end-4 rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-end backdrop-blur-sm">
                    <div className="font-display text-lg font-semibold text-accent-200">
                      <bdi dir="auto">{p.metric.value}</bdi>
                    </div>
                    <div className="text-[0.65rem] uppercase tracking-wider text-white/70">{p.metric.label}</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold text-ink-950">{p.name}</h3>
                    <span className="shrink-0 font-mono text-xs text-ink-500" dir="ltr">
                      {new URL(p.link).hostname.replace('www.', '')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-ink-100 bg-ink-50 px-2.5 py-0.5 text-[0.7rem] text-ink-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {t.projects.discussSimilar}
                    <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CTASection navigate={navigate} />
    </>
  );
}
