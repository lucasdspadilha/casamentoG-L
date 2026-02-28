export interface WishItem {
  id: number
  category: string
  title: string
  description: string
  store?: string
  link?: string
  price?: string
  emoji: string
}

export const wishCategories = [
  'Todos',
  'Casa',
  'Experiências',
  'Cozinha',
  'Viagem',
]

export const wishes: WishItem[] = [
  {
    id: 1,
    category: 'Casa',
    title: 'Jogo de cama queen',
    description: 'Lençóis e fronhas 400 fios, cor off-white ou bege.',
    emoji: '🛏️',
    price: 'R$ 350–600',
  },
  {
    id: 2,
    category: 'Cozinha',
    title: 'Panela de ferro fundido',
    description: 'Le Creuset ou similar, tamanho 26cm. Qualquer cor.',
    store: 'Le Creuset',
    emoji: '🍳',
    price: 'R$ 800–1.200',
  },
  {
    id: 3,
    category: 'Experiências',
    title: 'Jantar romântico',
    description:
      'Uma noite especial em um restaurante que ainda não conhecemos. Nos surpreenda!',
    emoji: '🍷',
    price: 'R$ 300+',
  },
  {
    id: 4,
    category: 'Viagem',
    title: 'Fundo lua de mel',
    description:
      'Contribuição para nossa viagem de lua de mel — cada centavo vira memória.',
    emoji: '✈️',
    price: 'Qualquer valor',
  },
  {
    id: 5,
    category: 'Casa',
    title: 'Luminária de mesa',
    description: 'Estilo minimalista, base em metal ou cerâmica, tons neutros.',
    emoji: '🪔',
    price: 'R$ 200–500',
  },
  {
    id: 6,
    category: 'Cozinha',
    title: 'Máquina de café espresso',
    description:
      'Somos apaixonados por café. Uma máquina boa faz toda a diferença nas manhãs.',
    emoji: '☕',
    price: 'R$ 600–1.500',
  },
  {
    id: 7,
    category: 'Experiências',
    title: 'Spa a dois',
    description: 'Um dia de relaxamento e cuidado — juntos.',
    emoji: '🧘',
    price: 'R$ 400+',
  },
  {
    id: 8,
    category: 'Casa',
    title: 'Conjunto de toalhas',
    description:
      'Toalhas de banho e rosto em algodão egípcio, tons neutros (bege, branco, cinza).',
    emoji: '🏳️',
    price: 'R$ 250–500',
  },
  {
    id: 9,
    category: 'Viagem',
    title: 'Hospedagem especial',
    description:
      'Uma diária em um lugar diferente — pousada, hotel boutique ou chalé.',
    emoji: '🏨',
    price: 'R$ 500+',
  },
  {
    id: 10,
    category: 'Cozinha',
    title: 'Conjunto de facas',
    description:
      'Facas de chef em aço inoxidável de qualidade. Adoramos cozinhar juntos.',
    emoji: '🔪',
    price: 'R$ 400–900',
  },
  {
    id: 11,
    category: 'Experiências',
    title: 'Show ou peça de teatro',
    description:
      'Ingressos para um show, peça ou experiência cultural em São Paulo.',
    emoji: '🎭',
    price: 'R$ 200+',
  },
  {
    id: 12,
    category: 'Casa',
    title: 'Plantas e vasos',
    description:
      'Amamos plantas em casa. Qualquer espécie resistente e um vaso bonito.',
    emoji: '🌿',
    price: 'R$ 80–300',
  },
]
