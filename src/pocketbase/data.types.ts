import { type RecordModel } from 'pocketbase';

export interface TimesheetConfig extends RecordModel {
  name: string;
  minutesPerDay: number;
  daysPerWeek: number;
  paidLunchMinutes: number;
  unpaidLunchMinutes: number;
  sharedUsers: string[];
  kind: 'office' | 'freelance';
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

export interface TimesheetShare extends RecordModel {
  timesheet: string;
  user_email: string;
  invite_code: string;
  expires_at: string; // Date
}
