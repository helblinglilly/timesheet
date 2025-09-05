'use client';

import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { useTranslation } from 'react-i18next';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { useQueryParamDate } from '~/hooks/useQueryParamDate';
import { format } from 'date-fns';

export const EditBreadcrumbs = ({ id }: {
  id: string;
}) => {
  const { t } = useTranslation();
  const { config } = useTimesheetConfig();
  const { date } = useQueryParamDate();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">{t('common.navigation.dashboard')}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/timesheet/${id}?date=${format(date, 'yyy-LL-dd')}`}>{t('common.navigation.timesheet_name', { name: config.name })}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{ t('common.navigation.edit_day', { date: format(date, 'EEE dd LLL yy') }) }</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
