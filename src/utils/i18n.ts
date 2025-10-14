import enTranslations from '../data/i18n/en.json';
import ruTranslations from '../data/i18n/ru.json';

export type Lang = 'en' | 'ru';

const translations = {
  en: enTranslations,
  ru: ruTranslations,
};

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'ru') return 'ru';
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === 'ru') {
    return `/ru${path}`;
  }
  return path;
}
