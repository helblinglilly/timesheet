'use client'

import React, { useMemo } from 'react'
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { useTranslation } from 'react-i18next';
import { ShareTimesheet } from '~/features/ShareTimesheet/ShareTimesheet';
import { ManageSharedUsers } from './ManageSharedUsers';

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
    </>
  );
}

export const ShareZone = () => {
  const { t } = useTranslation();
  const { user } = useAuthInfo();
  const { config } = useTimesheetConfig();

  const isSharedTimesheet = useMemo(() => {
    return user?.id !== config.user
  }, [user, config])

  if (isSharedTimesheet){
    return null;
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">{t('timesheet.[id].settings.share_zone.title')}</h2>
      <ShareZoneContent />
    </div>
  )
}
