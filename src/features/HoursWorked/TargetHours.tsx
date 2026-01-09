'use client';

import { formatDuration, type Duration } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { subtractDurations } from '~/utils/date';

export const TargetHours = ({
  numberOfDays,
  duration,
}: {
  numberOfDays: number;
  duration: Duration;
}) => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();

  const targetMinutes: Duration = {
    hours: Math.floor((config.minutesPerDay * numberOfDays) / 60),
    minutes: (config.minutesPerDay * numberOfDays) % 60,
  };

  const { isPositive, duration: difference } = subtractDurations(duration, targetMinutes);

  const hasTargetHours = !(config.minutesPerDay === 0 && config.daysPerWeek === 0);
  if (!hasTargetHours){
    // eslint-disable-next-line no-console
    console.warn('<TargetHours /> was attempted to render for a Timesheet that does not have target hours. You should try to guard against this at a higher level than this.')
    return null;
  }


  return (
    <p>
      { isPositive
        ? t('timesheet.[id].weekly.log.summary.over')
        : t('timesheet.[id].weekly.log.summary.under')
      }
      {' '}

      {formatDuration(difference, { format: ['hours', 'minutes'] })}
    </p>
  );
};
