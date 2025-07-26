import { createTranslation } from '~/i18n/server';

// Server component that uses translations
export async function ServerTranslationComponent({
  locale = 'en',
}: {
  locale?: string;
}) {
  const { t } = await createTranslation(locale, 'translation');

  return (
    <div className="p-6 bg-purple-900 rounded-lg shadow-md my-4">
      <h2 className="text-2xl font-bold mb-2">
        {t('common.welcome')} (Server Component)
      </h2>
      <p className="text-lg mb-4">{t('home.description')}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{t('dashboard.title')}</h3>
          <p>{t('dashboard.hoursLogged')}: 24h</p>
          <p>{t('dashboard.projectsWorked')}: 3</p>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{t('timeEntry.project')}</h3>
          <p>{t('timeEntry.description')}</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-2">
            {t('timeEntry.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
