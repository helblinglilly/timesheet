import React from 'react'
import { createTranslation } from '~/i18n/server';
import type { TimesheetConfig } from '~/pocketbase/data.types';
import { serverSideAuth } from '~/pocketbase/server';
import { TableNames } from '~/pocketbase/tables.types';

export default async function TimesheetEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const pb = await serverSideAuth();
  const { t } = await createTranslation();

  const config = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(id);
  console.log(config);
  return (
    <>
      <div>
        <p>{ t('timesheet.[id].edit.title', { date: 'test'} ) }</p>
      </div>
    </>
  );
}
