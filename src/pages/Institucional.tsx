import { Link, useParams } from 'react-router-dom';
import { Cards, ContactBand, PageHero, Portrait, Section, Steps } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { POSTS } from '../content/posts';
import { brl } from '../lib/util';

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
              Mobiliários (CVM) e certificado pela ANBIMA nas certificações CEA, CFG e CGA.
            </p>
            <p>
              Desde 2014 acompanha e documenta a própria carteira, base do Método PARSIFAL. Atende pessoas e famílias de
              alto patrimônio em consultoria, dá aulas de finanças e é autor do livro <em>Educação Financeira: A Tríade
              do Capital</em>.
            </p>
            <p className="placeholder-note">Texto provisório, a validar com o Cesar.</p>
          </div>
          <Portrait caption="Foto oficial a definir" />
        </div>
      </Section>
      <Section tone="muted" eyebrow="Linha do tempo" title="Marcos">
        <Steps
          items={[
            ['Engenharia', 'Formação e carreira em engenharia, com foco em análise quantitativa.'],
            ['2014: histórico de carteira', 'Início do registro sistemático de decisões e resultados.'],
            ['2019: livro', 'Publicação de Educação Financeira: A Tríade do Capital (Editora CRV).'],
            ['Registro na CVM', 'Consultoria de valores mobiliários e certificações CEA, CFG e CGA.'],
            ['2026: segunda edição e curso online', 'Lançamento da edição revisada e da formação gravada.'],
          ]}
        />
      </Section>
      <ContactBand title="Converse sobre o seu patrimônio" text="Sessões individuais por Microsoft Teams." to="/consultoria/agendar" label="Agendar consultoria" />
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
          items={[
            { title: 'Seleção com critério', text: 'Ativos entram na carteira por critérios fundamentalistas definidos antes, não por notícia.' },
            { title: 'Preço teto', text: 'Cada compra tem um preço máximo calculado. Acima dele, espera-se.' },
            { title: 'Peso e risco', text: 'O tamanho de cada posição segue o risco do ativo e o objetivo do investidor.' },
            { title: 'Rebalanceamento', text: 'A carteira volta aos pesos-alvo em datas e gatilhos definidos.' },
            { title: 'Registro', text: 'Toda decisão é registrada com a razão, para ser revisada depois.' },
            { title: 'Longo prazo', text: 'O método foi desenhado para acumular patrimônio em décadas, não em semanas.' },
          ]}
        />
        <p className="placeholder-note">Princípios ilustrativos, a substituir pelo texto oficial do método.</p>
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
      <PageHero eyebrow="Livro" title="Educação Financeira: A Tríade do Capital" lead="A base conceitual de todo o trabalho: como renda, poupança e investimento se combinam para formar patrimônio." />
      <Section>
        <div className="split">
          <div className="book-cover" aria-hidden="true">
            <span className="book-cover__title">Educação Financeira</span>
            <span className="book-cover__sub">A Tríade do Capital</span>
            <span className="book-cover__author">Cesar Hauer Doetzer</span>
          </div>
          <div className="prose">
            <h2>Sobre o livro</h2>
            <p>
              Publicado pela Editora CRV em 2019 e relançado em edição revisada em 30/11/2026, o livro apresenta a
              tríade que sustenta a construção de patrimônio e os fundamentos do Método PARSIFAL.
            </p>
            <h3>Para quem é</h3>
            <ul>
              <li>Quem quer organizar as finanças antes de investir.</li>
              <li>Quem já investe e quer entender o porquê das decisões.</li>
              <li>Professores e educadores financeiros.</li>
            </ul>
            <a className="btn btn--primary" href="#" onClick={(e) => e.preventDefault()}>
              Comprar no site da editora
            </a>
            <p className="placeholder-note">Link da editora a definir. O contrato não permite venda pelo site.</p>
          </div>
        </div>
      </Section>
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
            <p className="card__tag">Disponível</p>
            <h3 className="card__title">{COURSE.title}</h3>
            <p className="card__text">{COURSE.subtitle}</p>
            <p className="card__meta">
              {MODULES.length} módulos · {MODULES.reduce((n, m) => n + m.lessons.length, 0)} aulas
            </p>
            <p className="card__price">
              {brl(COURSE.launchPrice)} <small>lançamento</small>
            </p>
            <Link to={`/cursos/${COURSE.slug}`} className="btn btn--accent btn--block">
              Ver o curso
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
  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com o Cesar" lead="Palestras, parcerias, imprensa e dúvidas sobre cursos." />
      <Section>
        <form className="form form--narrow" onSubmit={(e) => e.preventDefault()}>
          <label>
            Nome
            <input required />
          </label>
          <label>
            E-mail
            <input type="email" required />
          </label>
          <label>
            Assunto
            <select>
              <option>Palestra ou evento</option>
              <option>Cursos</option>
              <option>Consultoria</option>
              <option>Imprensa</option>
              <option>Outro</option>
            </select>
          </label>
          <label>
            Mensagem
            <textarea rows={5} required />
          </label>
          <label className="check">
            <input type="checkbox" required /> Concordo com o tratamento dos meus dados conforme a política de privacidade.
          </label>
          <button className="btn btn--primary">Enviar (simulado)</button>
        </form>
      </Section>
    </>
  );
}

const LEGAL: Record<string, [string, string[]]> = {
  avisos: [
    'Avisos regulatórios',
    [
      'O conteúdo de cursos, artigos, vídeos e palestras tem caráter exclusivamente educacional e não constitui oferta, solicitação ou recomendação de investimento.',
      'A recomendação personalizada é prestada apenas no serviço de consultoria de valores mobiliários, nos termos da Resolução CVM 19/2021.',
      'Rentabilidade passada não é garantia de rentabilidade futura. Investimentos envolvem riscos, inclusive de perda do capital.',
    ],
  ],
  privacidade: [
    'Política de privacidade (LGPD)',
    [
      'Coletamos apenas os dados necessários para a compra, o acesso ao curso e o agendamento das sessões.',
      'Os dados de pagamento são tratados pelo processador de pagamentos e não ficam armazenados neste site.',
      'Você pode pedir acesso, correção ou exclusão dos seus dados pelo formulário de contato.',
    ],
  ],
  termos: [
    'Termos de uso',
    [
      'O acesso ao curso é pessoal e intransferível, pelo prazo informado na página de venda.',
      'Pedidos de reembolso em até 7 dias da compra, conforme o Código de Defesa do Consumidor.',
      'Sessões de consultoria podem ser remarcadas com até 24 horas de antecedência.',
    ],
  ],
};

export function Legal() {
  const { page = '' } = useParams();
  const doc = LEGAL[page];
  if (!doc) return <NotFound />;
  return (
    <>
      <PageHero eyebrow="Legal" title={doc[0]} />
      <Section>
        <div className="prose prose--narrow">
          {doc[1].map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p className="placeholder-note">Texto-base provisório, a revisar com o jurídico.</p>
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
