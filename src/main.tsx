import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import '@fontsource-variable/inter';
import '@fontsource-variable/source-serif-4';
import './styles.css';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { Blog, Contato, Cursos, Legal, Livro, Metodo, NotFound, Palestras, Post, Sobre } from './pages/Institucional';
import { Checkout, CursoVenda, Sucesso } from './pages/Curso';
import { PortalAula, PortalCurso, PortalHome } from './pages/Portal';
import { PortalPreviaAula, PortalPreviaHome } from './pages/PortalPrevia';
import { Agendar, Consultoria } from './pages/Consultoria';
import PainelRedirect from './pages/PainelRedirect';
import Configuracoes from './pages/Configuracoes';

// HashRouter: o GitHub Pages não reescreve rotas. Na hospedagem definitiva, troca por rotas limpas.
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
          <Route path="cursos/:slug" element={<CursoVenda />} />
          <Route path="checkout/sucesso" element={<Sucesso />} />
          <Route path="checkout/:slug" element={<Checkout />} />
          <Route path="portal" element={<PortalHome />} />
          <Route path="portal/configuracoes" element={<Configuracoes />} />
          <Route path="portal/curso/:cursoId" element={<PortalCurso />} />
          <Route path="portal/curso/:cursoId/aula/:aulaId" element={<PortalAula />} />
          <Route path="portal/previa" element={<PortalPreviaHome />} />
          <Route path="portal/:slug/:aula?" element={<PortalPreviaAula />} />
          <Route path="consultoria" element={<Consultoria />} />
          <Route path="consultoria/agendar" element={<Agendar />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Post />} />
          <Route path="contato" element={<Contato />} />
          <Route path="legal/:page" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
