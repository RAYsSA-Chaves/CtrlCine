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
    nota_imdb INTEGER NULL,
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

-- Populando alguns filmes
-- FILME 1
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta) VALUES (
    'Quarteto Fantástico: Primeiros Passos',
    'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/07/Quarteto-Fantastico-2025.png?w=1200&h=630&crop=1',
    'https://i0.wp.com/factotumcultural.com.br/wp-content/uploads/2025/08/quarteto-fantastico-2025-factotum-cultural-tela-mistica.png?fit=816%2C1200&ssl=1',
    '2025-07-24',
    '1h 55min',
    'O Quarteto Fantástico estreia no MCU, apresentando Reed Richards, Sue Storm, Johnny Storm e Ben Grimm enfrentando uma nova ameaça cósmica.',
    'https://youtu.be/P273sRlm4tM?si=TdXEG8lEcSl3J_Yp',
    4,
    TRUE,
);

INSERT INTO diretores (nome) VALUES ('Matt Shakman');
INSERT INTO produtoras (nome) VALUES ('Marvel Studios');
INSERT INTO atores (nome, foto) VALUES
('Pedro Pascal', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pedro_Pascal_at_the_2025_Cannes_Film_Festival_06_%28cropped%29.jpg/960px-Pedro_Pascal_at_the_2025_Cannes_Film_Festival_06_%28cropped%29.jpg'),
('Vanessa Kirby', 'https://m.media-amazon.com/images/M/MV5BY2E3ZTVkNDItYjkwMy00Nzk1LWI2YWQtMzA4MWNjZDkxNGZmXkEyXkFqcGc@._V1_.jpg');

INSERT INTO filme_diretor (filme_id, diretor_id) VALUES (1, 1);
INSERT INTO filme_produtora (filme_id, produtora_id) VALUES (1, 1);
INSERT INTO filme_ator (filme_id, ator_id) VALUES (1, 1), (1, 2);
INSERT INTO filme_genero (filme_id, genero_id) VALUES (1, 1), (1, 6);

-- FILME 2
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, em_alta)
VALUES (
    'Avatar: Fogo e Cinzas',
    'https://external-preview.redd.it/3d-trailer-for-avatar-fire-and-ash-watch-with-quest-headset-v0-sVwrz979OPRpWFkH98sE17YJE3vXlzt3LYJrz4HsFT8.png?width=640&crop=smart&auto=webp&s=7d4044788435014a863feb1a88d5c22301f1521e',
    'https://m.media-amazon.com/images/M/MV5BM2FkYjhiMTYtNDk5Ny00NDU1LWE4NmQtM2Q0NWY0NDNkNzNmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    '2025-12-19',
    '3h 12min',
    'Após a guerra contra a RDA, Jake Sully e Neytiri precisam proteger sua família de uma nova ameaça: o Povo das Cinzas, uma tribo Na`vi violenta e sedenta por poder. A família Sully será forçada a lutar pela sobrevivência e pelo futuro de Pandora.',
    'hhttps://youtu.be/yXPWsdT43YE?si=lYwg2Y3l4pvrt6vJ',
    FALSE
);

INSERT INTO diretores (nome) VALUES ('James Cameron');
INSERT INTO produtoras (nome) VALUES ('20th Century Studios');
INSERT INTO atores (nome, foto) VALUES
('Sam Worthington', 'https://resizing.flixster.com/YNQWv9Xxaim-CGARtg9ptCT8e9I=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/218027_v9_bc.jpg'),
('Zoe Saldana', 'https://br.web.img3.acsta.net/pictures/19/10/17/01/24/5480352.jpg');

INSERT INTO filme_diretor VALUES (2, 2);
INSERT INTO filme_produtora VALUES (2, 2);
INSERT INTO filme_ator VALUES (2, 3), (2, 4);
INSERT INTO filme_genero VALUES (2, 2), (2, 6), (2, 9);

