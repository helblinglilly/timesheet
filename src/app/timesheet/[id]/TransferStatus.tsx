'use client'

import { AlertCircleIcon, CheckCircle2Icon, XIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export const TransferStatus = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter()
  const { t } = useTranslation()

  const transferStatusParam = searchParams.get('transfer_status');
  const dismissAction = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('transfer_status');
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [router, searchParams, pathname])

  if (!transferStatusParam) {
    return null;
  }

  if (transferStatusParam === 'success') {
    return (
      <Alert className="flex justify-between">
        <div className="flex gap-2">
          <CheckCircle2Icon />
          <div className="grid">
            <AlertTitle>{t('timesheet.[id].transfer.redemption.alert.success.title')}</AlertTitle>
            <AlertDescription>
              {
                t('timesheet.[id].transfer.redemption.alert.success.description')
              }
            </AlertDescription>
          </div>
        </div>
        <button className="hover:cursor-pointer" onClick={() => {
          dismissAction()
        }
        }>
          <XIcon />
          <span className='sr-only'>{ t('common.close') }</span>
        </button>
      </Alert>
    )
  }
  else if (transferStatusParam === 'already_owned') {
    return (
      <Alert className="flex justify-between" variant="destructive">
        <div className="flex gap-2">
          <AlertCircleIcon />
          <div className="grid">
            <AlertTitle>{t('timesheet.[id].transfer.redemption.alert.already_owned.title')}</AlertTitle>
            <AlertDescription>
              {
                t('timesheet.[id].transfer.redemption.alert.already_owned.description')
              }
            </AlertDescription>
          </div>
        </div>
        <button className="hover:cursor-pointer text-muted-foreground" onClick={() => {
          dismissAction()
        }
        }>
          <XIcon />
          <span className='sr-only'>{ t('common.close') }</span>
        </button>
      </Alert>
    )
  }
  return null;
}
