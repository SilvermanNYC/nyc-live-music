import { NextResponse } from 'next/server';
import { refreshAllEvents } from '../../../lib/sources/aggregate';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET() {
  try {
    const events = await refreshAllEvents();
    return NextResponse.json({ ok: true, count: events.length, refreshedAt: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  }
}
