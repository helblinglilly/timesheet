"use client"

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ClockInButton from "~/components/ClockInActions/ClockInButton";
import { Button } from "~/components/ui/button";
import { hasIncompleteBreakEntry } from "~/lib/workday";
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

  const hasIncompleteBreak = useMemo(() => {
    if (timesheet?.breaks){
      return hasIncompleteBreakEntry(timesheet.breaks)
    }
    return false;
  }, [timesheet])



  const clockOutMutation = api.timesheet.clockOut.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id, day})
    }
  });

  const breakInMutation = api.timesheet.breakIn.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id, day})
    }
  });

  const breakOutMutation = api.timesheet.breakOut.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id, day})
    }
  });

  return (
    <div className="grid md:flex gap-4 w-full md:justify-between">

      <ClockInButton
        className="md:w-1/5"
        timesheetId={id}
        day={day}
      />


      <Button
        className="md:w-1/5"
        disabled={!timesheet?.clockIn || !!timesheet.clockOut || hasIncompleteBreak || !timesheet}
        onClick={() => {
          if (!timesheet.timesheet_entry_id){
            throw new Error('Tried to break in but was not aware for which entry');
          }

          breakInMutation.mutate({
            timesheetEntryId: timesheet.timesheet_entry_id
          });
        }}
      >{ t('timesheet.today.actions.break_in.cta')}</Button>

      <Button
        className="md:w-1/5"
        disabled={!timesheet?.clockIn || !!timesheet.clockOut || !hasIncompleteBreak || !timesheet}
        onClick={() => {
          const incompleteBreak = timesheet.breaks?.find((a) => !a.breakOut)?.breakEntryId;

          if (!incompleteBreak){
            throw new Error('Tried to break out but could not find an incomplete break entry')
          }

          breakOutMutation.mutate({
            breakEntryId: incompleteBreak
          });
        }}
      >{ t('timesheet.today.actions.break_out.cta')}</Button>

      <Button
        className="md:w-1/5"
        disabled={!timesheet?.clockIn || !!timesheet.clockOut}
        onClick={() => {
          if (!timesheet.timesheet_entry_id){
            throw new Error('Tried to clock out but was not aware for which entry');
          }

          clockOutMutation.mutate({
            timesheetEntryId: timesheet.timesheet_entry_id
          });
        }}
      >{ t('timesheet.today.actions.clock_out.cta')}</Button>
    </div>
  )
}
