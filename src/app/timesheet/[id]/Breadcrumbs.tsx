"use client";

import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { useTranslation } from 'react-i18next';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';


export const TimesheetBreadcrumbs = () => {
  const { t } = useTranslation();
  const { config } = useTimesheetConfig();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">{t('common.navigation.dashboard')}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbItem>{t('common.navigation.timesheet_name', { name: config.name })}</BreadcrumbItem>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
