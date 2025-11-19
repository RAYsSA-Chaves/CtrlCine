import './MoviePage.css'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../Services/Api'
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import Botao from '../../Components/Botao/Botao'
import { AuthContext } from '../../Services/AuthContext'

export default function MoviePage() {
    const { id } = useParams()

    const [filme, setFilme] = useState(null)
    const [avaliacoes, setAvaliacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

    const { user } = useContext(AuthContext)   // usuário logado

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
            <div className='banner'>
                <img src={filme?.capa_horizontal} alt={filme?.titulo} />
                <h1>{filme?.titulo}</h1>
            </div>

            <div className='conteudo'>
                <div className='infos'>
                    <h1>{filme?.titulo}</h1>

                    <p className='detalhes'>
                        <span>{new Date(filme.lancamento).getFullYear()}</span> •
                        <span>{filme.duracao} min</span> •
                        <span>IMDB {filme.nota_imdb}</span>
                    </p>

                    <p className='sinopse'>{filme.sinopse}</p>

                    {/* Trailer */}
                    {filme.trailer && (
                        <a href={filme.trailer} target="_blank" rel="noreferrer">
                            <Botao style="primary" text="Assistir trailer" />
                        </a>
                    )}

                    {/* LISTAS — evitar [object Object] */}
                    <div className='infoList'>
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

                        <h3>Diretor</h3>
                        <p>{filme.diretor?.map(d => d.nome).join(', ')}</p>

                        <h3>Produtoras</h3>
                        <p>{filme.produtoras?.map(p => p.nome).join(', ')}</p>

                        <h3>Gêneros</h3>
                        <p>{filme.generos?.map(g => g.nome).join(', ')}</p>
                    </div>
                </div>

                {/* ===================================
                     A V A L I A Ç Õ E S
                =================================== */}
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
            </div>
        </div>
    )
}
