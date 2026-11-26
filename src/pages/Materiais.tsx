import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/Blocks';

// Materiais gratuitos e apostila para pais e filhos (pedido do CHD de 25/11/2026; avaliação no doc 26 do
// dnn2-consultoria-investimentos). Todos "em breve" até a revisão e a aprovação do CHD: os downloads entram em
// troca do e-mail e a apostila, à venda, depois do checkout.

const MATERIAIS = [
  {
    tag: 'Gratuito · edição 2026 em revisão',
    titulo: 'Dicionário do Investidor',
    texto: 'Ação, CDI, duration, P/L, tag along: os termos do extrato e do noticiário, explicados de forma direta por Cesar Hauer.',
  },
  {
    tag: 'Amostra gratuita · em breve',
    titulo: 'Ensine seu filho a cuidar do dinheiro: os 3 primeiros dias',
    texto: 'Três histórias e três atividades para fazer com seu filho: o que é dinheiro, poupar e separar desejo de necessidade.',
  },
  {
    tag: 'Apostila para pais e filhos · em breve',
    titulo: 'Ensine seu filho a cuidar do dinheiro em 30 dias',
    texto: 'Um mês de histórias e atividades em família, sem sermão e sem exigir mesada: poupar, juros, dívida, inflação e paciência.',
  },
];

export default function Materiais() {
  return (
    <>
      <PageHero
        eyebrow="Materiais"
        title="Materiais de educação financeira"
        lead="Guias para quem está começando e uma apostila para aprender sobre dinheiro em família. Entre na lista de espera e receba primeiro."
      />
      <Section>
        <div className="cards cards--3">
          {MATERIAIS.map((m) => (
            <article key={m.titulo} className="card">
              <p className="card__tag">{m.tag}</p>
              <h3 className="card__title">{m.titulo}</h3>
              <p className="card__text">{m.texto}</p>
              <Link to="/lista-de-espera" className="btn btn--ghost btn--block">
                Quero ser avisado
              </Link>
            </article>
          ))}
        </div>
        <p className="disclaimer">Conteúdo educacional. Não constitui recomendação de investimento.</p>
      </Section>
    </>
  );
}
