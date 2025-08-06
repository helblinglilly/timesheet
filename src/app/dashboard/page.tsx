"use server"

import { redirect } from "next/navigation";
import { createTranslation } from "~/i18n/server";
import type { Timesheet, User } from "~/pocketbase/data.types";
import { serverSideAuth } from "~/pocketbase/server";
import ClockInActions from "./ClockInActions";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import WorkdayLog from "./WorkdayLog";
import HoursWorked from "./HoursWorked";
import TargetHours from "./TargetHours";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";


export default async function Dashboard() {
  const { t } = await createTranslation();
  const pb = await serverSideAuth();
  const today = new Date().toISOString().split('T')[0] ?? ''

  const user: User = await pb.collection('users').getOne(pb.authStore.record?.id ?? '');

  const timesheets: Timesheet[]  = await pb.collection('timesheet').getFullList();

  if (timesheets.length === 0){
    redirect('/timesheet/new')
  }



  return (
    <div className="grid gap-4 px-4 pt-4 pb-8">
      <h1 className="text-2xl font-semibold">{t('dashboard.greeting', { name: user.name })}</h1>

      <div className="grid gap-8">
        {
          timesheets.map((timesheet) => {
            return (
              <Card className="grid gap-2 md:max-w-2/3" key={timesheet.id}>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{timesheet.name}</h2>
                </CardHeader>

                <CardContent className="gap-4 grid">
                  <ClockInActions id={timesheet.id} day={today} />

                  <WorkdayLog id={timesheet.id} day={today} />
                </CardContent>

                <CardFooter>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="flex gap-2 w-full">
                        <HoursWorked id={timesheet.id} day={today} />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-70">
                      <TargetHours id={timesheet.id} day={today} />
                    </HoverCardContent>
                  </HoverCard>


                  <Link href={`/timesheet/${timesheet.id}`} className="w-full md:max-w-1/5">
                    <Button variant='outline' className="w-full">
                      {t('dashboard.show_more')}
                    </Button>
                  </Link>
                </CardFooter>

              </Card>
            )
          })
        }
      </div>
    </div>
  )
}
