import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDatabase, type XingyuDatabase } from './database';
import { createApp } from './app';
let db: XingyuDatabase;
beforeEach(() => { db = createDatabase(':memory:'); });
describe('API', () => {
  it('reports health', async () => expect((await request(createApp(db)).get('/api/health')).body).toEqual({ status: 'ok' }));
  it('persists and advances rotation', async () => { const app=createApp(db); const first=await request(app).post('/api/rotation/next'); const second=await request(app).post('/api/rotation/next'); expect(first.body.consultants.map((c:{id:string})=>c.id)).toEqual(['vane','may','cris','deise']); expect(second.body.consultants[0].id).toBe('may'); expect((db.prepare('SELECT current_index FROM rotation_state').get() as {current_index:number}).current_index).toBe(2); });
  it('records clicks with attribution', async () => { expect((await request(createApp(db)).post('/api/events/click').send({ consultantId:'vane', position:1, utm_source:'instagram' })).status).toBe(204); expect(db.prepare('SELECT consultant_id, position, utm_source FROM consultant_clicks').get()).toEqual({ consultant_id:'vane', position:1, utm_source:'instagram' }); });
  it('rejects invalid and unknown consultants', async () => { expect((await request(createApp(db)).post('/api/events/click').send({})).status).toBe(400); expect((await request(createApp(db)).post('/api/events/click').send({ consultantId:'unknown', position:1 })).status).toBe(400); });
});
