'use client'

import React from 'react'
import { api } from '~/trpc/react';
import { useTranslation } from 'react-i18next';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { X } from 'lucide-react';

export const ManageSharedUsersTable = () => {
  const { t } = useTranslation();
  const { config } = useTimesheetConfig();
  const apiUtils = api.useUtils();

  const [sharedUsers] = api.timesheet.getAllSharedUsers.useSuspenseQuery({
    timesheetConfigId: config.id
  })

  const removeAccessMutation = api.timesheet.removeSharedAccess.useMutation({
    onSuccess: async () => {
      await apiUtils.timesheet.getAllSharedUsers.reset({
        timesheetConfigId: config.id
      })

      if (sharedUsers.length === 1){
        window.location.reload();
      }
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{ t('timesheet.[id].settings.share_zone.unlink.others.table.name') }</TableHead>
          <TableHead>{ t('timesheet.[id].settings.share_zone.unlink.others.table.email') }</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sharedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                className="hover:cursor-pointer"
                variant={'destructive'}
                onClick={() => {
                  removeAccessMutation.mutate({
                    timesheetConfigId: config.id,
                    sharedUserId: user.id,
                  })
                }}
              >
                <X />
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
