import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/Blocks';
import { LISTA_ESPERA } from '../content/site';

// Páginas legais. Texto PROVISÓRIO, escrito pela equipe do site; as versões definitivas vêm da revisão
// jurídica (Mike Ross) e substituem os parágrafos abaixo sem mudar as rotas: /privacidade, /termos, /avisos.

const PROVISORIO = 'Versão provisória de 22/11/2026, em revisão jurídica. A versão definitiva será publicada neste mesmo endereço.';

function Documento({ eyebrow, titulo, atualizado, children }: { eyebrow: string; titulo: string; atualizado: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={titulo} lead={`Última atualização: ${atualizado}.`} />
      <Section>
        <div className="prose prose--narrow">
          <p className="placeholder-note">{PROVISORIO}</p>
          {children}
        </div>
      </Section>
    </>
  );
}

export function Privacidade() {
  return (
    <Documento eyebrow="Legal" titulo="Política de privacidade" atualizado="22/11/2026">
      <h2>Quem trata os seus dados</h2>
      <p>
        Este site é de Cesar Hauer Doetzer, que responde pelo tratamento dos dados pessoais coletados aqui, nos termos da
        Lei Geral de Proteção de Dados (Lei 13.709/2018). Pedidos sobre os seus dados podem ser feitos pelos canais da
        página de <Link to="/contato">contato</Link>.
      </p>
      <h2>Quais dados coletamos e para quê</h2>
      <ul>
        <li>
          <strong>Lista de espera do curso {LISTA_ESPERA.curso}:</strong> nome e e-mail, para avisar sobre a abertura do
          curso e enviar conteúdo relacionado. Base legal: consentimento, dado no formulário e confirmado pelo próprio
          e-mail (confirmação em duas etapas). Você pode sair da lista a qualquer momento pelo link presente em cada
          mensagem.
        </li>
        <li>
          <strong>Área do aluno:</strong> nome, e-mail, dados de acesso e progresso nas aulas, para prestar o serviço
          contratado. Base legal: execução de contrato.
        </li>
        <li>
          <strong>Contato:</strong> os dados que você mesmo enviar ao escrever para nós, para responder ao pedido.
        </li>
      </ul>
      <h2>Com quem compartilhamos</h2>
      <p>
        Usamos fornecedores para operar o site: hospedagem, envio de e-mail (Brevo, para a lista de espera e os avisos da
        área do aluno) e, quando houver venda, o processador de pagamentos. Cada um trata os dados só para o serviço
        contratado. Não vendemos dados pessoais.
      </p>
      <h2>Por quanto tempo guardamos</h2>
      <p>
        Dados da lista de espera ficam até você se descadastrar. Dados da área do aluno ficam enquanto durar o acesso ao
        curso e pelo prazo exigido por obrigações legais e fiscais.
      </p>
      <h2>Seus direitos</h2>
      <p>
        Você pode pedir confirmação do tratamento, acesso, correção, anonimização, portabilidade, eliminação e informação
        sobre compartilhamento, e revogar o consentimento. Respondemos pelos canais da página de contato.
      </p>
      <h2>Cookies</h2>
      <p>
        O site usa apenas o cookie necessário à sessão da área do aluno. Não usamos cookies de publicidade. O formulário
        da lista de espera é fornecido pela Brevo e segue a política de privacidade dela.
      </p>
    </Documento>
  );
}

export function Termos() {
  return (
    <Documento eyebrow="Legal" titulo="Termos de uso" atualizado="22/11/2026">
      <h2>Conteúdo do site</h2>
      <p>
        Textos, artigos, vídeos e materiais publicados aqui têm caráter educacional e são protegidos por direitos
        autorais. É permitido compartilhar links; a reprodução do conteúdo depende de autorização.
      </p>
      <h2>Cursos e área do aluno</h2>
      <p>
        O acesso a um curso é pessoal e intransferível, pelo prazo informado na página do curso. As condições de compra,
        garantia e reembolso são publicadas junto com a oferta, quando o curso for aberto.
      </p>
      <h2>Lista de espera</h2>
      <p>
        Entrar na lista de espera não gera obrigação de compra nem reserva de vaga; serve para você ser avisado da
        abertura e das condições de lançamento.
      </p>
      <h2>Imagem e depoimentos</h2>
      <p>
        A imagem, o nome e a voz de Cesar Hauer Doetzer são usados neste site com a autorização dele. Depoimentos de
        alunos ou clientes só são publicados com autorização expressa de quem os deu.
      </p>
    </Documento>
  );
}

export function Avisos() {
  return (
    <Documento eyebrow="Legal" titulo="Avisos regulatórios" atualizado="22/11/2026">
      <p>
        O conteúdo de cursos, artigos, vídeos e palestras tem caráter exclusivamente educacional e não constitui oferta,
        solicitação ou recomendação de investimento.
      </p>
      <p>
        A recomendação personalizada é prestada apenas no serviço de consultoria de valores mobiliários, nos termos da
        Resolução CVM 19/2021, após a análise do perfil do cliente.
      </p>
      <p>
        Rentabilidade passada não é garantia de rentabilidade futura. Investimentos envolvem riscos, inclusive de perda
        do capital investido.
      </p>
    </Documento>
  );
}
