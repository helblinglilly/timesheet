'use client'

import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { api } from '~/trpc/react';

export const ShareTimesheet = () => {
  const { t } = useTranslation();
  const { config } = useTimesheetConfig();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate } = api.timesheet.sendInvitation.useMutation({
    onSuccess: async () => {
      if (!closeButtonRef.current){
        return;
      }

      closeButtonRef.current.click();
    }
  });
  const emailRef = useRef<HTMLInputElement>(null);


  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='w-full md:w-48'>
            {t('timesheet.[id].share.cta')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => {
            e.preventDefault();

            if (!emailRef.current){
              return;
            }

            mutate({
              timesheetConfigId: config.id,
              timesheetName: config.name,
              inviteeEmail: emailRef.current.value
            })
          }}>
            <DialogHeader>
              <DialogTitle>{ t('timesheet.[id].share.dialog.title') }</DialogTitle>
              <DialogDescription>
                {t('timesheet.[id].share.dialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pt-2">
              <Label htmlFor="email">{t('timesheet.[id].share.dialog.fields.email.label')}</Label>
              <Input ref={emailRef} id="email" name="email" type="email" defaultValue={t('timesheet.[id].share.dialog.fields.email.placeholder')} />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button ref={ closeButtonRef } variant="outline">{t('timesheet.[id].share.dialog.cancel')}</Button>
              </DialogClose>
              <Button type="submit">{ t('timesheet.[id].share.dialog.submit') }</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
