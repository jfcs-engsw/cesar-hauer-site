import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom';
import { Badge, H, Kpi, Tabela, type Col } from '../components/GestaoUi';
import { ApiErro } from '../lib/api';
import {
  gestaoApi,
  paraCentavos,
  reais,
  urlGestao,
  type Aporte,
  type Categoria,
  type Demonstrativo,
  type Gestor,
  type Lancamento,
  type LinhaReceita,
  type Orcamento,
  type Partes,
  type Prestacao,
  type Quitacao,
  type Visao,
} from '../lib/gestaoApi';

// Painel de gestão da parceria CHD + FESB com dados reais da API. Entrar com Google; sem sessão, mostra a
// entrada e o link para a demonstração com dados simulados (GestaoDemo). Valores da API em centavos.

const ABAS = [
  ['', 'Visão geral'],
  ['orcamento', 'Orçamento'],
  ['lancamentos', 'Lançamentos'],
  ['aportes', 'Aportes'],
  ['prestacao', 'Prestação de contas'],
] as const;

const NOMES_LINHAS: Record<LinhaReceita, string> = {
  curso: 'Curso online',
  bumps: 'Order bumps',
  assinatura: 'Assinatura (SaaS)',
  youtube: 'YouTube',
  livro: 'Livro rastreado',
};
const NOMES_CATEGORIAS: Record<Categoria, string> = { implantacao: 'Implantação', fixo: 'Fixo', variavel: 'Variável', trafego: 'Tráfego' };
const ERROS_LOGIN: Record<string, string> = {
  negado: 'Este e-mail não tem acesso ao painel. Use a conta Google cadastrada para a FESB ou o CHD.',
  acesso: 'Não foi possível concluir a entrada com o Google. Tente de novo.',
  indisponivel: 'A entrada com Google ainda não está configurada neste servidor.',
};

const pcBp = (bp: number) => `${(bp / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
const rotuloComp = (c: string) => {
  const [a, m] = c.split('-');
  return `${['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][Number(m) - 1]}/${a}`;
};
// Data de hoje em Brasília, no formato do input date.
const hojeBrasilia = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());

function useDados<T>(carregar: () => Promise<T>, deps: unknown[]) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState('');
  const [versao, setVersao] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = useCallback(carregar, deps);
  useEffect(() => {
    let vivo = true;
    setErro('');
    fn()
      .then((d) => vivo && setDados(d))
      .catch((e: unknown) => vivo && setErro(e instanceof ApiErro ? e.message : 'Falha ao carregar.'));
    return () => {
      vivo = false;
    };
  }, [fn, versao]);
  return { dados, erro, recarregar: () => setVersao((v) => v + 1) };
}

export default function Gestao() {
  const [fase, setFase] = useState<'carregando' | 'entrada' | 'painel'>('carregando');
  const [gestor, setGestor] = useState<Gestor | null>(null);
  const [google, setGoogle] = useState<boolean | null>(null);
  const [foraDoAr, setForaDoAr] = useState(false);

  useEffect(() => {
    gestaoApi
      .eu()
      .then((g) => {
        setGestor(g);
        setFase('painel');
      })
      .catch(async (e: unknown) => {
        if (e instanceof ApiErro && e.status === 0) setForaDoAr(true);
        else setGoogle(await gestaoApi.estado().then((x) => x.google, () => false));
        setFase('entrada');
      });
  }, []);

  if (fase === 'carregando') return <div className="g-login" aria-busy="true" />;
  if (fase === 'entrada' || !gestor) return <Entrada google={google} foraDoAr={foraDoAr} />;
  return <Painel gestor={gestor} />;
}

