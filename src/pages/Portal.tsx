import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ALL_LESSONS, COURSE, MODULES } from '../content/curso';
import { load, save } from '../lib/util';
import { NotFound } from './Institucional';

// Área do aluno, só layout. Login, controle de acesso e proteção dos vídeos ficam para a próxima etapa.

function Progress({ done, total }: { done: number; total: number }) {
  const pct = Math.round((done / total) * 100);
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

export function PortalHome() {
  const s = load();
  const owned = s.purchased.includes(COURSE.slug);
  const done = s.done.length;
  const next = ALL_LESSONS.find((l) => !s.done.includes(l.id)) ?? ALL_LESSONS[0];
  return (
    <div className="portal-home">
      <div className="container">
        <p className="eyebrow eyebrow--dark">Área do aluno</p>
        <h1 className="section__title">Olá, aluno</h1>
        <p className="hint">Protótipo sem login. A compra simulada no checkout libera o curso abaixo.</p>
        <div className="cards cards--2">
          <article className="card course-card">
            <div className="course-card__cover" aria-hidden="true">
              <span>{COURSE.title}</span>
            </div>
            <h2 className="card__title">{COURSE.title}</h2>
            <Progress done={done} total={ALL_LESSONS.length} />
            {owned ? (
              <Link to={`/portal/${COURSE.slug}/${next.id}`} className="btn btn--accent btn--block">
                {done ? 'Continuar de onde parei' : 'Começar o curso'}
              </Link>
            ) : (
              <>
                <Link to={`/portal/${COURSE.slug}/${next.id}`} className="btn btn--ghost btn--block">
                  Ver a área do curso (prévia)
                </Link>
                <Link to={`/checkout/${COURSE.slug}`} className="btn btn--accent btn--block">
                  Comprar o curso
                </Link>
              </>
            )}
          </article>
          <article className="card">
            <h2 className="card__title">Minhas consultorias</h2>
            {s.bookings.length ? (
              <ul className="booking-list">
                {s.bookings.map((b) => (
                  <li key={b.id}>
                    <strong>{new Date(b.start).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</strong>
                    <span>{b.topic}</span>
                    <a href={b.teams} onClick={(e) => e.preventDefault()}>
                      Entrar no Teams
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card__text">Nenhuma sessão agendada.</p>
            )}
            <Link to="/consultoria/agendar" className="btn btn--ghost btn--block">
              Agendar consultoria
            </Link>
          </article>
        </div>
      </div>
    </div>
  );
}

export function PortalAula() {
  const { slug, aula } = useParams();
  const [state, setState] = useState(load);
  if (slug !== COURSE.slug) return <NotFound />;
  const idx = Math.max(0, ALL_LESSONS.findIndex((l) => l.id === aula));
  const lesson = ALL_LESSONS[idx];
  const prev = ALL_LESSONS[idx - 1];
  const next = ALL_LESSONS[idx + 1];
  const owned = state.purchased.includes(COURSE.slug);
  const locked = !owned && idx > 0;
  const isDone = state.done.includes(lesson.id);

  const toggle = () => {
    const done = isDone ? state.done.filter((d) => d !== lesson.id) : [...state.done, lesson.id];
    save({ done });
    setState(load());
  };

  return (
    <div className="player">
      <aside className="player__nav" aria-label="Conteúdo do curso">
        <Link to="/portal" className="player__back">
          Área do aluno
        </Link>
        <h2>{COURSE.title}</h2>
        <Progress done={state.done.length} total={ALL_LESSONS.length} />
        {MODULES.map((m) => (
          <details key={m.id} open={m.id === lesson.module.id}>
            <summary>
              <span className="syllabus__code">{m.code}</span> {m.title}
            </summary>
            <ol>
              {m.lessons.map((l) => (
                <li key={l.id}>
                  <Link
                    to={`/portal/${COURSE.slug}/${l.id}`}
                    className={`${l.id === lesson.id ? 'is-current' : ''} ${state.done.includes(l.id) ? 'is-done' : ''}`}
                  >
                    {l.title}
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </aside>
      <section className="player__main">
        <p className="eyebrow eyebrow--dark">
          {lesson.module.code} · {lesson.module.title}
        </p>
        <h1 className="player__title">{lesson.title}</h1>
        <div className={`video ${locked ? 'video--locked' : ''}`}>
          {locked ? (
            <div className="video__lock">
              <p>Aula disponível para alunos inscritos.</p>
              <Link to={`/checkout/${COURSE.slug}`} className="btn btn--accent">
                Inscrever-me
              </Link>
            </div>
          ) : (
            <button className="video__play" aria-label="Reproduzir aula (protótipo)">
              <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>
        <div className="player__bar">
          {prev ? (
            <Link to={`/portal/${COURSE.slug}/${prev.id}`} className="btn btn--ghost">
              Aula anterior
            </Link>
          ) : (
            <span />
          )}
          {!locked && (
            <button className={`btn ${isDone ? 'btn--ghost' : 'btn--primary'}`} onClick={toggle}>
              {isDone ? 'Concluída' : 'Marcar como concluída'}
            </button>
          )}
          {next ? (
            <Link to={`/portal/${COURSE.slug}/${next.id}`} className="btn btn--ghost">
              Próxima aula
            </Link>
          ) : (
            <span />
          )}
        </div>
        <div className="player__tabs">
          <h2>Materiais da aula</h2>
          <ul>
            <li>Slides da aula (PDF) · a disponibilizar</li>
            {lesson.module.code === 'M7' && <li>Planilha da fronteira eficiente (Excel) · a disponibilizar</li>}
            <li>Exercícios de fixação · a disponibilizar</li>
          </ul>
          <h2>Dúvidas</h2>
          <p className="hint">Espaço para perguntas e respostas por aula, previsto para a versão com login.</p>
        </div>
      </section>
    </div>
  );
}
