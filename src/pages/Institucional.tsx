import { Link, useParams } from 'react-router-dom';
import { BookCover, Cards, ContactBand, PageHero, Portrait, Section, Steps } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { POSTS } from '../content/posts';
import { CONTATO, LIVRO } from '../content/site';

export function Sobre() {
  return (
    <>
      <PageHero
        eyebrow="Sobre"
        title="Engenharia aplicada ao patrimônio"
        lead="A formação de engenheiro trouxe o hábito de medir antes de decidir. A consultoria trouxe a responsabilidade de explicar cada decisão."
      />
      <Section>
        <div className="split">
          <div className="prose">
            <h2>Trajetória</h2>
            <p>
              Cesar Hauer Doetzer é engenheiro, consultor de valores mobiliários registrado na Comissão de Valores
              Mobiliários (CVM) e possui as certificações CEA, CFG e CGA da ANBIMA.
            </p>
            <p>
              Atua no mercado financeiro desde 2014, período em que desenvolveu e aperfeiçoou uma metodologia própria de
              análise e gestão de investimentos, que deu origem ao Método PARSIFAL. Atualmente, presta consultoria de
              investimentos para pessoas e famílias de alto patrimônio, é professor de finanças e autor do livro{' '}
              <em>Educação Financeira: A Tríade do Capital</em>.
            </p>
          </div>
          <Portrait caption="Cesar Hauer Doetzer" />
        </div>
      </Section>
      <Section tone="muted" eyebrow="Linha do tempo" title="Marcos">
        <Steps
          items={[
            ['Engenharia', 'Formação e carreira em engenharia, com foco em análise quantitativa.'],
            ['2012: início das operações no mercado financeiro', 'Primeiras operações, base da metodologia que deu origem ao Método PARSIFAL.'],
            ['2019: livro', `Publicação de ${LIVRO.titulo} (${LIVRO.editora}).`],
            ['Registro na CVM', 'Consultoria de valores mobiliários e certificações CEA, CFG e CGA.'],
            ['2026: edição revisada e curso online', `Lançamento da edição revisada do livro em ${LIVRO.lancamento} e preparação da formação gravada.`],
          ]}
        />
      </Section>
      <ContactBand title="Converse sobre o seu patrimônio" text="Consultoria individual, por videoconferência, com recomendação para o seu caso." to="/consultoria" label="Conhecer a consultoria" />
    </>
  );
}

export function Metodo() {
  return (
    <div className="tema-percival">
      <section className="percival-hero" aria-labelledby="percival-titulo">
        <img
          className="percival-hero__quadro"
          src={`${import.meta.env.BASE_URL}metodo/percival-hacker-1894.webp`}
          alt="Pintura de Arthur Hacker: o cavaleiro Percival, de armadura, segura o cálice enquanto uma mulher o observa, num bosque de outono."
          width={2000}
          height={1125}
        />
        <div className="container percival-hero__texto">
          <p className="eyebrow">Método PARSIFAL</p>
          <h1 id="percival-titulo" className="page-hero__title">
            Regras explícitas para decisões de investimento
          </h1>
          <p className="page-hero__lead">
            Um método proprietário que organiza seleção, dimensionamento e rebalanceamento, para que cada decisão possa
            ser explicada e revisada.
          </p>
        </div>
        <p className="percival-hero__credito">
          Arthur Hacker, <em>The Temptation of Sir Percival</em>, 1894. Leeds Art Gallery. Domínio público.
        </p>
      </section>
      <Section eyebrow="Princípios" title="Como o método funciona">
        <Cards
          cols={3}
          items={[
            {
              title: 'Diversificação sem fronteiras',
              text: 'A carteira busca oportunidades em diferentes mercados, moedas e classes de ativos, reduzindo a dependência de um único país ou cenário econômico.',
            },
            {
              title: 'Ativos que se equilibram',
              text: 'A combinação prioriza ativos com comportamentos distintos e correlações baixas ou negativas, buscando maior equilíbrio e resiliência nos diferentes ciclos de mercado.',
            },
            {
              title: 'Alocação com método',
              text: 'Cada classe de ativo possui um percentual de alocação definido. Isso traz disciplina às decisões e evita que movimentos de curto prazo desviem a carteira da estratégia.',
            },
          ]}
        />
      </Section>
      <Section tone="dark" eyebrow="Para quem é" title="Onde o método se aplica">
        <Cards
          cols={3}
          items={[
            { title: 'Quem está começando', text: 'Aprende o método no curso e aplica com segurança.' },
            { title: 'Quem já investe', text: 'Organiza a carteira e para de decidir por impulso.' },
            { title: 'Patrimônio maior', text: 'Recebe aplicação personalizada na consultoria.' },
          ]}
        />
        <p className="disclaimer">Resultados históricos do estudo apresentado no livro não são garantia de resultados futuros.</p>
      </Section>
    </div>
  );
}

