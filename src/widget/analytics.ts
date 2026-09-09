const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export function attribution() {
  const params = new URLSearchParams(location.search); const data: Record<string, string> = {};
  for (const key of utmKeys) { const value = params.get(key); if (value) data[key] = value; }
  if (document.referrer) data.referrer = document.referrer; return data;
}
export function trackClick(apiUrl: string, consultantId: string, position: number) {
  const body = JSON.stringify({ consultantId, position, ...attribution() });
  if (navigator.sendBeacon) { navigator.sendBeacon(`${apiUrl}/api/events/click`, new Blob([body], { type: 'application/json' })); return; }
  void fetch(`${apiUrl}/api/events/click`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
}
