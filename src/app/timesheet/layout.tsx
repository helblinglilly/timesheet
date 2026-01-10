import { redirect } from 'next/navigation';
import { Toaster } from '~/components/ui/sonner';
import { Navbar } from '~/features/Navbar/Navbar';
import { serverSideAuth } from '~/pocketbase/server';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pb = await serverSideAuth();

  if (!pb.authStore.isValid) {
    redirect('/auth/login');
  }

  return (
    <>
      <Navbar />
      <Toaster
        invert={true}
        richColors={true}
        duration={3000}
        swipeDirections={[
          'right'
        ]}
      />
      {children}
    </>
  );
}