function Entrada({ google, foraDoAr }: { google: boolean | null; foraDoAr: boolean }) {
  const [params] = useSearchParams();
  const erro = ERROS_LOGIN[params.get('erro') ?? ''];
  return (
    <div className="g-login">
      <div className="g-login__card form">
        <p className="eyebrow eyebrow--dark">Área restrita</p>
        <h1>Gestão da parceria CHD + FESB</h1>
        <p className="hint">Acesso só para as contas Google cadastradas da FESB e do CHD.</p>
        {erro && (
          <p className="g-alert" role="alert">
            {erro}
          </p>
        )}
        {foraDoAr ? (
          <p className="g-alert" role="status">
            O painel está indisponível neste endereço. A demonstração continua disponível.
          </p>
        ) : google ? (
          <a className="btn btn--primary btn--block" href={urlGestao('/auth/google')}>
            Entrar com Google
          </a>
        ) : (
          <p className="g-alert" role="status">
            A entrada com Google ainda não está configurada neste servidor.
          </p>
        )}
        <Link to="/gestao/demo" className="link">
          Ver demonstração com dados simulados
        </Link>
        <Link to="/" className="link">
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}

function Painel({ gestor }: { gestor: Gestor }) {
  const { aba = '' } = useParams();
  const meses = useDados(() => gestaoApi.meses(), []);
  const [mes, setMes] = useState('');
  const atual = mes || meses.dados?.atual || '';
  const sair = async () => {
    await gestaoApi.sair().catch(() => undefined);
    window.location.reload();
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
            <span className="g-bar__user">
              {gestor.email} · {gestor.papel}
            </span>
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
        <div className="g-wrap">Área restrita a FESB e CHD. Dados reais da parceria; horários em Brasília.</div>
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
            <select value={atual} onChange={(e) => setMes(e.target.value)}>
              {(meses.dados?.meses ?? []).map((m) => (
                <option key={m.competencia} value={m.competencia}>
                  {m.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>
      </nav>
      <main className="g-wrap g-main">
        {meses.erro && <p className="g-alert">{meses.erro}</p>}
        {atual && aba === '' && <VisaoGeral mes={atual} />}
        {atual && aba === 'orcamento' && <OrcamentoAba mes={atual} />}
        {atual && aba === 'lancamentos' && <Lancamentos mes={atual} />}
        {atual && aba === 'aportes' && <Aportes />}
        {atual && aba === 'prestacao' && <PrestacaoAba mes={atual} gestor={gestor} />}
        {!ABAS.some(([a]) => a === aba) && <p className="hint">Seção inexistente.</p>}
      </main>
    </div>
  );
}

function Carregando({ erro }: { erro: string }) {
  return erro ? <p className="g-alert">{erro}</p> : <p className="hint">Carregando...</p>;
}

function AvisoOrcamento({ v }: { v: Visao['orcamento'] }) {
  if (!v) return <p className="hint">Nenhum orçamento carregado: valem os parâmetros do plano (docs/13 e minuta) e o previsto fica vazio.</p>;
  return (
    <p className="hint">
      Orçamento vigente: {v.nome}, carregado em {v.carregado_em} por {v.carregado_por}.{' '}
      {v.exemplo && <Badge s="Orçamento de exemplo, não aprovado" />}
    </p>
  );
}

const lado = (p?: Partes) => (p ? [reais(p.FESB), reais(p.CHD)] : ['', '']);

/* 1. Visão geral */

function VisaoGeral({ mes }: { mes: string }) {
  const { dados: v, erro } = useDados(() => gestaoApi.visao(mes), [mes]);
  if (!v || v.vazio) return <Carregando erro={erro} />;
  const m = v.mes;
  const ac = v.acumulado;
  const pd = v.degrau.proximo;
  const linhas: [string, number, Partes | undefined, number, Partes | undefined][] = [
    ['Receita bruta (linhas digitais)', m.bruto, undefined, ac.bruto, undefined],
    ['(-) Deduções: gateway, impostos, reembolsos', m.deducoes, undefined, ac.deducoes, undefined],
    ['Receita líquida', m.liquido, undefined, ac.liquido, undefined],
    ['(-) Custos operacionais (fixo, variável, tráfego)', m.custos.operacionais, undefined, ac.custos.operacionais, undefined],
    ['Resultado (líquido menos custos)', m.resultado, m.resultado_partes, ac.resultado, ac.resultado_partes],
    ['Custos do mês, incluindo implantação (50/50)', m.custos.operacionais + m.custos.implantacao, m.custos_partes, ac.custos.operacionais + ac.custos.implantacao, ac.custos_partes],
    ['Devolução de aportes e custos pagos pelas Partes', m.devolvido.FESB + m.devolvido.CHD, m.devolvido, ac.devolvido.FESB + ac.devolvido.CHD, ac.devolvido],
    ['Resultado a dividir (após quitação)', m.base, m.divisao, ac.base, ac.divisao],
    ['Livro rastreado (recebido pelo CHD)', m.livro.recebido, m.livro, ac.livro.recebido, ac.livro],
    ['Total de cada Parte', m.total.FESB + m.total.CHD, m.total, ac.total.FESB + ac.total.CHD, ac.total],
  ];
  return (
    <>
      <H title={`Visão geral · ${v.rotulo}`}>Linhas digitais da parceria. Acumulado desde {rotuloComp(v.desde)}.</H>
      <AvisoOrcamento v={v.orcamento} />
      <Alertas m={m} />
      <div className="g-kpis">
        <Kpi label="Receita bruta" value={reais(m.bruto)} sub={`Acumulada: ${reais(ac.bruto)}`} />
        <Kpi label="Receita líquida" value={reais(m.liquido)} sub={`Deduções: ${reais(m.deducoes)} · acumulada: ${reais(ac.liquido)}`} />
        <Kpi label="Custos do mês (50/50)" value={reais(m.custos.operacionais + m.custos.implantacao)} sub={`FESB ${reais(m.custos_partes.FESB)} · CHD ${reais(m.custos_partes.CHD)}`} />
        <Kpi label="Resultado do mês" value={reais(m.resultado)} sub={`FESB ${reais(m.resultado_partes.FESB)} · CHD ${reais(m.resultado_partes.CHD)}`} />
        <Kpi label="Parte FESB" value={reais(m.total.FESB)} sub={`Acumulada: ${reais(ac.total.FESB)}`} tone="fesb" />
        <Kpi label="Parte CHD" value={reais(m.total.CHD)} sub={`Acumulada: ${reais(ac.total.CHD)}`} tone="chd" />
        <Kpi
          label="Degrau de custo"
          value={`Degrau ${v.degrau.atual}`}
          sub={
            pd.alvo === null
              ? `${pd.nota}; Degrau ${pd.vem} no mês seguinte.`
              : pd.falta > 0
                ? `Faltam ${reais(pd.falta)} de receita líquida para o Degrau ${pd.alvo} (${pd.nota}).`
                : `Degrau ${pd.alvo}: limiar alcançado no mês (${pd.nota}).`
          }
        />
      </div>
      <Tabela
        titulo="Mês e acumulado, com a parte de cada um lado a lado"
        cols={[{ h: 'Item' }, { h: 'Mês', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }, { h: 'Acumulado', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
        rows={linhas.map(([t, vm, pm, va, pa]) => [t, reais(vm), ...lado(pm), reais(va), ...lado(pa)])}
      />
      <Tabela
        titulo="Repasses do mês"
        cols={[{ h: 'De' }, { h: 'Para' }, { h: 'Valor', num: true }]}
        rows={m.repasses.map((r) => [r.de, r.para, reais(r.valor)])}
      />
      <section className="g-card">
        <H title="Meta x realizado (bruto acumulado)">
          Realizado {reais(v.meta.realizado)} contra previsto {reais(v.meta.previsto)}. Meta de {reais(v.meta.total)}.
        </H>
        <MetaGrafico serie={v.meta.serie} total={v.meta.total} />
        <Tabela
          titulo="Marcos"
          cols={[{ h: 'Data' }, { h: 'Meta acumulada', num: true }, { h: 'Realizado', num: true }, { h: 'Situação' }]}
          rows={v.meta.marcos.map((mc) => [mc.data.split('-').reverse().join('/'), reais(mc.valor), reais(mc.realizado), <Badge s={mc.status} />])}
        />
      </section>
      <Tabela
        titulo="Histórico"
        cols={[{ h: 'Mês' }, { h: 'Degrau' }, { h: 'Bruto', num: true }, { h: 'Líquido', num: true }, { h: 'Custos', num: true }, { h: 'A dividir', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
        rows={v.historico.map((h) => [h.rotulo, `Degrau ${h.degrau}`, reais(h.bruto), reais(h.liquido), reais(h.custos), reais(h.base), reais(h.total.FESB), reais(h.total.CHD)])}
      />
    </>
  );
}

function Alertas({ m }: { m: Visao['mes'] }) {
  const itens: ReactNode[] = [];
  if (m.descoberto > 0)
    itens.push(
      <>
        <Badge s="Caixa a descoberto" /> {reais(m.descoberto)}: aporte de {reais(m.aporte_necessario.FESB)} da FESB e {reais(m.aporte_necessario.CHD)} do CHD.
      </>,
    );
  if (m.trafego.acima_do_teto)
    itens.push(
      <>
        <Badge s="Acima do teto" /> Tráfego de {reais(m.trafego.realizado)} contra teto de {reais(m.trafego.teto)}: exige aprovação escrita das duas Partes (cláusula 7.4).
      </>,
    );
  if (m.restituir.FESB + m.restituir.CHD > 0)
    itens.push(
      <>
        <Badge s="Estorno de crédito já devolvido" /> A restituir: FESB {reais(m.restituir.FESB)}, CHD {reais(m.restituir.CHD)}.
      </>,
    );
  if (m.creditos_pendentes.FESB + m.creditos_pendentes.CHD > 0)
    itens.push(
      <>
        <Badge s="Em quitação" /> Créditos a devolver: FESB {reais(m.creditos_pendentes.FESB)}, CHD {reais(m.creditos_pendentes.CHD)}.
      </>,
    );
  if (!itens.length) return null;
  return (
    <section className="g-card g-card--muted">
      {itens.map((x, i) => (
        <p key={i} className="g-linha">
          {x}
        </p>
      ))}
    </section>
  );
}

function MetaGrafico({ serie, total }: { serie: Visao['meta']['serie']; total: number }) {
  if (!serie.length || !total) return null;
  const W = 760;
  const Hh = 260;
  const L = 72;
  const R = 16;
  const T = 16;
  const B = 36;
  const max = Math.max(total, ...serie.map((s) => Math.max(s.previsto, s.realizado)));
  const x = (i: number) => L + ((i + 1) / serie.length) * (W - L - R);
  const y = (val: number) => T + (1 - val / max) * (Hh - T - B);
  const path = (k: 'previsto' | 'realizado', f = 1) => [`M${x(-1)},${y(0)}`, ...serie.map((s, i) => `L${x(i).toFixed(1)},${y(s[k] * f).toFixed(1)}`)].join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  return (
    <figure className="g-chart">
      <svg viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label="Receita bruta acumulada, previsto contra realizado">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="g-grid" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" className="g-axis">
              {`R$ ${Math.round(t / 100000)} mil`}
            </text>
          </g>
        ))}
        {serie.map((s, i) => (
          <text key={s.competencia} x={x(i)} y={Hh - 14} textAnchor="middle" className="g-axis">
            {s.rotulo.slice(0, 3)}
          </text>
        ))}
        <path d={path('previsto', 0.7)} className="g-line g-line--tol" />
        <path d={path('previsto')} className="g-line g-line--prev" />
        <path d={path('realizado')} className="g-line g-line--real" />
        {serie.map((s, i) => (
          <circle key={s.competencia} cx={x(i)} cy={y(s.realizado)} r={3.5} className="g-dot--real" />
        ))}
      </svg>
      <figcaption className="g-legend">
        <span className="g-legend__item g-legend__item--prev">Previsto</span>
        <span className="g-legend__item g-legend__item--real">Realizado</span>
        <span className="g-legend__item g-legend__item--tol">Limite de 70% (revisão)</span>
      </figcaption>
    </figure>
  );
}

/* 2. Orçamento: previsto x realizado e fila de quitação */

function OrcamentoAba({ mes }: { mes: string }) {
  const { dados: o, erro } = useDados(() => gestaoApi.orcamento(mes), [mes]);
  const { dados: f } = useDados(() => gestaoApi.quitacao(mes), [mes]);
  if (!o || !o.totais) return <Carregando erro={erro} />;
  const sit = (i: Orcamento['itens'][number]) => (i.liberado ? (i.realizado ? (i.diferenca < 0 ? 'Acima do previsto' : 'Realizado') : 'Previsto') : `Bloqueado até o Degrau ${i.degrau}`);
  const cats = Object.keys(NOMES_CATEGORIAS) as Categoria[];
  return (
    <>
      <H title={`Orçamento · ${o.rotulo}`}>Previsto contra realizado no Degrau {o.degrau}. (E) = valor estimado, a orçar.</H>
      <AvisoOrcamento v={o.orcamento} />
      <Tabela
        titulo="Receita: prevista x realizada"
        cols={[{ h: 'Item' }, { h: 'Previsto', num: true }, { h: 'Realizado', num: true }, { h: 'Diferença', num: true }]}
        rows={[
          ['Receita bruta', reais(o.receita.previsto_bruto), reais(o.receita.realizado_bruto), reais(o.receita.realizado_bruto - o.receita.previsto_bruto)],
          ['Deduções', reais(o.receita.previsto_deducoes), reais(o.receita.realizado_deducoes), reais(o.receita.realizado_deducoes - o.receita.previsto_deducoes)],
          ['Receita líquida', reais(o.receita.previsto_liquido), reais(o.receita.realizado_liquido), reais(o.receita.realizado_liquido - o.receita.previsto_liquido)],
        ]}
      />
      <Tabela
        titulo="Custos: previsto x realizado por item"
        cols={[{ h: 'Item' }, { h: 'Categoria' }, { h: 'Previsto', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }, { h: 'Realizado', num: true }, { h: 'Diferença', num: true }, { h: 'Situação' }]}
        rows={o.itens.map((i) => [
          <>
            {i.item}
            {i.estimativa ? ' (E)' : ''}
            {i.minimo !== null && i.maximo !== null && i.minimo !== i.maximo && (
              <small className="g-sub">
                Faixa {reais(i.minimo)} a {reais(i.maximo)}
              </small>
            )}
          </>,
          NOMES_CATEGORIAS[i.categoria],
          reais(i.previsto),
          reais(i.previsto_partes.FESB),
          reais(i.previsto_partes.CHD),
          reais(i.realizado),
          reais(i.diferenca),
          <Badge s={sit(i)} />,
        ])}
        foot={cats.map((c) => [`Total ${NOMES_CATEGORIAS[c].toLowerCase()}`, '', reais(o.totais[c].previsto), '', '', reais(o.totais[c].realizado), reais(o.totais[c].previsto - o.totais[c].realizado), ''])}
      />
      <p className="hint">
        Teto de tráfego no mês: {reais(o.trafego.teto)} ({pcBp(o.trafego.bp)} da receita líquida do mês anterior); realizado {reais(o.trafego.realizado)}.
        Acumulado até o mês: previsto {reais(o.acumulado.previsto)}, realizado {reais(o.acumulado.realizado)}.
      </p>
      {o.fora_do_orcamento.length > 0 && (
        <Tabela titulo="Lançamentos fora do orçamento" cols={[{ h: 'Item' }, { h: 'Realizado', num: true }]} rows={o.fora_do_orcamento.map((x) => [x.item, reais(x.realizado)])} />
      )}
      {f && <Fila f={f} />}
    </>
  );
}

function Fila({ f }: { f: Quitacao }) {
  return (
    <section className="g-card">
      <H title="Fila de quitação">
        Antes da divisão: ordem 0, devolução dos aportes e dos custos pagos pelas Partes; depois, a implantação na ordem abaixo.
      </H>
      <Tabela
        titulo="Ordem 0: créditos das Partes"
        cols={[{ h: 'Parte' }, { h: 'A devolver', num: true }, { h: 'Devolvido até o mês', num: true }]}
        rows={(['FESB', 'CHD'] as const).map((p) => [p, reais(f.creditos_pendentes[p]), reais(f.devolvido_acumulado[p])])}
      />
      <Tabela
        titulo="Implantação, na ordem de quitação"
        cols={[{ h: 'Ordem' }, { h: 'Item' }, { h: 'Vence' }, { h: 'Base', num: true }, { h: 'Realizado', num: true }, { h: 'Reservado', num: true }, { h: 'Saldo', num: true }, { h: 'Situação' }]}
        rows={f.itens.map((i) => [
          String(i.ordem ?? '-'),
          <>
            {i.item}
            {i.estimativa ? ' (E)' : ''}
            {i.minimo !== null && i.maximo !== null && i.minimo !== i.maximo && (
              <small className="g-sub">
                Faixa {reais(i.minimo)} a {reais(i.maximo)}
              </small>
            )}
          </>,
          rotuloComp(i.competencia),
          reais(i.base),
          reais(i.realizado),
          reais(i.reservado),
          reais(i.saldo),
          <Badge s={i.situacao} />,
        ])}
      />
    </section>
  );
}

/* 3. Lançamentos: incluir, anexar comprovante e estornar */

function situacaoLanc(x: { estorno_de: number | null; estornado_por: number | null }) {
  if (x.estorno_de) return `Estorno do nº ${x.estorno_de}`;
  if (x.estornado_por) return `Estornado pelo nº ${x.estornado_por}`;
  return 'Ativo';
}

async function pedirEstorno(estornar: (motivo: string, comp?: string) => Promise<unknown>): Promise<string> {
  const motivo = window.prompt('Motivo do estorno (fica na trilha de auditoria):')?.trim();
  if (!motivo) return '';
  try {
    await estornar(motivo);
    return '';
  } catch (e) {
    if (e instanceof ApiErro && e.status === 409 && /publicada/.test(e.message)) {
      const comp = window.prompt(`${e.message}\nCompetência do estorno (AAAA-MM):`)?.trim();
      if (!comp) return '';
      try {
        await estornar(motivo, comp);
        return '';
      } catch (e2) {
        return e2 instanceof ApiErro ? e2.message : 'Falha no estorno.';
      }
    }
    return e instanceof ApiErro ? e.message : 'Falha no estorno.';
  }
}

function Lancamentos({ mes }: { mes: string }) {
  const lista = useDados(() => gestaoApi.lancamentos(mes), [mes]);
  const orc = useDados(() => gestaoApi.orcamento(mes), [mes]);
  const [msg, setMsg] = useState('');
  const estornar = async (x: Lancamento) => {
    setMsg(await pedirEstorno((motivo, comp) => gestaoApi.estornar(x.id, motivo, comp)));
    lista.recarregar();
  };
  return (
    <>
      <H title={`Lançamentos · ${rotuloComp(mes)}`}>Custos e receitas realizados. Nada se apaga: corrigir é estornar e lançar de novo.</H>
      <NovoLancamento mes={mes} itens={orc.dados?.itens_disponiveis ?? []} onFeito={lista.recarregar} />
      {msg && <p className="g-alert">{msg}</p>}
      {lista.dados ? (
        <Tabela
          titulo="Lançamentos da competência"
          cols={[{ h: 'Nº' }, { h: 'Data' }, { h: 'Tipo' }, { h: 'Item' }, { h: 'Valor ou bruto', num: true }, { h: 'Líquido', num: true }, { h: 'Pago por' }, { h: 'Comprovante' }, { h: 'Lançado por' }, { h: 'Situação' }]}
          rows={lista.dados.map((x) => [
            String(x.id),
            x.data,
            x.tipo === 'custo' ? `Custo · ${NOMES_CATEGORIAS[x.categoria as Categoria] ?? ''}` : `Receita · ${NOMES_LINHAS[x.linha as LinhaReceita] ?? ''}`,
            <>
              {x.item}
              {x.observacao && <small className="g-sub">{x.observacao}</small>}
              {x.id_externo && <small className="g-sub">Id externo: {x.id_externo}</small>}
            </>,
            reais(x.valor_centavos),
            x.tipo === 'receita' ? reais(x.liquido_centavos) : '',
            x.pago_por,
            x.comprovante ? (
              <a className="link" href={gestaoApi.urlComprovante(x.id)}>
                {x.comprovante.nome}
              </a>
            ) : (
              <AnexarDepois id={x.id} onFeito={lista.recarregar} />
            ),
            <>
              {x.criado_por}
              <small className="g-sub">{x.criado_em}</small>
            </>,
            <span className="g-acts">
              <Badge s={situacaoLanc(x)} />
              {!x.estorno_de && !x.estornado_por && (
                <button className="btn btn--ghost btn--sm" onClick={() => estornar(x)}>
                  Estornar
                </button>
              )}
            </span>,
          ])}
        />
      ) : (
        <Carregando erro={lista.erro} />
      )}
    </>
  );
}

function AnexarDepois({ id, onFeito }: { id: number; onFeito: () => void }) {
  const [erro, setErro] = useState('');
  return (
    <label className="g-file">
      Anexar
      <input
        type="file"
        accept="application/pdf,image/png,image/jpeg,image/webp"
        onChange={async (e) => {
          const arq = e.target.files?.[0];
          if (!arq) return;
          try {
            await gestaoApi.anexar(id, arq);
            onFeito();
          } catch (err) {
            setErro(err instanceof ApiErro ? err.message : 'Falha no envio.');
          }
        }}
      />
      {erro && <small className="g-sub">{erro}</small>}
    </label>
  );
}

function NovoLancamento({ mes, itens, onFeito }: { mes: string; itens: string[]; onFeito: () => void }) {
  const vazio = { tipo: 'custo' as 'custo' | 'receita', data: hojeBrasilia(), competencia: mes, item: '', categoria: 'fixo' as Categoria, linha: 'curso' as LinhaReceita, valor: '', gateway: '', impostos: '', reembolsos: '', pago_por: 'PARCERIA' as 'PARCERIA' | 'FESB' | 'CHD', id_externo: '', observacao: '' };
  const [f, setF] = useState(vazio);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');
  const [enviando, setEnviando] = useState(false);
  useEffect(() => setF((x) => ({ ...x, competencia: mes })), [mes]);
  const campo = (k: keyof typeof vazio) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setOk('');
    const valor = paraCentavos(f.valor) ?? (f.tipo === 'receita' && !f.valor ? 0 : null);
    const ded = [f.gateway, f.impostos, f.reembolsos].map((v) => (v ? paraCentavos(v) : 0));
    if (valor === null || ded.some((d) => d === null)) {
      setErro('Valores em reais, com vírgula para os centavos (ex.: 1.234,56).');
      return;
    }
    setEnviando(true);
    try {
      const novo = await gestaoApi.lancar(
        f.tipo === 'custo'
          ? { tipo: 'custo', data: f.data, competencia: f.competencia, item: f.item, categoria: f.categoria, valor_centavos: valor, pago_por: f.pago_por, observacao: f.observacao }
          : {
              tipo: 'receita',
              data: f.data,
              competencia: f.competencia,
              linha: f.linha,
              item: f.item,
              valor_centavos: valor,
              gateway_centavos: ded[0] ?? 0,
              impostos_centavos: ded[1] ?? 0,
              reembolsos_centavos: ded[2] ?? 0,
              id_externo: f.id_externo || undefined,
              observacao: f.observacao,
            },
      );
      if (arquivo) {
        try {
          await gestaoApi.anexar(novo.id, arquivo);
        } catch (err) {
          setErro(`Lançamento nº ${novo.id} gravado, mas o comprovante não: ${err instanceof ApiErro ? err.message : 'falha no envio'}.`);
        }
      }
      setOk(`Lançamento nº ${novo.id} gravado.`);
      setF({ ...vazio, competencia: f.competencia, tipo: f.tipo });
      setArquivo(null);
      onFeito();
    } catch (err) {
      setErro(err instanceof ApiErro ? err.message : 'Falha ao gravar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="g-card form g-form" onSubmit={enviar}>
      <H title="Novo lançamento" />
      <div className="g-form__grid">
        <label>
          Tipo
          <select value={f.tipo} onChange={campo('tipo')}>
            <option value="custo">Custo</option>
            <option value="receita">Receita</option>
          </select>
        </label>
        <label>
          Data
          <input type="date" required value={f.data} onChange={campo('data')} />
        </label>
        <label>
          Competência
          <input type="month" required value={f.competencia} onChange={campo('competencia')} />
        </label>
        {f.tipo === 'custo' ? (
          <>
            <label>
              Categoria
              <select value={f.categoria} onChange={campo('categoria')}>
                {(Object.keys(NOMES_CATEGORIAS) as Categoria[]).map((c) => (
                  <option key={c} value={c}>
                    {NOMES_CATEGORIAS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="g-form__largo">
              Item (use o nome do orçamento para casar previsto x realizado)
              <input list="itens-orcamento" required maxLength={200} value={f.item} onChange={campo('item')} />
              <datalist id="itens-orcamento">
                {itens.map((i) => (
                  <option key={i} value={i} />
                ))}
              </datalist>
            </label>
            <label>
              Valor (R$)
              <input inputMode="decimal" required placeholder="0,00" value={f.valor} onChange={campo('valor')} />
            </label>
            <label>
              Quem pagou
              <select value={f.pago_por} onChange={campo('pago_por')}>
                <option value="PARCERIA">Conta da parceria (receita)</option>
                <option value="FESB">FESB (vira crédito da FESB)</option>
                <option value="CHD">CHD (vira crédito do CHD)</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label>
              Linha
              <select value={f.linha} onChange={campo('linha')}>
                {(Object.keys(NOMES_LINHAS) as LinhaReceita[]).map((l) => (
                  <option key={l} value={l}>
                    {NOMES_LINHAS[l]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Bruto (R$)
              <input inputMode="decimal" placeholder="0,00" value={f.valor} onChange={campo('valor')} />
            </label>
            <label>
              Gateway (R$)
              <input inputMode="decimal" placeholder="0,00" value={f.gateway} onChange={campo('gateway')} />
            </label>
            <label>
              Impostos (R$)
              <input inputMode="decimal" placeholder="0,00" value={f.impostos} onChange={campo('impostos')} />
            </label>
            <label>
              Reembolsos e chargebacks (R$)
              <input inputMode="decimal" placeholder="0,00" value={f.reembolsos} onChange={campo('reembolsos')} />
            </label>
            <label>
              Id externo (opcional, único)
              <input maxLength={100} value={f.id_externo} onChange={campo('id_externo')} />
            </label>
          </>
        )}
        <label className="g-form__largo">
          Observação
          <input maxLength={1000} value={f.observacao} onChange={campo('observacao')} />
        </label>
        <label>
          Comprovante (PDF, PNG, JPEG ou WEBP)
          <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={(e) => setArquivo(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      {erro && <p className="g-alert">{erro}</p>}
      {ok && <p className="hint">{ok}</p>}
      <div>
        <button className="btn btn--primary" type="submit" disabled={enviando}>
          {enviando ? 'Gravando...' : 'Lançar'}
        </button>
      </div>
    </form>
  );
}

/* 4. Aportes */

function Aportes() {
  const lista = useDados(() => gestaoApi.aportes(), []);
  const [f, setF] = useState({ parte: 'FESB' as 'FESB' | 'CHD', data: hojeBrasilia(), valor: '', observacao: '' });
  const [erro, setErro] = useState('');
  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    const valor = paraCentavos(f.valor);
    if (!valor) {
      setErro('Informe o valor em reais, com vírgula para os centavos.');
      return;
    }
    try {
      await gestaoApi.aportar({ parte: f.parte, data: f.data, valor_centavos: valor, observacao: f.observacao });
      setF({ ...f, valor: '', observacao: '' });
      lista.recarregar();
    } catch (err) {
      setErro(err instanceof ApiErro ? err.message : 'Falha ao gravar.');
    }
  };
  const estornar = async (a: Aporte) => {
    setErro(await pedirEstorno((motivo, comp) => gestaoApi.estornarAporte(a.id, motivo, comp)));
    lista.recarregar();
  };
  const soma = (p: 'FESB' | 'CHD') => (lista.dados ?? []).filter((a) => a.parte === p).reduce((s, a) => s + a.valor_centavos, 0);
  return (
    <>
      <H title="Aportes das Partes">Dinheiro posto na conta da parceria. Volta a quem aportou antes da divisão (ordem 0 da quitação).</H>
      <form className="g-card form g-form" onSubmit={enviar}>
        <H title="Novo aporte" />
        <div className="g-form__grid">
          <label>
            Parte
            <select value={f.parte} onChange={(e) => setF({ ...f, parte: e.target.value as 'FESB' | 'CHD' })}>
              <option value="FESB">FESB</option>
              <option value="CHD">CHD</option>
            </select>
          </label>
          <label>
            Data
            <input type="date" required value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} />
          </label>
          <label>
            Valor (R$)
            <input inputMode="decimal" required placeholder="0,00" value={f.valor} onChange={(e) => setF({ ...f, valor: e.target.value })} />
          </label>
          <label className="g-form__largo">
            Observação
            <input maxLength={1000} value={f.observacao} onChange={(e) => setF({ ...f, observacao: e.target.value })} />
          </label>
        </div>
        {erro && <p className="g-alert">{erro}</p>}
        <div>
          <button className="btn btn--primary" type="submit">
            Registrar aporte
          </button>
        </div>
      </form>
      {lista.dados ? (
        <Tabela
          titulo="Aportes registrados"
          cols={[{ h: 'Nº' }, { h: 'Data' }, { h: 'Competência' }, { h: 'Parte' }, { h: 'Valor', num: true }, { h: 'Observação' }, { h: 'Registrado por' }, { h: 'Situação' }]}
          rows={lista.dados.map((a) => [
            String(a.id),
            a.data,
            rotuloComp(a.competencia),
            a.parte,
            reais(a.valor_centavos),
            a.observacao,
            <>
              {a.criado_por}
              <small className="g-sub">{a.criado_em}</small>
            </>,
            <span className="g-acts">
              <Badge s={situacaoLanc(a)} />
              {!a.estorno_de && !a.estornado_por && (
                <button className="btn btn--ghost btn--sm" onClick={() => estornar(a)}>
                  Estornar
                </button>
              )}
            </span>,
          ])}
          foot={[['', '', '', 'Total FESB', reais(soma('FESB')), '', '', ''], ['', '', '', 'Total CHD', reais(soma('CHD')), '', '', '']]}
        />
      ) : (
        <Carregando erro={lista.erro} />
      )}
    </>
  );
}

/* 5. Prestação de contas */

function PrestacaoAba({ mes, gestor }: { mes: string; gestor: Gestor }) {
  const { dados: p, erro, recarregar } = useDados(() => gestaoApi.prestacao(mes), [mes]);
  const [motivo, setMotivo] = useState('');
  const [msg, setMsg] = useState('');
  if (!p) return <Carregando erro={erro} />;
  const d = p.publicada ?? p.atual;
  const acao = async (f: () => Promise<unknown>) => {
    setMsg('');
    try {
      await f();
      setMotivo('');
      recarregar();
    } catch (e) {
      setMsg(e instanceof ApiErro ? e.message : 'Falha na operação.');
    }
  };
  return (
    <article className="g-doc">
      <div className="g-doc__acts g-noprint">
        <Badge s={p.status.texto} />
        <a className="btn btn--ghost btn--sm" href={gestaoApi.urlCsv(mes)}>
          Exportar CSV
        </a>
        <button className="btn btn--ghost btn--sm" onClick={() => window.print()}>
          Imprimir
        </button>
        {gestor.papel === 'FESB' && p.pode_publicar && (
          <button className="btn btn--primary btn--sm" onClick={() => window.confirm('Publicar a prestação de contas? Abre o prazo de contestação.') && acao(() => gestaoApi.publicar(mes))}>
            Publicar
          </button>
        )}
      </div>
      {msg && <p className="g-alert g-noprint">{msg}</p>}
      {gestor.papel === 'CHD' && p.status.codigo === 'em_contestacao' && (
        <form
          className="g-card form g-noprint"
          onSubmit={(e) => {
            e.preventDefault();
            acao(() => gestaoApi.contestar(mes, motivo));
          }}
        >
          <label>
            Contestar a prestação (até {p.status.prazo_contestacao})
            <textarea required minLength={3} maxLength={5000} rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </label>
          <div>
            <button className="btn btn--primary btn--sm" type="submit">
              Registrar contestação
            </button>
          </div>
        </form>
      )}
      {p.status.codigo === 'contestada' && p.status.motivo && (
        <p className="g-alert">
          Contestada por {p.status.contestada_por}: {p.status.motivo}
        </p>
      )}
      <DemonstrativoDoc d={d} status={p.status} publicada={!!p.publicada} versoes={p.versoes.length} />
    </article>
  );
}

function DemonstrativoDoc({ d, status, publicada, versoes }: { d: Demonstrativo; status: Prestacao['status']; publicada: boolean; versoes: number }) {
  const cols: Col[] = [{ h: 'Linha' }, { h: 'Bruto', num: true }, { h: 'Gateway', num: true }, { h: 'Impostos', num: true }, { h: 'Reembolsos e chargebacks', num: true }, { h: 'Líquido', num: true }];
  const t = d.receitas_total;
  return (
    <>
      <header className="g-doc__head">
        <p className="eyebrow eyebrow--dark">Demonstrativo mensal</p>
        <h1>Parceria digital CHD + FESB · competência {d.rotulo}</h1>
        <p className="hint">
          {publicada
            ? `Fotografia publicada em ${status.publicada_em} por ${status.publicada_por}${versoes > 1 ? ` (versão ${status.versao})` : ''}. ${status.texto}.`
            : `Prévia emitida em ${d.emitido_em}; ainda não publicada.`}{' '}
          Valores em reais. Degrau {d.degrau}. Receita na conta do titular: {d.titular_conta}.
        </p>
      </header>

      <h2 className="g-doc__sec">1. Receita bruta, deduções e receita líquida por linha</h2>
      <Tabela
        titulo="Linhas digitais"
        cols={cols}
        rows={d.receitas.map((r) => [r.nome, reais(r.bruto), reais(r.gateway), reais(r.impostos), reais(r.reembolsos), reais(r.liquido)])}
        foot={[['Total', reais(t.bruto), reais(t.gateway), reais(t.impostos), reais(t.reembolsos), reais(t.liquido)]]}
      />

      <h2 className="g-doc__sec">2. Custos da parceria (50/50) e aportes</h2>
      <Tabela
        titulo="Custos do mês"
        cols={[{ h: 'Item' }, { h: 'Pago por' }, { h: 'Valor', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
        rows={d.custos.map((c) => [`${c.categoria_nome}: ${c.item}`, c.pago_por, reais(c.valor), reais(c.FESB), reais(c.CHD)])}
        foot={[
          ['Total de custos', '', reais(d.custos_total.operacionais + d.custos_total.implantacao), reais(d.custos_total.FESB), reais(d.custos_total.CHD)],
          ['Aportes no mês', '', reais(d.aportes.FESB + d.aportes.CHD), reais(d.aportes.FESB), reais(d.aportes.CHD)],
        ]}
      />

      <h2 className="g-doc__sec">3. Quitação antes da divisão</h2>
      <Tabela
        titulo="Devoluções e reservas"
        cols={[{ h: 'Item' }, { h: 'Total', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
        rows={[
          ['Devolução de aportes e custos pagos pelas Partes', reais(d.devolvido.FESB + d.devolvido.CHD), reais(d.devolvido.FESB), reais(d.devolvido.CHD)],
          ...d.reserva_implantacao.map((r) => [`Reserva para implantação: ${r.item}`, reais(r.valor), '', '']),
        ]}
      />

      <h2 className="g-doc__sec">4. Divisão</h2>
      <dl className="g-dl">
        <dt>Receita líquida digital</dt>
        <dd>{reais(t.liquido)}</dd>
        <dt>Resultado do mês (líquido menos custos operacionais)</dt>
        <dd>
          {reais(d.resultado)} · FESB {reais(d.resultado_partes.FESB)} · CHD {reais(d.resultado_partes.CHD)}
        </dd>
        <dt className="g-dl__strong">Resultado a dividir (após quitação)</dt>
        <dd className="g-dl__strong">{reais(d.base)}</dd>
        <dt>FESB ({pcBp(d.divisao_fesb_bp)})</dt>
        <dd>{reais(d.divisao.FESB)}</dd>
        <dt>CHD ({pcBp(10000 - d.divisao_fesb_bp)})</dt>
        <dd>{reais(d.divisao.CHD)}</dd>
        <dt>Livro: recebido pelo CHD</dt>
        <dd>{reais(d.livro.recebido)}</dd>
        <dt>Livro: participação FESB ({pcBp(d.livro.percentual_fesb_bp)})</dt>
        <dd>{reais(d.livro.FESB)}</dd>
        <dt className="g-dl__strong">Total FESB</dt>
        <dd className="g-dl__strong">{reais(d.totais.FESB)}</dd>
        <dt className="g-dl__strong">Total CHD</dt>
        <dd className="g-dl__strong">{reais(d.totais.CHD)}</dd>
      </dl>

      <h2 className="g-doc__sec">5. Repasses</h2>
      <Tabela titulo="Repasses do mês" cols={[{ h: 'De' }, { h: 'Para' }, { h: 'Valor', num: true }]} rows={d.repasses.map((r) => [r.de, r.para, reais(r.valor)])} />

      <h2 className="g-doc__sec">6. Posição ao fim do mês</h2>
      <Tabela
        titulo="Créditos e caixa"
        cols={[{ h: 'Item' }, { h: 'Total', num: true }, { h: 'FESB', num: true }, { h: 'CHD', num: true }]}
        rows={[
          ['Créditos a devolver às Partes', reais(d.posicao.creditos_pendentes.FESB + d.posicao.creditos_pendentes.CHD), reais(d.posicao.creditos_pendentes.FESB), reais(d.posicao.creditos_pendentes.CHD)],
          ['Caixa a descoberto (aporte necessário)', reais(d.posicao.descoberto), reais(d.posicao.aporte_necessario.FESB), reais(d.posicao.aporte_necessario.CHD)],
          ['Caixa ao fim do mês', reais(d.caixa.final), '', ''],
        ]}
      />
      <p className="hint">
        A FESB publica até o dia 5 do mês seguinte; o CHD tem 10 dias para contestar e, sem contestação, a prestação é aprovada (minuta, cláusula 8.4).
        Fora da parceria (eventos, mentoria, turmas, palestras, consultoria) não entra neste demonstrativo.
      </p>
      <div className="g-sign">
        <div>CHD</div>
        <div>FESB</div>
      </div>
    </>
  );
}
