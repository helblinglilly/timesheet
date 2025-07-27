"use server"

import { serverSideAuth } from "~/pocketbase/server";


export default async function Dashboard() {
  const pb = await serverSideAuth();

  const timesheet = await pb.collection('timesheet').getFullList();

  console.log(pb.authStore, timesheet);

  return (
    <p>{JSON.stringify(pb.authStore.record)}</p>
  )
}
