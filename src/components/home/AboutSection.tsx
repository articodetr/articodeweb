import { motion, useReducedMotion } from 'framer-motion';
import { Orbs } from '@/components/Background';
import { SectionHeading } from '@/components/SectionHeading';
import { TeamShowcase } from '@/components/TeamShowcase';
import { CountUp, Parallax, Reveal } from '@/components/motion';
import { EASE, useIsRtl } from '@/lib/motionTokens';
import { getStats, getTeam } from '@/data/content';
import { useLang } from '@/i18n';

/**
 * Deliberately the one section with no panels: a pull-quote lede, running
 * body copy, and a dotted-leader index of the numbers. Cards belong to the
 * journey, lists to services and strengths — this one reads like a page.
 */
export function AboutSection() {
  const { lang, t } = useLang();
  const stats = getStats(lang);
  const team = getTeam(lang);
  const isRtl = useIsRtl();
  const reduced = !!useReducedMotion();

  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden border-y border-ink-100 py-24 md:scroll-mt-24 md:py-32"
    >
      <Parallax speed={0.16} className="absolute inset-0">
        <Orbs className="opacity-60" />
      </Parallax>

      <div className="container-x relative z-10">
        <SectionHeading
          eyebrow={t.about.eyebrow}
          title={
            <>
              {t.about.titleA} <span className="text-gradient-accent">{t.about.titleB}</span>
            </>
          }
          description={t.about.description}
        />

        {/* Lede — a pull quote, not a card */}
        <Reveal className="mt-16 max-w-4xl" y={36} amount={0.2}>
          <div className="relative ps-6 md:ps-8">
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 start-0 w-[3px] origin-top rounded-full bg-gradient-to-b from-accent-600 to-cyan-400"
              initial={reduced ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
            <h3 className="text-balance font-display text-2xl font-bold leading-snug text-ink-950 sm:text-3xl md:text-[2.15rem]">
              {t.about.storyTitle}
            </h3>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Running copy */}
          <Reveal className="md:col-span-7" delay={0.08} y={34} amount={0.15}>
            <div className="space-y-5 text-base leading-relaxed text-ink-600 md:text-[1.0625rem]">
              {/* No drop cap: a floated first letter breaks Arabic joining. */}
              <p className="text-lg font-medium text-ink-800 md:text-xl">{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
              <p>{t.about.storyP3}</p>
            </div>
          </Reveal>

          {/* The numbers, as an index with dotted leaders */}
          <Reveal className="md:col-span-5" delay={0.16} y={34} amount={0.15}>
            <div className="border-t-2 border-ink-950 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-950">
                {t.about.byTheNumbers}
              </h3>
              <motion.ul
                className="mt-6 space-y-3.5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.07 }}
              >
                {stats.map((stat) => (
                  <motion.li
                    key={stat.label}
                    variants={{
                      hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                    className="group flex items-baseline gap-3"
                  >
                    <span className="shrink-0 text-sm text-ink-600 transition-colors duration-300 group-hover:text-ink-900">
                      {stat.label}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      className="min-w-4 flex-1 border-b border-dotted border-ink-300 transition-colors duration-300 group-hover:border-accent-400"
                      style={{ transformOrigin: isRtl ? 'right' : 'left' }}
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                    <CountUp
                      value={stat.value}
                      className="shrink-0 font-display text-xl font-black text-accent-700 sm:text-2xl"
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Reveal>
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
