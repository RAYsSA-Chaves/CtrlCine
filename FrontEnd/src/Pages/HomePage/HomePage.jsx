// Página Home para usuário logado

import './HomePage.css'
import api from '../../Services/Api'
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Botao from '../../Components/Botao/Botao'
import GenderCard from '../../Components/GenderCard/GenderCard';
import SaveIcon from '../../Assets/Images/Icons/flag_icon.svg'
import AvatarImg from '../../Assets/Images/avatar_banner.webp'
import FanafImg from '../../Assets/Images/fanfaf2_banner.jpg'
import MichaelImg from '../../Assets/Images/michael_banner.webp'
import AcaoImg from '../../Assets/Images/GendersCovers/genero_acao_img.svg'
import AventuraImg from '../../Assets/Images/GendersCovers/genero_aventura_img.svg'
import AnimacaoImg from '../../Assets/Images/GendersCovers/genero_animacao_img.svg'
import BiografiaImg from '../../Assets/Images/GendersCovers/genero_bio_img.svg'
import ComediaImg from '../../Assets/Images/GendersCovers/genero_comedia_img.svg'
import CriminalImg from '../../Assets/Images/GendersCovers/genero_crime_img.svg'
import DocImg from '../../Assets/Images/GendersCovers/genero_doc_img.svg'
import DramaImg from '../../Assets/Images/GendersCovers/genero_drama_img.svg'
import EsporteImg from '../../Assets/Images/GendersCovers/genero_esporte_img.svg'
import FamiliaImg from '../../Assets/Images/GendersCovers/genero_familia_img.svg'
import FantasiaImg from '../../Assets/Images/GendersCovers/genero_fantasia_img.svg'
import FiccaoImg from '../../Assets/Images/GendersCovers/genero_ficcao_img.svg'
import GuerraImg from '../../Assets/Images/GendersCovers/genero_guerra_img.svg'
import HistoricoImg from '../../Assets/Images/GendersCovers/genero_historia_img.svg'
import MusicalImg from '../../Assets/Images/GendersCovers/genero_musical_img.svg'
import RomanceImg from '../../Assets/Images/GendersCovers/genero_romance_img.svg'
import SuspenseImg from '../../Assets/Images/GendersCovers/genero_suspense_img.svg'
import TerrorImg from '../../Assets/Images/GendersCovers/genero_terror_img.svg'
import MovieCard from '../../Components/MovieCard/MovieCard';
import ModalSalvarFilme from '../../Components/ModalSalvar/ModalSalvar';


