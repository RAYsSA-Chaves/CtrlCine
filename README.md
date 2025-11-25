# CtrlCine - Plataforma de Gestão de Filmes

<img src="./thumb.png"/>

**CtrlCine** é uma plataforma desenvolvida para as disciplinas de Front e BackEnd do curso de Desenvolvimento de Sistemas do SENAI Roberto Mange.

Pensada para apaixonados por filmes, a aplicação permite assistir trailers, acompanhar lançamentos, explorar os títulos mais populares, organizar listas personalizadas, enviar solicitações de atualização de conteúdo e avaliar filmes. Paralelamente, administradores contam com ferramentas dedicadas à gestão, possibilitando adicionar, editar, excluir e validar informações, garantindo que o catálogo se mantenha sempre atualizado e relevante.

Seu objetivo central é proporcionar um ambiente digital intuitivo, dinâmico e personalizável, no qual os usuários possam descobrir, organizar e interagir com filmes de maneira simples e envolvente. O público-alvo abrange qualquer pessoa interessada em cinema que deseje acompanhar novidades, personalizar sua experiência e participar ativamente da evolução da plataforma.

Além do desenvolvimento das funcionalidades voltadas ao usuário, o projeto também teve como objetivo construir toda a base técnica da aplicação: uma API pura em Python integrada a um banco de dados MySQL, permitindo que cada ação realizada no FrontEnd em React se conecte diretamente ao servidor e reflita no sistema em tempo real.

---

## Objetivos do projeto

- Desenvolver uma API pura em Python (*server*) integrada a um banco de dados MySQL para sustentar todas as operações da plataforma;
- Criar uma interface em React totalmente conectada ao BackEnd, garantindo respostas em tempo real para cada ação do usuário;
- Implementar um CRUD completo: adicionar filmes, listar, filtrar, buscar, editar e deletar;
- Possibilitar o envio de solicitações para adição ou edição de filmes por parte dos usuários comuns;
- Permitir a visualização de detalhes completos de cada filme;
- Prover aos administradores ferramentas completas para adicionar, editar e excluir filmes e, ainda, aceitar ou recusar solicitações dos usuários;
- Criar sistema de login/cadastro e autenticação, garantindo segurança e controle de acesso;
- Estabelecer diferenciação de usuários comuns e administradores;
- Promover uma experiência personalizada e um ambiente intuitivo, moderno e funcional para os amantes de cinema.

---

## Organização de pastas e arquivos
O projeto é dividido em três partes principais:

### 🐍 BackEnd
O BackEnd do projeto foi desenvolvido em Python e estruturado para garantir modularidade, organização, segurança e facilidade de manutenção. Ele é responsável por fornecer todas as rotas da API, gerenciar autenticação, realizar operações no banco de dados MySQL e atender às requisições do FrontEnd em React.

Principais arquivos e pastas:

- **server.py** - arquivo central da aplicação. Nele estão definidas todas as rotas da API, que direcionam as requisições do usuário para a lógica correspondente.

- **db_script.sql** - script utilizado para criação e estruturação do banco de dados MySQL, contendo tabelas, campos e inserções iniciais necessárias para o sistema funcionar.

- Pasta **core/middlewares** - contém os middlewares que atuam em todas as requisições da API, sendo eles: middleware de autenticação, que verifica se o usuário possui permissão para acessar determinadas rotas e CORS Headers, garantindo que o FrontEnd consiga acessar a API sem bloqueios do navegador.

- Pasta **core/configs.py** - arquivo que armazena as informações de configuração do banco, como nome do banco, usuário e senha — mantendo esses dados centralizados e fáceis de alterar.

- Pasta **core/database.py** - responsável por estabelecer a conexão com o MySQL, permitindo que todas as rotas executem consultas, inserções, atualizações e exclusões no banco.

- Pasta **core/security.py** - arquivo voltado para a segurança do sistema, com funções que hasheiam senhas, comparam senhas hasheadas, geram tokens de autenticação e validam tokens de acesso.

- Pasta **tests** - contém o arquivo test_security.py, responsável por testar a geração e validação de hash. Inclui um teste correto (hash válido) e um teste incorreto (hash inválido).

- Pasta **api/logic** - onde fica toda a lógica da API, separada por entidade. Cada arquivo concentra todas as operações referentes àquele recurso. Por exemplo: atores.py: listar todos os atores, buscar por ID, buscar por nome, adicionar novos atores etc. Os demais arquivos seguem o mesmo padrão, mantendo o código organizado.
<br/>

### 💻 FrontEnd
O FrontEnd foi desenvolvido em React, com foco em criar uma interface intuitiva e interativa para os usuários. Ele é responsável por exibir as páginas, capturar ações dos usuários, consumir a API em Python e refletir em tempo real as informações do banco de dados.

A aplicação foi organizada de forma modular, separando componentes reutilizáveis, páginas completas, rotas protegidas, serviços de comunicação com a API e funções utilitárias.

Principais arquivos e pastas:

- Pasta **public/** - contém o favicon e pasta para fotos de perfil dos usuários.

- Pasta **Assets/** - centraliza fontes, variáveis de cores e imagens.

- Pasta **Components/** - contém componentes reutilizáveis das páginas, como botão, input, navbar, etc.

- Pasta **Pages/** - páginas completas que utilizam os componentes.

- Pasta **Routes/** - define a navegação e proteção de rotas nos seguintes arquivos: **HomeRoute.jsx** (decide se exibe home ou landing page conforme login), **ProtectedAdminRoute.jsx** (protege páginas de admin), **ProtectedRoutes.jsx** (protege páginas para usuários logados), **Routes.jsx** (arquivo central com todas as rotas).

- Pasta **Services/** - o arquivo **Api.jsx** centraliza chamadas Axios, envio de token e tratamento de erros; já o arquivo **AuthContext.jsx** gerencia login e compartilha informações do usuário.

- Pasta **Utils/** - contém funções auxiliares, como conversão de notas em estrelas, consumo de API externa para puxar média de filmes e configuração de carrosséis.


---
rodar testes:
na pasta raiz do projeto (CtrlCine), no terminal:
pytest
rodar arquivo específico: pytest tests/test_security.py
rodar teste específico: pytest -k test_senha_incorreta
