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
    <>
      <PageHero
        eyebrow="Método PARSIFAL"
        title="Regras explícitas para decisões de investimento"
        lead="Um método proprietário que organiza seleção, dimensionamento e rebalanceamento, para que cada decisão possa ser explicada e revisada."
      />
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
      <Section tone="muted" eyebrow="Para quem é" title="Onde o método se aplica">
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
    </>
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
        text="O curso Formação de Investidores abre em breve. Entre na lista de espera e receba a data primeiro."
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
      <Section eyebrow="Temas" title="Palestras mais pedidas">
        <Cards
          items={[
            { tag: '60 min', title: 'A Tríade do Capital', text: 'Renda, poupança e investimento: como os três se combinam ao longo da vida.' },
            { tag: '90 min', title: 'Investir com método', text: 'Por que regras explícitas vencem o palpite, com exemplos reais de carteira.' },
            { tag: 'Workshop 3 h', title: 'Montando a primeira carteira', text: 'Atividade prática com planilha, do perfil ao rebalanceamento.' },
            { tag: '60 min', title: 'Finanças comportamentais', text: 'Os vieses que mais custam dinheiro e como evitá-los.' },
            { tag: 'Empresas', title: 'Educação financeira para colaboradores', text: 'Programa para RH, com palestra e material de apoio.' },
            { tag: 'Ensino', title: 'Aula aberta para universidades', text: 'Matemática financeira aplicada para cursos de engenharia e gestão.' },
          ]}
        />
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
      <PageHero eyebrow="Cursos" title="Aprenda no seu ritmo, com quem pratica" lead="Cursos gravados, com acesso pela área do aluno, exercícios e material de apoio." />
      <Section>
        <div className="cards cards--3">
          <article className="card card--feature">
            <p className="card__tag">Em breve · lista de espera aberta</p>
            <h3 className="card__title">{COURSE.title}</h3>
            <p className="card__text">{COURSE.subtitle}</p>
            <p className="card__meta">
              {MODULES.length} módulos · {MODULES.reduce((n, m) => n + m.lessons.length, 0)} aulas
            </p>
            <Link to={`/cursos/${COURSE.slug}`} className="btn btn--accent btn--block">
              Ver o programa
            </Link>
            <Link to="/lista-de-espera" className="btn btn--ghost btn--block">
              Entrar na lista de espera
            </Link>
          </article>
          <article className="card card--soon">
            <p className="card__tag">Em breve</p>
            <h3 className="card__title">Do zero ao primeiro investimento</h3>
            <p className="card__text">Organizar as contas, abrir a corretora e fazer a primeira aplicação com segurança.</p>
          </article>
          <article className="card card--soon">
            <p className="card__tag">Em breve</p>
            <h3 className="card__title">Método PARSIFAL na prática</h3>
            <p className="card__text">Montagem e rebalanceamento de carteira aplicando o método passo a passo.</p>
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
            <h2>Curso online</h2>
            <p>
              Para ser avisado da abertura do curso {COURSE.title}, use a <Link to="/lista-de-espera">lista de espera</Link>.
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
