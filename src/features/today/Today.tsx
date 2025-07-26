import { getTodaysEntries } from "./api";
import { RecordToday } from "./record/RecordToday";

export default function Today({ timesheet }: {timesheet:  Awaited<ReturnType<typeof getTodaysEntries>>}) {

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-bold">{timesheet.id}</h2>
      <RecordToday {...timesheet} />
    </div>
  );
}
