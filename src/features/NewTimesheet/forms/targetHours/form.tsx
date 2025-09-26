'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type z } from 'zod';
import { startTransition, useActionState } from 'react';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { formSchema } from './form.schema';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { createTimesheetWithState, type TimesheetFormState } from './action';

export default function NewTargetHoursTimesheet() {
  const { t } = useTranslation();
  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      name: '',
      minutesPerDay: {
        hours: undefined,
        minutes: undefined,
      },
      daysPerWeek: undefined,
      unpaidLunchMinutes: undefined,
      paidLunchMinutes: undefined,
    },
  });

  const [state, formAction, isPending] = useActionState<TimesheetFormState, FormData>(createTimesheetWithState, {});

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('minutesPerDay.hours', (data.minutesPerDay.hours ??  '').toString());
    formData.append('minutesPerDay.minutes', (data.minutesPerDay.minutes ?? '').toString());
    formData.append('daysPerWeek', (data.daysPerWeek ?? '').toString());
    formData.append('unpaidLunchMinutes', (data.unpaidLunchMinutes ?? '').toString());
    formData.append('paidLunchMinutes', (data.paidLunchMinutes ?? '').toString());

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:max-w-1/2 md:justify-self-center">
        <Card>
          <CardHeader>
            <FormLabel className="text-xl">{ t('timesheet.new.fields.meta.title')}</FormLabel>
          </CardHeader>

          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>{ t('timesheet.new.fields.name.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('timesheet.new.fields.name.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FormLabel className="text-xl mb-2">{ t('timesheet.new.hours_worked')}</FormLabel>
            <FormDescription>{ t('timesheet.new.hours_worked_description')}</FormDescription>

          </CardHeader>
          <CardContent className="gap-4 grid">

            <FormLabel>{ t('timesheet.new.fields.minutesPerDay.label')}</FormLabel>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="minutesPerDay.hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ t('timesheet.new.fields.minutesPerDay.hours.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('timesheet.new.fields.minutesPerDay.hours.placeholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutesPerDay.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('timesheet.new.fields.minutesPerDay.minutes.label')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t('timesheet.new.fields.minutesPerDay.minutes.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="daysPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('timesheet.new.fields.daysPerWeek.label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('timesheet.new.fields.daysPerWeek.placeholder')} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('timesheet.new.fields.daysPerWeek.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FormLabel className="text-xl mb-2">{ t('timesheet.new.fields.breaks.label')}</FormLabel>
            <FormDescription>{ t('timesheet.new.fields.breaks.description')}</FormDescription>

          </CardHeader>

          <CardContent>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="unpaidLunchMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('timesheet.new.fields.breaks.unpaid.label')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t('timesheet.new.fields.breaks.unpaid.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('timesheet.new.fields.breaks.unpaid.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidLunchMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('timesheet.new.fields.breaks.paid.label')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={t('timesheet.new.fields.breaks.paid.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('timesheet.new.fields.breaks.paid.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
