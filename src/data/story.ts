export interface StoryEvent {
  year: string
  title: string
  description: string
  emoji: string
  img?: string // caminho relativo a /public — undefined = sem slot de imagem
}

export const storyEvents: StoryEvent[] = [
  {
    year: 'Carnaval 2020',
    title: 'O cavaleiro errante e a princesa perdida',
    description:
      'Era Carnaval e Lucas, forasteiro na cidade, estava pronto para curtir o bloco quando surge Giulia — nascida e criada ali — completamente perdida, sem saber onde ficava a rua do bloquinho. Pois é. Um cavaleiro errante no lugar certo, na hora certa. O destino tem senso de humor.',
    emoji: '🎭',
    img: `${import.meta.env.BASE_URL}images/story/carnaval.jpeg`,
  },
  {
    year: '2021 · 2025',
    title: '180 km de saudade — e de ônibus',
    description:
      'Logo depois de um lindo ano juntos, Lucas mudou para fazer faculdade, a 180 km de distância. A saudade tentou atrapalhar, mas não contava com nossa teimosia. Ônibus, moto, carro — usamos tudo. Acordar cedo, dormir tarde, perrengue pra lá e pra cá. A distância acabou nos provando que a gente era a coisa mais certa.',
    emoji: '🚌',
    img: `${import.meta.env.BASE_URL}images/story/morando_longe.jpeg`,
  },
  {
    year: 'Fevereiro 2025',
    title: 'Claro que tinha que ter um castelo',
    description:
      'Toda história de amor que se preza tem um castelo, né? Estávamos na Disney quando Lucas, coração na boca e mãos tremendo, fez a pergunta. O castelo ao fundo era o cenário perfeito — ou quase, porque a resposta de Giulia foi tão rápida que ele mal terminou a frase.',
    emoji: '🏰',
    img: `${import.meta.env.BASE_URL}images/story/pedido.jpeg`,
  },
  {
    year: 'Abril 2025',
    title: 'Nossa primeira casinha',
    description:
      'Depois do pedido, era hora de transformar "eu" em "nós" de verdade. Um apartamento na Vila Mascote, cheio de plantas, disputas pelo espaço do home-office e rotinas a dois. A mesa de jantar virou campo de batalha profissional — mas ainda assim é o lugar favorito de ambos.',
    emoji: '🏡',
    img: `${import.meta.env.BASE_URL}images/story/primeira_casa.jpeg`,
  },
  {
    year: '07 Set · 2025',
    title: 'Nosso dia',
    description:
      'Em 07 de setembro, prometemos um ao outro diante de todos que amamos. O começo do capítulo mais bonito que já escrevemos juntos.',
    emoji: '🌿',
  },
]
