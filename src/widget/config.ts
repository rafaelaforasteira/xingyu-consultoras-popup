import { consultants, type Consultant } from '../shared/consultants';
export { type Consultant };
export interface PopupOptions { trigger: string | HTMLElement; apiUrl?: string; consultants?: Consultant[]; }
export const defaults = { apiUrl: import.meta.env.PUBLIC_API_URL ?? '', consultants };
