import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

// Smart CSV column mapper
function mapCSVHeaderToField(header: string): string {
  const h = header.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['sku', 'productcode', 'code', 'srno', 'materialcode'].includes(h)) return 'code';
  if (['productname', 'name', 'itemname', 'materialdescription', 'description'].includes(h)) return 'name';
  if (['shortname', 'shortdesc', 'short'].includes(h)) return 'shortName';
  if (['brand', 'variant', 'brandvariant'].includes(h)) return 'brand';
  if (['size', 'qty', 'volume', 'weight'].includes(h)) return 'size';
  if (['unit', 'uom'].includes(h)) return 'unit';
  if (['category', 'cat', 'type', 'producttype'].includes(h)) return 'category';
  if (['desc', 'notes', 'materialdesc'].includes(h)) return 'description';
  if (['price', 'mrp', 'cost'].includes(h)) return 'price';
  if (['stock', 'quantity', 'qtyinstock', 'noofqty', 'noofqtyindone'].includes(h)) return 'stock';
  if (['status', 'state', 'donepending'].includes(h)) return 'status';
  if (['imageurl', 'image', 'photo', 'img'].includes(h)) return 'image';
  if (['bottletype', 'bottle', 'packaging', 'bottletypepethdpealucoex'].includes(h)) return 'bottleType';
  if (['labelsize', 'labeltype', 'label'].includes(h)) return 'labelSize';
  if (['cfbsize', 'cfb'].includes(h)) return 'cfbSize';
  return h;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue; }
    current += char;
  }
  result.push(current.trim().replace(/\r/g, ''));
  return result;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.trim().split('\n').filter(l => l.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ success: false, error: 'CSV must have a header and at least one data row' }, { status: 400 });
    }

    const rawHeaders = parseCSVLine(lines[0]);
    const mappedHeaders = rawHeaders.map(mapCSVHeaderToField);

    const db = await readDb();
    const existingCodes = new Set(db.products.map(p => p.code));
    
    const imported: Product[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      try {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        mappedHeaders.forEach((key, idx) => {
          row[key] = values[idx]?.trim() || '';
        });

        const code = row.code || row.sku || `AUTO-${Date.now()}-${i}`;
        const name = row.name || row.productname || '';
        
        if (!name && !code) { errors.push(`Row ${i + 1}: Missing name and code`); continue; }
        if (existingCodes.has(code)) { skipped.push(code); continue; }

        const isCocreate = row.brand?.toUpperCase() === 'COCREATE' || name.toUpperCase().includes('COCREATE');
        const statusRaw = row.status?.toLowerCase() || 'active';
        const status = statusRaw === 'active' ? 'active' : statusRaw === 'discontinued' ? 'discontinued' : 'draft';

        const tags: string[] = [];
        if (row.shortName) tags.push(row.shortName);
        if (row.brand && !['standard', 'cocreate'].includes(row.brand.toLowerCase())) tags.push(row.brand);
        if (row.category) tags.push(row.category);
        if (isCocreate) tags.push('Co-Create');

        const product: Product = {
          id: `PRD-${code}`,
          name,
          code,
          category: row.category || 'Uncategorized',
          tags,
          images: row.image ? [row.image] : [],
          image: row.image || '',
          price: parseFloat(row.price || '0') || 0,
          stock: parseInt(row.stock || '0') || 0,
          specifications: {
            ...(row.size && row.unit ? { Size: `${row.size} ${row.unit}`.trim() } : {}),
            ...(row.bottleType ? { 'Bottle Type': row.bottleType } : {}),
            ...(row.labelSize ? { 'Label Size': row.labelSize } : {}),
            ...(row.cfbSize ? { 'CFB Size': row.cfbSize } : {}),
            ...(row.brand && !['standard', 'cocreate'].includes(row.brand.toLowerCase()) ? { Brand: row.brand } : {}),
          },
          description: row.description || `${name} — ${row.category || ''} product`,
          notes: '',
          instructions: '',
          isCocreate,
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'CSV Import',
          shortName: row.shortName,
          brand: row.brand,
          size: row.size,
          unit: row.unit,
          materialDescription: row.description,
          bottleType: row.bottleType,
          labelSize: row.labelSize,
          cfbSize: row.cfbSize,
        };

        imported.push(product);
        existingCodes.add(code);
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Parse error'}`);
      }
    }

    db.products.push(...imported);
    await writeDb(db);

    return NextResponse.json({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      errors,
      total: lines.length - 1,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to process CSV' }, { status: 500 });
  }
}
