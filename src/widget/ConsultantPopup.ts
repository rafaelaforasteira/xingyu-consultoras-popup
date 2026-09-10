import './ConsultantPopup.css';
import { createElement, ArrowRight, X } from 'lucide';
import { defaults, resolveAssetOrigin, type Consultant, type PopupOptions } from './config';
import { localRotation } from './rotation';
import { trackClick } from './analytics';
import { attribution } from './analytics';
import { buildWhatsappMessage, buildWhatsappUrl } from '../shared/whatsapp';

const FONT_FILES = [
  { file: 'JolyDisplay-Regular.otf', weight: 400 },
  { file: 'JolyDisplay-Medium.otf', weight: 500 },
  { file: 'JolyDisplay-Bold.otf', weight: 700 },
  { file: 'JolyDisplay-Black.otf', weight: 900 },
] as const;

export class XingyuConsultantPopup {
  private trigger: HTMLElement; private overlay: HTMLDivElement; private dialog: HTMLElement;
  private options: Required<Omit<PopupOptions, 'trigger'>>; private opening = false; private isOpen = false;
  private previousFocus: HTMLElement | null = null; private scrollbarPadding = '';
  private constructor(options: PopupOptions) {
    const trigger = typeof options.trigger === 'string' ? document.querySelector<HTMLElement>(options.trigger) : options.trigger;
    if (!trigger) throw new Error('Xingyu popup trigger not found'); this.trigger = trigger;
    this.options = { apiUrl: options.apiUrl ?? defaults.apiUrl, consultants: options.consultants ?? defaults.consultants };
    this.injectBrandAssets();
    this.overlay = this.build(); this.dialog = this.overlay.querySelector('[role="dialog"]')!; document.body.append(this.overlay); this.bind();
  }
  static init(options: PopupOptions) { return new XingyuConsultantPopup(options); }
  private assetOrigin() { return resolveAssetOrigin(this.options.apiUrl); }
  private injectBrandAssets() {
    if (document.querySelector('style[data-xingyu-fonts]')) return;
    const origin = this.assetOrigin();
    if (!origin) return;
    const style = document.createElement('style');
    style.dataset.xingyuFonts = 'true';
    style.textContent = FONT_FILES.map(({ file, weight }) =>
      `@font-face{font-family:"Joly Display";src:url("${origin}/fonts/${file}") format("opentype");font-weight:${weight};font-style:normal;font-display:swap}`,
    ).join('');
    document.head.append(style);
  }
  private build() {
    if (!document.querySelector('link[data-xingyu-sora]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap';
      link.dataset.xingyuSora = 'true';
      document.head.append(link);
    }
    const logoSrc = `${this.assetOrigin()}/logo-xy.png`;
    const overlay = document.createElement('div'); overlay.className = 'xingyu-consultant-popup'; overlay.hidden = true;
    overlay.innerHTML = `<section class="xingyu-consultant-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="xingyu-popup-title" aria-describedby="xingyu-popup-description" tabindex="-1"><button class="xingyu-consultant-popup__close" type="button" aria-label="Fechar janela"></button><div class="xingyu-consultant-popup__brand"><img class="xingyu-consultant-popup__logo" src="${logoSrc}" alt="" width="52" height="52"><span class="xingyu-consultant-popup__brand-name">XINGYU</span></div><div class="xingyu-consultant-popup__ornament" aria-hidden="true"></div><h2 id="xingyu-popup-title">Fale com uma consultora</h2><p id="xingyu-popup-description">Escolha uma de nossas consultoras e continue seu atendimento pelo WhatsApp.</p><div class="xingyu-consultant-popup__list" aria-live="polite"></div></section>`;
    const close = overlay.querySelector('.xingyu-consultant-popup__close')!;
    const closeIcon = createElement(X, { class: 'xingyu-consultant-popup__close-icon', 'stroke-width': 1.5 });
    closeIcon.setAttribute('aria-hidden', 'true');
    close.append(closeIcon);
    return overlay;
  }
  private bind() {
    this.trigger.addEventListener('click', () => void this.open());
    this.overlay.querySelector('.xingyu-consultant-popup__close')!.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', e => { if (e.target === this.overlay) this.close(); });
    document.addEventListener('keydown', e => { if (!this.isOpen) return; if (e.key === 'Escape') this.close(); else if (e.key === 'Tab') this.trapFocus(e); });
  }
  private async getOrder(): Promise<Consultant[]> {
    try { const response = await fetch(`${this.options.apiUrl}/api/rotation/next`, { method: 'POST' }); if (!response.ok) throw new Error(String(response.status)); return (await response.json() as { consultants: Consultant[] }).consultants; }
    catch (error) { if (import.meta.env.DEV) console.warn('[Xingyu popup] using local rotation', error); return localRotation(this.options.consultants); }
  }
  async open() {
    if (this.opening || this.isOpen) return; this.opening = true; this.previousFocus = document.activeElement as HTMLElement; this.trigger.setAttribute('aria-busy', 'true');
    try { const order = await this.getOrder(); if (this.isOpen) return; this.render(order);
      this.scrollbarPadding = document.body.style.paddingRight; const gap = document.documentElement.clientWidth > 0 ? innerWidth - document.documentElement.clientWidth : 0; if (gap > 0) document.body.style.paddingRight = `${gap}px`;
      document.body.style.overflow = 'hidden'; this.overlay.hidden = false; requestAnimationFrame(() => this.overlay.classList.add('is-open')); this.isOpen = true; this.dialog.focus();
    } finally { this.opening = false; this.trigger.removeAttribute('aria-busy'); }
  }
  close() { if (!this.isOpen) return; this.overlay.classList.remove('is-open'); this.isOpen = false; document.body.style.overflow = ''; document.body.style.paddingRight = this.scrollbarPadding; setTimeout(() => { if (!this.isOpen) this.overlay.hidden = true; }, 180); this.previousFocus?.focus(); }
  private render(items: Consultant[]) {
    const list = this.overlay.querySelector('.xingyu-consultant-popup__list')!; list.textContent = '';
    items.forEach((item, index) => {
      const link = document.createElement('a');
      link.className = 'xingyu-consultant-popup__consultant';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.href = buildWhatsappUrl({ phone: item.whatsapp, message: buildWhatsappMessage({ consultantName: item.name, source: attribution().utm_source }) });

      const initial = Object.assign(document.createElement('span'), { className: 'xingyu-consultant-popup__initial', textContent: item.name.charAt(0) });
      initial.setAttribute('aria-hidden', 'true');
      const copy = document.createElement('span');
      copy.className = 'xingyu-consultant-popup__copy';
      copy.append(
        Object.assign(document.createElement('strong'), { textContent: item.name }),
        Object.assign(document.createElement('small'), { textContent: 'Falar pelo WhatsApp' }),
      );
      const arrow = createElement(ArrowRight, { class: 'xingyu-consultant-popup__arrow', 'stroke-width': 1.5 });
      arrow.setAttribute('aria-hidden', 'true');
      link.append(initial, copy, arrow);
      link.addEventListener('click', () => trackClick(this.options.apiUrl, item.id, index + 1));
      list.append(link);
    });
  }
  private trapFocus(event: KeyboardEvent) { const nodes = [...this.dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')]; if (!nodes.length) return; const first = nodes[0], last = nodes.at(-1)!; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
}
