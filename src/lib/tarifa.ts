// Estimativa de custo. As faixas abaixo são simplificadas e existem para o
// protótipo funcionar ponta a ponta — trocar pela tabela vigente da
// concessionária (Sanasa, em Campinas) antes de qualquer uso comercial.

interface Faixa {
  ateM3: number
  precoM3: number
}

const FAIXAS_RESIDENCIAL: Faixa[] = [
  { ateM3: 10, precoM3: 4.9 },
  { ateM3: 20, precoM3: 8.6 },
  { ateM3: 30, precoM3: 11.4 },
  { ateM3: Infinity, precoM3: 14.2 }
]

/** Custo da água + esgoto para um volume mensal em litros. */
export function custoMensal(litros: number, fatorEsgoto = 1.8): number {
  let restante = litros / 1000
  let anterior = 0
  let total = 0

  for (const faixa of FAIXAS_RESIDENCIAL) {
    const volumeFaixa = Math.min(restante, faixa.ateM3 - anterior)
    if (volumeFaixa <= 0) break
    total += volumeFaixa * faixa.precoM3
    restante -= volumeFaixa
    anterior = faixa.ateM3
  }
  return total * fatorEsgoto
}

/** Custo marginal de um volume avulso — usado nos alertas. */
export function custoDoVolume(litros: number, tarifaM3: number): number {
  return (litros / 1000) * tarifaM3
}
