'use client';

import React from 'react';
import { Button } from '~/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="grid justify-center pt-64 p-4">


          <h1 className='text-2xl font-bold pb-2'>Oh oh, something <i>really</i> went wrong!</h1>
          <pre className="max-w-full sm:max-w-1/2">{error.message}</pre>

          <div className='pt-16'>
            <div className='grid gap-4'>
              <h2 className='text-lg'>At this point, you can either:</h2>
              <div className='justify-center grid gap-8'>
                <Button onClick={() => reset()}>Try again</Button>

                <a href="/support">
                  <Button>Visit the support page</Button>
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
