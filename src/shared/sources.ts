export const sourceLabels: Readonly<Record<string, string>> = {
  instagram: 'Instagram', ig: 'Instagram', tiktok: 'TikTok', tt: 'TikTok',
  facebook: 'Facebook', fb: 'Facebook', google: 'Google', youtube: 'YouTube', yt: 'YouTube',
  site: 'site da Xingyu', website: 'site da Xingyu', whatsapp: 'WhatsApp'
};
export function normalizeSource(source?: string | null): string | undefined {
  const normalized = source?.trim().toLowerCase().slice(0, 100);
  return normalized || undefined;
}
export function getSourceLabel(source?: string | null): string | undefined {
  const normalized = normalizeSource(source); return normalized ? sourceLabels[normalized] : undefined;
}
