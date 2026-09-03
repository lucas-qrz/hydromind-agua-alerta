import { AlertTriangle, Check, Info, Droplets } from 'lucide-react'
import type { Alerta } from '@/types'
import { emLitros, emReais, tempoRelativo } from '@/lib/formato'

const aparencia = {
  vazamento: { cor: 'text-vazamento', barra: 'bg-vazamento', Icone: Droplets, rotulo: 'Vazamento provável' },
  anomalia: { cor: 'text-atencao', barra: 'bg-atencao', Icone: AlertTriangle, rotulo: 'Consumo fora do padrão' },
  informacao: { cor: 'text-espuma', barra: 'bg-espuma/60', Icone: Info, rotulo: 'Aviso do sistema' }
} as const

interface Props {
  alerta: Alerta
  nomePonto: string
  aoResolver: (id: string) => void
}

export function CartaoAlerta({ alerta, nomePonto, aoResolver }: Props) {
  const { cor, barra, Icone, rotulo } = aparencia[alerta.severidade]

  return (
    <article className={`flex gap-4 border-b border-white/8 py-5 ${alerta.resolvido ? 'opacity-45' : ''}`}>
      <span className={`w-0.5 shrink-0 rounded-full ${barra}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Icone size={15} className={cor} strokeWidth={1.8} />
          <span className={`text-xs ${cor}`}>{rotulo}</span>
          <span className="text-xs text-espuma/40">{nomePonto}</span>
          <span className="text-xs text-espuma/40">{tempoRelativo(alerta.criadoEm)}</span>
        </div>

        <h3 className="mt-2 text-[15px] text-white">{alerta.titulo}</h3>
        <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-espuma/65">{alerta.detalhe}</p>

        {alerta.litrosEstimados > 0 && (
          <p className="mt-3 text-sm text-espuma/80">
            Já foram {emLitros(alerta.litrosEstimados)} — cerca de {emReais(alerta.custoEstimado)} na conta.
          </p>
        )}
      </div>

      {!alerta.resolvido && (
        <button
          onClick={() => aoResolver(alerta.id)}
          className="h-fit shrink-0 rounded border border-white/15 px-3 py-1.5 text-xs text-espuma/80 transition-colors hover:border-eletrico hover:text-white"
        >
          Marcar como resolvido
        </button>
      )}
      {alerta.resolvido && (
        <span className="flex h-fit shrink-0 items-center gap-1.5 text-xs text-espuma/50">
          <Check size={13} /> resolvido
        </span>
      )}
    </article>
  )
}
