"use client"

import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import { workDurationInDay } from "~/lib/workday";
import { formatDuration } from "date-fns";
import { useTimesheetDay } from "~/features/workday/useTimesheetDay";

export default function HoursWorked() {
  const { timesheetId: id, day } = useTimesheetDay();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });

  // @ts-expect-error Dealing with this later
  const [duration, setDuration] = useState(workDurationInDay(timesheet));

  useEffect(() => {
    if (timesheet.clockIn && !timesheet.clockOut){
      const interval = setInterval(() => {
        setDuration(workDurationInDay(timesheet));
      }, 60000);

      setDuration(workDurationInDay(timesheet));

      return () => clearInterval(interval);
    }
  }, [timesheet])

  if (!timesheet.clockIn){
    return null;
  }

  return (
    <>
      <p>{formatDuration(duration, { format: ['hours', 'minutes'] })}</p>
    </>
  );

};
