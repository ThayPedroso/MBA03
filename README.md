# MBA03

A API REST desenvolvida foi uma aplicação para postar artigos onde os usuários podem criar um usuário, fazer login e utilizando um token gerado podem visualizar os posts, podem ainda criar novos posts e editar e deletar um post desde que sejam os autores do referido post. Os artigos foram persistidos em banco de dados não relacional chamado MongoDB que armazena dados em documentos.

Cada post é composto de um título, um conteúdo textual e uma imagem. Para upload das imagens foi utilizado o Multer que é um middleware que facilita o tratamento de uploads de arquivos em aplicações web sendo frequentemente utilizado junto com o Express.js.
