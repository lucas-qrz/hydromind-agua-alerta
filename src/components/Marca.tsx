interface Props {
  compacta?: boolean
}

/** Marca do produto: a gota dentro do anel, como na identidade da HydroMind. */
export function Marca({ compacta = false }: Props) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="gota" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9EDCF7" />
            <stop offset="100%" stopColor="#1E6BFF" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="none" stroke="#4D9BFF" strokeOpacity="0.45" />
        <path
          d="M20 8c4.6 5.6 8 9.6 8 13.4A8 8 0 0 1 12 21.4C12 17.6 15.4 13.6 20 8Z"
          fill="url(#gota)"
        />
        <path d="M20 16v9" stroke="#04101F" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {!compacta && (
        <div className="leading-none">
          <p className="font-marca text-xl text-white brilho-marca">Água Alerta</p>
          <p className="mt-1 text-[11px] tracking-wide text-espuma/60">por HydroMind</p>
        </div>
      )}
    </div>
  )
}
