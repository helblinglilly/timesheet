'use client';

import type { PocketbaseAuthMethods } from '~/pocketbase/builtin.types';
import OAuthMethod from './OAuthMethod';
import { useTranslation } from 'react-i18next';

interface AuthMethodsListProps {
  authMethods: (PocketbaseAuthMethods & { authUrl: string })[];
}

export function AuthMethodsList({ authMethods }: AuthMethodsListProps) {
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
