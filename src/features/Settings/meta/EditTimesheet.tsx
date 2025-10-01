'use client'

import React, { useMemo } from 'react'
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import NewTimesheetForm from '~/app/timesheet/new/form';

const EditTimesheetContent = () => {

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
