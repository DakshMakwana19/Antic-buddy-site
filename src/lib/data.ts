import { Product, ActivityLog, RecognitionLog } from '@/types';

export const products: Product[] = [
  {
    id: 'PRD-001', name: 'AquaPure Crystal 500ml', code: 'APC-500',
    category: 'Beverages', subcategory: 'Water',
    bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 24-pack',
    size: '500ml', color: 'Clear', quantity: 12400, description: 'Premium purified drinking water in crystal-clear PET bottle with holographic label.',
    notes: 'Best seller. Handle with care during summer — expand slightly in heat.', instructions: 'Stack max 5 cartons high. Store in cool dry area.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-01-15', updatedAt: '2026-05-10',
  },
  {
    id: 'PRD-002', name: 'AquaPure Crystal 1L', code: 'APC-1000',
    category: 'Beverages', subcategory: 'Water',
    bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack',
    size: '1L', color: 'Clear', quantity: 8200, description: 'Premium purified drinking water — 1 litre family size.',
    notes: 'Same label design as 500ml. Different carton.', instructions: 'Stack max 4 cartons high.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-01-15', updatedAt: '2026-05-08',
  },
  {
    id: 'PRD-003', name: 'FreshSqueeze Orange Juice', code: 'FSO-350',
    category: 'Beverages', subcategory: 'Juice',
    bottleType: 'Glass Square', labelType: 'Paper Wrap', packagingType: 'Crate 6-pack',
    size: '350ml', color: 'Amber', quantity: 3600, description: 'Cold-pressed orange juice in premium glass bottle.',
    notes: 'Fragile! Glass bottles. Use foam dividers.', instructions: 'Keep refrigerated. Shelf life 14 days.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-02-01', updatedAt: '2026-05-12',
  },
  {
    id: 'PRD-004', name: 'FreshSqueeze Mango Nectar', code: 'FSM-350',
    category: 'Beverages', subcategory: 'Juice',
    bottleType: 'Glass Square', labelType: 'Paper Wrap', packagingType: 'Crate 6-pack',
    size: '350ml', color: 'Golden Yellow', quantity: 2800, description: 'Tropical mango nectar in premium glass bottle.',
    notes: 'Seasonal product. High demand March–June.', instructions: 'Keep refrigerated. Shelf life 14 days.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-02-01', updatedAt: '2026-05-11',
  },
  {
    id: 'PRD-005', name: 'VitaBoost Energy Drink', code: 'VBE-250',
    category: 'Beverages', subcategory: 'Energy',
    bottleType: 'Aluminum Can', labelType: 'Direct Print', packagingType: 'Tray 24-pack',
    size: '250ml', color: 'Neon Green', quantity: 18500, description: 'High-caffeine energy drink with taurine and B-vitamins.',
    notes: 'Do NOT shake before opening. Pressurized.', instructions: 'Store upright. Avoid direct sunlight.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-01-20', updatedAt: '2026-05-14',
  },
  {
    id: 'PRD-006', name: 'HerbalEase Green Tea', code: 'HGT-500',
    category: 'Beverages', subcategory: 'Tea',
    bottleType: 'PET Square', labelType: 'Self-Adhesive', packagingType: 'Shrink Wrap 12-pack',
    size: '500ml', color: 'Light Green', quantity: 6700, description: 'Organic green tea with honey and lemon.',
    notes: 'New product line. Premium shelf placement.', instructions: 'Store below 25°C. Keep away from strong odors.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-03-01', updatedAt: '2026-05-09',
  },
  {
    id: 'PRD-007', name: 'CleanWash Pro Detergent', code: 'CWP-1000',
    category: 'Home Care', subcategory: 'Laundry',
    bottleType: 'HDPE Round', labelType: 'Self-Adhesive', packagingType: 'Individual Box',
    size: '1L', color: 'Blue', quantity: 4200, description: 'Professional-grade liquid laundry detergent.',
    notes: 'Chemical product — keep separate from food items.', instructions: 'Do not stack more than 3 high. Keep upright.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-02-15', updatedAt: '2026-05-07',
  },
  {
    id: 'PRD-008', name: 'CleanWash Pro Detergent 2L', code: 'CWP-2000',
    category: 'Home Care', subcategory: 'Laundry',
    bottleType: 'HDPE Round', labelType: 'Self-Adhesive', packagingType: 'Individual Box',
    size: '2L', color: 'Blue', quantity: 2100, description: 'Professional-grade liquid laundry detergent — economy size.',
    notes: 'Heavy. Use pallet for transport.', instructions: 'Do not stack more than 2 high. Keep upright.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-02-15', updatedAt: '2026-05-06',
  },
  {
    id: 'PRD-009', name: 'GlowSkin Hand Wash', code: 'GSH-250',
    category: 'Personal Care', subcategory: 'Hand Wash',
    bottleType: 'PET Pump', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack',
    size: '250ml', color: 'Pink', quantity: 9800, description: 'Antibacterial hand wash with moisturizing formula.',
    notes: 'Pump mechanism — test before bulk packaging.', instructions: 'Store upright. Avoid freezing.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-03-10', updatedAt: '2026-05-13',
  },
  {
    id: 'PRD-010', name: 'GlowSkin Body Lotion', code: 'GSB-200',
    category: 'Personal Care', subcategory: 'Body Care',
    bottleType: 'PET Flip-top', labelType: 'Self-Adhesive', packagingType: 'Carton 24-pack',
    size: '200ml', color: 'White', quantity: 5400, description: 'Daily moisturizing body lotion with vitamin E.',
    notes: 'Check flip-top seal before packaging.', instructions: 'Store in cool dry place. Keep upright.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-03-15', updatedAt: '2026-05-10',
  },
  {
    id: 'PRD-011', name: 'SparkleClean Glass Spray', code: 'SCG-500',
    category: 'Home Care', subcategory: 'Cleaning',
    bottleType: 'PET Trigger Spray', labelType: 'Paper Wrap', packagingType: 'Shrink Wrap 6-pack',
    size: '500ml', color: 'Transparent Blue', quantity: 3100, description: 'Streak-free glass and surface cleaner.',
    notes: 'Trigger spray — ensure nozzle is locked for shipping.', instructions: 'Lock trigger during transport. Store upright.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-04-01', updatedAt: '2026-05-12',
  },
  {
    id: 'PRD-012', name: 'NaturaBrew Coffee Cold Brew', code: 'NCB-330',
    category: 'Beverages', subcategory: 'Coffee',
    bottleType: 'Glass Round', labelType: 'Self-Adhesive', packagingType: 'Crate 12-pack',
    size: '330ml', color: 'Dark Brown', quantity: 1800, description: 'Premium cold brew coffee — single origin beans.',
    notes: 'Fragile glass. Premium product — special shelf.', instructions: 'Keep refrigerated. Shelf life 21 days.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-04-10', updatedAt: '2026-05-14',
  },
  {
    id: 'PRD-013', name: 'AquaPure Sparkling Water', code: 'APS-330',
    category: 'Beverages', subcategory: 'Water',
    bottleType: 'Glass Round', labelType: 'Shrink Sleeve', packagingType: 'Crate 24-pack',
    size: '330ml', color: 'Clear', quantity: 7600, description: 'Naturally sparkling mineral water.',
    notes: 'Carbonated — do not shake or drop.', instructions: 'Store upright. Avoid extreme temperatures.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-01-25', updatedAt: '2026-05-13',
  },
  {
    id: 'PRD-014', name: 'FloraScent Room Freshener', code: 'FRF-300',
    category: 'Home Care', subcategory: 'Air Care',
    bottleType: 'Aerosol Can', labelType: 'Direct Print', packagingType: 'Individual Box',
    size: '300ml', color: 'Lavender', quantity: 4500, description: 'Long-lasting room freshener spray — lavender scent.',
    notes: 'Pressurized container. Handle with extreme care.', instructions: 'Do not expose to heat above 50°C. Do not pierce.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-02-20', updatedAt: '2026-05-11',
  },
  {
    id: 'PRD-015', name: 'PureOlive Cooking Oil', code: 'POC-750',
    category: 'Food & Pantry', subcategory: 'Oils',
    bottleType: 'Glass Dark', labelType: 'Paper Wrap', packagingType: 'Carton 6-pack',
    size: '750ml', color: 'Dark Green', quantity: 2200, description: 'Extra virgin olive oil — cold pressed.',
    notes: 'Premium product. Dark glass protects from light.', instructions: 'Handle carefully. Glass bottle. Store in dark area.',
    isCocreate: true, image: '', status: 'active', createdAt: '2026-03-20', updatedAt: '2026-05-09',
  },
  {
    id: 'PRD-016', name: 'VitaBoost Sport Hydration', code: 'VBS-500',
    category: 'Beverages', subcategory: 'Sports',
    bottleType: 'PET Sport Cap', labelType: 'Shrink Sleeve', packagingType: 'Tray 12-pack',
    size: '500ml', color: 'Electric Blue', quantity: 5100, description: 'Isotonic sports drink with electrolytes.',
    notes: 'New design — sport cap with pull mechanism.', instructions: 'Store in cool area. Avoid freezing.',
    isCocreate: false, image: '', status: 'active', createdAt: '2026-04-05', updatedAt: '2026-05-14',
  },
];

