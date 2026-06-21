export interface Guest {
  id: string
  name: string
  nicknames?: string[]
  isPlusOnePlaceholder?: boolean
}

export interface GuestGroup {
  id: string
  label: string
  guests: Guest[]
}

export const guestGroups: GuestGroup[] = [
  {
    id: 'familia-moutinho',
    label: 'Família Moutinho',
    guests: [
      { id: 'moutinho-carla', name: 'Carla' },
      { id: 'moutinho-ricardo', name: 'Ricardo' },
      { id: 'moutinho-malu', name: 'Malu' },
    ],
  },
  {
    id: 'familia-alves-almeida',
    label: 'Família Alves de Almeida',
    guests: [
      { id: 'alves-sonia', name: 'Sonia' },
      { id: 'alves-sergio', name: 'Sergio' },
      { id: 'alves-carol', name: 'Carol' },
    ],
  },
  {
    id: 'familia-teixeira',
    label: 'Família Teixeira',
    guests: [
      { id: 'teixeira-karine', name: 'Karine' },
      { id: 'teixeira-ze', name: 'Ze' },
      { id: 'teixeira-henrique', name: 'Henrique' },
      { id: 'teixeira-laura', name: 'Laura' },
      { id: 'teixeira-julia', name: 'Julia' },
    ],
  },
  {
    id: 'gabi-aytan',
    label: 'Gabi Muller e Aytan',
    guests: [
      { id: 'gabi-muller', name: 'Gabi Muller' },
      { id: 'aytan', name: 'Aytan' },
    ],
  },
  {
    id: 'emerson-josiely',
    label: 'Emerson e Josiely',
    guests: [
      { id: 'emerson', name: 'Emerson' },
      { id: 'josiely', name: 'Josiely' },
    ],
  },
  {
    id: 'eduardo-luci',
    label: 'Eduardo e Luci',
    guests: [
      { id: 'eduardo-l', name: 'Eduardo' },
      { id: 'luci', name: 'Luci' },
    ],
  },
  {
    id: 'denis-luisa',
    label: 'Denis e Luisa',
    guests: [
      { id: 'denis', name: 'Denis' },
      { id: 'luisa', name: 'Luisa' },
    ],
  },
  {
    id: 'dudu',
    label: 'Dudu',
    guests: [{ id: 'dudu', name: 'Dudu' }],
  },
  {
    id: 'familia-businaro',
    label: 'Família Businaro',
    guests: [
      { id: 'businaro-paula', name: 'Paula' },
      { id: 'businaro-felipe', name: 'Felipe' },
      { id: 'businaro-aurora', name: 'Aurora' },
    ],
  },
  {
    id: 'andreia-regimar',
    label: 'Andreia e Regimar',
    guests: [
      { id: 'andreia', name: 'Andreia' },
      { id: 'regimar', name: 'Regimar' },
    ],
  },
  {
    id: 'dita-acompanhante',
    label: 'Fatima Benedita e acompanhante',
    guests: [
      { id: 'dita', name: 'Fatima Benedita' },
      {
        id: 'dita-plus-one',
        name: 'Acompanhante',
        isPlusOnePlaceholder: true,
      },
    ],
  },
  {
    id: 'camila-danilo',
    label: 'Camila e Danilo',
    guests: [
      { id: 'camila-d', name: 'Camila' },
      { id: 'danilo', name: 'Danilo' },
    ],
  },
  {
    id: 'juliana-maya',
    label: 'Juliana e Maya',
    guests: [
      { id: 'juliana', name: 'Juliana' },
      { id: 'maya', name: 'Maya' },
    ],
  },
  {
    id: 'camila-ze',
    label: 'Camila e Ze',
    guests: [
      { id: 'camila-z', name: 'Camila' },
      { id: 'ze-camila', name: 'Ze' },
    ],
  },
  {
    id: 'isabel-bareno',
    label: 'Isabel Bareno',
    guests: [{ id: 'isabel-bareno', name: 'Isabel Bareno' }],
  },
  {
    id: 'isabella-story',
    label: 'Isabella Story',
    guests: [{ id: 'isabella-story', name: 'Isabella Story' }],
  },
  {
    id: 'vagner-duda',
    label: 'Vagner e Duda',
    guests: [
      { id: 'vagner', name: 'Vagner' },
      { id: 'duda', name: 'Duda' },
    ],
  },
  {
    id: 'marcela-felipe',
    label: 'Marcela e Felipe',
    guests: [
      { id: 'marcela', name: 'Marcela' },
      { id: 'felipe-m', name: 'Felipe' },
    ],
  },
  {
    id: 'kesya-goncalves',
    label: 'Kesya Gonçalves',
    guests: [{ id: 'kesya-goncalves', name: 'Kesya Gonçalves' }],
  },
  {
    id: 'isabela-mageste',
    label: 'Isabela Mageste',
    guests: [{ id: 'isabela-mageste', name: 'Isabela Mageste' }],
  },
  {
    id: 'familia-rossi-portella',
    label: 'Família Rossi Portella',
    guests: [
      { id: 'rossi-michelle', name: 'Michelle' },
      { id: 'rossi-marcio', name: 'Marcio' },
      { id: 'rossi-enzo', name: 'Enzo' },
    ],
  },
  {
    id: 'familia-miranda',
    label: 'Família Miranda',
    guests: [
      { id: 'miranda-sandra', name: 'Sandra' },
      { id: 'miranda-leandro', name: 'Leandro' },
      { id: 'miranda-marcelo', name: 'Marcelo' },
    ],
  },
  {
    id: 'telma-mario',
    label: 'Telma e Mario',
    guests: [
      { id: 'telma', name: 'Telma' },
      { id: 'mario', name: 'Mario' },
    ],
  },
  {
    id: 'victor-bruna',
    label: 'Victor e Bruna',
    guests: [
      { id: 'victor', name: 'Victor' },
      { id: 'bruna', name: 'Bruna' },
    ],
  },
  {
    id: 'familia-marra',
    label: 'Família Marra',
    guests: [
      { id: 'marra-adriana', name: 'Adriana' },
      { id: 'marra-luiz', name: 'Luiz' },
      { id: 'marra-valentina', name: 'Valentina' },
    ],
  },
  {
    id: 'familia-espindola-dias',
    label: 'Família Espindola Dias',
    guests: [
      { id: 'espindola-luana', name: 'Luana' },
      { id: 'espindola-rodrigo', name: 'Rodrigo' },
      { id: 'espindola-alexia', name: 'Alexia' },
    ],
  },
  {
    id: 'rafaella-david',
    label: 'Rafaella e David',
    guests: [
      { id: 'rafaella', name: 'Rafaella' },
      { id: 'david', name: 'David' },
    ],
  },
  {
    id: 'charllote',
    label: 'Charllote',
    guests: [{ id: 'charllote', name: 'Charllote' }],
  },
  {
    id: 'bruna-pedro-fotografo',
    label: 'Bruna e Pedro',
    guests: [
      { id: 'bruna-fotografa', name: 'Bruna' },
      { id: 'pedro-fotografo', name: 'Pedro' },
    ],
  },
  {
    id: 'marcia-rossi',
    label: 'Marcia Rossi',
    guests: [{ id: 'marcia-rossi', name: 'Marcia Rossi' }],
  },
]
