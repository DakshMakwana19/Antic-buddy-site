import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.recognitionLogs);
}

export async function POST(req: Request) {
  try {
    const log = await req.json();
    const db = await readDb();
    
    db.recognitionLogs.unshift(log); // Add to beginning
    db.recognitionLogs = db.recognitionLogs.slice(0, 1000);
    await writeDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
