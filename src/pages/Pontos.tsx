import { pontos, consumoPorPonto } from '@/data/mock'
import { emLitros, umaCasa } from '@/lib/formato'

export function Pontos() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-marca text-3xl text-white">Pontos de água</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-espuma/60">
          Cada ponto tem um sensor de vazão no ramal. Quanto mais pontos instalados, mais preciso fica o
          endereço do vazamento.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pontos.map((p) => {
          const uso = consumoPorPonto.find((c) => c.pontoId === p.id)
          return (
            <article key={p.id} className="painel rounded-lg p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-white">{p.nome}</h2>
                  <p className="mt-1 text-xs text-espuma/50">{p.ambiente}</p>
                </div>
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${p.sensor.online ? 'bg-eletrico pulso' : 'bg-vazamento'}`}
                  title={p.sensor.online ? 'Enviando dados' : 'Sem comunicação'}
                />
              </div>

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-espuma/50">Consumo no mês</dt>
                  <dd className="text-espuma/90">{uso ? emLitros(uso.litros) : '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-espuma/50">Vazão típica em uso</dt>
                  <dd className="text-espuma/90">{umaCasa(p.vazaoTipica)} L/min</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-espuma/50">Última leitura</dt>
                  <dd className="text-espuma/90">{p.sensor.ultimaLeitura}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </div>
    </div>
  )
}
