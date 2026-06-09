import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const content = await db.getLandingContent();
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const content = await req.json();
    await db.updateLandingContent(content);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
