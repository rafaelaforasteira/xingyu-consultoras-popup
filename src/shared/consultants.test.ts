import { expect, it } from 'vitest';
import { consultants } from './consultants';
import { rotate } from './rotation';
it('excludes inactive consultants', () => { const changed = consultants.map(c => c.id === 'vanessa' ? { ...c, active: false } : c); expect(rotate(changed.filter(c => c.active), 1).map(c => c.id)).toEqual(['deise','mayara']); });
