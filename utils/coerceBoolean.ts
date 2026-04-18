/**
 * Надёжное приведение к boolean (JSON/БД иногда отдают строки "true"/"false").
 */
export function coerceBoolean(value: unknown): boolean {
  if (value === true || value === 1 || value === '1') return true
  if (value === false || value === 0 || value === '0' || value === null || value === undefined) return false
  if (typeof value === 'string') {
    const s = value.trim().toLowerCase()
    if (s === 'true' || s === 'yes' || s === 'on') return true
    if (s === 'false' || s === 'no' || s === 'off' || s === '') return false
  }
  return Boolean(value)
}
