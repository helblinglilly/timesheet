import type Client from "pocketbase";
import { type TimesheetBreaks, type TimesheetEntry } from "~/pocketbase/data.types";
import { TableNames } from "~/pocketbase/tables.types";

export async function getHoursWorked(pb: Client, timesheetConfigId: string, from: Date, to: Date){
  const timesheetEntries = await pb.collection<TimesheetEntry>(TableNames.TimesheetEntry).getFullList({
    filter: `config.id = "${timesheetConfigId}" && clockIn>="${from.toISOString().split('T')[0]}" && clockIn<="${to.toISOString().split('T')[0]}"`
  })

  const inOutIds = timesheetEntries.map((record) => record.id);

  if (inOutIds.length === 0){
    return [];
  }

  const timesheetBreaks = await pb.collection<TimesheetBreaks & { timesheet_entry: string }>(TableNames.TimesheetBreaks).getFullList({
    filter: `timesheet_entry.config.id = "${timesheetConfigId}" && (${inOutIds.map((id) => {
      return `timesheet_entry.id = "${id}"`;
    }).join(' || ')})`,
    expand: 'timesheet_entry.id'
  })

  const breakMap: Record<typeof timesheetEntries[number]['id'], Pick<TimesheetBreaks, 'breakIn' | 'breakOut'>[]> = {};

  timesheetBreaks.forEach((entry) => {
    breakMap[entry.timesheet_entry] ??= [];

    breakMap[entry.timesheet_entry] = (breakMap[entry.timesheet_entry] ?? []).concat({
      breakIn: entry.breakIn,
      breakOut: entry.breakOut
    })
  })



  return timesheetEntries.map((entry) => ({
    id: entry.id,
    clockIn: entry.clockIn,
    clockOut: entry.clockOut,
    breaks: breakMap[entry.id]
  }));
}
