import { useEffect } from 'react';
import Lenis from 'lenis';
import { registerScroller } from '@/lib/scroller';

/**
 * Momentum scrolling for the whole document. It drives the native scroll
 * position, so `useScroll`-based pinning (the journey track, the project
 * stack) keeps working — it just arrives there with easing.
 *
 * Disabled entirely when the visitor asks for reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Touch devices already have native momentum; doubling it feels laggy.
      smoothWheel: true,
    });

    registerScroller(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      registerScroller(null);
      lenis.destroy();
    };
  }, []);
}
