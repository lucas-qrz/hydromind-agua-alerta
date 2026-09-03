// Modelo de domínio do Água Alerta.
// Espelha o que os sensores enviam e o que o app precisa mostrar.

export type TipoLocal = 'residencia' | 'condominio' | 'empresa' | 'escola'

/** Um ponto da rede hidráulica com sensor de vazão instalado. */
export interface PontoMonitorado {
  id: string
  nome: string
  ambiente: string
  /** Vazão típica quando o ponto está em uso, em litros por minuto. */
  vazaoTipica: number
  /** Sensor pode estar offline sem invalidar o resto do sistema. */
  sensor: {
    modelo: string
    bateria: number // 0-100
    sinal: number // 0-100
    online: boolean
    ultimaLeitura: string
  }
}

/** Leitura instantânea vinda do sensor (o que chega pelo MQTT). */
export interface Leitura {
  pontoId: string
  timestamp: number
  litrosPorMinuto: number
}

/** Consumo consolidado de uma hora, usado nos gráficos. */
export interface PontoHora {
  hora: number
  litros: number
  mediaHistorica: number
}

export type Severidade = 'vazamento' | 'anomalia' | 'informacao'

export interface Alerta {
  id: string
  pontoId: string
  severidade: Severidade
  titulo: string
  detalhe: string
  litrosEstimados: number
  custoEstimado: number
  criadoEm: number
  resolvido: boolean
}

export interface Instalacao {
  nome: string
  tipo: TipoLocal
  cidade: string
  moradores: number
  /** Tarifa média por m³ usada nas estimativas de custo. */
  tarifaM3: number
  metaMensalLitros: number
}
