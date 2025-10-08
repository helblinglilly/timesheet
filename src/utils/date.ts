import { eachDayOfInterval, startOfWeek, endOfWeek, intervalToDuration, type Duration } from 'date-fns';

export function weekDatesForDate(weekOf: Date) {
  const weekOptions = { weekStartsOn: 1 as const };

  const start = startOfWeek(weekOf, weekOptions);
  const end = endOfWeek(weekOf, weekOptions);

  return eachDayOfInterval({ start, end });
}

/**
 * Convert a date-fns duration object (no years/months) to milliseconds.
 * Supports: weeks, days, hours, minutes, seconds
 */

function durationToMilliseconds(d: Duration) {
  const {
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = d;

  return (
    weeks * 7 * 24 * 60 * 60 * 1000
    + days * 24 * 60 * 60 * 1000
    + hours * 60 * 60 * 1000
    + minutes * 60 * 1000
    + seconds * 1000
  );
}

export function subtractDurations(base: Duration, ...subs: Duration[]) {
  let ms = durationToMilliseconds(base);
  for (const s of subs) {
    ms -= durationToMilliseconds(s);
  }

  if (ms < 0) {
    return {
      isPositive: false,
      duration: intervalToDuration({ start: ms, end: 0 }),
    };
  }

  return {
    isPositive: true,
    duration: intervalToDuration({ start: 0, end: ms }),
  };
}

export function addDurations(...durations: Duration[]): Duration {
  let totalMs = 0;

  for (const duration of durations) {
    totalMs += durationToMilliseconds(duration);
  }

  return intervalToDuration({ start: 0, end: totalMs });
}
