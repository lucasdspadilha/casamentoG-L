import type { VercelRequest, VercelResponse } from '@vercel/node'

// Retorna região/país do IP do visitante usando headers injetados pelo edge da Vercel.
// Em dev local esses headers não existem — retorna null.
export default function handler(req: VercelRequest, res: VercelResponse) {
  const region = (req.headers['x-vercel-ip-country-region'] as string) || null
  const country = (req.headers['x-vercel-ip-country'] as string) || null
  const city = (req.headers['x-vercel-ip-city'] as string) || null

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ region, country, city })
}
