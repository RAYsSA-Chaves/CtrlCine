// Página de filme específico

import './MoviePage.css'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../Services/Api'
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import Botao from '../../Components/Botao/Botao'
import { AuthContext } from '../../Services/AuthContext'
import SaveIcon from '../../Assets/Images/Icons/flag_icon.svg'
import ModalSalvarFilme from '../../Components/ModalSalvar/ModalSalvar'
import { Star } from 'lucide-react'
import SinopseIcon from '../../Assets/Images/Icons/sinopse_icon.svg'
import TrailerIcon from '../../Assets/Images/Icons/trailer_icon.svg'
import ElencoIcon from '../../Assets/Images/Icons/people_icon.svg'
import DuracaoIcon from '../../Assets/Images/Icons/clock_icon.svg'
import AnoIcon from '../../Assets/Images/Icons/calendar_icon.svg'
import GeneroIcon from '../../Assets/Images/Icons/genders_icon.svg'
import { renderStars } from '../../Utils/renderStarsFunction'
import Slider from 'react-slick';
import DiretorIcon from '../../Assets/Images/Icons/person_icon.svg'
import ProdutoraIcon from '../../Assets/Images/Icons/camera_icon.svg'
import ModalAvaliacao from '../../Components/ModalAvaliacao/ModalAvaliacao'


