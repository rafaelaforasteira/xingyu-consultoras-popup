import { describe,expect,it } from 'vitest';
import { getSourceLabel } from './sources';
import { buildWhatsappMessage,buildWhatsappUrl } from './whatsapp';
describe('lead source and WhatsApp',()=>{
  it.each([['instagram','Instagram'],['ig','Instagram'],['tiktok','TikTok'],['site','site da Xingyu']])('normalizes %s', (source,label)=>expect(getSourceLabel(source)).toBe(label));
  it('omits missing source',()=>expect(getSourceLabel()).toBeUndefined());
  it('builds sourced message',()=>expect(buildWhatsappMessage({consultantName:'Deise',source:'instagram'})).toBe('Olá, Deise! Tudo bem? Vim pelo Instagram e preciso de ajuda. Pode me ajudar?'));
  it('builds neutral message',()=>expect(buildWhatsappMessage({consultantName:'Cris'})).toBe('Olá, Cris! Tudo bem? Gostaria de falar com uma consultora da Xingyu. Pode me ajudar?'));
  it('normalizes phone and URL-encodes text',()=>{const url=buildWhatsappUrl({phone:'+55 48 92002-3617',message:'Olá, Vane! Tudo bem?'});expect(url.startsWith('https://wa.me/5548920023617?text=')).toBe(true);expect(new URL(url).searchParams.get('text')).toBe('Olá, Vane! Tudo bem?');});
});
