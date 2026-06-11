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
  'Lua de Mel',
  'Casa',
  'Roma',
  'Toscana',
  'Cinque Terre',
  'Veneza',
  'Costa Amalfitana',
]

export const wishes: WishItem[] = [
  {
    id: 1,
    category: 'Lua de Mel',
    title: 'Fundo lua de mel',
    description:
      'Cada centavo vira lembrança. Tem gente, tem queijo, tem vinho, tem foto desfocada de tanto rir.',
    emoji: '✈️',
    price: 'Qualquer valor',
  },
  {
    id: 2,
    category: 'Lua de Mel',
    title: 'Brinde de chegada',
    description:
      'Pra abrir a primeira garrafa de espumante assim que pousarmos. Bem-vinda, Itália!',
    emoji: '🥂',
    price: 'R$ 150',
  },
  {
    id: 3,
    category: 'Lua de Mel',
    title: 'Uma noite extra',
    description:
      'Aquela em que a gente nem quis sair do quarto. Vocês escolhem a cidade da surpresa.',
    emoji: '🌙',
    price: 'R$ 600',
  },
  {
    id: 4,
    category: 'Roma',
    title: 'Café da manhã romano',
    description:
      'Cornetto + cappuccino numa piazza, observando romanos passando. Combo simples e perfeito.',
    emoji: '☕',
    price: 'R$ 80',
  },
  {
    id: 5,
    category: 'Roma',
    title: 'Tour guiado pelo Coliseu',
    description:
      'Pisar onde gladiador pisou — versão sem leão, com áudio guide e protetor solar.',
    emoji: '🏛️',
    price: 'R$ 300',
  },
  {
    id: 6,
    category: 'Roma',
    title: 'Vaticano + Capela Sistina',
    description:
      'Pra ficar de boca aberta olhando pro teto por duas horas. Vai valer o torcicolo.',
    emoji: '🎨',
    price: 'R$ 350',
  },
  {
    id: 7,
    category: 'Roma',
    title: 'Jantar em Trastevere',
    description:
      'Carbonara à moda antiga, vinho da casa e dois apaixonados por massa. Cacio e pepe garantido.',
    emoji: '🍝',
    price: 'R$ 600',
  },
  {
    id: 8,
    category: 'Toscana',
    title: 'Foto segurando a Torre de Pisa',
    description:
      'O clássico inevitável. Prometemos fazer a pose com o máximo de seriedade possível.',
    emoji: '📸',
    price: 'R$ 50',
  },
  {
    id: 9,
    category: 'Toscana',
    title: 'Pôr do sol no Piazzale Michelangelo',
    description:
      'Vista do Duomo + spritz na mão + a gente boquiaberto. Combo perfeito de fim de tarde.',
    emoji: '🌇',
    price: 'R$ 100',
  },
  {
    id: 10,
    category: 'Toscana',
    title: 'Aula de massa fresca em Florença',
    description:
      'Voltamos sabendo dobrar ravioli — e provavelmente com farinha até no cabelo.',
    emoji: '🍳',
    price: 'R$ 500',
  },
  {
    id: 11,
    category: 'Toscana',
    title: 'Degustação de vinhos no Chianti',
    description:
      'Cinco taças, três queijos, dois apaixonados e um motorista designado (não é nenhum dos dois).',
    emoji: '🍷',
    price: 'R$ 700',
  },
  {
    id: 12,
    category: 'Toscana',
    title: 'Diária em agriturismo',
    description:
      'Acordar com galo, café com vista pra oliveira e zero pressa. O sonho.',
    emoji: '🌻',
    price: 'R$ 1.500',
  },
  {
    id: 13,
    category: 'Cinque Terre',
    title: 'Passe de trilha entre os 5 vilarejos',
    description:
      'Cinco vilas coloridas, mar azul e várias paradas pra fingir que não estamos sem fôlego.',
    emoji: '🥾',
    price: 'R$ 120',
  },
  {
    id: 14,
    category: 'Cinque Terre',
    title: 'Trem panorâmico La Spezia → Monterosso',
    description:
      'Janela aberta, mar à esquerda, falésia à direita. Cena de filme, mas é real.',
    emoji: '🚂',
    price: 'R$ 100',
  },
  {
    id: 15,
    category: 'Cinque Terre',
    title: 'Almoço com vista em Vernazza',
    description:
      'Frutos do mar fresquinhos, vista pro porto e o vento bagunçando o cabelo da Giulia.',
    emoji: '🐟',
    price: 'R$ 400',
  },
  {
    id: 16,
    category: 'Veneza',
    title: 'Spritz no Campo San Marco',
    description:
      'Aperol laranja na mão, pombo no joelho, Veneza pura. Inegociável.',
    emoji: '🍹',
    price: 'R$ 90',
  },
  {
    id: 17,
    category: 'Veneza',
    title: 'Travessia para Murano e Burano',
    description:
      'Vidro soprado em Murano, casinhas coloridas em Burano. Fotos pra eternidade.',
    emoji: '🏝️',
    price: 'R$ 250',
  },
  {
    id: 18,
    category: 'Veneza',
    title: 'Passeio de gôndola',
    description: 'Brega? Sim. A gente vai fazer? CLARO. E ainda quer foto.',
    emoji: '🚣',
    price: 'R$ 700',
  },
  {
    id: 19,
    category: 'Costa Amalfitana',
    title: 'Pizza original em Nápoles',
    description:
      'Massa, molho, mozzarella. Só três coisas — e a melhor pizza do mundo. Sem discussão.',
    emoji: '🍕',
    price: 'R$ 150',
  },
  {
    id: 20,
    category: 'Costa Amalfitana',
    title: 'Limoncello em Positano',
    description:
      'Limão do tamanho da cabeça, vista de cinema e a gente subindo escada com sorriso bobo.',
    emoji: '🍋',
    price: 'R$ 100',
  },
  {
    id: 21,
    category: 'Costa Amalfitana',
    title: 'Passeio de barco em Capri + Gruta Azul',
    description:
      'Mergulhar numa caverna que o mar deixou azul-neon. Mágico, juramos.',
    emoji: '⛵',
    price: 'R$ 500',
  },
  {
    id: 22,
    category: 'Costa Amalfitana',
    title: 'Hotel pé na praia em Amalfi',
    description:
      'Janela aberta, som do mar e o último dia da viagem chegando bem devagar.',
    emoji: '🌊',
    price: 'R$ 2.000',
  },
  {
    id: 23,
    category: 'Casa',
    title: 'Colchão para uma estadia em casa',
    description:
      'Pra quando alguém quiser dormir bem por aqui. Conforto sem prazo de validade.',
    emoji: '🛏️',
    price: 'R$ 1.500',
  },
  {
    id: 24,
    category: 'Casa',
    title: 'Batedeira Ariete',
    description:
      'Pra inaugurar a cozinha com bolo de domingo. Pegada vintage que combina com qualquer bancada.',
    emoji: '🧁',
    price: 'R$ 600',
  },
  {
    id: 25,
    category: 'Casa',
    title: 'Torradeira Ariete',
    description:
      'Pra começar o dia com cheirinho de pão tostado e a estética retrô na bancada.',
    emoji: '🍞',
    price: 'R$ 400',
  },
  {
    id: 26,
    category: 'Casa',
    title: 'Chaleira Ariete',
    description:
      'Chá quentinho à tarde, café passado de manhã. A chaleira mais charmosa da prateleira.',
    emoji: '🫖',
    price: 'R$ 400',
  },
  {
    id: 27,
    category: 'Casa',
    title: 'Aspirador robô',
    description:
      'Limpeza rolando enquanto a gente curte o sofá. Apelidamos ele de Robertinho.',
    emoji: '🤖',
    price: 'R$ 1.500',
  },
  {
    id: 28,
    category: 'Casa',
    title: 'Kit boas-vindas cachorro',
    description:
      'Caminha, brinquedos, pote e plaquinha — pra receber o futuro membro da família com pompa.',
    emoji: '🐶',
    price: 'R$ 300',
  },
  {
    id: 29,
    category: 'Casa',
    title: 'Máquina de lavar louça',
    description:
      'Pra recuperar as noites de domingo. Promessa de menos pia, mais sofá.',
    emoji: '🍽️',
    price: 'R$ 1.000',
  },
]
