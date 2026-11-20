// Cliente do painel de gestão (chd-plataforma-api, /api/gestao). Sessão em cookie HttpOnly próprio do painel,
// separado do cookie do aluno; o front nunca vê token. Valores em centavos inteiros. Nenhum segredo aqui.

import { ApiErro } from './api';

const BASE = `${(import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '')}/gestao`;

export const urlGestao = (caminho: string) => `${BASE}${caminho}`;

async function req<T>(caminho: string, init?: RequestInit): Promise<T> {
  let r: Response;
  const json = typeof init?.body === 'string';
  try {
    r = await fetch(urlGestao(caminho), {
      credentials: 'include',
      ...init,
      headers: { Accept: 'application/json', ...(json ? { 'Content-Type': 'application/json' } : {}) },
    });
  } catch {
    throw new ApiErro(0, 'Painel indisponível no momento.');
  }
  if (r.status === 204) return undefined as T;
  if (!(r.headers.get('content-type') ?? '').includes('application/json')) throw new ApiErro(0, 'Painel indisponível no momento.');
  const dados = await r.json();
  if (!r.ok) {
    const det = dados?.detail;
    const msg = typeof det === 'string' ? det : Array.isArray(det) ? 'Confira os campos do formulário.' : 'Falha na requisição.';
    throw new ApiErro(r.status, msg);
  }
  return dados as T;
}

const post = <T>(caminho: string, corpo?: unknown) =>
  req<T>(caminho, { method: 'POST', ...(corpo === undefined ? {} : { body: JSON.stringify(corpo) }) });

export type Parte = 'FESB' | 'CHD';
export type Partes = Record<Parte, number>;
export type Gestor = { email: string; papel: Parte; nome: string };
export type LinhaReceita = 'curso' | 'bumps' | 'assinatura' | 'youtube' | 'livro';
export type Categoria = 'implantacao' | 'fixo' | 'variavel' | 'trafego';

export type LinhaValores = { bruto: number; gateway: number; impostos: number; reembolsos: number; deducoes: number; liquido: number };

export type MesCalc = {
  competencia: string;
  rotulo: string;
  degrau: number;
  rl_anterior: number;
  linhas: Record<Exclude<LinhaReceita, 'livro'>, LinhaValores>;
  bruto: number;
  deducoes: number;
  liquido: number;
  livro: { recebido: number } & Partes;
  custos: { fixo: number; variavel: number; trafego: number; operacionais: number; implantacao: number };
  custos_partes: Partes;
  resultado: number;
  resultado_partes: Partes;
  trafego: { teto: number; realizado: number; acima_do_teto: boolean; bp: number };
  caixa_inicial: number;
  aportes: number;
  pagamentos_parceria: number;
  caixa_antes_quitacao: number;
  aporte_nao_gasto: number;
  devolvido: Partes;
  reserva_implantacao: { item: string; ordem: number | null; valor: number }[];
  reserva_total: number;
  base: number;
  divisao: Partes;
  total: Partes;
  caixa_final: number;
  descoberto: number;
  aporte_necessario: Partes;
  creditos_pendentes: Partes;
  restituir: Partes;
  repasses: { de: Parte; para: Parte; valor: number }[];
};

export type Acumulado = {
  bruto: number;
  deducoes: number;
  liquido: number;
  resultado: number;
  base: number;
  aportes: number;
  custos: { operacionais: number; implantacao: number; fixo: number; variavel: number; trafego: number };
  custos_partes: Partes;
  resultado_partes: Partes;
  devolvido: Partes;
  divisao: Partes;
  total: Partes;
  livro: { recebido: number } & Partes;
};

export type VersaoOrcamento = { id: number; nome: string; exemplo: boolean; descricao: string; carregado_em: string; carregado_por: string } | null;

export type Marco = { data: string; competencia: string; valor: number; realizado: number; status: string };

