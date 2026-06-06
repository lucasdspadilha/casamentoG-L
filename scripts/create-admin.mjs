#!/usr/bin/env node
import bcrypt from 'bcryptjs'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const rl = createInterface({ input, output })

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('   Criar admin user — Casamento G&L')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const email = (await rl.question('E-mail: ')).trim().toLowerCase()
const password = await rl.question('Senha: ')

rl.close()

if (!email || !password) {
  console.error('\n❌ E-mail e senha são obrigatórios.\n')
  process.exit(1)
}

if (password.length < 6) {
  console.error('\n❌ Senha deve ter no mínimo 6 caracteres.\n')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 10)

console.log('\n✅ Hash gerado!\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Cola esse SQL no SQL Editor do Supabase:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log(`INSERT INTO admin_users (email, password_hash)`)
console.log(`VALUES ('${email}', '${hash}');\n`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Depois, no /admin do site, faz login com:')
console.log(`  E-mail: ${email}`)
console.log(`  Senha:  (a que você acabou de digitar)`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
