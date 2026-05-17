import fs from 'fs';

let content = fs.readFileSync('temp_data.ts', 'utf16le'); // Read as UTF-16LE because of PowerShell >

// Strip BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

// Fallback to utf-8 if it's not actually utf-16
if (content.includes('import') === false && fs.readFileSync('temp_data.ts', 'utf-8').includes('import')) {
  content = fs.readFileSync('temp_data.ts', 'utf-8');
}

// Remove imports
content = content.replace(/import .*?;\n/g, '');
content = content.replace(/import { Product, ActivityLog, RecognitionLog } from '@\/types';/g, '');

// Convert export const to const
content = content.replace(/export const /g, 'const ');

// Remove type annotations
content = content.replace(/const products: Product\[\]/g, 'const products');
content = content.replace(/const activityLogs: ActivityLog\[\]/g, 'const activityLogs');
content = content.replace(/const recognitionLogs: RecognitionLog\[\]/g, 'const recognitionLogs');

const script = `
const fs = require('fs');
${content}

const newProducts = products.map(p => ({
  id: p.id,
  name: p.name,
  code: p.code,
  category: p.category,
  tags: [p.subcategory].filter(Boolean),
  images: p.image ? [p.image] : [],
  image: p.image || '',
  price: 9.99, // default
  stock: p.quantity,
  specifications: {
    "Bottle Type": p.bottleType,
    "Label Type": p.labelType,
    "Packaging Type": p.packagingType,
    "Size": p.size,
    "Color": p.color
  },
  description: p.description,
  notes: p.notes,
  instructions: p.instructions,
  isCocreate: p.isCocreate,
  status: p.status,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
  createdBy: 'Admin'
}));

const db = {
  products: newProducts,
  activityLogs: activityLogs,
  recognitionLogs: recognitionLogs
};

fs.writeFileSync('database.json', JSON.stringify(db, null, 2));
console.log('Conversion complete!');
`;

fs.writeFileSync('temp_script.js', script);
