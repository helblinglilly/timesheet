import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string) => import(`../../public/locales/${language}.json`),
      ),
    )
    .init(getOptions(lng, ns));

  return i18nInstance;
};

export async function createTranslation(namespace = 'translation') {
  const i18nextInstance = await initI18next('en', namespace);

  return {
    t: i18nextInstance.getFixedT('en', typeof namespace === 'string' ? namespace : Array.isArray(namespace) ? namespace[0] : undefined),
    i18n: i18nextInstance,
  };
}
