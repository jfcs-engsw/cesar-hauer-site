// Painel de gestão da parceria CHD + FESB: gerador de dados SIMULADOS e determinísticos.
// Nada aqui é dado real. As regras (divisão, degraus de custo, marcos) seguem a decisão de 19/11/2026;
// os números são inventados por um gerador com semente fixa, para o protótipo ter sempre o mesmo resultado.
//
// Premissas assumidas no protótipo (a confirmar no contrato):
// - Gateway e AdSense em nome do CHD: a receita entra na conta dele e o repasse vai do CHD para a FESB.
// - Custos divididos 50/50: os operacionais saem da receita do mês antes da divisão (equivale a 50/50);
//   quando a receita do mês não cobre, cada Parte aporta metade da diferença.
// - Pré-lançamento (nov/2026): implantação e custos do Degrau 0 aportados 50/50 pelas Partes.
// - Os aportes de implantação são devolvidos às Partes, 50/50, com 40% da margem do mês (líquido menos
//   custos), na ordem de prioridade da fila.
// - Impostos simulados em 6% do bruto; gateway em 4,99% + R$ 0,49 por transação.
// - Livro: o CHD recebe R$ 9,90 por exemplar atribuído ao funil; a FESB fica com 20% desse valor.
// - A meta de R$ 180 mil conta só as linhas digitais (curso, bumps, SaaS, YouTube); o livro fica fora.

export type LinhaId = 'curso' | 'bumps' | 'saas' | 'youtube';

export const LINHAS: { id: LinhaId; nome: string; nota: string }[] = [
  { id: 'curso', nome: 'Curso online Formação de Investidores', nota: 'Venda pelo checkout do site' },
  { id: 'bumps', nome: 'Order bumps', nota: 'Planilhas e materiais oferecidos no checkout' },
  { id: 'saas', nome: 'Assinatura (SaaS de carteira)', nota: 'Recorrência mensal, a partir de mar/2027' },
  { id: 'youtube', nome: 'YouTube', nota: 'AdSense e membros do canal' },
];

export const DIVISAO_DIGITAL = 0.5;
export const PARTICIPACAO_LIVRO = 0.2;
export const QUITACAO_PCT = 0.4;
const IMPOSTO = 0.06;
const GATEWAY_PCT = 0.0499;
const GATEWAY_FIXO = 0.49;
const LIVRO_POR_EXEMPLAR = 9.9;
const TICKET_CURSO = 497;
const TICKET_BUMP = 47;
const TICKET_SAAS = 39;

// Período da meta: 30/11/2026 a 30/11/2027, um mês por posição.
export const MESES = [
  'dez/2026', 'jan/2027', 'fev/2027', 'mar/2027', 'abr/2027', 'mai/2027',
  'jun/2027', 'jul/2027', 'ago/2027', 'set/2027', 'out/2027', 'nov/2027',
];
const MES_NUM = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MES_ANO = [2026, 2027, 2027, 2027, 2027, 2027, 2027, 2027, 2027, 2027, 2027, 2027];

// Data de referência simulada: setembro de 2027, com dez/2026 a ago/2027 fechados.
export const ULTIMO_FECHADO = 8;
export const DATA_REFERENCIA = '05/09/2027';

export const META_TOTAL = 180000;
export const MARCOS = [
  { data: '28/02/2027', mes: 2, valor: 27000 },
  { data: '31/05/2027', mes: 5, valor: 66000 },
  { data: '31/08/2027', mes: 8, valor: 123000 },
  { data: '30/11/2027', mes: 11, valor: 180000 },
];

// Previsto acumulado por mês: interpolação linear entre os marcos.
export const PREVISTO_ACUM: number[] = MESES.map((_, i) => {
  let ini = { mes: -1, valor: 0 };
  for (const m of MARCOS) {
    if (i <= m.mes) return Math.round(ini.valor + ((m.valor - ini.valor) * (i - ini.mes)) / (m.mes - ini.mes));
    ini = m;
  }
  return META_TOTAL;
});

// Degraus de custo, ancorados na receita líquida digital do mês anterior.
export const DEGRAUS = [
  { n: 0, nome: 'Degrau 0', regra: 'Pré-receita', limiar: 0 },
  { n: 1, nome: 'Degrau 1', regra: 'Receita líquida de R$ 2 mil ou mais no mês anterior', limiar: 2000 },
  { n: 2, nome: 'Degrau 2', regra: 'Receita líquida de R$ 8 mil ou mais por 2 meses seguidos', limiar: 8000 },
  { n: 3, nome: 'Degrau 3', regra: 'Receita líquida de R$ 20 mil ou mais no mês anterior (escala)', limiar: 20000 },
];

