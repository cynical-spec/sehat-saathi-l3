import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'hi';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const I18nContext = createContext<I18nValue>({
  lang: 'en',
  setLang: () => {},
  toggle: () => {},
});

function initialLang(): Lang {
  if (typeof location === 'undefined') return 'en';
  return new URLSearchParams(location.search).get('lang') === 'hi' ? 'hi' : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const toggle = () => setLang((l) => (l === 'en' ? 'hi' : 'en'));
  return <I18nContext.Provider value={{ lang, setLang, toggle }}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  return useContext(I18nContext);
}

/** Pick the string for the current language from a bilingual pair. */
export type Bi = { en: string; hi: string };
// eslint-disable-next-line react-refresh/only-export-components
export function t(pair: Bi, lang: Lang): string {
  return pair[lang];
}
