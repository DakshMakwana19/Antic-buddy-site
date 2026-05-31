import { NextResponse } from 'next/server';
import { connectDB, ProductModel } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const isCocreate = searchParams.get('isCocreate') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '0');
    const sortKey = searchParams.get('sortKey') || 'name';
    const sortDir = searchParams.get('sortDir') || 'asc';

    let query: any = {};

    if (search) {
      const q = new RegExp(search, 'i');
      query.$or = [
        { name: q },
        { code: q },
        { category: q },
        { shortName: q },
        { brand: q },
        { tags: q }
      ];
    }
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (isCocreate === 'true') query.isCocreate = true;
    if (isCocreate === 'false') query.isCocreate = false;

    const total = await ProductModel.countDocuments(query);

    let dbQuery = ProductModel.find(query);

    if (sortKey) {
      dbQuery = dbQuery.sort({ [sortKey]: sortDir === 'asc' ? 1 : -1 });
    }

    if (limit > 0) {
      const start = (page - 1) * limit;
      dbQuery = dbQuery.skip(start).limit(limit);
    }

    const docs = await dbQuery.lean();
    const products = docs.map((doc: any) => {
      const { _id, __v, ...rest } = doc;
      return rest;
    });

    return NextResponse.json({ products, total, page, limit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const product: Product = await req.json();
    await ProductModel.create(product);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to add product', details: error.message }, { status: 500 });
  }
}
