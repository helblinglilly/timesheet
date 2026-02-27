
import { createTranslation } from '~/i18n/server';
import { Navbar } from '~/features/Navbar/Navbar';

import { AuthMethodsList } from '~/features/Authentication/OAuthProviders';
import { Email } from '~/features/Authentication/Email';
import { getAuthMethods } from '~/features/Authentication/getAuthMethods';
import { Suspense } from 'react';

async function AuthMethods() {
  const { t } = await createTranslation();

  try {
    const authMethods = await getAuthMethods();
    return (
      <div className='grid gap-4'>
        <AuthMethodsList authMethods={authMethods} />

        <div className="grid gap-2">
          <p>{ t('authentication.login.email.section_title') }</p>
        </div>
        <Email />
      </div>
    );

  } catch (err) {
    const fullError = new Error('/auth/login Failed to fetch auth methods on login page', {
      cause: err
    })
    fullError.name = 'AuthMethodFetchFail';

    // eslint-disable-next-line no-console
    console.error(fullError);

    return (
      <div className='bg-red-200 p-4 mt-8 px-8 grid gap-2 rounded-sm md:max-w-2/3 mx-auto'>
        <div className='pb-16'>
          <h2 className='text-xl font-bold '>{t('authentication.login.error.title')}</h2>
          <p>{ t('authentication.login.error.error_explainer') }</p>
          <p>{ t('authentication.login.error.error_impact') }</p>
        </div>

        <section>
          <h3 className='text-lg font-semibold'>{ t('authentication.login.error.heading_user') }</h3>
          <p>{t('authentication.login.error.action_user')}</p>
        </section>

        <section className="pt-8">
          <h3 className='text-lg font-semibold'>{t('authentication.login.error.heading_admin')}</h3>
          <p>{ t('authentication.login.error.action_admin') }</p>
        </section>
      </div>
    )
  }

}

export default async function Login() {
  const { t } = await createTranslation();

  return (
    <>
      <Navbar />
      <div className='px-2 pt-8 grid gap-4 justify-center w-full'>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <p className="text-3xl font-semibold">{t('authentication.login.title')}</p>
            <p className="text">{t('authentication.login.tagline')}</p>
          </div>

          <div>
            <Suspense fallback={(
              <p>{ t('authentication.login.loading_methods') }</p>
            )}>
              <AuthMethods />
            </Suspense>
          </div>

        </div>
      </div>
    </>
  );
}
