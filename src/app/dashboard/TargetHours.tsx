"use client"

import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import { addMilliseconds, addMinutes, formatDuration, intervalToDuration, isBefore } from "date-fns";
import { useTranslation } from "react-i18next";
import { workMillisecondsInDay } from "~/lib/workday";
import { useTimesheetDay } from "~/features/workday/useTimesheetDay";

export default function TargetHours() {
  const { t } = useTranslation();
  const { timesheetId: id, day } = useTimesheetDay();

  const [minutesPerDay] = api.timesheet.getMinutesPerDay.useSuspenseQuery({
    id,
  });
  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });
  // @ts-expect-error Dealing with this later
  const [workedMilliseconds, setWorkedMilliseconds] = useState(workMillisecondsInDay(timesheet));


  const targetDuration = intervalToDuration({
    start: new Date(0),
    end: addMinutes(new Date(0), minutesPerDay)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // @ts-expect-error Dealing with this later
      setWorkedMilliseconds(workMillisecondsInDay(timesheet));
    }, 60000);

    // @ts-expect-error Dealing with this later
    setWorkedMilliseconds(workMillisecondsInDay(timesheet));
    return () => clearInterval(interval);
  }, [timesheet])


  const targetDate = addMinutes(new Date(0), minutesPerDay);
  const workedDate = addMilliseconds(new Date(0), workedMilliseconds);

  const isOvertime = isBefore(targetDate, workedDate);

  const difference = intervalToDuration({
    start: isOvertime ? targetDate : workedDate,
    end: isOvertime ? workedDate : targetDate
  })


  if (!timesheet.clockIn){
    return null;
  }

  return (
    <>
      <div className="flex gap-2 justify-between">
        <b>{ t('timesheet.today.log.target') }</b>
        <p> {formatDuration(targetDuration, { format: ['hours', 'minutes'] })}</p>
      </div>

      <div className="flex gap-2 justify-between">
        <b>{ isOvertime ? t('timesheet.today.log.overtime') : t('timesheet.today.log.to_go') }</b>
        <p>{formatDuration(difference, { format: ['hours', 'minutes'] })}</p>
      </div>
    </>
  );

};
