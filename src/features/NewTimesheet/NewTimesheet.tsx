'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import NewTargetHoursTimesheet from './forms/targetHours/form';

export const NewTimesheet = () => {

  const [mode, setMode] = useState('');
  const { t } = useTranslation();

  return (
    <>
      <div className="">
        <Button
          type="button"
          selected={mode === 'no_target'}
          onClick={() => {
            setMode('no_target')
          }}
          variant='outline'
        >
          <div className="text-left">
            <p>
              {t('timesheet.new.fields.mode.no_target.title')}
            </p>
            <p className="">
              {t('timesheet.new.fields.mode.no_target.description')}
            </p>
          </div>
        </Button>

        <Button
          type="button"
          selected={mode === 'target'}
          onClick={() => {
            setMode('target')
          }}
          variant='outline'
        >
          <div className="text-left">
            <p>
              {t('timesheet.new.fields.mode.target.title')}
            </p>
            <p className="">
              {t('timesheet.new.fields.mode.target.description')}
            </p>
          </div>
        </Button>

      </div>

      {
        mode === 'target' && (
          <NewTargetHoursTimesheet />
        )
      }
    </>
  );
}
