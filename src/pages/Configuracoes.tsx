import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, ApiErro, type Configuracoes as Config, type Fiscal, type Notificacoes } from '../lib/api';

// Configurações do aluno: perfil, troca de e-mail (confirmada pelo endereço novo), avisos por e-mail e dados
// para a nota fiscal. Tudo pela chd-plataforma-api, com a sessão do aluno.

const AVISO_EMAIL: Record<string, string> = {
  ok: 'E-mail trocado. Use o endereço novo no próximo acesso.',
  invalido: 'O link de confirmação expirou ou já foi usado. Peça a troca de novo.',
  'em-uso': 'Este e-mail já é de outra conta. Use outro endereço.',
};

const FISCAL_VAZIO: Fiscal = { tipo: 'PF', documento: '', nome: '', email_nf: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };

const msgErro = (e: unknown) => (e instanceof ApiErro ? e.message : 'Não foi possível salvar.');

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <article className="card">
      <h2 className="card__title">{titulo}</h2>
      {children}
    </article>
  );
}

function useEnvio() {
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const enviar = async (f: () => Promise<string>) => {
    setOcupado(true);
    setMsg('');
    try {
      setMsg(await f());
    } catch (e) {
      setMsg(msgErro(e));
    } finally {
      setOcupado(false);
    }
  };
  return { msg, ocupado, enviar };
}

export default function Configuracoes() {
  const [params] = useSearchParams();
  const [cfg, setCfg] = useState<Config | null>(null);
  const [estado, setEstado] = useState<'carregando' | 'entrar' | 'fora' | 'ok'>('carregando');

  useEffect(() => {
    api
      .configuracoes()
      .then((c) => {
        setCfg(c);
        setEstado('ok');
      })
      .catch((e) => setEstado(e instanceof ApiErro && e.status === 401 ? 'entrar' : 'fora'));
  }, []);

  const aviso = AVISO_EMAIL[params.get('email') ?? ''];
  return (
    <div className="portal-home">
      <div className="container">
        <p className="eyebrow eyebrow--dark">Área do aluno</p>
        <div className="portal-topo">
          <h1 className="section__title">Configurações</h1>
          <Link to="/portal" className="btn btn--ghost btn--sm">
            Voltar aos cursos
          </Link>
        </div>
        {aviso && (
          <p className="portal-erro" role="status">
            {aviso}
          </p>
        )}
        {estado === 'carregando' && <p className="hint">Carregando...</p>}
        {estado === 'fora' && <p className="hint">As configurações estão indisponíveis no momento.</p>}
        {estado === 'entrar' && (
          <p className="hint">
            Entre na <Link to="/portal">área do aluno</Link> para ver as suas configurações.
          </p>
        )}
        {cfg && (
          <div className="cards cards--2">
            <Perfil cfg={cfg} />
            <Email cfg={cfg} />
            <Avisos inicial={cfg.notificacoes} />
            <NotaFiscal inicial={cfg.fiscal ?? FISCAL_VAZIO} />
          </div>
        )}
      </div>
    </div>
  );
}

function Perfil({ cfg }: { cfg: Config }) {
  const [nome, setNome] = useState(cfg.perfil.nome);
  const { msg, ocupado, enviar } = useEnvio();
  return (
    <Bloco titulo="Perfil">
      <form
        className="form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          enviar(async () => {
            await api.salvarPerfil(nome.trim());
            return 'Nome salvo.';
          });
        }}
      >
        <label>
          Nome
          <input required minLength={2} maxLength={200} autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        {msg && <p className="portal-erro">{msg}</p>}
        <button className="btn btn--accent" disabled={ocupado}>
          Salvar
        </button>
      </form>
    </Bloco>
  );
}