export default function HomePage() {
    // Filmes para o carrossel
    const filmes = [
        { id: 2, titulo: 'Avatar: Fogo e Cinzas', imagem: AvatarImg},
        { id: 10, titulo: 'Five Nights at Freddy`s 2', imagem: FanafImg},
        { id: 12, titulo: 'Michael', imagem: MichaelImg},
    ];

    // Configuração do carrossel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true, 
        autoplaySpeed: 4000,
        pauseOnHover: false,
    };

    // Estados para guardar os gêneros puxados do banco
    const [generos, setGeneros] = useState([]);

    // Guardando capa para cada gênero
    const gendersCovers = {
        'Ação': AcaoImg,
        'Aventura' : AventuraImg,
        'Comédia': ComediaImg,
        'Drama': DramaImg,
        'Terror':  TerrorImg,
        'Suspense': SuspenseImg,
        'Romance': RomanceImg,
        'Criminal': CriminalImg,
        'Biografia': BiografiaImg,
        'Histórico': HistoricoImg,
        'Guerra': GuerraImg,
        'Família': FamiliaImg,
        'Esporte': EsporteImg,
        'Musical': MusicalImg,
        'Documentário': DocImg,
        'Fantasia': FantasiaImg,
        'Ficção': FiccaoImg,
        'Animação': AnimacaoImg
    };

    // Configuração para slider de gêneros e filmes
    const genderSettings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 5,  // quantos cards aparecem na tela
        slidesToScroll: 5,
        arrows: true,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            }
        ]
    };

    // Filmes em alta
    const [topFilmes, setTopFilmes] = useState([]);

    // Estados para o modal
    const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);

    // Guardar filmes não lançados
    const [filmesLancamento, setFilmesLancamento] = useState([]);

    // Puxando gêneros do banco
    useEffect(() => {
        api.get('/generos')
            .then(res => {
                setGeneros(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    // Puxando filmes em alta
    useEffect(() => {
        api.get('/filmes?em_alta=true')
            .then(res => {
                setTopFilmes(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    // Função para formatar data recebida do banco
    function formatarData(dataISO) {
        const data = new Date(dataISO);

        const meses = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];

        const dia = data.getDate();
        const mes = meses[data.getMonth()];
        const ano = data.getFullYear();

        return `${dia} ${mes} ${ano}`;
    }

    // Buscar filmes não lançados
    useEffect(() => {
        api.get('/filmes?lancamento=true')
            .then(res => {
                if (Array.isArray(res.data)) {
                    setFilmesLancamento([...res.data].reverse());
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <div className='homePage'>
            {/* Carrossel */}
            <header>
                <Slider {...settings}>
                    {filmes.map((filme) => (
                        <article key={filme.id} className='slide'>
                            <div className='imgBanner'>
                                <img src={filme.imagem} alt={filme.titulo} />
                                <div className='gradientOverlay'></div>
                            </div>

                            {/* Botões dentro do slide */}
                            <div className='displayBtns'>
                                <Botao 
                                    style='primary'
                                    text='Saber mais'
                                    to={`/filme/${filme.id}`}
                                />
                                <Botao 
                                    style='secondary'
                                    icon={SaveIcon}
                                    onClick = {() => {
                                        setFilmeSelecionado(filme);  // salva os dados do filme
                                        setModalSalvarAberto(true);  // abre modal
                                    }}
                                />
                            </div>
                        </article>
                    ))}
                </Slider>
            </header>

            {/* Seção de gêneros */}
            <section>
                <h1>Gêneros</h1>
                <div className='generosContainer'>
                    <Slider {...genderSettings}>
                        {generos.map((genero) => (
                            <GenderCard 
                                key={genero.id} 
                                nome={genero.nome} 
                                imagem={gendersCovers[genero.nome]} 
                            />
                        ))}
                    </Slider>
                </div>
            </section>

            {/* Seção de filmes em alta */}
            <section>
                <h1>Em alta</h1>
                <div className='generosContainer'>
                    <Slider {...genderSettings}>
                        {topFilmes.map(filme => (
                            <MovieCard 
                                key={filme.id} 
                                titulo={filme.titulo}
                                imagem={filme.capa_vertical}
                                stars={filme.nota_imdb}
                                btnSalvar={() => {
                                    setFilmeSelecionado(filme);
                                    setModalSalvarAberto(true);
                                }}
                            />
                        ))}
                    </Slider>
                </div>
            </section>

            {/* Seção de filmes não lançados */}
            <section>
                <h1>Em breve</h1>
                <div className='generosContainer'>
                    <Slider {...genderSettings}>
                        {filmesLancamento.map(filme => (
                            <MovieCard
                                key={filme.id}
                                titulo={filme.titulo}
                                imagem={filme.capa_vertical}
                                lancamento={formatarData(filme.lancamento)}
                                btnSalvar={() => {
                                    setFilmeSelecionado(filme);
                                    setModalSalvarAberto(true);
                                }}
                            />
                        ))}
                    </Slider>
                </div>
            </section>

            {/* Banner */}
            <section>
                <aside className='loginBanner'>
                    <h2>Veja o catálogo completo!</h2>
                        <Botao
                            style = 'primary'
                            text = 'Acesse o catálogo'
                            to='/'
                        />
                </aside>
            </section>

            {/* Modal */}
            <ModalSalvarFilme
                isOpen={modalSalvarAberto}
                onRequestClose={() => {
                    setModalSalvarAberto(false);
                    // força o slick a recalcular o espaço
                    setTimeout(() => {
                        window.dispatchEvent(new Event('resize'));
                    }, 50);
                }}
                filme={filmeSelecionado}
            />
            
        </div>
    )
}