import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/Blocks';
import { LISTA_ESPERA } from '../content/site';

// Lista de espera do curso, pelo formulário hospedado da Brevo (lista "Tríade do Capital: lista de espera",
// confirmação em duas etapas e consentimento LGPD configurados lá). O site só embute o endereço público do
// formulário: nenhuma chave da Brevo passa pelo navegador.

export function FormularioListaDeEspera({ compacto = false }: { compacto?: boolean }) {
  if (!LISTA_ESPERA.formUrl) {
    return (
      <div className="waitlist waitlist--aviso">
        <p>
          A inscrição na lista de espera abre em breve neste endereço. Enquanto isso, fale com a gente pela página de{' '}
          <Link to="/contato">contato</Link>.
        </p>
      </div>
    );
  }
  return (
    <div className={`waitlist ${compacto ? 'waitlist--compacto' : ''}`}>
      <iframe
        className="waitlist__frame"
        title={`Lista de espera do curso ${LISTA_ESPERA.curso}`}
        src={LISTA_ESPERA.formUrl}
        height={LISTA_ESPERA.formAltura}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      />
      <p className="hint">
        Se o formulário não aparecer,{' '}
        <a href={LISTA_ESPERA.formUrl} target="_blank" rel="noopener noreferrer">
          abra-o em uma nova aba
        </a>
        . Ao se inscrever, você receberá um e-mail para confirmar o cadastro; só depois da confirmação o seu endereço
        entra na lista. Saiba como tratamos os seus dados na <Link to="/privacidade">política de privacidade</Link>.
      </p>
    </div>
  );
}

export default function ListaDeEspera() {
  return (
    <>
      <PageHero
        eyebrow="Lista de espera"
        title={`Seja avisado da abertura do curso ${LISTA_ESPERA.curso}`}
        lead="Quem está na lista recebe primeiro a data de abertura, as condições de lançamento e conteúdo preparatório. Sem compromisso de compra."
      />
      <Section>
        <div className="split">
          <div className="prose">
            <h2>O que você recebe</h2>
            <ul>
              <li>A data de abertura das inscrições antes da divulgação geral.</li>
              <li>As condições de lançamento, reservadas a quem está na lista.</li>
              <li>Conteúdo de preparação: artigos e aulas abertas sobre o Método PARSIFAL.</li>
            </ul>
            <p className="disclaimer">
              Conteúdo educacional. Não constitui recomendação de investimento. Você pode sair da lista a qualquer
              momento pelo link presente em cada e-mail.
            </p>
          </div>
          <FormularioListaDeEspera />
        </div>
      </Section>
    </>
  );
}