function Email({ cfg }: { cfg: Config }) {
  const [novo, setNovo] = useState('');
  const { msg, ocupado, enviar } = useEnvio();
  return (
    <Bloco titulo="E-mail de acesso">
      <p className="card__text">
        Atual: <strong>{cfg.perfil.email}</strong>
        {cfg.troca_email_pendente && (
          <>
            <br />
            Troca pendente para {cfg.troca_email_pendente}: confirme pelo link enviado a esse endereço.
          </>
        )}
      </p>
      <form
        className="form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          enviar(async () => (await api.trocarEmail(novo.trim())).mensagem);
        }}
      >
        <label>
          Novo e-mail
          <input type="email" required autoComplete="email" value={novo} onChange={(e) => setNovo(e.target.value)} />
        </label>
        <p className="hint">O e-mail só muda depois que você confirmar pelo link enviado ao endereço novo.</p>
        {msg && <p className="portal-erro">{msg}</p>}
        <button className="btn btn--accent" disabled={ocupado}>
          Enviar confirmação
        </button>
      </form>
    </Bloco>
  );
}

function Avisos({ inicial }: { inicial: Notificacoes }) {
  const [n, setN] = useState(inicial);
  const { msg, ocupado, enviar } = useEnvio();
  const caixa = (k: keyof Notificacoes, texto: string) => (
    <label className="check">
      <input type="checkbox" checked={n[k]} onChange={(e) => setN({ ...n, [k]: e.target.checked })} />
      {texto}
    </label>
  );
  return (
    <Bloco titulo="Avisos por e-mail">
      <form
        className="form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          enviar(async () => {
            await api.salvarNotificacoes(n);
            return 'Preferências salvas.';
          });
        }}
      >
        {caixa('aviso_aulas_novas', 'Aulas novas nos meus cursos')}
        {caixa('aviso_novidades', 'Novidades da área do aluno')}
        {caixa('aviso_ofertas', 'Ofertas de cursos e produtos (opcional)')}
        {msg && <p className="portal-erro">{msg}</p>}
        <button className="btn btn--accent" disabled={ocupado}>
          Salvar
        </button>
      </form>
    </Bloco>
  );
}

function NotaFiscal({ inicial }: { inicial: Fiscal }) {
  const [f, setF] = useState(inicial);
  const { msg, ocupado, enviar } = useEnvio();
  const campo = (k: keyof Fiscal) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  return (
    <Bloco titulo="Dados para a nota fiscal">
      <form
        className="form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          enviar(async () => {
            setF(await api.salvarFiscal(f));
            return 'Dados salvos.';
          });
        }}
      >
        <label>
          Emitir em nome de
          <select value={f.tipo} onChange={campo('tipo')}>
            <option value="PF">Pessoa física (CPF)</option>
            <option value="PJ">Empresa (CNPJ)</option>
          </select>
        </label>
        <label>
          {f.tipo === 'PF' ? 'CPF' : 'CNPJ'}
          <input required inputMode="numeric" value={f.documento} onChange={campo('documento')} />
        </label>
        <label>
          {f.tipo === 'PF' ? 'Nome completo' : 'Razão social'}
          <input required minLength={2} maxLength={200} value={f.nome} onChange={campo('nome')} />
        </label>
        <label>
          E-mail para a nota (opcional)
          <input type="email" value={f.email_nf} onChange={campo('email_nf')} />
        </label>
        <div className="form__row">
          <label>
            CEP
            <input required inputMode="numeric" autoComplete="postal-code" value={f.cep} onChange={campo('cep')} />
          </label>
          <label>
            UF
            <input required maxLength={2} value={f.uf} onChange={campo('uf')} />
          </label>
        </div>
        <label>
          Logradouro
          <input required autoComplete="address-line1" value={f.logradouro} onChange={campo('logradouro')} />
        </label>
        <div className="form__row">
          <label>
            Número
            <input required value={f.numero} onChange={campo('numero')} />
          </label>
          <label>
            Complemento
            <input value={f.complemento} onChange={campo('complemento')} />
          </label>
        </div>
        <div className="form__row">
          <label>
            Bairro
            <input required value={f.bairro} onChange={campo('bairro')} />
          </label>
          <label>
            Cidade
            <input required autoComplete="address-level2" value={f.cidade} onChange={campo('cidade')} />
          </label>
        </div>
        <p className="hint">Usados só para emitir a nota fiscal das suas compras.</p>
        {msg && <p className="portal-erro">{msg}</p>}
        <button className="btn btn--accent" disabled={ocupado}>
          Salvar
        </button>
      </form>
    </Bloco>
  );
}
