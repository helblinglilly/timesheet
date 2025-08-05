"use client"
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import React from "react";

export default function WorkdayLog({
  id,
  day
}: {
  id: string;
  day: string;
}){

  const { t } = useTranslation();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });

  if (!timesheet.clockIn){
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold">{ t('timesheet.today.log.title') }</h3>
      <p>{format(new Date(timesheet.clockIn), 'HH:mm')} { t('timesheet.today.actions.clock_in.cta') }</p>

      {
        timesheet.breaks?.map((breakEntry) => {
          return (
            <React.Fragment key={breakEntry.breakEntryId}>
              <p>{format(new Date(breakEntry.breakIn), 'HH:mm')} { t('timesheet.today.actions.break_in.cta') }</p>

              {
                breakEntry.breakOut && (
                  <p>{format(new Date(breakEntry.breakOut), 'HH:mm')} { t('timesheet.today.actions.break_out.cta') }</p>
                )
              }
            </React.Fragment>
          )
        })
      }
      {
        timesheet.clockOut && (
          <p>{format(new Date(timesheet.clockOut), 'HH:mm')} { t('timesheet.today.actions.clock_out.cta') }</p>
        )
      }


    </div>
  )
}
