import fs from 'fs/promises';
import path from 'path';
import { Product, ActivityLog, RecognitionLog } from '@/types';

// We store data in a simple JSON file at the root of the project.
// Note: On platforms like Vercel, this file will reset on every new deployment.
const DB_PATH = path.join(process.cwd(), 'database.json');

export interface DatabaseSchema {
  products: Product[];
  activityLogs: ActivityLog[];
  recognitionLogs: RecognitionLog[];
}

const defaultData: DatabaseSchema = {
  products: [],
  activityLogs: [],
  recognitionLogs: [],
};

// Ensure the file exists
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  await initDb();
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database:", error);
    return defaultData;
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  await initDb();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
