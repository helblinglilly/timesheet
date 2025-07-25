import { RecordModel } from "pocketbase";

export interface Timesheet extends RecordModel {
  name: string;
  minutesPerDay: number;
  daysPerWeek: number;
  lunchMinutes: number;
  kind: "office" | "freelance";
}

export interface TimesheetEntry extends RecordModel {
  clockIn: string;
  clockOut?: string;
}

export interface TimesheetBreaks extends RecordModel {
  breakIn: string;
  breakOut?: string;
}
