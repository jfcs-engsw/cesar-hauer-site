# Lista de espera do curso: formulário na Brevo

O site embute o formulário hospedado da Brevo (`src/pages/ListaDeEspera.tsx`, endereço em `LISTA_ESPERA.formUrl` de `src/content/site.ts`). Nenhuma chave da Brevo passa pelo navegador nem pelo repositório: o endereço do formulário é público por natureza. Confirmação em duas etapas e consentimento LGPD são configurados na própria Brevo, que guarda a prova do consentimento (data, IP e texto aceito).

Conta: a da frente Win the AI Shift (`julio@wintheaishift.com`). O remetente do CHD é tema de dezembro (depende do domínio e de SPF, DKIM e DMARC); até lá a lista só capta, com o remetente da conta.

## Roteiro na Brevo (Julio, cerca de 15 minutos)

1. **Lista:** Contatos, Listas, Criar uma lista: nome `Tríade do Capital: lista de espera`, pasta `CHD` (criar se não houver).
2. **Atributo opcional:** Contatos, Configurações, Atributos de contato: conferir que existe `NOME` (texto). Se o padrão da conta for `FIRSTNAME`, usar o que existir.
3. **Formulário:** Contatos, Formulários, Criar um formulário de inscrição, nome `CHD: lista de espera do curso`.
   - Campos: `E-mail` (obrigatório) e `Nome` (opcional).
   - Caixa de consentimento (obrigatória) com o texto: `Concordo em receber e-mails sobre a abertura do curso Formação de Investidores e conteúdo relacionado, e li a política de privacidade (https://cesarhauer.com.br/#/privacidade). Posso cancelar a qualquer momento pelo link presente em cada mensagem.`
   - Botão: `Quero ser avisado`.
   - Aparência: fundo branco, sem borda (o site já desenha a moldura), fonte padrão, cor do botão `#C9A45C` com texto `#0B1F1E` (dourado e petróleo da marca CHD).
4. **Configurações do formulário:** em Lista, escolher `Tríade do Capital: lista de espera`. Em Confirmação, marcar **Confirmação dupla (double opt-in)**; usar o modelo de e-mail de confirmação padrão da conta, com o assunto `Confirme a sua inscrição na lista de espera`. Mensagem de sucesso: `Quase lá: confirme a inscrição pelo e-mail que acabamos de enviar.` Após a confirmação, redirecionar para `https://cesarhauer.com.br/#/lista-de-espera`.
5. **Publicar** e, em Compartilhar, copiar o **link do formulário** (hospedado, formato `https://xxxxxxxx.sibforms.com/serve/...`). Não copiar o código HTML nem o "embed rápido": o site usa só o link.
6. Colar o link em `LISTA_ESPERA.formUrl` (`src/content/site.ts`), ajustar `formAltura` se o formulário ficar cortado no quadro, abrir PR e publicar. Enquanto `formUrl` estiver vazio, o site mostra um aviso, nunca um formulário morto.

## Depois (dezembro)

- Remetente do CHD (domínio autenticado) e e-mail de confirmação com a marca CHD.
- Sequência de boas-vindas e janela de pré-venda (issue 26 do `dnn2-consultoria-investimentos`).
- Exportar a lista para a subconta ou conta do CHD, se a decisão de dezembro pedir separação de contas.
