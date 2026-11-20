import type { ReactNode } from 'react';

// Peças visuais comuns ao painel de gestão (dados reais) e à demonstração (dados simulados).

export function H({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="g-head">
      <h2>{title}</h2>
      {children && <p className="hint">{children}</p>}
    </header>
  );
}

export type Col = { h: string; num?: boolean };

export function Tabela({ titulo, cols, rows, foot }: { titulo: string; cols: Col[]; rows: ReactNode[][]; foot?: ReactNode[][] }) {
  return (
    <div className="g-table-wrap">
      <table className="g-table">
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th className="g-num">#</th>
            {cols.map((c, i) => (
              <th key={`${c.h}-${i}`} className={c.num ? 'g-num' : undefined}>
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
          {rows.length === 0 && (
            <tr>
              <td />
              <td colSpan={cols.length} className="hint">
                Nada registrado.
              </td>
            </tr>
          )}
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

export function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: ReactNode; tone?: 'fesb' | 'chd' }) {
  return (
    <div className={`g-kpi ${tone ? `g-kpi--${tone}` : ''}`}>
      <p className="g-kpi__label">{label}</p>
      <p className="g-kpi__value">{value}</p>
      {sub && <p className="g-kpi__sub">{sub}</p>}
    </div>
  );
}

export function Badge({ s }: { s: string }) {
  const tone = /Atingido|Pago|Quitado|Aprovada|Devolvido/.test(s)
    ? 'ok'
    : /Revisão|Abaixo de 70|Contestada|Acima do teto|Estornado|descoberto/.test(s)
      ? 'bad'
      : /tolerância|Previsto|Em quitação|Em contestação|Reserv|Bloqueado|Na fila|Estorno/.test(s)
        ? 'warn'
        : 'neutral';
  return <span className={`g-badge g-badge--${tone}`}>{s}</span>;
}
