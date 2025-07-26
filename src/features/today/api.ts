import { serverSideAuth } from "@/utils/pb/server";
import { TimesheetBreaks, TimesheetEntry } from "@/utils/pb/types";
import { ListResult } from "pocketbase";

export const getTodaysEntries = async (timesheetId: string) => {
  const pb = await serverSideAuth();

  const inOutRecord: ListResult<TimesheetEntry> = await pb.collection("timesheet_entries").getList(1, 1, {
    filter: `config.id = "${timesheetId}"`,
    sort: "-clockIn",
  });

  const firstEntry = inOutRecord.items[0];
  if (!firstEntry){
    return {
      timesheetId: timesheetId,
    };
  }

  const breaks: ListResult<TimesheetBreaks> = await pb.collection("timesheet_breaks").getList(1, 20, {
    filter: `timesheet_entry.id = "${firstEntry.id}"`,
  });

  const today = new Date().toISOString().split("T")[0];

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
    return date === today;
  })){
    return {
      timesheetId: timesheetId,
    };
  }

  return {
    timesheetId: timesheetId,
    id: firstEntry.id,
    clockIn: firstEntry.clockIn,
    clockOut: firstEntry.clockOut,
    breaks: breaks.items.map((breakRecord) => {
      return breakRecord;
    }),
  };
};
