import { describe, expect, it } from 'vitest';
import { rotate } from './rotation';
describe('rotate', () => {
  it('cycles first position over nine openings', () => expect(Array.from({ length: 9 }, (_, i) => rotate(['A','B','C'], i)[0])).toEqual(['A','B','C','A','B','C','A','B','C']));
  it('returns complete circular orders', () => expect(Array.from({ length: 4 }, (_, i) => rotate(['A','B','C'], i).join(' '))).toEqual(['A B C','B C A','C A B','A B C']));
  it('supports empty, one, two and large counters', () => { expect(rotate([], 4)).toEqual([]); expect(rotate(['A'], 20)).toEqual(['A']); expect(rotate(['A','B'], 1)).toEqual(['B','A']); expect(rotate(['A','B','C'], 100)).toEqual(['B','C','A']); });
});
