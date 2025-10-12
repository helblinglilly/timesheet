import type Client from 'pocketbase';
import { type TimesheetConfig } from '~/pocketbase/data.types';
import { TableNames } from '~/pocketbase/tables.types';

export async function renameTimesheet(pb: Client, {
  timesheetConfigId,
  newName
}: {
  timesheetConfigId: string;
  newName: string;
}){
  const { user } = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(timesheetConfigId);

  if (!pb.authStore.record){
    throw new Error('User tried to rename timesheet but we could not figure out who they are');
  }
  if (user !== pb.authStore.record.id){
    throw new Error(`User tried to rename timesheet ${timesheetConfigId} but they were not the owner`)
  }

  if (newName.length < 3 ){
    throw new Error('Timesheet name has to be at least 3 characters')
  }

  await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).update(timesheetConfigId, {
    name: newName
  })
}
