'use client'

import React, { useMemo } from 'react'
import DeleteAllEntries from './delete/DeleteAllEntries';
import DeleteTimesheet from './delete/DeleteTimesheet';
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { useTranslation } from 'react-i18next';
import { UnlinkTimesheet } from './shared/Unlink';

export const DangerZone = () => {
  const { user } = useAuthInfo();
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();

  const isSharedTimesheet = useMemo(() => {
    return user?.id !== config.user
  }, [user, config])


  if (isSharedTimesheet){
    return (
      <>
        <UnlinkTimesheet />
        <p><i>{ t('timesheet.[id].danger_zone.shared.owner') }</i></p>
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
