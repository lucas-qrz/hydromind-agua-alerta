import { useState } from 'react'
import type { PontoHora } from '@/types'
import { emLitros } from '@/lib/formato'

interface Props {
  serie: PontoHora[]
}

const L = 34
const R = 8
const T = 12
const B = 26
const W = 720
const H = 220

/** Consumo por hora contra a média histórica do mesmo horário. */
export function GraficoDia({ serie }: Props) {
  const [foco, setFoco] = useState<number | null>(null)
  const max = Math.max(...serie.map((h) => Math.max(h.litros, h.mediaHistorica))) * 1.15

  const x = (i: number) => L + (i / (serie.length - 1)) * (W - L - R)
  const y = (v: number) => T + (1 - v / max) * (H - T - B)

  const linha = (chave: 'litros' | 'mediaHistorica') =>
    serie.map((h, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(h[chave]).toFixed(1)}`).join(' ')

  const area = `${linha('litros')} L ${x(serie.length - 1)} ${H - B} L ${x(0)} ${H - B} Z`
  const item = foco !== null ? serie[foco] : null

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Consumo por hora do dia">
        <defs>
          <linearGradient id="areaAgua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4D9BFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1E6BFF" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1={L}
              x2={W - R}
              y1={y(max * f)}
              y2={y(max * f)}
              stroke="#9EDCF7"
              strokeOpacity="0.08"
            />
            <text x={0} y={y(max * f) + 4} fill="#9EDCF7" fillOpacity="0.4" fontSize="11">
              {Math.round(max * f)}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#areaAgua)" />
        <path d={linha('mediaHistorica')} fill="none" stroke="#9EDCF7" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="4 4" />
        <path d={linha('litros')} fill="none" stroke="#4D9BFF" strokeWidth="2" />

        {serie.map((h, i) => {
          const anormal = h.mediaHistorica > 1 && h.litros / h.mediaHistorica > 2.2
          return anormal ? <circle key={h.hora} cx={x(i)} cy={y(h.litros)} r="3.5" fill="#FF6B84" /> : null
        })}

        {foco !== null && <line x1={x(foco)} x2={x(foco)} y1={T} y2={H - B} stroke="#9EDCF7" strokeOpacity="0.25" />}

        {serie.map((h, i) => (
          <rect
            key={h.hora}
            x={x(i) - (W - L - R) / serie.length / 2}
            y={T}
            width={(W - L - R) / serie.length}
            height={H - T - B}
            fill="transparent"
            onMouseEnter={() => setFoco(i)}
            onMouseLeave={() => setFoco(null)}
          />
        ))}

        {[0, 6, 12, 18, 23].map((h) => (
          <text key={h} x={x(h)} y={H - 6} fill="#9EDCF7" fillOpacity="0.4" fontSize="11" textAnchor="middle">
            {String(h).padStart(2, '0')}h
          </text>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-espuma/55">
        <span className="flex items-center gap-2">
          <span className="h-px w-5 bg-eletrico" /> hoje
        </span>
        <span className="flex items-center gap-2">
          <span className="h-px w-5 border-t border-dashed border-espuma/50" /> média dos últimos 30 dias
        </span>
        {item && (
          <span className="text-espuma">
            {String(item.hora).padStart(2, '0')}h — {emLitros(item.litros)} (média {emLitros(item.mediaHistorica)})
          </span>
        )}
      </div>
    </div>
  )
}
