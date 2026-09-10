import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { resolve } from 'node:path';
import { activeConsultants, consultants, officialContact } from '../shared/consultants.js';
import { rotate } from '../shared/rotation.js';
import { createDatabase, type XingyuDatabase } from './database.js';
import { claimRotationCounter } from './rotation-repository.js';
const textFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer'] as const;

function isValidClick(consultantId: unknown, position: unknown): boolean {
  if (typeof consultantId !== 'string' || !Number.isInteger(position) || Number(position) < 1) return false;
  if (consultantId === officialContact.id) return true;
  return consultants.some(c => c.active && c.id === consultantId) && Number(position) <= activeConsultants().length;
}

export function createApp(db: XingyuDatabase = createDatabase()) {
  const app = express();
  const allowed = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:5178,https://consultoras.xingyujewelry.com.br,https://lp.xingyujewelry.com.br').split(',').map(v => v.trim());
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowed.includes(origin)) }));
  app.use(express.json({ limit: '8kb' }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.post('/api/rotation/next', (_req, res, next) => { try {
    const active = activeConsultants(); const counter = active.length ? claimRotationCounter(db) : 0;
    const ordered = rotate(active, counter).map(({ id, name, whatsapp }) => ({ id, name, whatsapp }));
    console.info('[rotation]', { counter, first: ordered[0]?.id ?? null }); res.json({ consultants: ordered });
  } catch (error) { next(error); } });
  app.post('/api/events/click', (req, res) => {
    const body = req.body as Record<string, unknown> | undefined; const consultantId = body?.consultantId; const position = body?.position;
    if (!isValidClick(consultantId, position)) { res.status(400).json({ error: 'Invalid event payload' }); return; }
    const values = textFields.map(key => typeof body?.[key] === 'string' ? String(body[key]).slice(0, 500) : null);
    db.prepare('INSERT INTO consultant_clicks (consultant_id, position, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(String(consultantId), Number(position), ...values, new Date().toISOString());
    console.info('[click]', { consultantId, position }); res.status(204).end();
  });
  app.use(express.static(resolve('dist')));
  app.use(express.static(resolve('public')));
  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => { void next; console.error('[server-error]', error); res.status(500).json({ error: 'Internal server error' }); });
  return app;
}
