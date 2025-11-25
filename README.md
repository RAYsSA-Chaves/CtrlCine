# CtrlCine - Plataforma de Gestão de filmes

**CtrlCine** é uma plataforma desenvolvida para as disciplinas de Front e BackEnd do curso de Desenvolvimento de Sistemas do SENAI Roberto Mange.

Pensada para apaixonados por filmes, a aplicação permite assistir trailers, acompanhar lançamentos, explorar os títulos mais populares, organizar listas personalizadas, enviar solicitações de atualização de conteúdo e avaliar filmes. Paralelamente, administradores contam com ferramentas dedicadas à gestão, possibilitando adicionar, editar, excluir e validar informações, garantindo que o catálogo se mantenha sempre atualizado e relevante.

Seu objetivo central é proporcionar um ambiente digital intuitivo, dinâmico e personalizável, no qual os usuários possam descobrir, organizar e interagir com filmes de maneira simples e envolvente. O público-alvo abrange qualquer pessoa interessada em cinema que deseje acompanhar novidades, personalizar sua experiência e participar ativamente da evolução da plataforma.

Além do desenvolvimento das funcionalidades voltadas ao usuário, o projeto também teve como objetivo construir toda a base técnica da aplicação: uma API pura em Python integrada a um banco de dados MySQL, permitindo que cada ação realizada no FrontEnd em React se conecte diretamente ao servidor e reflita no sistema em tempo real.

---
rodar testes:
na pasta raiz do projeto (CtrlCine), no terminal:
pytest
rodar arquivo específico: pytest tests/test_security.py
rodar teste específico: pytest -k test_senha_incorreta