type ItemCusto = { item: string; tipo: 'Fixo' | 'Variável'; desde: number; teto: (rlAnterior: number, degrau: number) => number };

const ITENS_CUSTO: ItemCusto[] = [
  { item: 'VPS (rateio)', tipo: 'Fixo', desde: 0, teto: () => 25 },
  { item: 'Domínio (rateio anual)', tipo: 'Fixo', desde: 0, teto: () => 5 },
  { item: 'Ferramentas gratuitas (formulários, analytics)', tipo: 'Fixo', desde: 0, teto: () => 0 },
  { item: 'Vídeo por uso', tipo: 'Variável', desde: 0, teto: () => 30 },
  { item: 'E-mail marketing pago', tipo: 'Fixo', desde: 1, teto: () => 150 },
  { item: 'Tráfego pago', tipo: 'Variável', desde: 1, teto: (rl, d) => Math.round(rl * (d >= 2 ? 0.2 : 0.15)) },
  { item: 'API de cotações', tipo: 'Fixo', desde: 2, teto: () => 250 },
  { item: 'IA (uso)', tipo: 'Variável', desde: 2, teto: () => 200 },
  { item: 'Analista CNPI para o SaaS', tipo: 'Fixo', desde: 2, teto: () => 1500 },
  { item: 'Infraestrutura de escala', tipo: 'Fixo', desde: 3, teto: () => 400 },
  { item: 'Atendimento e suporte', tipo: 'Fixo', desde: 3, teto: () => 1200 },
];

export const TRAFEGO_PCT = ['sem tráfego pago', '15% da receita líquida do mês anterior', '20% da receita líquida do mês anterior', '20% da receita líquida do mês anterior'];

// Fila de implantação, em ordem de prioridade de quitação.
export const IMPLANTACAO = [
  { item: 'Revisão jurídica dos termos e avisos regulatórios', valor: 1200 },
  { item: 'Configuração do gateway e do checkout', valor: 300 },
  { item: 'Sequência de 7 e-mails (texto e automação)', valor: 900 },
  { item: 'Diagramação do Dicionário do Investidor (isca)', valor: 800 },
  { item: 'Calculadoras da isca', valor: 600 },
  { item: 'Identidade visual definitiva', valor: 1500 },
  { item: 'Edição complementar das aulas', valor: 1800 },
];

export const IMPLANTACAO_TOTAL = IMPLANTACAO.reduce((a, x) => a + x.valor, 0);

// Aporte de pré-lançamento (nov/2026, sem receita): implantação e Degrau 0, metade de cada Parte.
const CUSTO_D0 = ITENS_CUSTO.filter((c) => c.desde === 0).reduce((a, c) => a + c.teto(0, 0), 0);
export const APORTE_INICIAL = {
  mes: 'nov/2026',
  implantacao: IMPLANTACAO_TOTAL,
  operacionais: CUSTO_D0,
  total: IMPLANTACAO_TOTAL + CUSTO_D0,
  porParte: (IMPLANTACAO_TOTAL + CUSTO_D0) / 2,
};

// Gerador pseudoaleatório com semente fixa (mulberry32).
function gerador(semente: number) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export type LinhaMes = { bruto: number; gateway: number; impostos: number; reembolsos: number; liquido: number; transacoes: number };
export type CustoMes = { item: string; tipo: 'Fixo' | 'Variável'; teto: number; realizado: number };
export type Etapa = { etapa: string; detalhe: string; volume: number; conversao: number | null; base: string };
export type Canal = { canal: string; utm: string; visitas: number; leads: number; vendas: number; receita: number };

export type Mes = {
  i: number;
  rotulo: string;
  linhas: Record<LinhaId, LinhaMes>;
  bruto: number;
  gateway: number;
  impostos: number;
  reembolsos: number;
  liquido: number;
  unidades: { cursos: number; bumps: number; assinantes: number; novasAssinaturas: number };
  livro: { qr: number; cliques: number; cupons: number; vendas: number; recebidoChd: number; fesb: number; chd: number };
  fora: { item: string; valor: number }[];
  degrau: number;
  rlAnterior: number;
  custos: CustoMes[];
  tetoCustos: number;
  custosRealizados: number;
  quitacao: { item: string; valor: number }[];
  quitacaoTotal: number;
  aporte: number;
  custosParte: number;
  base: number;
  fesbDigital: number;
  chdDigital: number;
  fesbTotal: number;
  chdTotal: number;
  repasse: number;
  repasseStatus: string;
  etapas: Etapa[];
  canais: Canal[];
  checkoutsIniciados: number;
};

