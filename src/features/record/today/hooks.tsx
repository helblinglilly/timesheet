import { getQueryClient } from "@/app/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { clockIn, breakIn, getTodaysEntries, breakOut } from "./api";

export const useGetTodaysTimesheet = (timesheetId: string) =>  useQuery({
  queryKey: ['today', timesheetId],
  queryFn: ({ queryKey }) => getTodaysEntries(queryKey[1]),
})

export const useClockIn = () => useMutation({
  mutationFn: async (timesheetEntryId: string) => {
    await clockIn(timesheetEntryId)
  },
  onSuccess: (_data, timesheetEntryId) => {
    getQueryClient().invalidateQueries({ queryKey: ['today', timesheetEntryId]})
  }
})

export const useBreakIn = () => useMutation({
  mutationFn: async (inOutRecordId: string) => {
    await breakIn(inOutRecordId)
  },
  onSuccess: (_data, inOutRecordId) => {
    getQueryClient().invalidateQueries({ queryKey: ['today', inOutRecordId] })
  }
});

export const useBreakOut = () => useMutation({
  mutationFn: async (inOutRecordId: string) => {
    await breakOut(inOutRecordId)
  },
  onSuccess: (_data, inOutRecordId) => {
    getQueryClient().invalidateQueries({ queryKey: ['today', inOutRecordId] })
  }
});
