"use server";

import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'
import { createTranslation } from '~/i18n/server';
import { EditTimesheetDayForm } from './form';
import { Skeleton } from '~/components/ui/skeleton';

export default async function TimesheetEditPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params;
  const { t } = await createTranslation();
  const { date } = await searchParams;


  if (!date || Array.isArray(date)){
    redirect(`/timesheet/${id}`)
  }

  return (
    <div className="md:grid px-4 pt-4 pb-8 justify-center w-full gap-4">
      <div className="grid gap-8">
        <h2 className="text-xl font-semibold">{t('timesheet.[id].edit.title', { date: format(new Date(date), 'EEEE do MMMM')})}</h2>
      </div>

      <div>
        <Suspense fallback={<Skeleton className="h-12 w-full" />}>
          <EditTimesheetDayForm timesheetId={id} day={date} />
        </Suspense>
      </div>
    </div>
  );
}
