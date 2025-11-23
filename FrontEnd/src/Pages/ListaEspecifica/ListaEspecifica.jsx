// Página de filmes de uma lista específica

import './ListaEspecifica.css';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../Services/Api';
import MovieCard from '../../Components/MovieCard/MovieCard';
import LoadingModal from '../../Components/LoadingModal/LoadingModal';
import { AuthContext } from '../../Services/AuthContext';
import Modal from 'react-modal';
import '../../Components/ModalSalvar/ModalSalvar.css';
import Logo from '../../Assets/Images/Logo/Logo.svg';
import Botao from '../../Components/Botao/Botao';
import XIcon from '../../Assets/Images/Icons/x_icon.svg';
import SuccessModal from '../../Components/SuccessModal/SuccessModal'


Modal.setAppElement('#root');
export default function ListaEspecificaPage() {
    const { id } = useParams();  // ID da lista vindo da rota
    const { user } = useContext(AuthContext); // pega infos do usuário logado

    const [listaNome, setListaNome] = useState('');
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);

    // guarda nota do usuário para cada filme: { filmeId: nota }
    const [minhasNotas, setMinhasNotas] = useState({});

    // estados para o modal deletar
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false); 
    const [filmeSelecionado, setFilmeSelecionado] = useState(null); // guarda filme clicado
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false); 
    const [successMsg, setSuccessMsg] = useState(''); // texto do sucesso

    // pega filmes da lista
    function fetchFilmes() {
        setLoading(true);

        api.get(`/filmes?lista=${id}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setFilmes(res.data);
                } else {
                    setFilmes([]);
                }
            })
            .catch(err => {
                console.error(err);
                setFilmes([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // buscar nome da lista para exibir no breadcrumb
    function fetchListaNome() {
        api.get(`/listas/usuario/${user.id}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    const lista = res.data.find(l => l.id == id);
                    if (lista) {
                        setListaNome(lista.nome);
                    }
                }
            })
            .catch(err => console.error(err));
    }

    // buscar a nota do usuário para os filmes
    async function fetchNotaFilme(filmeId) {
        try {
            const response = await api.get(`/avaliacoes/usuario/${user.id}/${filmeId}`);

            if (!response.data.Erro) {
                setMinhasNotas(prev => ({
                    ...prev,
                    [filmeId]: response.data.nota
                }));
            }
        } catch (e) {
            console.error('Erro ao buscar nota', e);
        }
    }

    // abre modal de deletar e salva filme clicado
    function abrirModalDeletar(filme) {
        setFilmeSelecionado(filme);
        setModalDeleteOpen(true);
    }

    // função de deletar filme da lista
    async function deletarFilme() {
        if (!filmeSelecionado) return;

        try {
            setLoadingDelete(true);

            await api.delete(`/listas/filme/${id}/${filmeSelecionado.id}`);

            setLoadingDelete(false);
            setSuccessMsg('Filme removido da lista!');
            setSuccessOpen(true);

            // fecha modais depois de 1,5s
            setTimeout(() => {
                setSuccessOpen(false);
                setModalDeleteOpen(false);
                fetchFilmes();  // atualiza lista
            }, 1500);

        } catch (err) {
            console.error(err);
            setLoadingDelete(false);
            alert('Erro ao remover o filme.');
        }
    }

    // chama funções ao abrir a página
    useEffect(() => {
        if (!id) return;

        fetchFilmes();
        fetchListaNome();
    }, [id]);

    // quando filmes carregarem, pegar notas
    useEffect(() => {
        if (filmes.length > 0 && user) {
            filmes.forEach(filme => {
                fetchNotaFilme(filme.id);
            });
        }
    }, [filmes, user]);

    return (
        <div className='listaFilmesPage'>
            {/* Cabeçalho */}
            <header className='listaFilmesHeader'>
                <p className='breadcrumb'>
                    <a href='/listas' className='breadcrumbLink'>Minhas Listas</a>
                    <span> &gt; </span>
                    <span className='breadcrumbAtual'>🎬 {listaNome}</span>
                </p>
            </header>

            {/* Caso não tenha filmes */}
            {!loading && filmes.length === 0 && (
                <div className='noMoviesMessage'>
                    <p>Esta lista ainda não possui filmes!</p>
                </div>
            )}

            {/* Renderizar filmes */}
            {filmes.length > 0 && (
                <div className='filmesGrid'>
                    {filmes.map(filme => (
                        <MovieCard 
                            key={filme.id}
                            id={filme.id}
                            titulo={filme.titulo}
                            imagem={filme.capa_vertical}
                            minhaNota={minhasNotas[filme.id]}
                            btnDeletar={() => abrirModalDeletar(filme)}
                        />
                    ))}
                </div>
            )}

            <LoadingModal isOpen={loading} />

            {/* Modal para deletar filme da lista */}
            <Modal
                isOpen={modalDeleteOpen}
                onRequestClose={() => setModalDeleteOpen(false)}
                className='modalSalvar'
                overlayClassName='modalOverlay'
            >

                {/* Cabeçalho padrão */}
                <header className='headerModal'>
                    <img src={Logo} alt='Logo' className='logo' />
                    <Botao
                        style='secondary'
                        icon={XIcon}
                        onClick={() => setModalDeleteOpen(false)}
                    />
                </header>

                {/* Conteúdo */}
                <section className='modalContent'>
                    <h1>Remover filme da lista?</h1>

                    <p className='textoInfo'>
                        Tem certeza que deseja remover <strong>{filmeSelecionado?.titulo}</strong> desta lista?
                    </p>
                </section>

                {/* Botões */}
                <footer className='footerBtns'>
                    <Botao style='secondary' text='Cancelar' onClick={() => setModalDeleteOpen(false)} />
                    <Botao style='primary' text='Confirmar' onClick={deletarFilme} />
                </footer>
            </Modal>

            {/* Modal de loading enquanto deleta */}
            <LoadingModal isOpen={loadingDelete} />
            
            {/* Modal de sucesso */}
            <SuccessModal isOpen={successOpen} message={successMsg} />
        </div>
    );
}
