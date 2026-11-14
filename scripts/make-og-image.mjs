#!/usr/bin/env node
/**
 * Gera public/og-image.jpg (1200x630) com a cara da HeroMt:
 * foto do casamento + overlay cream + textos centralizados.
 *
 * Uso: node scripts/make-og-image.mjs
 * Rodar sempre que trocar heroPhotoId ou textos do hero.
 */

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const projectRoot = join(__filename, '..', '..')

const SOURCE_PHOTO = join(projectRoot, 'public', 'images', 'wedding', '767-full.webp')
const OUTPUT = join(projectRoot, 'public', 'og-image.jpg')

const W = 1200
const H = 630

const overlaySvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#F7F3EC" stop-opacity="0.65"/>
      <stop offset="50%"  stop-color="#F7F3EC" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#F7F3EC" stop-opacity="0.80"/>
    </linearGradient>
    <radialGradient id="warm" cx="50%" cy="0%" r="70%">
      <stop offset="0%"   stop-color="#C97B4A" stop-opacity="0.00"/>
      <stop offset="100%" stop-color="#C97B4A" stop-opacity="0.00"/>
    </radialGradient>
  </defs>

  <!-- Overlays sobre a foto -->
  <rect width="100%" height="100%" fill="url(#cream)"/>

  <!-- Rótulo -->
  <text x="50%" y="140"
        text-anchor="middle"
        font-family="Jost, Helvetica, Arial, sans-serif"
        font-size="18"
        letter-spacing="6"
        fill="#5A5A5A">
    CHURRASCO DE COMEMORAÇÃO
  </text>

  <!-- Nomes -->
  <text x="50%" y="265"
        text-anchor="middle"
        font-family="'Cormorant Garamond', Garamond, Georgia, serif"
        font-size="96"
        font-weight="300"
        fill="#2C2C2C">Giulia</text>

  <text x="50%" y="345"
        text-anchor="middle"
        font-family="'Cormorant Garamond', Garamond, Georgia, serif"
        font-size="72"
        font-weight="400"
        fill="#4E7052">&amp;</text>

  <text x="50%" y="430"
        text-anchor="middle"
        font-family="'Cormorant Garamond', Garamond, Georgia, serif"
        font-size="96"
        font-weight="300"
        fill="#2C2C2C">Lucas</text>

  <!-- Linha + info -->
  <line x1="540" y1="482" x2="660" y2="482" stroke="#B5C9B7" stroke-width="1"/>

  <text x="50%" y="520"
        text-anchor="middle"
        font-family="Jost, Helvetica, Arial, sans-serif"
        font-size="18"
        letter-spacing="4"
        fill="#5A5A5A">
    07 DE FEVEREIRO · 10H
  </text>

  <text x="50%" y="555"
        text-anchor="middle"
        font-family="Jost, Helvetica, Arial, sans-serif"
        font-size="14"
        letter-spacing="3"
        fill="#5A5A5A"
        opacity="0.7">
    RECANTO DAS FAMÍLIAS · COLÍDER, MT
  </text>

  <line x1="540" y1="575" x2="660" y2="575" stroke="#B5C9B7" stroke-width="1"/>
</svg>
`

async function main() {
  // Crop manual: resize pela largura, depois extract 630px começando
  // em ~25% do topo — shifta a imagem pra cima mantendo o casal no frame.
  const meta = await sharp(SOURCE_PHOTO).rotate().metadata()
  const scale = W / meta.width
  const scaledHeight = Math.round(meta.height * scale)
  const topOffset = Math.max(0, Math.round(scaledHeight * 0.25))

  const base = await sharp(SOURCE_PHOTO)
    .rotate()
    .resize({ width: W })
    .extract({ top: topOffset, left: 0, width: W, height: H })
    .modulate({ saturation: 0.95 })
    .toBuffer()

  const result = await sharp(base)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OUTPUT)

  console.log(`✅ og-image.jpg → ${W}x${H} · ${(result.size / 1024).toFixed(0)}KB`)
  console.log(`   ${OUTPUT}`)
}

main().catch((err) => {
  console.error('❌ Falhou:', err.message)
  process.exit(1)
})
