'use server';

import { cookies } from 'next/headers';
import Pocketbase from 'pocketbase';
import { env } from '~/env';
import type { PBAuthResponse } from './builtin.types';

export async function serverSideAuth() {
  const pb = new Pocketbase(env.POCKETBASE_URL);
  // Handled by react query
  pb.autoCancellation(false);

  const allCookies = await cookies();
  const pbCookie = allCookies.get('pb_auth');

  if (pbCookie) {
    const data = JSON.parse(pbCookie.value) as PBAuthResponse;
    pb.authStore.save(data.token, data.record || data.meta);
  }

  return pb;
}

export async function superuserAuth(){
  const pb = new Pocketbase(env.POCKETBASE_URL);
  // Handled by react query
  pb.autoCancellation(false);

  await pb.collection('_superusers').authWithPassword(env.POCKETBASE_SUPERUSER_EMAIL, env.POCKETBASE_SUPERUSER_PASSWORD)

  return pb;
}
