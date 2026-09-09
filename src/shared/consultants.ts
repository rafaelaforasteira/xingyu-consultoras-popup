export interface Consultant { id: string; name: string; whatsapp: string; active: boolean; order: number; }
export const WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Xingyu e gostaria de falar com uma consultora.';
// PLACEHOLDERS: substitua apenas os números abaixo antes de publicar.
export const consultants: Consultant[] = [
  { id: 'mayara', name: 'Mayara', whatsapp: '5511999999999', active: true, order: 1 },
  { id: 'vanessa', name: 'Vanessa', whatsapp: '5511999999999', active: true, order: 2 },
  { id: 'deise', name: 'Deise', whatsapp: '5511999999999', active: true, order: 3 }
];
export const activeConsultants = () => consultants.filter(item => item.active).sort((a, b) => a.order - b.order);
