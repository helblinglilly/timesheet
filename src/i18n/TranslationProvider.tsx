'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '~/i18n/client';

interface TranslationProviderProps {
  children: ReactNode;
  locale: string;
}

export function TranslationProvider({
  children,
  locale,
}: TranslationProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the language for client-side i18next
    if (i18next.language !== locale) {
      void i18next.changeLanguage(locale);
    }
    setIsClient(true);
  }, [locale]);

  // We only want to render the children when we're in the browser
  // to avoid hydration mismatch errors
  if (!isClient) {
    return null;
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
