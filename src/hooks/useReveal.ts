import { useEffect } from 'react';

/**
 * Adds `is-visible` to every element with the `reveal` class when it
 * scrolls into view. Runs once on mount and observes dynamically added nodes.
 */
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document
        .querySelectorAll<HTMLElement>('.reveal')
        .forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const observeWithin = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')
        .forEach((el) => observer.observe(el));
    };

    observeWithin(document);

    // Nodes that appear after mount — a re-render swapping a subtree, an HMR
    // update, a route change — still need to be picked up, otherwise they stay
    // stuck at opacity 0. Re-observing an element is a no-op, so this is safe.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.classList.contains('reveal') && !node.classList.contains('is-visible')) {
            observer.observe(node);
          }
          observeWithin(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);
}
