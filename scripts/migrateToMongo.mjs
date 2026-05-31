import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

const MONGODB_URI = "mongodb+srv://dakshmakwana1912_db_user:j7rLAQv6lpTu4pon@cluster0.hcaa9js.mongodb.net/product_manager?retryWrites=true&w=majority";

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

const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const ActivityLogModel = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
const RecognitionLogModel = mongoose.models.RecognitionLog || mongoose.model('RecognitionLog', RecognitionLogSchema);

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  console.log("Reading local database.json...");
  const dbPath = path.join(process.cwd(), 'database.json');
  const fileData = await fs.readFile(dbPath, 'utf-8');
  const data = JSON.parse(fileData);

  const products = data.products || [];
  const activityLogs = data.activityLogs || [];
  const recognitionLogs = data.recognitionLogs || [];

  console.log(`Found ${products.length} products, ${activityLogs.length} activity logs, ${recognitionLogs.length} recognition logs.`);

  console.log("Wiping existing remote data for clean migration...");
  await ProductModel.deleteMany({});
  await ActivityLogModel.deleteMany({});
  await RecognitionLogModel.deleteMany({});

  if (products.length > 0) {
    console.log("Inserting products...");
    await ProductModel.insertMany(products);
  }
  if (activityLogs.length > 0) {
    console.log("Inserting activity logs...");
    await ActivityLogModel.insertMany(activityLogs);
  }
  if (recognitionLogs.length > 0) {
    console.log("Inserting recognition logs...");
    await RecognitionLogModel.insertMany(recognitionLogs);
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
