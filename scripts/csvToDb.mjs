// Script to convert CSV to database.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csvText = fs.readFileSync('C:\\Users\\daksh\\Downloads\\products_website_upload.csv', 'utf-8');

const lines = csvText.trim().split('\n').filter(l => l.trim());
const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''));

function parseCSVLine(line) {
  const result = [];
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

const products = [];
for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  if (values.length < 2 || !values[0]) continue;

  const sku = values[0]?.trim() || '';
  const name = values[1]?.trim() || '';
  const shortName = values[2]?.trim() || '';
  const brand = values[3]?.trim() || '';
  const size = values[4]?.trim() || '';
  const unit = values[5]?.trim() || '';
  const category = values[6]?.trim() || 'Uncategorized';
  const description = values[7]?.trim() || '';
  const price = parseFloat(values[8]?.trim() || '0') || 0;
  const stock = parseInt(values[9]?.trim() || '0') || 0;
  const statusRaw = values[10]?.trim() || 'Active';
  const imageUrl = values[11]?.trim() || '';

  const isCocreate = brand === 'COCREATE';
  const status = statusRaw.toLowerCase() === 'active' ? 'active' : statusRaw.toLowerCase() === 'discontinued' ? 'discontinued' : 'draft';

  const tags = [];
  if (shortName) tags.push(shortName);
  if (brand && brand !== 'Standard' && brand !== 'COCREATE') tags.push(brand);
  if (category) tags.push(category);
  if (isCocreate) tags.push('Co-Create');

  products.push({
    id: `PRD-${sku}`,
    name,
    code: sku,
    category,
    tags,
    images: imageUrl ? [imageUrl] : [],
    image: imageUrl || '',
    price,
    stock,
    specifications: {
      ...(size ? { Size: `${size} ${unit}`.trim() } : {}),
      ...(brand && brand !== 'Standard' && brand !== 'COCREATE' ? { Brand: brand } : {}),
    },
    description: description || `${name} — ${category} product`,
    notes: '',
    instructions: '',
    isCocreate,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'CSV Import',
    shortName,
    brand,
    size,
    unit,
    materialDescription: description,
  });
}

const db = {
  products,
  activityLogs: [],
  recognitionLogs: [],
};

const outPath = path.join(__dirname, 'database.json');
fs.writeFileSync(outPath, JSON.stringify(db, null, 2));
console.log(`✅ Imported ${products.length} products to database.json`);
