import { Link, useParams } from 'react-router-dom';
import { Cards, Faq, PageHero, Section, Stats } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { NotFound } from './Institucional';
import { FormularioListaDeEspera } from './ListaDeEspera';

// Formação de Investidores como turma presencial em Curitiba (pedido do CHD de 25/11/2026): programa real e
// inscrição pela lista de espera. Preço e matrícula entram com a abertura da turma.
export function CursoEmBreve() {
  const { slug } = useParams();
  if (slug !== COURSE.slug) return <NotFound />;
  return (
    <>
      <PageHero eyebrow={`${COURSE.formato} · Próxima turma`} title={COURSE.title} lead={COURSE.subtitle}>
        <div className="hero__actions">
          <Link to="/lista-de-espera" className="btn btn--accent btn--lg">
            Quero participar da próxima turma
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
            { value: 'Presencial', label: 'em Curitiba, com o Cesar em sala' },
            { value: 'Exercícios', label: 'e estudos de caso em aula' },
            { value: 'Em breve', label: 'data da próxima turma' },
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

      <Section id="programa" eyebrow="Programa" title="Módulos e temas">
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

      <Section tone="dark" eyebrow="Lista de espera" title="Receba a data da próxima turma antes de todo mundo">
        <div className="split">
          <p className="prose-lead">
            A próxima turma presencial em Curitiba será anunciada primeiro para quem está na lista, com a data, o local e
            as condições de inscrição.
          </p>
          <FormularioListaDeEspera compacto />
        </div>
      </Section>

      <Section eyebrow="Dúvidas" title="Perguntas frequentes">
        <Faq
          items={[
            ['Preciso saber matemática?', 'Não além do ensino médio. O módulo 2 constrói a base com exercícios resolvidos.'],
            ['Quando é a próxima turma?', 'A data será anunciada primeiro para quem está na lista de espera.'],
            ['O curso recomenda ativos?', 'Não. Os exemplos são didáticos. Recomendação personalizada só na consultoria.'],
            ['Moro fora de Curitiba. Há opção online?', 'Sim: o curso online está em produção. Entre na lista de espera para ser avisado.'],
          ]}
        />
      </Section>
    </>
  );
}
