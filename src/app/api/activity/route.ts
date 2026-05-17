import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.activityLogs);
}

export async function POST(req: Request) {
  try {
    const log = await req.json();
    const db = await readDb();
    
    db.activityLogs.unshift(log); // Add to beginning
    await writeDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
