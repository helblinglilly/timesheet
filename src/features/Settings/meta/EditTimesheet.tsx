'use client'

import React, { useMemo } from 'react'
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { Dialog, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import NewTimesheetForm from '~/app/timesheet/new/form';

const EditTimesheetContent = () => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();

  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className='w-full md:w-48'
            >
              {'Test'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <NewTimesheetForm />
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export const EditTimesheetZone = () => {
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
      <EditTimesheetContent />
    </div>
  )
}
