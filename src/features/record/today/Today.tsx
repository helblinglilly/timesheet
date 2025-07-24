import { Suspense } from "react";
import { getTodaysEntries } from "./server/actions";
import { RecordToday } from "./RecordToday";
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Today({ timesheetId }: { timesheetId: string}){

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RecordToday getTodaysEntriesPromise={getTodaysEntries(timesheetId)}/>
      </Suspense>
    </ErrorBoundary>
  )
}
