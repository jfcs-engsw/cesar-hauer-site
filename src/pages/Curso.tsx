import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cards, Faq, PageHero, Section, Stats } from '../components/Blocks';
import { COURSE, MODULES } from '../content/curso';
import { brl, load, save } from '../lib/util';
import { NotFound } from './Institucional';

const TOTAL = MODULES.reduce((n, m) => n + m.lessons.length, 0);

export function CursoVenda() {
  const { slug } = useParams();
  if (slug !== COURSE.slug) return <NotFound />;
  return (
    <>
      <PageHero eyebrow="Curso online" title={COURSE.title} lead={COURSE.subtitle}>
        <div className="hero__actions">
          <Link to={`/checkout/${COURSE.slug}`} className="btn btn--accent btn--lg">
            Inscrever-me por {brl(COURSE.launchPrice)}
          </Link>
          <button
            className="btn btn--outline-light btn--lg"
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
            { value: '12 meses', label: 'de acesso' },
            { value: '7 dias', label: 'de garantia' },
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

      <Section tone="muted" eyebrow="Investimento" title="Escolha como pagar">
        <div className="pricing">
          <div className="pricing__card pricing__card--main">
            <p className="card__tag">Lançamento</p>
            <p className="offer__price">{brl(COURSE.launchPrice)}</p>
            <p className="offer__note">à vista no PIX ou em até 12x no cartão</p>
            <Link to={`/checkout/${COURSE.slug}`} className="btn btn--accent btn--block">
              Garantir a vaga
            </Link>
          </div>
          <div className="pricing__card">
            <p className="card__tag">Depois do lançamento</p>
            <p className="offer__price offer__price--muted">{brl(COURSE.fullPrice)}</p>
            <p className="offer__note">
              ou {COURSE.installments}x de {brl(COURSE.installmentValue)}
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Dúvidas" title="Perguntas frequentes">
        <Faq
          items={[
            ['Preciso saber matemática?', 'Não além do ensino médio. O módulo 2 constrói a base com exercícios resolvidos.'],
            ['Tem certificado?', 'Sim, emitido ao concluir todas as aulas (a confirmar).'],
            ['E se eu não gostar?', 'Você tem 7 dias para pedir o reembolso integral.'],
            ['O curso recomenda ativos?', 'Não. Os exemplos são didáticos. Recomendação personalizada só na consultoria.'],
          ]}
        />
      </Section>
    </>
  );
}

export function Checkout() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [inst, setInst] = useState(1);
  const [step, setStep] = useState<'form' | 'pix'>('form');
  if (slug !== COURSE.slug) return <NotFound />;
  const price = COURSE.launchPrice;

  const approve = () => {
    const s = load();
    save({ purchased: Array.from(new Set([...s.purchased, COURSE.slug])) });
    nav('/checkout/sucesso');
  };

  return (
    <section className="section">
      <div className="container checkout">
        <div>
          <p className="eyebrow eyebrow--dark">Checkout seguro</p>
          <h1 className="section__title">Finalize a sua inscrição</h1>
          {step === 'form' ? (
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (method === 'pix') setStep('pix');
                else approve();
              }}
            >
              <fieldset>
                <legend>Seus dados</legend>
                <label>
                  Nome completo
                  <input required autoComplete="name" />
                </label>
                <div className="form__row">
                  <label>
                    E-mail
                    <input type="email" required autoComplete="email" />
                  </label>
                  <label>
                    CPF
                    <input required inputMode="numeric" placeholder="000.000.000-00" />
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Forma de pagamento</legend>
                <div className="seg" role="radiogroup">
                  <button type="button" role="radio" aria-checked={method === 'pix'} className={method === 'pix' ? 'is-on' : ''} onClick={() => setMethod('pix')}>
                    PIX
                  </button>
                  <button type="button" role="radio" aria-checked={method === 'card'} className={method === 'card' ? 'is-on' : ''} onClick={() => setMethod('card')}>
                    Cartão de crédito
                  </button>
                </div>
                {method === 'card' && (
                  <>
                    <label>
                      Número do cartão
                      <input required inputMode="numeric" placeholder="0000 0000 0000 0000" />
                    </label>
                    <div className="form__row">
                      <label>
                        Validade
                        <input required placeholder="MM/AA" />
                      </label>
                      <label>
                        CVV
                        <input required inputMode="numeric" placeholder="123" />
                      </label>
                    </div>
                    <label>
                      Parcelas
                      <select value={inst} onChange={(e) => setInst(Number(e.target.value))}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}x de {brl(Math.round((price / n) * 100) / 100)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
                {method === 'pix' && <p className="hint">O QR Code aparece no próximo passo e vale por 30 minutos.</p>}
              </fieldset>
              <label className="check">
                <input type="checkbox" required /> Li e aceito os <Link to="/legal/termos">termos de uso</Link> e a{' '}
                <Link to="/legal/privacidade">política de privacidade</Link>.
              </label>
              <button className="btn btn--accent btn--lg btn--block">{method === 'pix' ? 'Gerar PIX' : `Pagar ${brl(price)}`}</button>
              <p className="hint">Protótipo: nenhum dado é enviado e nenhuma cobrança é feita.</p>
            </form>
          ) : (
            <div className="pix">
              <QrPlaceholder />
              <p>Escaneie o QR Code no app do seu banco ou use o código copia e cola.</p>
              <code className="pix__code">00020126580014BR.GOV.BCB.PIX0136exemplo-prototipo...</code>
              <button className="btn btn--accent btn--block" onClick={approve}>
                Simular pagamento confirmado
              </button>
            </div>
          )}
        </div>
        <aside className="summary">
          <h2>Resumo do pedido</h2>
          <p className="summary__item">
            <span>{COURSE.title}</span>
            <span>{brl(price)}</span>
          </p>
          <p className="summary__strike">
            <span>Preço cheio</span>
            <s>{brl(COURSE.fullPrice)}</s>
          </p>
          <p className="summary__total">
            <span>Total</span>
            <span>{brl(price)}</span>
          </p>
          <ul className="summary__list">
            <li>{TOTAL} aulas em {MODULES.length} módulos</li>
            <li>12 meses de acesso</li>
            <li>Garantia de 7 dias</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

export function QrPlaceholder() {
  // Padrão visual de QR, só ilustrativo.
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21;
    const y = Math.floor(i / 21);
    const origin = [[0, 0], [14, 0], [0, 14]].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
    if (origin) {
      const lx = x - origin[0];
      const ly = y - origin[1];
      return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
    }
    return (x * 7 + y * 13 + x * y) % 3 === 0;
  });
  return (
    <svg className="qr" viewBox="0 0 21 21" role="img" aria-label="QR Code ilustrativo">
      <rect width="21" height="21" fill="#fff" />
      {cells.map((on, i) => (on ? <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" /> : null))}
    </svg>
  );
}

export function Sucesso() {
  return (
    <PageHero eyebrow="Pagamento confirmado" title="Bem-vindo à Formação de Investidores" lead="Enviamos o acesso para o seu e-mail. Você já pode começar pela primeira aula.">
      <div className="hero__actions">
        <Link to={`/portal/${COURSE.slug}`} className="btn btn--accent btn--lg">
          Ir para a área do aluno
        </Link>
      </div>
    </PageHero>
  );
}
