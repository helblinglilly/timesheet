'use client';

export const setCookieClient = (
  name: string,
  value: string,
  overrideOptions?: {
    'expires'?: Date;
    'path'?: string;
    'SameSite'?: 'Lax';
    'max-age'?: number;
  },
) => {
  let expires = new Date();
  expires.setDate(expires.getDate() + 90);

  if (overrideOptions?.expires) {
    expires = overrideOptions.expires;
  }

  const options = {
    path: '/',
    expires: overrideOptions?.expires ?? expires,
    SameSite: 'Lax',
    ...overrideOptions,
  };

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const [key, value] of Object.entries(options)) {
    updatedCookie += `; ${key}=${value.toString()}`;
  }
  document.cookie = updatedCookie;
};

export const getCookieClient = (name: string) => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const matches = new RegExp(
    '(?:^|; )'
    + name.replace(/([.$?*|{}()[\]/+^])/g, '\\$1')
    + '=([^;]*)',
  ).exec(document.cookie);
  return matches ? decodeURIComponent(matches[1] ?? '') : undefined;
};

export const deleteCookieClient = (name: string, path = '/') => {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
