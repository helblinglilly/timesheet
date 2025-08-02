"use server"

import { redirect } from "next/navigation";
import { createTranslation } from "~/i18n/server";
import type { Timesheet, User } from "~/pocketbase/data.types";
import { serverSideAuth } from "~/pocketbase/server";
import TimesheetDay from "./TimesheetDay";
import React from "react";


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

      {
        timesheets.map((timesheet) => {
          return (
            <React.Fragment key={timesheet.id}>
              <div  className="grid gap-2">
                <h2 className="text-xl font-semibold">{timesheet.name}</h2>

                <TimesheetDay id={timesheet.id} day={today} />
              </div>

              <br />
            </React.Fragment>
          )
        })
      }
    </div>
  )
}
