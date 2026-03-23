import '~/styles/globals.css';

import { type Metadata } from 'next';
import { Geist } from 'next/font/google';

import { TranslationProvider } from '~/i18n/TranslationProvider';
import { TRPCReactProvider } from '~/trpc/react';
import Script from 'next/script';
import { TickProvider } from '~/hooks/useTick';
import { AuthInfoProvider } from '~/hooks/useAuthInfo';
import { serverSideAuth } from '~/pocketbase/server';
import type { PBAuthResponse } from '~/pocketbase/builtin.types';
import { getDomainConfig } from '~/features/domain';
import { DomainConfigProvider } from '~/hooks/useDomainConfig';
import { getBrowserTimingHeader } from '~/utils/observability/newrelic-server';

export const metadata: Metadata = {
  title: 'Timesheet',
  description: 'Your time is valuable. Track it',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'icon', url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
  ],
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
  const browserAgentScript = getBrowserTimingHeader();

  const pb = await serverSideAuth();
  const domainConfig = getDomainConfig();

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning={true}>

      {
        domainConfig.hasAnalytics && (
          <>
            <Script
              id="nr-spa"
              src="/newrelic-spa.js"
              strategy="beforeInteractive"
            />

            {browserAgentScript && (
              <Script
                id="nr-browser-agent"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: browserAgentScript }}
              />
            )}

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
              <DomainConfigProvider values={domainConfig}>
                <TickProvider>
                  {children}
                </TickProvider>
              </DomainConfigProvider>
            </AuthInfoProvider>
          </TranslationProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
