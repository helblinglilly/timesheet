import '~/styles/globals.css';

import newrelic from 'newrelic';
import { type Metadata } from 'next';
import { Geist } from 'next/font/google';

import { TranslationProvider } from '~/i18n/TranslationProvider';
import { TRPCReactProvider } from '~/trpc/react';
import { env } from '~/env';
import Script from 'next/script';
import { TickProvider } from '~/hooks/useTick';
import { AuthInfoProvider } from '~/hooks/useAuthInfo';
import { serverSideAuth } from '~/pocketbase/server';
import type { PBAuthResponse } from '~/pocketbase/builtin.types';

export const metadata: Metadata = {
  title: 'Timesheet',
  description: 'Your time is valuable. track it',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const browserTimingHeader: string = newrelic.getBrowserTimingHeader({
    hasToRemoveScriptWrapper: true,
    allowTransactionlessInjection: true,
  });

  const pb = await serverSideAuth();

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning={true}>
      {
        env.NODE_ENV === 'production' && (
          <>
            <Script
              id="nr-browser-agent"
              dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
            />

            <Script
              src="https://analytics.helbling.uk/script.js"
              data-website-id="78d18f80-ac24-487d-8545-9e22266159b3"
              strategy="afterInteractive"
            />

            <Script id="outbound-link-tracking" strategy="afterInteractive">
              {`
                (() => {
                  const name = 'outbound-link-click';
                  document.querySelectorAll('a').forEach(a => {
                    if (a.host !== window.location.host && !a.getAttribute('data-umami-event')) {
                      a.setAttribute('data-umami-event', name);
                      a.setAttribute('data-umami-event-url', a.href);
                    }
                  });
                })();
              `}
            </Script>
          </>
        )
      }

      <body>
        <TRPCReactProvider>
          <TranslationProvider locale="en">
            <AuthInfoProvider user={pb.authStore.record ? {
              id: (pb.authStore.record as PBAuthResponse['record']).id,
              email: (pb.authStore.record as PBAuthResponse['record']).email,
              name: (pb.authStore.record as PBAuthResponse['record']).name
            } : undefined}>
              <TickProvider>
                {children}
              </TickProvider>
            </AuthInfoProvider>
          </TranslationProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
