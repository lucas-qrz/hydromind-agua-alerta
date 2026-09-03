import type { Instalacao, PontoMonitorado, PontoHora, Alerta } from '@/types'

// Dados de demonstração. Substituir pela leitura do Supabase quando o
// backend estiver de pé — o formato é o mesmo.

export const instalacao: Instalacao = {
  nome: 'Residencial Aldeia do Lago — Bloco B',
  tipo: 'condominio',
  cidade: 'Campinas, SP',
  moradores: 4,
  tarifaM3: 12.4,
  metaMensalLitros: 14000
}

export const pontos: PontoMonitorado[] = [
  {
    id: 'pt-entrada',
    nome: 'Cavalete de entrada',
    ambiente: 'Ramal principal',
    vazaoTipica: 9,
    sensor: { modelo: 'HM-Flow 200', bateria: 88, sinal: 92, online: true, ultimaLeitura: 'agora' }
  },
  {
    id: 'pt-banheiro-social',
    nome: 'Banheiro social',
    ambiente: 'Térreo',
    vazaoTipica: 6,
    sensor: { modelo: 'HM-Flow 100', bateria: 61, sinal: 74, online: true, ultimaLeitura: 'agora' }
  },
  {
    id: 'pt-suite',
    nome: 'Banheiro da suíte',
    ambiente: 'Pavimento superior',
    vazaoTipica: 7,
    sensor: { modelo: 'HM-Flow 100', bateria: 45, sinal: 68, online: true, ultimaLeitura: 'agora' }
  },
  {
    id: 'pt-cozinha',
    nome: 'Cozinha',
    ambiente: 'Térreo',
    vazaoTipica: 5,
    sensor: { modelo: 'HM-Flow 100', bateria: 77, sinal: 81, online: true, ultimaLeitura: 'agora' }
  },
  {
    id: 'pt-area',
    nome: 'Área de serviço',
    ambiente: 'Térreo',
    vazaoTipica: 11,
    sensor: { modelo: 'HM-Flow 100', bateria: 34, sinal: 55, online: true, ultimaLeitura: 'há 2 min' }
  },
  {
    id: 'pt-jardim',
    nome: 'Jardim e área externa',
    ambiente: 'Externo',
    vazaoTipica: 14,
    sensor: { modelo: 'HM-Flow 200', bateria: 19, sinal: 40, online: false, ultimaLeitura: 'há 3 h' }
  }
]

/** Curva de consumo do dia, hora a hora, com a média histórica do mesmo horário. */
export const consumoDoDia: PontoHora[] = [
  { hora: 0, litros: 12, mediaHistorica: 9 },
  { hora: 1, litros: 34, mediaHistorica: 6 },
  { hora: 2, litros: 41, mediaHistorica: 5 },
  { hora: 3, litros: 39, mediaHistorica: 4 },
  { hora: 4, litros: 40, mediaHistorica: 5 },
  { hora: 5, litros: 38, mediaHistorica: 11 },
  { hora: 6, litros: 74, mediaHistorica: 62 },
  { hora: 7, litros: 138, mediaHistorica: 121 },
  { hora: 8, litros: 96, mediaHistorica: 88 },
  { hora: 9, litros: 51, mediaHistorica: 47 },
  { hora: 10, litros: 44, mediaHistorica: 39 },
  { hora: 11, litros: 68, mediaHistorica: 71 },
  { hora: 12, litros: 92, mediaHistorica: 95 },
  { hora: 13, litros: 63, mediaHistorica: 58 },
  { hora: 14, litros: 41, mediaHistorica: 44 },
  { hora: 15, litros: 37, mediaHistorica: 36 },
  { hora: 16, litros: 45, mediaHistorica: 42 },
  { hora: 17, litros: 88, mediaHistorica: 79 },
  { hora: 18, litros: 121, mediaHistorica: 118 },
  { hora: 19, litros: 154, mediaHistorica: 132 },
  { hora: 20, litros: 109, mediaHistorica: 101 },
  { hora: 21, litros: 78, mediaHistorica: 74 },
  { hora: 22, litros: 52, mediaHistorica: 48 },
  { hora: 23, litros: 31, mediaHistorica: 28 }
]

/** Participação de cada ponto no consumo do mês, em litros. */
export const consumoPorPonto: { pontoId: string; litros: number; variacao: number }[] = [
  { pontoId: 'pt-banheiro-social', litros: 3120, variacao: 0.04 },
  { pontoId: 'pt-suite', litros: 2870, variacao: 0.61 },
  { pontoId: 'pt-cozinha', litros: 2240, variacao: -0.08 },
  { pontoId: 'pt-area', litros: 1980, variacao: 0.02 },
  { pontoId: 'pt-jardim', litros: 1410, variacao: -0.19 }
]

export const litrosAcumuladosNoMes = 11620
export const diaDoMes = 21

export const alertasIniciais: Alerta[] = [
  {
    id: 'al-1',
    pontoId: 'pt-suite',
    severidade: 'vazamento',
    titulo: 'Fluxo contínuo no banheiro da suíte',
    detalhe:
      'Vazão de 0,9 L/min sem interrupção desde 01h12. O padrão é constante e de baixa intensidade — compatível com válvula de descarga que não fecha por completo.',
    litrosEstimados: 232,
    custoEstimado: 2.88,
    criadoEm: Date.now() - 1000 * 60 * 47,
    resolvido: false
  },
  {
    id: 'al-2',
    pontoId: 'pt-jardim',
    severidade: 'informacao',
    titulo: 'Sensor do jardim sem comunicação',
    detalhe: 'Última leitura recebida há 3 horas. Bateria em 19% na última sincronização.',
    litrosEstimados: 0,
    custoEstimado: 0,
    criadoEm: Date.now() - 1000 * 60 * 180,
    resolvido: false
  },
  {
    id: 'al-3',
    pontoId: 'pt-area',
    severidade: 'anomalia',
    titulo: 'Consumo acima do padrão na área de serviço',
    detalhe: 'Ontem, entre 14h e 16h, o consumo foi 2,4× a média do mesmo horário nos últimos 30 dias.',
    litrosEstimados: 96,
    custoEstimado: 1.19,
    criadoEm: Date.now() - 1000 * 60 * 60 * 20,
    resolvido: false
  },
  {
    id: 'al-4',
    pontoId: 'pt-cozinha',
    severidade: 'anomalia',
    titulo: 'Torneira da cozinha aberta por 18 minutos',
    detalhe: 'Registrado no dia 14. Resolvido pelo morador após a notificação no app.',
    litrosEstimados: 74,
    custoEstimado: 0.92,
    criadoEm: Date.now() - 1000 * 60 * 60 * 24 * 7,
    resolvido: true
  }
]
