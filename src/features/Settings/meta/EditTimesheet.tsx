'use client'

import Link from 'next/link';
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { RenameTimesheet } from './Rename';

const EditTimesheetContent = () => {
  const { t } = useTranslation();
  const { config } = useTimesheetConfig();

  return (
    <>
      <RenameTimesheet />
      <Link
        href={`/timesheet/${config.id}/edit`}
        className="w-48"
      >
        <Button
          className="w-48">
          {t('timesheet.[id].settings.timesheet_zone.edit')}
        </Button>
      </Link>
    </>
  );
}

export const EditTimesheetZone = () => {
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
      <EditTimesheetContent />
    </div>
  )
}
