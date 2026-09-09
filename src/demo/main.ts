import './demo.css';
import { createElement, ArrowRight, CircleAlert, Gem, Mouse, Sparkles } from 'lucide';
import { consultants, type Consultant } from '../shared/consultants';
import { localRotation } from '../widget/rotation';
import { attribution, trackClick } from '../widget/analytics';
import { buildWhatsappMessage, buildWhatsappUrl } from '../shared/whatsapp';

type LucideIcon = Parameters<typeof createElement>[0];

const TICKER_ITEMS: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Gem, label: 'Especialista em Semijoias' },
  { icon: Sparkles, label: 'Joias de Fábrica' },
  { icon: Gem, label: 'Qualidade Premium' },
  { icon: Sparkles, label: 'Acabamento Impecável' },
];

function icon(node: LucideIcon, attrs: Record<string, string | number> = {}): SVGElement {
  return createElement(node, attrs);
}

function buildTicker() {
  const track = document.querySelector<HTMLDivElement>('#ticker-track');
  if (!track) return;
  track.replaceChildren();
  for (let copy = 0; copy < 6; copy += 1) {
    const group = document.createElement('div');
    group.className = 'xingyu-consultants__ticker-group';
    for (const item of TICKER_ITEMS) {
      const row = document.createElement('div');
      row.className = 'xingyu-consultants__ticker-item';
      row.append(icon(item.icon, { class: 'xingyu-consultants__ticker-icon', 'stroke-width': 1.3 }), Object.assign(document.createElement('span'), { textContent: item.label }));
      group.append(row);
    }
    track.append(group);
  }
}

function buildScrollHint() {
  const btn = document.querySelector<HTMLButtonElement>('#scroll-hint-btn');
  const wrap = document.querySelector<HTMLDivElement>('#scroll-hint');
  if (!btn || !wrap) return;
  btn.append(icon(Mouse, { class: 'xingyu-consultants__scroll-icon', 'stroke-width': 1.4 }));
  const sync = () => {
    const atTop = window.scrollY <= 1;
    wrap.classList.toggle('is-visible', atTop);
    wrap.classList.toggle('is-hidden', !atTop);
  };
  sync();
  window.addEventListener('scroll', sync, { passive: true });
}

function buildNoticeIcon() {
  const slot = document.querySelector<HTMLElement>('#notice-icon');
  if (!slot) return;
  slot.replaceChildren(icon(CircleAlert, { class: 'xingyu-consultants__notice-svg', 'stroke-width': 1.5 }));
}

async function getConsultants(): Promise<Consultant[]> {
  try {
    const response = await fetch('/api/rotation/next', { method: 'POST' });
    if (!response.ok) throw new Error(String(response.status));
    return (await response.json() as { consultants: Consultant[] }).consultants;
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[Xingyu] usando rodízio local', error);
    return localRotation(consultants);
  }
}

function render(items: Consultant[]) {
  const list = document.querySelector<HTMLDivElement>('#consultants-list')!;
  list.textContent = '';
  const source = attribution().utm_source;
  items.forEach((consultant, index) => {
    const link = document.createElement('a');
    const message = buildWhatsappMessage({ consultantName: consultant.name, source });
    link.className = 'xingyu-consultants__card';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.href = buildWhatsappUrl({ phone: consultant.whatsapp, message });
    link.setAttribute('aria-label', `Falar com ${consultant.name} pelo WhatsApp`);

    const avatar = Object.assign(document.createElement('span'), {
      className: 'xingyu-consultants__avatar',
      textContent: consultant.name[0],
    });
    avatar.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.className = 'xingyu-consultants__card-copy';
    copy.append(
      Object.assign(document.createElement('strong'), { textContent: consultant.name }),
      Object.assign(document.createElement('small'), { textContent: 'Falar pelo WhatsApp' }),
    );

    const arrow = icon(ArrowRight, { class: 'xingyu-consultants__card-arrow', 'stroke-width': 1.5 });
    arrow.setAttribute('aria-hidden', 'true');

    link.append(avatar, copy, arrow);
    link.addEventListener('click', () => trackClick('', consultant.id, index + 1));
    list.append(link);
  });
}

buildTicker();
buildScrollHint();
buildNoticeIcon();
void getConsultants().then(render);
