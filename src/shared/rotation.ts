export function rotate<T>(items: readonly T[], counter: number): T[] {
  if (!items.length) return [];
  const offset = ((counter % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
