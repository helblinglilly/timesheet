'use client';

import { api } from '~/trpc/react';
import React, { useMemo } from 'react';
import { workDurationInDay } from '~/lib/workday';
import { formatDuration } from 'date-fns';
import { useTimesheetDay } from '~/features/workday/useTimesheetDay';
import { TargetHours } from '~/features/targetHours/TargetHours';
import { useTick } from '~/hooks/useTick';

export default function HoursWorked() {
  const { timesheetId: id, day } = useTimesheetDay();
  const { tick } = useTick();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });

  const duration = useMemo(() => {
    // @ts-expect-error Dealing with this later
    return workDurationInDay(timesheet);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheet, tick]);

  if (!timesheet.clockIn) {
    return null;
  }

  return (
    <>
      <p>{formatDuration(duration, { format: ['hours', 'minutes'] })}</p>
      <TargetHours numberOfDays={1} durationWorked={duration} />
    </>
  );
};