export const activityLogs: ActivityLog[] = [
  { id: 'AL-001', userId: 'U-002', userName: 'Ravi Kumar', action: 'Scanned product', target: 'AquaPure Crystal 500ml', timestamp: '2026-05-15T10:30:00', type: 'scan' },
  { id: 'AL-002', userId: 'U-003', userName: 'Priya Sharma', action: 'Viewed product', target: 'VitaBoost Energy Drink', timestamp: '2026-05-15T10:25:00', type: 'view' },
  { id: 'AL-003', userId: 'U-001', userName: 'Tushar Makwana', action: 'Updated stock', target: 'GlowSkin Hand Wash', timestamp: '2026-05-15T10:15:00', type: 'edit' },
  { id: 'AL-004', userId: 'U-004', userName: 'Amit Patel', action: 'Scanned product', target: 'CleanWash Pro Detergent', timestamp: '2026-05-15T09:55:00', type: 'scan' },
  { id: 'AL-005', userId: 'U-002', userName: 'Ravi Kumar', action: 'Viewed product', target: 'FreshSqueeze Orange Juice', timestamp: '2026-05-15T09:40:00', type: 'view' },
  { id: 'AL-006', userId: 'U-001', userName: 'Tushar Makwana', action: 'Added product', target: 'NaturaBrew Coffee Cold Brew', timestamp: '2026-05-15T09:20:00', type: 'create' },
  { id: 'AL-007', userId: 'U-003', userName: 'Priya Sharma', action: 'Scanned product', target: 'HerbalEase Green Tea', timestamp: '2026-05-15T09:10:00', type: 'scan' },
  { id: 'AL-008', userId: 'U-004', userName: 'Amit Patel', action: 'Logged in', target: 'Worker Panel', timestamp: '2026-05-15T09:00:00', type: 'login' },
  { id: 'AL-009', userId: 'U-001', userName: 'Tushar Makwana', action: 'Deleted product', target: 'TestProduct-Draft', timestamp: '2026-05-14T17:30:00', type: 'delete' },
  { id: 'AL-010', userId: 'U-002', userName: 'Ravi Kumar', action: 'Scanned product', target: 'SparkleClean Glass Spray', timestamp: '2026-05-14T16:45:00', type: 'scan' },
];

