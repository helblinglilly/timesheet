'use client'

import React, { useMemo } from 'react'
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { useTranslation } from 'react-i18next';
import { ShareTimesheet } from '~/features/ShareTimesheet/ShareTimesheet';
import { ManageSharedUsers } from './ManageSharedUsers';
import { TransferOwnership } from '~/features/TransferOwnership/TransferOwnership';
import { useDomainConfig } from '~/hooks/useDomainConfig';
import { api } from '~/trpc/react';

const ShareZoneContent = () => {
  const { config } = useTimesheetConfig();

  return (
    <>
      <ShareTimesheet />
      {
        config.sharedUsers.length > 0 && (
          <ManageSharedUsers />
        )
      }
      <TransferOwnership />
    </>
  );
}

export const ShareZone = () => {
  const { t } = useTranslation();
  const [user] = api.account.getFullUserDetails.useSuspenseQuery();
  const { config } = useTimesheetConfig();
  const { canSendEmails, canPerformPBAdminActions } = useDomainConfig();

  const isSharedTimesheet = useMemo(() => {
    return user.id !== config.user
  }, [user, config])

  if (!canSendEmails || !canPerformPBAdminActions) {
    return null
  };


  if (isSharedTimesheet){
    return null;
  }


  return (
    <div className="grid gap-4 h-fit">
      <h2 className="text-xl font-semibold">{t('timesheet.[id].settings.share_zone.title')}</h2>
      <ShareZoneContent />
    </div>
  )
}
