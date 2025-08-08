"use client"

import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { useMemo } from "react";
import { hasIncompleteBreakEntry } from "~/lib/workday";
import { useTimesheetDay } from "~/app/dashboard/TimesheetDayProvider";

export default function BreakOutButton({
  className
}: Pick<React.ComponentProps<"button">, 'className'>){
  const { t } = useTranslation();
  const apiUtils = api.useUtils();
  const { timesheetId, day } = useTimesheetDay();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id: timesheetId,
    day,
  });

  const breakOutMutation = api.timesheet.breakOut.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id: timesheetId, day})
    }
  });


  const disabledReason: string | null = useMemo(() => {
    const hasIncompleteBreak = timesheet?.breaks ? hasIncompleteBreakEntry(timesheet.breaks) : false;

    if (!timesheet.clockIn){
      return t('timesheet.today.actions.break_out.disabled_no_clock_in');
    }

    if (!!timesheet.clockOut){
      return t('timesheet.today.actions.break_out.disabled_existing_clock_out');
    }

    if (!hasIncompleteBreak){
      return t('timesheet.today.actions.break_out.disabled_not_on_break')
    }

    return null;
  }, [timesheet, t])
  const disabled = !!disabledReason;

  const BaseButton = (
    { baseClassName }: { baseClassName: string | undefined }
  ) => (
    <Button
      className={baseClassName}
      disabled={disabled}
      onClick={() => {
        const incompleteBreak = timesheet.breaks?.find((a) => !a.breakOut)?.breakEntryId;

        if (!incompleteBreak){
          throw new Error('Tried to break out but could not find an incomplete break entry')
        }

        breakOutMutation.mutate({
          breakEntryId: incompleteBreak
        });
      }}
    >
      { t('timesheet.today.actions.break_out.cta')}
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
