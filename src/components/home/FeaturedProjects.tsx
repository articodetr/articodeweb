import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import 'swiper/css';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion';
import { ProjectCard } from '@/components/home/ProjectCard';
import { EASE, useIsRtl } from '@/lib/motionTokens';
import { getProjects, type Project } from '@/data/content';
import { useLang } from '@/i18n';

const AUTOPLAY_DELAY = 5000;
const SPEED = 1000;
const MODULES = [Autoplay, A11y];
/** Second-ring cards travel this much further inward (as a multiple of the first-ring pull). */
const FAR_PULL = 1.3;

export function FeaturedProjects() {
  const { lang, t } = useLang();
  const projects = getProjects(lang);
  const [active, setActive] = useState(0);

  return (
    <section
      id="projects"
      className="relative scroll-mt-20 overflow-clip bg-ink-950 py-20 text-white md:scroll-mt-24 md:py-28"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(53,75,232,0.16), transparent 65%), radial-gradient(ellipse 50% 35% at 100% 100%, rgba(22,194,218,0.10), transparent 60%)',
        }}
      />

      <div className="relative">
        <div className="container-x mb-8 md:mb-12">
          <SectionHeading
            eyebrow={t.home.projectsEyebrow}
            title={t.home.projectsTitle}
            description={t.home.projectsDescription}
            align="center"
            tone="dark"
          />
        </div>

        <ProjectShowcase projects={projects} active={active} onActiveChange={setActive} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Stage choreography
 * ------------------------------------------------------------------ */

type Tuning = {
  /** Max tilt of a first-ring card, in degrees. */
  rotate: number;
  /** Scale of a first-ring card. */
  scale: number;
  /** How far a first-ring card is pulled toward the centre, as a fraction of its width. */
  overlap: number;
  /** How far a first-ring card recedes from the viewer, in px. */
  depth: number;
  /** Extra tilt / shrink / depth the second ring adds, as a multiple of the first ring's. */
  far: number;
};

