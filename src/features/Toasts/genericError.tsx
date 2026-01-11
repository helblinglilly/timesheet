'use client'
import { t } from 'i18next';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useDomainConfig } from '~/hooks/useDomainConfig';


export function useSonarTriggers() {
  const router = useRouter();
  const { hasFullSetup } = useDomainConfig();
  const errorSonarr = useMemo(() => {
    return {
      main: t('common.support.toast.main'),
      description: hasFullSetup ? t('common.support.toast.description') :  t('common.support.toast.description_no_support'),
      action: t('common.support.toast.link.label')
    }
  }, [hasFullSetup])


  const genericError = () => {
    toast.error(errorSonarr.main, {
      description: errorSonarr.description,
      action: hasFullSetup ? {
        label: errorSonarr.action,
        onClick: () => {
          router.push(t('common.support.toast.link.slug'))
        },
      } : undefined,

    })
  }
  return {
    triggerGenericError: genericError
  };
}
