import type { Leitura, PontoMonitorado, PontoHora } from '@/types'

// Camada de detecção. Hoje são regras determinísticas rodando sobre a série
// de leituras; é exatamente aqui que entra o modelo treinado quando houver
// histórico suficiente. A interface de saída não muda.

export interface Suspeita {
  pontoId: string
  tipo: 'vazamento' | 'anomalia'
  confianca: number // 0-1
  litrosEstimados: number
  explicacao: string
}

/** Minutos de fluxo ininterrupto acima dos quais o consumo deixa de ser humano. */
const MINUTOS_FLUXO_CONTINUO = 25
/** Vazão baixa e constante é a assinatura clássica de vaso sanitário vazando. */
const VAZAO_GOTEJAMENTO = 1.2

/**
 * Fluxo que não zera nunca não é uso: é vazamento.
 * A janela recebe as leituras mais recentes do ponto, em ordem cronológica.
 */
export function detectarFluxoContinuo(
  ponto: PontoMonitorado,
  janela: Leitura[],
  intervaloMinutos = 1
): Suspeita | null {
  if (janela.length < MINUTOS_FLUXO_CONTINUO / intervaloMinutos) return null

  const comFluxo = janela.filter((l) => l.litrosPorMinuto > 0.05)
  if (comFluxo.length !== janela.length) return null

  const media = janela.reduce((s, l) => s + l.litrosPorMinuto, 0) / janela.length
  const variacao = Math.max(...janela.map((l) => l.litrosPorMinuto)) - Math.min(...janela.map((l) => l.litrosPorMinuto))

  // Constante e baixo: gotejamento. Constante e alto: registro aberto ou cano rompido.
  const constante = variacao < media * 0.35
  if (!constante) return null

  const minutos = janela.length * intervaloMinutos
  const litros = media * minutos
  const gotejando = media <= VAZAO_GOTEJAMENTO

  return {
    pontoId: ponto.id,
    tipo: 'vazamento',
    confianca: gotejando ? 0.82 : 0.94,
    litrosEstimados: litros,
    explicacao: gotejando
      ? `Fluxo baixo e constante de ${media.toFixed(1)} L/min há ${minutos} minutos. Padrão típico de vazamento silencioso.`
      : `Fluxo de ${media.toFixed(1)} L/min sem interrupção há ${minutos} minutos, acima do uso normal do ponto.`
  }
}

/** Consumo da hora muito acima da média do mesmo horário nos últimos dias. */
export function detectarConsumoAnormal(
  ponto: PontoMonitorado,
  hora: PontoHora,
  desvioAceito = 2.2
): Suspeita | null {
  if (hora.mediaHistorica < 1) return null
  const razao = hora.litros / hora.mediaHistorica
  if (razao < desvioAceito) return null

  return {
    pontoId: ponto.id,
    tipo: 'anomalia',
    confianca: Math.min(0.95, 0.4 + razao / 10),
    litrosEstimados: hora.litros - hora.mediaHistorica,
    explicacao: `Consumo de ${Math.round(hora.litros)} L entre ${hora.hora}h e ${hora.hora + 1}h, ${razao.toFixed(1)}× a média deste horário.`
  }
}

/** Consumo durante a madrugada, quando a casa deveria estar parada. */
export function detectarConsumoNoturno(serie: PontoHora[]): number {
  return serie.filter((h) => h.hora >= 1 && h.hora <= 5).reduce((s, h) => s + h.litros, 0)
}

/** Projeção linear simples do mês a partir do consumo acumulado. */
export function projetarMes(litrosAcumulados: number, diaDoMes: number, diasNoMes = 30): number {
  if (diaDoMes < 1) return litrosAcumulados
  return (litrosAcumulados / diaDoMes) * diasNoMes
}
