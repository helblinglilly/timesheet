'use server'

import { redirect } from 'next/navigation';
import { env } from '~/env';

import { serverSideAuth } from '~/pocketbase/server';
import { KioskLandingPage } from '~/features/Kiosk/LandingPage';

export default async function Home() {
  const pb = await serverSideAuth();

  if (pb.authStore.isValid) {
    redirect('/dashboard');
  }

  if (env.KIOSK_MODE !== true) {
    redirect('/auth/login')
  }

  return (
    <KioskLandingPage />
  )
}
