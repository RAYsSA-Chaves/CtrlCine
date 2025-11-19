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
                            width="100%" 
                            height="315" 
                            src={'https://www.youtube.com/embed/dQw4w9WgXcQ'} 
                            title="Trailer do filme"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </article>

                    {/* Elenco */}
                    <article id='elenco'>
                        <h3>Atores</h3>
                        <div className="atoresGrid">
                            {filme.atores?.length > 0 ? (
                                filme.atores.map(ator => (
                                    <div className="atorCard" key={ator.id}>
                                        <img src={ator.foto} alt={ator.nome} />
                                        <p>{ator.nome}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="msg">Nenhum ator cadastrado.</p>
                            )}
                        </div>  
                    </article>              
                </div>
                
                <div className='infos2'>
                    {/* Duração */}
                    <span>{filme.duracao}</span>

                    {/* Ano */}
                    <span>{new Date(filme.lancamento).getFullYear()}</span>

                    {/* Média de avaliações */}
                    <span>IMDB {filme.nota_imdb}</span>

                    {/* Gêneros */}
                    <h3>Gêneros</h3>
                    <p>{filme.generos?.map(g => g.nome).join(', ')}</p>

                    {/* Diretor */}
                    <h3>Diretor</h3>
                    <p>{filme.diretor?.map(d => d.nome).join(', ')}</p>

                    {/* Produtoras */}
                    <h3>Produtoras</h3>
                    <p>{filme.produtoras?.map(p => p.nome).join(', ')}</p>
                </div>
            </section>

                
                <div className="avaliacoesBox">
                    
                    <h2>Avaliações</h2>

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
                </div>

            {/* Modal */}
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
