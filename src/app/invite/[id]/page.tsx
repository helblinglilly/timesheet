'use server';

import { redirect } from 'next/navigation';
import { createTranslation } from '~/i18n/server';
import { serverSideAuth } from '~/pocketbase/server';

export default async function InviteRedemption(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { t } = await createTranslation();
  const { id } = await params;

  const pb = await serverSideAuth();

  if (!pb.authStore.isValid) {
    redirect(`/auth/login?redirect_uri=/invite/${id}`);
  }

  return (
    <div>
      <p>{ t('timesheet.[id].share.redemption.loading') }</p>
    </div>
  )
}
