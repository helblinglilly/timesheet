import DeleteAllEntries from "../../../features/weeklyView/delete/DeleteAllEntries";
import DeleteTimesheet from "../../../features/weeklyView/delete/DeleteTimesheet";
import { Card, CardContent, CardHeader} from "~/components/ui/card";
import { createTranslation } from "~/i18n/server";
import { WeekLog } from "~/features/weeklyView/WeekLog";
import { Title } from "./Title";

export default async function TimesheetPage() {
  const { t } = await createTranslation();

  return (
    <div className="md:grid px-4 pt-4 pb-8 justify-center w-full">
      <div className="grid gap-8">
        <Title />
        <WeekLog />
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
    </div>
  )
}
