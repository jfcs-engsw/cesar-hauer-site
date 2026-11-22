// Dados do site que mudam sem mexer em componente. Nenhum segredo aqui: só endereços públicos.

export const SITE = {
  // Domínio definitivo, comprado pelo Cesar no Registro.br (docs/deploy/dominio-cesarhauer-com-br.md).
  url: 'https://cesarhauer.com.br',
  nome: 'Cesar Hauer Doetzer',
};

export const LIVRO = {
  titulo: 'Educação Financeira: A Tríade do Capital',
  editora: 'Editora CRV',
  primeiraEdicao: 2019,
  // Lançamento da edição revisada: evento de 30/11/2026.
  lancamento: '30 de novembro de 2026',
  // Link de compra no site da editora. Vazio até o Cesar mandar: a página mostra o aviso "em breve".
  linkEditora: '',
};

export const LISTA_ESPERA = {
  curso: 'Formação de Investidores',
  // Formulário hospedado da Brevo (lista "Tríade do Capital: lista de espera"), publicado em 22/11/2026.
  // Endereço público do formulário, sem chave (docs/deploy/lista-de-espera-brevo.md).
  // Confirmação em duas etapas pendente de verificar o telefone na conta da Brevo; até lá, sem e-mail de confirmação.
  formUrl: 'https://2d04463e.sibforms.com/serve/MUIFAA0nFgBRVlkDCK0Ijbyd6dZjljAQ67br-CZSH3sMGXDjB5pIjZsJYa4RXV2TyCQ4pDbZHbXs_Pxm2Y0iAVpPCAPevJPf4_ORVzRYjPXWq-zTDMfIkjxlxndOSSOkgIzCAsCHhbHzIojjRTSPqxKN2Wm7jPnH65dLxgrWWoEmyX9IFvBV2Mzqro_2ch7Q2VOhV9Xcedt4lsrqQw==',
  // Altura do quadro embutido. Ajustar depois de ver o formulário publicado.
  formAltura: 620,
};

export const CONTATO = {
  // E-mail público de contato, a confirmar com o Cesar. Vazio: a página não mostra endereço.
  email: '',
  linkedin: '',
  instagram: '',
};
