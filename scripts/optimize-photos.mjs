#!/usr/bin/env node
/**
 * Converte fotos originais em WebP (2 tamanhos) pra usar no site.
 *
 * Uso:
 *   node scripts/optimize-photos.mjs <sourceDir>
 *
 * Exemplo:
 *   node scripts/optimize-photos.mjs "C:/Users/lucas/Downloads/photos/Separadas"
 *
 * Saída:
 *   public/images/wedding/<baseName>-full.webp  (1600px largura, qualidade 80)
 *   public/images/wedding/<baseName>-thumb.webp (600px largura, qualidade 75)
 */

import { mkdir, readdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const projectRoot = join(__filename, '..', '..')

const sourceDir = process.argv[2]
if (!sourceDir) {
  console.error('❌ Faltou o diretório de origem.')
  console.error('   uso: node scripts/optimize-photos.mjs <sourceDir>')
  process.exit(1)
}

const outDir = join(projectRoot, 'public', 'images', 'wedding')
await mkdir(outDir, { recursive: true })

const SUPPORTED = /\.(jpe?g|png)$/i

const files = (await readdir(sourceDir))
  .filter((f) => SUPPORTED.test(f))
  .sort()

console.log(`🖼️  ${files.length} fotos encontradas em ${sourceDir}`)
console.log(`📁 saída: ${outDir}\n`)

let totalIn = 0
let totalOut = 0
let processed = 0

for (const file of files) {
  const srcPath = join(sourceDir, file)
  const { name } = parse(file)

  // Normaliza nome: "107-IMG_1157" → "107"
  const slug = name.split('-')[0] || name

  const fullOut = join(outDir, `${slug}-full.webp`)
  const thumbOut = join(outDir, `${slug}-thumb.webp`)

  const srcStat = await stat(srcPath)
  totalIn += srcStat.size

  await Promise.all([
    sharp(srcPath)
      .rotate() // respeita EXIF orientation
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fullOut),
    sharp(srcPath)
      .rotate()
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbOut),
  ])

  const [full, thumb] = await Promise.all([stat(fullOut), stat(thumbOut)])
  totalOut += full.size + thumb.size
  processed++

  process.stdout.write(
    `\r✓ ${processed}/${files.length}  ${slug}  (${(full.size / 1024).toFixed(0)}k + ${(thumb.size / 1024).toFixed(0)}k)        `
  )
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`\n\n✅ ${processed} fotos processadas`)
console.log(`   Original: ${mb(totalIn)}MB → Otimizado: ${mb(totalOut)}MB (${((1 - totalOut / totalIn) * 100).toFixed(0)}% menor)`)
