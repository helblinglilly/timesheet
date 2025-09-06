'use client';

import React, { startTransition, useActionState, useEffect } from 'react';

import { useQueryParamDate } from '~/hooks/useQueryParamDate';
import { useTranslation } from 'react-i18next';
import { api } from '~/trpc/react';
import { format } from 'date-fns';
import { formSchema } from './form.schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editTimesheetDayWithState, type TimesheetEditFormState } from './action';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import type z from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';

export const EditTimesheetDay = ({
  timesheetId,
}: {
  timesheetId: string;
}) => {
  const { date } = useQueryParamDate();
  const { t } = useTranslation();

  const [timesheet] = api.timesheet.getTimesheetDayById.useSuspenseQuery({
    id: timesheetId,
    day: format(new Date(date), 'yyy-LL-dd'),
  });

  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      id: timesheetId,
      timesheet_entry_id: timesheet.timesheet_entry_id,
      day: format(date, 'yyy-LL-dd'),
      clockIn: timesheet.clockIn ? format(timesheet.clockIn, 'HH:mm') : '09:00',
      breaks: timesheet.breaks
        ? timesheet.breaks.map(a => ({
          breakEntryId: a.breakEntryId,
          breakIn: format(new Date(a.breakIn), 'HH:mm'),
          breakOut: a.breakOut ? format(new Date(a.breakOut), 'HH:mm') : '',
        }))
        : [],
      clockOut: timesheet.clockOut ? format(timesheet.clockOut, 'HH:mm') : '',
    },
  });

  const { fields, append, remove: _remove } = useFieldArray({
    control: form.control,
    name: 'breaks',
  });

  const [state, formAction, isPending] = useActionState<TimesheetEditFormState, FormData>(editTimesheetDayWithState, {});

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('id', timesheetId);
    formData.append('day', date.toISOString());
    if (timesheet.timesheet_entry_id){
      formData.append('timesheet_entry_id', timesheet.timesheet_entry_id);
    } else {
      formData.delete('timesheet_entry_id');
    }
    formData.append('clockIn', data.clockIn);
    formData.append('clockOut', data.clockOut ?? '');

    data.breaks.forEach((breakData, i) => {
      if (breakData.breakEntryId){
        formData.append(`breaks[${i}][breakEntryId]`, breakData.breakEntryId)
      } else {
        formData.delete(`breaks[${i}][breakEntryId]`)
      }
      formData.append(`breaks[${i}][breakIn]`, breakData.breakIn);
      formData.append(`breaks[${i}][breakOut]`, breakData.breakOut ?? '');
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, messages]) => {
        // @ts-expect-error Does not realise it's a key of
        form.setError(key, {
          type: 'server',
          message: messages?.[0] ?? 'Error',
        });
      });
    }
  }, [state?.errors, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full md:min-w-xl h-full">
        <div className="grid md:flex gap-4 md:justify-between">
          <Card className="min-w-full md:min-w-1/2">
            <CardContent>
              <FormField
                control={form.control}
                name="clockIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ t('timesheet.[id].edit.fields.clock_in.label')}</FormLabel>
                    <FormControl>
                      <Input type="time" className="text-center px-8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}

              />
            </CardContent>
          </Card>

          <Card className="min-w-full md:min-w-1/2">
            <CardContent>
              <FormField
                control={form.control}
                name="clockOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ t('timesheet.[id].edit.fields.clock_out.label')}</FormLabel>
                    <FormControl>
                      <Input type="time" className="text-center px-8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}

              />
            </CardContent>
          </Card>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid md:flex gap-4 md:justify-between">
            <Card className="min-w-full md:min-w-1/2">
              <CardContent>
                <FormField
                  control={form.control}
                  name={`breaks.${index}.breakIn`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('timesheet.[id].edit.fields.breaks.break_in.label')}</FormLabel>
                      <FormControl>
                        <Input type="time" className="text-center px-8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="min-w-full md:min-w-1/2">
              <CardContent>
                <FormField
                  control={form.control}
                  name={`breaks.${index}.breakOut`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('timesheet.[id].edit.fields.breaks.break_out.label')}</FormLabel>
                      <FormControl>
                        <Input type="time" className="text-center px-8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ breakIn: '', breakOut: '' })}
          >
            {t('timesheet.[id].edit.fields.breaks.add_break')}
          </Button>
        </div>

        <div className="grid w-full align-bottom">
          <div className="w-full md:max-w-96 md:justify-self-center">
            {state && (
              <div className="text-red-500">{state.message}</div>
            )}
            <Button type="submit" className="w-full">{isPending ? t('timesheet.[id].edit.save.loading') : t('timesheet.[id].edit.save.cta')}</Button>
          </div>

        </div>
      </form>
    </Form>
  );
};
