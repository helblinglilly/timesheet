'use client';

import { DialogDescription } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';

export default function DeleteTimesheet() {
  const { t } = useTranslation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { config } = useTimesheetConfig();

  const deleteTimesheetMutation = api.timesheet.deleteTimesheet.useMutation({
    onSuccess: async () => {
      router.push('/dashboard');
    },
  });

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
          >
            {t('timesheet.[id].danger_zone.delete_timesheet.open')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('timesheet.[id].danger_zone.delete_timesheet.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('timesheet.[id].danger_zone.delete_timesheet.dialog.description', { name: config.name })}

              <br />

              {t('timesheet.[id].danger_zone.delete_timesheet.dialog.guard_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="name-1"
                name="name"
                placeholder={config.name}
                onChange={(e) => {
                  if (e.target.value) {
                    setIsButtonDisabled(e.target.value !== config.name);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="md:justify-between">
            <DialogClose asChild className="flex-start">
              <Button variant="outline" ref={closeButtonRef}>{t('timesheet.[id].danger_zone.delete_timesheet.dialog.buttons.cancel')}</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isButtonDisabled}
              onClick={() => {
                deleteTimesheetMutation.mutate({
                  timesheetConfigId: config.id,
                });
              }}
            >
              {t('timesheet.[id].danger_zone.delete_timesheet.dialog.buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
