// Cliente da API da área do aluno (chd-plataforma-api). Sessão em cookie HttpOnly: o front nunca vê o token.
// Base por VITE_API_BASE (padrão /api, mesmo domínio, atrás do Caddy). Nenhum segredo neste código.

const BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');

export class ApiErro extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// status 0 = API fora do ar ou ausente (ex.: GitHub Pages, que devolve HTML no lugar de JSON).
async function req<T>(caminho: string, init?: RequestInit): Promise<T> {
  let r: Response;
  try {
    r = await fetch(`${BASE}${caminho}`, {
      credentials: 'include',
      ...init,
      headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
    });
  } catch {
    throw new ApiErro(0, 'Área do aluno indisponível no momento.');
  }
  if (r.status === 204) return undefined as T;
  const json = (r.headers.get('content-type') ?? '').includes('application/json');
  if (!json) throw new ApiErro(0, 'Área do aluno indisponível no momento.');
  const dados = await r.json();
  if (!r.ok) throw new ApiErro(r.status, typeof dados?.detail === 'string' ? dados.detail : 'Falha na requisição.');
  return dados as T;
}

export type Eu = { id: number; email: string; nome: string };
export type CursoResumo = {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  total_aulas: number;
  concluidas: number;
  proxima_aula_id: number | null;
};
export type AulaItem = { id: number; codigo: string; titulo: string; titulo_provisorio: boolean; concluida: boolean };
export type ModuloItem = {
  id: number;
  codigo: string;
  titulo: string;
  resumo: string;
  total_aulas: number;
  concluidas: number;
  aulas: AulaItem[];
};
export type CursoDetalhe = CursoResumo & { modulos: ModuloItem[] };
export type Player = { aula_id: number; tipo: 'video' | 'iframe'; url: string; expira_em: number | null };

export type Notificacoes = { aviso_aulas_novas: boolean; aviso_novidades: boolean; aviso_ofertas: boolean };
export type Fiscal = {
  tipo: 'PF' | 'PJ';
  documento: string;
  nome: string;
  email_nf: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};
export type Configuracoes = {
  perfil: { nome: string; email: string };
  notificacoes: Notificacoes;
  fiscal: Fiscal | null;
  troca_email_pendente: string | null;
};

const enviar = <T>(metodo: 'POST' | 'PUT', caminho: string, corpo: unknown) =>
  req<T>(caminho, { method: metodo, body: JSON.stringify(corpo) });

export const api = {
  pedirLink: (email: string) =>
    req<{ mensagem: string }>('/auth/link', { method: 'POST', body: JSON.stringify({ email }) }),
  sair: () => req<void>('/auth/sair', { method: 'POST' }),
  eu: () => req<Eu>('/eu'),
  cursos: () => req<CursoResumo[]>('/cursos'),
  curso: (id: number | string) => req<CursoDetalhe>(`/cursos/${id}`),
  player: (aulaId: number | string) => req<Player>(`/aulas/${aulaId}/player`),
  configuracoes: () => req<Configuracoes>('/eu/configuracoes'),
  salvarPerfil: (nome: string) => enviar<{ nome: string; email: string }>('PUT', '/eu/perfil', { nome }),
  salvarNotificacoes: (n: Notificacoes) => enviar<Notificacoes>('PUT', '/eu/notificacoes', n),
  salvarFiscal: (f: Fiscal) => enviar<Fiscal>('PUT', '/eu/fiscal', { ...f, email_nf: f.email_nf || null }),
  trocarEmail: (novo_email: string) => enviar<{ mensagem: string }>('POST', '/eu/email', { novo_email }),
  concluir: (aulaId: number | string) =>
    req<{ aula_id: number; concluida: boolean; concluidas: number; total_aulas: number }>(
      `/aulas/${aulaId}/concluir`,
      { method: 'POST' },
    ),
};
