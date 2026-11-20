import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cards, ContactBand, Faq, PageHero, Section, Steps } from '../components/Blocks';
import { SESSION, fmtDay, fmtTime, icsFile, lastBookableDay, slotsFor } from '../lib/agenda';
import { brl, load, save, type Booking } from '../lib/util';
import { QrPlaceholder } from './Curso';

export function Consultoria() {
  return (
    <>
      <PageHero
        eyebrow="Consultoria de valores mobiliários"
        title="Uma análise do seu patrimônio, com recomendação para o seu caso"
        lead="Consultor registrado na CVM. Sessões individuais por Microsoft Teams, contratadas por hora, com agenda aberta para você escolher o horário."
      >
        <div className="hero__actions">
          <Link to="/consultoria/agendar" className="btn btn--accent btn--lg">
            Ver horários disponíveis
          </Link>
        </div>
      </PageHero>
      <Section eyebrow="Formatos" title="Como a consultoria funciona">
        <Cards
          items={[
            { tag: `${SESSION.minutes} min · ${brl(SESSION.price)}`, title: 'Sessão avulsa', text: 'Diagnóstico da carteira, dúvidas pontuais ou segunda opinião sobre uma decisão.' },
            { tag: 'Pacote', title: 'Planejamento patrimonial', text: 'Série de sessões para montar ou reorganizar a carteira com o Método PARSIFAL.' },
            { tag: 'Recorrente', title: 'Acompanhamento contínuo', text: 'Para patrimônios maiores, com remuneração sobre o patrimônio sob consultoria. Sob consulta.' },
          ]}
        />
      </Section>
      <Section tone="muted" eyebrow="Passo a passo" title="Do agendamento à reunião">
        <Steps
          items={[
            ['Escolha o horário', 'Veja na agenda os horários livres e escolha o que for melhor para você.'],
            ['Conte o seu objetivo', 'Um formulário curto ajuda a preparar a sessão.'],
            ['Pague com PIX ou cartão', 'O horário fica reservado assim que o pagamento é confirmado.'],
            ['Receba o link do Teams', 'Por e-mail, com o convite para a sua agenda.'],
            ['Reunião', 'No dia e hora marcados, entre pelo link. Você recebe um resumo por escrito depois.'],
          ]}
        />
      </Section>
      <Section eyebrow="Dúvidas" title="Perguntas frequentes">
        <Faq
          items={[
            ['Posso remarcar?', 'Sim, com até 24 horas de antecedência, sem custo.'],
            ['Preciso instalar o Teams?', 'Não. A reunião abre pelo navegador; o aplicativo é opcional.'],
            ['A sessão inclui recomendação de investimento?', 'Sim. A consultoria é o serviço regulado em que a recomendação personalizada é feita, após a análise do seu perfil (suitability).'],
            ['Há conflito de interesse?', 'Qualquer posição do consultor nos ativos discutidos é informada na sessão.'],
          ]}
        />
      </Section>
      <ContactBand title="Pronto para conversar?" text="Agenda com horários nas próximas seis semanas." to="/consultoria/agendar" label="Agendar agora" />
    </>
  );
}

