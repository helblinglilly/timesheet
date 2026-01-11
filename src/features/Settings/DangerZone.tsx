'use client'

import React, { useMemo } from 'react'
import DeleteAllEntries from './delete/DeleteAllEntries';
import DeleteTimesheet from './delete/DeleteTimesheet';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { useTranslation } from 'react-i18next';
import { UnlinkTimesheetSelf } from './shared/UnlinkSelf';
import { api } from '~/trpc/react';


const DangerZoneContent = () => {
  const [user] = api.account.getFullUserDetails.useSuspenseQuery();
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();

  const isSharedTimesheet = useMemo(() => {
    return user?.id !== config.user
  }, [user, config])


  if (isSharedTimesheet){
    return (
      <>
        <UnlinkTimesheetSelf />
        <p><i>{ t('timesheet.[id].settings.share_zone.owner') }</i></p>
      </>
    )
  }

  return (
    <>
      <DeleteAllEntries />
      <DeleteTimesheet />
    </>
  );
}


export const DangerZone = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 h-fit" id="dangerZone">
      <h2 className="text-xl font-semibold">{t('timesheet.[id].settings.danger_zone.title')}</h2>
      <DangerZoneContent />
    </div>
  )

}
