import { NextResponse } from 'next/server';
import { connectDB, ProductModel } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await connectDB();
    const newProducts: Product[] = await req.json();
    
    if (!Array.isArray(newProducts)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 });
    }

    const bulkOps = newProducts.map((p) => ({
      updateOne: {
        filter: { code: p.code },
        update: { $set: p },
        upsert: true,
      }
    }));

    if (bulkOps.length > 0) {
      await ProductModel.bulkWrite(bulkOps);
    }
    
    return NextResponse.json({ success: true, count: newProducts.length });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to bulk import products" }, { status: 500 });
  }
}
