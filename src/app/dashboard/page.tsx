import { RecordToday } from "@/features/record/today/RecordToday";
import Today from "@/features/record/today/Today";
import { serverSideAuth } from "@/utils/pb/server";
import { Timesheet } from "@/utils/pb/types";
import { redirect } from "next/navigation";
import { ListResult } from "pocketbase";
import React from "react";

export default async function Dashboard() {
	const pb = await serverSideAuth();
	const timesheets: ListResult<Timesheet> = await pb.collection("timesheet").getList(1, 20);

	if (timesheets.items.length === 0) {
		redirect("/dashboard/new");
	}

 return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {
        timesheets.items.map((timesheet) => {
          return (
            <div key={timesheet.id} className="grid gap-6">
              <h2 className="text-xl font-bold">{timesheet.name}</h2>
              <Today timesheetId={timesheet.id}/>
            </div>
          )
        })
      }
    </div>
  );
}
