"use client"

import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { useMemo } from "react";
import { useTimesheetDay } from "../useTimesheetDay";


export default function ClockOutButton({
  className
}: Pick<React.ComponentProps<"button">, 'className'>){
  const { t } = useTranslation();
  const apiUtils = api.useUtils();
  const { timesheetId, day } = useTimesheetDay();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id: timesheetId,
    day,
  });

  const clockOutMutation = api.timesheet.clockOut.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id: timesheetId, day})
    }
  });

  const disabled = !timesheet.clockIn || !!timesheet.clockOut;

  const disabledReason: string | null = useMemo(() => {
    if (!timesheet.clockIn){
      return t('timesheet.today.actions.clock_out.disabled_no_clock_in');
    }
    if (!!timesheet.clockOut){
      return t('timesheet.today.actions.clock_out.disabled_existing_clock_out');
    }
    return null
  }, [timesheet, t])

  const BaseButton = (
    { baseClassName }: { baseClassName: string | undefined }
  ) => (
    <Button
      className={baseClassName}
      disabled={disabled}
      onClick={() => {
        if (!timesheet.timesheet_entry_id){
          throw new Error(`Tried to clock out but was not aware for which entry`)
        }
        clockOutMutation.mutate({
          timesheetEntryId: timesheet.timesheet_entry_id
        });
      }}
    >
      { t('timesheet.today.actions.clock_out.cta')}
    </Button>
  )

  if (disabled && disabledReason){
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>
            <BaseButton baseClassName="w-full"/>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{disabledReason}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <BaseButton baseClassName={className} />
  )
}
