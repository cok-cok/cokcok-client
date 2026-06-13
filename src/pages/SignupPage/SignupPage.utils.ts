export function formatExpiry(seconds: number): string {
  if (seconds <= 0) return '0초';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}초`;
  return `${m}분 ${s}초`;
}
