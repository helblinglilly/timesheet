import type { ListResult } from "pocketbase";
import type Client from "pocketbase";
import { hasIncompleteBreakEntry } from "~/lib/workday";
import type { TimesheetEntry, TimesheetBreaks } from "~/pocketbase/data.types";
import { TableNames } from "~/pocketbase/tables.types";

export async function getTimesheetByDate(pb: Client, id: string, date: Date){
  const inOutRecord: ListResult<TimesheetEntry> = await pb.collection(TableNames.TimesheetEntry).getList(1, 1, {
    filter: `config.id = "${id}" && clockIn<"${date.toISOString()}"`,
    sort: "-clockIn",
  });

  const firstEntry = inOutRecord.items[0];
  if (!firstEntry){
    return {
      timesheetId: id,
    };
  }

  const breaks: ListResult<TimesheetBreaks> = await pb.collection(TableNames.TimesheetBreaks).getList(1, 20, {
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
  const existing = await pb.collection<TimesheetEntry>(TableNames.TimesheetEntry).getList(1, 1, {
    filter: `config = "${id}" && clockIn>"${date.toISOString().split('T')[0]}"`,
    sort: '-clockIn'
  })

  if (existing?.items[0]?.id){
    await pb.collection<TimesheetEntry>(TableNames.TimesheetEntry).update(existing.items[0].id, {
      user: pb.authStore?.record?.id,
      config: id,
      clockIn: time ?? new Date()
    })
    return;
  }

  await pb.collection(TableNames.TimesheetEntry).create({
    user: pb.authStore?.record?.id,
    config: id,
    clockIn: time ?? new Date()
  })
}

export async function clockOut(pb: Client, timesheetEntryId: string){
  await pb.collection(TableNames.TimesheetEntry).update(timesheetEntryId, {
    clockOut: new Date(),
  })
}

export async function breakIn(pb: Client, timesheetEntryId: string){
  const existingBreakEntries = await pb.collection<TimesheetBreaks>(TableNames.TimesheetBreaks).getList(1, 20, {
    filter: `timesheet_entry="${timesheetEntryId}"`,
    sort: '-breakIn'
  });

  if (hasIncompleteBreakEntry(existingBreakEntries.items)){
    throw new Error('Tried to break in but there exists an open break entry with no breakOut')
  };

  await pb.collection(TableNames.TimesheetBreaks).create<TimesheetBreaks>({
    user: pb.authStore?.record?.id,
    timesheet_entry: timesheetEntryId,
    breakIn: new Date()
  })
}

export async function breakOut(pb: Client, breakEntryId: string){
  const existingBreakEntries = await pb.collection<TimesheetBreaks>(TableNames.TimesheetBreaks).getOne(breakEntryId);

  if (existingBreakEntries.breakOut){
    throw new Error("Tried to break out but the entry already had a breakOut")
  }

  await pb.collection<TimesheetBreaks>(TableNames.TimesheetBreaks).update(breakEntryId, {
    breakOut: new Date()
  })
}

export async function deleteAllEntries(pb: Client, timesheetConfigId: string){
  let breakPage = 1;
  let totalBreakPages = 1;
  const breakBatch = pb.createBatch();
  let hasBreaksToDelete = false;

  do {
    const breaks = await pb.collection(TableNames.TimesheetBreaks).getList(1, 50, {
      page: breakPage,
      filter: `timesheet_entry.config.id="${timesheetConfigId}"`
    });

    hasBreaksToDelete = breaks.totalItems > 0;

    breaks.items.forEach((item) => {
      breakBatch.collection(TableNames.TimesheetBreaks).delete(item.id)
    })

    breakPage++;
    totalBreakPages = breaks.totalPages;
  } while (breakPage < totalBreakPages);

  if (hasBreaksToDelete){
    await breakBatch.send();
  }



  let entriesPage = 1;
  let totalEntriesPage = 1;
  const entriesBatch = pb.createBatch();
  let hasEntriesToDelete = false;

  do {
    const entries = await pb.collection(TableNames.TimesheetEntry).getList(1, 50, {
      page: entriesPage,
      filter: `config.id="${timesheetConfigId}"`
    });

    hasEntriesToDelete = entries.totalItems > 0;

    entries.items.forEach((item) => {
      entriesBatch.collection(TableNames.TimesheetEntry).delete(item.id)
    })

    entriesPage++;
    totalEntriesPage = entries.totalPages;
  } while (entriesPage < totalEntriesPage);

  if (hasEntriesToDelete){
    await entriesBatch.send();
  }
}
