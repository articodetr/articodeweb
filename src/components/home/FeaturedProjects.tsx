import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { EASE_OUT as EASE } from '@/lib/motionTokens';
import { getProjects, type Project } from '@/data/content';
import { useLang } from '@/i18n';

const pad = (n: number) => String(n).padStart(2, '0');

/** Brand hex → rgba(), so one tint token can drive washes at several opacities. */
function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function segment(p: number, a: number, b: number) {
  if (b <= a) return p >= b ? 1 : 0;
  const clamped = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return clamped * clamped * (3 - 2 * clamped);
}

export function FeaturedProjects() {
  const { lang, t } = useLang();
  const reduceMotion = useReducedMotion();
  const projects = getProjects(lang);
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });
  const smoothed = useSpring(scrollYProgress, { stiffness: 72, damping: 26, mass: 0.82 });
  const progress = useTransform(smoothed, [0, 0.86, 1], [0, 1, 1]);

  if (reduceMotion) {
    return (
      <section id="projects" className="relative overflow-clip bg-ink-950 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950" />
        <div className="relative mx-auto w-full max-w-[116rem] px-5 sm:px-8 lg:px-12">
          <div className="mb-12 md:mb-16">
            <SectionHeading
              eyebrow={t.home.projectsEyebrow}
              title={t.home.projectsTitle}
              description={t.home.projectsDescription}
              align="center"
              tone="dark"
            />
          </div>
          <div className="space-y-6 md:space-y-8">
            {projects.map((p, i) => (
              <FlatCard key={p.id} project={p} index={i} actionLabel={t.home.visitSite} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative scroll-mt-20 overflow-clip bg-ink-950 py-20 text-white md:scroll-mt-24 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(53,75,232,0.16), transparent 65%), radial-gradient(ellipse 50% 35% at 100% 100%, rgba(22,194,218,0.10), transparent 60%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />

      <div className="relative mx-auto w-full max-w-[116rem] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <SectionHeading
            eyebrow={t.home.projectsEyebrow}
            title={t.home.projectsTitle}
            description={t.home.projectsDescription}
            align="center"
            tone="dark"
          />
        </div>

        {/* Mobile */}
        <div className="space-y-6 md:hidden">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <FlatCard project={p} index={i} actionLabel={t.home.visitSite} />
            </motion.div>
          ))}
        </div>

        {/* Desktop Stack */}
        <div
          ref={stackRef}
          data-projects-stack
          className="relative hidden md:block"
          style={{ height: `calc(${projects.length * 108}svh)` }}
        >
          <div className="sticky top-[6.5rem] h-[calc(100svh-8rem)] min-h-[30rem] xl:top-[7rem] xl:h-[calc(100svh-8.75rem)]">
            <div className="relative h-full overflow-hidden rounded-[1.75rem] border-[10px] border-ink-800/60 bg-ink-900 shadow-2xl shadow-black/40 md:rounded-[2.1rem]">
              {projects.map((p, i) => (
                <StackedCard
                  key={p.id}
                  project={p}
                  index={i}
                  total={projects.length}
                  progress={progress}
                  actionLabel={t.home.visitSite}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedCard({
  project,
  index,
  total,
  progress,
  actionLabel,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  actionLabel: string;
}) {
  const per = total > 1 ? 1 / (total - 1) : 1;
  const enterStart = index === 0 ? 0 : (index - 1) * per;
  const enterEnd = index === 0 ? 0.001 : index * per;
  const settleStart = index * per;
  const settleEnd = index < total - 1 ? (index + 1) * per : 1;

  const y = useTransform(progress, (p) => {
    if (index > 0) {
      const entered = segment(p, enterStart, enterEnd);
      if (entered < 1) return `${(1 - entered) * 112}%`;
    }
    return `${(index < total - 1 ? segment(p, settleStart, settleEnd) : 0) * -2.2}%`;
  });

  const scale = useTransform(
    progress,
    (p) => 1 - (index < total - 1 ? segment(p, settleStart, settleEnd) : 0) * 0.018
  );

  return (
    <motion.article
      data-project-card={project.id}
      style={{ y, scale, zIndex: index + 1, backgroundColor: project.tint }}
      className="absolute inset-0 origin-center overflow-hidden will-change-transform"
    >
      <CardInner project={project} index={index} actionLabel={actionLabel} />
    </motion.article>
  );
}

function FlatCard({
  project,
  index,
  actionLabel,
}: {
  project: Project;
  index: number;
  actionLabel: string;
}) {
  return (
    <article
      data-project-card={project.id}
      style={{ backgroundColor: project.tint }}
      className="relative min-h-[34rem] overflow-hidden rounded-[28px] border border-white/10 shadow-xl shadow-black/25 sm:min-h-[30rem] md:min-h-[28rem]"
    >
      <CardInner project={project} index={index} actionLabel={actionLabel} />
    </article>
  );
}

function CardInner({
  project,
  index,
  actionLabel,
}: {
  project: Project;
  index: number;
  actionLabel: string;
}) {
  const { tint } = project;
  return (
    <>
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover contrast-105 saturate-105"
        onError={(e) => {
          const img = e.currentTarget;
          img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23354be8;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2316c2da;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E`;
        }}
      />
      {/* Brand wash: colours the card with the client's own hue instead of flat black. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(135% 100% at 50% 112%, ${rgba(tint, 0.78)} 0%, ${rgba(
            tint,
            0.28
          )} 40%, transparent 70%)`,
        }}
      />
      {/* Just enough scrim at the top for the badges to read over bright screenshots. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent md:h-40" />

      <div className="absolute start-5 top-5 flex h-14 min-w-14 items-center justify-center rounded-2xl border border-white/25 bg-ink-950/45 px-4 font-display text-lg font-black text-white backdrop-blur-md md:start-8 md:top-8 md:h-16 md:min-w-16 md:text-2xl">
        <span dir="ltr" className="tabular-nums">
          {pad(index + 1)}
        </span>
      </div>
      <div className="absolute end-5 top-5 inline-flex items-center rounded-full border border-white/25 bg-ink-950/45 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md md:end-8 md:top-8">
        {project.category}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-7 lg:p-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-7">
          <div
            className="max-w-3xl rounded-[1.35rem] border border-white/12 p-5 text-start shadow-2xl shadow-black/45 backdrop-blur-2xl sm:p-6 md:rounded-[1.6rem] md:p-7"
            style={{
              background: `linear-gradient(155deg, ${rgba(tint, 0.66)} 0%, rgba(8, 9, 11, 0.84) 66%)`,
            }}
          >
            <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              {project.name}
            </h3>
            <p className="mt-2.5 text-sm font-medium leading-relaxed text-white/85 sm:text-base lg:text-lg">
              {project.blurb}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {project.results.map((r, i) => (
                <div
                  key={i}
                  className="inline-flex items-baseline gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2"
                >
                  <span dir="ltr" className="font-display text-sm font-semibold text-cyan-300 md:text-base">
                    {r.value}
                  </span>
                  <span className="text-xs font-medium text-white/75">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-accent-500 px-6 text-sm font-semibold text-white shadow-xl shadow-black/25 transition-all hover:bg-accent-400 focus-visible:outline-white lg:mb-1"
          >
            {actionLabel}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </a>
        </div>
      </div>
    </>
  );
}
