"use server"

import { serverSideAuth } from "@/utils/pb/server";
import { TimesheetBreaks, TimesheetEntry } from "@/utils/pb/types";
import { ListResult } from "pocketbase";

export const getTodaysEntries = async (timesheetId: string) => {
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
    breaks: breaks.items.map((breakRecord) => breakRecord)
  };
};


export async function clockIn(timesheetId: string){
  const pb = await serverSideAuth();

  await pb.collection('timesheet_entries').create({
    user: pb.authStore?.record?.id,
    config: timesheetId,
    clockIn: new Date().toISOString()
  });
}

export async function breakIn(inOutRecordId: string){
  const pb = await serverSideAuth();

  await pb.collection('timesheet_breaks').create({
    user: pb.authStore?.record?.id,
    timesheet_entry: inOutRecordId,
    break_in: new Date().toISOString()
  })
}

export async function breakOut(breakRecordId: string){
  const pb = await serverSideAuth();

  const existingEntry: TimesheetBreaks = await pb.collection('timesheet_breaks').getOne(breakRecordId);

  if (!existingEntry.breakIn){
    throw new Error('Failed to record breakOut - the existing entry does not contain a break in');
  }

  if (existingEntry.breakOut){
    throw new Error('Failed to record breakOut - the existing entry already contains a break out');
  }

  await pb.collection('timesheet_breaks').update(breakRecordId, {
    break_out: new Date().toISOString()
  })
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
}
