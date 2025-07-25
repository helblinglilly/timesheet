import { getQueryClient } from "@/app/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { clockIn, breakIn, getTodaysEntries, breakOut } from "./api";

export const useGetTodaysTimesheet = (timesheetId: string) =>  {
  return useQuery({
    queryKey: ["today", timesheetId],
    queryFn: ({ queryKey }) => {
      return getTodaysEntries(queryKey[1]);
    },
  });
};

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
    mutationFn: async (inOutRecordId: string) => {
      await breakOut(inOutRecordId);
    },
    onSuccess: (_data, inOutRecordId) => {
      getQueryClient().invalidateQueries({ queryKey: ["today", inOutRecordId] });
    },
  });
};
