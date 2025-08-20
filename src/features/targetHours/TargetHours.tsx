"use client";

import { formatDuration, type Duration } from 'date-fns';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { subtractDurations } from '~/utils/date';

export const TargetHours = ({
  numberOfDays,
  durationWorked
} : {
  numberOfDays: number;
  durationWorked: Duration;
}) => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();

  const targetMinutes: Duration = {
    hours: Math.floor((config.minutesPerDay * numberOfDays) / 60),
    minutes: (config.minutesPerDay * numberOfDays) % 60,
  }


  const { isPositive, duration: difference} = subtractDurations(durationWorked, targetMinutes)


  return (
    <p> { isPositive ?
      t('timesheet.[id].weekly.log.summary.over') :
      t('timesheet.[id].weekly.log.summary.under')
    } {formatDuration(difference, { format: ['hours', 'minutes'] })}</p>
  );
}
