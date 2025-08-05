"use client"

import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { workDurationInDay } from "~/lib/workday";
import { formatDuration } from "date-fns";

export default function HoursWorked({
  id,
  day
}: {
  id: string;
  day: string;
}) {
  const { t } = useTranslation();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });

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
    <div className="grid gap-2">
      <p className="font-bold">{ t('timesheet.today.log.total') }</p>
      <p >{formatDuration(duration, { format: ['hours', 'minutes'] })}</p>
    </div>
  );

};
