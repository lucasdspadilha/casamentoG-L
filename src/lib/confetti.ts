import confetti from 'canvas-confetti'

const SITE_COLORS = ['#7A9E7E', '#B5C9B7', '#C9A96E', '#E2C99A', '#F7F3EC']

export function celebrate() {
  const end = Date.now() + 1500

  const fire = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: SITE_COLORS,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: SITE_COLORS,
    })

    if (Date.now() < end) {
      requestAnimationFrame(fire)
    }
  }

  fire()
}
