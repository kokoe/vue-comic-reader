export function genUniqKey (): number {
  return Math.random() * 0x80000000 | 0;
}
