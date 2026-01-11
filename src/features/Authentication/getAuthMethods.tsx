import type { PocketbaseAuthMethods } from '~/pocketbase/builtin.types';
import { headers } from 'next/headers';
import { env } from '~/env';

export async function getAuthMethods() {
  const res = await fetch(
    `${env.POCKETBASE_URL}/api/collections/users/auth-methods`,
  );

  if (!res.ok) {
    throw new Error(`Non-200 status code ${res.status}`);
  }

  const body = await res.json() as { authProviders: PocketbaseAuthMethods[] };
  const headersList = await headers();

  return body.authProviders.map((method) => ({
    ...method,
    authUrl: `${method.authUrl}${headersList.get('x-forwarded-proto')}://${headersList.get('host')}/auth/redirect`,
  }));
}
