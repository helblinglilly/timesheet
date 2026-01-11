'use server';

import { formSchema } from './form.schema';
import { createTranslation } from '~/i18n/server';
import Pocketbase from 'pocketbase';
import { withNewRelicWebTransaction } from '~/utils/observability/withNewRelicWebTransaction';
import { redirect } from 'next/navigation';
import newrelic from 'newrelic';
import { TableNames } from '~/pocketbase/tables.types';
import z from 'zod';
import { env } from '~/env';
import type { PBAuthResponse } from '~/pocketbase/builtin.types';
import { cookies } from 'next/headers';
import { authDataToCookie } from '~/pocketbase/auth';

export interface SignupFormState {
  errors: string[];
  properties?: {
    email?: { errors: string[]; } | undefined;
    password?: { errors: string[]; } | undefined;
    passwordConfirm?: { errors: string[]; } | undefined;
  } | undefined;
}

async function createUser(formData: FormData): Promise<SignupFormState> {
  const { t } = await createTranslation();
  const cookieStore = await cookies();
  const schema = formSchema(t);

  const values = {
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm')
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const { error } = parsed;
    return z.treeifyError(error)
  }

  try {
    const pb = new Pocketbase(env.POCKETBASE_URL);

    await pb.collection(TableNames.User).create({
      'email': parsed.data.email,
      'password': parsed.data.password,
      'passwordConfirm': parsed.data.passwordConfirm,
    });


    const authData = (await pb
      .collection(TableNames.User)
      .authWithPassword(
        parsed.data.email,
        parsed.data.password
      )) as PBAuthResponse;

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    cookieStore.set(
      'pb_auth',
      JSON.stringify(authDataToCookie(authData)),
      {
        sameSite: 'lax',
        path: '/',
        expires,
      },
    );
  } catch (err) {
    const pbError = err instanceof Error ? err.message : 'Unknown';
    newrelic.noticeError(new Error(`Failed to sign up new user with Email/Password with error ${pbError}`));
    return { errors: [t('authentication.signup.errors.generic')] };
  }

  redirect('/dashboard');
}

export async function createUserWithState(
  _prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  return await withNewRelicWebTransaction('auth/signup', () => createUser(formData));
}
