'use server';

import { headers } from 'next/headers';
import { env } from '~/env';
import type { PocketbaseAuthMethods } from '~/pocketbase/builtin.types';
import OAuthMethod from './OAuthMethods';
import { createTranslation } from '~/i18n/server';

export default async function Login() {
  const res = await fetch(
    `${env.POCKETBASE_URL}/api/collections/users/auth-methods`,
  );
  const { t } = await createTranslation();

  if (!res.ok) {
    throw new Error(`Non-200 status code ${res.status}`);
  }

  const body = await res.json() as { authProviders: PocketbaseAuthMethods[] };
  const authMethods = body.authProviders;

  const headersList = await headers();

  const mappedAuthMethods = authMethods.map((method) => {
    return {
      ...method,
      authUrl: `${method.authUrl}${headersList.get('x-forwarded-proto')}://${headersList.get('host')}/auth/redirect`,
    };
  });

  return (
    <>
      <div className="p-4">
        <p className="text-2xl">{ t('authentication.login.title') }</p>
        <p className="text-lg">{ t('authentication.login.tagline') }</p>
        <p className="pt-4">{t('authentication.login.social')}</p>
      </div>
      <div className="px-4 w-full flex justify-center">
        <div className="grid gap-4 w-full md:w-[50%] max-w-[600px]">
          {mappedAuthMethods.map((authMethod) => {
            return <OAuthMethod authMethod={authMethod} key={authMethod.name} />;
          })}
        </div>
      </div>
    </>
  );
}
