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
    const { id } = useParams()  // id do filme passado na url

    const [filme, setFilme] = useState(null)
    const [avaliacoes, setAvaliacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

    const { user } = useContext(AuthContext)  // usuário logado

    // Estados para o modal de salvar filme em listas
    const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);

    // Modal de avaliação
    const [modalAvaliarAberto, setModalAvaliarAberto] = useState(false);

    // Verificar se filme não lançou ainda
    const filmeJaLancou = filme ? new Date(filme.lancamento) <= new Date() : false;

    // Configurações do carrossel de atores
    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: true,
    };

    // Busca o filme passado na url
    function fetchFilme() {
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

    // Busca avaliações do filme
    function fetchAvaliacoes() {
        return api.get(`/avaliacoes/filme/${id}`)
            .then(res => {
                if (Array.isArray(res.data)) setAvaliacoes(res.data)
                else setAvaliacoes([])
            })
            .catch(() => setAvaliacoes([]))
    }

    // Chama as funções ao carregar a página
    useEffect(() => {
        setLoading(true)

        Promise.all([
            fetchFilme(),
            fetchAvaliacoes()
        ])
            .finally(() => setLoading(false))
    }, [id])

    // mostrar o loading
    if (loading) return <LoadingModal isOpen={true} />

    // mostrar erro
    if (erro) {
        console.log(erro)
    }

    // pegando a avaçiação do usuário logado
    const avaliacaoUser = avaliacoes.find(a => a.usuario_nome === user?.nome)
    // avaliações de outros usuários
    const outrasAvaliacoes = avaliacoes.filter(a => a.usuario_nome !== user?.nome)

    // Calcular média de notas na plataforma
    let mediaCtrlCine = 0;
    if (avaliacoes.length > 0) {
        let soma = 0;

        for (let i = 0; i < avaliacoes.length; i++) {
            soma += Number(avaliacoes[i].nota);
        }

        mediaCtrlCine = soma / avaliacoes.length;
        mediaCtrlCine = Math.round(mediaCtrlCine);  // somente notas cheias de 1 a 5
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
                            to={`/movie_form?mode=edit&id=${filme.id}`}
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

            {/* Informações do filme */}
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
                            <div className='ratingMedia imdb'>
                                {filmeJaLancou && (
                                    <div className="starsBox">
                                    {renderStars(filme.nota_imdb)}
                                </div>
                                )}
                                {!filmeJaLancou ? (
                                    <p>Aguardando lançamento</p>
                                ) : (
                                    <p>{filme.nota_imdb}</p>
                                )}
                            </div>
                        </section>

                        <div className='divider'></div>

                        <section className='ctrlcineSection'>
                            <p>CtrlCine</p>
                            <div className='ratingMedia ctrlcine'>
                                {filmeJaLancou && mediaCtrlCine > 0 && (
                                    <div className="starsBox">
                                        {renderStars(mediaCtrlCine)}
                                    </div>
                                )}
                                {!filmeJaLancou ? (
                                    <p>Aguardando lançamento</p>
                                ) : mediaCtrlCine === 0 ? (
                                    <p>-</p>
                                ) : (
                                    <p>{mediaCtrlCine}</p>
                                )}
                            </div>
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
                    <p>Avaliações</p>
                    {/* Botão avaliar, caso o usuário ainda não tenha avaliado o filme */}
                    { filmeJaLancou && !avaliacaoUser && (
                        <Botao 
                            style='primary'
                            text='Avaliar'
                            onClick={() => setModalAvaliarAberto(true)}
                        />
                    )}
                </div>

                {/* Filme ainda não lançado */}
                {!filmeJaLancou && (
                    <p className='msg'>Este filme ainda não foi lançado. As avaliações serão liberadas após a estreia.</p>
                )}

                {/* Nenhuma avaliação */}
                {filmeJaLancou && avaliacoes.length === 0 && (
                    <p className='msg'>Nenhuma avaliação ainda. Seja o primeiro!</p>
                )}

                {/* Usuário ainda não avaliou */}
                {filmeJaLancou && avaliacoes.length > 0 && !avaliacaoUser && (
                    <p className='msg'>Você ainda não avaliou este filme!</p>
                )}

                {/* Avaliação do usuário */}
                {avaliacaoUser && (
                    <div className="avaliacao userAvaliacao">
                        <h2>Sua avaliação</h2>

                        {/* Cabeçalho com nome, foto e estrelas */}
                        <div className='avalHeader'>
                            <div className="userInfo">
                                <img src={avaliacaoUser.usuario_foto} alt="Sua foto de perfil" />
                                <p>{avaliacaoUser.usuario_nome}</p>
                            </div>
                            <div className="userRating">
                                <div className="starsBox">
                                    {renderStars(avaliacaoUser.nota)}
                                </div>
                                <p>{avaliacaoUser.nota}</p>
                            </div>
                        </div>
                        {/* Resenha */}
                        <p>{avaliacaoUser.resenha}</p>
                    </div>
                )}

                {/* Outras avaliações */}
                {outrasAvaliacoes.map(a => (
                    <div key={a.id} className="avaliacao">
                        {/* Cabeçalho com nome, foto e estrelas */}
                        <div className='avalHeader'>
                            <div className="userInfo">
                                <img src={a.usuario_foto} alt="Foto do usuário" />
                                <p>{a.usuario_nome}</p>
                            </div>
                            <div className="userRating">
                                <div className="starsBox">
                                    {renderStars(a.nota)}
                                </div>
                                <p>{a.nota}</p>
                            </div>
                        </div>
                        {/* Resenha */}
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
                recarregar={fetchAvaliacoes}  // recarrega a lista após salvar
            />

            {/* Modal salvar filme em lita */}
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
