import { getSourceLabel } from './sources';
export function buildWhatsappMessage({ consultantName, source }: { consultantName: string; source?: string | null }): string {
  const label = getSourceLabel(source);
  return label ? `Olá, ${consultantName}! Tudo bem? Vim pelo ${label} e preciso de ajuda. Pode me ajudar?` : `Olá, ${consultantName}! Tudo bem? Gostaria de falar com uma consultora da Xingyu. Pode me ajudar?`;
}
export function buildWhatsappUrl({ phone, message }: { phone: string; message: string }): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?${new URLSearchParams({ text: message }).toString()}`;
}
