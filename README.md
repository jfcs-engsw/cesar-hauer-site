# Site Cesar Hauer (protótipo)

Primeira proposta visual do site de apresentação do Cesar Hauer: consultor de valores mobiliários, professor, palestrante e autor. Projeto FESB DNN2 (FSEB-SW/dnn2-consultoria-investimentos#8).

Publicado para avaliação em https://jfcs-engsw.github.io/cesar-hauer-site/ (fora de buscadores).

## O que tem

| Área | Estado |
|---|---|
| Início, Sobre, Método PARSIFAL, Livro, Palestras, Cursos, Artigos, Contato, legais | Layout e textos provisórios |
| Página de venda do curso Formação de Investidores | Programa real (59 aulas em 13 módulos, a partir do acervo) |
| Checkout (PIX e cartão parcelado) | Simulado no navegador; nenhuma cobrança |
| Área do aluno (curso, módulos, aula, progresso) | Layout; sem login; progresso salvo no navegador |
| Agenda de consultoria (horário, dados, pagamento, confirmação com .ics) | Simulada; link do Teams de exemplo |
| Gestão da parceria CHD + FESB (`/#/gestao`, link discreto no rodapé): visão geral, receitas, custos por degrau, prestação de contas imprimível, funil e metas | Entrada simulada, sem login real; dados simulados determinísticos em `src/content/gestao.ts` |

## Fica para as próximas etapas

Gateway de pagamento, servidor de pedidos e agenda, reunião criada pelo Microsoft Graph na conta Microsoft 365 do Cesar, login e proteção dos vídeos, marca, domínio, fotos autorizadas e textos legais revisados.

## Rodar

```
npm install
npm run dev
```

## Publicação na VPS FESB

Container `cesar-hauer-site` (nginx, só em `127.0.0.1:8081`) atrás do Caddy `proxy-fesb` (stack em `~/proxy-fesb` na VPS, HTTPS automático). Endereço provisório por DNS curinga: `cesarhauer.76-13-230-98.sslip.io`. Para publicar ou atualizar, na VPS:

```
bash ~/cesar-hauer-site/deploy/vps-deploy.sh
```
