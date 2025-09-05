import { TimesheetConfigProvider } from '~/hooks/useTimesheetConfig';
import type { TimesheetConfig } from '~/pocketbase/data.types';
import { serverSideAuth } from '~/pocketbase/server';
import { TableNames } from '~/pocketbase/tables.types';
import { QueryParamInvalidator } from './edit/day/QueryParamInvalidator';

export default async function TimesheetIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pb = await serverSideAuth();
  const { id } = await params;

  const config = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(id);

  return (
    <>
      <TimesheetConfigProvider config={config}>
        <QueryParamInvalidator timesheetId={id}>
          {children}
        </QueryParamInvalidator>
      </TimesheetConfigProvider>
    </>
  );
}
