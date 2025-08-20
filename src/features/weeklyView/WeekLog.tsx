"use client"

import React, { Suspense} from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import HoursWorked from '~/app/dashboard/HoursWorked'
import Link from 'next/link'

import { Skeleton } from '~/components/ui/skeleton'
import { useQueryParamDate } from '~/hooks/useQueryParamDate'
import { TimesheetDayProvider } from '~/features/workday/useTimesheetDay'
import WorkdayLog from '~/features/workday/WorkdayLog'
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig'
import { format } from 'date-fns'
import { WeekNavigator } from './WeekNavigator'
import { WeekHoursWorked } from './WeekHoursWorked'
import { ErrorBoundary } from '../ErrorBoundary'

export const WeekLog = () => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();
  const { daysInWeek } = useQueryParamDate();

  return (
    <>
      <WeekNavigator />
      <div className='grid md:grid-cols-2 gap-8'>

        <Card className="p-4 w-full md:min-w-sm gap-0">
          <CardHeader>
            <b>{ t('timesheet.[id].weekly.log.summary.title')}</b>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ErrorBoundary fallback={<div>Error</div>}>
              <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                <WeekHoursWorked />
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>

        {
          daysInWeek.map((day) => {
            return (
              <TimesheetDayProvider
                timesheetId={ config.id }
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
                          }>
                          <WorkdayLog noDataText={t('timesheet.[id].weekly.log.no_data')} />
                          <HoursWorked />
                        </Suspense>
                      </ErrorBoundary>
                    </CardContent>
                  </Link>
                </Card>
              </TimesheetDayProvider>
            )
          })
        }
      </div>
    </>
  );
}
