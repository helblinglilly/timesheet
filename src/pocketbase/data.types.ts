import { type RecordModel } from "pocketbase";

export interface TimesheetConfig extends RecordModel {
  name: string;
  minutesPerDay: number;
  daysPerWeek: number;
  paidLunchMinutes: number;
  unpaidLunchMinutes: number;
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

export interface User extends RecordModel {
  name: string;
}
