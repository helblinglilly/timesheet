'use client'
import { t } from 'i18next';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';


export function useSonarTriggers() {
  const router = useRouter();
  const errorSonarr = useMemo(() => {
    return {
      main: t('common.support.toast.main'),
      description: t('common.support.toast.description'),
      action: t('common.support.toast.link.label')
    }
  }, [])


  const genericError = () => {
    toast.error(errorSonarr.main, {
      description: errorSonarr.description,
      action: {
        label: errorSonarr.action,
        onClick: () => {
          router.push(t('common.support.toast.link.slug'))
        },
      },

    })
  }
  return {
    triggerGenericError: genericError
  };
}
