import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  image: { type: String, default: '' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  specifications: { type: Map, of: String, default: {} },
  description: { type: String, default: '' },
  notes: { type: String, default: '' },
  instructions: { type: String, default: '' },
  isCocreate: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
  createdBy: { type: String, default: 'Admin' },
  shortName: String,
  brand: String,
  size: String,
  unit: String,
  materialDescription: String,
  bottleType: String,
  labelSize: String,
  cfbSize: String,
  quantity: Number,
  subcategory: String,
  packagingType: String,
  color: String,
});

const ActivityLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  userName: String,
  action: String,
  target: String,
  timestamp: String,
  type: { type: String },
});

const RecognitionLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: String,
  userName: String,
  productId: String,
  productName: String,
  confidence: Number,
  matched: Boolean,
  timestamp: String,
  imageUrl: String,
});

export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const ActivityLogModel = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
export const RecognitionLogModel = mongoose.models.RecognitionLog || mongoose.model('RecognitionLog', RecognitionLogSchema);
