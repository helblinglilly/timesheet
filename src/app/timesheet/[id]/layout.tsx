import { TimesheetConfigProvider } from '~/hooks/useTimesheetConfig';
import type { TimesheetConfig } from '~/pocketbase/data.types';
import { serverSideAuth } from '~/pocketbase/server';
import { TableNames } from '~/pocketbase/tables.types';
import { QueryParamInvalidator } from './QueryParamInvalidator';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const pb = await serverSideAuth();
  const { id } = await params;

  const config = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(id);

  return {
    title: [config.name, 'Timesheet'].filter(Boolean).join(' - '),
    description: null
  };
}

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
