'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthInfo } from '~/hooks/useAuthInfo';

export function Content({
  supportEmail
}: {
  supportEmail?: string | undefined | null;
}) {
  const { t } = useTranslation();
  const { user } = useAuthInfo();

  const emailLink = useMemo(() => {
    const base = new URL(`mailto:${supportEmail}`)

    if (user?.id) {
      base.searchParams.set('subject', `UserId: ${user.id} - Help needed`)
    }

    return base.href;
  }, [user, supportEmail])

  if (!supportEmail) {
    return (
      <>
        <h1 className='text-2xl font-bold'>{t('support.no_support.title')}</h1>
        <p>{t('support.no_support.configure')}</p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold">{t('support.support.title')}</h1>
      <p>{t('support.support.email_copy')}</p>
      <a href={emailLink} className='underline text-lg'>{supportEmail }</a>
    </>
  )
}
