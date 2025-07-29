"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { type z } from "zod"

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { formSchema } from "./form.schema"



export default function NewTimesheetPage() {
  const { t } = useTranslation();
  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
     resolver: zodResolver(formSchema(t)),
     defaultValues: {
       name: "",
       minutesPerDay: {
         hours: undefined,
         minutes: undefined
       },
       daysPerWeek: undefined,
       unpaidLunchMinutes: undefined,
       paidLunchMinutes: undefined,
     },
   });

  function onSubmit(){
    console.log('submitting');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ t('timesheet.new.fields.name.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('timesheet.new.fields.name.placeholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('timesheet.new.fields.name.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormLabel className="text-xl mb-2">{ t('timesheet.new.hours_worked')}</FormLabel>
        <FormDescription>{ t('timesheet.new.hours_worked_description')}</FormDescription>

        <FormLabel className="mb-2">{ t('timesheet.new.fields.minutesPerDay.label')}</FormLabel>
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

        <FormLabel className="text-xl mb-2">{ t('timesheet.new.fields.breaks.label')}</FormLabel>
        <FormDescription>{ t('timesheet.new.fields.breaks.description')}</FormDescription>

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

        <FormDescription className="">{ t('timesheet.new.required')}</FormDescription>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
