import { NextResponse, type NextRequest } from 'next/server';
import { fallbackLng, languages } from './src/i18n/settings';

export async function middleware(request: NextRequest) {
  // Get pathname from the URL
  const { pathname } = request.nextUrl;

  // Skip if the request is for an asset, API route, or other excluded paths
  if (
    /\.(ico|jpg|jpeg|png|svg|css|js|woff|woff2)$/i.test(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a supported locale
  const pathnameHasLocale = languages.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = fallbackLng;
  const newUrl = new URL(
    `/${locale}${pathname === '/' ? '' : pathname}`,
    request.url
  );

  return NextResponse.redirect(newUrl);
}

export const config = {
  // Skip paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
