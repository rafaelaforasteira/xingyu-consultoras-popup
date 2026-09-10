// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest';
import { XingyuConsultantPopup } from './ConsultantPopup';
const response = { ok: true, json: async () => ({ consultants: [{ id:'mayara', name:'Mayara', whatsapp:'5511999999999', active:true, order:1 }] }) } as Response;
beforeEach(() => { document.body.innerHTML='<button id="trigger">Abrir</button>'; vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response)); vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { callback(0); return 1; }); });
it('calls rotation only for deliberate closed-to-open transitions', async () => { XingyuConsultantPopup.init({ trigger:'#trigger' }); const trigger=document.querySelector<HTMLButtonElement>('#trigger')!; const rotationCalls=()=>vi.mocked(fetch).mock.calls.filter(call=>String(call[0]).includes('/api/rotation/next')).length; trigger.focus(); trigger.click(); trigger.click(); await vi.waitFor(()=>expect(document.querySelector('.xingyu-consultant-popup__consultant')).not.toBeNull()); window.dispatchEvent(new Event('resize')); document.querySelector<HTMLAnchorElement>('.xingyu-consultant-popup__consultant')!.dispatchEvent(new MouseEvent('click')); expect(rotationCalls()).toBe(1); document.querySelector<HTMLButtonElement>('.xingyu-consultant-popup__close')!.click(); trigger.click(); await vi.waitFor(()=>expect(rotationCalls()).toBe(2)); });
it('appends a fixed official contact after rotating consultants', async () => {
  XingyuConsultantPopup.init({ trigger: '#trigger' });
  document.querySelector<HTMLButtonElement>('#trigger')!.click();
  await vi.waitFor(() => expect(document.querySelector('.xingyu-consultant-popup__consultant--official')).not.toBeNull());
  const official = document.querySelector<HTMLAnchorElement>('.xingyu-consultant-popup__consultant--official')!;
  expect(official.href).toContain('15557338719');
  expect(official.textContent).toContain('Suporte/Garantia');
});
it('closes with Escape and backdrop, restoring focus', async () => { XingyuConsultantPopup.init({ trigger:'#trigger' }); const trigger=document.querySelector<HTMLButtonElement>('#trigger')!; trigger.focus(); trigger.click(); await vi.waitFor(()=>expect(document.querySelector('.xingyu-consultant-popup__consultant')).not.toBeNull()); document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); expect(document.activeElement).toBe(trigger); trigger.click(); await vi.waitFor(()=>expect(fetch).toHaveBeenCalledTimes(2)); const overlay=document.querySelector<HTMLDivElement>('.xingyu-consultant-popup')!; overlay.click(); expect(document.activeElement).toBe(trigger); });
