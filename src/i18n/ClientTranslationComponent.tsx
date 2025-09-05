'use client';

import { useTranslation } from 'react-i18next';

export function ClientTranslationComponent() {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-purple-800 rounded-lg shadow-md my-4">
      <h2 className="text-2xl font-bold mb-2">
        {t('navigation.home')}
        {' '}
        (Client Component)
      </h2>
      <p className="text-lg mb-4">{t('home.subtitle')}</p>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white/10 p-4 rounded-lg flex-1">
          <h3 className="text-xl font-semibold mb-2">{t('settings.title')}</h3>
          <p>
            {t('settings.language')}
            :
            {' '}
            {t('common.language')}
          </p>
          <p>
            {t('settings.theme')}
            : Dark
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg flex-1">
          <h3 className="text-xl font-semibold mb-2">{t('home.learnMore')}</h3>
          <p>{t('home.description')}</p>
          <div className="flex gap-2 mt-3">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              {t('home.getStarted')}
            </button>
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded">
              {t('timeEntry.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
