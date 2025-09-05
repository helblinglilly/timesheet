import { redirect } from 'next/navigation';
import { serverSideAuth } from '~/pocketbase/server';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pb = await serverSideAuth();

  if (!pb.authStore.isValid) {
    redirect('/auth/login');
  }

  return (
    <>
      {children}
    </>
  );
}
