import { Link } from 'react-router-dom';
import { Cards, ContactBand, Faq, PageHero, Section, Steps } from '../components/Blocks';

// Consultoria: apresentação do serviço. A contratação é por contato direto; agenda e pagamento online
// ficam para uma etapa futura, fora deste site.
export function Consultoria() {
  return (
    <>
      <PageHero
        eyebrow="Consultoria de valores mobiliários"
        title="Uma análise do seu patrimônio, com recomendação para o seu caso"
        lead="Consultor registrado na CVM. Sessões individuais por videoconferência, com análise do seu perfil e recomendação personalizada."
      >
        <div className="hero__actions">
          <Link to="/contato" className="btn btn--accent btn--lg">
            Entrar em contato
          </Link>
        </div>
      </PageHero>
      <Section eyebrow="Formatos" title="Como a consultoria funciona">
        <Cards
          items={[
            { tag: 'Sessão avulsa', title: 'Diagnóstico', text: 'Análise da carteira, dúvidas pontuais ou segunda opinião sobre uma decisão.' },
            { tag: 'Pacote', title: 'Planejamento patrimonial', text: 'Série de sessões para montar ou reorganizar a carteira com o Método PARSIFAL.' },
            { tag: 'Recorrente', title: 'Acompanhamento contínuo', text: 'Para patrimônios maiores, com remuneração sobre o patrimônio sob consultoria. Sob consulta.' },
          ]}
        />
      </Section>
      <Section tone="muted" eyebrow="Passo a passo" title="Do contato à reunião">
        <Steps
          items={[
            ['Contato', 'Conte o seu objetivo e o tamanho aproximado do patrimônio pela página de contato.'],
            ['Conversa inicial', 'Uma conversa curta para entender o caso e confirmar se a consultoria é o serviço certo.'],
            ['Proposta', 'Você recebe a proposta com formato, prazo e investimento.'],
            ['Reunião', 'Sessões individuais por videoconferência, com resumo por escrito depois de cada uma.'],
          ]}
        />
      </Section>
      <Section eyebrow="Dúvidas" title="Perguntas frequentes">
        <Faq
          items={[
            ['A sessão inclui recomendação de investimento?', 'Sim. A consultoria é o serviço regulado em que a recomendação personalizada é feita, após a análise do seu perfil (suitability).'],
            ['Preciso instalar algum programa?', 'Não. A reunião abre pelo navegador; o aplicativo é opcional.'],
            ['Há conflito de interesse?', 'Qualquer posição do consultor nos ativos discutidos é informada na sessão.'],
          ]}
        />
      </Section>
      <ContactBand title="Pronto para conversar?" text="Escreva contando o seu objetivo. Resposta em até dois dias úteis." to="/contato" label="Entrar em contato" />
    </>
  );
}
