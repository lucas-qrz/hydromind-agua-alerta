import { useState } from 'react'
import { CartaoAlerta } from '@/components/CartaoAlerta'
import { pontos } from '@/data/mock'
import type { Alerta } from '@/types'

interface Props {
  alertas: Alerta[]
  aoResolver: (id: string) => void
}

type Filtro = 'abertos' | 'todos'

export function Alertas({ alertas, aoResolver }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('abertos')
  const lista = filtro === 'abertos' ? alertas.filter((a) => !a.resolvido) : alertas

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-marca text-3xl text-white">Alertas</h1>
          <p className="mt-2 max-w-[60ch] text-sm text-espuma/60">
            Tudo que fugiu do padrão da sua rede, com o volume e o custo já estimados.
          </p>
        </div>
        <div className="flex gap-1 rounded border border-white/12 p-1 text-sm">
          {(['abertos', 'todos'] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded px-3 py-1.5 transition-colors ${
                filtro === f ? 'bg-hidro/25 text-white' : 'text-espuma/55 hover:text-espuma'
              }`}
            >
              {f === 'abertos' ? 'Abertos' : 'Todos'}
            </button>
          ))}
        </div>
      </header>

      <section className="painel rounded-lg px-6">
        {lista.map((a) => (
          <CartaoAlerta
            key={a.id}
            alerta={a}
            nomePonto={pontos.find((p) => p.id === a.pontoId)?.nome ?? ''}
            aoResolver={aoResolver}
          />
        ))}
        {lista.length === 0 && (
          <p className="py-12 text-center text-sm text-espuma/55">
            Nenhum alerta aberto. Você vai ser avisado assim que algo sair do padrão.
          </p>
        )}
      </section>
    </div>
  )
}
