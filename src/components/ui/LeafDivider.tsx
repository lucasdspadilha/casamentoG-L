interface LeafDividerProps {
  className?: string
}

export function LeafDivider({ className = '' }: LeafDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-sage-light/40" />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="text-sage shrink-0"
      >
        <path
          d="M16 4C16 4 8 10 8 18C8 22.4183 11.5817 26 16 26C20.4183 26 24 22.4183 24 18C24 10 16 4 16 4Z"
          fill="currentColor"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="16"
          y1="26"
          x2="16"
          y2="30"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="12"
          x2="11"
          y2="17"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="16"
          x2="21"
          y2="13"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
      <div className="h-px flex-1 bg-sage-light/40" />
    </div>
  )
}
