'use server';

import React from 'react';
import { EditBreadcrumbs } from './Breadcrumbs';
import UpdateTimesheet from './form';

export default async function TimesheetEditPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;

  return (
    <div className="md:grid px-4 pt-4 pb-8 justify-center w-full grid gap-8">
      <EditBreadcrumbs id={id} />

      <UpdateTimesheet />

    </div>
  );
}
