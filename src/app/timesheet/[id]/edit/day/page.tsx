'use server';

import React from 'react';
import { EditBreadcrumbs } from './Breadcrumbs';
import { EditTimesheetDay } from './EditTimesheetDay';

export default async function TimesheetEditPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;

  return (
    <div className="grid px-4 pt-4 pb-8 gap-8 w-full md:w-[90%] md:mx-auto lg:w-[80%] xl:w-[70%]">
      <EditBreadcrumbs id={id} />

      <EditTimesheetDay timesheetId={id} />
    </div>
  );
}
