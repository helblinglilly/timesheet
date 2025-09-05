'use client';

import { api } from '~/trpc/react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';
import { Button } from '~/components/ui/button';
import { useMemo } from 'react';
import { useTimesheetDay } from '../useTimesheetDay';
import { endOfWeek, format, startOfWeek } from 'date-fns';

export default function ClockInButton({
  className,
}: Pick<React.ComponentProps<'button'>, 'className'>) {
  const { t } = useTranslation();
  const apiUtils = api.useUtils();
  const { timesheetId, day } = useTimesheetDay();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id: timesheetId,
    day: format(new Date(day), 'yyy-LL-dd'),
  });

  const clockInMutation = api.timesheet.clockIn.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getTimesheetDayById.invalidate({
        id: timesheetId,
        day: format(new Date(day), 'yyy-LL-dd'),
      });

      await apiUtils.timesheet.getAllRecordsBetweenDates.invalidate({
        timesheetConfigId: timesheetId,
        startDate: format(startOfWeek(new Date(day), { weekStartsOn: 1 }), 'yyy-LL-dd'),
        endDate: format(endOfWeek(new Date(day), { weekStartsOn: 1 }), 'yyy-LL-dd'),
      });
    },
  });

  const disabledReason: string | null = useMemo(() => {
    if (!!timesheet.clockOut) {
      return t('timesheet.today.actions.clock_in.disabled_existing_clock_out');
    }

    if (!!timesheet.clockIn) {
      return t('timesheet.today.actions.clock_in.disabled_existing_clock_in');
    }
    return null;
  }, [timesheet, t]);
  const disabled = !!disabledReason;

  const BaseButton = (
    { baseClassName }: { baseClassName: string | undefined },
  ) => (
    <Button
      className={baseClassName}
      disabled={disabled}
      onClick={() => {
        clockInMutation.mutate({
          id: timesheetId,
          day: day,
        });
      }}
    >
      { t('timesheet.today.actions.clock_in.cta')}
    </Button>
  );

  if (disabled && disabledReason) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>
            <BaseButton baseClassName="w-full" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{disabledReason}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <BaseButton baseClassName={className} />
  );
}
