"use server";

import React from 'react'
import { createTranslation } from '~/i18n/server';

export default async function TimesheetEditPage() {
  const { t } = await createTranslation();
  return (
    <>
      <div>
        <p>{ t('timesheet.[id].edit.title', { date: 'test'} ) }</p>
      </div>
    </>
  );
}
