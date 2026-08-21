/**
 * Tiny registry so navigation code can hand a scroll request to Lenis when
 * momentum scrolling is running, and fall back to the native API when it is
 * not (reduced motion, or before the hook has mounted).
 *
 * Without this, `scrollIntoView({ behavior: 'smooth' })` and Lenis animate the
 * same scroll position at once and the page visibly fights itself.
 */
type Scroller = {
  scrollTo: (target: HTMLElement | number, options?: { offset?: number; immediate?: boolean }) => void;
};

let scroller: Scroller | null = null;

export function registerScroller(instance: Scroller | null) {
  scroller = instance;
}

export function scrollToElement(element: HTMLElement, behavior: ScrollBehavior) {
  if (scroller) {
    scroller.scrollTo(element, { immediate: behavior === 'auto' });
    return;
  }

  if (behavior === 'auto') {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    element.scrollIntoView({ behavior: 'auto', block: 'start' });
    root.style.scrollBehavior = previousBehavior;
    return;
  }

  element.scrollIntoView({ behavior, block: 'start' });
}
