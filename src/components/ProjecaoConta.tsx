import { emLitros, emReais } from '@/lib/formato'

interface Props {
  litrosAcumulados: number
  litrosProjetados: number
  custoProjetado: number
  metaLitros: number
  diaDoMes: number
}

export function ProjecaoConta({ litrosAcumulados, litrosProjetados, custoProjetado, metaLitros, diaDoMes }: Props) {
  const usoDaMeta = Math.min(1.4, litrosProjetados / metaLitros)
  const acima = litrosProjetados > metaLitros

  return (
    <section className="painel rounded-lg p-6">
      <h2 className="text-sm text-espuma/60">Conta estimada no fechamento do mês</h2>
      <p className="mt-3 font-marca text-4xl text-white">{emReais(custoProjetado)}</p>
      <p className="mt-2 text-sm text-espuma/60">
        {emLitros(litrosAcumulados)} consumidos em {diaDoMes} dias, projetando {emLitros(litrosProjetados)}.
      </p>

      <div className="mt-6">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ${acima ? 'bg-atencao' : 'bg-eletrico'}`}
            style={{ width: `${Math.min(100, usoDaMeta * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-espuma/50">
          {acima
            ? `A projeção passa a sua meta de ${emLitros(metaLitros)}. Resolver o vazamento da suíte devolve boa parte da diferença.`
            : `Dentro da meta de ${emLitros(metaLitros)} para o mês.`}
        </p>
      </div>
    </section>
  )
}
