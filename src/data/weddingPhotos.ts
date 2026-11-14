// IDs das fotos otimizadas em public/images/wedding/.
// Cada ID tem 2 arquivos: `<id>-full.webp` (1600px) e `<id>-thumb.webp` (600px).
// Pra trocar as escolhas, mova IDs entre os arrays abaixo.

export const allPhotoIds = [
  76, 91, 107, 161, 177, 190, 196, 201, 230, 244, 268, 277, 295, 303, 371, 377,
  408, 412, 418, 452, 473, 499, 520, 524, 528, 535, 537, 552, 553, 563, 571,
  573, 574, 576, 581, 607, 608, 638, 646, 653, 655, 661, 664, 671, 677, 680,
  690, 696, 700, 705, 716, 717, 725, 732, 733, 749, 753, 761, 766, 767, 772,
  777, 778, 783, 792, 795, 799, 807, 811, 821, 831, 838, 842, 846, 850, 854,
  857, 858, 870, 880, 884, 892, 899, 902, 911, 933, 935, 946, 947, 949, 953,
  965, 976, 980, 988, 989,
] as const

export function photoUrl(
  id: number,
  size: 'full' | 'thumb' = 'full'
): string {
  return `/images/wedding/${id}-${size}.webp`
}

// --- Slots específicos (troque os IDs à vontade) -----------------------------

/** Foto de fundo do Hero MT — aplicada com overlay cream suave. */
export const heroPhotoId = 767

/** Foto "fim do capítulo" no OurStory — um momento forte do altar. */
export const storyEndPhotoId = 537

/** Faixa divisora entre Gallery e Rsvp — 4 fotos pequenas. */
export const stripPhotoIds: number[] = [732, 607, 244, 733]

/** Grid principal da Gallery de casamento — ordem aqui define a ordem no grid. */
export const galleryPhotoIds: number[] = [...allPhotoIds]
