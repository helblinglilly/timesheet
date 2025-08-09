import type { TimesheetConfig } from "~/pocketbase/data.types";
import { serverSideAuth } from "~/pocketbase/server";
import { TableNames } from "~/pocketbase/tables.types";
import DeleteAllEntries from "./DeleteAllEntries";

export default async function TimesheetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pb = await serverSideAuth();

  const config = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(id);


  return (
    <div className="grid gap-4 px-4 pt-4 pb-8">
      <h1 className="text-2xl font-semibold">{config.name}</h1>

      <div className="grid gap-8">

        <DeleteAllEntries config={config}  />

      </div>
    </div>
  )
}
