import { Heart } from 'lucide-react'

export function FooterMt() {
  return (
    <footer className="bg-charcoal text-cream py-16 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
        <img
          src="/logo3.png"
          alt="Giulia & Lucas"
          className="h-40 w-auto select-none invert hue-rotate-180 opacity-70"
        />

        <p className="font-sans text-xs tracking-[0.2em] uppercase text-cream/50">
          07 de Fevereiro de 2027 · Colíder, MT
        </p>

        <div
          className="h-px w-24"
          style={{ backgroundColor: 'var(--color-sage-light)', opacity: 0.3 }}
        />

        <p className="font-serif italic text-lg font-light text-cream/70 max-w-sm leading-relaxed">
          "Amar não é olhar um para o outro, é olhar juntos na mesma direção."
        </p>

        <p className="font-sans text-xs text-cream/30">
          — Antoine de Saint-Exupéry
        </p>

        <div className="mt-6 flex items-center gap-2 text-cream/30">
          <span className="font-sans text-xs">Feito com</span>
          <Heart size={12} style={{ color: 'var(--color-sage)', fill: 'var(--color-sage)' }} />
          <span className="font-sans text-xs">por Giulia & Lucas</span>
        </div>
      </div>
    </footer>
  )
}
