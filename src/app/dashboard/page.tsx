import { getTodaysEntries } from "@/features/today/api";
import Today from "@/features/today/Today";
import { serverSideAuth } from "@/utils/pb/server";
import { Timesheet } from "@/utils/pb/types";
import { HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { ListResult } from "pocketbase";

export default async function Dashboard() {
  const pb = await serverSideAuth();
  const timesheets: ListResult<Timesheet> = await pb.collection("timesheet").getList(1, 20, {
    sort: "-updated",
  });

  if (timesheets.items.length === 0) {
    redirect("/dashboard/new");
  }

  const timesheetData = (await Promise.allSettled(
    timesheets.items.map((timesheet) => {
      return getTodaysEntries(timesheet.id);
    }),
  )).filter((a) => {
    return a.status === "fulfilled";
  }).map((a) => {
    return a.value;
  });

  console.log(timesheetData);

  return (
    <HydrationBoundary>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {
          timesheetData.map((timesheet) => {
            return (
              <Today timesheet={timesheet} key={timesheet.id ?? ""} />
            );
          })
        }
      </div>
    </HydrationBoundary>
  );
}