type Step = 'slot' | 'dados' | 'pagamento' | 'ok';
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export function Agendar() {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<Date | null>(null);
  const [step, setStep] = useState<Step>('slot');
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [form, setForm] = useState({ name: '', email: '', topic: 'Diagnóstico da carteira', notes: '' });
  const [booking, setBooking] = useState<Booking | null>(null);
  const booked = load().bookings.map((b) => b.start);
  const last = lastBookableDay();

  const days = useMemo(() => {
    const first = new Date(month);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [month]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last;

  const confirm = () => {
    if (!slot) return;
    const b: Booking = {
      id: String(slot.getTime()),
      start: slot.toISOString(),
      name: form.name,
      email: form.email,
      topic: form.topic,
      teams: 'https://teams.microsoft.com/l/meetup-join/exemplo-prototipo',
    };
    save({ bookings: [...load().bookings, b] });
    setBooking(b);
    setStep('ok');
  };

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow eyebrow--dark">Agendar consultoria</p>
        <h1 className="section__title">
          Sessão individual · {SESSION.minutes} min · {brl(SESSION.price)}
        </h1>
        <ol className="wizard" aria-label="Etapas">
          {(['slot', 'dados', 'pagamento', 'ok'] as Step[]).map((s, i) => (
            <li key={s} className={step === s ? 'is-on' : ''}>
              {i + 1}. {['Horário', 'Seus dados', 'Pagamento', 'Confirmação'][i]}
            </li>
          ))}
        </ol>

        {step === 'slot' && (
          <div className="agenda">
            <div className="cal">
              <div className="cal__head">
                <button className="btn btn--ghost btn--sm" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                  Anterior
                </button>
                <strong>{month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</strong>
                <button className="btn btn--ghost btn--sm" disabled={!canNext} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                  Próximo
                </button>
              </div>
              <div className="cal__grid">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="cal__wd">
                    {w}
                  </span>
                ))}
                {days.map((d) => {
                  const inMonth = d.getMonth() === month.getMonth();
                  const free = inMonth && d >= today && d <= last ? slotsFor(d, booked).length : 0;
                  const sel = day?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      className={`cal__day ${inMonth ? '' : 'is-out'} ${free ? 'is-free' : ''} ${sel ? 'is-sel' : ''}`}
                      disabled={!free}
                      onClick={() => {
                        setDay(d);
                        setSlot(null);
                      }}
                      aria-label={`${d.toLocaleDateString('pt-BR')}${free ? `, ${free} horários livres` : ', sem horários'}`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
              <p className="hint">Horário de Brasília. Agenda aberta para as próximas {SESSION.weeksAhead} semanas, com {SESSION.noticeHours} h de antecedência.</p>
            </div>
            <div className="slots">
              {day ? (
                <>
                  <h2>{fmtDay(day)}</h2>
                  <div className="slots__grid">
                    {slotsFor(day, booked).map((s) => (
                      <button key={s.toISOString()} className={`slot ${slot?.getTime() === s.getTime() ? 'is-sel' : ''}`} onClick={() => setSlot(s)}>
                        {fmtTime(s)}
                      </button>
                    ))}
                  </div>
                  <button className="btn btn--accent btn--block" disabled={!slot} onClick={() => setStep('dados')}>
                    Continuar
                  </button>
                </>
              ) : (
                <p className="hint">Escolha um dia destacado no calendário para ver os horários livres.</p>
              )}
            </div>
          </div>
        )}

        {step === 'dados' && slot && (
          <form
            className="form form--narrow"
            onSubmit={(e) => {
              e.preventDefault();
              setStep('pagamento');
            }}
          >
            <p className="chosen">
              {fmtDay(slot)}, {fmtTime(slot)} <button type="button" className="link" onClick={() => setStep('slot')}>trocar</button>
            </p>
            <label>
              Nome completo
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              E-mail (o link do Teams vai para ele)
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              Objetivo da sessão
              <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                <option>Diagnóstico da carteira</option>
                <option>Planejamento patrimonial</option>
                <option>Segunda opinião sobre uma decisão</option>
                <option>Previdência e sucessão</option>
                <option>Outro</option>
              </select>
            </label>
            <label>
              Conte em poucas linhas o que espera da conversa
              <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
            <label className="check">
              <input type="checkbox" required /> Concordo com os <Link to="/legal/termos">termos</Link> e a{' '}
              <Link to="/legal/privacidade">política de privacidade</Link>.
            </label>
            <button className="btn btn--accent btn--block">Ir para o pagamento</button>
          </form>
        )}

        {step === 'pagamento' && slot && (
          <div className="checkout">
            <div>
              <div className="seg" role="radiogroup">
                <button type="button" role="radio" aria-checked={method === 'pix'} className={method === 'pix' ? 'is-on' : ''} onClick={() => setMethod('pix')}>
                  PIX
                </button>
                <button type="button" role="radio" aria-checked={method === 'card'} className={method === 'card' ? 'is-on' : ''} onClick={() => setMethod('card')}>
                  Cartão de crédito
                </button>
              </div>
              {method === 'pix' ? (
                <div className="pix">
                  <QrPlaceholder />
                  <p>O horário fica segurado por 15 minutos enquanto o PIX é pago.</p>
                </div>
              ) : (
                <div className="form">
                  <label>
                    Número do cartão
                    <input inputMode="numeric" placeholder="0000 0000 0000 0000" />
                  </label>
                  <div className="form__row">
                    <label>
                      Validade
                      <input placeholder="MM/AA" />
                    </label>
                    <label>
                      CVV
                      <input inputMode="numeric" placeholder="123" />
                    </label>
                  </div>
                </div>
              )}
              <button className="btn btn--accent btn--lg btn--block" onClick={confirm}>
                Simular pagamento confirmado
              </button>
            </div>
            <aside className="summary">
              <h2>Resumo</h2>
              <p className="summary__item">
                <span>Consultoria individual</span>
                <span>{brl(SESSION.price)}</span>
              </p>
              <p className="summary__item">
                <span>Data</span>
                <span>{fmtDay(slot)}</span>
              </p>
              <p className="summary__item">
                <span>Horário</span>
                <span>
                  {fmtTime(slot)} · {SESSION.minutes} min
                </span>
              </p>
              <p className="summary__total">
                <span>Total</span>
                <span>{brl(SESSION.price)}</span>
              </p>
            </aside>
          </div>
        )}

        {step === 'ok' && booking && (
          <div className="confirm">
            <h2>Sessão confirmada</h2>
            <p>
              {fmtDay(new Date(booking.start))}, às {fmtTime(new Date(booking.start))}, por Microsoft Teams. Enviamos o convite para{' '}
              <strong>{booking.email}</strong>.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href={icsFile(new Date(booking.start), 'Consultoria com Cesar Hauer', booking.teams)} download="consultoria-cesar-hauer.ics">
                Adicionar à minha agenda (.ics)
              </a>
              <a className="btn btn--ghost" href={booking.teams} onClick={(e) => e.preventDefault()}>
                Link do Teams (exemplo)
              </a>
              <Link to="/portal/previa" className="btn btn--ghost">
                Ver na área do aluno
              </Link>
            </div>
            <p className="hint">Na versão real, a reunião é criada na conta Microsoft 365 do Cesar no momento da confirmação do pagamento.</p>
          </div>
        )}
      </div>
    </section>
  );
}
