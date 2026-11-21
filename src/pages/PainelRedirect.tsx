import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// A gestão da parceria saiu do site e virou um app próprio, num subdomínio (FSEB-SW/chd-painel).
// Com VITE_PAINEL_URL no build, /#/gestao leva para lá; sem ela, mostra o aviso.
const PAINEL = import.meta.env.VITE_PAINEL_URL as string | undefined;

export default function PainelRedirect() {
  useEffect(() => {
    if (PAINEL) window.location.replace(PAINEL);
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section__title">A gestão da parceria mudou de endereço</h1>
        <p className="hint">
          {PAINEL ? 'Levando você ao painel de gestão...' : 'O painel de gestão agora fica num endereço próprio, informado às pessoas da parceria.'}
        </p>
        <Link to="/" className="link">
          Voltar ao site
        </Link>
      </div>
    </section>
  );
}
