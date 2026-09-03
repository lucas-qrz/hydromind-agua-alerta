# Arquitetura do Água Alerta

## Visão geral do fluxo

```
  Sensor de vazão              Gateway                 Nuvem                    Cliente
  ───────────────              ───────                 ─────                    ───────
  YF-S201 / turbina      →     ESP32 (Wi-Fi)     →     Broker MQTT        →     App (este repo)
  pulsos por litro             agrega 1 leitura        Ingestão + regras        painel e alertas
  no ramal                     por minuto              Banco (Supabase)         push / WhatsApp
```

## Camadas

### 1. Sensoriamento
Sensor de vazão por efeito Hall instalado no ramal. Cada litro que passa gera um número
conhecido de pulsos; o microcontrolador conta pulsos por janela de tempo e converte em L/min.

Um ponto obrigatório: **o cavalete de entrada**. Ele sozinho já detecta que existe vazamento na
unidade. Os demais pontos servem para localizar onde.

Alimentação é a principal restrição de campo: bateria com vida útil longa exige que o rádio
durma entre transmissões. Enviar uma agregação por minuto, e não leitura contínua, é o que torna
isso viável.

### 2. Conectividade
Wi-Fi da própria unidade no MVP, por custo. Vale registrar que os concorrentes mapeados no estudo
de mercado usam conectividade celular própria justamente para não depender do Wi-Fi do prédio —
uma limitação real do nosso MVP e um ponto de evolução para o modelo B2B em condomínio.

Protocolo: MQTT, por ser leve e desenhado para dispositivos com pouca energia.

### 3. Ingestão e persistência
Broker recebe as leituras e grava. Modelo de dados mínimo:

| Tabela        | Conteúdo                                                        |
|---------------|-----------------------------------------------------------------|
| `instalacoes` | unidade monitorada, tipo, tarifa aplicável, meta mensal          |
| `pontos`      | ramais instrumentados de cada instalação                        |
| `leituras`    | série temporal: ponto, timestamp, L/min                         |
| `alertas`     | ocorrências detectadas, volume e custo estimados, status        |
| `assinaturas` | plano, ciclo e situação de cobrança                             |

A tabela `leituras` cresce rápido (um registro por ponto por minuto). Ela precisa de agregação
por hora e política de retenção do dado bruto desde o primeiro dia — não é algo para resolver
depois.

### 4. Detecção
Roda no servidor sobre a série de leituras. As regras estão implementadas em
`src/lib/deteccao.ts` e são as mesmas que a interface usa:

- **Fluxo contínuo** — vazão que não zera por mais de 25 minutos e com pouca variação. Baixa e
  constante indica gotejamento; alta e constante indica registro aberto ou cano rompido.
- **Consumo anormal por horário** — consumo da hora acima de 2,2× a média daquele horário nos
  últimos 30 dias.
- **Consumo noturno** — volume entre 1h e 5h, quando a unidade deveria estar parada.

Modelo estatístico ou de machine learning entra aqui depois, quando houver histórico. A interface
de saída (`Suspeita`) não muda quando isso acontecer.

### 5. Notificação
Push no app e WhatsApp. Para o B2B de condomínio, o alerta precisa chegar ao síndico **e** ao
morador da unidade afetada — são pessoas diferentes com responsabilidades diferentes.

## Riscos técnicos a monitorar

| Risco                                             | Mitigação                                                    |
|---------------------------------------------------|--------------------------------------------------------------|
| Instalação exige interromper o ramal              | Avaliar sensor externo (ultrassônico ou clamp-on) para retrofit |
| Wi-Fi instável em condomínio                      | Buffer local no ESP32 e reenvio; avaliar LoRa/celular         |
| Falso positivo (filtro, piscina, irrigação)       | Marcar padrões recorrentes como esperados após confirmação    |
| Bateria do sensor                                 | Agregação por minuto, rádio dormindo, alerta em 25%           |
| Volume da tabela de leituras                      | Agregação horária e retenção curta do dado bruto              |
