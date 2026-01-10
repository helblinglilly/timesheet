'use client'

import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useAuthInfo } from '~/hooks/useAuthInfo';
import { api } from '~/trpc/react';
import { useSonarTriggers } from '../Toasts/genericError';

export const DeleteAccount = () => {
  const { user } = useAuthInfo();

  const { t } = useTranslation();
  const closeButton = useRef<HTMLButtonElement>(null);
  const [isTimesheetListOpen, setIsTimesheetListOpen] = useState(false)
  const { triggerGenericError } = useSonarTriggers();

  const [timesheets] = api.account.getNumberOfOwnedTimesheets.useSuspenseQuery({
    userId: user?.id ?? ''
  })

  const { mutate: deleteUser, status: deletionStatus } = api.account.deleteAccount.useMutation({
    onSuccess: async () => {
      window.location.href='/auth/logout'
    },
    onError: async () => {
      triggerGenericError();
    }
  })

  if (!user) {
    // eslint-disable-next-line no-console
    console.error('Rendering null', new Error('"user" was nullish in client component when server-side checks succeeded'))
    return null;
  }

  return (
    <>
      <section className=''>
        <Card className='md:max-w-128'>
          <CardHeader>
            <CardTitle>
              {t('account.delete_account.section_header')}
            </CardTitle>
          </CardHeader>

          <CardContent className='grid gap-4 md:gap-8 justify-items-stretch w-full md:items-center'>

            {
              timesheets.totalNumber > 0 && (
                <>
                  <Alert variant="destructive">
                    <AlertTitle><b>{t('account.delete_account.remaining_timesheets.title')}</b></AlertTitle>
                    <AlertDescription>
                      <span>
                        <Trans
                          i18nKey="account.delete_account.remaining_timesheets.description"
                          components={{
                            bold: <strong />
                          }}
                        />
                      </span>
                    </AlertDescription>
                  </Alert>

                  <Collapsible
                    open={isTimesheetListOpen}
                    onOpenChange={setIsTimesheetListOpen}
                  >
                    <CollapsibleTrigger className="inline-flex gap-2 hover:cursor-pointer">
                      <ChevronsUpDown />
                      <b>{
                        isTimesheetListOpen
                          ? t('account.delete_account.remaining_timesheets.list_title_collapse')
                          : t('account.delete_account.remaining_timesheets.list_title_expand')
                      }</b>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="pl-8">
                      <p className="pb-4">{t('account.delete_account.remaining_timesheets.list_remaining_number', {
                        count: timesheets.totalNumber,
                        number: timesheets.totalNumber
                      })}</p>
                      {
                        timesheets.timesheets.map((timesheet, i) => {
                          if (i > 3) {
                            return null;
                          }
                          return (
                            <Link key={timesheet.slug} href={timesheet.slug}>
                              <Button variant="outline">
                                {timesheet.name}
                              </Button>
                            </Link>
                          )
                        })
                      }
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )
            }

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={timesheets.totalNumber > 0}
                >
                  {t('account.delete_account.dialog.label')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('account.delete_account.dialog.title')}</DialogTitle>
                  <DialogDescription>
                    {t('account.delete_account.dialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={() => {
                    deleteUser({
                      userId: user.id,
                    })
                  }}>
                    {
                      deletionStatus === 'success'
                        ? t('account.delete_account.dialog.redirecting')
                        : deletionStatus === 'pending'
                          ? t('account.delete_account.dialog.loading')
                          : t('account.delete_account.dialog.confirm')
                    }

                  </Button>
                  <DialogClose asChild className="flex-start">
                    <Button variant="outline" ref={closeButton}>
                      {t('account.delete_account.dialog.cancel')}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </CardContent>

        </Card>
      </section>
    </>
  );
}
