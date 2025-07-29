"use server"

import { redirect } from "next/navigation";
import { serverSideAuth } from "~/pocketbase/server";


export default async function Dashboard() {
  const pb = await serverSideAuth();

  const timesheet = await pb.collection('timesheet').getFullList();

  if (timesheet.length === 0){
    redirect('/timesheet/new')
  }

  return (
    <p>{JSON.stringify(pb.authStore.record)}</p>
  )
}
