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
    filme_id INTEGER NULL,
    filme JSON,
    tipo ENUM('novo filme', 'edição'),
    aceito BOOLEAN NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
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
    TRUE
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
    'https://youtu.be/yXPWsdT43YE?si=lYwg2Y3l4pvrt6vJ',
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
INSERT INTO filme_produtora VALUES (5, 5), (5, 6);
INSERT INTO filme_ator VALUES (5, 8), (5, 9);
INSERT INTO filme_genero VALUES (5, 8), (5, 9);

-- FILME 6
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Como Treinar o Seu Dragão (2025)',
    'https://i.ytimg.com/vi/pPeyZiQIlOg/maxresdefault.jpg',
    'https://br.web.img3.acsta.net/img/2c/59/2c5907be8f52c06b3cba679cd43d2ed7.jpg',
    '2025-06-13',
    '2h 5min',
    'Adaptação live-action da famosa animação, mostrando Soluço e Banguela explorando a amizade entre humanos e dragões.',
    'https://youtu.be/CWTy1ukPoYY?si=mmMCcBdA5pgNR4R6',
    5,
    TRUE
);

INSERT INTO diretores (nome) VALUES ('Dean DeBlois');
INSERT INTO produtoras (nome) VALUES ('DreamWorks Animation');
INSERT INTO atores (nome, foto) VALUES
('Nico Parker', 'https://image.tmdb.org/t/p/w500/gt0NJClVSCPCEfcPgcLj3f85uLa.jpg'),
('Gerard Butler', 'https://br.web.img3.acsta.net/pictures/18/10/17/19/01/1393995.jpg');

INSERT INTO filme_diretor VALUES (6, 6);
INSERT INTO filme_produtora VALUES (6, 7);
INSERT INTO filme_ator VALUES (6, 5), (6, 10), (6, 11);
INSERT INTO filme_genero VALUES (6, 2), (6, 3), (6, 17);

-- FILME 7
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Ainda Estou Aqui',
    'https://cdn.jornaldebrasilia.com.br/wp-content/uploads/2025/01/23113119/ainda-estou-aqui-estreia-hoje-nos-cinemas-brasileiros-v0-hi36wvi5qizd1.webp',
    'https://www.adufg.org.br/images/uma-conquista-brasileira-ainda-estou-aqui-recebe-tres-indicacoes-no-oscar-com-tematica-que-nao-podemos-esquecer-591.png',
    '2024-11-07',
    '2h 15min',
    'Baseado em uma história real, retrata a história da advogada Eunice Paiva durante a ditadura militar no Brasil, quando seu marido, o ex-deputado Rubens Paiva, é sequestrado e desaparece. Diante da violência do regime, Eunice precisa se reinventar para criar seus cinco filhos e lutar pela verdade sobre o destino do marido, uma busca que se estenderia por décadas. ',
    'https://youtu.be/w9CHdJF-4vU?si=Osl4nKKuKfn8u0B7',
    5,
    TRUE
);

INSERT INTO diretores VALUES ('Walter Salles');
INSERT INTO produtoras VALUES ('RT Features');
INSERT INTO produtoras VALUES ('VideoFilmes');
INSERT INTO atores VALUES
('Fernanda Torres', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Fernanda_Torres_at_the_2024_Toronto_International_Film_Festival_6.jpg/960px-Fernanda_Torres_at_the_2024_Toronto_International_Film_Festival_6.jpg');

INSERT INTO filme_diretor VALUES (7, 7);
INSERT INTO filme_produtora VALUES (7, 8), (7, 9);
INSERT INTO filme_ator VALUES (7, 12);
INSERT INTO filme_genero VALUES (7, 15), (7, 7), (7, 14);

-- FILME 8
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Superman',
    'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2025/08/Superman-2025.png?w=1200&h=900&crop=1',
    'https://br.web.img3.acsta.net/img/86/64/8664d1b110b95eb32313683f1a655f5f.jpg',
    '2025-07-10',
    '2h 9min',
    'Reinício do herói da DC, dirigido por James Gunn, mostrando Clark Kent em seus primeiros dias como o Homem de Aço, tentando equilibrar sua herança kryptoniana com sua criação como Clark Kent no Kansas, enquanto enfrenta um mundo que questiona seus ideais de bondade e justiça.',
    'https://youtu.be/14qzQDMcTqM?si=ZLJWMg7qqytHaMGa',
    3,
    TRUE
);

