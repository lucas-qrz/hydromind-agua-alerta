import type { Leitura, PontoMonitorado } from '@/types'

// Gerador de leituras para o protótipo rodar sem hardware.
// Quando o firmware estiver publicando no broker MQTT, este arquivo sai e
// a mesma stream passa a vir do backend (websocket ou Supabase Realtime).

interface EstadoPonto {
  emUso: boolean
  restanteDoUso: number
  vazamento: boolean
}

const estados = new Map<string, EstadoPonto>()

function estadoDe(ponto: PontoMonitorado): EstadoPonto {
  if (!estados.has(ponto.id)) {
    estados.set(ponto.id, {
      emUso: false,
      restanteDoUso: 0,
      // A suíte carrega o vazamento silencioso que a demo precisa mostrar.
      vazamento: ponto.id === 'pt-suite'
    })
  }
  return estados.get(ponto.id)!
}

/** Probabilidade de alguém abrir uma torneira, variando com a hora do dia. */
function intensidadeDoHorario(hora: number): number {
  if (hora >= 6 && hora <= 8) return 0.34
  if (hora >= 11 && hora <= 13) return 0.26
  if (hora >= 18 && hora <= 21) return 0.38
  if (hora >= 1 && hora <= 5) return 0.02
  return 0.14
}

export function proximaLeitura(ponto: PontoMonitorado, agora = new Date()): Leitura {
  const estado = estadoDe(ponto)

  if (!ponto.sensor.online) {
    return { pontoId: ponto.id, timestamp: agora.getTime(), litrosPorMinuto: 0 }
  }

  if (estado.restanteDoUso > 0) {
    estado.restanteDoUso -= 1
  } else {
    estado.emUso = Math.random() < intensidadeDoHorario(agora.getHours())
    estado.restanteDoUso = estado.emUso ? 1 + Math.floor(Math.random() * 4) : 0
  }

  const base = estado.emUso ? ponto.vazaoTipica * (0.6 + Math.random() * 0.7) : 0
  const fuga = estado.vazamento ? 0.85 + Math.random() * 0.12 : 0

  return {
    pontoId: ponto.id,
    timestamp: agora.getTime(),
    litrosPorMinuto: Number((base + fuga).toFixed(2))
  }
}

export function vazaoTotal(leituras: Leitura[]): number {
  return leituras.reduce((s, l) => s + l.litrosPorMinuto, 0)
}
