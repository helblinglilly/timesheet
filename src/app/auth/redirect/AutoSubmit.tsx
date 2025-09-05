'use client';

import { useEffect, useRef } from 'react';

export default function AutoSubmit() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  return <form ref={formRef} id="auto-oauth-form" />;
}
