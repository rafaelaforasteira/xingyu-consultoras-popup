import type { XingyuDatabase } from './database.js';
export function claimRotationCounter(db: XingyuDatabase): number {
  db.exec('BEGIN IMMEDIATE');
  try {
    const row = db.prepare('SELECT current_index FROM rotation_state WHERE id = 1').get() as { current_index: number };
    db.prepare("UPDATE rotation_state SET current_index = current_index + 1, updated_at = datetime('now') WHERE id = 1").run();
    db.exec('COMMIT'); return row.current_index;
  } catch (error) { db.exec('ROLLBACK'); throw error; }
}
