import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const newProducts: Product[] = await req.json();
    
    if (!Array.isArray(newProducts)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 });
    }

    const db = await readDb();
    
    const existingCodes = new Map(db.products.map((p, index) => [p.code, index]));
    
    for (const p of newProducts) {
      if (existingCodes.has(p.code)) {
        const idx = existingCodes.get(p.code)!;
        db.products[idx] = { ...db.products[idx], ...p };
      } else {
        db.products.unshift(p);
      }
    }
    
    await writeDb(db);
    
    return NextResponse.json({ success: true, count: newProducts.length });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to bulk import products" }, { status: 500 });
  }
}
