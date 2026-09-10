import { consultants, type Consultant } from '../shared/consultants';

export { type Consultant };

export interface PopupOptions {
  trigger: string | HTMLElement;
  apiUrl?: string;
  consultants?: Consultant[];
}

export const defaults = {
  apiUrl: import.meta.env.PUBLIC_API_URL ?? '',
  consultants,
};

export function resolveEmbedScript(): HTMLScriptElement | null {
  if (typeof document === 'undefined') return null;
  if (document.currentScript instanceof HTMLScriptElement) return document.currentScript;
  const scripts = [...document.querySelectorAll('script[src]')] as HTMLScriptElement[];
  return scripts.find(script => /xingyu-popup(?:\.min)?\.js(?:\?|$)/i.test(script.src)) ?? null;
}

export function resolveApiUrl(explicit?: string | null): string {
  const trimmed = explicit?.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;
  const fromEnv = defaults.apiUrl.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const script = resolveEmbedScript();
  if (script?.src) {
    try {
      return new URL(script.src).origin;
    } catch {
      /* ignore invalid script src */
    }
  }
  return '';
}

export function resolveAssetOrigin(apiUrl?: string | null): string {
  const base = resolveApiUrl(apiUrl);
  return base || (typeof location !== 'undefined' ? location.origin : '');
}
