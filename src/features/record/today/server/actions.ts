"use server"

import { serverSideAuth } from "@/utils/pb/server"
import { TimesheetBreaks, TimesheetEntry } from "@/utils/pb/types";
import { revalidatePath } from "next/cache";
import { ListResult } from "pocketbase";
import { cache } from "react";

export const getTodaysEntries = cache(async (timesheetId: string) => {
  const pb = await serverSideAuth();

  const inOutRecord: ListResult<TimesheetEntry> = await pb.collection("timesheet_entries").getList(1, 1, {
      filter: `config.id = "${timesheetId}"`,
      sort: '-clockIn',
  });


  const firstEntry = inOutRecord.items[0];
  if (!firstEntry){
    return {
      timesheetId: timesheetId,
    };
  }

  const breaks: ListResult<TimesheetBreaks> = await pb.collection('timesheet_breaks').getList(1, 20, {
    filter: `timesheet_entry.id = "${firstEntry.id}"`
  })

  return {
    timesheetId: timesheetId,
    id: firstEntry.id,
    clockIn: firstEntry.clockIn,
    clockOut: firstEntry.clockOut,
    breaks: breaks
  };
});


export async function clockIn(timesheetId: string){
  const pb = await serverSideAuth();

  await pb.collection('timesheet_entries').create({
    user: pb.authStore?.record?.id,
    config: timesheetId,
    clockIn: new Date().toISOString()
  });

  revalidatePath('/dashboard')
}

export async function breakIn(inOutRecordId: string){
  const pb = await serverSideAuth();

  await pb.collection('timesheet_breaks').create({
    user: pb.authStore?.record?.id,
    timesheet_entry: inOutRecordId,
    break_in: new Date().toISOString()
  })

  revalidatePath('/dashboard')
}

export async function clockOut(timesheetId: string){
  const pb = await serverSideAuth();
  const todaysEntries = await getTodaysEntries(timesheetId);

  if (!todaysEntries.clockIn || !todaysEntries.id){
    throw new Error(`Tried to clock out but no clock in entry seems to exist`);
  }

  await pb.collection('timesheet_entries').update(todaysEntries.id, {
    clockOut: new Date().toISOString()
  })

  revalidatePath('/dashboard');
}
