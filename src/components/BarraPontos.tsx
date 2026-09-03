import { emLitros } from '@/lib/formato'
import type { PontoMonitorado } from '@/types'

interface Props {
  dados: { pontoId: string; litros: number; variacao: number }[]
  pontos: PontoMonitorado[]
}

/** Onde a água do mês foi parar, do maior para o menor. */
export function BarraPontos({ dados, pontos }: Props) {
  const total = dados.reduce((s, d) => s + d.litros, 0)
  const maior = Math.max(...dados.map((d) => d.litros))

  return (
    <ul className="space-y-4">
      {dados.map((d) => {
        const ponto = pontos.find((p) => p.id === d.pontoId)
        const subiuMuito = d.variacao > 0.25
        return (
          <li key={d.pontoId}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-espuma/85">{ponto?.nome ?? d.pontoId}</span>
              <span className="shrink-0 text-espuma/55">
                {emLitros(d.litros)} · {Math.round((d.litros / total) * 100)}%
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className={`h-full rounded-full ${subiuMuito ? 'bg-vazamento' : 'bg-hidro'}`}
                  style={{ width: `${(d.litros / maior) * 100}%` }}
                />
              </div>
              <span className={`w-16 shrink-0 text-right text-xs ${subiuMuito ? 'text-vazamento' : 'text-espuma/45'}`}>
                {d.variacao > 0 ? '+' : ''}
                {Math.round(d.variacao * 100)}%
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
