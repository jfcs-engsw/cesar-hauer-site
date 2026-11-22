import { Link, useParams } from 'react-router-dom';
import { Cards, Faq, PageHero, Section, Stats } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { NotFound } from './Institucional';
import { FormularioListaDeEspera } from './ListaDeEspera';

const TOTAL = MODULES.reduce((n, m) => n + m.lessons.length, 0);

// Página do curso antes da abertura: programa real e lista de espera. Preço, checkout e matrícula entram
// com a abertura das inscrições, depois da decisão de dezembro.
export function CursoEmBreve() {
  const { slug } = useParams();
  if (slug !== COURSE.slug) return <NotFound />;
  return (
    <>
      <PageHero eyebrow="Curso online · Em breve" title={COURSE.title} lead={COURSE.subtitle}>
        <div className="hero__actions">
          <Link to="/lista-de-espera" className="btn btn--accent btn--lg">
            Entrar na lista de espera
          </Link>
          <button
            className="btn btn--ghost btn--lg"
            onClick={() => document.getElementById('programa')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver o programa
          </button>
        </div>
      </PageHero>

      <Section>
        <Stats
          items={[
            { value: String(MODULES.length), label: 'módulos' },
            { value: String(TOTAL), label: 'aulas gravadas' },
            { value: 'Online', label: 'no seu ritmo, pela área do aluno' },
            { value: 'Em breve', label: 'abertura das inscrições' },
          ]}
        />
      </Section>

      <Section tone="muted" eyebrow="Resultado" title="O que você vai saber fazer">
        <Cards
          items={[
            { title: 'Entender o sistema', text: 'Como Selic, CDI, inflação e os participantes do mercado afetam cada investimento.' },
            { title: 'Fazer as contas', text: 'Juros, VPL, TIR e cotização, com HP12c e oito blocos de exercícios.' },
            { title: 'Ler uma empresa', text: 'Balanço, DRE e notas explicativas para avaliar ações com fundamento.' },
            { title: 'Medir risco', text: 'Beta, Markowitz, fronteira eficiente, Sharpe, Treynor e VaR.' },
            { title: 'Avaliar ativos', text: 'Valuation de renda fixa, ações e FII, com dois estudos de caso reais.' },
            { title: 'Montar a carteira', text: 'Três carteiras completas montadas do zero, aplicando tudo junto.' },
          ]}
        />
      </Section>

      <Section id="programa" eyebrow="Programa" title="Módulos e aulas">
        <div className="syllabus">
          {MODULES.map((m, i) => (
            <details key={m.id} className="syllabus__mod" open={i === 0}>
              <summary>
                <span className="syllabus__code">{m.code}</span>
                <span className="syllabus__title">
                  {m.title}
                  <small>{m.summary}</small>
                </span>
                <span className="syllabus__count">{m.lessons.length}</span>
              </summary>
              <ol>
                {m.lessons.map((l) => (
                  <li key={l.id}>{l.title}</li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="dark" eyebrow="Lista de espera" title="Receba a data de abertura antes de todo mundo">
        <div className="split">
          <p className="prose-lead">
            As inscrições abrem em breve. Quem está na lista recebe primeiro a data, as condições de lançamento e conteúdo
            de preparação.
          </p>
          <FormularioListaDeEspera compacto />
        </div>
      </Section>

      <Section eyebrow="Dúvidas" title="Perguntas frequentes">
        <Faq
          items={[
            ['Preciso saber matemática?', 'Não além do ensino médio. O módulo 2 constrói a base com exercícios resolvidos.'],
            ['Quando as inscrições abrem?', 'A data será anunciada primeiro para quem está na lista de espera.'],
            ['O curso recomenda ativos?', 'Não. Os exemplos são didáticos. Recomendação personalizada só na consultoria.'],
            ['Como vou assistir às aulas?', 'Pela área do aluno deste site, com login por e-mail, no computador ou no celular.'],
          ]}
        />
      </Section>
    </>
  );
}
