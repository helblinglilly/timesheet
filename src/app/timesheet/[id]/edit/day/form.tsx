"use client"

import React, { startTransition, useActionState } from 'react'
import { formSchema } from "./form.schema"
import { useTranslation } from 'react-i18next';
import type z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editTimesheetDayWithState, type TimesheetEditFormState } from './action';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';
import { format } from 'date-fns';

export const EditTimesheetDayForm = ({
  timesheetId,
  day
}: {
  timesheetId: string;
  day: string;
}) => {
  const { t } = useTranslation();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id: timesheetId,
    day: format(new Date(day), 'yyy-LL-dd')
  });

  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      day: day,
      timesheetId: timesheetId,
      clockIn: timesheet.clockIn ? format(new Date(timesheet.clockIn), 'HH:mm') : '09:00',
      clockOut: timesheet.clockOut ? format(new Date(timesheet.clockOut), 'HH:mm') : '17:00',
      breaks: []
    },
  });

  const [state, formAction, isPending] = useActionState<TimesheetEditFormState, FormData>(editTimesheetDayWithState, {});

  // This will handle client-side validation and then call the server action
  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('timesheetId', timesheetId);
    formData.append('day', day);

    formData.append("clockIn", new Date(data.clockIn).toISOString());

    if (data.clockOut){
      formData.append("clockOut", new Date(data.clockOut).toISOString());
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:justify-self-center">
        <Card>
          <CardContent className="grid md:flex gap-4">
            <FormField
              control={form.control}
              name="clockIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ t('timesheet.[id].edit.fields.clock_in.label')}</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('timesheet.[id].edit.fields.clock_in.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clockOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ t('timesheet.[id].edit.fields.clock_out.label')}</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('timesheet.[id].edit.fields.clock_out.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid w-full">
          <div className="w-full md:max-w-96 md:justify-self-center">
            {state && (
              <div className="text-red-500">{state.message}</div>
            )}
            <Button type="submit" className="w-full">{isPending ? t('timesheet.new.loading') : t('timesheet.new.submit')}</Button>
          </div>

        </div>
      </form>
    </Form>
  );
}
