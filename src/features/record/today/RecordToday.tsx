"use client"

import { Button } from '@/components/ui/button';
import React, { use } from 'react'
import { breakIn, clockIn, clockOut, getTodaysEntries } from './server/actions';

export const RecordToday = (
  { getTodaysEntriesPromise } : { getTodaysEntriesPromise: ReturnType<typeof getTodaysEntries>}
) => {
  const entry = use(getTodaysEntriesPromise);

  return (
    <div className="grid gap-4">
      <div className="grid md:flex gap-4">
        <Button
          disabled={ !!entry.clockOut }
          onClick={async () => {
            await clockIn(
              entry.timesheetId,
            );
        }}>Clock In</Button>

        <Button disabled={ !!entry.clockOut} onClick={async () => {
          await breakIn(
            entry.id ?? '',
          )
        }}>Break in</Button>
        <Button disabled={ !!entry.clockOut}>Break out</Button>
        <Button disabled={ !!entry.clockOut } onClick={async () => {
          await clockOut(entry.timesheetId);
        }}>Clock Out</Button>
      </div>

      <div className="grid gap-4">
        <h2 className="text-2xl">Entries:</h2>
        {
          entry.clockIn && (
          <p suppressHydrationWarning={true}>Clock In:</p>
          )
        }
      </div>
    </div>
  );
}
