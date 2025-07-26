import { useQuery } from "@tanstack/react-query";
import { getTodaysEntries } from "./api";

export const useGetTodaysTimesheet = (timesheetId: string) =>  {
  return useQuery({
    queryKey: ["today", timesheetId],
    queryFn: ({ queryKey }) => {
      return getTodaysEntries(queryKey[1]);
    },
  });
};