INSERT INTO diretores VALUES ('James Gunn');
INSERT INTO produtoras VALUES ('DC Studios');
INSERT INTO atores VALUES
('David Corenswet', 'https://br.web.img3.acsta.net/pictures/20/01/07/17/21/0850335.jpg'),
('Nicholas Hoult', 'https://br.web.img3.acsta.net/pictures/19/10/11/03/35/2265623.jpg');

INSERT INTO filme_diretor VALUES (8, 8);
INSERT INTO filme_produtora VALUES (8, 10);
INSERT INTO filme_ator VALUES (8, 13), (8, 14);
INSERT INTO filme_genero VALUES (8, 1), (8, 9);

-- FILME 9
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'F1',
    'https://rollingstone.com.br/wp-content/uploads/2025/07/f1-filme-estrelado-por-brad-pitt-bate-recorde-de-bilheteria-em-apenas-10-dias.jpg',
    'https://ingresso-a.akamaihd.net/prd/img/movie/f1-o-filme/3a0a118e-8bf3-4e10-b45d-f028cd49b001.webp',
    '2025-06-27',
    '2h 35min',
    'Na década de 1990, Sonny Hayes era o piloto mais promissor da Fórmula 1 até que um acidente na pista quase encerrou sua carreira. Trinta anos depois, o proprietário de uma equipe de Fórmula 1 em dificuldades convence Sonny a voltar a correr e se tornar o melhor do mundo.',
    'https://youtu.be/ZiDphkXCZsQ?si=SomMKPERagnAThdW',
    4,
    TRUE
);

INSERT INTO diretores VALUES ('Joseph Kosinski');
INSERT INTO produtoras VALUES ('Apple Studios');
INSERT INTO atores VALUES
('Brad Pitt', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49q2IH6MCj-DC0zl8INPrZb4rIrXyCWwxIHCyWIlX3V9E42BYi6GGFIqaB_TicxUGqWdEIyf2UVTfGaCw1WKRZIJAVOcCWPybsAUVoA&s=10');

INSERT INTO filme_diretor VALUES (9, 9);
INSERT INTO filme_produtora VALUES (9, 11);
INSERT INTO filme_ator VALUES (9, 15);
INSERT INTO filme_genero VALUES (9, 1), (9, 2), (9, 16);

-- FILME 10
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, em_alta)
VALUES (
    'Five Nights at Freddy`s 2',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQyvT7kRe0V8PJjciERD_YM4-qako776rkQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmWvSgIBmJh3tZzXwYKdVvuknFt2Gh4MgQ6w&s',
    '2025-12-05',
    '1h 44min',
    'Um ano após o primeiro filme, Five Nights at Freddy`s 2 gira em torno de Abby, a irmã de Mike, que foge para se reconectar com os animatrônicos. Essa ação desencadeia eventos aterrorizantes que revelam segredos sombrios sobre a origem da Freddy`s e despertam um horror esquecido, forçando Mike, Abby e a policial Vanessa a tentar sobreviver.',
    'https://youtu.be/w8oP0T-7USo?si=P8J4A72eTCp9Pv44',
    FALSE
);

INSERT INTO diretores VALUES ('Emma Tammi');
INSERT INTO atores VALUES
('Josh Hutcherson', 'https://ntvb.tmsimg.com/assets/assets/270768_v9_bd.jpg?w=360&h=480'),
('Piper Rubio', 'https://m.media-amazon.com/images/M/MV5BODQwNzRkNzYtMjdhNi00MDQ3LWIxNzItZGRhMTljZThhZTJkXkEyXkFqcGc@._V1_.jpg'),
('Elizabeth Lail', 'https://br.web.img3.acsta.net/pictures/18/12/30/22/15/3265750.jpg');

