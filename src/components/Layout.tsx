import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { canalConfigurado } from '../pages/Videos';

const NAV = [
  ['/sobre', 'Sobre'],
  ['/metodo', 'Método PARSIFAL'],
  ['/cursos', 'Cursos'],
  ['/palestras', 'Palestras'],
  ['/livro', 'Livro'],
  ['/consultoria', 'Consultoria'],
  ...(canalConfigurado ? [['/videos', 'Vídeos'] as const] : []),
] as const;

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Cesar Hauer Doetzer, página inicial">
      <span className="logo__mark">CHD</span>
      <span className="logo__name">
        Cesar Hauer Doetzer
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
            <Link to="/lista-de-espera" className="btn btn--accent btn--sm">
              Lista de espera
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
          <Link to="/livro">Livro</Link>
          <Link to="/metodo">Método PARSIFAL</Link>
          <Link to="/cursos">Cursos</Link>
          <Link to="/lista-de-espera">Lista de espera</Link>
          {canalConfigurado && <Link to="/videos">Vídeos</Link>}
        </FooterCol>
        <FooterCol title="Serviços">
          <Link to="/consultoria">Consultoria</Link>
          <Link to="/palestras">Palestras e eventos</Link>
          <Link to="/contato">Contato</Link>
          <Link to="/portal">Área do aluno</Link>
        </FooterCol>
        <FooterCol title="Legal">
          <Link to="/avisos">Avisos regulatórios</Link>
          <Link to="/privacidade">Política de privacidade</Link>
          <Link to="/termos">Termos de uso</Link>
        </FooterCol>
      </div>
      <div className="container footer__legal">
        <p>
          O conteúdo deste site tem caráter educacional e não constitui recomendação de investimento. Rentabilidade
          passada não é garantia de rentabilidade futura. Consultoria de valores mobiliários prestada nos termos da
          Resolução CVM 19/2021.
        </p>
        <p>
          © {new Date().getFullYear()} Cesar Hauer Doetzer. Todos os direitos reservados.
        </p>
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
