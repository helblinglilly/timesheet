"use client"

import { format } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function TimesheetDay({
  id,
  day
}: {
  id: string
  day: string
}){
  const { t } = useTranslation();
  const apiUtils = api.useUtils();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id,
    day,
  });


  const clockInMutation = api.timesheet.clockIn.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id, day})
    }
  });

  return (
    <div className="grid gap-4">
      <div>
        <Button
          onClick={() => {
            clockInMutation.mutate({
              id: id,
              day: day
            });
          }}
        >{ t('timesheet.today.actions.clock_in.cta')}</Button>
      </div>


      <div>
        <h3 className="text-lg font-semibold">{ t('timesheet.today.log.title') }</h3>

        {
          timesheet?.clockIn && (
            <p>{format(new Date(timesheet.clockIn), 'HH:mm')} { t('timesheet.today.actions.clock_in.cta') }</p>
          )
        }
        {
          timesheet?.breaks?.map((breakEntry) => {
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
          timesheet?.clockOut && (
            <p>{format(new Date(timesheet.clockOut), 'HH:mm')} { t('timesheet.today.actions.clock_out.cta') }</p>
          )
        }

      </div>
    </div>
  )
}
