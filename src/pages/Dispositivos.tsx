import { BatteryLow, Signal } from 'lucide-react'
import { pontos } from '@/data/mock'

export function Dispositivos() {
  return (
    <div className="space-y-7">
      <header>
        <h1 className="font-marca text-3xl text-white">Sensores</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-espuma/60">
          Bateria e sinal de cada sensor instalado. Um sensor offline não interrompe a medição do
          cavalete de entrada, mas deixa o ponto sem endereço no mapa de consumo.
        </p>
      </header>

      <section className="painel overflow-hidden rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-espuma/50">
            <tr>
              <th className="px-6 py-4 font-normal">Ponto</th>
              <th className="px-6 py-4 font-normal">Modelo</th>
              <th className="px-6 py-4 font-normal">Bateria</th>
              <th className="px-6 py-4 font-normal">Sinal</th>
              <th className="px-6 py-4 font-normal">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pontos.map((p) => (
              <tr key={p.id} className="border-b border-white/6 last:border-0">
                <td className="px-6 py-4 text-white">{p.nome}</td>
                <td className="px-6 py-4 text-espuma/65">{p.sensor.modelo}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-2 ${p.sensor.bateria < 25 ? 'text-atencao' : 'text-espuma/75'}`}>
                    {p.sensor.bateria < 25 && <BatteryLow size={14} />}
                    {p.sensor.bateria}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2 text-espuma/75">
                    <Signal size={14} /> {p.sensor.sinal}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  {p.sensor.online ? (
                    <span className="text-eletrico">enviando dados</span>
                  ) : (
                    <span className="text-vazamento">sem comunicação</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
