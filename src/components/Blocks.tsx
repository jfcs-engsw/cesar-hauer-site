import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LIVRO, SITE } from '../content/site';

// Entrada de seção: sobe 16 px uma única vez. Com redução de movimento, nada anima.
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? 'reveal--in' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  lead,
  tone,
  children,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  tone?: 'muted' | 'dark';
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`section ${tone ? `section--${tone}` : ''}`} data-tone={tone === 'dark' ? 'dark' : undefined}>
      <Reveal className="container">
        {(eyebrow || title || lead) && (
          <header className="section__head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section__title">{title}</h2>}
            {lead && <p className="section__lead">{lead}</p>}
          </header>
        )}
        {children}
      </Reveal>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function Cards({ items, cols = 3 }: { items: { title: string; text: ReactNode; tag?: string }[]; cols?: 2 | 3 | 4 }) {
  return (
    <div className={`cards cards--${cols}`}>
      {items.map((c) => (
        <article key={c.title} className="card">
          {c.tag && <p className="card__tag">{c.tag}</p>}
          <h3 className="card__title">{c.title}</h3>
          <p className="card__text">{c.text}</p>
        </article>
      ))}
    </div>
  );
}

export function Stats({ items, source }: { items: { value: string; label: string }[]; source?: string }) {
  return (
    <div>
      <dl className="stats">
        {items.map((s) => (
          <div key={s.label} className="stat">
            <dt className="stat__label">{s.label}</dt>
            <dd className="stat__value">{s.value}</dd>
          </div>
        ))}
      </dl>
      {source && <p className="stats__source">{source}</p>}
    </div>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="faq">
      {items.map(([q, a]) => (
        <details key={q} className="faq__item">
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: [string, string][] }) {
  return (
    <ol className="steps">
      {items.map(([t, d], i) => (
        <li key={t} className="step">
          <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ContactBand({ title, text, to, label }: { title: string; text: string; to: string; label: string }) {
  return (
    <section className="band">
      <div className="container band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link to={to} className="btn btn--accent btn--lg">
          {label}
        </Link>
      </div>
    </section>
  );
}

// Foto do acervo do CHD (05-Fotos, IMG_2208), recortada em 4:5 e com luz e cor corrigidas, sem alterar o rosto.
// Alternativas em 02-Insumos Novos Cesar/Candidatas Foto Site; trocar só o arquivo em public/fotos.
export function Portrait({ caption }: { caption?: string }) {
  return (
    <figure className="portrait">
      <div className="portrait__frame">
        <img
          className="portrait__photo"
          src={`${import.meta.env.BASE_URL}fotos/chd-oficial.webp`}
          alt="Cesar Hauer Doetzer"
          width={900}
          height={1125}
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// Capa do livro enviada pelo CHD em 25/11/2026 (LIVRO.capa).
export function BookCover() {
  return (
    <img
      className="book-cover"
      src={`${import.meta.env.BASE_URL}${LIVRO.capa}`}
      alt={`Capa do livro ${LIVRO.titulo}, de ${SITE.nome}`}
      width={640}
      height={927}
      loading="lazy"
    />
  );
}
