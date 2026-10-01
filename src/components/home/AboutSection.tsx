import { motion, useReducedMotion } from 'framer-motion';
import { Orbs } from '@/components/Background';
import { SectionHeading } from '@/components/SectionHeading';
import { TeamShowcase } from '@/components/TeamShowcase';
import { CountUp, Parallax, Reveal } from '@/components/motion';
import { EASE } from '@/lib/motionTokens';
import { getStats, getTeam } from '@/data/content';
import { useLang } from '@/i18n';

export function AboutSection() {
  const { lang, t } = useLang();
  const stats = getStats(lang);
  const team = getTeam(lang);
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

        <Reveal className="mt-14" y={36} amount={0.12}>
          <div className="grid overflow-hidden rounded-[28px] border border-ink-100 bg-white/90 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur-sm lg:grid-cols-12">
            {/* Story panel */}
            <div className="relative p-6 sm:p-8 lg:col-span-7 lg:p-9">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent"
              />
              <span className="inline-flex items-center gap-2 text-xs font-bold text-accent-700">
                <span className="h-1.5 w-7 rounded-full bg-gradient-to-r from-accent-600 to-cyan-400" />
                {t.about.eyebrow}
              </span>
              <h3 className="mt-4 max-w-3xl text-balance font-display text-2xl font-bold leading-snug text-ink-950 sm:text-[1.75rem] lg:text-[1.8rem]">
                {t.about.storyTitle}
              </h3>

              <p className="mt-5 max-w-3xl text-base font-medium leading-[1.75] text-ink-800">
                {t.about.storyP1}
              </p>

              <div className="mt-6 grid overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2 sm:gap-px">
                {[t.about.storyP2, t.about.storyP3].map((paragraph, index) => (
                  <div key={paragraph} className="relative bg-white p-4 sm:p-5">
                    <span
                      aria-hidden="true"
                      className="font-display text-xs font-bold tabular-nums text-accent-600"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2 text-[13px] leading-[1.75] text-ink-600 sm:text-sm">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact evidence dashboard */}
            <div className="relative overflow-hidden bg-gradient-to-br from-accent-800 via-accent-700 to-cyan-800 p-6 text-white sm:p-7 lg:col-span-5 lg:p-8">
              <div
                aria-hidden="true"
                className="absolute -end-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -start-20 h-64 w-64 rounded-full bg-accent-400/20 blur-3xl"
              />

              <div className="relative">
                <span className="text-xs font-bold text-white/65">ArtiCode</span>
                <h3 className="mt-1.5 font-display text-2xl font-bold">
                  {t.about.byTheNumbers}
                </h3>

                <motion.ul
                  className="mt-5 grid grid-cols-2 gap-2.5"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ staggerChildren: 0.06 }}
                >
                  {stats.map((stat) => (
                    <motion.li
                      key={stat.label}
                      variants={{
                        hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EASE } },
                      }}
                      className="group min-h-[88px] rounded-2xl border border-white/10 bg-white/[0.08] p-3.5 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.13] sm:p-4"
                    >
                      <CountUp
                        value={stat.value}
                        className="block font-display text-2xl font-black leading-none text-white"
                      />
                      <span className="mt-2 block text-xs font-medium leading-relaxed text-white/70 sm:text-[13px]">
                        {stat.label}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </div>
        </Reveal>

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
