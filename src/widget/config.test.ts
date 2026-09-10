// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { resolveApiUrl, resolveAssetOrigin, resolveEmbedScript } from './config';

describe('embed config helpers', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('resolves api url from explicit value and strips trailing slash', () => {
    expect(resolveApiUrl('https://api.example.com/')).toBe('https://api.example.com');
  });

  it('falls back to embed script origin', () => {
    const script = document.createElement('script');
    script.src = 'https://consultoras.example.com/embed/xingyu-popup.js';
    document.body.append(script);
    expect(resolveEmbedScript()).toBe(script);
    expect(resolveApiUrl()).toBe('https://consultoras.example.com');
    expect(resolveAssetOrigin()).toBe('https://consultoras.example.com');
  });
});
