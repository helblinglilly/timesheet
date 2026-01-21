
import { createTranslation } from '~/i18n/server';
import { Navbar } from '~/features/Navbar/Navbar';

import { AuthMethodsList } from '~/features/Authentication/OAuthProviders';
import { Email } from '~/features/Authentication/Email';
import { getAuthMethods } from '~/features/Authentication/getAuthMethods';

export default async function Login() {
  const { t } = await createTranslation();
  const authMethods = await getAuthMethods();

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
            <AuthMethodsList authMethods={authMethods} />
          </div>

          <div className="grid gap-2">
            <p>{ t('authentication.login.email.section_title') }</p>
            <Email />
          </div>

        </div>
      </div>
    </>
  );
}
