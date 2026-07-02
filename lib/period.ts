export function currentPeriod() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export function shiftPeriod(period: string, deltaMonths: number) {
  const [year, month] = period.split('-').map(Number)
  const date = new Date(year, month - 1 + deltaMonths, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}

export function formatPeriodLabel(period: string) {
  const [year, month] = period.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const label = date.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}
