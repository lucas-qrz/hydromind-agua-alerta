# Água Alerta — HydroMind

Monitoramento de consumo de água em tempo real, detecção de vazamentos e estimativa de conta
para residências, condomínios, empresas e escolas.

Este repositório contém o **protótipo funcional da interface** (o aplicativo/dashboard).
O firmware dos sensores e o backend ficam em repositórios separados — ver `docs/ARQUITETURA.md`.

## O que já está de pé

- **Painel** — vazão passando pelo cavalete agora, curva de consumo hora a hora contra a média
  histórica, projeção da conta no fechamento do mês e os alertas que exigem ação.
- **Pontos de água** — cada ramal instrumentado, com consumo do mês e estado do sensor.
- **Alertas** — vazamentos prováveis e consumos fora do padrão, com volume e custo já estimados.
- **Sensores** — bateria, sinal e comunicação de cada dispositivo.
- **Camada de detecção** (`src/lib/deteccao.ts`) — regras determinísticas que já identificam
  fluxo contínuo, gotejamento, consumo noturno e desvio da média por horário.
- **Simulador de sensores** (`src/lib/simulacao.ts`) — permite rodar e demonstrar o produto
  inteiro sem nenhum hardware montado.

## Rodando

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · lucide-react

Sem dependência de biblioteca de gráficos: a curva é SVG próprio, para manter o bundle pequeno
e o visual sob controle.

## Estrutura

```
src/
├── types.ts              Modelo de domínio (ponto, leitura, alerta, instalação)
├── data/mock.ts          Dados de demonstração — trocar pelo Supabase
├── lib/
│   ├── deteccao.ts       Regras de vazamento e anomalia (onde entra o modelo depois)
│   ├── simulacao.ts      Gerador de leituras enquanto não há hardware
│   ├── tarifa.ts         Cálculo de custo por faixa de consumo
│   └── formato.ts        Formatação pt-BR de litros, m³, reais e tempo
├── components/           Peças reutilizáveis da interface
└── pages/                As quatro telas
```

## Decisões de projeto que valem registro

**A detecção não é uma caixa-preta.** Vazamento silencioso tem assinatura conhecida: fluxo baixo,
constante e que nunca zera. Isso é uma regra, não um modelo — e regra é auditável, explicável ao
cliente e funciona no primeiro dia de instalação, sem histórico. O espaço para modelo treinado
existe e está isolado em `deteccao.ts`; ele entra quando houver base para treinar, sem mexer no
resto do sistema.

**O cavalete de entrada é o sensor obrigatório.** Ele sozinho já detecta vazamento na unidade.
Os sensores por ambiente são o que transforma "tem vazamento" em "tem vazamento no banheiro da
suíte" — e é esse endereço que justifica o valor da assinatura.

**A tarifa em `lib/tarifa.ts` é simplificada.** As faixas ali existem para o protótipo fechar
ponta a ponta. Antes de qualquer uso real, substituir pela tabela vigente da concessionária.

## Próximos passos sugeridos

1. Backend e persistência (Supabase: tabelas de pontos, leituras, alertas, instalações).
2. Ingestão real: broker MQTT recebendo do ESP32 e gravando leituras.
3. Autenticação e multi-instalação — necessário para o B2B de condomínio, onde um síndico
   administra várias unidades.
4. Notificações push e WhatsApp no disparo do alerta.
5. Firmware do sensor e validação do YF-S201 (ou equivalente) em bancada.

## Equipe

Diego Pavan · João Baldiceira · Leonardo Menezes · Lucas Queiroz · Murillo Barroso
Gerenciamento de Projetos — PUC Campinas, 2026
