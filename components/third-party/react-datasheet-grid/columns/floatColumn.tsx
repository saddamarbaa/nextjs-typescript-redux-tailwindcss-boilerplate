import { createTextColumn } from './textColumn'

export const floatColumn = createTextColumn<number | null>({
  alignRight: true,
  formatBlurredInput: (value) => (typeof value === 'number' ? new Intl.NumberFormat().format(value) : ''),
  parseUserInput: (value) => {
    const number = parseFloat(value)
    return !Number.isNaN(number) ? number : null
  },
  parsePastedValue: (value) => {
    const number = parseFloat(value)
    return !Number.isNaN(number) ? number : null
  },
})
