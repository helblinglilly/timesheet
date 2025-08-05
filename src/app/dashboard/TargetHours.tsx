"use client"

import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import React from "react";
import { addMinutes, formatDuration, intervalToDuration } from "date-fns";

export default function TargetHours({
  id,
  day
}: {
  id: string;
  day: string;
}) {
  const { t } = useTranslation();

  const [minutesPerDay] = api.timesheet.getMinutesPerDay.useSuspenseQuery({
    id,
  });
  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });


  const start = new Date(0, 0, 0, 0, 0);
  const end = addMinutes(start, minutesPerDay);

  const duration = intervalToDuration({ start, end });
  const formatted = formatDuration(duration, { format: ['hours', 'minutes'] });


  if (!timesheet.clockIn){
    return null;
  }

  return (
    <div className="grid gap-2">
      <p className="font-bold text-end">{ t('timesheet.today.log.target') }</p>
      <p>{formatted}</p>
    </div>
  );

};
