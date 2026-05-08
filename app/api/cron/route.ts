import { NextRequest, NextResponse } from 'next/server';
import { refreshAllEvents } from '../../../lib/sources/aggregate';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  // If CRON_SECRET is set, require it. Vercel Cron sends it automatically
  // via the Authorization header. For manual calls (curl), pass the secret.
  // If unset, the endpoint is open — fine for personal projects.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const events = await refreshAllEvents();
    return NextResponse.json({ ok: true, count: events.length, refreshedAt: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
