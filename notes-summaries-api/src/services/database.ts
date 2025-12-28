import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
const schemaPath = path.join(process.cwd(), 'data', 'schema.sql');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database with timeout option
export const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

export function initDatabase() {
  try {
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export function closeDatabase() {
  try {
    db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
}

// Graceful shutdown handlers
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

// Handle uncaught errors
process.on('exit', () => {
  closeDatabase();
});