export type Visao = {
  competencia: string;
  rotulo: string;
  vazio?: boolean;
  mes: MesCalc;
  acumulado: Acumulado;
  desde: string;
  degrau: {
    atual: number;
    proximo: { vem: number; alvo: number | null; falta: number; nota: string };
    degraus: { n: number; regra: string; limiar: number; trafego_bp: number }[];
  };
  meta: { total: number; realizado: number; previsto: number; marcos: Marco[]; serie: { competencia: string; rotulo: string; previsto: number; realizado: number }[] };
  historico: { competencia: string; rotulo: string; degrau: number; bruto: number; liquido: number; custos: number; base: number; total: Partes }[];
  orcamento: VersaoOrcamento;
};

export type ItemPrevisto = {
  item: string;
  categoria: Categoria;
  degrau: number;
  liberado: boolean;
  estimativa: boolean;
  previsto: number;
  minimo: number | null;
  maximo: number | null;
  previsto_partes: Partes;
  realizado: number;
  diferenca: number;
  nota: string;
};

export type Orcamento = {
  competencia: string;
  rotulo: string;
  degrau: number;
  itens: ItemPrevisto[];
  fora_do_orcamento: { item: string; realizado: number }[];
  totais: Record<Categoria, { previsto: number; previsto_liberado: number; realizado: number }>;
  previsto_total: number;
  previsto_liberado_total: number;
  realizado_total: number;
  trafego: MesCalc['trafego'];
  receita: { previsto_bruto: number; previsto_deducoes: number; previsto_liquido: number; realizado_bruto: number; realizado_deducoes: number; realizado_liquido: number };
  acumulado: { previsto: number; realizado: number };
  orcamento: VersaoOrcamento;
  itens_disponiveis: string[];
};

export type Quitacao = {
  competencia: string;
  creditos_pendentes: Partes;
  devolvido_acumulado: Partes;
  itens: {
    ordem: number | null;
    item: string;
    competencia: string;
    estimativa: boolean;
    minimo: number | null;
    base: number;
    maximo: number | null;
    realizado: number;
    reservado: number;
    saldo: number;
    situacao: string;
  }[];
};

export type Lancamento = {
  id: number;
  tipo: 'custo' | 'receita';
  competencia: string;
  data: string;
  item: string;
  categoria: Categoria | null;
  linha: LinhaReceita | null;
  valor_centavos: number;
  gateway_centavos: number;
  impostos_centavos: number;
  reembolsos_centavos: number;
  liquido_centavos: number;
  pago_por: 'PARCERIA' | Parte;
  origem: string;
  id_externo: string | null;
  observacao: string;
  comprovante: { nome: string; tipo: string; bytes: number } | null;
  estorno_de: number | null;
  estornado_por: number | null;
  criado_por: string;
  criado_em: string;
};

export type NovoLancamento = {
  tipo: 'custo' | 'receita';
  data: string;
  competencia?: string;
  item?: string;
  categoria?: Categoria;
  linha?: LinhaReceita;
  valor_centavos: number;
  gateway_centavos?: number;
  impostos_centavos?: number;
  reembolsos_centavos?: number;
  pago_por?: 'PARCERIA' | Parte;
  id_externo?: string;
  observacao?: string;
};

export type Aporte = {
  id: number;
  parte: Parte;
  competencia: string;
  data: string;
  valor_centavos: number;
  observacao: string;
  estorno_de: number | null;
  estornado_por: number | null;
  criado_por: string;
  criado_em: string;
};

export type StatusPrestacao = {
  codigo: 'nao_publicada' | 'em_contestacao' | 'contestada' | 'aprovada';
  texto: string;
  versao?: number;
  publicada_em?: string;
  publicada_por?: string;
  prazo_contestacao?: string;
  contestada_por?: string;
  motivo?: string;
};