INSERT INTO filme_diretor VALUES (10, 10);
INSERT INTO filme_produtora VALUES (10, 3);
INSERT INTO filme_ator VALUES (10, 16), (10, 17), (10, 18);
INSERT INTO filme_genero VALUES (10, 4), (10, 5), (10, 9);

-- FILME 11
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, em_alta)
VALUES (
    'Anaconda',
    'https://www.correiodopovo.com.br/image/contentid/policy:1.1657646:1760115580/BRAZIL%20Anaconda_INTL_Online_1080x1350_Data.png?f=4x3&q=0.9&w=800&$p$f$q$w=9325e3f',
    'https://br.web.img3.acsta.net/img/85/6f/856f5aefb5ff340f1b8e5950ca0e0f08.jpg',
    '2025-12-25',
    '00h 00min',
    'Dois amigos de infância, em meio a uma crise de meia-idade, decidem realizar um sonho antigo: refazer seu filme favorito da juventude, o Anaconda original. A aventura cômica se transforma em uma luta pela sobrevivência quando uma anaconda gigante real aparece, forçando-os a enfrentar não apenas a ameaça da cobra, mas também desastres naturais e criminosos na Amazônia.',
    'https://youtu.be/o33HZ-Xov98?si=5soMMW7C3qrGHJbZ',
    FALSE
);

INSERT INTO diretores (nome) VALUES ('Tom Gormican');
INSERT INTO produtoras (nome) VALUES ('Columbia Pictures');
INSERT INTO atores (nome, foto) VALUES
('Jack Black', 'https://static.wikia.nocookie.net/music/images/4/4d/Jack_Black.jpg/revision/latest?cb=20180702021339'),
('Paul Rudd', 'https://m.media-amazon.com/images/M/MV5BMTY4NTEwNDg1MV5BMl5BanBnXkFtZTgwODMwMDA0ODE@._V1_FMjpg_UX1000_.jpg');

INSERT INTO filme_diretor VALUES (11, 11);
INSERT INTO filme_produtora VALUES (11, 12);
INSERT INTO filme_ator VALUES (11, 19), (11, 20);
INSERT INTO filme_genero VALUES (11, 4), (11, 1), (11, 2);

-- FILME 12
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer)
VALUES (
    'Michael',
    'https://popseries.com.br/wp-content/uploads/2025/11/michael-filme-2025-990x440.jpg',
    'https://upload.wikimedia.org/wikipedia/pt/3/3c/Michael_%28filme_2026%29.jpg',
    '2026-04-23',
    '00h 00min',
    'Michael é uma futura cinebiografia musical norte-americana baseada na vida do cantor, compositor e dançarino Michael Jackson.',
    'https://youtu.be/KDDVHnLB4eE?si=mUkZb0N5JmHXKE_U'
);

INSERT INTO diretores (nome) VALUES ('Antoine Fuqua');
INSERT INTO produtoras (nome) VALUES ('Lionsgate Studios');
INSERT INTO atores (nome, foto) VALUES
('Jaafar Jackson', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrPm8LPOoaFKMNSig0K4nY3ZvXPZd9rtzcn3dPalLE3zbyLsnRBiavltFoggDDTvsWa3fe-g4Q-affAIwyvmZfaNFNC4jDSRaLz5ILR1c&s=10');
INSERT INTO filme_diretor VALUES (12, 12);
INSERT INTO filme_produtora VALUES (12, 13);
INSERT INTO filme_ator VALUES (12, 21);
INSERT INTO filme_genero VALUES (12, 11), (12, 15);

-- FILME 13
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb, em_alta)
VALUES (
    'Vingadores: Guerra Infinita',
    'https://assets.b9.com.br/wp-content/uploads/2018/04/av.jpg',
    'https://upload.wikimedia.org/wikipedia/pt/9/90/Avengers_Infinity_War.jpg',
    '2018-04-26',
    '2h 29min',
    'Os Vingadores unem forças para impedir Thanos de reunir as Joias do Infinito e eliminar metade do universo.',
    'https://youtu.be/t_ULBP6V9bg?si=RuWr0nQcZwPmdM5u',
    5,
    FALSE
);

