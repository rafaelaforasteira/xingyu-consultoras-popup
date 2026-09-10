import './ConsultantPopup.css';
import { XingyuConsultantPopup } from './ConsultantPopup';
import { resolveApiUrl, resolveEmbedScript } from './config';

declare global {
  interface Window {
    XingyuConsultantPopup: typeof XingyuConsultantPopup;
  }
}

function injectStylesheet(script: HTMLScriptElement) {
  const href = script.src.replace(/\.js(\?.*)?$/i, '.css$1');
  if (!href || document.querySelector(`link[data-xingyu-popup-css="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.xingyuPopupCss = href;
  document.head.append(link);
}

function autoInit() {
  const script = resolveEmbedScript();
  if (!script) return;
  injectStylesheet(script);
  const trigger = script.dataset.trigger?.trim();
  if (!trigger) return;
  XingyuConsultantPopup.init({
    trigger,
    apiUrl: resolveApiUrl(script.dataset.apiUrl),
  });
}

window.XingyuConsultantPopup = XingyuConsultantPopup;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit, { once: true });
} else {
  autoInit();
}

export default XingyuConsultantPopup;
