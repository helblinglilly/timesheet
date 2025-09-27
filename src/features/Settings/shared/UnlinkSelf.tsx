'use client'

import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { api } from '~/trpc/react';

export const UnlinkTimesheetSelf = () => {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { config } = useTimesheetConfig();
  const router = useRouter();

  const removeAccessMutation = api.timesheet.removeSharedAccess.useMutation({
    onSuccess: async () => {
      router.replace('/dashboard');
    },
  });


  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
            >
              {t('timesheet.[id].settings.share_zone.unlink.title')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('timesheet.[id].settings.share_zone.unlink.title')}</DialogTitle>
              <DialogDescription>
                {t('timesheet.[id].settings.share_zone.unlink.self.disclaimer')}
                <br />
                <br />
                {t('timesheet.[id].settings.share_zone.unlink.self.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">

              </div>
            </div>
            <DialogFooter className="md:justify-between">
              <DialogClose asChild className="flex-start">
                <Button variant="outline" ref={closeButtonRef}>{t('timesheet.[id].settings.share_zone.unlink.self.buttons.cancel')}</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  removeAccessMutation.mutate({
                    timesheetConfigId: config.id,
                  });
                }}
              >
                {t('timesheet.[id].settings.share_zone.unlink.self.buttons.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
