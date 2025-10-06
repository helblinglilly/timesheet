'use client';

import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import Link from 'next/link';

import { Skeleton } from '~/components/ui/skeleton';
import { useQueryParamDate } from '~/hooks/useQueryParamDate';
import { TimesheetDayProvider } from '~/features/workday/useTimesheetDay';
import WorkdayLog from '~/features/workday/WorkdayLog';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { addDays, endOfWeek, format, startOfWeek } from 'date-fns';
import { ErrorBoundary } from '../ErrorBoundary';
import { HoursWorked } from '~/features/HoursWorked/HoursWorked';

export const WeekLog = () => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();
  const { daysInWeek } = useQueryParamDate();
  const { date } = useQueryParamDate();

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">

        <Card className="p-4 w-full md:min-w-sm gap-0">
          <CardHeader>
            <b>{ t('timesheet.[id].weekly.log.summary.title')}</b>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ErrorBoundary fallback={<div>Error</div>}>
              <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                <HoursWorked
                  from={startOfWeek(date, { weekStartsOn: 1 })}
                  to={endOfWeek(date, { weekStartsOn: 1 }) }
                />
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>

        {
          daysInWeek.map((day) => {
            return (
              <TimesheetDayProvider
                timesheetId={config.id}
                day={format(day, 'yyy-LL-dd')}
                key={day.toISOString()}
              >
                <Card className="p-4">
                  <Link
                    className="w-full md:min-w-sm"
                    href={`/timesheet/${config.id}/edit/day?date=${format(day, 'yyy-LL-dd')}`}
                  >
                    <CardHeader>
                      <p><b>{ format(day, 'EEEE do')}</b></p>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <ErrorBoundary fallback={<div>Error</div>}>
                        <Suspense
                          fallback={
                            <Skeleton className="h-8 w-full" />
                          }
                        >
                          <WorkdayLog noDataText={t('timesheet.[id].weekly.log.no_data')} />
                          <HoursWorked from={ new Date(day)} to={addDays(day, 1)} />
                        </Suspense>
                      </ErrorBoundary>
                    </CardContent>
                  </Link>
                </Card>
              </TimesheetDayProvider>
            );
          })
        }
      </div>
    </>
  );
};
