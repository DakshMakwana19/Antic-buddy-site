import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.products);
}

export async function POST(req: Request) {
  try {
    const product = await req.json();
    const db = await readDb();
    
    // Add product
    db.products.push(product);
    await writeDb(db);
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 });
  }
}
