'use client';

import { use } from 'react';
import type { PocketbaseAuthMethods } from '~/pocketbase/builtin.types';
import OAuthMethod from './OAuthMethod';
import { useTranslation } from 'react-i18next';

interface AuthMethodsListProps {
  authMethodsPromise: Promise<(PocketbaseAuthMethods & { authUrl: string })[]>;
}

export function AuthMethodsList({ authMethodsPromise }: AuthMethodsListProps) {
  const authMethods = use(authMethodsPromise);
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 w-full">
      <p className="">{t('authentication.login.social')}</p>

      {authMethods.map((authMethod) => (
        <OAuthMethod authMethod={authMethod} key={authMethod.name} />
      ))}
    </div>
  );
}