INSERT INTO diretores (nome) VALUES ('Anthony Russo');
INSERT INTO atores (nome, foto) VALUES
('Robert Downey Jr.', 'https://br.web.img3.acsta.net/c_310_420/pictures/18/06/29/00/35/0101925.jpg'),
('Chris Evans', 'https://br.web.img2.acsta.net/pictures/19/04/22/19/59/2129500.jpg'),
('Josh Brolin', 'https://br.web.img3.acsta.net/c_310_420/pictures/18/06/21/17/52/2749597.jpg'),
('Chris Hemsworth', 'https://images.mubicdn.net/images/cast_member/24207/cache-62264-1615052248/image-w856.jpg'),
('Scarlett Johansson', 'https://image.tmdb.org/t/p/w500/mjReG6rR7NPMEIWb1T4YWtV11ty.jpg'),
('Mark Ruffalo', 'https://br.web.img3.acsta.net/pictures/19/04/22/20/02/3083743.jpg'),
('Tom Holland', 'https://br.web.img3.acsta.net/pictures/19/07/01/23/18/1152169.jpg'),
('Elizabeth Olsen', 'https://image.tmdb.org/t/p/original/mbMsmQE5CyMVTIGMGCw2XpcPCOc.jpg');

INSERT INTO filme_diretor VALUES (13, 13);
INSERT INTO filme_produtora VALUES (13, 1);
INSERT INTO filme_ator VALUES (13, 22), (13, 23), (13, 24), (13, 25), (13, 26), (13, 27), (13, 28), (13, 29), (13, 30);
INSERT INTO filme_genero VALUES (13, 1), (13, 2), (13, 9);

-- FILME 14
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'The Batman',
    'https://ingresso-a.akamaihd.net/b2b/production/uploads/article/image/385/imagem-the-batman-filme-robert-pattinson-sera-o-mais-longo-do-super-heroi-confira-a-duracao.jpg',
    'https://upload.wikimedia.org/wikipedia/pt/thumb/3/38/The_Batman_poster.jpg/250px-The_Batman_poster.jpg',
    '2022-03-03',
    '2h 56min',
    'Após dois anos espreitando as ruas como Batman, Bruce Wayne se encontra nas profundezas mais sombrias de Gotham City. Com poucos aliados confiáveis, o vigilante solitário se estabelece como a personificação da vingança para a população.',
    'https://youtu.be/mqqft2x_Aa4?si=1JitAq34OPGHnV7o',
    4
);

INSERT INTO diretores (nome) VALUES ('Matt Reeves');
INSERT INTO produtoras (nome) VALUES ('Warner Bros Pictures');
INSERT INTO atores (nome, foto) VALUES
('Robert Pattinson', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Robert_Pattinson_2012.jpg/250px-Robert_Pattinson_2012.jpg');
INSERT INTO filme_diretor VALUES (14, 14);
INSERT INTO filme_produtora VALUES (14, 14);
INSERT INTO filme_ator VALUES (14, 31);
INSERT INTO filme_genero VALUES (14, 1), (14, 13), (14, 5);

-- FILME 15
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'Homem-Aranha: Sem Volta para Casa',
    'https://occ-0-8407-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcaZlB5cBXaQovKzRNe3DLOD5xe5ug2Msp7y4SHAFXs8Uu-s9esOCD1X3jnbYZZ4Dm-tM-cOgWh1FDmFD0wIfIfbrkpJAoULvXWX.jpg?r=c9b',
    'https://conteudo.imguol.com.br/c/entretenimento/65/2021/12/14/cartaz-de-homem-aranha-sem-volta-para-casa-1639517284758_v2_3x4.jpg',
    '2021-12-16',
    '2h 28min',
    'Peter Parker tem a sua identidade secreta revelada e pede ajuda ao Doutor Estranho. Quando o feitiço para reverter o evento não sai como esperado, o Homem-Aranha e o seu companheiro dos Vingadores precisam enfrentar inimigos de todo o multiverso.',
    'https://youtu.be/FDNNHh7TRN0?si=6b_1pMGxFcFaRLTI',
    4
);

