import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import './marca-chd/tokens.css';
import './styles.css';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { Blog, Contato, Cursos, Livro, Metodo, NotFound, Palestras, Post, Sobre } from './pages/Institucional';
import { Avisos, Privacidade, Termos } from './pages/Legais';
import { CursoEmBreve } from './pages/Curso';
import ListaDeEspera from './pages/ListaDeEspera';
import { PortalAula, PortalCurso, PortalHome } from './pages/Portal';
import { Consultoria } from './pages/Consultoria';
import PainelRedirect from './pages/PainelRedirect';
import Configuracoes from './pages/Configuracoes';

// Endereços antigos /legal/... continuam funcionando (QR codes e links já distribuídos).
function LegalAntigo() {
  const { page = '' } = useParams();
  const destino: Record<string, string> = { avisos: '/avisos', privacidade: '/privacidade', termos: '/termos' };
  return destino[page] ? <Navigate to={destino[page]} replace /> : <NotFound />;
}

// HashRouter: o nginx do container e o GitHub Pages não reescrevem rotas. Rotas limpas ficam para depois.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="gestao/*" element={<PainelRedirect />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="metodo" element={<Metodo />} />
          <Route path="livro" element={<Livro />} />
          <Route path="palestras" element={<Palestras />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path="cursos/:slug" element={<CursoEmBreve />} />
          <Route path="lista-de-espera" element={<ListaDeEspera />} />
          <Route path="portal" element={<PortalHome />} />
          <Route path="portal/configuracoes" element={<Configuracoes />} />
          <Route path="portal/curso/:cursoId" element={<PortalCurso />} />
          <Route path="portal/curso/:cursoId/aula/:aulaId" element={<PortalAula />} />
          <Route path="consultoria" element={<Consultoria />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Post />} />
          <Route path="contato" element={<Contato />} />
          <Route path="privacidade" element={<Privacidade />} />
          <Route path="termos" element={<Termos />} />
          <Route path="avisos" element={<Avisos />} />
          <Route path="legal/:page" element={<LegalAntigo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
