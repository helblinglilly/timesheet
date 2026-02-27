'use server';

import { Navbar } from '~/features/Navbar/Navbar';
import { createTranslation } from '~/i18n/server';
import { Content } from './SupportContent';
import { env } from '~/env';

export default async function SupportPage() {
  const { t } = await createTranslation();


  return (
    <>
      <Navbar />
      <main className='grid justify-center pt-64 p-4'>
        <div className="md:max-w-2/3 grid gap-4 justify-center mx-auto">

          <Content supportEmail={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            env.SUPPORT_EMAIL
          } />

          <div className='block pt-8'>
            <p>{t('support.github.copy')} {' '}
              <a
                href={t('support.github.link')}
                className="underline"
              >{t('support.github.github')}</a>
            </p>
          </div>
        </div>

      </main>
    </>
  )

}
