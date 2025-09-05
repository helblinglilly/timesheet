import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';
import { authDataToCookie } from '~/pocketbase/auth';
import { serverSideAuth } from '~/pocketbase/server';
import { TableNames } from '~/pocketbase/tables.types';

export async function GET(_request: NextRequest) {
  const pb = await serverSideAuth();

  const successfulResponse = new NextResponse(null, { status: 200 });
  try {
    const authData = await pb.collection(TableNames.User).authRefresh();

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    successfulResponse.cookies.set(
      'pb_auth',
      JSON.stringify(authDataToCookie(authData)),
      {
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires,
      },
    );

    return successfulResponse;
  }
  catch {
    return new NextResponse(null, { status: 401 });
  }
}
