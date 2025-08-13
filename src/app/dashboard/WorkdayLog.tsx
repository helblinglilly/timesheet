"use client"
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import React from "react";
import { useTimesheetDay } from "./TimesheetDayProvider";

export default function WorkdayLog({
  noDataText
}: {
  noDataText?: string | null
}){
  const { t } = useTranslation();
  const { timesheetId: id, day } = useTimesheetDay();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });

  if (!timesheet.clockIn){
    if (noDataText){
      return <p>{noDataText}</p>
    }
    return null;
  }

  return (
    <div className="grid">
      <div className="inline-flex gap-2">
        <p className="w-12 font-mono text-center">{format(new Date(timesheet.clockIn), 'HH:mm')}</p>
        <p>{ t('timesheet.today.actions.clock_in.cta') }</p>
      </div>

      {
        timesheet.breaks?.map((breakEntry) => {
          return (
            <div key={breakEntry.breakEntryId} className="grid py-2">
              <div className="inline-flex gap-2">

                <p className="w-12 font-mono text-center">{format(new Date(breakEntry.breakIn), 'HH:mm')}</p>
                <p>{ t('timesheet.today.actions.break_in.cta') }</p>
              </div>

              {
                breakEntry.breakOut && (
                  <div className="inline-flex gap-2">
                    <p className="w-12 font-mono text-center">{format(new Date(breakEntry.breakOut), 'HH:mm')}</p>
                    <p>{ t('timesheet.today.actions.break_out.cta') }</p>
                  </div>
                )
              }
            </div>
          )
        })
      }
      {
        timesheet.clockOut && (
          <div className="inline-flex gap-2">
            <p className="w-12 font-mono text-center">{format(new Date(timesheet.clockOut), 'HH:mm')}</p>
            <p>{ t('timesheet.today.actions.clock_out.cta') }</p>
          </div>
        )
      }


    </div>
  )
}
