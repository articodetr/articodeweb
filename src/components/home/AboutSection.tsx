import { Orbs } from '@/components/Background';
import { SectionHeading } from '@/components/SectionHeading';
import { StatsCard } from '@/components/StatsCard';
import { TeamShowcase } from '@/components/TeamShowcase';
import { getStats, getTeam } from '@/data/content';
import { useLang } from '@/i18n';

export function AboutSection() {
  const { lang, t } = useLang();
  const stats = getStats(lang);
  const team = getTeam(lang);

  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden border-y border-ink-100 py-24 md:scroll-mt-24 md:py-32"
    >
      <Orbs className="opacity-60" />
      <div className="container-x relative z-10">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={
            <>
              {t.about.titleA}{' '}
              <span className="text-gradient-accent">{t.about.titleB}</span>
            </>
          }
          description={t.about.description}
        />

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-start">
          <div className="reveal md:col-span-7">
            <h3 className="font-display text-2xl font-semibold leading-tight text-ink-950 sm:text-3xl">
              {t.about.storyTitle}
            </h3>
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

        <div className="mt-24 border-t border-ink-100 pt-20">
          <SectionHeading
            eyebrow={t.about.teamEyebrow}
            title={t.about.teamTitle}
            description={t.about.teamDescription}
          />

          <TeamShowcase members={team} />
        </div>
      </div>
    </section>
  );
}
