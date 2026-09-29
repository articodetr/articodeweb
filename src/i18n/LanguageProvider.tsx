import { useState, useLayoutEffect, type ReactNode } from 'react';
import { ui, type Lang } from './translations';
import { LanguageContext, STORAGE_KEY, initialLang } from './LanguageContext';

function updateMetaTag(selector: string, attribute: string, value: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute(attribute, value);
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Dynamically update document title and meta tags
    const currentT = ui[lang];
    document.title = currentT.meta.title;
    updateMetaTag('meta[name="description"]', 'content', currentT.meta.description);
    updateMetaTag('meta[property="og:title"]', 'content', currentT.meta.title);
    updateMetaTag('meta[property="og:description"]', 'content', currentT.meta.description);
    updateMetaTag('meta[property="og:locale"]', 'content', lang === 'ar' ? 'ar_AR' : 'en_US');
    updateMetaTag('meta[name="twitter:title"]', 'content', currentT.meta.title);
    updateMetaTag('meta[name="twitter:description"]', 'content', currentT.meta.description);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}
