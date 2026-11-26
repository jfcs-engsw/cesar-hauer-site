// Estrutura do curso Formação de Investidores, montada a partir dos nomes dos arquivos das aulas
// (acervo do Cesar, 59 vídeos editados). Duração ainda não medida: o portal mostra só a contagem.

export type Lesson = { id: string; title: string };
export type Module = { id: string; code: string; title: string; summary: string; lessons: Lesson[] };

const m = (code: string, title: string, summary: string, lessons: [string, string][]): Module => ({
  id: code.toLowerCase(),
  code,
  title,
  summary,
  lessons: lessons.map(([id, t]) => ({ id, title: t })),
});

export const COURSE = {
  slug: 'formacao-de-investidores',
  title: 'Formação de Investidores',
  subtitle: 'Do sistema financeiro à montagem de carteira, com o rigor de quem faz consultoria todos os dias.',
  // Pedido do CHD de 25/11/2026: a Formação de Investidores segue como curso presencial em Curitiba; o curso
  // online novo sai do acervo gravado (plano DNN2-PT-01). O catálogo abaixo serve à turma presencial e ao portal.
  formato: 'Presencial em Curitiba',
  launchPrice: 497,
  fullPrice: 997,
  installments: 12,
  installmentValue: 97,
};

export const MODULES: Module[] = [
  m('M0', 'Introdução', 'Como o curso está organizado e como tirar o máximo dele.', [['m0000', 'Introdução']]),
  m('M1', 'Sistema Financeiro Nacional', 'Quem é quem no SFN e como os juros chegam ao seu bolso.', [
    ['m101', 'O que é o SFN e quais são seus principais participantes'],
    ['m102', 'Mercado primário, mercado secundário, bancos, Selic, CDI e inflação'],
  ]),
  m('M2', 'Matemática financeira', 'A base que separa o investidor do apostador, com HP12c e exercícios resolvidos.', [
    ['m201', 'Juros simples e compostos, taxas proporcionais e equivalentes'],
    ['m202', 'Relação entre capital, juro e tempo'],
    ['m203', 'Comparação juros simples x compostos'],
    ['m204', 'Desconto de inflação, soma de taxas, VPL, TIR e séries de pagamentos'],
    ['m205', 'Cotização de patrimônio'],
    ['m206', 'HP12c: apresentação'],
    ['m207', 'Exercícios 1'],
    ['m208', 'Exercícios 2'],
    ['m209', 'Exercícios 3'],
    ['m210', 'Exercícios 4'],
    ['m211', 'Exercícios 5'],
    ['m212', 'Exercícios 6'],
    ['m213', 'Exercícios 7'],
    ['m214', 'Exercícios 8'],
  ]),
  m('M3', 'Estatística', 'Medidas que descrevem retorno e risco.', [
    ['m301', 'Medidas de tendência central, dispersão e relação'],
    ['m302', 'Curva normal: exercício'],
  ]),
  m('M4', 'Contabilidade', 'Ler balanço e DRE para entender a empresa por trás da ação.', [
    ['m401', 'Balanço patrimonial'],
    ['m402', 'Esquema de financiamento, DRE e regimes contábeis'],
    ['m403', 'Peculiaridades de instituições financeiras e notas explicativas'],
    ['m404', 'Análises contábeis'],
  ]),
  m('M5', 'Mercado financeiro', 'Renda fixa, renda variável, derivativos, fundos e tributação.', [
    ['m501', 'Introdução'],
    ['m502', 'FGC e títulos públicos'],
    ['m503', 'Títulos privados'],
    ['m504', 'Duration'],
    ['m505', 'Introdução à renda variável'],
    ['m506', 'Investimento x especulação'],
    ['m507', 'Introdução a derivativos: mercado a termo'],
    ['m508', 'Mercado futuro'],
    ['m509', 'Swap e opções'],
    ['m510', 'Fundos de investimento, parte 1'],
    ['m511', 'Fundos de investimento, parte 2'],
    ['m512', 'Fundos de investimento, parte 3'],
    ['m513', 'Ativos inertes e tributação'],
    ['m514', 'Retornos históricos'],
  ]),
  m('M6', 'Previdência privada', 'Quando a previdência faz sentido e quando não faz.', [['m601', 'Previdência privada']]),
  m('M7', 'Gestão de carteiras e risco', 'Beta, Markowitz, fronteira eficiente e as métricas de risco do mercado.', [
    ['m701', 'Introdução e coeficiente beta'],
    ['m702', 'Mercado eficiente, modelo de Markowitz e risco de portfólio'],
    ['m703', 'Fronteira eficiente em Excel'],
    ['m704', 'CML, CAPM, Sharpe, Treynor e VaR'],
  ]),
  m('M8', 'Finanças comportamentais', 'Os vieses que custam dinheiro e como se proteger deles.', [
    ['m801', 'Introdução'],
    ['m802', 'Finanças comportamentais x tradicionais'],
    ['m803', 'Heurísticas'],
  ]),
  m('M9', 'Seleção de ativos e valuation clássica', 'Como avaliar renda fixa, ações e FII, com dois estudos de caso.', [
    ['m901', 'Introdução'],
    ['m902', 'Renda fixa'],
    ['m903', 'Renda variável: exemplo 1'],
    ['m904', 'Renda variável: exemplo 2'],
    ['m905', 'Renda variável: primeiro estudo de caso'],
    ['m906', 'Renda variável: segundo estudo de caso'],
    ['m907', 'Renda variável: FII'],
    ['m908', 'Investimentos alternativos'],
  ]),
  m('M10', 'Investimentos no exterior', 'Diversificação internacional na prática.', [['m1001', 'Investimentos no exterior']]),
  m('M11', 'Montagem de carteiras', 'Tudo junto: três carteiras montadas do zero.', [
    ['m1101', 'Introdução'],
    ['m1102', 'Exemplo 1'],
    ['m1103', 'Exemplo 2'],
    ['m1104', 'Exemplo 3'],
  ]),
  m('M99', 'Encerramento', 'Próximos passos.', [['m9999', 'Encerramento']]),
];

export const ALL_LESSONS = MODULES.flatMap((mod) => mod.lessons.map((l) => ({ ...l, module: mod })));
