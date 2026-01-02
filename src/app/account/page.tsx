'use server';

import { redirect } from 'next/navigation';
import { createTranslation } from '~/i18n/server';
import { serverSideAuth } from '~/pocketbase/server';

export default async function Account() {
  const { t } = await createTranslation();

  const pb = await serverSideAuth();

  if (!pb.authStore.isValid) {
    redirect('/auth/login?redirect_uri=/account');
  }

  return (
    <div>
      <p>{ t('account.title') }</p>
    </div>
  )
}
