'use server';

import { redirect } from 'next/navigation';
import { YourInfo } from '~/features/Account/YourInfo';
import { createTranslation } from '~/i18n/server';
import { serverSideAuth } from '~/pocketbase/server';

export default async function Account() {
  const { t } = await createTranslation();

  const pb = await serverSideAuth();

  if (!pb.authStore.isValid) {
    redirect('/auth/login?redirect_uri=/account');
  }

  return (
    <div className='grid gap-8'>
      <h1 className='text-2xl bolder'>{t('account.title')}</h1>

      <main className="grid gap-8">
        <YourInfo />
      </main>

    </div>
  )
}
