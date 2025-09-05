'use client';

import React from 'react';
import { useQueryParamDate } from '~/hooks/useQueryParamDate';
import { Button } from '~/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format, isAfter } from 'date-fns';
import Link from 'next/link';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { useTranslation } from 'react-i18next';

export const WeekNavigator = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { daysInWeek, startOfLastWeek, startOfNextWeek } = useQueryParamDate();
  const { config } = useTimesheetConfig();

  return (
    <div className="inline-flex justify-between">
      <Button
        className="pr-4 w-24"
        onClick={() => {
          router.push(`?date=${format(startOfLastWeek, 'yyy-LL-dd')}`);
        }}
      >
        <ChevronLeftIcon />
        <span className="hidden sm:block">{ format(startOfLastWeek, 'dd LLL') }</span>
      </Button>

      <Link
        className=""
        href={`/timesheet/${config.id}?date=${format(new Date(), 'yyy-LL-dd')}`}
      >
        <h2 className="text-xl font-semibold">
          {t('timesheet.[id].weekly.title', {
            name:
        format(daysInWeek[0]!, 'dd LLL yy'),
          })}
        </h2>
      </Link>

      {
        isAfter(startOfNextWeek, new Date()) ? <div className="pl-4 w-24" /> : (
          <Button
            className="pl-4 w-24"
            onClick={() => {
              router.push(`?date=${format(startOfNextWeek, 'yyy-LL-dd')}`);
            }}
          >
            <span className="hidden sm:block">{ format(startOfNextWeek, 'dd LLL') }</span>

            <ChevronRightIcon />
          </Button>
        )
      }

    </div>
  );
};
