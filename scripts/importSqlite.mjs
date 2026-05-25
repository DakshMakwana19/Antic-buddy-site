import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

async function importData() {
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  console.log('Connecting to SQLite at', dbPath);
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      tags TEXT,
      images TEXT,
      image TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      specifications TEXT,
      description TEXT,
      notes TEXT,
      instructions TEXT,
      isCocreate INTEGER,
      status TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      createdBy TEXT,
      subcategory TEXT,
      bottleType TEXT,
      labelType TEXT,
      packagingType TEXT,
      size TEXT,
      color TEXT,
      quantity INTEGER
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recognition_logs (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      productId TEXT,
      productName TEXT,
      confidence REAL NOT NULL,
      matched INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      imageUrl TEXT
    );
  `);

  try {
    const jsonPath = path.join(process.cwd(), 'database.json');
    const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    console.log(`Found ${data.products?.length || 0} products`);
    console.log(`Found ${data.activityLogs?.length || 0} activity logs`);
    console.log(`Found ${data.recognitionLogs?.length || 0} recognition logs`);

    if (data.products && data.products.length > 0) {
      const stmt = await db.prepare(`
        INSERT OR REPLACE INTO products (
          id, name, code, category, tags, images, image, price, stock,
          specifications, description, notes, instructions, isCocreate,
          status, createdAt, updatedAt, createdBy, subcategory, bottleType,
          labelType, packagingType, size, color, quantity
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);
      for (const p of data.products) {
        await stmt.run([
          p.id, p.name, p.code, p.category, JSON.stringify(p.tags || []),
          JSON.stringify(p.images || []), p.image, p.price, p.stock,
          JSON.stringify(p.specifications || {}), p.description, p.notes,
          p.instructions, p.isCocreate ? 1 : 0, p.status, p.createdAt,
          p.updatedAt, p.createdBy, p.subcategory, p.bottleType,
          p.labelType, p.packagingType, p.size, p.color, p.quantity
        ]);
      }
      await stmt.finalize();
      console.log('✅ Imported products');
    }

    if (data.activityLogs && data.activityLogs.length > 0) {
      const stmt = await db.prepare(`
        INSERT OR REPLACE INTO activity_logs (id, userId, userName, action, target, timestamp, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const log of data.activityLogs) {
        await stmt.run([log.id, log.userId, log.userName, log.action, log.target, log.timestamp, log.type]);
      }
      await stmt.finalize();
      console.log('✅ Imported activity logs');
    }

    if (data.recognitionLogs && data.recognitionLogs.length > 0) {
      const stmt = await db.prepare(`
        INSERT OR REPLACE INTO recognition_logs (id, userId, userName, productId, productName, confidence, matched, timestamp, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const log of data.recognitionLogs) {
        await stmt.run([log.id, log.userId, log.userName, log.productId, log.productName, log.confidence, log.matched ? 1 : 0, log.timestamp, log.imageUrl]);
      }
      await stmt.finalize();
      console.log('✅ Imported recognition logs');
    }

    console.log('🎉 Data import complete!');
  } catch (err) {
    console.error('Error importing data:', err);
  }
}

importData();
