import { rotate } from '../shared/rotation';
import type { Consultant } from './config';
const KEY = 'xingyu-consultant-rotation';
export function localRotation(items: Consultant[]): Consultant[] {
  let counter = 0;
  try { counter = Number.parseInt(localStorage.getItem(KEY) ?? '0', 10) || 0; localStorage.setItem(KEY, String(counter + 1)); } catch { /* storage can be unavailable */ }
  return rotate(items.filter(c => c.active).sort((a, b) => a.order - b.order), counter);
}