export type Demonstrativo = {
  competencia: string;
  rotulo: string;
  emitido_em: string;
  titular_conta: Parte;
  degrau: number;
  receitas: ({ linha: string; nome: string } & LinhaValores)[];
  receitas_total: { bruto: number; deducoes: number; liquido: number; gateway: number; impostos: number; reembolsos: number };
  livro: { recebido: number; percentual_fesb_bp: number } & Partes;
  custos: ({ categoria: string; categoria_nome: string; item: string; pago_por: string; valor: number } & Partes)[];
  custos_total: { operacionais: number; implantacao: number } & Partes;
  trafego: MesCalc['trafego'];
  aportes: Partes;
  caixa: { inicial: number; antes_quitacao: number; final: number };
  devolvido: Partes;
  reserva_implantacao: { item: string; valor: number }[];
  resultado: number;
  resultado_partes: Partes;
  base: number;
  divisao: Partes;
  divisao_fesb_bp: number;
  totais: Partes;
  repasses: { de: Parte; para: Parte; valor: number }[];
  posicao: { creditos_pendentes: Partes; descoberto: number; aporte_necessario: Partes; restituir: Partes };
};

export type Prestacao = {
  competencia: string;
  status: StatusPrestacao;
  publicada: Demonstrativo | null;
  atual: Demonstrativo;
  versoes: StatusPrestacao[];
  pode_publicar: boolean;
};

const q = (mes: string) => `?mes=${encodeURIComponent(mes)}`;

export const gestaoApi = {
  estado: () => req<{ google: boolean }>('/auth/estado'),
  eu: () => req<Gestor>('/eu'),
  sair: () => post<void>('/auth/sair'),
  meses: () => req<{ atual: string; meses: { competencia: string; rotulo: string }[] }>('/meses'),
  visao: (mes: string) => req<Visao>(`/visao${q(mes)}`),
  orcamento: (mes: string) => req<Orcamento>(`/orcamento${q(mes)}`),
  quitacao: (mes: string) => req<Quitacao>(`/quitacao${q(mes)}`),
  lancamentos: (mes: string) => req<Lancamento[]>(`/lancamentos${q(mes)}`),
  lancar: (dados: NovoLancamento) => post<Lancamento>('/lancamentos', dados),
  estornar: (id: number, motivo: string, competencia?: string) => post<Lancamento>(`/lancamentos/${id}/estornar`, { motivo, ...(competencia ? { competencia } : {}) }),
  anexar: async (id: number, arquivo: File) => {
    const fd = new FormData();
    fd.append('arquivo', arquivo);
    return req<{ id: number }>(`/lancamentos/${id}/comprovante`, { method: 'POST', body: fd });
  },
  urlComprovante: (id: number) => urlGestao(`/lancamentos/${id}/comprovante`),
  aportes: () => req<Aporte[]>('/aportes'),
  aportar: (dados: { parte: Parte; data: string; valor_centavos: number; observacao?: string; competencia?: string }) => post<Aporte>('/aportes', dados),
  estornarAporte: (id: number, motivo: string, competencia?: string) => post<Aporte>(`/aportes/${id}/estornar`, { motivo, ...(competencia ? { competencia } : {}) }),
  prestacao: (mes: string) => req<Prestacao>(`/prestacao/${mes}`),
  urlCsv: (mes: string) => urlGestao(`/prestacao/${mes}/csv`),
  publicar: (mes: string) => post<{ status: StatusPrestacao }>(`/prestacao/${mes}/publicar`),
  contestar: (mes: string, motivo: string) => post<{ status: StatusPrestacao }>(`/prestacao/${mes}/contestar`, { motivo }),
};

// Dinheiro: centavos inteiros na API; texto em reais na tela.
export const reais = (c: number) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// "1.234,56", "1234,56" ou "1234.56" para centavos; null se inválido.
export function paraCentavos(texto: string): number | null {
  const t = texto.trim().replace(/\s|R\$/g, '');
  if (!t) return null;
  const normal = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t;
  if (!/^\d+(\.\d{1,2})?$/.test(normal)) return null;
  const [int, dec = ''] = normal.split('.');
  return Number(int) * 100 + Number((dec + '00').slice(0, 2));
}
