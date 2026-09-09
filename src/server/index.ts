import { createApp } from './app.js';
const port = Number(process.env.PORT ?? 5178);
createApp().listen(port, '0.0.0.0', () => {
  console.info('[startup] database initialized');
  console.info(`[startup] Xingyu popup listening on 0.0.0.0:${port}`);
});