INSERT INTO diretores (nome) VALUES ('Jon Watts');
INSERT INTO atores (nome, foto) VALUES
('Tom Holland', 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Tom_Holland_2022.jpg'),
('Zendaya', 'https://upload.wikimedia.org/wikipedia/commons/2/25/Zendaya_2023.jpg');
INSERT INTO filme_diretor VALUES (15, 15);
INSERT INTO filme_produtora VALUES (15, 1), (15, 12);
INSERT INTO filme_ator VALUES (15, 26), (15, 27);
INSERT INTO filme_genero VALUES (15, 1), (15, 2);

-- FILME 16
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'Até o Último Homem',
    'https://m.media-amazon.com/images/S/pv-target-images/1722e127c4ec694899ab42956a327a9557450e6c14ddf9393f8564ae5f82ed06.png',
    'https://br.web.img3.acsta.net/pictures/16/11/21/15/29/457312.jpg',
    '2017-01-26',
    '2h 19min',
    'A história real de Desmond Doss, um médico de guerra que se recusou a portar armas, mas salvou 75 homens em Okinawa.',
    'https://youtu.be/KHZG7NnjVxM?si=2LT4wxYPNMnW0PBr',
    5
);

INSERT INTO diretores (nome) VALUES ('Mel Gibson');
INSERT INTO produtoras (nome) VALUES ('Summit Entertainment');
INSERT INTO atores (nome, foto) VALUES
('Andrew Garfield', 'https://media.themoviedb.org/t/p/w500/5ydZ6TluPtxlz5G8nlWMB7SGmow.jpg');
INSERT INTO filme_diretor VALUES (16, 16);
INSERT INTO filme_produtora VALUES (16, 15);
INSERT INTO filme_ator VALUES (16, 28);
INSERT INTO filme_genero VALUES (16, 14), (16, 13);

-- FILME 17
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'Cowspiracy',
    'https://occ-0-8407-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABRl1_sUWDz3fmXYrEzC8C2tuf91pSoEVpGiQJDtj0J0j1i-AP3hZ67sqJ2id6Ysg3ZA8Tq-hbA6Nc6XVYCOC3V6hhVH_TVsv-k5o.jpg?r=c4d',
    'https://m.media-amazon.com/images/I/81Di7YpouiL.jpg',
    '2014-06-26',
    '1h 30min',
    'Documentário que investiga o impacto ambiental da pecuária e o silêncio das organizações ecológicas sobre o tema.',
    'https://youtu.be/nV04zyfLyN4?si=4JqEpAgDIXCdRx1l',
    4
);

INSERT INTO diretores (nome) VALUES ('Kip Andersen');
INSERT INTO produtoras (nome) VALUES ('A.U.M. Films');
INSERT INTO filme_diretor VALUES (17, 17);
INSERT INTO filme_produtora VALUES (17, 16);
INSERT INTO filme_genero VALUES (17, 10);


-- FILME 18
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'Moana: Um Mar de Aventuras',
    'https://lumiere-a.akamaihd.net/v1/images/eu_moana-movie_hero_r_ed9602c0.jpeg',
    'https://br.web.img3.acsta.net/pictures/16/09/12/22/13/415370.jpg',
    '2017-01-05',
    '1h 53min',
    'Moana, filha do chefe de uma ilha polinésia, parte em uma jornada para salvar seu povo com a ajuda do semideus Maui.',
    'https://youtu.be/LKFuXETZUsI?si=8pPZUifNecqM75hJ',
    4
);

INSERT INTO diretores (nome) VALUES ('Ron Clements');
INSERT INTO produtoras (nome) VALUES ('Walt Disney Pictures');
INSERT INTO atores (nome, foto) VALUES
('Auli`i Cravalho', 'https://br.web.img3.acsta.net/pictures/19/03/12/00/26/0962796.jpg'),
('Dwayne Johnson', 'https://br.web.img2.acsta.net/c_310_420/pictures/19/03/14/22/50/2171610.jpg');

INSERT INTO filme_diretor VALUES (18, 18);
INSERT INTO filme_produtora VALUES (18, 17);
INSERT INTO filme_ator VALUES (18, 29), (18, 30);
INSERT INTO filme_genero VALUES (18, 3), (18, 2), (18, 17);

