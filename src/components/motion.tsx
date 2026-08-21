import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { EASE, EASE_OUT, useIsRtl } from '@/lib/motionTokens';

/* ------------------------------------------------------------------ *
 * Reveal — scroll-triggered entrance with optional blur / scale / lift
 * ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  /** Any intrinsic tag: 'div' | 'section' | 'article' | 'li' | 'h2' … */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: number;
  amount?: number;
  once?: boolean;
  role?: string;
};

export function Reveal({
  children,
  as = 'div',
  className,
  style,
  role,
  delay = 0,
  duration = 0.75,
  y = 34,
  x = 0,
  scale = 1,
  blur = 8,
  amount = 0.25,
  once = true,
}: RevealProps) {
  const reduced = !!useReducedMotion();
  // `motion` is a proxy — every intrinsic tag resolves to a motion component.
  const Tag = (motion as unknown as Record<string, typeof motion.div>)[as as string];

  if (reduced) {
    const Plain = as as 'div';
    return (
      <Plain className={className} style={style} role={role}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      style={style}
      role={role}
      initial={{ opacity: 0, y, x, scale, filter: blur ? `blur(${blur}px)` : undefined }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: blur ? 'blur(0px)' : undefined }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * SplitWords — cinematic word-by-word headline reveal
 * Splitting on spaces only, so Arabic letter joining stays intact.
 * ------------------------------------------------------------------ */

export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  as = 'span',
  blur = 10,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3';
  /**
   * Set to 0 on gradient (`background-clip: text`) headings — a filter on the
   * word spans makes the clipped background drop out mid-animation.
   */
  blur?: number;
}) {
  const reduced = !!useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  const Tag = (motion as unknown as Record<string, typeof motion.span>)[as];

  if (reduced) {
    const Plain = as as 'span';
    return <Plain className={className}>{text}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: '0.55em', filter: blur ? `blur(${blur}px)` : undefined },
            show: {
              opacity: 1,
              y: '0em',
              filter: blur ? 'blur(0px)' : undefined,
              transition: { duration: 0.72, ease: EASE },
            },
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Parallax — drifts its children against the scroll direction
 * ------------------------------------------------------------------ */

export function Parallax({
  children,
  speed = 0.12,
  className,
}: {
  children: ReactNode;
  /** Fraction of the element's own height to drift across the viewport pass. */
  speed?: number;
  className?: string;
}) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);
  const spring = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  const y = useTransform(spring, (v) => `${v}%`);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * CountUp — animates the numeric part of a stat string ("120+", "99.98%")
 * Strings whose number is glued to letters ("SOC2") render untouched.
 * ------------------------------------------------------------------ */

const STAT_PATTERN = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/;

export function CountUp({
  value,
  className,
  duration = 1.7,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const match = value.match(STAT_PATTERN);
  const animatable = !!match && !/[A-Za-z؀-ۿ]/.test(match[1]);

  const prefix = match?.[1] ?? '';
  const numeric = match?.[2] ?? '';
  const suffix = match?.[3] ?? '';
  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0;

  const [display, setDisplay] = useState(() =>
    reduced || !animatable ? numeric : (0).toFixed(decimals)
  );

  useEffect(() => {
    if (!animatable || reduced || !inView) return;
    const controls = animate(0, Number(numeric), {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [animatable, reduced, inView, numeric, decimals, duration]);

  if (!animatable) {
    return (
      <span ref={ref} className={className}>
        <bdi dir="ltr">{value}</bdi>
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      <bdi dir="ltr" className="tabular-nums">
        {prefix}
        {display}
        {suffix}
      </bdi>
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * TiltCard — pointer-tracked 3D tilt + spotlight, fine pointers only
 * ------------------------------------------------------------------ */

export function TiltCard({
  children,
  className,
  intensity = 7,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  intensity?: number;
}) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const rotateX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduced]);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: 'preserve-3d' }}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateY.set((px - 0.5) * intensity * 2);
        rotateX.set((0.5 - py) * intensity * 2);
        el.style.setProperty('--spot-x', `${px * 100}%`);
        el.style.setProperty('--spot-y', `${py * 100}%`);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * ScrollProgress — thin brand bar pinned under the navbar
 * ------------------------------------------------------------------ */

export function ScrollProgress() {
  const isRtl = useIsRtl();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: isRtl ? 'right' : 'left' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-gradient-to-r from-accent-600 via-accent-400 to-cyan-400 rtl:bg-gradient-to-l"
    />
  );
}
