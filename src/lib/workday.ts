import { intervalToDuration } from 'date-fns';
import type { TimesheetBreaks } from '~/pocketbase/data.types';
import type { getTimesheetByDate } from '~/server/api/timesheet/id/today';

export function hasIncompleteBreakEntry(breaks: Pick<TimesheetBreaks, 'breakIn' | 'breakOut'>[]) {
  return breaks.findIndex(a => a.breakIn && !a.breakOut) === -1 ? false : true;
}

type Timesheet = Awaited<ReturnType<typeof getTimesheetByDate>>;

type TimesheetEntry = Pick<Timesheet, 'clockIn' | 'clockOut'>;
type TimesheetBreak = Pick<TimesheetBreaks, 'breakIn' | 'breakOut'>;

type MinimalTimesheet = TimesheetEntry & {
  breaks: TimesheetBreak[] | undefined;
};

export const workMillisecondsInDay = (
  timesheetEntry: MinimalTimesheet,
) => {
  const { clockIn, clockOut, breaks } = timesheetEntry;

  if (clockIn === undefined || clockIn === null) {
    return 0;
  }

  const intervals: { start: Date; end: Date }[] = [];
  let previousClockIn = new Date(clockIn);
  let isCurrentlyOnBreak = false;

  if (breaks && breaks.length > 0) {
    for (const entry of breaks) {
      const breakIn = new Date(entry.breakIn);
      intervals.push({ start: previousClockIn, end: breakIn });

      if (!entry.breakOut) {
        isCurrentlyOnBreak = true;
        break;
      }
      previousClockIn = new Date(entry.breakOut);
    }
  }

  if (!clockOut && !isCurrentlyOnBreak) {
    intervals.push({ start: previousClockIn, end: new Date() });
  }
  else if (clockOut) {
    intervals.push({ start: previousClockIn, end: new Date(clockOut) });
  }

  // Sum all intervals
  let totalMilliseconds = 0;
  for (const { start, end } of intervals) {
    totalMilliseconds += end.getTime() - start.getTime();
  }

  return totalMilliseconds;
};

export const workDurationInDay = (
  timesheetEntry: MinimalTimesheet,
) => {
  const milliseconds = workMillisecondsInDay(timesheetEntry);

  return intervalToDuration({
    start: new Date(0),
    end: new Date(milliseconds),
  });
};
