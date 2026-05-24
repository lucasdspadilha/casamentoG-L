export interface FaqItem {
  question: string
  answer: string
}

export const faqs: FaqItem[] = [
  {
    question: 'Qual é o dress code?',
    answer:
      'Traje esporte fino. Fique à vontade para se expressar com elegância!',
  },
  {
    question: 'Haverá estacionamento?',
    answer:
      'Sim, o Bar Botânico conta com estacionamento ao redor e há vagas rotativas na rua. Recomendamos também os aplicativos de transporte por praticidade.',
  },
  // {
  //   question: 'Crianças são bem-vindas?',
  //   answer:
  //     'Adoramos as crianças da nossa família! Elas são bem-vindas — mas pedimos que em caso de choro durante a cerimônia, os pais as acompanhem discretamente para fora do salão.',
  // },
  // {
  //   question: 'Posso tirar fotos durante a cerimônia?',
  //   answer:
  //     'Pedimos que durante a cerimônia vocês estejam presentes com os olhos e o coração — sem celulares. Temos fotógrafo e cinematografista profissionais. Depois da cerimônia, cliquem à vontade!',
  // },
  {
    question: 'Haverá open bar?',
    answer:
      'A festa contará com refrigerantes e sucos à vontade. Pode haver alguma bebida alcoólica ocasionalmente, mas não espere uma programação de bar — o foco é na celebração!',
  },
  {
    question: 'Até quando preciso confirmar presença?',
    answer:
      'Pedimos que confirme até o dia 10 de agosto de 2026 pelo formulário aqui do site.',
  },
]
