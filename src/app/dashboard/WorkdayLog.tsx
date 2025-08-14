"use client"
import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import React from "react";
import { useTimesheetDay } from "./TimesheetDayProvider";
import { TimeRecord } from "~/features/WorkdayLog/TimeRecord";

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

  if (!timesheet.clockIn && noDataText){
    if (noDataText){
      return (
        <div className="grid min-h-16">
          <p><i>{noDataText}</i></p>
        </div>
      )
    }

  }

  return (
    <div className="grid min-h-16">
      <TimeRecord dateString={timesheet.clockIn} copy={t('timesheet.today.actions.clock_in.cta')} />

      {
        timesheet.breaks?.map((breakEntry) => {
          return (
            <div key={breakEntry.breakEntryId} className="grid py-2">
              <TimeRecord dateString={breakEntry.breakIn} copy={t('timesheet.today.actions.break_in.cta')} />

              {
                breakEntry.breakOut && (
                  <TimeRecord dateString={breakEntry.breakOut} copy={t('timesheet.today.actions.break_out.cta')} />
                )
              }
            </div>
          )
        })
      }
      {
        timesheet.clockOut && (
          <TimeRecord dateString={timesheet.clockOut} copy={t('timesheet.today.actions.clock_out.cta')} />
        )
      }


    </div>
  )
}
