import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV = [
  ['/sobre', 'Sobre'],
  ['/metodo', 'Método PARSIFAL'],
  ['/cursos', 'Cursos'],
  ['/palestras', 'Palestras'],
  ['/livro', 'Livro'],
  ['/consultoria', 'Consultoria'],
  ['/blog', 'Artigos'],
] as const;

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Cesar Hauer, página inicial">
      <span className="logo__mark">CH</span>
      <span className="logo__name">
        Cesar Hauer
        <small>Investimentos com método</small>
      </span>
    </Link>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div className="proto-banner" role="note">
        Protótipo para avaliação. Pagamentos, agendamentos e área do aluno são simulados.
      </div>
      <header className="header">
        <div className="container header__inner">
          <Logo />
          <button className="header__toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Fechar' : 'Menu'}
          </button>
          <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Principal">
            {NAV.map(([to, label]) => (
              <NavLink key={to} to={to} className="nav__link">
                {label}
              </NavLink>
            ))}
            <Link to="/portal" className="btn btn--ghost btn--sm">
              Área do aluno
            </Link>
            <Link to="/consultoria/agendar" className="btn btn--accent btn--sm">
              Agendar consultoria
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer" data-tone="dark">
      <div className="container footer__grid">
        <div>
          <Logo />
          <p className="footer__lead">
            Consultoria de valores mobiliários, educação financeira e palestras. Curitiba, atendimento em todo o
            Brasil.
          </p>
        </div>
        <FooterCol title="Conteúdo">
          <Link to="/cursos">Cursos</Link>
          <Link to="/metodo">Método PARSIFAL</Link>
          <Link to="/livro">Livro</Link>
          <Link to="/blog">Artigos</Link>
        </FooterCol>
        <FooterCol title="Serviços">
          <Link to="/consultoria">Consultoria</Link>
          <Link to="/consultoria/agendar">Agendar uma sessão</Link>
          <Link to="/palestras">Palestras e eventos</Link>
          <Link to="/contato">Contato</Link>
        </FooterCol>
        <FooterCol title="Legal">
          <Link to="/legal/avisos">Avisos regulatórios</Link>
          <Link to="/legal/privacidade">Privacidade (LGPD)</Link>
          <Link to="/legal/termos">Termos de uso</Link>
        </FooterCol>
      </div>
      <div className="container footer__legal">
        <p>
          O conteúdo deste site tem caráter educacional e não constitui recomendação de investimento. Rentabilidade
          passada não é garantia de rentabilidade futura. Consultoria de valores mobiliários prestada nos termos da
          Resolução CVM 19/2021.
        </p>
        <p>© {new Date().getFullYear()} Cesar Hauer. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="footer__col">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