/** The stage publishes its per-breakpoint choreography as unitless custom properties (see index.css). */
function readTuning(el: HTMLElement): Tuning {
  const css = getComputedStyle(el);
  const read = (name: string, fallback: number) => {
    const value = parseFloat(css.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  return {
    rotate: read('--pc-rotate', 24),
    scale: read('--pc-scale', 0.84),
    overlap: read('--pc-overlap', 0.3),
    depth: read('--pc-depth', 150),
    far: read('--pc-far', 0.5),
  };
}

/**
 * Positions every slide from its distance to the stage centre. It works from
 * geometry (like Swiper's own coverflow) rather than `slide.progress`, so it is
 * direction-agnostic: in RTL the "next" card sits physically on the left and
 * still leans inward. Swiper interpolates between the states it sets here with
 * the same duration and easing as the track, so the cards glide in step.
 */
function choreograph(swiper: SwiperClass, tuning: Tuning) {
  const { slides, slidesSizesGrid, width, translate } = swiper;
  const centre = -translate + width / 2;

  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    const size = slidesSizesGrid[i] || slide.swiperSlideSize || 0;
    if (!size) continue;

    const offset = slide.swiperSlideOffset ?? 0;
    // v: 0 at the centre, -1 one slot to the left, +1 one slot to the right.
    const v = -(centre - offset - size / 2) / size;
    const distance = Math.abs(v);
    const near = Math.min(distance, 1);
    const far = Math.min(Math.max(distance - 1, 0), 1);
    const side = v < 0 ? -1 : 1;
    const reach = near + tuning.far * far;

    const rotate = -side * tuning.rotate * reach;
    const scale = 1 - (1 - tuning.scale) * reach;
    const pull = -side * size * tuning.overlap * (near + FAR_PULL * far);
    const depth = -tuning.depth * reach;

    slide.style.transform = `translate3d(${pull.toFixed(2)}px, 0px, ${depth.toFixed(
      2
    )}px) rotateY(${rotate.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
    slide.style.zIndex = String(20 - Math.round(distance * 4));
    slide.style.setProperty('--d', near.toFixed(4));
    slide.style.setProperty('--d2', far.toFixed(4));
    // Blur is the one costly effect, so only the first ring carries it; it fades
    // out again before a card is fully tucked behind its neighbour.
    const blur = distance < 1.5 ? near : Math.max(0, 1 - (distance - 1.5) * 2);
    slide.style.setProperty('--blur', blur.toFixed(4));
    // Lets the card push its side caption toward the edge that stays uncovered.
    slide.dataset.side = side < 0 ? 'left' : 'right';
  }
}

/* ------------------------------------------------------------------ *
 * Showcase
 * ------------------------------------------------------------------ */

function ProjectShowcase({
  projects,
  active,
  onActiveChange,
}: {
  projects: Project[];
  active: number;
  onActiveChange: (index: number) => void;
}) {
  const { lang, t } = useLang();
  const isRtl = useIsRtl();
  const reduced = !!useReducedMotion();
  const count = projects.length;
  // Loop mode needs more slides than can fit on the widest screens, so the
  // list is repeated; every counter below works on `realIndex % count`.
  const copies = Math.max(1, Math.ceil(9 / Math.max(count, 1)));

  const stageRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const tuningRef = useRef<Tuning | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  // Autoplay runs only while it makes sense: section in view, not held by a
  // keyboard user, not paused by hand. (Hover is handled by Swiper itself.)
  const holds = useRef({ inView: true, focusWithin: false, userPaused: false });
  const modality = useRef<'pointer' | 'keyboard'>('pointer');
  const [userPaused, setUserPaused] = useState(false);
  const announceNext = useRef(false);
  const hovered = useRef(false);
  const recoverTimer = useRef(0);
  const [announcement, setAnnouncement] = useState('');

  const syncAutoplay = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed || !swiper.autoplay) return;
    const { inView, focusWithin, userPaused: paused } = holds.current;
    const shouldRun = !reduced && inView && !focusWithin && !paused;
    if (shouldRun && !swiper.autoplay.running) swiper.autoplay.start();
    if (!shouldRun && swiper.autoplay.running) swiper.autoplay.stop();
  }, [reduced]);

  // The keypress that tabs focus *into* the stage lands on whatever was focused
  // before it, so input modality is tracked at the window.
  useEffect(() => {
    const onKey = () => {
      modality.current = 'keyboard';
    };
    const onPointer = () => {
      modality.current = 'pointer';
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('pointerdown', onPointer, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('pointerdown', onPointer, true);
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Entries can arrive batched (e.g. a resize followed by a restore);
        // only the most recent one describes the current state.
        holds.current.inView = entries[entries.length - 1].isIntersecting;
        syncAutoplay();
      },
      { rootMargin: '12% 0px', threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncAutoplay]);

  // Props handed to <Swiper> must be referentially stable across re-renders:
  // the React wrapper diffs them and calls swiper.update() (a full re-measure,
  // mid-transition) for anything that looks new. The start slide is computed
  // only when the language flips, which is also when the Swiper remounts.
  const initialSlide = useMemo(
    () => Math.floor(copies / 2) * count + activeRef.current,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, copies, count]
  );
  const autoplay = useMemo(
    () =>
      reduced
        ? false
        : {
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true,
          },
    [reduced]
  );
  const a11y = useMemo(
    () => ({
      prevSlideMessage: t.home.prevProject,
      nextSlideMessage: t.home.nextProject,
      containerMessage: t.home.projectsCarousel,
      containerRole: 'region',
      containerRoleDescriptionMessage: t.home.carousel,
      itemRoleDescriptionMessage: t.home.slide,
      slideLabelMessage: '',
      wrapperLiveRegion: false,
    }),
    [t]
  );

  const slides = useMemo(
    () =>
      Array.from({ length: copies }, (_, copy) =>
        projects.map((project, index) => ({ project, index, copy }))
      ).flat(),
    [projects, copies]
  );

  const layout = useCallback((swiper: SwiperClass) => {
    if (!tuningRef.current) tuningRef.current = readTuning(swiper.el);
    choreograph(swiper, tuningRef.current);
  }, []);

  /** Move `delta` slides in either direction, wrapping through the loop. */
  const step = (delta: number) => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed || swiper.animating || delta === 0) return;
    announceNext.current = true;
    swiper.loopFix({ direction: delta > 0 ? 'next' : 'prev' });
    // Commit the loop teleport (a reflow) before the animated move, as Swiper's own
    // slideNext does. Without it the track can end where it started, no transition
    // runs, and Swiper waits forever for a transitionend.
    swiper.wrapperEl.getBoundingClientRect();
    swiper.slideTo(swiper.activeIndex + delta);
  };

  /** Jump to a project by the shortest path around the ring. */
  const goTo = (index: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    let delta = index - (swiper.realIndex % count);
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    step(delta);
  };

  const togglePause = () => {
    holds.current.userPaused = !holds.current.userPaused;
    setUserPaused(holds.current.userPaused);
    syncAutoplay();
  };

  // Keyboard focus inside the stage holds the carousel still; a mouse click on
  // the controls also focuses them, so only keyboard-driven focus counts.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    let keyboard = modality.current === 'keyboard';
    try {
      keyboard = (event.target as HTMLElement).matches(':focus-visible');
    } catch {
      // Engines without :focus-visible fall back to the modality tracker.
    }
    if (!keyboard) return;
    holds.current.focusWithin = true;
    syncAutoplay();
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    holds.current.focusWithin = false;
    syncAutoplay();
  };

  const current = projects[active] ?? projects[0];

  return (
    <div
      ref={stageRef}
      className="pc-stage"
      dir={isRtl ? 'rtl' : 'ltr'}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="pc-floor" aria-hidden="true" />

      <Reveal y={36} blur={0} amount={0.15} duration={0.8}>
        <Swiper
          key={lang}
          dir={isRtl ? 'rtl' : 'ltr'}
          className="pc-swiper"
          modules={MODULES}
          loop
          centeredSlides
          slidesPerView="auto"
          spaceBetween={0}
          speed={reduced ? 0 : SPEED}
          initialSlide={initialSlide}
          grabCursor
          watchSlidesProgress
          // Keeps two extra slides buffered on each side so a two-slot jump (dots,
          // second-ring taps) is always reachable, even where only two slides fit.
          loopAdditionalSlides={2}
          // With slidesPerView "auto", Swiper re-measures every slide whenever an image
          // inside it loads, which interrupts the running card transitions. The cards
          // are sized by CSS and the images are native loading="lazy", so that machinery
          // is switched off.
          lazyPreload={false}
          threshold={6}
          longSwipesRatio={0.25}
          autoplay={autoplay}
          a11y={a11y}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            tuningRef.current = readTuning(swiper.el);
            choreograph(swiper, tuningRef.current);
            syncAutoplay();
          }}
          onClick={(swiper) => {
            // Tapping a side card brings it to the centre through the same path as
            // the arrows; Swiper's own slideToClickedSlide picks its route from DOM
            // order and can misjudge the direction at the loop seam.
            const { clickedIndex, activeIndex } = swiper;
            if (clickedIndex === undefined || clickedIndex === activeIndex) return;
            step(Math.max(-2, Math.min(2, clickedIndex - activeIndex)));
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') hovered.current = true;
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') hovered.current = false;
          }}
          onSetTranslate={layout}
          onSetTransition={(swiper, duration) => {
            swiper.el.style.setProperty('--pc-dur', `${duration}ms`);
          }}
          onResize={(swiper) => {
            tuningRef.current = readTuning(swiper.el);
            // Swiper re-positions the loop after a resize with a zero-duration move
            // (deferred to the next frame), which pauses autoplay to wait for a
            // transitionend that never comes. Nudge it back once things settle.
            window.clearTimeout(recoverTimer.current);
            recoverTimer.current = window.setTimeout(() => {
              if (swiper.destroyed || !swiper.autoplay) return;
              const { running, paused } = swiper.autoplay;
              if (running && paused && !swiper.animating && !hovered.current) {
                swiper.autoplay.resume();
              }
            }, 700);
          }}
          onSlideChange={(swiper) => {
            const index = swiper.realIndex % count;
            onActiveChange(index);
            if (announceNext.current) {
              announceNext.current = false;
              setAnnouncement(
                t.home.projectPosition
                  .replace('{name}', projects[index].name)
                  .replace('{index}', String(index + 1))
                  .replace('{total}', String(count))
              );
            }
          }}
          onAutoplayTimeLeft={(_swiper, _timeLeft, fraction) => {
            const elapsed = Math.min(1, Math.max(0, 1 - fraction));
            dotsRef.current?.style.setProperty('--pc-progress', elapsed.toFixed(4));
          }}
        >
          {slides.map(({ project, index, copy }) => (
            <SwiperSlide key={`${project.id}-${copy}`} className="pc-slide">
              <ProjectCard
                project={project}
                index={index}
                total={count}
                actionLabel={t.home.viewProject}
              />
            </SwiperSlide>
          ))}

          {/* Rendered inside the Swiper element so its hover-pause covers the controls too. */}
          <div slot="container-end" className="container-x">
            <Reveal y={20} blur={0} delay={0.12} amount={0.5}>
              <div className="mt-6 flex justify-center md:mt-8">
                <div className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.06] p-1.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md">
                  <ControlButton onClick={() => step(-1)} label={t.home.prevProject}>
                    <ChevronLeft className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
                  </ControlButton>

                  {!reduced && (
                    <ControlButton
                      onClick={togglePause}
                      label={userPaused ? t.home.resumeAutoplay : t.home.pauseAutoplay}
                    >
                      {userPaused ? (
                        <Play className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                      ) : (
                        <Pause className="h-4 w-4" aria-hidden="true" />
                      )}
                    </ControlButton>
                  )}

                  <div ref={dotsRef} className="pc-dots px-1">
                    {projects.map((p, i) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={t.home.showProject.replace('{name}', p.name)}
                        aria-current={i === active ? 'true' : undefined}
                        className={`pc-dot${i === active ? ' is-active' : ''}`}
                      >
                        <span className="pc-dot-bar" />
                      </button>
                    ))}
                  </div>

                  {/* Fixed width, so the pill never re-centres and the arrows stay put. */}
                  <div className="hidden w-[10.5rem] items-center border-s border-white/10 ps-3 sm:flex md:w-[13rem]">
                    <motion.span
                      key={current.id}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="block w-full truncate text-sm font-semibold text-white"
                    >
                      {current.name}
                    </motion.span>
                  </div>

                  <ControlButton onClick={() => step(1)} label={t.home.nextProject}>
                    <ChevronRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
                  </ControlButton>
                </div>
              </div>
            </Reveal>
          </div>
        </Swiper>
      </Reveal>

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="pc-arrow">
      {children}
    </button>
  );
}
