'use client';
import { format, formatDuration } from 'date-fns';
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useTick } from '~/hooks/useTick';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { api } from '~/trpc/react';
import { workDurationInDay } from '~/lib/workday';
import { TargetHours } from './TargetHours';
import { addDurations } from '~/utils/date';


export const HoursWorked = ({
  from,
  to,
  showNoDataText = false
} : {
  from: Date,
  to: Date
  showNoDataText?: boolean
}) => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();
  const { tick } = useTick();


  const [timesheets] = api.timesheet.getAllRecordsBetweenDates.useSuspenseQuery({
    timesheetConfigId: config.id,
    startDate: format(from, 'yyy-LL-dd'),
    endDate: format(to, 'yyy-LL-dd'),
  });

  const duration = useMemo(() => {

    const durations = timesheets.map(timesheet => workDurationInDay(timesheet));

    return addDurations(...durations);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheets, tick]); // Tick will retrigger

  if (timesheets.length === 0 && showNoDataText) {
    return <p>{t('timesheet.[id].weekly.log.no_data')}</p>;
  }
  if (timesheets.length === 0 && !showNoDataText) {
    return null;
  }

  const hasTargetHours = !(config.minutesPerDay === 0 && config.daysPerWeek === 0);

  return (
    <>
      <p>
        {
          formatDuration(duration, { format: ['hours', 'minutes']})
        }
      </p>
      {
        hasTargetHours && (
          <TargetHours numberOfDays={timesheets.length} duration={duration} />
        )
      }
    </>
  );
}
