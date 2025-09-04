"use client"

import React from 'react'
import { useEffect } from 'react';
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

export const QueryParamInvalidator = ({
  children,
  timesheetId
} : {
  children: React.ReactNode;
  timesheetId: string;
}) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const apiUtils = api.useUtils();

  useEffect(() => {
    async function invalidate(day: string){
      await apiUtils.timesheet.getTimesheetDayById.reset({
        id: timesheetId,
        day: day
      });

      await apiUtils.timesheet.getAllRecordsBetweenDates.reset({
        timesheetConfigId: timesheetId,
        startDate: format(startOfWeek(new Date(day), { weekStartsOn: 1}), 'yyy-LL-dd'),
        endDate: format(endOfWeek(new Date(day), { weekStartsOn: 1}), 'yyy-LL-dd')
      })
    }

    const refetchDateValue = searchParams.get('refetch_date');

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("refetch_date");
    router.replace(`?${params.toString()}`, { scroll: false });

    if (refetchDateValue){
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      invalidate(refetchDateValue);

    }
  }, [searchParams, timesheetId, apiUtils, router]);

  return (
    <>
      {children}
    </>
  );
}