export default function MoviePage() {
    const { id } = useParams()

    const [filme, setFilme] = useState(null)
    const [avaliacoes, setAvaliacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

    const { user } = useContext(AuthContext)   // usuário logado

    // Estados para o modal
    const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);

    // Modal de avaliação
    const [modalAvaliarAberto, setModalAvaliarAberto] = useState(false);

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: true,
    };

    let mediaCtrlCine = 0;

    // ============================
    //     BUSCA FILME
    // ============================
    function fetchFilme() {
        // IMPORTANTE: retornar a Promise
        return api.get(`/filmes/${id}`)
            .then(res => {
                if (res.data.Erro) setErro(res.data.Erro)
                else {
                    setFilme(res.data)
                    setErro('')
                }
            })
            .catch(err => {
                setErro(err.response?.data?.Erro || 'Erro ao carregar o filme')
            })
    }

    // ============================
    //     BUSCA AVALIAÇÕES
    // ============================
    function fetchAvaliacoes() {
        // IMPORTANTE: retornar a Promise
        return api.get(`/avaliacoes/filme/${id}`)
            .then(res => {
                if (Array.isArray(res.data)) setAvaliacoes(res.data)
                else setAvaliacoes([])
            })
            .catch(() => setAvaliacoes([]))
    }

    // ============================
    //   CHAMAR AO CARREGAR A PÁGINA
    // ============================
    useEffect(() => {
        setLoading(true)

        // Promise.all só funciona se as funções retornarem algo
        Promise.all([
            fetchFilme(),
            fetchAvaliacoes()
        ])
            .finally(() => setLoading(false))
    }, [id])

    // ============================
    //         ESTADOS
    // ============================
    if (loading) return <LoadingModal isOpen={true} />

    if (erro) {
        return (
            <div className="erroFilme">
                <h2>{erro}</h2>
            </div>
        )
    }

    // ============================
    //   AVALIAÇÃO DO USUÁRIO
    // ============================
    const avaliacaoUser = avaliacoes.find(a => a.usuario_nome === user?.nome)
    const outrasAvaliacoes = avaliacoes.filter(a => a.usuario_nome !== user?.nome)

    if (avaliacoes.length > 0) {
        let soma = 0;

        for (let i = 0; i < avaliacoes.length; i++) {
            soma += Number(avaliacoes[i].nota);
        }

        mediaCtrlCine = soma / avaliacoes.length;
        mediaCtrlCine = Math.round(mediaCtrlCine);
    }

    return (
        <div className="filmePage">

            {/* Banner */}
            <article className='filmeCapa'>
                <img src={filme?.capa_horizontal} alt={filme?.titulo} className='capaHorizontal' />
                <div>
                    <h1>{filme?.titulo}</h1>
                    <div className='displayBtns'>
                        <Botao 
                            style='primary'
                            text='Editar'
                        />
                        <Botao 
                            style='secondary'
                            icon={SaveIcon}
                            onClick = {() => {
                                setFilmeSelecionado(filme);
                                setModalSalvarAberto(true);
                            }}
                        />
                    </div>
                </div>
            </article>

            {/* Informações */}
            <section className='infosFilme'>
                <div className='infos1'>
                    {/* Sinopse */}
                    <article id='sinopse'>
                        <div className='titleDisplay'>
                            <img src={SinopseIcon} alt="Ícone de texto" />
                            <p>Sinopse</p>
                        </div>
                        <p className='sinopse'>{filme.sinopse}</p>
                    </article>

                    {/* Trailer */}
                    <article id='trailer'>
                        <div className='titleDisplay'>
                            <img src={TrailerIcon} alt="Ícone de play" />
                            <p>Trailer</p>
                        </div>
                        <iframe
                            className="trailerIframe"
                            src={`https://www.youtube.com/embed/${filme.trailer}?modestbranding=1&cc_load_policy=1&cc_lang_pref=pt&rel=0`}
                            title="Trailer do filme"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        ></iframe>
                    </article>

                    {/* Elenco */}
                    <article id='elenco'>
                        <div className='titleDisplay'>
                            <img src={ElencoIcon} alt="Ícone de play" />
                            <p>Elenco</p>
                        </div>
                        <div className="atoresGrid">
                            <Slider {...settings}>
                                {filme.atores?.length > 0 ? (
                                    filme.atores.map(ator => (
                                        
                                        <article className="atorCard" key={ator.id}>
                                            <img src={ator.foto} alt={ator.nome} />
                                            <p>{ator.nome}</p>
                                        </article>
                                    ))
                                ) : (
                                    <p className="msg">Nenhum ator cadastrado.</p>
                                )}
                            </Slider>
                        </div>  
                    </article>              
                </div>
                
                <div className='infos2'>
                    {/* Duração */}
                    <article id='duracao'>
                        <div className='titleDisplay'>
                            <img src={DuracaoIcon} alt="Ícone de play" />
                            <p>Duração</p>
                        </div>
                        <p>{filme.duracao}</p>
                    </article>

                    {/* Ano */}
                    <article id='ano'>
                        <div className='titleDisplay'>
                            <img src={AnoIcon} alt="Ícone de play" />
                            <p>Ano</p>
                        </div>
                        <p>{new Date(filme.lancamento).getFullYear()}</p>
                    </article>

                    {/* Média de avaliações */}
                    <article id='avaliacoes'>
                        <div className='titleDisplay'>
                            <Star />
                            <p>Média de avalições</p>
                        </div>
                        <section>
                            <p>IMDb</p>
                            <div className="starsBox">
                                {renderStars(filme.nota_imdb)}
                            </div>
                            <p>{filme.nota_imdb}</p>
                        </section>
                         <section>
                            <p>CtrlCine</p>
                            <div className="starsBox">
                                {renderStars(filme.mediaCtrlCine)}
                            </div>
                            <p>{mediaCtrlCine}</p>
                        </section>
                    </article>

                    {/* Gêneros */}
                    <article id='genero'>
                        <div className='titleDisplay'>
                            <img src={GeneroIcon} alt="Ícone de play" />
                            <p>Gênero</p>
                        </div>
                        <div className='labels'>
                            {filme.generos.map(function(genero) {
                                return (
                                    <p key={genero.id} className="labelItem">
                                        {genero.nome}
                                    </p>
                                )
                            })}
                        </div>
                    </article>

                    {/* Diretor */}
                    <article id='diretor'>
                        <div className='titleDisplay'>
                            <img src={DiretorIcon} alt="Ícone de texto" />
                            <p>Diretor</p>
                        </div>
                        <p>{filme.diretor?.map(d => d.nome).join(', ')}</p>
                    </article>
                    
                    {/* Produtoras */}
                    <article id='produtora'>
                        <div className='titleDisplay'>
                            <img src={ProdutoraIcon} alt="Ícone de play" />
                            <p>Produtoras</p>
                        </div>
                        <div className='labels'>
                            {filme.produtoras.map(function(produtora) {
                                return (
                                    <p key={produtora.id} className="labelItem">
                                        {produtora.nome}
                                    </p>
                                )
                            })}
                        </div>
                    </article>
                </div>
            </section>

            {/* Avalições */}
            <section className="avaliacoesSecao">
                <div className='avaliacoesHeader'>
                    <h1>Avaliações</h1>
                    <Botao 
                        style='primary'
                        text='Avaliar'
                        onClick={() => setModalAvaliarAberto(true)}
                    />
                </div>
                

                    {/* Nenhuma avaliação */}
                    {avaliacoes.length === 0 && (
                        <p className='msg'>Nenhuma avaliação ainda. Seja o primeiro!</p>
                    )}

                    {/* Usuário ainda não avaliou */}
                    {avaliacoes.length > 0 && !avaliacaoUser && (
                        <p className='msg'>Você ainda não avaliou este filme.</p>
                    )}

                    {/* Avaliação do usuário */}
                    {avaliacaoUser && (
                        <div className="avaliacao userAvaliacao">
                            <h4>Sua avaliação</h4>
                            <p><strong>Nota:</strong> {avaliacaoUser.nota}/5</p>
                            <p>{avaliacaoUser.resenha}</p>
                        </div>
                    )}

                    {/* Outras avaliações */}
                    {outrasAvaliacoes.map(a => (
                        <div key={a.id} className="avaliacao">
                            <h4>{a.usuario_nome}</h4>
                            <p><strong>Nota:</strong> {a.nota}/5</p>
                            <p>{a.resenha}</p>
                        </div>
                    ))}
                </section>

            {/* Modal avaliar */}
            <ModalAvaliacao
                isOpen={modalAvaliarAberto}
                onRequestClose={() => setModalAvaliarAberto(false)}
                filme={filme}
                user={user}
                recarregar={fetchAvaliacoes}   // importantíssimo: recarrega a lista após salvar
            />

            {/* Modal reutilizável */}
            <ModalSalvarFilme
                isOpen={modalSalvarAberto}
                onRequestClose={() => {
                    setModalSalvarAberto(false);
                    }}
                filme={filmeSelecionado}
            />       
        </div>
    )
}
