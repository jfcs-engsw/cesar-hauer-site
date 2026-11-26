import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/Blocks';
import { YOUTUBE } from '../content/site';

// Vídeos do canal do CHD no lugar da antiga seção de artigos (pedido do CHD de 25/11/2026). O player embute a
// lista de uploads do canal (id do canal com "UC" trocado por "UU"), pelo domínio sem cookies do YouTube: cada
// vídeo novo aparece sozinho, sem script nem chave. Sem o id do canal, a página mostra um aviso.

export const canalConfigurado = Boolean(YOUTUBE.canalId);

export function PlayerCanal() {
  const lista = `UU${YOUTUBE.canalId.slice(2)}`;
  return (
    <div className="video-frame">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/videoseries?list=${lista}`}
        title="Vídeos do canal de Cesar Hauer Doetzer no YouTube"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function Videos() {
  return (
    <>
      <PageHero
        eyebrow="Vídeos"
        title="Educação financeira em vídeo"
        lead="Fundamentos, carteira e comportamento do investidor, no canal do YouTube."
      />
      <Section>
        {canalConfigurado ? (
          <div className="videos">
            <PlayerCanal />
            <p>
              <a className="btn btn--primary" href={YOUTUBE.canalUrl} target="_blank" rel="noopener noreferrer">
                Ver todos os vídeos no YouTube
              </a>
            </p>
            <p className="disclaimer">Conteúdo educacional. Não constitui recomendação de investimento.</p>
          </div>
        ) : (
          <div className="em-breve" role="note">
            <p className="em-breve__titulo">Vídeos em breve</p>
            <p>
              Os vídeos do canal serão publicados aqui nos próximos dias. Enquanto isso, conheça o{' '}
              <Link to="/livro">livro</Link> e entre na <Link to="/lista-de-espera">lista de espera</Link>.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
