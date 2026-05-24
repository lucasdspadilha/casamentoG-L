export function parseAmount(price: string | undefined): number | null {
  if (!price) return null
  const match = price.match(/R\$\s*([\d.,]+)/i)
  if (!match) return null
  const num = parseFloat(match[1].replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(num) ? num : null
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
