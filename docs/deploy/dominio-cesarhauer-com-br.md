# Domínio cesarhauer.com.br: passo a passo

Documento em duas partes. A primeira é para o Cesar, em linguagem simples: comprar o domínio no nome dele e apontar para o servidor do site. A segunda é técnica, para quem publica o site.

O domínio fica no nome do Cesar, no Registro.br, e é dele: quem o compra é o titular, e titular não muda com prestador de serviço. O site continua respondendo também pelo endereço provisório `cesarhauer.76-13-230-98.sslip.io` até a troca completa.

## Parte 1: para o Cesar

Você vai precisar de uns 20 minutos, do seu CPF, de um cartão ou Pix (o registro custa R$ 40,00 por ano no Registro.br) e de um endereço de e-mail que você acessa.

### 1. Criar a conta e comprar o domínio (segunda, 23/11)

1. Entre em **https://registro.br** e clique em **Entrar** (canto superior direito). Se ainda não tem conta, clique em **Criar conta**: informe CPF, nome, e-mail e um endereço. Confirme o e-mail que eles mandam.
2. Na busca da página inicial, digite **cesarhauer.com.br** e clique em **Buscar**. Se aparecer como disponível, clique em **Registrar**.
3. Escolha o período (1 ano é suficiente; dá para renovar depois, e o Registro.br avisa por e-mail antes de vencer). Pague com cartão ou Pix.
4. O domínio aparece no seu painel em alguns minutos, em **Meus domínios**. Pode levar até algumas horas para ficar ativo na internet; isso é normal.

Se "cesarhauer.com.br" já estiver ocupado, avise o Julio antes de escolher outro nome: o site, os e-mails e o QR code do evento usam o endereço.

### 2. Apontar o domínio para o servidor do site

Depois do registro, no painel do Registro.br:

1. Em **Meus domínios**, clique em **cesarhauer.com.br**.
2. Procure a seção **DNS** e clique em **Alterar servidores DNS** (ou **Configurar endereçamento**, conforme a tela). Escolha a opção **Utilizar os servidores DNS do Registro.br**. Confirme.
3. Agora clique em **Editar zona** (ou **Modo avançado**). É aqui que se diz para onde o endereço aponta. Adicione dois registros, um de cada vez, com **Adicionar registro** (ou **Nova entrada**):

   | Campo "Nome" (ou "Host") | Tipo | Campo "Dados" (ou "Valor") |
   |---|---|---|
   | deixe em branco | **A** | `76.13.230.98` |
   | `www` | **A** | `76.13.230.98` |

   O primeiro faz `cesarhauer.com.br` funcionar; o segundo faz `www.cesarhauer.com.br` funcionar também. Não crie registro do tipo AAAA.
4. Clique em **Salvar** (ou **Publicar alterações**). O Registro.br mostra um aviso de que a publicação leva alguns minutos; na prática, de 15 minutos a algumas horas.
5. Avise o Julio quando terminar (uma mensagem "DNS feito" basta). Ele liga o certificado de segurança (o cadeado do HTTPS) do lado do servidor, e o endereço **https://cesarhauer.com.br** passa a abrir o seu site.

### 3. Opcional, mas recomendado: dar acesso técnico ao Julio

Mais adiante o site vai precisar de registros extras no DNS (para o e-mail de lista de espera chegar na caixa de entrada e não no spam). Para você não precisar fazer isso a cada vez:

1. Peça ao Julio o **ID** dele no Registro.br (é um código no formato `XXXXX`).
2. No painel do domínio, em **Contatos**, altere o **Contato técnico** para o ID dele e confirme.

O titular do domínio continua sendo você. O contato técnico só consegue mexer na configuração de DNS; não pode transferir nem vender o domínio.

### O que não fazer

- Não compre "proteção de privacidade", "e-mail profissional" nem "site pronto" oferecidos durante a compra. Nada disso é necessário.
- Não altere os servidores DNS para outro provedor (Hostinger, GoDaddy, Cloudflare etc.) sem combinar com o Julio.

## Parte 2: técnica (quem publica)

### O que o script faz

`deploy/vps-deploy.sh` (roda na VPS) mantém o bloco do endereço provisório e, **só quando o DNS de `cesarhauer.com.br` e de `www.cesarhauer.com.br` já resolvem para o IP da VPS** (`76.13.230.98`), acrescenta ao `~/proxy-fesb/Caddyfile`:

```
cesarhauer.com.br {
	encode zstd gzip
	reverse_proxy /api/* 127.0.0.1:8082
	reverse_proxy 127.0.0.1:8081
}
www.cesarhauer.com.br {
	redir https://cesarhauer.com.br{uri} permanent
}
```

Por que esperar o DNS: o Caddy pede o certificado Let's Encrypt assim que lê o bloco; sem o DNS apontando, a emissão falha e entra em espera com recuo exponencial, e repetir isso consome a cota de falhas do Let's Encrypt. Com o DNS no lugar, o certificado sai em menos de um minuto, sem nenhum passo manual.

O `/api/*` vai para a `chd-plataforma-api`, como no endereço provisório. A `vps-publicar-chd.sh` da API continua editando apenas o bloco do endereço provisório (ela procura a linha exata `cesarhauer.76-13-230-98.sslip.io {`); os dois blocos convivem.

### Sequência

1. Cesar registra o domínio e aponta o DNS (Parte 1).
2. Conferir de fora, de qualquer máquina: `nslookup cesarhauer.com.br` e `nslookup www.cesarhauer.com.br` devem devolver `76.13.230.98`.
3. Na máquina do Julio, publicar o site (o script detecta o DNS e acrescenta o bloco). A chave SSH é
   resolvida dentro do `deploy/publicar-site.sh`, nunca na linha de comando (guarda de envios, ADR-0071):

   ```
   bash ~/fesb/FSEB-SW/cesar-hauer-site/deploy/publicar-site.sh          # deploy
   bash ~/fesb/FSEB-SW/cesar-hauer-site/deploy/publicar-site.sh status   # Caddyfile, certificados, containers
   ```

4. Conferir: `curl -I https://cesarhauer.com.br/` deve dar 200 e `curl -I https://www.cesarhauer.com.br/` deve redirecionar (301) para o apex.

   Executado em 24/11/2026 (09h11, Brasília): DNS propagado, blocos acrescentados, certificado emitido, site no ar em https://cesarhauer.com.br.
5. Gerar o QR code do evento apontando para `https://cesarhauer.com.br`.

### Pendências para dezembro (fora do congelamento de 28/11)

- API: `SITE_URL` no `.env` da VPS ainda é o endereço provisório; o link mágico da área do aluno volta para lá. Troca-se com `SITE_HOST=cesarhauer.com.br` na publicação da API (ajuste no `publicar-chd.sh`, que hoje não repassa a variável) quando a área do aluno for aberta.
- E-mail: SPF, DKIM e DMARC do domínio para a Brevo e a caixa Hostinger, conforme `deploy/README.md` da `chd-plataforma-api`. Até lá, a lista de espera dispara pela conta Brevo do WAIS, com remetente dela.
- Retirar o bloco `sslip.io` do Caddyfile quando o QR code e todos os links já usarem o domínio.
