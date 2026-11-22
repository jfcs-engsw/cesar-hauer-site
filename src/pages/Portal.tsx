import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { api, ApiErro, type CursoDetalhe, type CursoResumo, type Eu, type Player } from '../lib/api';

// Área do aluno real: login por link mágico, cursos com matrícula ativa, aulas com player e progresso.
// O acesso é decidido pela API (cookie HttpOnly); o front só mostra o que ela libera.

const INDISPONIVEL = (
  <article className="card">
    <h2 className="card__title">Área do aluno em implantação</h2>
    <p className="card__text">O acesso com login ainda não está disponível neste endereço.</p>
    <Link to="/lista-de-espera" className="btn btn--ghost btn--block">
      Entrar na lista de espera do curso
    </Link>
  </article>
);

export function Progress({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="progress" aria-label={`${pct}% concluído`}>
      <div className="progress__bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <span className="progress__txt">
        {done} de {total} aulas · {pct}%
      </span>
    </div>
  );
}

function Entrar() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState('');
  const [erro, setErro] = useState(params.get('erro') === 'link' ? 'O link expirou ou já foi usado. Peça um novo abaixo.' : '');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setOcupado(true);
    setErro('');
    try {
      await api.pedirLink(email.trim());
      setEnviado(email.trim());
    } catch (err) {
      setErro(err instanceof ApiErro && err.status !== 422 ? err.message : 'Confira o e-mail digitado.');
    } finally {
      setOcupado(false);
    }
  };

  if (enviado)
    return (
      <article className="card">
        <h2 className="card__title">Confira seu e-mail</h2>
        <p className="card__text">
          Se <strong>{enviado}</strong> estiver cadastrado, enviamos um link de acesso. Ele vale por 15 minutos e só pode
          ser usado uma vez.
        </p>
        <button className="btn btn--ghost btn--block" onClick={() => setEnviado('')}>
          Usar outro e-mail
        </button>
      </article>
    );

  return (
    <article className="card">
      <h2 className="card__title">Entrar</h2>
      <p className="card__text">Informe o e-mail usado na inscrição. Enviaremos um link de acesso, sem senha.</p>
      <form className="form" onSubmit={enviar}>
        <label>
          E-mail
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {erro && (
          <p className="portal-erro" role="alert">
            {erro}
          </p>
        )}
        <button className="btn btn--accent btn--block" disabled={ocupado}>
          {ocupado ? 'Enviando...' : 'Receber link de acesso'}
        </button>
      </form>
    </article>
  );
}

function CursoCard({ c }: { c: CursoResumo }) {
  return (
    <article className="card course-card">
      <div className="course-card__cover" aria-hidden="true">
        <span>{c.titulo}</span>
      </div>
      <h2 className="card__title">{c.titulo}</h2>
      <Progress done={c.concluidas} total={c.total_aulas} />
      {c.proxima_aula_id && (
        <Link to={`/portal/curso/${c.id}/aula/${c.proxima_aula_id}`} className="btn btn--accent btn--block">
          {c.concluidas ? 'Continuar de onde parei' : 'Começar o curso'}
        </Link>
      )}
      <Link to={`/portal/curso/${c.id}`} className="btn btn--ghost btn--block">
        Ver módulos e progresso
      </Link>
    </article>
  );
}

