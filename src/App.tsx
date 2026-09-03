import { useState } from 'react'
import { Rail, type Tela } from '@/components/Rail'
import { Painel } from '@/pages/Painel'
import { Pontos } from '@/pages/Pontos'
import { Alertas } from '@/pages/Alertas'
import { Dispositivos } from '@/pages/Dispositivos'
import { alertasIniciais } from '@/data/mock'
import type { Alerta } from '@/types'

export default function App() {
  const [tela, setTela] = useState<Tela>('painel')
  const [alertas, setAlertas] = useState<Alerta[]>(alertasIniciais)

  const resolver = (id: string) =>
    setAlertas((atual) => atual.map((a) => (a.id === id ? { ...a, resolvido: true } : a)))

  const abertos = alertas.filter((a) => !a.resolvido).length

  return (
    <div className="fundo-abissal flex min-h-full flex-col md:flex-row">
      <Rail atual={tela} aoTrocar={setTela} alertasAbertos={abertos} />
      <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">
          {tela === 'painel' && <Painel alertas={alertas} aoResolver={resolver} />}
          {tela === 'pontos' && <Pontos />}
          {tela === 'alertas' && <Alertas alertas={alertas} aoResolver={resolver} />}
          {tela === 'dispositivos' && <Dispositivos />}
        </div>
      </main>
    </div>
  )
}
