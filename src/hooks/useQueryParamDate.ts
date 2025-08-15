"use client"

import { eachDayOfInterval, startOfWeek, endOfWeek, addDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useQueryParamDate() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  let date: Date;
  if (dateParam) {
    // Expecting format 'yyyy-LL-dd'
    const [year, month, day] = dateParam.split("-");
    date = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } else {
    date = new Date();
  }

  const daysInWeek = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(date, { weekStartsOn: 1 }),
      end: endOfWeek(date, { weekStartsOn: 1 })
    }).slice(0, 5)
  }, [date])

  const startOfLastWeek = useMemo(() => {
    return startOfWeek(
      addDays(daysInWeek[0]!, -3),
      {
        weekStartsOn: 1
      }
    )
  }, [daysInWeek])

  const startOfNextWeek = useMemo(() => {
    return startOfWeek(
      addDays(daysInWeek[daysInWeek.length - 1]!, 3),
      {
        weekStartsOn: 1
      }
    )
  }, [daysInWeek])

  return {
    date: date,
    daysInWeek,
    startOfLastWeek,
    startOfNextWeek
  };
}
