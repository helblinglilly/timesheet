import { NextResponse } from 'next/server';
import { env } from '~/env';
import log from '~/utils/log';

export async function GET() {
  let pocketbaseOnline = false;

  try {
    const res = await fetch(env.POCKETBASE_URL + '/api/health');
    pocketbaseOnline = res.status === 200;
  } catch (err) {
    log.error('Backend offline', err);
  }

  if (pocketbaseOnline) {
    return NextResponse.json({ status: 'ok' });
  } else {
    return NextResponse.json({ status: 'degraded', message: 'Backend unreachable' }, { status: 206 });
  }

}
