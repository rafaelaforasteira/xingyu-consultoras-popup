export interface Consultant { id: string; name: string; whatsapp: string; active: boolean; order: number; }

/** Fixed contact at the end of the list — never enters rotation. */
export const officialContact = {
  id: 'oficial',
  name: 'Suporte/Garantia',
  whatsapp: '15557338719',
} as const;

export const consultants: Consultant[] = [
  { id: 'vane', name: 'Vane', whatsapp: '5548920023617', active: true, order: 1 },
  { id: 'may', name: 'May', whatsapp: '5511937162894', active: true, order: 2 },
  { id: 'cris', name: 'Cris', whatsapp: '5511962052416', active: true, order: 3 },
  { id: 'deise', name: 'Deise', whatsapp: '5511933089252', active: true, order: 4 }
];
export const activeConsultants = () => consultants.filter(item => item.active).sort((a, b) => a.order - b.order);

