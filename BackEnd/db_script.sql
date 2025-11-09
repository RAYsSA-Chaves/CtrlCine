-- Rayssa C. C. Melo. 2DSTB - DS17.
-- CtrlCine DB

DROP DATABASE IF EXISTS CtrlCine;
CREATE DATABASE CtrlCine;
USE CtrlCine;

-- Tabela de filmes
CREATE TABLE filmes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) UNIQUE,
    capa_horizontal VARCHAR(255) UNIQUE,
    capa_vertical VARCHAR(255) UNIQUE,
    lancamento DATE,
    duracao VARCHAR(10),
    sinopse TEXT,
    trailer VARCHAR(255) UNIQUE,
    nota_imdb INTEGER,
	em_alta BOOLEAN DEFAULT FALSE,
    nota_ctrlcine INTEGER NULL
);

-- Tabela de usuários
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20),
    sobrenome VARCHAR(20) NULL,
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255),
    foto VARCHAR(255) NULL,
    tipo_user ENUM('admin', 'comum') DEFAULT 'comum',
    data_cadastro DATE
);

-- Tabela de listas
CREATE TABLE listas (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    usuario_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela filmes_listas (relacionamento entre filmes e listas)
CREATE TABLE filmes_listas (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    lista_id INTEGER,
    filme_id INTEGER,
    FOREIGN KEY (lista_id) REFERENCES listas(id) ON DELETE CASCADE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE
);

-- Tabela de avaliações dos usuários
CREATE TABLE avaliacoes_usuarios (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    usuario_id INTEGER,
    filme_id INTEGER,
    nota INTEGER,
    resenha TEXT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE
);

-- Tabela de lembretes
CREATE TABLE lembretes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    usuario_id INTEGER,
    filme_id INTEGER,
    data_envio DATE,
    tipo ENUM('lançamento próximo', 'lançou'),
    titulo VARCHAR(255),
    mensagem TEXT,
    enviado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE
);

-- Tabela de solicitações (ex: novo filme, edição)
CREATE TABLE solicitacoes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    usuario_id INTEGER,
    filme_id INTERGER NULL,
    filme JSON,
    tipo ENUM('novo filme', 'edição'),
    aceito BOOLEAN NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE
);

-- Tabela de gêneros de filmes
CREATE TABLE generos (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) UNIQUE
);

-- Tabela de atores
CREATE TABLE atores (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) UNIQUE,
    foto VARCHAR(255) UNIQUE
);

-- Tabela de diretores
CREATE TABLE diretores (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) UNIQUE
);

-- Tabela de produtoras
CREATE TABLE produtoras (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) UNIQUE
);

-- Tabela filme_genero (relacionamento entre filmes e gêneros)
CREATE TABLE filme_genero (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    filme_id INTEGER,
    genero_id INTEGER,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);

-- Tabela filme_diretore (relacionamento entre filmes e diretores)
CREATE TABLE filme_diretor (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    filme_id INTEGER,
    diretor_id INTEGER,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (diretor_id) REFERENCES diretores(id) ON DELETE CASCADE
);

-- Tabela filme_produtora (relacionamento entre filmes e produtoras)
CREATE TABLE filme_produtora (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    filme_id INTEGER,
    produtora_id INTEGER,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (produtora_id) REFERENCES produtoras(id) ON DELETE CASCADE
);

-- Tabela filme_atore (relacionamento entre filmes e atores)
CREATE TABLE filme_ator (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    filme_id INTEGER,
    ator_id INTEGER,
    FOREIGN KEY (filme_id) REFERENCES filmes(id) ON DELETE CASCADE,
    FOREIGN KEY (ator_id) REFERENCES atores(id) ON DELETE CASCADE
);

-- Inserindo gêneros
INSERT INTO generos (nome) VALUES
('Ação'),
('Aventura'),
('Animação'),
('Terror'),
('Suspense'),
('Ficção'),
('Comédia'),
('Drama'),
('Romance'),
('Fantasia'),
('Documentário'),
('Musical'),
('Criminal'),
('Guerra'),
('Histórico'),
('Biografia'),
('Esporte'),
('Família');

-- Criando o usuário administrador
INSERT INTO usuarios (nome, email, senha, tipo_user, data_cadastro) VALUES (
	'Administrador', 
    'adm@gmail.com', 
    '$argon2id$v=19$m=65536,t=3,p=4$6Kf1G9XFQSJ4LERVOsH+6w$eWALn0/SAf1JkS/Z3OoRnTrZ4g92Lsb5cz0vjDe4sPg', 
    'admin', 
    CURDATE()
);