export function Livro() {
  return (
    <>
      <PageHero eyebrow="Livro" title={LIVRO.titulo} lead="A base conceitual de todo o trabalho: como renda, poupança e investimento se combinam para formar patrimônio." />
      <Section>
        <div className="split">
          <BookCover />
          <div className="prose">
            <h2>Sobre o livro</h2>
            <p>
              Publicado pela {LIVRO.editora} em {LIVRO.primeiraEdicao} e relançado em edição revisada em {LIVRO.lancamento}, o
              livro apresenta a tríade que sustenta a construção de patrimônio e os fundamentos do Método PARSIFAL.
            </p>
            <h3>Para quem é</h3>
            <ul>
              <li>Investidores iniciantes.</li>
              <li>Quem já investe, mas quer melhorar a estratégia e os conhecimentos sobre os produtos.</li>
              <li>Pessoas que estão pensando em como podem começar a investir.</li>
            </ul>
            {LIVRO.linkEditora ? (
              <a className="btn btn--primary" href={LIVRO.linkEditora} target="_blank" rel="noopener noreferrer">
                Comprar no site da editora
              </a>
            ) : (
              <div className="em-breve" role="note">
                <p className="em-breve__titulo">Link de compra em breve</p>
                <p>
                  O livro é vendido pela {LIVRO.editora}. O endereço de compra será publicado aqui assim que a editora o
                  disponibilizar. Enquanto isso, quer ser avisado?{' '}
                  <Link to="/lista-de-espera">Entre na lista de espera</Link>.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
      <ContactBand
        title="Quer levar o método do livro para a prática?"
        text="Turma presencial em Curitiba, curso online e curso básico. Entre na lista de espera e receba as datas primeiro."
        to="/lista-de-espera"
        label="Entrar na lista de espera"
      />
    </>
  );
}

export function Palestras() {
  return (
    <>
      <PageHero eyebrow="Palestras e eventos" title="Educação financeira que muda decisões" lead="Palestras, workshops e aulas abertas para empresas, eventos e instituições de ensino." />
      <Section
        eyebrow="Temas"
        title="Palestras em preparação"
        lead="Três temas para começar. Entre na lista de espera para saber das próximas datas ou peça uma proposta para o seu evento."
      >
        <Cards
          items={[
            { tag: 'Em preparação', title: 'A Tríade do Capital', text: 'Renda, poupança e investimento: como os três se combinam ao longo da vida.' },
            { tag: 'Em preparação', title: 'Investir com método', text: 'Por que regras explícitas vencem o palpite, com os princípios do Método PARSIFAL.' },
            { tag: 'Em preparação · empresas', title: 'Educação financeira para colaboradores', text: 'Palestra para empresas e RH, com material de apoio.' },
          ]}
        />
        <div className="hero__actions">
          <Link to="/lista-de-espera" className="btn btn--accent">
            Entrar na lista de espera
          </Link>
          <Link to="/contato" className="btn btn--ghost">
            Pedir proposta
          </Link>
        </div>
      </Section>
      <Section tone="muted" eyebrow="Como contratar" title="Do pedido ao evento">
        <Steps
          items={[
            ['Pedido', 'Conte o público, a data e o formato pelo formulário de contato.'],
            ['Proposta', 'Você recebe a proposta com tema, duração e investimento.'],
            ['Preparação', 'Alinhamento do conteúdo com o seu público.'],
            ['Evento', 'Palestra presencial ou online, com material de apoio.'],
          ]}
        />
      </Section>
      <ContactBand title="Leve a palestra para o seu evento" text="Resposta em até dois dias úteis." to="/contato" label="Pedir proposta" />
    </>
  );
}

export function Cursos() {
  return (
    <>
      <PageHero
        eyebrow="Cursos"
        title="Aprenda com quem pratica"
        lead="Turma presencial em Curitiba, curso online e curso básico, com o mesmo método. Entre na lista de espera e receba as datas primeiro."
      />
      <Section>
        <div className="cards cards--3">
          <article className="card card--feature">
            <p className="card__tag">{COURSE.formato} · lista de espera aberta</p>
            <h3 className="card__title">{COURSE.title}</h3>
            <p className="card__text">{COURSE.subtitle}</p>
            <p className="card__meta">{MODULES.length} módulos</p>
            <Link to={`/cursos/${COURSE.slug}`} className="btn btn--accent btn--block">
              Ver o programa
            </Link>
            <Link to="/lista-de-espera" className="btn btn--ghost btn--block">
              Quero participar da próxima turma
            </Link>
          </article>
          <article className="card">
            <p className="card__tag">Em produção · lista de espera aberta</p>
            <h3 className="card__title">Curso online</h3>
            <p className="card__text">Curso gravado, no seu ritmo, pela área do aluno, com as aulas mais recentes do Cesar.</p>
            <Link to="/lista-de-espera" className="btn btn--ghost btn--block">
              Entrar na lista de espera
            </Link>
          </article>
          <article className="card">
            <p className="card__tag">Em breve · lista de espera aberta</p>
            <h3 className="card__title">Curso básico de investimentos</h3>
            <p className="card__text">
              Cerca de 4 horas para quem quer começar: organizar as finanças, entender os produtos e dar o primeiro passo.
            </p>
            <Link to="/lista-de-espera" className="btn btn--ghost btn--block">
              Entrar na lista de espera
            </Link>
          </article>
        </div>
      </Section>
    </>
  );
}

export function Blog() {
  return (
    <>
      <PageHero eyebrow="Artigos" title="Conteúdo para decidir melhor" lead="Textos curtos sobre fundamentos, carteira e comportamento do investidor." />
      <Section>
        <div className="cards cards--3">
          {POSTS.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="card card--link">
              <p className="card__tag">
                {p.topic} · {p.date}
              </p>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__text">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

export function Post() {
  const { slug } = useParams();
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return <NotFound />;
  return (
    <>
      <PageHero eyebrow={`${p.topic} · ${p.date}`} title={p.title} lead={p.excerpt} />
      <Section>
        <article className="prose prose--narrow">
          {p.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p className="disclaimer">Conteúdo educacional. Não constitui recomendação de investimento.</p>
          <Link to="/blog">Voltar aos artigos</Link>
        </article>
      </Section>
    </>
  );
}

export function Contato() {
  const canais = [
    CONTATO.email && (
      <li key="email">
        E-mail: <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
      </li>
    ),
    CONTATO.linkedin && (
      <li key="linkedin">
        <a href={CONTATO.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </li>
    ),
    CONTATO.instagram && (
      <li key="instagram">
        <a href={CONTATO.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </li>
    ),
  ].filter(Boolean);
  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com o Cesar" lead="Palestras, consultoria, imprensa e dúvidas sobre o livro e os cursos." />
      <Section>
        <div className="split">
          <div className="prose">
            <h2>Canais</h2>
            {canais.length ? (
              <ul>{canais}</ul>
            ) : (
              <div className="em-breve" role="note">
                <p className="em-breve__titulo">Canais de contato em breve</p>
                <p>Os canais de atendimento serão publicados aqui nos próximos dias.</p>
              </div>
            )}
            <p className="disclaimer">
              Ao escrever, você concorda com o tratamento dos dados enviados conforme a{' '}
              <Link to="/privacidade">política de privacidade</Link>. Resposta em até dois dias úteis.
            </p>
          </div>
          <div className="prose">
            <h2>Cursos e palestras</h2>
            <p>
              Para ser avisado das próximas turmas, do curso online e das palestras, use a{' '}
              <Link to="/lista-de-espera">lista de espera</Link>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

export function NotFound() {
  return (
    <PageHero eyebrow="Página não encontrada" title="Este endereço não existe">
      <Link to="/" className="btn btn--accent">
        Voltar ao início
      </Link>
    </PageHero>
  );
}