-- FILME 3
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'O Telefone Preto 2',
    'https://i.ytimg.com/vi/4FTqSFaKyjs/maxresdefault.jpg',
    'https://br.web.img2.acsta.net/img/8d/f3/8df3f4de748e61ea7311db6f8fc1d455.jpg',
    '2025-10-16',
    '1h 54min',
    'Sequência do terror psicológico de sucesso com Ethan Hawke retornando como o sádico sequestrador mascarado.',
    'https://youtu.be/M5Xz19w_lNk?si=V3L0DVEoqt4yDwvA',
    4,
    TRUE
);

INSERT INTO diretores VALUES ('Scott Derrickson');
INSERT INTO produtoras VALUES ('Blumhouse Productions');
INSERT INTO atores VALUES
('Ethan Hawke', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Ethan_Hawke_at_Berlinale_2025-3.jpg'),
('Mason Thames', 'https://hips.hearstapps.com/hmg-prod/images/masonthames-6-12-25-sq-1-684c311434a79.jpg?crop=1xw:1xh;center,top&resize=1200:*');
INSERT INTO filme_diretor VALUES (3, 3);
INSERT INTO filme_produtora VALUES (3, 3);
INSERT INTO filme_ator VALUES (3, 5), (3, 6);
INSERT INTO filme_genero VALUES (3, 4), (3, 5);

-- FILME 4
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Pecadores',
    'https://manualdosgames.com/wp-content/uploads/2025/04/Pecadores-novo-filme-de-Ryan-Coogler-conquista-publico-e-critica.jpg',
    'https://primeirosnegros.com/wp-content/uploads/2025/06/Cartaz-Pecadores.jpg.webp',
    '2025-04-17',
    '2h 17min',
    'Dois irmãos gêmeos tentam deixar suas vidas problemáticas para trás e retornam à sua cidade natal para recomeçar. Lá, eles descobrem que um mal ainda maior está à espreita para recebê-los de volta.',
    'https://youtu.be/e9kwQahD8YY?si=LBtb23D6opf5Ec_5',
    4,
    TRUE
);

INSERT INTO diretores VALUES ('Ryan Coogler');
INSERT INTO produtoras VALUES ('Proximity Media');
INSERT INTO atores VALUES
('Michael B. Jordan', 'https://br.web.img2.acsta.net/pictures/18/08/08/18/23/1187644.jpg');

INSERT INTO filme_diretor VALUES (4, 4);
INSERT INTO filme_produtora VALUES (4, 4);
INSERT INTO filme_ator VALUES (4, 7);
INSERT INTO filme_genero VALUES (4, 5), (4, 8), (4, 9);

-- FILME 5
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Amor de Redenção',
    'https://statcdn.fandango.com/MPX/image/NBCU_Fandango/715/515/thumb_A45853FB-61A3-4927-8A19-47FE9E0BFC97.jpg',
    'https://ingresso-a.akamaihd.net/prd/img/movie/redeeming-love/33d74528-2c8d-4a43-ad0c-89e194d54e04.jpg',
    '2022-06-09',
    '2h 14min',
    'Angel, experimentando o amor pela primeira vez e enfrentando demônios que parecem insuperáveis, foge da nova vida que ela acha que não merece. No entanto, durante a busca de Michael pela sua amada, Angel descobre que ela tem o poder de escolher a vida que quer.',
    'https://youtu.be/PSOQPSLvXYE?si=0VxPMeLgo8eQZ5GR',
    5,
    FALSE
);

INSERT INTO diretores (nome) VALUES ('D. J. Caruso');
INSERT INTO produtoras (nome) VALUES 
('Mission Pictures'),
('Pure Flix Entertainment');
INSERT INTO atores (nome, foto) VALUES
('Abigail Cowen', 'https://images.mubicdn.net/images/cast_member/579256/cache-981407-1720308272/image-w856.jpg'),
('Tom Lewis', 'https://m.media-amazon.com/images/S/pv-target-images/101ccc643b8a1af216c64e1a748bffe921419536b99c17a42c943fa380f286e6._SX300_.jpg');

