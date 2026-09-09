import type { CSSProperties, SyntheticEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSwiperSlide } from 'swiper/react';
import { EASE } from '@/lib/motionTokens';
import type { Project } from '@/data/content';

const pad = (n: number) => String(n).padStart(2, '0');

/** Brand hex → rgba(), so one tint token can drive washes at several opacities. */
function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23354be8;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2316c2da;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E`;

type ProjectCardProps = {
  project: Project;
  /** Zero-based position in the project list (not the slide index). */
  index: number;
  total: number;
  actionLabel: string;
};

/**
 * One card on the showcase stage. Geometry (position, tilt, scale) is driven by
 * the stage through CSS custom properties on the slide; the card only decides
 * what to show at a given distance from the centre:
 *
 *   --d     0 → 1  distance to the centre, clamped to one slot
 *   --d2    0 → 1  how far into the second ring the card sits
 *   --blur  0 → 1  depth-of-field weight (first ring only)
 *
 * Side cards show a name-only caption; the active card gets the full panel,
 * whose lines stagger in with Framer Motion once the slide becomes active.
 * Inactive cards are hidden from assistive technology so the loop's duplicate
 * slides never read as extra projects.
 */
export function ProjectCard({ project, index, total, actionLabel }: ProjectCardProps) {
  const { isActive } = useSwiperSlide();
  const reduced = !!useReducedMotion();
  const { tint } = project;
  const [headline, secondary] = project.results;
  const [firstTag, secondTag] = project.tags;

  const line = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
  const lines = {
    hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  };

  const onImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const picture = img.parentElement;
    const sources = picture ? Array.from(picture.querySelectorAll('source')) : [];
    if (sources.length > 0) {
      // The WebP rendition failed — drop it so the browser re-selects the JPG.
      sources.forEach((source) => source.remove());
      img.src = project.image;
      return;
    }
    img.src = FALLBACK_IMAGE;
  };

  return (
    <article
      className="pc-card"
      data-project-card={project.id}
      aria-hidden={!isActive}
      style={
        {
          backgroundColor: tint,
          '--pc-tint': rgba(tint, 0.62),
          '--pc-tint-solid': rgba(tint, 0.9),
        } as CSSProperties
      }
    >
      {/* Image + brand wash share one layer so the depth-of-field blur costs a single pass. */}
      <div className="pc-card-media" aria-hidden="true">
        <picture>
          {project.imageWebp && <source type="image/webp" srcSet={project.imageWebp} />}
          <img
            src={project.image}
            alt=""
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pc-card-img"
            onError={onImageError}
          />
        </picture>
        {/* Brand wash: colours the card with the client's own hue instead of flat black. */}
        <div
          className="pc-card-wash"
          style={{
            background: `radial-gradient(135% 100% at 50% 112%, ${rgba(tint, 0.8)} 0%, ${rgba(
              tint,
              0.3
            )} 42%, transparent 72%)`,
          }}
        />
      </div>
      {/* Neutralises the client site's own navbar in the screenshot so the badges read. */}
      <div className="pc-card-scrim" aria-hidden="true" />
      {/* Darkens as the card leaves the centre. */}
      <div className="pc-card-dim" aria-hidden="true" />

      <div className="pc-badge start-4 top-4 md:start-6 md:top-6">
        <span dir="ltr" className="tabular-nums">
          {pad(index + 1)}
          <span className="mx-1 text-white/45">/</span>
          {pad(total)}
        </span>
      </div>
      <div className="pc-badge end-4 top-4 md:end-6 md:top-6">{project.category}</div>

      {/* Side cards: the name is enough. */}
      <div className="pc-caption" aria-hidden="true">
        <span className="block font-display text-base font-bold leading-tight text-white sm:text-lg md:text-xl">
          {project.name}
        </span>
        <span className="mt-1 block text-xs font-medium text-white/65 md:text-sm">
          {project.category}
        </span>
      </div>

      {/* Active card: the full story. */}
      <motion.div
        className="pc-panel rounded-[1.15rem] border border-white/10 p-4 text-start shadow-2xl shadow-black/40 sm:p-5 md:rounded-[1.5rem] md:p-6 lg:backdrop-blur-xl"
        initial={false}
        animate={isActive ? 'show' : 'hidden'}
        variants={lines}
      >
        <motion.ul variants={line} className="flex flex-wrap gap-1.5">
          {firstTag && <li className="pc-chip">{firstTag}</li>}
          {secondTag && <li className="pc-chip hidden sm:inline-flex">{secondTag}</li>}
          <li className="pc-chip">{project.year}</li>
        </motion.ul>

        <motion.h3
          variants={line}
          className="mt-3 font-display text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-[2rem]"
        >
          <span className="sr-only">
            {pad(index + 1)} / {pad(total)}:{' '}
          </span>
          {project.name}
        </motion.h3>

        <motion.p
          variants={line}
          className="mt-2 line-clamp-2 text-[13px] font-medium leading-relaxed text-white/80 sm:text-sm md:line-clamp-3 md:text-[15px]"
        >
          {project.blurb}
        </motion.p>

        <motion.div
          variants={line}
          className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 md:mt-5 md:gap-4 md:pt-5"
        >
          <dl className="flex min-w-0 items-center gap-4 md:gap-5">
            {headline && <Result value={headline.value} label={headline.label} />}
            {secondary && (
              <Result value={secondary.value} label={secondary.label} className="hidden md:block" />
            )}
          </dl>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isActive ? 0 : -1}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent-500 px-4 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 md:px-5"
          >
            {actionLabel}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
    </article>
  );
}

function Result({ value, label, className = '' }: { value: string; label: string; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dd dir="ltr" className="block font-display text-base font-bold leading-none text-cyan-300 md:text-lg">
        {value}
      </dd>
      <dt className="mt-1 block truncate text-[0.68rem] font-medium text-white/65 md:text-[0.7rem]">
        {label}
      </dt>
    </div>
  );
}
