import { createContext, useContext } from 'react';
import { ui, type Lang } from './translations';

export const STORAGE_KEY = 'articode-lang-v2';

export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'ar';
}

export const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'ar',
  setLang: () => {},
});

export function useLang() {
  const { lang, setLang } = useContext(LanguageContext);
  return { lang, setLang, t: ui[lang] };
}
