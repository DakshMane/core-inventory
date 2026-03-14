export function formatQty(qty, uom = '') {
  if (qty === null || qty === undefined) return '—'
  return `${Number(qty).toLocaleString()} ${uom}`.trim()
}