import { useEffect, useMemo, useState } from 'react'
import { ColunaDagua } from '@/components/ColunaDagua'
import { GraficoDia } from '@/components/GraficoDia'
import { BarraPontos } from '@/components/BarraPontos'
import { ProjecaoConta } from '@/components/ProjecaoConta'
import { CartaoAlerta } from '@/components/CartaoAlerta'
import { consumoDoDia, consumoPorPonto, diaDoMes, instalacao, litrosAcumuladosNoMes, pontos } from '@/data/mock'
import { proximaLeitura, vazaoTotal } from '@/lib/simulacao'
import { detectarConsumoNoturno, projetarMes } from '@/lib/deteccao'
import { custoMensal } from '@/lib/tarifa'
import { emLitros } from '@/lib/formato'
import type { Alerta, Leitura } from '@/types'

interface Props {
  alertas: Alerta[]
  aoResolver: (id: string) => void
}

export function Painel({ alertas, aoResolver }: Props) {
  const [leituras, setLeituras] = useState<Leitura[]>([])

  // Enquanto não há hardware, a stream vem do simulador no mesmo formato do MQTT.
  useEffect(() => {
    const tick = () => setLeituras(pontos.map((p) => proximaLeitura(p)))
    tick()
    const id = setInterval(tick, 2500)
    return () => clearInterval(id)
  }, [])

  const vazaoAtual = vazaoTotal(leituras)
  const ativos = leituras
    .filter((l) => l.litrosPorMinuto > 0.15)
    .map((l) => pontos.find((p) => p.id === l.pontoId)?.nome ?? '')
    .filter(Boolean)

  const litrosProjetados = useMemo(() => projetarMes(litrosAcumuladosNoMes, diaDoMes), [])
  const custoProjetado = useMemo(() => custoMensal(litrosProjetados), [litrosProjetados])
  const noturno = useMemo(() => detectarConsumoNoturno(consumoDoDia), [])

  const abertos = alertas.filter((a) => !a.resolvido)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-espuma/55">{instalacao.nome}</p>
        <h1 className="mt-1 font-marca text-3xl text-white">Painel do dia</h1>
      </header>

      <section className="painel rounded-lg p-7 shadow-agua">
        <ColunaDagua vazaoAtual={vazaoAtual} vazaoMaxima={30} pontosAtivos={ativos} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="painel rounded-lg p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm text-espuma/60">Consumo hora a hora</h2>
            <p className="text-sm text-vazamento">
              {emLitros(noturno)} entre 1h e 5h, com a casa dormindo
            </p>
          </div>
          <div className="mt-5">
            <GraficoDia serie={consumoDoDia} />
          </div>
        </section>

        <ProjecaoConta
          litrosAcumulados={litrosAcumuladosNoMes}
          litrosProjetados={litrosProjetados}
          custoProjetado={custoProjetado}
          metaLitros={instalacao.metaMensalLitros}
          diaDoMes={diaDoMes}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="painel rounded-lg p-6">
          <h2 className="text-sm text-espuma/60">De onde veio a água deste mês</h2>
          <div className="mt-5">
            <BarraPontos dados={consumoPorPonto} pontos={pontos} />
          </div>
        </section>

        <section className="painel rounded-lg p-6">
          <h2 className="text-sm text-espuma/60">Precisa da sua atenção</h2>
          <div className="mt-1">
            {abertos.slice(0, 2).map((a) => (
              <CartaoAlerta
                key={a.id}
                alerta={a}
                nomePonto={pontos.find((p) => p.id === a.pontoId)?.nome ?? ''}
                aoResolver={aoResolver}
              />
            ))}
            {abertos.length === 0 && (
              <p className="py-8 text-sm text-espuma/55">
                Nada aberto. A rede está se comportando dentro do padrão dos últimos 30 dias.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