function linha(bruto: number, transacoes: number, reembPct: number, comGateway: boolean): LinhaMes {
  const gateway = comGateway ? r2(bruto * GATEWAY_PCT + transacoes * GATEWAY_FIXO) : 0;
  const impostos = r2(bruto * IMPOSTO);
  const reembolsos = r2(bruto * reembPct);
  return { bruto, gateway, impostos, reembolsos, liquido: r2(bruto - gateway - impostos - reembolsos), transacoes };
}

// Reparte um total inteiro por pesos, sem perder unidade no arredondamento.
function repartir(total: number, pesos: number[]): number[] {
  const soma = pesos.reduce((a, b) => a + b, 0) || 1;
  const bruto = pesos.map((p) => (total * p) / soma);
  const out = bruto.map(Math.floor);
  let resto = total - out.reduce((a, b) => a + b, 0);
  const ordem = bruto.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; resto > 0; k = (k + 1) % ordem.length, resto--) out[ordem[k][1]]++;
  return out;
}

const pad = (n: number) => String(n).padStart(2, '0');

function gerar(): Mes[] {
  const rnd = gerador(20261119);
  const entre = (a: number, b: number) => a + (b - a) * rnd();
  const cursosBase = [11, 14, 17, 20, 22, 24, 30, 32, 34];
  const assinantesBase = [0, 0, 0, 16, 32, 50, 72, 95, 118];
  let saldoImplantacao = IMPLANTACAO.map((x) => x.valor);
  const meses: Mes[] = [];

  for (let i = 0; i <= ULTIMO_FECHADO; i++) {
    const cursos = Math.round(cursosBase[i] * entre(0.9, 1.12));
    const bumps = Math.round(cursos * entre(0.3, 0.42));
    const assinantes = assinantesBase[i] ? Math.round(assinantesBase[i] * entre(0.92, 1.06)) : 0;
    const anterior = meses[i - 1];
    const churn = anterior ? Math.round(anterior.unidades.assinantes * 0.05) : 0;
    const novasAssinaturas = Math.max(0, assinantes - (anterior?.unidades.assinantes ?? 0) + churn);
    const youtube = Math.round(entre(180, 260) + i * entre(55, 75));

    const linhas: Record<LinhaId, LinhaMes> = {
      curso: linha(cursos * TICKET_CURSO, cursos, entre(0.02, 0.05), true),
      bumps: linha(bumps * TICKET_BUMP, bumps, entre(0.01, 0.03), true),
      saas: linha(assinantes * TICKET_SAAS, assinantes, entre(0.005, 0.015), true),
      youtube: linha(youtube, 0, 0, false),
    };
    const soma = (k: keyof LinhaMes) => r2(LINHAS.reduce((a, l) => a + linhas[l.id][k], 0));

    // Degrau ancorado na receita líquida digital do mês anterior (e do penúltimo, para o Degrau 2).
    const rl1 = meses[i - 1]?.liquido ?? 0;
    const rl2 = meses[i - 2]?.liquido ?? 0;
    const degrau = rl1 >= 20000 ? 3 : rl1 >= 8000 && rl2 >= 8000 ? 2 : rl1 >= 2000 ? 1 : 0;
    const custos: CustoMes[] = ITENS_CUSTO.filter((c) => c.desde <= degrau).map((c) => {
      const teto = c.teto(rl1, degrau);
      return { item: c.item, tipo: c.tipo, teto, realizado: Math.round(teto * entre(0.82, 1)) };
    });
    const tetoCustos = custos.reduce((a, c) => a + c.teto, 0);
    const custosRealizados = custos.reduce((a, c) => a + c.realizado, 0);
    const liquido = soma('liquido');

    // Receita do mês não cobre os custos: cada Parte aporta metade da diferença.
    const aporte = r2(Math.max(0, custosRealizados - liquido) / 2);
    // Devolução dos aportes de implantação: 40% da margem do mês, na ordem da fila, metade para cada Parte.
    let disponivel = Math.max(0, r2((liquido - custosRealizados) * QUITACAO_PCT));
    const quitacao: { item: string; valor: number }[] = [];
    saldoImplantacao = saldoImplantacao.map((saldo, k) => {
      const pago = Math.min(saldo, disponivel);
      if (pago > 0) quitacao.push({ item: IMPLANTACAO[k].item, valor: r2(pago) });
      disponivel = r2(disponivel - pago);
      return r2(saldo - pago);
    });
    const quitacaoTotal = r2(quitacao.reduce((a, q) => a + q.valor, 0));

    const base = Math.max(0, r2(liquido - custosRealizados - quitacaoTotal));
    const custosParte = r2(custosRealizados / 2);
    const fesbDigital = r2(base * DIVISAO_DIGITAL);
    const chdDigital = r2(base - fesbDigital);

    // Livro rastreado pelo funil do site.
    const qr = Math.round(entre(120, 220) + i * 14);
    const cliques = Math.round(entre(260, 380) + i * 35);
    const vendasLivro = Math.round(cliques * entre(0.09, 0.13));
    const cupons = Math.round(vendasLivro * entre(0.55, 0.75));
    const recebidoChd = r2(vendasLivro * LIVRO_POR_EXEMPLAR);
    const livroFesb = r2(recebidoChd * PARTICIPACAO_LIVRO);
    const livro = { qr, cliques, cupons, vendas: vendasLivro, recebidoChd, fesb: livroFesb, chd: r2(recebidoChd - livroFesb) };

    const fesbTotal = r2(fesbDigital + livroFesb);
    const chdTotal = r2(chdDigital + livro.chd);
    // Repasse do CHD para a FESB: parte do resultado, metade da devolução de implantação e o livro.
    const repasse = r2(fesbTotal + quitacaoTotal / 2);
    const venc = `10/${pad(MES_NUM[i + 1])}/${MES_ANO[i + 1]}`;
    const repasseStatus = i < ULTIMO_FECHADO ? `Pago em ${venc}` : `Previsto para ${venc}`;

    // Funil: montado de trás para a frente a partir das vendas do curso.
    const recuperadas = Math.round(cursos * entre(0.14, 0.2));
    const checkoutsIniciados = Math.round(cursos / entre(0.48, 0.58));
    const pagina = Math.round(checkoutsIniciados / entre(0.15, 0.2));
    const engajados = Math.round(pagina / entre(0.45, 0.55));
    const leads = Math.round(engajados / entre(0.36, 0.44));
    const upsell = Math.min(cursos, Math.round(novasAssinaturas * entre(0.5, 0.65)));
    const pago = custos.find((c) => c.item === 'Tráfego pago')?.realizado ?? 0;
    const visitasPagas = Math.round(pago / 0.6);
    const visitasOrganicas = Math.round(leads / entre(0.075, 0.09));
    const visitas = visitasOrganicas + visitasPagas + qr;
    const abandonados = checkoutsIniciados - (cursos - recuperadas);
    const pct = (a: number, b: number) => (b ? a / b : 0);
    const etapas: Etapa[] = [
      { etapa: 'Entradas', detalhe: 'YouTube, Instagram, QR do livro, tráfego pago, busca', volume: visitas, conversao: null, base: '' },
      { etapa: 'Isca', detalhe: 'Dicionário do Investidor e calculadoras (leads)', volume: leads, conversao: pct(leads, visitas), base: 'das entradas' },
      { etapa: 'Sequência de 7 e-mails', detalhe: 'Leads engajados (abriram 4 ou mais e-mails)', volume: engajados, conversao: pct(engajados, leads), base: 'dos leads' },
      { etapa: 'Página de venda', detalhe: 'Visitas com cupom e prazo', volume: pagina, conversao: pct(pagina, engajados), base: 'dos engajados' },
      { etapa: 'Checkout', detalhe: `Compras concluídas (${checkoutsIniciados} iniciados)`, volume: cursos, conversao: pct(cursos, pagina), base: 'das visitas à página' },
      { etapa: 'Order bump', detalhe: 'Aceites no checkout', volume: bumps, conversao: pct(bumps, cursos), base: 'das compras' },
      { etapa: 'Pós-venda e upsell', detalhe: 'Novas assinaturas vindas de compradores', volume: upsell, conversao: pct(upsell, cursos), base: 'das compras' },
      { etapa: 'Recuperação de carrinho', detalhe: 'Vendas recuperadas (já contadas no checkout)', volume: recuperadas, conversao: pct(recuperadas, abandonados), base: 'dos abandonos' },
    ];

    // Origem por canal (UTM). Pesos de conversão por canal, simulados.
    const org = repartir(visitasOrganicas, [0.45, 0.3, 0.25]);
    const canaisBase = [
      { canal: 'YouTube', utm: 'utm_source=youtube&utm_medium=video', visitas: org[0], q: 1.2 },
      { canal: 'Instagram', utm: 'utm_source=instagram&utm_medium=social', visitas: org[1], q: 0.8 },
      { canal: 'QR do livro', utm: 'utm_source=livro&utm_medium=qrcode', visitas: qr, q: 2.4 },
      { canal: 'Tráfego pago', utm: 'utm_source=meta&utm_medium=cpc', visitas: visitasPagas, q: 0.7 },
      { canal: 'Busca', utm: 'utm_source=google&utm_medium=organic', visitas: org[2], q: 1 },
    ];
    const pesos = canaisBase.map((c) => c.visitas * c.q);
    const leadsC = repartir(leads, pesos);
    const vendasC = repartir(cursos, pesos);
    const canais: Canal[] = canaisBase.map((c, k) => ({
      canal: c.canal,
      utm: c.utm,
      visitas: c.visitas,
      leads: leadsC[k],
      vendas: vendasC[k],
      receita: vendasC[k] * TICKET_CURSO,
    }));

    const fora = [
      { item: 'Consultoria de valores mobiliários', valor: Math.round(entre(6, 11)) * 650 },
      { item: 'Mentoria', valor: Math.round(entre(1, 4)) * 1200 },
      { item: 'Palestras', valor: Math.round(entre(0, 2)) * 4500 },
      { item: 'Turmas e eventos presenciais', valor: i % 3 === 2 ? Math.round(entre(8, 14)) * 890 : 0 },
    ];

    meses.push({
      i,
      rotulo: MESES[i],
      linhas,
      bruto: soma('bruto'),
      gateway: soma('gateway'),
      impostos: soma('impostos'),
      reembolsos: soma('reembolsos'),
      liquido,
      unidades: { cursos, bumps, assinantes, novasAssinaturas },
      livro,
      fora,
      degrau,
      rlAnterior: rl1,
      custos,
      tetoCustos,
      custosRealizados,
      quitacao,
      quitacaoTotal,
      aporte,
      custosParte,
      base,
      fesbDigital,
      chdDigital,
      fesbTotal,
      chdTotal,
      repasse,
      repasseStatus,
      etapas,
      canais,
      checkoutsIniciados,
    });
  }
  return meses;
}

