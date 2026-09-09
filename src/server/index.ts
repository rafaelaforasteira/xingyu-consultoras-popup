import { createApp } from './app.js';
const port = Number(process.env.PORT ?? 5178);
createApp().listen(port, () => { console.info('[startup] database initialized'); console.info(`[startup] Xingyu popup: http://localhost:${port}`); });
