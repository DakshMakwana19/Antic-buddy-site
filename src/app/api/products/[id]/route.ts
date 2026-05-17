import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const db = await readDb();
    
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    db.products[index] = { ...db.products[index], ...updates };
    await writeDb(db);
    
    return NextResponse.json({ success: true, product: db.products[index] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await readDb();
    
    db.products = db.products.filter(p => p.id !== id);
    await writeDb(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
