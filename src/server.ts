import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT ?? 5178);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const consultants = [
  { id: 'mayara', name: 'Mayara', whatsapp: '5511999999999', active: true },
  { id: 'vanessa', name: 'Vanessa', whatsapp: '5511999999999', active: true },
  { id: 'deise', name: 'Deise', whatsapp: '5511999999999', active: true }
];

let rotationIndex = 0;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/rotation/next', (_req, res) => {
  const active = consultants.filter((consultant) => consultant.active);
  if (active.length === 0) return res.json({ consultants: [] });
  const offset = rotationIndex % active.length;
  const ordered = [...active.slice(offset), ...active.slice(0, offset)];
  rotationIndex = (rotationIndex + 1) % active.length;
  res.json({ consultants: ordered });
});

app.post('/api/events/click', (req, res) => {
  const { consultantId, position } = req.body ?? {};
  console.info('[consultant-click]', { consultantId, position, at: new Date().toISOString() });
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Xingyu popup demo: http://localhost:${port}`);
});
