"use client"

import { endOfWeek, format, startOfWeek} from 'date-fns';
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useQueryParamDate } from '~/hooks/useQueryParamDate';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { workDurationInDay } from '~/lib/workday';
import { api } from '~/trpc/react';
import { TargetHours } from '../targetHours/TargetHours';
import { useTick } from '~/hooks/useTick';

export const WeekHoursWorked = () => {
  const { config } = useTimesheetConfig();
  const { date } = useQueryParamDate();
  const { t } = useTranslation();
  const { tick } = useTick();

  const [timesheets] = api.timesheet.getAllRecordsBetweenDates.useSuspenseQuery({
    timesheetConfigId: config.id,
    startDate: format(startOfWeek(date, { weekStartsOn: 1}), 'yyy-LL-dd'),
    endDate: format(endOfWeek(date, { weekStartsOn: 1}), 'yyy-LL-dd')
  })

  const duration = useMemo(() => {
    // @ts-expect-error Dealing with this later
    const durations = timesheets.map((timesheet) => workDurationInDay(timesheet))

    return durations.reduce(
      (acc, current) => {
        return {
          years: (acc.years ?? 0) + (current.years ?? 0),
          months: (acc.months ?? 0) + (current.months ?? 0),
          weeks: (acc.weeks ?? 0) + (current.weeks ?? 0),
          days: (acc.days ?? 0) + (current.days ?? 0),
          hours: (acc.hours ?? 0) + (current.hours ?? 0),
          minutes: (acc.minutes ?? 0) + (current.minutes ?? 0),
          seconds: (acc.seconds ?? 0) + (current.seconds ?? 0)
        };
      },
      {
        hours: 0,
        minutes: 0,
      }
    );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheets, tick]) // Tick will retrigger



  if (timesheets.length === 0){
    return <p>{t('timesheet.[id].weekly.log.no_data')}</p>
  }

  return (
    <TargetHours numberOfDays={timesheets.length} durationWorked={duration} />
  );
}
