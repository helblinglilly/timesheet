"use client"

import React, { Fragment } from 'react'
import { Button } from '@/components/ui/button';
import { useBreakIn, useBreakOut, useClockIn, useGetTodaysTimesheet } from './hooks';

export const RecordToday = (
  { timesheetId }: { timesheetId: string }
) => {
  const { data, isLoading, error } = useGetTodaysTimesheet(timesheetId);
  const { mutate: clockIn } = useClockIn();
  const { mutate: breakIn } = useBreakIn();
  const { mutate: breakOut } = useBreakOut();



  if (isLoading || !data){
    return <p>Loading</p>
  }

  return (
    <div className="grid gap-4">
      <div className="grid md:flex gap-4">
        <p>{data?.timesheetId}</p>


        <Button
          disabled={ !!data?.clockOut }
          onClick={() => {
            clockIn(timesheetId);
          }}
          >Clock In</Button>

        <Button
          disabled={ !!data?.clockOut }
          onClick={async () => {
            breakIn(data?.id ?? '')
          }}
        >Break in</Button>
        <Button
          disabled={ !!data?.clockOut }
        >Break out</Button>
        <Button disabled={ !!data?.clockOut }>Clock Out</Button>
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
            )
          })
        }
        <p>Clock Out: {data.clockOut}</p>


      </div>
    </div>
  );
}
