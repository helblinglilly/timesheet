import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { getTodaysEntries } from "../api";
import { useBreakIn, useBreakOut, useClockIn, useClockOut } from "./hooks";

export const RecordToday = (
  {
    id,
    timesheetId,
    clockIn,
    clockOut,
    breaks,
  } : Awaited<ReturnType<typeof getTodaysEntries>>,
) => {
  const { mutate: recordClockIn } = useClockIn();
  const { mutate: recordBreakIn } = useBreakIn();
  const { mutate: recordBreakOut } = useBreakOut();
  const { mutate: recordClockOut } = useClockOut();



  return (
    <div className="grid gap-4">
      <div className="grid md:flex gap-4">
        <Button
          disabled={ !!clockOut }
          onClick={() => {
            recordClockIn(timesheetId);
          }}
        >Clock In</Button>

        <Button
          disabled={ !!clockOut }
          onClick={() => {
            recordBreakIn(id ?? "");
          }}
        >Break in</Button>
        <Button
          disabled={ !!clockOut }
          onClick={() => {
            const inOutRecordId = (breaks ?? []).filter(a => {
              return !a.breakOut;
            });

            recordBreakOut({
              inOutRecordId: inOutRecordId[0].id,
              timesheetId: id ?? "",
            });
          }}
        >Break out</Button>
        <Button
          disabled={ !!clockOut }
          onClick={() => {
            recordClockOut(timesheetId);
          }}
        >Clock Out</Button>
      </div>

      <div className="grid gap-4">
        <h2 className="text-2xl">Entries:</h2>
        <p>Clock In: {clockIn}</p>
        {
          (breaks ?? []).map((breakEntry) => {
            return (
              <Fragment key={breakEntry.id}>
                <p>Break In: {breakEntry.breakIn}</p>
                <p>Break Out: {breakEntry.breakOut}</p>
              </Fragment>
            );
          })
        }
        <p>Clock Out: {clockOut}</p>
      </div>
    </div>
  );
};
