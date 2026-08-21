import { useLang } from '@/i18n';

/** Shared easing curves — the same feel the project-journey section uses. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function useIsRtl() {
  const { lang } = useLang();
  return lang === 'ar';
}
