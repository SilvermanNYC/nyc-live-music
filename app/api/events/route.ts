import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents } from '../../../lib/sources/aggregate';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const force = req.nextUrl.searchParams.get('refresh') === '1';
  try {
    const result = await getAllEvents(force);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
