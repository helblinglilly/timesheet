import DeleteAllEntries from "../../../features/weeklyView/delete/DeleteAllEntries";
import DeleteTimesheet from "../../../features/weeklyView/delete/DeleteTimesheet";
import { Card, CardContent, CardHeader} from "~/components/ui/card";
import { createTranslation } from "~/i18n/server";
import { WeekLog } from "~/features/weeklyView/WeekLog";
import { Title } from "./Title";
import { WeekNavigator } from "~/features/weeklyView/WeekNavigator";
import ClockInButton from "~/features/workday/recordDaily/ClockIn";
import { TimesheetDayProvider } from "~/features/workday/useTimesheetDay";
import ClockOutButton from "~/features/workday/recordDaily/ClockOut";
import BreakInButton from "~/features/workday/recordDaily/BreakIn";
import BreakOutButton from "~/features/workday/recordDaily/BreakOut";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { format } from "date-fns";
import { TimesheetBreadcrumbs } from "./Breadcrumbs";

export default async function TimesheetPage(
  {
    params
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { t } = await createTranslation();
  const { id } = await params

  return (
    <div className="md:grid px-4 pt-4 pb-8 justify-center w-full grid gap-8">
      <div className="grid gap-4">
        <TimesheetBreadcrumbs />
        <Title />

        <h2 className="text-xl font-semibold">{t('timesheet.[id].today.title', { date: format(new Date(), 'EEEE do')})}</h2>

        <TimesheetDayProvider timesheetId={id} day={new Date().toISOString()}>
          <div className="grid md:flex gap-4 w-full md:justify-between">
            <Suspense fallback={<Skeleton className="w-full min-h-48 md:min-h-8" />}>
              <ClockInButton className="md:w-1/5" />
              <BreakInButton className="md:w-1/5" />
              <BreakOutButton className="md:w-1/5" />
              <ClockOutButton className="md:w-1/5" />
            </Suspense>
          </div>
        </TimesheetDayProvider >
      </div>

      <hr></hr>

      <WeekNavigator />

      <WeekLog />

      <hr ></hr>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{t('timesheet.[id].settings.title')}</h2>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">{t('timesheet.[id].danger_zone.title')}</h2>
            <DeleteAllEntries />
            <DeleteTimesheet />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
