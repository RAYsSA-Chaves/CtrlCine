# CtrlCine
Web server fictício para gerenciamento de filmes.

rodar testes:
na pasta raiz do projeto (CtrlCine), no terminal:
python -m BackEnd.tests.nome_do_teste

-m = “Execute o módulo (arquivo dentro de um pacote) BackEnd.tests.test_security considerando CtrlCine como raiz do projeto.”
Isso muda como o Python monta o caminho de importação (sys.path), permitindo que ele encontre os pacotes internos corretamente:
BackEnd é visto como um pacote raiz.
tests é reconhecido como parte de BackEnd (subpacote).
Imports como from tests.test_security import ... passam a funcionar.