INSERT INTO filme_diretor VALUES (5, 5);
INSERT INTO filme_produtora VALUES (5, 5), (5,6);
INSERT INTO filme_ator VALUES (5, 8), (5, 9);
INSERT INTO filme_genero VALUES (5, 8), (5, 9);

-- FILME 6
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Como Treinar o Seu Dragão (2025)',
    'https://m.media-amazon.com/images/M/MV5BNjQ2Y2E2ZDYtYzE0Mi00OGVmLTgxMDUtMWJhOGVjZjliNDE2XkEyXkFqcGc@._V1_.jpg',
    'https://m.media-amazon.com/images/M/MV5BYWRmZTc2ODQtNjU4My00NDViLTg1MzQtYTU2Y2JmYjhjZjg1XkEyXkFqcGc@._V1_.jpg',
    '2025-06-13',
    '130',
    'Adaptação live-action da famosa animação, mostrando Soluço e Banguela explorando a amizade entre humanos e dragões.',
    'https://www.youtube.com/watch?v=BSQH6z0B3cI',
    0,
    TRUE
);

INSERT INTO diretores (nome) VALUES ('Dean DeBlois');
INSERT INTO produtoras (nome) VALUES ('Universal Pictures');
INSERT INTO atores (nome, foto) VALUES
('Mason Thames', 'https://upload.wikimedia.org/wikipedia/commons/5/52/Mason_Thames_2022.jpg'),
('Nico Parker', 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Nico_Parker_2023.jpg'),
('Gerard Butler', 'https://upload.wikimedia.org/wikipedia/commons/1/10/Gerard_Butler_2019.jpg');

INSERT INTO filme_diretor VALUES (5, 5);
INSERT INTO filme_produtora VALUES (5, 5);
INSERT INTO filme_ator VALUES (5, 8), (5, 13), (5, 14);
INSERT INTO filme_genero VALUES (5, 2), (5, 3), (5, 17);

-- FILME 7
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Ainda Estou Aqui',
    'https://m.media-amazon.com/images/M/MV5BYmY2ZTVhYjItZjMyNi00MWJlLThlOTAtZDRhMGM4MTg1NzM0XkEyXkFqcGc@._V1_.jpg',
    'https://m.media-amazon.com/images/M/MV5BMTUzMDIyY2QtYmRlNy00ZjkwLWFmZjAtZjM1ZmU4NDI3NzgxXkEyXkFqcGc@._V1_.jpg',
    '2024-09-12',
    '122',
    'Baseado em história real, retrata o drama de uma mãe que busca seu filho desaparecido durante a ditadura militar brasileira.',
    'https://www.youtube.com/watch?v=r5ZkSmN7SNg',
    8,
    TRUE
);

