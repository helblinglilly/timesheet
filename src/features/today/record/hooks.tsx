"use client";

import { getQueryClient } from "@/app/react-query";
import { useMutation } from "@tanstack/react-query";

import { breakIn, breakOut, clockIn, clockOut } from "./api";

export const useClockIn = () => {
  return useMutation({
    mutationFn: async (timesheetEntryId: string) => {
      await clockIn(timesheetEntryId);
    },
    onSuccess: (_data, timesheetEntryId) => {
      getQueryClient().invalidateQueries({ queryKey: ["today", timesheetEntryId] });
    },
  });
};

export const useBreakIn = () => {
  return useMutation({
    mutationFn: async (inOutRecordId: string) => {
      await breakIn(inOutRecordId);
    },
    onSuccess: (_data, inOutRecordId) => {
      getQueryClient().invalidateQueries({ queryKey: ["today", inOutRecordId] });
    },
  });
};

export const useBreakOut = () => {
  return useMutation({
    mutationFn: async (ids: {
        inOutRecordId: string;
        timesheetId: string;
    }) => {
      await breakOut(ids.inOutRecordId);
    },
    onSuccess: (_data, ids) => {
      getQueryClient().invalidateQueries({ queryKey: ["today", ids.timesheetId] });
    },
  });
};

export const useClockOut = () => {
  return useMutation({
    mutationFn: async (timesheetEntryId: string) => {
      await clockOut(timesheetEntryId);
    },
    onSuccess: (_data, timesheetEntryId) => {
      getQueryClient().invalidateQueries({ queryKey: ["today", timesheetEntryId] });
    },
  });
};