export const recognitionLogs: RecognitionLog[] = [
  { id: 'RL-001', userId: 'U-002', userName: 'Ravi Kumar', productId: 'PRD-001', productName: 'AquaPure Crystal 500ml', confidence: 97.3, matched: true, timestamp: '2026-05-15T10:30:00', imageUrl: '' },
  { id: 'RL-002', userId: 'U-003', userName: 'Priya Sharma', productId: 'PRD-005', productName: 'VitaBoost Energy Drink', confidence: 94.8, matched: true, timestamp: '2026-05-15T10:25:00', imageUrl: '' },
  { id: 'RL-003', userId: 'U-004', userName: 'Amit Patel', productId: 'PRD-007', productName: 'CleanWash Pro Detergent', confidence: 91.2, matched: true, timestamp: '2026-05-15T09:55:00', imageUrl: '' },
  { id: 'RL-004', userId: 'U-003', userName: 'Priya Sharma', productId: 'PRD-006', productName: 'HerbalEase Green Tea', confidence: 88.5, matched: true, timestamp: '2026-05-15T09:10:00', imageUrl: '' },
  { id: 'RL-005', userId: 'U-002', userName: 'Ravi Kumar', productId: null, productName: null, confidence: 34.2, matched: false, timestamp: '2026-05-14T16:45:00', imageUrl: '' },
  { id: 'RL-006', userId: 'U-004', userName: 'Amit Patel', productId: 'PRD-009', productName: 'GlowSkin Hand Wash', confidence: 96.1, matched: true, timestamp: '2026-05-14T15:30:00', imageUrl: '' },
];

export const categories = ['Beverages', 'Home Care', 'Personal Care', 'Food & Pantry'];
export const bottleTypes = ['PET Round', 'PET Square', 'PET Pump', 'PET Flip-top', 'PET Sport Cap', 'PET Trigger Spray', 'Glass Round', 'Glass Square', 'Glass Dark', 'HDPE Round', 'Aluminum Can', 'Aerosol Can'];
export const labelTypes = ['Shrink Sleeve', 'Self-Adhesive', 'Paper Wrap', 'Direct Print'];
export const packagingTypes = ['Carton 6-pack', 'Carton 12-pack', 'Carton 24-pack', 'Crate 6-pack', 'Crate 12-pack', 'Crate 24-pack', 'Shrink Wrap 6-pack', 'Shrink Wrap 12-pack', 'Tray 12-pack', 'Tray 24-pack', 'Individual Box'];
