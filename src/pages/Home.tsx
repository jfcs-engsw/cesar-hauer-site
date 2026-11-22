import { Link } from 'react-router-dom';
import { Cards, ContactBand, Faq, Portrait, Section, Stats } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { POSTS } from '../content/posts';
import { brl } from '../lib/util';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Consultor CVM · Professor · Palestrante · Autor</p>
            <h1 className="hero__title">Investir com método, não com palpite.</h1>
            <p className="hero__lead">
              Engenheiro, consultor de valores mobiliários registrado na CVM e autor de <em>Educação Financeira: A Tríade
              do Capital</em>. Há mais de uma década ajudo pessoas e famílias a construir patrimônio com rigor técnico e
              disciplina.
            </p>
            <div className="hero__actions">
              <Link to="/cursos/formacao-de-investidores" className="btn btn--accent btn--lg">
                Conhecer o curso
              </Link>
              <Link to="/consultoria/agendar" className="btn btn--ghost btn--lg">
                Agendar uma consultoria
              </Link>
            </div>
          </div>
          <Portrait caption="Cesar Hauer, CEA · CFG · CGA" />
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

      <Section eyebrow="Autoridade" title="Experiência que se mede">
        <Stats
          items={[
            { value: '10+', label: 'anos de histórico de carteira documentado' },
            { value: 'R$ 50 mi', label: 'sob consultoria' },
            { value: '59', label: 'aulas no curso Formação de Investidores' },
            { value: '2019', label: 'primeira edição do livro' },
          ]}
          source="Fonte: perfil profissional público e histórico 2014-2024. Valores a confirmar com o Cesar antes da publicação."
        />
      </Section>

      <Section tone="muted" eyebrow="Como posso ajudar" title="Quatro caminhos, um mesmo método">
        <Cards
          cols={4}
          items={[
            { tag: 'Aprender', title: 'Cursos gravados', text: 'Formação completa, do sistema financeiro à montagem de carteira, no seu ritmo.' },
            { tag: 'Decidir', title: 'Consultoria', text: 'Sessões individuais por videoconferência para analisar o seu caso com recomendação personalizada.' },
            { tag: 'Inspirar', title: 'Palestras', text: 'Educação financeira para empresas, eventos e instituições de ensino.' },
            { tag: 'Ler', title: 'Livro', text: 'Educação Financeira: A Tríade do Capital, a base conceitual do método.' },
          ]}
        />
      </Section>

      <Section
        eyebrow="Curso âncora"
        title={COURSE.title}
        lead="Um curso raro no mercado: leva o aluno até as ferramentas profissionais de carteira e valuation, com exercícios e estudos de caso."
      >
        <div className="split">
          <ul className="module-list">
            {MODULES.filter((m) => m.code !== 'M99').map((m) => (
              <li key={m.id}>
                <span className="module-list__code">{m.code}</span>
                <span>{m.title}</span>
                <span className="module-list__count">{m.lessons.length} {m.lessons.length > 1 ? 'aulas' : 'aula'}</span>
              </li>
            ))}
          </ul>
          <aside className="offer">
            <p className="offer__label">Preço de lançamento</p>
            <p className="offer__price">{brl(COURSE.launchPrice)}</p>
            <p className="offer__note">
              ou {COURSE.installments}x de {brl(COURSE.installmentValue)} no preço cheio de {brl(COURSE.fullPrice)}
            </p>
            <Link to="/checkout/formacao-de-investidores" className="btn btn--accent btn--block">
              Quero me inscrever
            </Link>
            <Link to="/cursos/formacao-de-investidores" className="btn btn--ghost btn--block">
              Ver o programa completo
            </Link>
          </aside>
        </div>
      </Section>

      <Section tone="muted" eyebrow="Método PARSIFAL" title="O que diferencia o trabalho">
        <div className="split split--even">
          <p className="prose-lead">
            O Método PARSIFAL organiza a seleção de ativos, o dimensionamento das posições e o rebalanceamento em regras
            explícitas. É o que sustenta os cursos, a mentoria e a consultoria, e é o que permite explicar cada decisão.
          </p>
          <div>
            <Link to="/metodo" className="btn btn--primary">
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
            ['O curso serve para quem está começando?', 'Sim. Ele parte do sistema financeiro e da matemática financeira e avança até gestão de carteiras e valuation.'],
            ['Por quanto tempo tenho acesso?', 'Acesso por 12 meses, com todas as atualizações publicadas no período (a confirmar).'],
            ['A consultoria é individual?', 'Sim. Cada sessão é individual, por Microsoft Teams, com 60 minutos e agenda escolhida por você.'],
            ['O conteúdo é recomendação de investimento?', 'Não. Cursos, artigos e palestras são educacionais. Recomendação personalizada só na consultoria, nos termos da CVM.'],
          ]}
        />
      </Section>

      <ContactBand
        title="Quer olhar o seu caso com quem faz isso todos os dias?"
        text="Escolha um horário livre na agenda, faça o pagamento e receba o link da reunião."
        to="/consultoria/agendar"
        label="Ver horários disponíveis"
      />
    </>
  );
}
