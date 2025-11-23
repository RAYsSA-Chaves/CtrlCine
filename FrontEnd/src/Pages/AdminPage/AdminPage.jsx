// página de solicitações dos usuários para o administrador

import Img from '../../Assets/Images/ilustration3.png'
import CardInfo from '../../Components/CardInfo/CardInfo'
import './AdminPage.css'
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import api from '../../Services/Api';
import Botao from '../../Components/Botao/Botao';
import LoadingModal from '../../Components/LoadingModal/LoadingModal';
import SuccessModal from '../../Components/SuccessModal/SuccessModal';
import Logo from '../../Assets/Images/Logo/Logo.svg';
import XIcon from '../../Assets/Images/Icons/x_icon.svg';
import TrashIcon from '../../Assets/Images/Icons/trash_icon.svg';
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root');

export default function AdminPage() {
    const navigate = useNavigate();

    // guardar solicitações puxadas do banco
    const [solicitacoes, setSolicitacoes] = useState([]);

    const [loading, setLoading] = useState(true);

    // modal deletar
    const [modalOpen, setModalOpen] = useState(false);
    const [solSelecionada, setSolSelecionada] = useState(null);
    const [loadingOpen, setLoadingOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // puxar as solicitações do banco
    async function carregarSolicitacoes() {
        try {
            const resp = await api.get('/solicitacoes');
            // filtrar solicitações pendentes
            const naoAceitas = resp.data.filter(sol => !sol.aceito);
            setSolicitacoes(naoAceitas);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarSolicitacoes();
    }, []);

    // abrir modal para excluir a solicitação
    function abrirModalDelete(sol) {
        setSolSelecionada(sol);
        setModalOpen(true);
    }

    // fechar modal
    function fecharModalDelete() {
        setModalOpen(false);
        setSolSelecionada(null);
    }

    // confirmar deleção
    async function confirmarDelete() {
        if (!solSelecionada) return;

        try {
            setLoadingOpen(true);

            const resp = await api.delete(`/solicitacoes/${solSelecionada.id}`);

            setLoadingOpen(false);
            setSuccessMsg('Solicitação recusada e deletada com sucesso!');
            setSuccessOpen(true);

            setTimeout(() => {
                setSuccessOpen(false);
                setModalOpen(false);
                carregarSolicitacoes(); // recarrega lista
            }, 1500);

        } catch (err) {
            console.error(err);
            setLoadingOpen(false);
            alert('Erro ao deletar.');
        }
    }

    return (
        <div className='admPage'>

            <CardInfo
                style='right'
                title='Gerencie as solicitações!'
                paragraphs={[
                    'Como administrador, você pode aceitar ou recusar as solicitações de filmes enviadas pelos usuários.',
                    'Mantenha o controle e garanta que apenas as solicitações adequadas sejam aprovadas!'
                ]}
                image={Img}
                alt='Ilustração de cadeira de diretor'
            />

            <h1>Solicitações</h1>

            {/* Loading enquanto carrega as solicitações */}
            {loading ? (
                <LoadingModal />
            ) : (
                // Listagem de solicitações
                <section className='listaSolicitacoes'>
                    {/* Caso não tenha solicitações */}
                    {solicitacoes.length === 0 ? (
                        <p className='nenhumaSolicitacao'>Nenhuma solicitação pendente encontrada.</p>
                    ) : (
                        solicitacoes.map((sol) => (
                            <article key={sol.id} className='cardSolicitacao'>

                                <div className='solInfo'>
                                    {/* Foto do usuário */}
                                    <img
                                        src={sol.usuario_foto}
                                        alt='Foto usuário'
                                        className='solFoto'
                                    />

                                    {/* Texto */}
                                    <p className='solicitacaoTxt'>
                                        <strong>{sol.usuario_nome}</strong>{' '}

                                        {sol.tipo === 'novo filme' && (
                                            <>solicitou o filme “{sol.filme?.titulo}”!</>
                                        )}

                                        {sol.tipo === 'edição' && (
                                            <>solicitou a edição do filme “{sol.filme?.titulo}”!</>
                                        )}
                                    </p>
                                </div>

                                {/* Botões */}
                                <div className='solBtns'>
                                    <button
                                        className='recusarBtn'
                                        onClick={() => abrirModalDelete(sol)}
                                    >
                                        <img src={TrashIcon} alt='Excluir' />
                                    </button>

                                    <button
                                        className='verBtn'
                                        onClick={() => navigate(`/movie_form?mode=solicitacao&idSolicitacao=${sol.id}`)}
                                    >
                                        <Eye stroke='#fff'/>
                                    </button>
                                </div>
                            </article>
                        )
                    ))}
                </section>
            )}

            {/* Modal para excluir solicitação */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={fecharModalDelete}
                className='modalSalvar'
                overlayClassName='modalOverlay'
            >
                {/* Cabeçalho */}
                <header className='headerModal'>
                    <img src={Logo} alt='Logo' className='logo' />
                    <Botao
                        style='secondary'
                        icon={XIcon}
                        onClick={fecharModalDelete}
                    />
                </header>

                {/* Conteúdo */}
                <section className='modalContent'>
                    <h1>Tem certeza que deseja deletar?</h1>

                    <p className='textoInfo'>
                        Você está prestes a remover a solicitação de{' '}
                        <strong>{solSelecionada?.usuario_nome}</strong>.
                    </p>

                    <p className='textoInfo'>Esta ação não pode ser desfeita!</p>
                </section>

                {/* Footer */}
                <footer className='footerBtns'>
                    <Botao
                        style='secondary'
                        text='Cancelar'
                        onClick={fecharModalDelete}
                    />

                    <Botao
                        style='primary'
                        text='Deletar'
                        onClick={confirmarDelete}
                    />
                </footer>
            </Modal>

            {/* Modais internos */}
            <LoadingModal isOpen={loadingOpen} />
            <SuccessModal isOpen={successOpen} message={successMsg} />
        </div>
    );
}