-- FILME 19
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'Os Croods',
    'https://media.licdn.com/dms/image/v2/C5612AQGRzDhaKs5kjQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520208242846?e=2147483647&v=beta&t=LTUk6hiDsTz97ASdtExLp1pK3gybXYs4R21lY0OuAUA',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzXoJ7QqMuthq_h0obaNtu8A0RWU7arLc34Q&s',
    '2013-03-21',
    '1h 38min',
    'Uma família pré-histórica parte em uma aventura depois que sua caverna é destruída, em busca de um novo lar, liderados por um garoto muito imaginativo que lhes ajuda a desbravar um mundo inteiramente novo.',
    'https://youtu.be/-nPvii8SM3U?si=K7Asl2k-1wEauEGZ',
    4
);

INSERT INTO diretores (nome) VALUES ('Chris Sanders');
INSERT INTO atores (nome, foto) VALUES
('Nicolas Cage', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Nicolas_Cage_-_66%C3%A8me_Festival_de_Venise_%28Mostra%29.jpg'),
('Emma Stone', 'https://m.media-amazon.com/images/M/MV5BMjI4NjM1NDkyN15BMl5BanBnXkFtZTgwODgyNTY1MjE@._V1_.jpg');
('Ryan Reynolds', 'https://goldenglobes.com/wp-content/uploads/2023/10/ryan_reynolds_gettyimages-630281680.jpg?w=1968');

INSERT INTO filme_diretor VALUES (19, 19);
INSERT INTO filme_produtora VALUES (19, 7);
INSERT INTO filme_ator VALUES (19, 31), (19, 32), (19, 33);
INSERT INTO filme_genero VALUES (19, 3), (19, 2), (19, 17);

-- FILME 20
INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
VALUES (
    'Luca',
    'https://assets.b9.com.br/wp-content/uploads/2021/06/aI5S2WMoTFVgBznYi2DP3WRojCl-scaled.jpg',
    'https://br.web.img2.acsta.net/r_1280_720/pictures/21/04/28/15/52/1967183.jpg',
    '2021-06-13',
    '1h 35min',
    'Luca vive um verão inesquecível na Riviera Italiana, mas esconde o segredo de ser um monstro marinho que assume forma humana na superfície.',
    'https://youtu.be/mYfJxlgR2jw?si=q8xkDjw7B-8GmgAm',
    5
);

INSERT INTO diretores (nome) VALUES ('Enrico Casarosa');
INSERT INTO produtoras (nome) VALUES ('Pixar Animation Studios');
INSERT INTO atores (nome, foto) VALUES
('Jacob Tremblay', 'https://br.web.img2.acsta.net/pictures/20/01/04/00/32/5981389.jpg'),
('Jack Dylan Grazer', 'https://static.wikia.nocookie.net/disney/images/9/96/Jack_Dylan_Grazer.jpg/revision/latest?cb=20210429180401&path-prefix=pt-br');
INSERT INTO filme_diretor VALUES (20, 20);
INSERT INTO filme_produtora VALUES (20, 18), (20, 17);
INSERT INTO filme_ator VALUES (20, 34), (20, 35);
INSERT INTO filme_genero VALUES (20, 3), (20, 17);


-- Consulta
SELECT *,
atores.nome AS ator,
produtoras.nome AS produtora,
generos.nome AS genero,
diretores.nome AS diretor
FROM filmes
JOIN (filme_ator ON filme_ator.filme_id = filmes.id)
JOIN (atores ON atores.id = filme_ator.ator_id)
JOIN (filme_produtora ON filme_produtora.filme_id = filmes.id)
JOIN (produtoras ON produtoras.id = filme_produtora.produtora_id)
JOIN (filme_diretor ON filme_diretor.filme_id = filmes.id)
JOIN (diretores ON produtoras.id = filme_diretor.diretor_id)
JOIN (filme_genero ON filme_genero.filme_id = filmes.id)
JOIN (generos ON generos.id = filme_genero.genero_id);
