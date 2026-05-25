import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Please define MONGODB_URI environment variable before running this script.');
  console.error('Example: MONGODB_URI="mongodb+srv://..." node scripts/importData.mjs');
  process.exit(1);
}

// Define minimal schemas for import
const productSchema = new mongoose.Schema({ id: String }, { strict: false });
const activityLogSchema = new mongoose.Schema({ id: String }, { strict: false });
const recognitionLogSchema = new mongoose.Schema({ id: String }, { strict: false });

const ProductModel = mongoose.model('Product', productSchema);
const ActivityLogModel = mongoose.model('ActivityLog', activityLogSchema);
const RecognitionLogModel = mongoose.model('RecognitionLog', recognitionLogSchema);

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const dbPath = path.join(process.cwd(), 'database.json');
    const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
    
    console.log(`Found ${data.products?.length || 0} products`);
    console.log(`Found ${data.activityLogs?.length || 0} activity logs`);
    console.log(`Found ${data.recognitionLogs?.length || 0} recognition logs`);

    // Insert Products
    if (data.products && data.products.length > 0) {
      await ProductModel.deleteMany({}); // Clear existing
      await ProductModel.insertMany(data.products);
      console.log(`✅ Imported ${data.products.length} products`);
    }

    // Insert Activity Logs
    if (data.activityLogs && data.activityLogs.length > 0) {
      await ActivityLogModel.deleteMany({});
      await ActivityLogModel.insertMany(data.activityLogs);
      console.log(`✅ Imported ${data.activityLogs.length} activity logs`);
    }

    // Insert Recognition Logs
    if (data.recognitionLogs && data.recognitionLogs.length > 0) {
      await RecognitionLogModel.deleteMany({});
      await RecognitionLogModel.insertMany(data.recognitionLogs);
      console.log(`✅ Imported ${data.recognitionLogs.length} recognition logs`);
    }

    console.log('🎉 Data import complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  }
}

importData();
