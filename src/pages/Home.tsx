import { Link } from 'react-router-dom';
import { BookCover, Cards, ContactBand, Faq, Portrait, Section } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { POSTS } from '../content/posts';
import { LIVRO } from '../content/site';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Consultor CVM · Professor · Palestrante · Autor</p>
            <h1 className="hero__title">Investir com método, não com palpite.</h1>
            <p className="hero__lead">
              Engenheiro, consultor de valores mobiliários registrado na CVM e autor de <em>{LIVRO.titulo}</em>. Há mais
              de uma década ajudo pessoas e famílias a construir patrimônio com rigor técnico e disciplina.
            </p>
            <div className="hero__actions">
              <Link to="/livro" className="btn btn--accent btn--lg">
                Conhecer o livro
              </Link>
              <Link to="/lista-de-espera" className="btn btn--ghost btn--lg">
                Lista de espera dos cursos
              </Link>
            </div>
          </div>
          <Portrait caption="Cesar Hauer Doetzer, CEA · CFG · CGA" />
        </div>
      </section>

      <section className="creds" aria-label="Credenciais">
        <div className="container creds__inner">
          {['Consultor registrado na CVM', 'CEA · ANBIMA', 'CFG · ANBIMA', 'CGA · ANBIMA', 'Engenheiro', 'Autor publicado'].map(
            (c) => (
              <span key={c} className="creds__item">
                {c}
              </span>
            ),
          )}
        </div>
      </section>

      <Section eyebrow="Lançamento" title={LIVRO.titulo} lead={`Edição revisada, lançada em ${LIVRO.lancamento}.`}>
        <div className="split split--even">
          <div className="book-teaser">
            <p className="prose-lead">
              A base conceitual de todo o trabalho: como renda, poupança e investimento se combinam para formar
              patrimônio, e os fundamentos do Método PARSIFAL.
            </p>
            <Link to="/livro" className="btn btn--primary">
              Ver o livro
            </Link>
          </div>
          <BookCover />
        </div>
      </Section>

      <Section tone="muted" eyebrow="Como posso ajudar" title="Quatro caminhos, um mesmo método">
        <Cards
          cols={4}
          items={[
            { tag: 'Ler', title: 'Livro', text: `${LIVRO.titulo}, a base conceitual do método.` },
            { tag: 'Aprender', title: 'Cursos', text: 'Turma presencial em Curitiba, curso online e curso básico, do sistema financeiro à montagem de carteira.' },
            { tag: 'Decidir', title: 'Consultoria', text: 'Sessões individuais por videoconferência para analisar o seu caso com recomendação personalizada.' },
            { tag: 'Inspirar', title: 'Palestras', text: 'Educação financeira para empresas, eventos e instituições de ensino.' },
          ]}
        />
      </Section>

      <Section
        eyebrow={`Curso ${COURSE.formato.toLowerCase()}`}
        title={COURSE.title}
        lead="Um curso raro no mercado: leva o aluno até as ferramentas profissionais de carteira e valuation, com exercícios e estudos de caso."
      >
        <div className="split">
          <ul className="module-list">
            {MODULES.filter((m) => m.code !== 'M99').map((m) => (
              <li key={m.id}>
                <span className="module-list__code">{m.code}</span>
                <span>{m.title}</span>
              </li>
            ))}
          </ul>
          <aside className="offer">
            <p className="offer__label">Próxima turma em breve</p>
            <p className="offer__note">
              Quem está na lista de espera recebe primeiro a data da turma em Curitiba e o aviso do curso online.
            </p>
            <Link to="/lista-de-espera" className="btn btn--accent btn--block">
              Entrar na lista de espera
            </Link>
            <Link to={`/cursos/${COURSE.slug}`} className="btn btn--ghost btn--block">
              Ver o programa completo
            </Link>
          </aside>
        </div>
      </Section>

      <Section tone="dark" eyebrow="Método PARSIFAL" title="O que diferencia o trabalho">
        <div className="split split--even">
          <p className="prose-lead">
            O Método PARSIFAL organiza a seleção de ativos, o dimensionamento das posições e o rebalanceamento em regras
            explícitas. É o que sustenta os cursos, a mentoria e a consultoria, e é o que permite explicar cada decisão.
          </p>
          <div>
            <Link to="/metodo" className="btn btn--accent">
              Conhecer o método
            </Link>
          </div>
        </div>
      </Section>

      <Section eyebrow="Artigos" title="Conteúdo recente">
        <div className="cards cards--3">
          {POSTS.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="card card--link">
              <p className="card__tag">{p.topic}</p>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__text">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="muted" eyebrow="Dúvidas" title="Perguntas frequentes">
        <Faq
          items={[
            ['Os cursos servem para quem está começando?', 'Sim. O curso básico é para quem quer começar; a Formação parte do sistema financeiro e avança até gestão de carteiras e valuation.'],
            ['Quando abrem as inscrições?', 'Em breve. As datas são anunciadas primeiro para quem está na lista de espera.'],
            ['A consultoria é individual?', 'Sim. Cada sessão é individual, por videoconferência, após a análise do seu perfil.'],
            ['O conteúdo é recomendação de investimento?', 'Não. Cursos, artigos e palestras são educacionais. Recomendação personalizada só na consultoria, nos termos da CVM.'],
          ]}
        />
      </Section>

      <ContactBand
        title="Quer ser avisado das próximas turmas?"
        text="Entre na lista de espera e receba as datas dos cursos e das palestras antes de todo mundo."
        to="/lista-de-espera"
        label="Entrar na lista de espera"
      />
    </>
  );
}
