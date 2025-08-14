"use client"

import { useSearchParams } from "next/navigation";
import { WeekLog } from "./WeekLog";

export default function WeekLogWrapper() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  let date: Date;
  if (dateParam) {
    // Expecting format 'yyy-LL-dd'
    const [year, month, day] = dateParam.split("-");
    date = new Date(Number(year), Number(month) - 1, Number(day));
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } else {
    date = new Date();
  }

  return <WeekLog date={date} />;
}
