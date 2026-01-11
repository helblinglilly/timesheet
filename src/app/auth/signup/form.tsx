/** eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { Card, CardContent } from '~/components/ui/card';
import { createUserWithState, type SignupFormState } from './action';

export default function CreateNewUserForm() {
  const { t } = useTranslation();
  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      email: undefined,
      password: undefined,
      passwordConfirm: undefined,
    },
  });

  const [state, formAction, isPending] = useActionState<SignupFormState, FormData>(createUserWithState, {
    errors: [],
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('passwordConfirm', data.passwordConfirm)

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full md:justify-self-center">
        <Card>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>{ t('authentication.signup.fields.email.title')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('authentication.signup.fields.email.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>{t('authentication.signup.fields.password.title')}</FormLabel>
                    <FormDescription>{t('authentication.signup.fields.password.requirements_hint')}</FormDescription>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>{t('authentication.signup.fields.passwordConfirm.title')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid w-full">
          <div className="w-full md:max-w-96 md:justify-self-center">
            {
              state?.errors && state.errors.length > 0 && (
                <div className="text-red-500">
                  {state.errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            <Button type="submit" className="w-full">{isPending ? t('authentication.signup.cta.loading') : t('authentication.signup.cta.submit')}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
