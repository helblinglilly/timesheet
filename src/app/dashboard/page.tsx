import { serverSideAuth } from "@/utils/pb/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() {
	const pb = await serverSideAuth();
	const timesheetRecords = await pb.collection("timesheet").getList(1, 20);

	if (timesheetRecords.items.length === 0) {
		redirect("/dashboard/new");
	}

	return <p>Hello {JSON.stringify(timesheetRecords)}</p>;
}
