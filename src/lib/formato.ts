const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const dec = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const emReais = (v: number) => brl.format(v)
export const emLitros = (v: number) => `${num.format(v)} L`
export const emM3 = (litros: number) => `${dec.format(litros / 1000)} m³`
export const umaCasa = (v: number) => dec.format(v)

export function horaCurta(ts: number) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function tempoRelativo(ts: number) {
  const min = Math.max(0, Math.round((Date.now() - ts) / 60000))
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h} h`
  return `há ${Math.round(h / 24)} d`
}
