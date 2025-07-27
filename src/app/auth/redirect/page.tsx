"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { handleOAuthRedirect } from "./actions";

export default function RedirectPage() {
  const { t } = useTranslation();
  const params = useSearchParams();

  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const state = params.get('state') ?? '';
  const code = params.get('code') ?? '';


  async function onSubmit(formData: FormData) {
    const res = await handleOAuthRedirect(formData);
    setResult(res);
  }

  useEffect(() => {
    if (formRef.current && !result) {
      formRef.current.requestSubmit();
    }
  }, [result]);

  useEffect(() => {
    if (result){
      window.location.replace(result.success ? '/dashboard' : '/auth/login')
    }
  }, [result])

  return (
    <div>
      <h1>{t('authentication.signing_in')}</h1>
      {result?.success ? (
        <div>
          <h2>{t('authentication.redirecting')}</h2>
        </div>
      ) : (
        <form ref={formRef} action={onSubmit}>
          <input type="hidden" name="state" value={state} />
          <input type="hidden" name="code" value={code} />
        </form>
      )}
    </div>
  );
}
