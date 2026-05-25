import fs from 'fs/promises';
import path from 'path';
import { Product, ActivityLog, RecognitionLog } from '@/types';

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

// Simple Mutex to prevent race conditions during concurrent reads/writes
class Mutex {
  private promise: Promise<void> | null = null;
  async lock(): Promise<() => void> {
    let release: () => void;
    const nextPromise = new Promise<void>(res => { release = res; });
    const currentPromise = this.promise;
    this.promise = nextPromise;
    if (currentPromise) {
      await currentPromise;
    }
    return () => {
      if (this.promise === nextPromise) {
        this.promise = null;
      }
      release();
    };
  }
}

const dbMutex = new Mutex();

async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  const release = await dbMutex.lock();
  try {
    await initDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database:", error);
    return defaultData;
  } finally {
    release();
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  const release = await dbMutex.lock();
  try {
    await initDb();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to write database:", error);
  } finally {
    release();
  }
}
