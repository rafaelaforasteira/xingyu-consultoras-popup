import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
export type XingyuDatabase = DatabaseSync;
export function createDatabase(filename = process.env.DATABASE_PATH ?? './data/xingyu.sqlite'): XingyuDatabase {
  const path = filename === ':memory:' ? filename : resolve(filename);
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS rotation_state (id INTEGER PRIMARY KEY CHECK (id = 1), current_index INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL);
    INSERT OR IGNORE INTO rotation_state (id, current_index, updated_at) VALUES (1, 0, datetime('now'));
    CREATE TABLE IF NOT EXISTS consultant_clicks (id INTEGER PRIMARY KEY AUTOINCREMENT, consultant_id TEXT NOT NULL, position INTEGER NOT NULL, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT, referrer TEXT, created_at TEXT NOT NULL);`);
  return db;
}
