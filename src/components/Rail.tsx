import { Activity, Bell, Droplets, Radio } from 'lucide-react'
import { Marca } from './Marca'

export type Tela = 'painel' | 'pontos' | 'alertas' | 'dispositivos'

const itens: { id: Tela; rotulo: string; Icone: typeof Activity }[] = [
  { id: 'painel', rotulo: 'Painel', Icone: Activity },
  { id: 'pontos', rotulo: 'Pontos de água', Icone: Droplets },
  { id: 'alertas', rotulo: 'Alertas', Icone: Bell },
  { id: 'dispositivos', rotulo: 'Sensores', Icone: Radio }
]

interface Props {
  atual: Tela
  aoTrocar: (t: Tela) => void
  alertasAbertos: number
}

export function Rail({ atual, aoTrocar, alertasAbertos }: Props) {
  return (
    <nav className="flex shrink-0 gap-1 border-b border-white/10 px-4 py-4 md:h-full md:w-60 md:flex-col md:gap-8 md:border-b-0 md:border-r md:px-5 md:py-7">
      <div className="hidden md:block">
        <Marca />
      </div>
      <div className="md:hidden">
        <Marca compacta />
      </div>

      <ul className="flex flex-1 gap-1 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
        {itens.map(({ id, rotulo, Icone }) => {
          const ativo = atual === id
          return (
            <li key={id}>
              <button
                onClick={() => aoTrocar(id)}
                aria-current={ativo ? 'page' : undefined}
                className={`flex w-full items-center gap-3 whitespace-nowrap border-l-2 px-3 py-2.5 text-sm transition-colors ${
                  ativo
                    ? 'border-eletrico bg-hidro/10 text-white'
                    : 'border-transparent text-espuma/55 hover:border-white/20 hover:text-espuma'
                }`}
              >
                <Icone size={17} strokeWidth={1.7} />
                <span>{rotulo}</span>
                {id === 'alertas' && alertasAbertos > 0 && (
                  <span className="ml-auto rounded-full bg-vazamento/20 px-2 py-0.5 text-xs text-vazamento">
                    {alertasAbertos}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
