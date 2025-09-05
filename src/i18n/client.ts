'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { getOptions } from './settings';

// Initialize i18next for client-side
await i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string) => import(`../../public/locales/${language}.json`),
    ),
  )
  .init({
    ...getOptions(),
    detection: {
      order: ['path', 'cookie', 'navigator'],
      caches: ['cookie'],
    },
  });

export default i18next;
