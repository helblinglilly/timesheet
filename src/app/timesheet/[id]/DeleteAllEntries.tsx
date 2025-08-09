"use client"

import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next"
import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import type { TimesheetConfig } from "~/pocketbase/data.types";
import { api } from "~/trpc/react";


export default function DeleteAllEntries(
  {
    config
  }:
  {
    config: TimesheetConfig
  }
){
  const { t } = useTranslation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const deleteAllEntriesMutation = api.timesheet.deleteAllEntries.useMutation({
    onSuccess: async () => {
      // invalidate all existing entries
    }
  });

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
          >
            {t('timesheet.[id].danger_zone.delete_all_entries.open')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('timesheet.[id].danger_zone.delete_all_entries.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('timesheet.[id].danger_zone.delete_all_entries.dialog.description', { name: config.name})}

              <br />

              {t('timesheet.[id].danger_zone.delete_all_entries.dialog.guard_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="name-1"
                name="name"
                placeholder={config.name}
                onChange={(e) => {
                  if (e.target.value){
                    setIsButtonDisabled(e.target.value !== config.name);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="md:justify-between">
            <DialogClose asChild className="flex-start">
              <Button variant="outline">{t('timesheet.[id].danger_zone.delete_all_entries.dialog.buttons.cancel')}</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isButtonDisabled}
              onClick={() => {
                deleteAllEntriesMutation.mutate({
                  timesheetConfigId: config.id
                })
              }}
            >{t('timesheet.[id].danger_zone.delete_all_entries.dialog.buttons.delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
