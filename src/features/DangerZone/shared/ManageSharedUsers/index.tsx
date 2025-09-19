'use client'

import React, { Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { ManageSharedUsersTable } from './UserTable';
import { Skeleton } from '~/components/ui/skeleton';

export const ManageSharedUsers = () => {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              className='w-full md:w-48'
            >
              {t('timesheet.[id].settings.share_zone.unlink.others.title')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('timesheet.[id].settings.share_zone.unlink.others.title')}</DialogTitle>
              <DialogDescription>
                {t('timesheet.[id].settings.share_zone.unlink.others.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Suspense fallback={
                  <Skeleton className="h-8 w-full" />
                }>
                  <ManageSharedUsersTable />
                </Suspense>
              </div>
            </div>
            <DialogFooter className="md:justify-between">
              <div></div>
              <DialogClose asChild className="flex-start">
                <Button variant="outline" ref={closeButtonRef}>{t('timesheet.[id].settings.share_zone.unlink.others.buttons.cancel')}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