export function PortalHome() {
  const [estado, setEstado] = useState<'carregando' | 'fora' | 'entrar' | 'dentro'>('carregando');
  const [eu, setEu] = useState<Eu | null>(null);
  const [cursos, setCursos] = useState<CursoResumo[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const u = await api.eu();
        setCursos(await api.cursos());
        setEu(u);
        setEstado('dentro');
      } catch (e) {
        setEstado(e instanceof ApiErro && e.status === 401 ? 'entrar' : 'fora');
      }
    })();
  }, []);

  const sair = async () => {
    await api.sair().catch(() => undefined);
    setEu(null);
    setEstado('entrar');
  };

  return (
    <div className="portal-home">
      <div className="container">
        <p className="eyebrow eyebrow--dark">Área do aluno</p>
        <div className="portal-topo">
          <h1 className="section__title">{eu ? `Olá, ${eu.nome.split(' ')[0] || 'aluno'}` : 'Área do aluno'}</h1>
          {eu && (
            <span className="portal-acoes">
              <Link to="/portal/configuracoes" className="btn btn--ghost btn--sm">
                Configurações
              </Link>
              <button className="btn btn--ghost btn--sm" onClick={sair}>
                Sair
              </button>
            </span>
          )}
        </div>
        {estado === 'carregando' && <p className="hint">Carregando...</p>}
        {estado === 'fora' && <div className="cards cards--2">{INDISPONIVEL}</div>}
        {estado === 'entrar' && (
          <div className="cards cards--2">
            <Entrar />
          </div>
        )}
        {estado === 'dentro' && (
          <div className="cards cards--2">
            {cursos.map((c) => (
              <CursoCard key={c.id} c={c} />
            ))}
            {!cursos.length && (
              <article className="card">
                <h2 className="card__title">Nenhum curso ativo</h2>
                <p className="card__text">Seu e-mail ainda não tem matrícula ativa.</p>
                <Link to="/cursos" className="btn btn--accent btn--block">
                  Conhecer os cursos
                </Link>
              </article>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Carrega o curso; sem sessão volta ao login, sem matrícula ou API fora mostra o motivo.
function useCurso(cursoId: string | undefined) {
  const [curso, setCurso] = useState<CursoDetalhe | null>(null);
  const [erro, setErro] = useState<ApiErro | null>(null);
  useEffect(() => {
    setErro(null);
    api
      .curso(cursoId ?? '')
      .then(setCurso)
      .catch((e) => setErro(e instanceof ApiErro ? e : new ApiErro(0, 'Falha ao carregar o curso.')));
  }, [cursoId]);
  return { curso, setCurso, erro };
}

function Bloqueio({ erro }: { erro: ApiErro }) {
  if (erro.status === 401) return <Navigate to="/portal" replace />;
  return (
    <div className="portal-home">
      <div className="container">
        <p className="eyebrow eyebrow--dark">Área do aluno</p>
        <div className="cards cards--2">
          {erro.status === 0 ? (
            INDISPONIVEL
          ) : (
            <article className="card">
              <h2 className="card__title">{erro.status === 403 ? 'Curso sem matrícula ativa' : 'Curso não encontrado'}</h2>
              <p className="card__text">{erro.message}</p>
              <Link to="/portal" className="btn btn--ghost btn--block">
                Voltar à área do aluno
              </Link>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

export function PortalCurso() {
  const { cursoId } = useParams();
  const { curso, erro } = useCurso(cursoId);
  if (erro) return <Bloqueio erro={erro} />;
  if (!curso)
    return (
      <div className="portal-home">
        <div className="container">
          <p className="hint">Carregando...</p>
        </div>
      </div>
    );
  return (
    <div className="portal-home">
      <div className="container">
        <Link to="/portal" className="player__back">
          Área do aluno
        </Link>
        <h1 className="section__title">{curso.titulo}</h1>
        <div className="portal-resumo">
          <Progress done={curso.concluidas} total={curso.total_aulas} />
          {curso.proxima_aula_id && (
            <Link to={`/portal/curso/${curso.id}/aula/${curso.proxima_aula_id}`} className="btn btn--accent">
              {curso.concluidas ? 'Continuar de onde parei' : 'Começar o curso'}
            </Link>
          )}
        </div>
        <div className="syllabus">
          {curso.modulos.map((m, i) => (
            <details key={m.id} className="syllabus__mod" open={i === 0}>
              <summary>
                <span className="syllabus__code">{m.codigo}</span>
                <span className="syllabus__title">
                  {m.titulo}
                  <small>{m.resumo}</small>
                </span>
                <span className="syllabus__count">
                  {m.concluidas}/{m.total_aulas}
                </span>
              </summary>
              <ol>
                {m.aulas.map((a) => (
                  <li key={a.id}>
                    <Link to={`/portal/curso/${curso.id}/aula/${a.id}`} className={a.concluida ? 'is-done' : ''}>
                      {a.titulo}
                    </Link>
                    {a.concluida && <span className="portal-feita"> · concluída</span>}
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function Video({ aulaId }: { aulaId: string }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [erro, setErro] = useState<ApiErro | null>(null);
  useEffect(() => {
    setPlayer(null);
    setErro(null);
    api
      .player(aulaId)
      .then(setPlayer)
      .catch((e) => setErro(e instanceof ApiErro ? e : new ApiErro(0, 'Falha ao carregar o vídeo.')));
  }, [aulaId]);

  if (erro)
    return (
      <div className="video video--locked">
        <div className="video__lock">
          <p>
            {erro.status === 403
              ? 'Aula disponível para alunos com matrícula ativa.'
              : erro.status === 409
                ? 'O vídeo desta aula ainda não foi publicado.'
                : erro.message}
          </p>
        </div>
      </div>
    );
  if (!player) return <div className="video" aria-busy="true" />;
  return (
    <div className="video">
      {player.tipo === 'iframe' ? (
        <iframe
          className="video__media"
          src={player.url}
          title="Player da aula"
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video className="video__media" src={player.url} controls preload="metadata" />
      )}
    </div>
  );
}

export function PortalAula() {
  const { cursoId, aulaId } = useParams();
  const { curso, setCurso, erro } = useCurso(cursoId);
  const [salvando, setSalvando] = useState(false);
  if (erro) return <Bloqueio erro={erro} />;
  if (!curso)
    return (
      <div className="portal-home">
        <div className="container">
          <p className="hint">Carregando...</p>
        </div>
      </div>
    );

  const aulas = curso.modulos.flatMap((m) => m.aulas.map((a) => ({ ...a, modulo: m })));
  const idx = aulas.findIndex((a) => String(a.id) === aulaId);
  if (idx < 0) return <Navigate to={`/portal/curso/${curso.id}`} replace />;
  const aula = aulas[idx];
  const anterior = aulas[idx - 1];
  const proxima = aulas[idx + 1];

  const concluir = async () => {
    setSalvando(true);
    try {
      const r = await api.concluir(aula.id);
      setCurso({
        ...curso,
        concluidas: r.concluidas,
        modulos: curso.modulos.map((m) =>
          m.id !== aula.modulo.id || aula.concluida
            ? m
            : {
                ...m,
                concluidas: m.concluidas + 1,
                aulas: m.aulas.map((a) => (a.id === aula.id ? { ...a, concluida: true } : a)),
              },
        ),
      });
    } catch {
      /* falha de rede: o botão continua disponível para nova tentativa */
    } finally {
      setSalvando(false);
    }
  };

  const link = (id: number) => `/portal/curso/${curso.id}/aula/${id}`;
  return (
    <div className="player">
      <aside className="player__nav" aria-label="Conteúdo do curso">
        <Link to={`/portal/curso/${curso.id}`} className="player__back">
          Módulos do curso
        </Link>
        <h2>{curso.titulo}</h2>
        <Progress done={curso.concluidas} total={curso.total_aulas} />
        {curso.modulos.map((m) => (
          <details key={m.id} open={m.id === aula.modulo.id}>
            <summary>
              <span className="syllabus__code">{m.codigo}</span> {m.titulo}
            </summary>
            <ol>
              {m.aulas.map((a) => (
                <li key={a.id}>
                  <Link
                    to={link(a.id)}
                    className={`${a.id === aula.id ? 'is-current' : ''} ${a.concluida ? 'is-done' : ''}`}
                  >
                    {a.titulo}
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </aside>
      <section className="player__main">
        <p className="eyebrow eyebrow--dark">
          {aula.modulo.codigo} · {aula.modulo.titulo}
        </p>
        <h1 className="player__title">{aula.titulo}</h1>
        <Video aulaId={String(aula.id)} />
        <div className="player__bar">
          {anterior ? (
            <Link to={link(anterior.id)} className="btn btn--ghost">
              Aula anterior
            </Link>
          ) : (
            <span />
          )}
          <button
            className={`btn ${aula.concluida ? 'btn--ghost' : 'btn--primary'}`}
            onClick={concluir}
            disabled={aula.concluida || salvando}
          >
            {aula.concluida ? 'Concluída' : salvando ? 'Salvando...' : 'Marcar como concluída'}
          </button>
          {proxima ? (
            <Link to={link(proxima.id)} className="btn btn--ghost">
              Próxima aula
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </div>
  );
}
