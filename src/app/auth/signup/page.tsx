import { Navbar } from '~/features/Navbar/Navbar';
import { createTranslation } from '~/i18n/server';
import CreateNewUserForm from './form';
import { AuthMethodsList } from '~/features/Authentication/OAuthProviders';
import { getAuthMethods } from '~/features/Authentication/getAuthMethods';

export default async function Signup() {
  const { t } = await createTranslation();
  const authMethods = await getAuthMethods();

  return (
    <>
      <Navbar />
      <div className='px-2 pt-8 grid gap-4 justify-center w-full'>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <p className="text-3xl font-semibold">{t('authentication.signup.title')}</p>
          </div>


          <div className="grid gap-8">
            <div>
              <AuthMethodsList authMethods={authMethods} />
            </div>

            <div className="grid gap-2">
              <p>{t('authentication.signup.email_title')}</p>

              <CreateNewUserForm />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
