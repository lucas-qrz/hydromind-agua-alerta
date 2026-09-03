import { umaCasa } from '@/lib/formato'

interface Props {
  vazaoAtual: number
  vazaoMaxima: number
  pontosAtivos: string[]
}

/**
 * O elemento principal do painel: uma coluna de vidro que enche conforme a
 * água corre agora. É a leitura que o morador entende sem legenda nenhuma.
 */
export function ColunaDagua({ vazaoAtual, vazaoMaxima, pontosAtivos }: Props) {
  const nivel = Math.min(1, vazaoAtual / vazaoMaxima)
  const alturaPct = 6 + nivel * 88
  const parado = vazaoAtual < 0.15

  return (
    <div className="flex items-stretch gap-7">
      <div className="relative w-20 shrink-0 overflow-hidden rounded-full border border-espuma/20 bg-abismo/60">
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-1000 ease-out"
          style={{ height: `${alturaPct}%` }}
        >
          <svg
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
            className="onda absolute -top-3 left-0 h-6 w-[200%]"
            aria-hidden="true"
          >
            <path
              d="M0 12 Q 25 4 50 12 T 100 12 T 150 12 T 200 12 V20 H0 Z"
              fill="#4D9BFF"
              fillOpacity="0.55"
            />
          </svg>
          <div className="h-full w-full bg-gradient-to-t from-hidro/90 to-eletrico/70" />
        </div>
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
      </div>

      <div className="flex flex-col justify-between py-1">
        <div>
          <p className="text-sm text-espuma/60">Passando pelo cavalete agora</p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="font-marca text-6xl text-white brilho-marca">{umaCasa(vazaoAtual)}</span>
            <span className="text-lg text-espuma/70">L/min</span>
          </p>
        </div>

        <div className="mt-6 text-sm">
          {parado ? (
            <p className="text-espuma/50">Nenhum ponto em uso. A rede está fechada.</p>
          ) : (
            <p className="text-espuma/70">
              Correndo em: <span className="text-white">{pontosAtivos.join(', ')}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
