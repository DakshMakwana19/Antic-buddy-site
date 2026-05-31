import { NextResponse } from 'next/server';
import { connectDB, ProductModel } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const updates = await req.json();
    
    const updated = await ProductModel.findOneAndUpdate({ id }, updates, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    
    const { _id, __v, ...product } = updated as any;
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    await ProductModel.deleteOne({ id });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}
