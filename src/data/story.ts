export interface StoryEvent {
  year: string
  title: string
  description: string
  emoji: string
}

export const storyEvents: StoryEvent[] = [
  {
    year: '2019',
    title: 'O primeiro encontro',
    description:
      'Foi numa tarde de sexta-feira que o destino nos colocou no mesmo lugar. Um olhar, um sorriso tímido — e algo mudou para sempre.',
    emoji: '✨',
  },
  {
    year: '2020',
    title: 'Nossa primeira viagem',
    description:
      'Descobrimos que viajamos juntos da mesma forma que vivemos: com calma, curiosidade e muitas risadas pelo caminho.',
    emoji: '🗺️',
  },
  {
    year: '2022',
    title: 'Passamos a morar juntos',
    description:
      'Nossa casa virou lar. Aprendemos que dividir o espaço é também dividir a vida — e que adoramos cada segundo disso.',
    emoji: '🏡',
  },
  {
    year: '2024',
    title: 'O pedido',
    description:
      'Numa noite especial, com o coração acelerado e os olhos cheios de certeza, Lucas pediu Giulia em casamento. A resposta veio antes mesmo da pergunta terminar.',
    emoji: '💍',
  },
  {
    year: '2025',
    title: 'Nosso dia',
    description:
      'Em 07 de setembro, prometemos um ao outro diante de todos que amamos. O começo do capítulo mais bonito.',
    emoji: '🌿',
  },
]
