# Site Cesar Hauer (protótipo)

Primeira proposta visual do site de apresentação do Cesar Hauer: consultor de valores mobiliários, professor, palestrante e autor. Projeto FESB DNN2 (FSEB-SW/dnn2-consultoria-investimentos#8).

Publicado para avaliação em https://jfcs-engsw.github.io/cesar-hauer-site/ (fora de buscadores).

## O que tem

| Área | Estado |
|---|---|
| Início, Sobre, Método PARSIFAL, Livro, Palestras, Cursos, Artigos, Contato, legais | Layout e textos provisórios |
| Página de venda do curso Formação de Investidores | Programa real (59 aulas em 13 módulos, a partir do acervo) |
| Checkout (PIX e cartão parcelado) | Simulado no navegador; nenhuma cobrança |
| Área do aluno (`/#/portal`): login por link mágico, meus cursos, módulos com progresso, aula com player, concluir | Real, servida pela API `chd-plataforma-api` em `/api` (FSEB-SW/dnn2-consultoria-investimentos#17); sem a API no ar, aponta para a prévia em `/#/portal/previa` (layout com progresso no navegador) |
| Agenda de consultoria (horário, dados, pagamento, confirmação com .ics) | Simulada; link do Teams de exemplo |
| Gestão da parceria CHD + FESB (`/#/gestao`, link discreto no rodapé): visão geral, orçamento (previsto x realizado e fila de quitação), lançamentos com comprovante e estorno, aportes, prestação de contas com exportação CSV | Dados reais da `chd-plataforma-api` (`/api/gestao`) com Entrar com Google e lista fechada de e-mails; sem sessão, mostra a entrada e o link para a demonstração |
| Demonstração do painel (`/#/gestao/demo`): visão geral, receitas, custos por degrau, prestação de contas, funil e metas | Dados simulados determinísticos em `src/content/gestao.ts`, com taxas e custos do docs/18 |

## Fica para as próximas etapas

Gateway de pagamento, servidor de pedidos e agenda, reunião criada pelo Microsoft Graph na conta Microsoft 365 do Cesar, vídeos no Bunny Stream, marca, domínio, fotos autorizadas e textos legais revisados.

## Rodar

```
npm install
npm run dev
```

A área do aluno chama a API em `VITE_API_BASE` (padrão `/api`, mesmo domínio). Em `npm run dev`, o Vite encaminha `/api` para a `chd-plataforma-api` em `http://127.0.0.1:8000` (instruções no README dela). Nenhum segredo vai para este repositório: a sessão é um cookie HttpOnly emitido pela API.

## Publicação na VPS FESB

Container `cesar-hauer-site` (nginx, só em `127.0.0.1:8081`) atrás do Caddy `proxy-fesb` (stack em `~/proxy-fesb` na VPS, HTTPS automático). Endereço provisório por DNS curinga: `cesarhauer.76-13-230-98.sslip.io`. Para publicar ou atualizar, na VPS:

```
bash ~/cesar-hauer-site/deploy/vps-deploy.sh
```
