"use client"

import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";

export default function ClockInButton({
  timesheetId,
  day,
  className
}: {
  timesheetId: string;
  day: string;
} & Pick<React.ComponentProps<"button">, 'className'>){
  const { t } = useTranslation();
  const apiUtils = api.useUtils();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id: timesheetId,
    day,
  });

  const clockInMutation = api.timesheet.clockIn.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({id: timesheetId, day})
    }
  });

  const disabled = !!timesheet.clockIn
  const disabledReason: string | null = !!timesheet.clockIn ? t('timesheet.today.actions.clock_in.disabled') : null

  const BaseButton = (
    { baseClassName }: { baseClassName: string | undefined }
  ) => (
    <Button
      className={baseClassName}
      disabled={disabled}
      onClick={() => {
        clockInMutation.mutate({
          id: timesheetId,
          day: day
        });
      }}
    >
      { t('timesheet.today.actions.clock_in.cta')}
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
