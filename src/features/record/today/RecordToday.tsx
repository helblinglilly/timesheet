"use client";

import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { useBreakIn, useBreakOut, useClockIn, useClockOut, useGetTodaysTimesheet } from "./hooks";

export const RecordToday = (
  { timesheetId }: { timesheetId: string },
) => {
  const { data, isLoading, error: _error } = useGetTodaysTimesheet(timesheetId);
  const { mutate: clockIn } = useClockIn();
  const { mutate: breakIn } = useBreakIn();
  const { mutate: breakOut } = useBreakOut();
  const { mutate: clockOut } = useClockOut();

  if (isLoading || !data){
    return <p>Loading</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid md:flex gap-4">
        <Button
          disabled={ !!data?.clockOut }
          onClick={() => {
            clockIn(timesheetId);
          }}
        >Clock In</Button>

        <Button
          disabled={ !!data?.clockOut }
          onClick={() => {
            breakIn(data?.id ?? "");
          }}
        >Break in</Button>
        <Button
          disabled={ !!data?.clockOut }
          onClick={() => {
            const id = (data.breaks ?? []).filter(a => {
              return !a.breakOut;
            });

            breakOut({
              inOutRecordId: id[0].id,
              timesheetId: data?.id ?? "",
            });
          }}
        >Break out</Button>
        <Button
          disabled={ !!data?.clockOut }
          onClick={() => {
            clockOut(data.timesheetId);
          }}
        >Clock Out</Button>
      </div>

      <div className="grid gap-4">
        <h2 className="text-2xl">Entries:</h2>
        <p>Clock In: {data.clockIn}</p>
        {
          (data.breaks ?? []).map((breakEntry) => {
            return (
              <Fragment key={breakEntry.id}>
                <p>Break In: {breakEntry.breakIn}</p>
                <p>Break Out: {breakEntry.breakOut}</p>
              </Fragment>
            );
          })
        }
        <p>Clock Out: {data.clockOut}</p>


      </div>
    </div>
  );
};
