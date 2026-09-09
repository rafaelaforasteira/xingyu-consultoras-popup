import { describe, expect, it } from 'vitest';
import { rotate } from './rotation';
describe('rotate', () => {
  it('cycles four consultants fairly over eight openings', () => expect(Array.from({ length: 8 }, (_, i) => rotate(['Vane','May','Cris','Deise'], i)[0])).toEqual(['Vane','May','Cris','Deise','Vane','May','Cris','Deise']));
  it('returns complete circular orders', () => expect(Array.from({ length: 4 }, (_, i) => rotate(['A','B','C'], i).join(' '))).toEqual(['A B C','B C A','C A B','A B C']));
  it('supports empty, one, two and large counters', () => { expect(rotate([], 4)).toEqual([]); expect(rotate(['A'], 20)).toEqual(['A']); expect(rotate(['A','B'], 1)).toEqual(['B','A']); expect(rotate(['A','B','C','D'], 101)).toEqual(['B','C','D','A']); });
});
