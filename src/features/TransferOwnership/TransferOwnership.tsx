'use client'

import React, { useMemo, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next';
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { api } from '~/trpc/react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';

export const TransferOwnership = () => {
  const { t } = useTranslation();
  const { user } = useAuthInfo();
  const { config } = useTimesheetConfig();
  const closeButtonRef = useRef<HTMLButtonElement>(null);


  const { mutate } = api.timesheet.sendOwnershipInvitation.useMutation({
    onSuccess: async () => {
      if (!closeButtonRef.current){
        return;
      }

      closeButtonRef.current.click();

    }
  });
  const emailRef = useRef<HTMLInputElement>(null);

  const isSharedTimesheet = useMemo(() => {
    return user?.id !== config.user
  }, [user, config])

  if (isSharedTimesheet){
    return null;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='w-full md:w-48'>
            {t('timesheet.[id].transfer.cta')}
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
              <DialogTitle>{t('timesheet.[id].transfer.cta')}</DialogTitle>
              <DialogDescription>
                <Trans
                  i18nKey="timesheet.[id].transfer.dialog.description"
                  components={{
                    bold: <strong />
                  }}
                />

              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pt-2">
              <Label htmlFor="email">{t('timesheet.[id].transfer.dialog.fields.email.label')}</Label>
              <Input ref={emailRef} id="email" name="email" type="email" defaultValue={t('timesheet.[id].transfer.dialog.fields.email.placeholder')} />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button ref={ closeButtonRef } variant="outline">{t('timesheet.[id].transfer.dialog.cancel')}</Button>
              </DialogClose>
              <Button type="submit">{ t('timesheet.[id].transfer.dialog.submit') }</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
