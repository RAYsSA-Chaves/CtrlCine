# CtrlCine - Plataforma de Gestão de filmes

**CtrlCine** é uma plataforma desenvolvida para as disciplinas de Front e BackEnd do curso de Desenvolvimento de Sistemas do SENAI Roberto Mange.

Pensada para apaixonados por filmes, a aplicação permite assistir trailers, acompanhar lançamentos, explorar os títulos mais populares, organizar listas personalizadas, enviar solicitações de atualização de conteúdo e avaliar filmes. Paralelamente, administradores contam com ferramentas dedicadas à gestão, possibilitando adicionar, editar, excluir e validar informações, garantindo que o catálogo se mantenha sempre atualizado e relevante.

Seu objetivo central é proporcionar um ambiente digital intuitivo, dinâmico e personalizável, no qual os usuários possam descobrir, organizar e interagir com filmes de maneira simples e envolvente. O público-alvo abrange qualquer pessoa interessada em cinema que deseje acompanhar novidades, personalizar sua experiência e participar ativamente da evolução da plataforma.

Além do desenvolvimento das funcionalidades voltadas ao usuário, o projeto também teve como objetivo construir toda a base técnica da aplicação: uma API pura em Python integrada a um banco de dados MySQL, permitindo que cada ação realizada no FrontEnd em React se conecte diretamente ao servidor e reflita no sistema em tempo real.

---

## Objetivos do Projeto

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

---
rodar testes:
na pasta raiz do projeto (CtrlCine), no terminal:
pytest
rodar arquivo específico: pytest tests/test_security.py
rodar teste específico: pytest -k test_senha_incorreta
