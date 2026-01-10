import { type RecordModel } from 'pocketbase';

export interface ExtendedRecordModel extends RecordModel {
  created: string;
  updated: string;
}

export interface TimesheetConfig extends ExtendedRecordModel {
  name: string;
  minutesPerDay: number;
  daysPerWeek: number;
  paidLunchMinutes: number;
  unpaidLunchMinutes: number;
  sharedUsers: string[];
  kind: 'office' | 'freelance';
  user: string;
}

export interface TimesheetEntry extends ExtendedRecordModel {
  clockIn: string;
  clockOut?: string;
  config: string;
}

export interface TimesheetBreaks extends ExtendedRecordModel {
  breakIn: string;
  breakOut?: string;
}

export interface User extends ExtendedRecordModel {
  email: string;
  name: string;
}

export interface TimesheetShare extends ExtendedRecordModel {
  timesheet: string;
  user_email: string;
  invite_code: string;
  expires_at: string; // Date
}

export interface TimesheetTransferRequest extends ExtendedRecordModel {
  timesheet: string;
  user_email: string;
  transfer_code: string;
  /**
   * Date string
   */
  expires_at: string;
}
