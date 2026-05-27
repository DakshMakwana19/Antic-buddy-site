import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const isCocreate = searchParams.get('isCocreate') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '0'); // 0 = all
  const sortKey = searchParams.get('sortKey') || 'name';
  const sortDir = searchParams.get('sortDir') || 'asc';

  const db = await readDb();
  let products = db.products;

  // Filter
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.code?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.shortName?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
  if (category && category !== 'All') products = products.filter(p => p.category === category);
  if (status && status !== 'All') products = products.filter(p => p.status === status);
  if (isCocreate === 'true') products = products.filter(p => p.isCocreate);
  if (isCocreate === 'false') products = products.filter(p => !p.isCocreate);

  // Sort
  if (sortKey) {
    products = [...products].sort((a, b) => {
      const aVal = String((a as any)[sortKey] ?? '').toLowerCase();
      const bVal = String((b as any)[sortKey] ?? '').toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const total = products.length;

  // Paginate
  if (limit > 0) {
    const start = (page - 1) * limit;
    products = products.slice(start, start + limit);
  }

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: Request) {
  try {
    const product: Product = await req.json();
    const db = await readDb();
    db.products.push(product);
    await writeDb(db);
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to add product' }, { status: 500 });
  }
}
