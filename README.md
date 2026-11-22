# Site Cesar Hauer Doetzer

Site de apresentação do Cesar Hauer Doetzer: consultor de valores mobiliários, professor, palestrante e autor. Projeto FESB DNN2 (FSEB-SW/dnn2-consultoria-investimentos#8). Marca CHD v0.1.0 do `fesb-design-system` (ADR-0004).

Endereço definitivo: `https://cesarhauer.com.br` (domínio do Cesar, no Registro.br). Até a troca do DNS, também em `https://cesarhauer.76-13-230-98.sslip.io`. Cópia de avaliação no GitHub Pages (`https://jfcs-engsw.github.io/cesar-hauer-site/`), publicada pelo workflow a cada push na `main`.

## O que tem

| Área | Estado |
|---|---|
| Início, Sobre, Método PARSIFAL, Palestras, Artigos, Contato | Publicado. Textos de bio e método a validar com o Cesar; canais de contato entram em `src/content/site.ts` (`CONTATO`) |
| Livro (`/#/livro`) | Publicado. O botão de compra aparece quando `LIVRO.linkEditora` (`src/content/site.ts`) for preenchido; até lá, aviso "link de compra em breve" |
| Cursos e página do curso Formação de Investidores (`/#/cursos/formacao-de-investidores`) | "Em breve": programa real (59 aulas em 13 módulos) e lista de espera, sem preço nem matrícula |
| Lista de espera (`/#/lista-de-espera`) | Formulário hospedado da Brevo embutido (`LISTA_ESPERA.formUrl`); confirmação em duas etapas e consentimento LGPD na Brevo. Roteiro em `docs/deploy/lista-de-espera-brevo.md` |
| Política de privacidade, termos de uso e avisos regulatórios (`/#/privacidade`, `/#/termos`, `/#/avisos`) | Texto provisório marcado, aguardando a revisão jurídica. `/#/legal/...` redireciona |
| Área do aluno (`/#/portal`): login por link mágico, meus cursos, módulos com progresso, aula com player, configurações | Real, servida pela API `chd-plataforma-api` em `/api` (FSEB-SW/dnn2-consultoria-investimentos#17); sem a API, mostra "em implantação". Link só no rodapé enquanto o curso não abre |
| Gestão | Saiu do site: é o app próprio `FSEB-SW/chd-painel`. `/#/gestao` leva ao painel quando o build tem `VITE_PAINEL_URL` |

Saíram em 22/11/2026 (issue #12): checkout e agenda simulados, prévia da área do aluno e formulário de contato simulado. Nenhum link do site leva a eles.

## Fica para as próximas etapas

Gateway de pagamento e checkout real (decisão do Cesar em dezembro), agenda de consultoria, vídeos no Bunny Stream, remetente de e-mail do CHD (SPF, DKIM e DMARC), fotos oficiais e textos legais revisados.

## Rodar

```
npm install
npm run dev
npm run build   # tsc estrito + Vite; é a verificação do repositório
```

A área do aluno chama a API em `VITE_API_BASE` (padrão `/api`, mesmo domínio). Em `npm run dev`, o Vite encaminha `/api` para a `chd-plataforma-api` em `http://127.0.0.1:8000`. Nenhum segredo vai para este repositório: a sessão é um cookie HttpOnly emitido pela API, e o formulário da Brevo é um endereço público.

## Publicação na VPS FESB

Container `cesar-hauer-site` (nginx, só em `127.0.0.1:8081`) atrás do Caddy `proxy-fesb` (stack em `~/proxy-fesb` na VPS, HTTPS automático). Para publicar ou atualizar, da máquina do Julio:

```
ssh -i ~/.ssh/sig_deploy root@76.13.230.98 'bash ~/cesar-hauer-site/deploy/vps-deploy.sh'
```

O script é idempotente: atualiza o clone, reconstrói o container e, quando o DNS de `cesarhauer.com.br` e `www` já aponta para a VPS, acrescenta o bloco do domínio ao Caddyfile (certificado automático; `www` redireciona para o apex). Passo a passo do domínio, inclusive a parte do Cesar no Registro.br: `docs/deploy/dominio-cesarhauer-com-br.md`. A publicação conjunta com API e painel (`publicar-chd.sh` da `chd-plataforma-api`) também chama este script.