export const DADOS: Mes[] = gerar();

export const acumulado = (ate: number, f: (m: Mes) => number) => r2(DADOS.slice(0, ate + 1).reduce((a, m) => a + f(m), 0));

// Situação da fila de implantação ao fim de um mês.
export function filaImplantacao(ate: number) {
  return IMPLANTACAO.map((x) => {
    const pagos = DADOS.slice(0, ate + 1).flatMap((m) => m.quitacao.filter((q) => q.item === x.item).map((q) => ({ mes: m.rotulo, valor: q.valor })));
    const pago = r2(pagos.reduce((a, p) => a + p.valor, 0));
    return { ...x, pago, saldo: r2(x.valor - pago), quitadoEm: pago >= x.valor ? pagos[pagos.length - 1]?.mes : undefined };
  });
}

// Próximo degrau a partir do líquido do mês selecionado (que define o degrau do mês seguinte).
export function proximoDegrau(m: Mes) {
  const anterior = DADOS[m.i - 1]?.liquido ?? 0;
  const vem = m.liquido >= 20000 ? 3 : m.liquido >= 8000 && anterior >= 8000 ? 2 : m.liquido >= 2000 ? 1 : 0;
  if (vem >= 3) return { atual: m.degrau, vem, alvo: null, falta: 0, nota: 'Degrau máximo alcançado' };
  const alvo = vem + 1;
  const d = DEGRAUS[alvo];
  const falta = Math.max(0, r2(d.limiar - m.liquido));
  const nota = alvo === 2 ? 'precisa se manter por 2 meses seguidos' : 'no mês, para valer no mês seguinte';
  return { atual: m.degrau, vem, alvo, falta, nota };
}

export type StatusMarco = 'Atingido' | 'Abaixo, dentro da tolerância' | 'Abaixo de 70%' | 'Revisão da parceria' | 'Em andamento' | 'Futuro';

export function statusMarcos(sel: number) {
  const brutoAcum = (i: number) => acumulado(i, (m) => m.bruto);
  let anteriorCritico = false;
  let andamento = false;
  return MARCOS.map((mc) => {
    if (mc.mes <= sel) {
      const realizado = brutoAcum(mc.mes);
      const pct = realizado / mc.valor;
      let status: StatusMarco = pct >= 1 ? 'Atingido' : pct >= 0.7 ? 'Abaixo, dentro da tolerância' : 'Abaixo de 70%';
      if (pct < 0.7 && anteriorCritico) status = 'Revisão da parceria';
      anteriorCritico = pct < 0.7;
      return { ...mc, realizado, pct, status };
    }
    const realizado = brutoAcum(sel);
    const status: StatusMarco = andamento ? 'Futuro' : 'Em andamento';
    andamento = true;
    return { ...mc, realizado, pct: realizado / mc.valor, status };
  });
}
