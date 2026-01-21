'use server'

import { redirect} from 'next/navigation';
import { env } from '~/env';

import { serverSideAuth } from '~/pocketbase/server';

export default async function Home() {
  const pb = await serverSideAuth();

  if (pb.authStore.isValid) {
    redirect('/dashboard');
  }


  if (env.KIOSK_MODE !== true) {
    redirect('/auth/login')
  }

  return (
    <p>Homepage</p>
  )
}