INSERT INTO diretores VALUES ('Walter Salles');
INSERT INTO produtoras VALUES ('Gullane Filmes');
INSERT INTO atores VALUES
('Fernanda Torres', 'https://upload.wikimedia.org/wikipedia/commons/7/74/Fernanda_Torres_2013.jpg'),
('Bruna Linzmeyer', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Bruna_Linzmeyer_2016.jpg'),
('Gabriel Leone', 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gabriel_Leone_2017.jpg');

INSERT INTO filme_diretor VALUES (6, 6);
INSERT INTO filme_produtora VALUES (6, 6);
INSERT INTO filme_ator VALUES (6, 15), (6, 16), (6, 17);
INSERT INTO filme_genero VALUES (6, 8), (6, 9), (6, 15);

-- FILME 8
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Superman (2025)',
    'https://m.media-amazon.com/images/M/MV5BM2MyZTlkNzEtYjM2NS00ZjQ2LWIxM2QtNDA2OGY3ZTU4ZThmXkEyXkFqcGc@._V1_.jpg',
    'https://m.media-amazon.com/images/M/MV5BMjRjNDk2ZTQtZmI0Ny00Y2ZmLTk0NDctNTJmNjU3YzljYzM4XkEyXkFqcGc@._V1_.jpg',
    '2025-07-11',
    '140',
    'Reinício do herói da DC, dirigido por James Gunn, mostrando Clark Kent em seus primeiros dias como o Homem de Aço.',
    'https://www.youtube.com/watch?v=t0tG6-TK9Xw',
    0,
    TRUE
);

INSERT INTO diretores VALUES ('James Gunn');
INSERT INTO produtoras VALUES ('DC Studios');
INSERT INTO atores VALUES
('David Corenswet', 'https://upload.wikimedia.org/wikipedia/commons/5/57/David_Corenswet_2019.jpg'),
('Rachel Brosnahan', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Rachel_Brosnahan_2019.jpg'),
('Nicholas Hoult', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nicholas_Hoult_2019.jpg');

INSERT INTO filme_diretor VALUES (7, 7);
INSERT INTO filme_produtora VALUES (7, 7);
INSERT INTO filme_ator VALUES (7, 18), (7, 19), (7, 20);
INSERT INTO filme_genero VALUES (7, 1), (7, 6), (7, 9);

-- FILME 9
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'F1',
    'https://m.media-amazon.com/images/M/MV5BZDcyMTdjYzctMmE4Ni00NmQzLThjN2MtYjE3MDA1M2FlYTI2XkEyXkFqcGc@._V1_.jpg',
    'https://m.media-amazon.com/images/M/MV5BYWY1MjExZWEtYjY0Yy00ZmQ3LWE4OTAtYmFhNTkzOTk1MjU3XkEyXkFqcGc@._V1_.jpg',
    '2025-06-27',
    '130',
    'Filme de ação estrelado por Brad Pitt como um piloto veterano que retorna à Fórmula 1 para treinar um jovem talento.',
    'https://www.youtube.com/watch?v=ZqSqa8W9WiI',
    0,
    TRUE
);

INSERT INTO diretores VALUES ('Joseph Kosinski');
INSERT INTO produtoras VALUES ('Apple Studios');
INSERT INTO atores VALUES
('Brad Pitt', 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Brad_Pitt_2019.jpg'),
('Damson Idris', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Damson_Idris_2019.jpg'),
('Kerry Condon', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Kerry_Condon_2022.jpg');

INSERT INTO filme_diretor VALUES (8, 8);
INSERT INTO filme_produtora VALUES (8, 8);
INSERT INTO filme_ator VALUES (8, 21), (8, 22), (8, 23);
INSERT INTO filme_genero VALUES (8, 1), (8, 17), (8, 8);

-- FILME 10
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Five Nights at Freddy''s 2',
    'https://m.media-amazon.com/images/M/MV5BMzJlZWJmNzQtZTk0ZC00ZjRmLWIxM2QtNWIyZDIxYzE0NzAxXkEyXkFqcGc@._V1_.jpg',
    'https://m.media-amazon.com/images/M/MV5BMDAxZjA1OWEtNzYzZS00MTEzLTk0Y2ItNDMyOTIzZmM1NzJkXkEyXkFqcGc@._V1_.jpg',
    '2025-12-05',
    '115',
    'Continuação do terror baseado no famoso jogo, trazendo novos animatrônicos e uma história mais sombria.',
    'https://www.youtube.com/watch?v=0VHkFJ8nGxk',
    0,
    FALSE
);

INSERT INTO diretores VALUES ('Emma Tammi');
INSERT INTO produtoras VALUES ('Blumhouse Productions');
INSERT INTO atores VALUES
('Josh Hutcherson', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Josh_Hutcherson_2015.jpg'),
('Matthew Lillard', 'https://upload.wikimedia.org/wikipedia/commons/7/77/Matthew_Lillard_2019.jpg'),
('Elizabeth Lail', 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Elizabeth_Lail_2019.jpg');

INSERT INTO filme_diretor VALUES (9, 9);
INSERT INTO filme_produtora VALUES (9, 3);
INSERT INTO filme_ator VALUES (9, 24), (9, 25), (9, 26);
INSERT INTO filme_genero VALUES (9, 4), (9, 5), (9, 9);
