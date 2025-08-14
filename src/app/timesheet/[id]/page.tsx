import type { TimesheetConfig } from "~/pocketbase/data.types";
import { serverSideAuth } from "~/pocketbase/server";
import { TableNames } from "~/pocketbase/tables.types";
import DeleteAllEntries from "./DeleteAllEntries";
import DeleteTimesheet from "./DeleteTimesheet";
import { Card, CardContent, CardHeader} from "~/components/ui/card";
import { createTranslation } from "~/i18n/server";
import { TimesheetConfigProvider } from "./TimesheetConfigProvider";
import WeekLogWrapper from "./WeekLogWrapper";

export default async function TimesheetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pb = await serverSideAuth();
  const { t } = await createTranslation();

  const config = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(id);

  return (
    <div className="md:grid px-4 pt-4 pb-8 justify-center w-full">
      <div className="grid gap-8">
        <h1 className="text-2xl font-semibold">{config.name}</h1>

        <TimesheetConfigProvider config={config}>
          <WeekLogWrapper />

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t('timesheet.[id].danger_zone.title')}</h2>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DeleteAllEntries />
              <DeleteTimesheet />
            </CardContent>
          </Card>
        </TimesheetConfigProvider>

      </div>
    </div>
  )
}
