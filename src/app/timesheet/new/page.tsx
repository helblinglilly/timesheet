'use server';

import { NewTimesheet } from '~/features/NewTimesheet/NewTimesheet';
import { createTranslation } from '~/i18n/server';

export default async function NewTimesheetPage() {
  const { t } = await createTranslation();

  return (
    <div className="grid gap-4 px-4 pt-4 pb-8">
      <h1 className="text-2xl font-semibold">{t('timesheet.new.title')}</h1>
      <NewTimesheet />
    </div>
  );
}
