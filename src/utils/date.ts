import { eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";

export function weekDatesForDate(weekOf: Date){
  const weekOptions = { weekStartsOn: 1 as const };

  const start = startOfWeek(weekOf, weekOptions);
  const end = endOfWeek(weekOf, weekOptions);

  return eachDayOfInterval({ start, end})
}
