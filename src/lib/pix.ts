export const PIX_CONFIG = {
  key: 'lucassanpadilha@hotmail.com',
  name: 'Lucas Padilha',
  city: 'São Paulo',
}

const LIMITS = {
  key: 77,
  name: 25,
  city: 15,
  txid: 25,
  amount: 13,
}

interface PixPayloadOptions {
  amount?: number
  txid?: string
}

function field(id: string, value: string): string {
  if (value.length > 99) {
    throw new Error(`Pix field "${id}" excede 99 caracteres (tem ${value.length})`)
  }
  const len = String(value.length).padStart(2, '0')
  return id + len + value
}

function sanitize(s: string, maxLen: number): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .slice(0, maxLen)
}

function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xffff
      else crc = (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function generatePixPayload({ amount, txid }: PixPayloadOptions = {}): string {
  if (PIX_CONFIG.key.length > LIMITS.key) {
    throw new Error(`Pix key excede ${LIMITS.key} caracteres`)
  }

  const safeName = sanitize(PIX_CONFIG.name, LIMITS.name)
  const safeCity = sanitize(PIX_CONFIG.city, LIMITS.city)
  const safeTxid = txid ? sanitize(txid, LIMITS.txid) : '***'

  const amountStr = amount && amount > 0 ? amount.toFixed(2) : ''
  if (amountStr.length > LIMITS.amount) {
    throw new Error(`Valor excede ${LIMITS.amount} caracteres`)
  }

  const mai = field('00', 'br.gov.bcb.pix') + field('01', PIX_CONFIG.key)
  const parts = [
    field('00', '01'),
    field('01', '11'),
    field('26', mai),
    field('52', '0000'),
    field('53', '986'),
  ]
  if (amountStr) {
    parts.push(field('54', amountStr))
  }
  parts.push(
    field('58', 'BR'),
    field('59', safeName),
    field('60', safeCity),
    field('62', field('05', safeTxid))
  )

  const payloadWithoutCRC = parts.join('') + '6304'
  const crc = crc16(payloadWithoutCRC)
  return payloadWithoutCRC + crc
}
