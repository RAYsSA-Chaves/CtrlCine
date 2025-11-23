// Página de catálogo com filtros, busca e modal de salvar
import './Catalogo.css'
import SearchIcon from '../../Assets/Images/Icons/search_icon.svg'
import { useState, useEffect } from 'react';
import Botao from '../../Components/Botao/Botao'
import MovieCard from '../../Components/MovieCard/MovieCard'
import api from '../../Services/Api'
import { Star } from 'lucide-react'
import ModalSalvarFilme from '../../Components/ModalSalvar/ModalSalvar';
import ModalDeletarFilme from '../../Components/ModalDeletarFilme/ModalDeletarFilme';
import { useSearchParams } from 'react-router-dom';
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';


export default function Catalogo() {
    const { user } = useContext(AuthContext);

    // modal de loading
    const [loading, setLoading] = useState(true);

    // caso venha da página home (card de gênero), aplicar filtro de gênero direto
    const [searchParams] = useSearchParams();

    const generoInicial = searchParams.get('genero');
    const [generoSelecionado, setGeneroSelecionado] = useState(
        generoInicial ? { nome: generoInicial } : null
    );

    // estados de busca e filtros
    const [textoTitulo, setTextoTitulo] = useState('');
    const [notaSelecionada, setNotaSelecionada] = useState(null);
    const [ano, setAno] = useState('');
    const [ator, setAtor] = useState('');
    const [diretor, setDiretor] = useState('');
    const [produtora, setProdutora] = useState('');

    // guardar os filmes puxados do banco
    const [filmes, setFilmes] = useState([]);

    // guardar gêneros puxados do banco
    const [generos, setGeneros] = useState([]);

    // mensagem caso nenhum filme seja encontrado
    const [mensagem, setMensagem] = useState('');

    // estados para os modais de salvar ou deletar
    const [modalSalvarAberto, setModalSalvarAberto] = useState(false);
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

    // resetar filtros ao entrar na página
    useEffect(() => {
        limparFiltros();
        setLoading(false);
    }, []);

    // puxar gêneros do banco
    useEffect(() => {
        async function carregarGeneros() {
            try {
                const res = await api.get('/generos');
                setGeneros(res.data);

                // se veio ?genero=Drama na URL, seleciona automaticamente
                if (generoInicial) {
                    const encontrado = res.data.find(
                        g => g.nome.toLowerCase() === generoInicial.toLowerCase()
                    );
                    if (encontrado) {
                        setGeneroSelecionado(encontrado);
                    }
                }

            } catch (err) {
                console.error('Erro ao carregar gêneros:', err);
            }
        }
        carregarGeneros();
    }, []);

    // função para buscar filmes
    async function fetchFilmes() {
        try {
            setLoading(true);

            // busaca/filtros aplicados
            const params = {};
            if (textoTitulo) params.titulo = textoTitulo;
            if (generoSelecionado) params.genero = generoSelecionado.nome;
            if (notaSelecionada) params.nota = notaSelecionada;
            if (ano) params.ano = ano;
            if (ator) params.ator = ator;
            if (diretor) params.diretor = diretor;
            if (produtora) params.produtora = produtora;

            // monta a query com os parâmetros
            const query = new URLSearchParams(params).toString();

            // envia a query para a api
            const res = await api.get(`/filmes?${query}`);

            // verifica se encontrou filmes
            if (Array.isArray(res.data)) {
                setFilmes(res.data);
                setMensagem(res.data.length === 0 ? 'Nenhum filme encontrado.' : '');
            } else if (res.data.Mensagem) {
                setFilmes([]);
                setMensagem(res.data.Mensagem);
            }

            // sobe a página depois de carregar os filmes
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
        } catch (err) {
            console.error('Erro ao buscar filmes:', err);
            setMensagem('Erro ao carregar filmes.');

        } finally {
        setLoading(false);
    }
    }

    // funções dos filtros de seleção
    function selecionarGenero(gen) {
        if (generoSelecionado?.id === gen.id) setGeneroSelecionado(null);
        else setGeneroSelecionado(gen);
        setTextoTitulo('');
    }

    function selecionarNota(valor) {
        if (notaSelecionada === valor) setNotaSelecionada(null);
        else setNotaSelecionada(valor);
        setTextoTitulo('');
    }

    // busca filmes automaticamente ao selecinar nota ou gênero
    useEffect(() => {
        fetchFilmes();
    }, [generoSelecionado, notaSelecionada]);

    // função da barra de pesquisa (limpa os filtros)
    function handleSubmit(e) {
        e.preventDefault();
        setGeneroSelecionado(null);
        setNotaSelecionada(null);
        setAno('');
        setAtor('');
        setDiretor('');
        setProdutora('');
        fetchFilmes();
    }

    // função do botão limpar filtros
    function limparFiltros() {
        setGeneroSelecionado(null);
        setNotaSelecionada(null);
        setAno('');
        setAtor('');
        setDiretor('');
        setProdutora('');
        setTextoTitulo('');
        fetchFilmes();
    }

    // abrir modal de salvar filme em listas
    function abrirModalSalvar(filme) {
        setFilmeSelecionado(filme);
        setModalSalvarAberto(true);
    }

    // abrir modal de deletar
    function abrirModalDelete(filme) {
        setFilmeSelecionado(filme);
        setModalDeleteOpen(true);
    }

    // fechar modal de deletar
    function fecharModalDelete(deletou) {
        setModalDeleteOpen(false);

        if (deletou) {
            carregarFilmes(); // recarrega a lista
        }
    }

    if (loading) return <LoadingModal isOpen={true} />;

    return (
        <div className='catalogoPage'>
            {/* Barra de pesquisa */}
            <form className='searchBar' onSubmit={handleSubmit}>
                <input 
                    type='text'
                    placeholder='Busque por um filme'
                    value={textoTitulo}
                    onChange={(e) => setTextoTitulo(e.target.value)}
                />
                <Botao style='primary' icon={SearchIcon} type='submit' />
            </form>

            <div className='catalogoMainContent'>
                {/* Filtros */}
                <aside className='filtro'>
                    <h1>Filtrar por</h1>

                    {/* Gênero */}
                    <div className='filtroGrupo'>
                        <h2>Gênero</h2>
                        <div className='generosBox'>
                            {generos.map((gen) => (
                                <button
                                    key={gen.id}
                                    className={`generoBtn ${generoSelecionado?.id === gen.id ? 'ativo' : ''}`}
                                    onClick={() => selecionarGenero(gen)}
                                >
                                    {gen.nome}
                                    {generoSelecionado?.id === gen.id && <span className='remover'>x</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='divider'></div>

                    {/* Nota */}
                    <div className='filtroGrupo'>
                        <h2>Nota</h2>
                        <div className='notasBox'>
                            {[5,4,3,2,1].map((valor) => (
                                <label key={valor} className='notaLabel'>
                                    <input
                                        type='radio'
                                        name='nota'
                                        checked={notaSelecionada === valor}
                                        onChange={() => selecionarNota(valor)}
                                    />
                                    <div className='estrelas'>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={24}
                                                stroke='none'
                                                fill={i < valor ? 'var(--red)' : '#555'}
                                            />
                                        ))}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='divider'></div>

                    {/* Ano */}
                    <div className='filtroGrupo'>
                        <h2>Ano</h2>
                        <form className='searchBar2' onSubmit={(e)=>{e.preventDefault(); fetchFilmes();}}>
                            <input type='text' placeholder='Digite um ano' value={ano} onChange={(e)=>{setAno(e.target.value); setTextoTitulo('')}}/>
                            <Botao style='primary' icon={SearchIcon} type='submit' />
                        </form>
                    </div>

                    <div className='divider'></div>

                    {/* Ator */}
                    <div className='filtroGrupo'>
                        <h2>Ator</h2>
                        <form className='searchBar2' onSubmit={(e)=>{e.preventDefault(); fetchFilmes();}}>
                            <input type='text' placeholder='Digite o nome de um ator' value={ator} onChange={(e)=>{setAtor(e.target.value); setTextoTitulo('')}}/>
                            <Botao style='primary' icon={SearchIcon} type='submit' />
                        </form>
                    </div>

                    <div className='divider'></div>

                    {/* Diretor */}
                    <div className='filtroGrupo'>
                        <h2>Diretor</h2>
                        <form className='searchBar2' onSubmit={(e)=>{e.preventDefault(); fetchFilmes();}}>
                            <input type='text' placeholder='Digite o nome de um diretor' value={diretor} onChange={(e)=>{setDiretor(e.target.value); setTextoTitulo('')}}/>
                            <Botao style='primary' icon={SearchIcon} type='submit' />
                        </form>
                    </div>

                    <div className='divider'></div>

                    {/* Produtora */}
                    <div className='filtroGrupo'>
                        <h2>Produtora</h2>
                        <form className='searchBar2' onSubmit={(e)=>{e.preventDefault(); fetchFilmes();}}>
                            <input type='text' placeholder='Digite o nome de uma produtora' value={produtora} onChange={(e)=>{setProdutora(e.target.value); setTextoTitulo('')}}/>
                            <Botao style='primary' icon={SearchIcon} type='submit' />
                        </form>
                    </div>

                    <div className='divider'></div>

                    <Botao style='terciary' text='Limpar filtros' onClick={limparFiltros} />
                </aside>

                {/* Filmes encontrados */}
                <section className='catalogoFilmes'>
                    {mensagem && <p className='mensagem'>{mensagem}</p>}
                    <div className='filmesGrid'>
                        {filmes.map(filme => (
                            <MovieCard
                                key={filme.id}
                                id={filme.id}
                                titulo={filme.titulo}
                                imagem={filme.capa_vertical}
                                btnSalvar={() => abrirModalSalvar(filme)}
                                btnDeletar={() => abrirModalDelete(filme)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Banner */}
            { user.role === 'comum' && (
                <aside className='loginBanner'>
                    <h2>Não encontrou um filme? Solicite já!</h2>
                        <Botao
                            style = 'primary'
                            text = 'Solicitar filme'
                            to='/movie_form?mode=create'
                        />
                </aside>
            ) }

            {/* Modal salvar */}
            <ModalSalvarFilme
                isOpen={modalSalvarAberto}
                onRequestClose={() => {
                    setModalSalvarAberto(false);
                }}
                filme={filmeSelecionado}
            />

            {/* Modal deletar filme */}
            <ModalDeletarFilme
                isOpen={modalDeleteOpen}
                onRequestClose={fecharModalDelete}
                filme={filmeSelecionado}
            />
        </div>
    )
}
