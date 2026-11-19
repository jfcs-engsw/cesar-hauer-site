import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import {
  APORTE_INICIAL,
  DADOS,
  DATA_REFERENCIA,
  DEGRAUS,
  DIVISAO_DIGITAL,
  LINHAS,
  MARCOS,
  MESES,
  META_TOTAL,
  PARTICIPACAO_LIVRO,
  PREVISTO_ACUM,
  QUITACAO_PCT,
  TRAFEGO_PCT,
  ULTIMO_FECHADO,
  acumulado,
  filaImplantacao,
  proximoDegrau,
  statusMarcos,
  type Mes,
} from '../content/gestao';
import { load, save } from '../lib/util';

// Área de gestão da parceria CHD + FESB. Protótipo: entrada simulada, dados simulados, nada de backend.

const rs = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const n = (v: number) => v.toLocaleString('pt-BR');
const pc = (v: number) => `${(v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const mil = (v: number) => `R$ ${Math.round(v / 1000)} mil`;

const ABAS = [
  ['', 'Visão geral'],
  ['receitas', 'Receitas'],
  ['custos', 'Custos'],
  ['prestacao', 'Prestação de contas'],
  ['funil', 'Funil'],
  ['metas', 'Metas'],
] as const;

export default function Gestao() {
  const { aba = '' } = useParams();
  const [perfil, setPerfil] = useState(() => load().gestao);
  const [sel, setSel] = useState(ULTIMO_FECHADO);
  if (!perfil) return <Entrada onEntrar={setPerfil} />;
  const m = DADOS[sel];
  const sair = () => {
    save({ gestao: '' });
    setPerfil('');
  };

  return (
    <div className="g">
      <header className="g-bar g-noprint">
        <div className="g-wrap g-bar__inner">
          <div>
            <p className="g-bar__kicker">Gestão da parceria digital</p>
            <strong className="g-bar__title">CHD + FESB</strong>
          </div>
          <div className="g-bar__acts">
            <span className="g-bar__user">Perfil: {perfil}</span>
            <button className="btn btn--outline-light btn--sm" onClick={sair}>
              Sair
            </button>
            <Link to="/" className="btn btn--outline-light btn--sm">
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>
      <div className="g-notice g-noprint" role="note">
        <div className="g-wrap">
          Área restrita a FESB e CHD. Protótipo com dados simulados e entrada sem login real. Data de referência
          simulada: {DATA_REFERENCIA}.
        </div>
      </div>
      <nav className="g-tabs g-noprint" aria-label="Seções da gestão">
        <div className="g-wrap g-tabs__inner">
          {ABAS.map(([to, label]) => (
            <NavLink key={to} to={`/gestao${to ? `/${to}` : ''}`} end className="g-tab">
              {label}
            </NavLink>
          ))}
          <label className="g-month">
            Mês
            <select value={sel} onChange={(e) => setSel(Number(e.target.value))}>
              {DADOS.map((d) => (
                <option key={d.i} value={d.i}>
                  {d.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>
      </nav>
      <main className="g-wrap g-main">
        {aba === '' && <Visao m={m} />}
        {aba === 'receitas' && <Receitas m={m} />}
        {aba === 'custos' && <Custos m={m} />}
        {aba === 'prestacao' && <Prestacao m={m} />}
        {aba === 'funil' && <Funil m={m} />}
        {aba === 'metas' && <Metas m={m} />}
        {!ABAS.some(([a]) => a === aba) && <p className="hint">Seção inexistente.</p>}
      </main>
    </div>
  );
}

function Entrada({ onEntrar }: { onEntrar: (p: string) => void }) {
  const [p, setP] = useState('FESB');
  const entrar = (e: FormEvent) => {
    e.preventDefault();
    save({ gestao: p });
    onEntrar(p);
  };
  return (
    <div className="g-login">
      <form className="g-login__card form" onSubmit={entrar}>
        <p className="eyebrow eyebrow--dark">Área restrita</p>
        <h1>Gestão da parceria CHD + FESB</h1>
        <p className="hint">
          Acesso restrito a FESB e CHD. Protótipo: a entrada é simulada, nenhuma senha é conferida ou guardada.
        </p>
        <label>
          Perfil
          <select value={p} onChange={(e) => setP(e.target.value)}>
            <option value="FESB">FESB</option>
            <option value="CHD">CHD</option>
          </select>
        </label>
        <label>
          E-mail
          <input type="email" placeholder="nome@exemplo.com.br" autoComplete="off" />
        </label>
        <label>
          Senha
          <input type="password" autoComplete="off" />
        </label>
        <button className="btn btn--primary btn--block" type="submit">
          Entrar (simulado)
        </button>
        <Link to="/" className="link">
          Voltar ao site
        </Link>
      </form>
    </div>
  );
}

/* Peças comuns */

function H({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="g-head">
      <h2>{title}</h2>
      {children && <p className="hint">{children}</p>}
    </header>
  );
}

type Col = { h: string; num?: boolean };

function Tabela({ titulo, cols, rows, foot }: { titulo: string; cols: Col[]; rows: ReactNode[][]; foot?: ReactNode[][] }) {
  return (
    <div className="g-table-wrap">
      <table className="g-table">
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th className="g-num">#</th>
            {cols.map((c) => (
              <th key={c.h} className={c.num ? 'g-num' : undefined}>
                {c.h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="g-num g-idx">{i + 1}</td>
              {r.map((c, k) => (
                <td key={k} className={cols[k].num ? 'g-num' : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            {foot.map((f, i) => (
              <tr key={i}>
                <td />
                {f.map((c, k) => (
                  <td key={k} className={cols[k].num ? 'g-num' : undefined}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: ReactNode; tone?: 'fesb' | 'chd' }) {
  return (
    <div className={`g-kpi ${tone ? `g-kpi--${tone}` : ''}`}>
      <p className="g-kpi__label">{label}</p>
      <p className="g-kpi__value">{value}</p>
      {sub && <p className="g-kpi__sub">{sub}</p>}
    </div>
  );
}

function Badge({ s }: { s: string }) {
  const tone = /Atingido|Pago|Quitado/.test(s)
    ? 'ok'
    : /Revisão|Abaixo de 70/.test(s)
      ? 'bad'
      : /tolerância|Previsto|Em quitação/.test(s)
        ? 'warn'
        : 'neutral';
  return <span className={`g-badge g-badge--${tone}`}>{s}</span>;
}

/* 1. Visão geral */

function Visao({ m }: { m: Mes }) {
  const acB = acumulado(m.i, (d) => d.bruto);
  const acL = acumulado(m.i, (d) => d.liquido);
  const acR = acumulado(m.i, (d) => d.base);
  const acF = acumulado(m.i, (d) => d.fesbTotal);
  const acC = acumulado(m.i, (d) => d.chdTotal);
  const pd = proximoDegrau(m);
  const prev = PREVISTO_ACUM[m.i];
  return (
    <>
      <H title={`Visão geral · ${m.rotulo}`}>Linhas digitais da parceria. Acumulado desde 30/11/2026.</H>
      <div className="g-kpis">
        <Kpi label="Receita bruta" value={rs(m.bruto)} sub={`Acumulada: ${rs(acB)}`} />
        <Kpi label="Receita líquida" value={rs(m.liquido)} sub={`Acumulada: ${rs(acL)}`} />
        <Kpi label="Resultado (base da divisão)" value={rs(m.base)} sub={`Acumulado: ${rs(acR)}`} />
        <Kpi
          label="Custos do mês (50/50)"
          value={rs(m.custosRealizados)}
          sub={`FESB ${rs(m.custosParte)} · CHD ${rs(m.custosParte)}${m.aporte ? ` · aporte de ${rs(m.aporte)} de cada Parte` : ' · cobertos pela receita'}`}
        />
        <Kpi label="Parte FESB" value={rs(m.fesbTotal)} sub={`Acumulada: ${rs(acF)}`} tone="fesb" />
        <Kpi label="Parte CHD" value={rs(m.chdTotal)} sub={`Acumulada: ${rs(acC)}`} tone="chd" />
        <Kpi
          label="Degrau de custo"
          value={DEGRAUS[m.degrau].nome}
          sub={
            pd.alvo === null
              ? `${pd.nota}; ${DEGRAUS[pd.vem].nome} no mês seguinte.`
              : pd.falta > 0
                ? `Faltam ${rs(pd.falta)} de líquido para o ${DEGRAUS[pd.alvo].nome} (${pd.nota}).`
                : `${DEGRAUS[pd.alvo].nome}: limiar alcançado no mês (${pd.nota}).`
          }
        />
      </div>
      <CustosPartes m={m} />
      <section className="g-card">
        <H title="Meta x realizado (bruto acumulado)">
          Realizado {rs(acB)} contra previsto {rs(prev)} ({pc(acB / prev)}). Meta de {rs(META_TOTAL)} até 30/11/2027.
        </H>
        <MetaChart sel={m.i} />
      </section>
      <p className="hint">
        Parte FESB = {pc(DIVISAO_DIGITAL)} do resultado digital + {pc(PARTICIPACAO_LIVRO)} do que o CHD recebe do livro
        rastreado. Custos divididos 50/50: saem da receita antes da divisão e, quando a receita do mês não cobre, cada
        Parte aporta metade. Eventos, mentoria, turmas, palestras e consultoria ficam fora da parceria.
      </p>
    </>
  );
}

function CustosPartes({ m }: { m: Mes }) {
  const opAc = acumulado(m.i, (d) => d.custosRealizados) + APORTE_INICIAL.operacionais;
  const linha = (t: string, total: number) => [t, rs(total / 2), rs(total / 2), rs(total)];
  return (
    <Tabela
      titulo="Parte de cada um nos custos (50/50)"
      cols={[{ h: 'Item' }, { h: 'FESB', num: true }, { h: 'CHD', num: true }, { h: 'Total', num: true }]}
      rows={[
        linha(`Custos operacionais do mês (${DEGRAUS[m.degrau].nome}), pagos com a receita antes da divisão`, m.custosRealizados),
        linha('Aporte no mês (receita do mês não cobriu os custos)', m.aporte * 2),
        linha(`Aporte de pré-lançamento em ${APORTE_INICIAL.mes} (implantação e Degrau 0)`, APORTE_INICIAL.total),
        linha('Aportes mensais acumulados', acumulado(m.i, (d) => d.aporte) * 2),
        linha('Implantação devolvida às Partes até o mês', acumulado(m.i, (d) => d.quitacaoTotal)),
      ]}
      foot={[linha('Custos acumulados da parceria (operacionais e implantação)', opAc + APORTE_INICIAL.implantacao)]}
    />
  );
}

function MetaChart({ sel }: { sel: number }) {
  const W = 760;
  const Hh = 300;
  const L = 64;
  const R = 16;
  const T = 16;
  const B = 40;
  const x = (i: number) => L + ((i + 1) / 12) * (W - L - R);
  const y = (v: number) => T + (1 - v / META_TOTAL) * (Hh - T - B);
  const prevPts = [[-1, 0], ...PREVISTO_ACUM.map((v, i) => [i, v])];
  const realPts = [[-1, 0], ...DADOS.slice(0, sel + 1).map((d) => [d.i, acumulado(d.i, (k) => k.bruto)])];
  const path = (pts: number[][], f = 1) => pts.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v * f).toFixed(1)}`).join(' ');
  const ticks = [0, 45000, 90000, 135000, 180000];
  return (
    <figure className="g-chart">
      <svg viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label="Gráfico de receita bruta acumulada, previsto contra realizado">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="g-grid" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" className="g-axis">
              {t ? mil(t) : 'R$ 0'}
            </text>
          </g>
        ))}
        {MESES.map((r, i) => (
          <text key={r} x={x(i)} y={Hh - 16} textAnchor="middle" className="g-axis">
            {r.slice(0, 3)}
          </text>
        ))}
        <path d={path(prevPts, 0.7)} className="g-line g-line--tol" />
        <path d={path(prevPts)} className="g-line g-line--prev" />
        <path d={path(realPts)} className="g-line g-line--real" />
        {realPts.slice(1).map(([i, v]) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={3.5} className="g-dot--real" />
        ))}
        {MARCOS.map((mc) => (
          <g key={mc.data}>
            <rect x={x(mc.mes) - 5} y={y(mc.valor) - 5} width={10} height={10} className="g-dot--prev" transform={`rotate(45 ${x(mc.mes)} ${y(mc.valor)})`} />
            <text x={x(mc.mes) - 8} y={y(mc.valor) - 10} textAnchor="end" className="g-axis g-axis--strong">
              {mil(mc.valor)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="g-legend">
        <span className="g-legend__item g-legend__item--prev">Previsto (marcos)</span>
        <span className="g-legend__item g-legend__item--real">Realizado</span>
        <span className="g-legend__item g-legend__item--tol">Limite de 70% (revisão)</span>
      </figcaption>
    </figure>
  );
}

/* 2. Receitas por linha */

function Receitas({ m }: { m: Mes }) {
  const und: Record<string, string> = {
    curso: `${n(m.unidades.cursos)} vendas`,
    bumps: `${n(m.unidades.bumps)} aceites`,
    saas: `${n(m.unidades.assinantes)} assinantes`,
    youtube: 'AdSense e membros',
  };
  const acLinha = (id: keyof Mes['linhas']) => acumulado(m.i, (d) => d.linhas[id].bruto);
  const foraTotal = m.fora.reduce((a, f) => a + f.valor, 0);
  return (
    <>
      <H title={`Receitas por linha · ${m.rotulo}`}>Linhas digitais (50/50 sobre o resultado) e livro rastreado (FESB com 20% do que o CHD recebe).</H>
      <Tabela
        titulo="Receitas da parceria no mês"
        cols={[{ h: 'Linha' }, { h: 'Volume' }, { h: 'Bruto', num: true }, { h: 'Deduções', num: true }, { h: 'Líquido', num: true }, { h: 'Bruto acumulado', num: true }]}
        rows={[
          ...LINHAS.map((l) => {
            const x = m.linhas[l.id];
            return [
              <>
                {l.nome}
                <small className="g-sub">{l.nota}</small>
              </>,
              und[l.id],
              rs(x.bruto),
              rs(x.gateway + x.impostos + x.reembolsos),
              rs(x.liquido),
              rs(acLinha(l.id)),
            ];
          }),
          [
            <>
              Livro rastreado pelo funil
              <small className="g-sub">Valor recebido pelo CHD; fora da meta digital</small>
            </>,
            `${n(m.livro.vendas)} exemplares`,
            rs(m.livro.recebidoChd),
            rs(0),
            rs(m.livro.recebidoChd),
            rs(acumulado(m.i, (d) => d.livro.recebidoChd)),
          ],
        ]}
        foot={[
          ['Subtotal digital', '', rs(m.bruto), rs(m.gateway + m.impostos + m.reembolsos), rs(m.liquido), rs(acumulado(m.i, (d) => d.bruto))],
          [
            'Total com livro',
            '',
            rs(m.bruto + m.livro.recebidoChd),
            rs(m.gateway + m.impostos + m.reembolsos),
            rs(m.liquido + m.livro.recebidoChd),
            rs(acumulado(m.i, (d) => d.bruto + d.livro.recebidoChd)),
          ],
        ]}
      />
      <section className="g-card g-card--muted">
        <H title="Fora da parceria (100% CHD)">Só informativo. Não entra na divisão, nos custos nem na meta.</H>
        <Tabela
          titulo="Receitas do CHD fora da parceria no mês"
          cols={[{ h: 'Linha' }, { h: 'Valor', num: true }]}
          rows={m.fora.map((f) => [f.item, rs(f.valor)])}
          foot={[['Total fora da parceria', rs(foraTotal)]]}
        />
      </section>
    </>
  );
}

/* 3. Custos */

function Custos({ m }: { m: Mes }) {
  const fila = filaImplantacao(m.i);
  const totalImpl = fila.reduce((a, f) => a + f.valor, 0);
  const pagoImpl = fila.reduce((a, f) => a + f.pago, 0);
  const soma = (d: Mes, tipo: string) => d.custos.filter((c) => c.tipo === tipo).reduce((a, c) => a + c.realizado, 0);
  return (
    <>
      <H title={`Custos · ${m.rotulo}`}>
        Custos progressivos por degrau, ancorados na receita líquida digital do mês anterior ({rs(m.rlAnterior)}).
      </H>
      <ol className="g-steps">
        {DEGRAUS.map((d) => (
          <li key={d.n} className={d.n === m.degrau ? 'is-on' : d.n < m.degrau ? 'is-past' : ''}>
            <strong>{d.nome}</strong>
            <span>{d.regra}</span>
            <small>Tráfego: {TRAFEGO_PCT[d.n]}</small>
          </li>
        ))}
      </ol>
      <Tabela
        titulo={`Custos do mês no ${DEGRAUS[m.degrau].nome}`}
        cols={[{ h: 'Item' }, { h: 'Tipo' }, { h: 'Teto', num: true }, { h: 'Realizado', num: true }, { h: 'Folga', num: true }]}
        rows={m.custos.map((c) => [c.item, c.tipo, rs(c.teto), rs(c.realizado), rs(c.teto - c.realizado)])}
        foot={[['Total', '', rs(m.tetoCustos), rs(m.custosRealizados), rs(m.tetoCustos - m.custosRealizados)]]}
      />
      <Tabela
        titulo="Custos por mês"
        cols={[{ h: 'Mês' }, { h: 'Degrau' }, { h: 'Fixos', num: true }, { h: 'Variáveis', num: true }, { h: 'Teto', num: true }, { h: 'Realizado', num: true }, { h: 'Aporte por Parte', num: true }, { h: 'Implantação devolvida', num: true }]}
        rows={DADOS.slice(0, m.i + 1).map((d) => [d.rotulo, DEGRAUS[d.degrau].nome, rs(soma(d, 'Fixo')), rs(soma(d, 'Variável')), rs(d.tetoCustos), rs(d.custosRealizados), rs(d.aporte), rs(d.quitacaoTotal)])}
        foot={[
          [
            'Acumulado',
            '',
            rs(acumulado(m.i, (d) => soma(d, 'Fixo'))),
            rs(acumulado(m.i, (d) => soma(d, 'Variável'))),
            rs(acumulado(m.i, (d) => d.tetoCustos)),
            rs(acumulado(m.i, (d) => d.custosRealizados)),
            rs(acumulado(m.i, (d) => d.aporte)),
            rs(acumulado(m.i, (d) => d.quitacaoTotal)),
          ],
        ]}
      />
      <Tabela
        titulo={`Implantação: aporte 50/50 em ${APORTE_INICIAL.mes}, devolvido às Partes pelas primeiras receitas (${pc(QUITACAO_PCT)} da margem do mês)`}
        cols={[{ h: 'Item, em ordem de prioridade' }, { h: 'Valor', num: true }, { h: 'Devolvido até o mês', num: true }, { h: 'Saldo', num: true }, { h: 'Situação' }]}
        rows={fila.map((f) => [
          f.item,
          rs(f.valor),
          rs(f.pago),
          rs(f.saldo),
          <Badge s={f.quitadoEm ? `Devolvido em ${f.quitadoEm}` : f.pago > 0 ? 'Em devolução' : 'Na fila'} />,
        ])}
        foot={[['Total', rs(totalImpl), rs(pagoImpl), rs(totalImpl - pagoImpl), '']]}
      />
    </>
  );
}

/* 4. Prestação de contas */

function Prestacao({ m }: { m: Mes }) {
  const cols: Col[] = [{ h: 'Linha' }, { h: 'Bruto', num: true }, { h: 'Gateway', num: true }, { h: 'Impostos', num: true }, { h: 'Reembolsos e chargebacks', num: true }, { h: 'Líquido', num: true }];
  return (
    <article className="g-doc">
      <div className="g-doc__acts g-noprint">
        <button className="btn btn--primary" onClick={() => window.print()}>
          Imprimir / salvar PDF
        </button>
      </div>
      <header className="g-doc__head">
        <p className="eyebrow eyebrow--dark">Demonstrativo mensal</p>
        <h1>Parceria digital CHD + FESB · competência {m.rotulo}</h1>
        <p className="hint">
          Emitido em {DATA_REFERENCIA} (simulado). Valores em reais. Documento de protótipo com dados fictícios.
        </p>
      </header>

      <h2 className="g-doc__sec">1. Receita bruta, deduções e receita líquida por linha</h2>
      <Tabela
        titulo="Linhas digitais"
        cols={cols}
        rows={LINHAS.map((l) => {
          const x = m.linhas[l.id];
          return [l.nome, rs(x.bruto), rs(x.gateway), rs(x.impostos), rs(x.reembolsos), rs(x.liquido)];
        })}
        foot={[['Total', rs(m.bruto), rs(m.gateway), rs(m.impostos), rs(m.reembolsos), rs(m.liquido)]]}
      />

      <h2 className="g-doc__sec">2. Custos da parceria (50/50)</h2>
      <Tabela
        titulo={`Custos operacionais do mês (${DEGRAUS[m.degrau].nome}), pagos com a receita antes da divisão`}
        cols={[{ h: 'Item' }, { h: 'Valor', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
        rows={m.custos.filter((c) => c.realizado > 0).map((c) => [c.item, rs(c.realizado), rs(c.realizado / 2), rs(c.realizado / 2)])}
        foot={[
          ['Total de custos operacionais', rs(m.custosRealizados), rs(m.custosParte), rs(m.custosParte)],
          ['Aporte das Partes (receita do mês não cobriu)', rs(m.aporte * 2), rs(m.aporte), rs(m.aporte)],
        ]}
      />
      {m.quitacaoTotal > 0 && (
        <Tabela
          titulo={`Devolução dos aportes de implantação feitos em ${APORTE_INICIAL.mes}`}
          cols={[{ h: 'Item' }, { h: 'Valor', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
          rows={m.quitacao.map((q) => [q.item, rs(q.valor), rs(q.valor / 2), rs(q.valor / 2)])}
          foot={[['Total devolvido no mês', rs(m.quitacaoTotal), rs(m.quitacaoTotal / 2), rs(m.quitacaoTotal / 2)]]}
        />
      )}

      <h2 className="g-doc__sec">3. Divisão</h2>
      <dl className="g-dl">
        <dt>Receita líquida digital</dt>
        <dd>{rs(m.liquido)}</dd>
        <dt>(-) Custos operacionais (50/50)</dt>
        <dd>{rs(m.custosRealizados)}</dd>
        <dt>(-) Devolução dos aportes de implantação</dt>
        <dd>{rs(m.quitacaoTotal)}</dd>
        <dt className="g-dl__strong">Resultado a dividir</dt>
        <dd className="g-dl__strong">{rs(m.base)}</dd>
        <dt>FESB ({pc(DIVISAO_DIGITAL)})</dt>
        <dd>{rs(m.fesbDigital)}</dd>
        <dt>CHD ({pc(1 - DIVISAO_DIGITAL)})</dt>
        <dd>{rs(m.chdDigital)}</dd>
        <dt>Livro: recebido pelo CHD ({n(m.livro.vendas)} exemplares atribuídos)</dt>
        <dd>{rs(m.livro.recebidoChd)}</dd>
        <dt>Livro: participação FESB ({pc(PARTICIPACAO_LIVRO)})</dt>
        <dd>{rs(m.livro.fesb)}</dd>
        <dt className="g-dl__strong">Total FESB (resultado e livro)</dt>
        <dd className="g-dl__strong">{rs(m.fesbTotal)}</dd>
        <dt className="g-dl__strong">Total CHD (resultado e livro)</dt>
        <dd className="g-dl__strong">{rs(m.chdTotal)}</dd>
        <dt>Parte de cada um nos custos do mês</dt>
        <dd>
          FESB {rs(m.custosParte)} · CHD {rs(m.custosParte)}
        </dd>
        <dt>Aporte de cada Parte no mês</dt>
        <dd>{rs(m.aporte)}</dd>
      </dl>

      <h2 className="g-doc__sec">4. Repasses</h2>
      <Tabela
        titulo="Repasses do mês"
        cols={[{ h: 'De' }, { h: 'Para' }, { h: 'Composição' }, { h: 'Valor', num: true }, { h: 'Situação' }]}
        rows={[
          ['CHD', 'FESB', 'Parte FESB do resultado e do livro + metade da implantação devolvida no mês', rs(m.repasse), <Badge s={m.repasseStatus} />],
        ]}
      />
      <p className="hint">
        Premissas do protótipo: gateway e AdSense em nome do CHD, por isso o repasse vai do CHD para a FESB. Custos
        divididos 50/50: saem da receita antes da divisão e, quando a receita do mês não cobre, cada Parte aporta metade.
        Fora da parceria (eventos, mentoria, turmas, palestras, consultoria) não entra neste demonstrativo.
      </p>
      <div className="g-sign">
        <div>CHD</div>
        <div>FESB</div>
      </div>
    </article>
  );
}

/* 5. Funil */

function FunilChart({ m }: { m: Mes }) {
  const W = 760;
  const row = 46;
  const cx = 200;
  const max = Math.log10(m.etapas[0].volume + 1);
  const w = (v: number) => 40 + (Math.log10(v + 1) / max) * 340;
  const Hh = m.etapas.length * row + 24;
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} className="g-funnel" role="img" aria-label="Gráfico do funil por etapa, em escala logarítmica">
      {m.etapas.map((e, i) => {
        const y = i * row + (i >= 5 ? 24 : 0);
        const main = i < 5;
        const top = w(e.volume);
        const bot = main ? w(m.etapas[i + 1]?.volume ?? e.volume) : top;
        const pts = main
          ? `${cx - top / 2},${y} ${cx + top / 2},${y} ${cx + Math.min(top, bot) / 2},${y + row - 6} ${cx - Math.min(top, bot) / 2},${y + row - 6}`
          : `${cx - top / 2},${y} ${cx + top / 2},${y} ${cx + top / 2},${y + row - 6} ${cx - top / 2},${y + row - 6}`;
        return (
          <g key={e.etapa}>
            <polygon points={pts} className={main ? `g-fstage g-fstage--${i}` : 'g-fstage g-fstage--post'} />
            <text x={cx} y={y + row / 2 + 2} textAnchor="middle" className={main ? 'g-flabel' : 'g-flabel g-flabel--dark'}>
              {n(e.volume)}
            </text>
            <text x={420} y={y + 18} className="g-fname">
              {e.etapa}
            </text>
            <text x={420} y={y + 35} className="g-axis">
              {e.conversao === null ? 'Topo do funil' : `${pc(e.conversao)} ${e.base}`}
            </text>
          </g>
        );
      })}
      <text x={420} y={5 * row + 14} className="g-axis g-axis--strong">
        Depois do checkout
      </text>
    </svg>
  );
}

function Funil({ m }: { m: Mes }) {
  const tot = (k: 'visitas' | 'leads' | 'vendas' | 'receita') => m.canais.reduce((a, c) => a + c[k], 0);
  const acLivro = (f: (d: Mes) => number) => acumulado(m.i, f);
  return (
    <>
      <H title={`Funil automatizado · ${m.rotulo}`}>Largura em escala logarítmica, para as etapas finais seguirem legíveis.</H>
      <section className="g-card">
        <FunilChart m={m} />
      </section>
      <Tabela
        titulo="Etapas do funil"
        cols={[{ h: 'Etapa' }, { h: 'O que mede' }, { h: 'Volume', num: true }, { h: 'Conversão', num: true }]}
        rows={m.etapas.map((e) => [e.etapa, e.detalhe, n(e.volume), e.conversao === null ? '-' : `${pc(e.conversao)} ${e.base}`])}
      />
      <Tabela
        titulo="Origem por canal (UTM)"
        cols={[{ h: 'Canal' }, { h: 'UTM' }, { h: 'Visitas', num: true }, { h: 'Leads', num: true }, { h: 'Vendas do curso', num: true }, { h: 'Receita bruta', num: true }, { h: 'Visita para venda', num: true }]}
        rows={m.canais.map((c) => [c.canal, <code className="g-code">{c.utm}</code>, n(c.visitas), n(c.leads), n(c.vendas), rs(c.receita), c.visitas ? pc(c.vendas / c.visitas) : '-'])}
        foot={[['Total', '', n(tot('visitas')), n(tot('leads')), n(tot('vendas')), rs(tot('receita')), pc(tot('vendas') / tot('visitas'))]]}
      />
      <Tabela
        titulo="Rastreio do livro"
        cols={[{ h: 'Indicador' }, { h: 'No mês', num: true }, { h: 'Acumulado', num: true }]}
        rows={[
          ['Acessos pelo QR do livro (entrada no funil)', n(m.livro.qr), n(acLivro((d) => d.livro.qr))],
          ['Cliques no link rastreado da editora', n(m.livro.cliques), n(acLivro((d) => d.livro.cliques))],
          ['Usos do cupom do site', n(m.livro.cupons), n(acLivro((d) => d.livro.cupons))],
          ['Vendas atribuídas ao funil', n(m.livro.vendas), n(acLivro((d) => d.livro.vendas))],
          ['Valor recebido pelo CHD', rs(m.livro.recebidoChd), rs(acLivro((d) => d.livro.recebidoChd))],
          [`Participação FESB (${pc(PARTICIPACAO_LIVRO)})`, rs(m.livro.fesb), rs(acLivro((d) => d.livro.fesb))],
        ]}
      />
    </>
  );
}

/* 6. Metas */

function Metas({ m }: { m: Mes }) {
  const st = statusMarcos(m.i);
  const restantes = 11 - m.i;
  return (
    <>
      <H title={`Metas · posição em ${m.rotulo}`}>
        Meta da parceria digital: {rs(META_TOTAL)} brutos de 30/11/2026 a 30/11/2027. Abaixo de 70% em dois marcos seguidos,
        a parceria entra em revisão.
      </H>
      <div className="g-marcos">
        {st.map((s, k) => (
          <article key={s.data} className="g-marco">
            <p className="g-kpi__label">Marco {k + 1} · {s.data}</p>
            <p className="g-kpi__value">{rs(s.valor)}</p>
            <div className="progress__bar" aria-hidden="true">
              <span style={{ width: `${Math.min(100, s.pct * 100)}%` }} />
            </div>
            <p className="g-kpi__sub">
              Realizado {rs(s.realizado)} ({pc(s.pct)})
            </p>
            <Badge s={s.status} />
            {s.status === 'Em andamento' && restantes > 0 && (
              <p className="g-kpi__sub">
                Ritmo necessário: {rs(Math.max(0, (s.valor - s.realizado) / (s.mes - m.i)))} por mês até {s.data}.
              </p>
            )}
          </article>
        ))}
      </div>
      <section className="g-card">
        <MetaChart sel={m.i} />
      </section>
    </>
  );
}
