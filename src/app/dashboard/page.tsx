"use server"

import { redirect } from "next/navigation";
import { createTranslation } from "~/i18n/server";
import type { TimesheetConfig, User } from "~/pocketbase/data.types";
import { serverSideAuth } from "~/pocketbase/server";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import HoursWorked from "./HoursWorked";
import TargetHours from "./TargetHours";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import BreakInButton from "~/features/workday/recordDaily/BreakIn";
import BreakOutButton from "~/features/workday/recordDaily/BreakOut";
import ClockInButton from "~/features/workday/recordDaily/ClockIn";
import ClockOutButton from "~/features/workday/recordDaily/ClockOut";
import { TableNames } from "~/pocketbase/tables.types";
import { TimesheetDayProvider } from "~/features/workday/useTimesheetDay";
import WorkdayLog from "~/features/workday/WorkdayLog";


export default async function Dashboard() {
  const { t } = await createTranslation();
  const pb = await serverSideAuth();
  const today = new Date().toISOString().split('T')[0] ?? ''

  const user: User = await pb.collection(TableNames.User).getOne(pb.authStore.record?.id ?? '');

  const timesheets: TimesheetConfig[]  = await pb.collection(TableNames.TimesheetConfig).getFullList();

  if (timesheets.length === 0){
    redirect('/timesheet/new')
  }

  return (
    <div className="grid gap-4 px-4 pt-4 pb-8 md:justify-center">
      <h1 className="text-3xl font-semibold">{t('dashboard.greeting', { name: user.name })}</h1>

      <div className="grid gap-8">
        {
          timesheets.map((timesheet) => {
            return (
              <Card className="grid gap-2" key={timesheet.id + today}>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">{timesheet.name}</h2>
                </CardHeader>

                <TimesheetDayProvider timesheetId={timesheet.id} day={today}>
                  <CardContent className="gap-4 grid">
                    <div className="grid md:flex gap-4 w-full md:justify-between">
                      <ClockInButton className="md:w-1/5" />
                      <BreakInButton className="md:w-1/5" />
                      <BreakOutButton className="md:w-1/5" />
                      <ClockOutButton className="md:w-1/5" />
                    </div>
                    <h3 className="text-lg font-semibold">{ t('timesheet.today.log.title') }</h3>
                    <WorkdayLog />
                  </CardContent>

                  <CardFooter>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button className="flex gap-2 w-full">
                          <HoursWorked/>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-70">
                        <TargetHours />
                      </HoverCardContent>
                    </HoverCard>

                    <Link href={`/timesheet/${timesheet.id}`} className="w-full md:max-w-1/5">
                      <Button variant='outline' className="w-full">
                        {t('dashboard.show_more')}
                      </Button>
                    </Link>
                  </CardFooter>

                </TimesheetDayProvider>
              </Card>
            )
          })
        }

        <Link href={`/timesheet/new`} className="w-full">
          <Button variant='outline' className="w-full">
            {t('dashboard.add_new_timesheet')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
