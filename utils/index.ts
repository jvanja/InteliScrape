export const { format: formatNumber } = Intl.NumberFormat('en-GB', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

export function formatDate(
  input: Date | string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const date = typeof input === 'string' ? new Date(input) : input
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  return new Intl.DateTimeFormat(locale, options).format(date)
}
