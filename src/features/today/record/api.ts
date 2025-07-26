"use server";

import { serverSideAuth } from "@/utils/pb/server";
import { TimesheetBreaks, TimesheetEntry } from "@/utils/pb/types";
import { ListResult } from "pocketbase";
import { getTodaysEntries } from "../api";


export async function clockIn(timesheetId: string){
  const pb = await serverSideAuth();

  const existingEntry = await getTodaysEntries(timesheetId);

  if (existingEntry.clockIn){
    throw new Error("Failed to record clockIn - an entry with this date already exists");
  }

  await pb.collection("timesheet_entries").create({
    user: pb.authStore?.record?.id,
    config: timesheetId,
    clockIn: new Date().toISOString(),
  } as Partial<TimesheetEntry>);
}

export async function breakIn(inOutRecordId: string){
  const pb = await serverSideAuth();

  const breaks: ListResult<TimesheetBreaks> = await pb.collection("timesheet_breaks").getList(1, 20, {
    filter: `timesheet_entry.id = "${inOutRecordId}"`,
  });

  if (breaks.items.some((breakEntry) => {
    return !breakEntry?.breakOut;
  })){
    throw new Error("Failed to record breakIn - there exists an entry without a break out");
  }

  await pb.collection("timesheet_breaks").create({
    user: pb.authStore?.record?.id,
    timesheet_entry: inOutRecordId,
    breakIn: new Date().toISOString(),
  } as Partial<TimesheetBreaks>);
}

export async function breakOut(breakRecordId: string){
  const pb = await serverSideAuth();

  const existingEntry: TimesheetBreaks = await pb.collection("timesheet_breaks").getOne(breakRecordId);

  if (!existingEntry.breakIn){
    throw new Error("Failed to record breakOut - the existing entry does not contain a break in");
  }

  if (existingEntry.breakOut){
    throw new Error("Failed to record breakOut - the existing entry already contains a break out");
  }

  await pb.collection("timesheet_breaks").update(breakRecordId, {
    breakOut: new Date().toISOString(),
  } as Partial<TimesheetBreaks>);
}

export async function clockOut(timesheetId: string){
  const pb = await serverSideAuth();
  const todaysEntries = await getTodaysEntries(timesheetId);

  if (!todaysEntries.clockIn || !todaysEntries.id){
    throw new Error("Failed to record clockOut - no clock in entry seems to exist");
  }

  await pb.collection("timesheet_entries").update(todaysEntries.id, {
    clockOut: new Date().toISOString(),
  } as Partial<TimesheetEntry>);
}
