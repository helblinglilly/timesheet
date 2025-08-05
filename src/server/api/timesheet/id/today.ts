import type { ListResult } from "pocketbase";
import type Client from "pocketbase";
import type { TimesheetEntry, TimesheetBreaks } from "~/pocketbase/data.types";

export async function getTimesheetByDate(pb: Client, id: string, date: Date){
  const inOutRecord: ListResult<TimesheetEntry> = await pb.collection("timesheet_entries").getList(1, 1, {
    filter: `config.id = "${id}"`,
    sort: "-clockIn",
  });

  const firstEntry = inOutRecord.items[0];
  if (!firstEntry){
    return {
      timesheetId: id,
    };
  }

  const breaks: ListResult<TimesheetBreaks> = await pb.collection("timesheet_breaks").getList(1, 20, {
    filter: `timesheet_entry.id = "${firstEntry.id}"`,
  });

  const currentDay = date.toISOString().split("T")[0];

  const allDates = [
    firstEntry.clockIn?.split(" ")[0],
    ...breaks.items.flatMap(a => {
      return a.breakIn ? [a.breakIn.split(" ")[0]] : [];
    }),
    ...breaks.items.flatMap(a => {
      return a.breakOut ? [a.breakOut.split(" ")[0]] : [];
    }),
    firstEntry.clockOut?.split(" ")[0],
  ].filter(Boolean);

  if (!allDates.some((date) => {
    return date === currentDay;
  })){
    return {
      timesheetId: id,
    };
  }

  return {
    timesheetId: id,
    timesheet_entry_id: firstEntry.id,
    clockIn: firstEntry.clockIn,
    clockOut: firstEntry.clockOut,
    breaks: breaks.items.map((breakRecord) => {
      return {
        breakEntryId: breakRecord.id,
        breakIn: breakRecord.breakIn,
        breakOut: breakRecord.breakOut
      };
    }),
  };
}

export async function clockIn(pb: Client, id: string, date: Date, time?: Date){
  const existing = await pb.collection('timesheet_entries').getList(1, 1, {
    filter: `config = "${id}" && clockIn>"${date.toISOString().split('T')[0]}"`,
    sort: '-clockIn'
  })

  if (existing?.items[0]?.id){
    await pb.collection('timesheet_entries').update(existing.items[0].id, {
      user: pb.authStore?.record?.id,
      config: id,
      clockIn: time ?? new Date()
    })
    return;
  }

  await pb.collection('timesheet_entries').create({
    user: pb.authStore?.record?.id,
    config: id,
    clockIn: time ?? new Date()
  })
}

export async function clockOut(pb: Client, timesheetEntryId: string){
  await pb.collection('timesheet_entries').update(timesheetEntryId, {
    clockOut: new Date(),
  })
}
