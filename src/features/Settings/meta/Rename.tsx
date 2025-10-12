'use client';

import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Dialog, DialogClose, DialogContent,DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

export const RenameTimesheet = () => {
  const { t } = useTranslation();
  const { config } = useTimesheetConfig();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const renameMutation = api.timesheet.rename.useMutation({
    onSuccess: async () => {
      // Refresh the entire route because the name is usually used from the config which is part of the layout
      router.refresh();
      closeButtonRef.current?.click();
    },
  })

  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className='w-full md:w-48'
            >
              {t('timesheet.[id].settings.rename.open')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('timesheet.[id].settings.rename.dialog.title', { name: config.name})}</DialogTitle>
              <DialogDescription>
                {t('timesheet.[id].settings.rename.dialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Input
                  id="name-1"
                  name="name"
                  placeholder={config.name}
                  ref={inputRef}
                />
              </div>
            </div>
            <DialogFooter className="md:justify-between">
              <DialogClose asChild className="flex-start">
                <Button variant="outline" ref={closeButtonRef}>{t('timesheet.[id].settings.rename.dialog.buttons.cancel')}</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  if (!inputRef.current?.value){
                    return;
                  }
                  renameMutation.mutate({
                    timesheetConfigId: config.id,
                    newName: inputRef.current.value
                  })
                }}
              >
                {t('timesheet.[id].settings.rename.dialog.buttons.apply')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
