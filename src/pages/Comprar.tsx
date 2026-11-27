import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHero, Section } from '../components/Blocks';
import { api, ApiErro, type ProdutoAVenda } from '../lib/api';
import { brl } from '../lib/util';

// Compra pelo checkout do Asaas (A011, issue FSEB-SW/chd-plataforma-api#27). O que está à venda vem da API
// (CHECKOUT_PRODUTOS); fora disso a página mostra "indisponível". Sem link a partir do site enquanto a oferta não
// for decidida com o CHD: chega-se pelo endereço /#/comprar/CODIGO. O pagamento (Pix ou cartão) é na fatura do
// Asaas; a matrícula sai do webhook, e o aluno recebe o e-mail para criar a senha.

type Forma = 'PIX' | 'CREDIT_CARD';

export function Comprar() {
  const { produto: codigo } = useParams();
  const [produto, setProduto] = useState<ProdutoAVenda | null | undefined>(undefined);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [forma, setForma] = useState<Forma>('PIX');
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    api
      .produtosAVenda()
      .then((lista) => setProduto(lista.find((p) => p.codigo === codigo) ?? null))
      .catch(() => setProduto(null));
  }, [codigo]);

  const pagar = async (e: FormEvent) => {
    e.preventDefault();
    if (!produto) return;
    setOcupado(true);
    setErro('');
    try {
      const r = await api.abrirPedido({
        produto: produto.codigo,
        nome: nome.trim(),
        email: email.trim(),
        cpf_cnpj: documento,
        forma,
        aceite,
      });
      window.location.assign(r.url);
    } catch (err) {
      setErro(err instanceof ApiErro && err.status !== 0 ? err.message : 'Pagamento indisponível no momento.');
      setOcupado(false);
    }
  };

  if (produto === undefined)
    return (
      <Section>
        <p className="hint">Carregando...</p>
      </Section>
    );

  if (produto === null)
    return (
      <>
        <PageHero eyebrow="Compra" title="Compra indisponível" lead="Este produto não está à venda neste momento." />
        <Section>
          <div className="cards cards--2">
            <article className="card">
              <p className="card__text">Entre na lista de espera para receber a abertura das inscrições.</p>
              <Link to="/lista-de-espera" className="btn btn--accent btn--block">
                Entrar na lista de espera
              </Link>
            </article>
          </div>
        </Section>
      </>
    );

  return (
    <>
      <PageHero eyebrow="Compra" title={produto.nome} lead={`${brl(produto.preco_centavos / 100)} em Pix ou cartão de crédito.`} />
      <Section>
        <div className="cards cards--2">
          <article className="card">
            <h2 className="card__title">Seus dados</h2>
            <form className="form" onSubmit={pagar}>
              <label>
                Nome completo
                <input required minLength={2} maxLength={200} autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />
              </label>
              <label>
                E-mail (será o seu acesso à área do aluno)
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                CPF ou CNPJ
                <input required inputMode="numeric" maxLength={18} value={documento} onChange={(e) => setDocumento(e.target.value)} />
              </label>
              <fieldset>
                <legend>Forma de pagamento</legend>
                <label className="check">
                  <input type="radio" name="forma" checked={forma === 'PIX'} onChange={() => setForma('PIX')} />
                  Pix
                </label>
                <label className="check">
                  <input type="radio" name="forma" checked={forma === 'CREDIT_CARD'} onChange={() => setForma('CREDIT_CARD')} />
                  Cartão de crédito
                </label>
              </fieldset>
              <label className="check">
                <input type="checkbox" required checked={aceite} onChange={(e) => setAceite(e.target.checked)} />
                <span>
                  Li e aceito os <Link to="/termos">termos de uso</Link> e a <Link to="/privacidade">política de privacidade</Link>.
                </span>
              </label>
              {erro && (
                <p className="portal-erro" role="alert">
                  {erro}
                </p>
              )}
              <button className="btn btn--accent btn--block" disabled={ocupado}>
                {ocupado ? 'Abrindo o pagamento...' : `Pagar ${brl(produto.preco_centavos / 100)}`}
              </button>
            </form>
          </article>
          <article className="card">
            <h2 className="card__title">Como funciona</h2>
            <p className="card__text">
              O pagamento é feito na página segura do Asaas, nossa plataforma de pagamentos. Os dados do cartão são digitados
              lá e não passam por este site.
            </p>
            <p className="card__text">
              Confirmado o pagamento, a matrícula é liberada na hora e você recebe um e-mail para criar a sua senha da área
              do aluno. Também é possível entrar com o Google usando o mesmo e-mail.
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}
