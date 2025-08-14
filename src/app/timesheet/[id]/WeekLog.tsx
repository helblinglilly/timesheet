"use client"

import { eachDayOfInterval, startOfWeek, endOfWeek, format, addDays } from 'date-fns'
import React, { Suspense, useMemo } from 'react'
import { useTimesheetConfig } from './TimesheetConfigProvider'
import { useTranslation } from 'react-i18next'
import WorkdayLog from '~/app/dashboard/WorkdayLog'
import { TimesheetDayProvider } from '~/app/dashboard/TimesheetDayProvider'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import HoursWorked from '~/app/dashboard/HoursWorked'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const WeekLog = ({
  date
} : {
  date: Date
}) => {
  const { config } = useTimesheetConfig();
  const { t } = useTranslation();
  const router = useRouter()


  const daysInWeek = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(date, { weekStartsOn: 1 }),
      end: endOfWeek(date, { weekStartsOn: 1 })
    }).slice(0, 5)
  }, [date])

  const startOfLastWeek = useMemo(() => {
    return startOfWeek(
      addDays(daysInWeek[0]!, -3),
      {
        weekStartsOn: 1
      }
    )
  }, [daysInWeek])

  const startOfNextWeek = useMemo(() => {
    return startOfWeek(
      addDays(daysInWeek[daysInWeek.length - 1]!, 3),
      {
        weekStartsOn: 1
      }
    )
  }, [daysInWeek])


  return (
    <>
      <div className="inline-flex justify-between">
        <Button
          className="pr-4"
          onClick={() => {
            router.push(`?date=${format(startOfLastWeek, 'yyy-LL-dd')}`)
          }}
        >
          <ChevronLeftIcon />
          <span className="hidden sm:block">{ format(startOfLastWeek, 'dd LLL') }</span>
        </Button>
        <h2 className="text-xl font-semibold">{t('timesheet.[id].weekly.title', {
          name:
          format(daysInWeek[0]!, 'dd LLL yy')
        })}</h2>

        <Button
          className="pl-4"
          onClick={() => {
            router.push(`?date=${format(startOfNextWeek, 'yyy-LL-dd')}`)
          }}
        >
          <span className="hidden sm:block">{ format(startOfNextWeek, 'dd LLL') }</span>

          <ChevronRightIcon />
        </Button>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        {
          daysInWeek.map((day) => {
            return (
              <TimesheetDayProvider
                timesheetId={ config.id }
                day={format(day, 'yyy-LL-dd')}
                key={day.toISOString()}
              >
                <Link
                  className="w-full md:min-w-sm"
                  href={`/timesheet/${config.id}/edit/day?date=${format(day, 'yyy-LL-dd')}`}
                >
                  <Card className="p-4">
                    <CardHeader>
                      <p><b>{ format(day, 'EEEE do')}</b></p>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <Suspense
                        fallback={
                          <div className="animate-pulse p-4 border rounded bg-muted">
                            <div className="h-6 w-1/2 bg-gray-300 mb-4 rounded" />
                            <div className="h-4 w-3/4 bg-gray-200 mb-2 rounded" />
                            <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded" />
                            <div className="h-4 w-1/3 bg-gray-200 rounded" />
                          </div>
                        }>
                        <WorkdayLog />
                        <HoursWorked />
                      </Suspense>
                    </CardContent>
                  </Card>
                </Link>
              </TimesheetDayProvider>
            )
          })
        }
      </div>
    </>
  );
}
