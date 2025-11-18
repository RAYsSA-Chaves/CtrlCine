import './ListasPage.css'
import { useState, useEffect, useContext } from 'react'
import api from '../../Services/Api'
import ListCard from '../../Components/ListCard/ListCard';
import { Pencil, X } from 'lucide-react'
import Modal from 'react-modal'
import XIcon from '../../Assets/Images/Icons/x_icon.svg'
import Logo from '../../Assets/Images/Logo/Logo.svg'
import Botao from '../../Components/Botao/Botao'
import Input from '../../Components/Input/Input'
// Modais de loading e sucesso
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import SuccessModal from '../../Components/SuccessModal/SuccessModal'

// Importa contexto
import { AuthContext } from '../../Services/AuthContext'

export default function ListasPage() {
    const { user } = useContext(AuthContext)  // pega usuário logado

    const [listas, setListas] = useState([])

    // Modal estados
    const [modalAberto, setModalAberto] = useState(false)
    const [listaSelecionada, setListaSelecionada] = useState(null)
    const [novoNome, setNovoNome] = useState('')

    // Loading states
    const [loadingListas, setLoadingListas] = useState(true)
    const [processando, setProcessando] = useState(false)

    // Success modal
    const [successMsg, setSuccessMsg] = useState('')
    const [successAberto, setSuccessAberto] = useState(false)

    // Estados para modal de criação
    const [modalCriarAberto, setModalCriarAberto] = useState(false);
    const [novoNomeCriar, setNovoNomeCriar] = useState('');

    // Pega listas do usuário logado
    function fetchListas() {
        if (!user) return

        setLoadingListas(true)
        api.get(`/listas/usuario/${user.id}`)
            .then(res => {
                setListas(res.data)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setLoadingListas(false)
            })
    }

    useEffect(() => {
        fetchListas()
    }, [user])

    // Abrir modal de edição
    function abrirModal(lista) {
        setListaSelecionada(lista)
        setNovoNome(lista.nome)
        setModalAberto(true)
    }

    // Fechar modal de edição
    function fecharModal() {
        setModalAberto(false)
        setListaSelecionada(null)
        setNovoNome('')
    }

    // Função de editar lista
    function editarLista() {
        if (!novoNome.trim()) return
        setProcessando(true)

        api.put(`/listas/${listaSelecionada.id}`, { nome: novoNome })
            .then(res => {
                setProcessando(false)
                setModalAberto(false)
                showSuccess(res.data.Mensagem)
                fetchListas()
            })
            .catch(err => {
                setProcessando(false)
                alert(err.response?.data?.Erro || 'Erro ao atualizar a lista.')
            })
    }

    // Função de deletar lista
    function deletarLista() {
        if (!window.confirm('Deseja realmente deletar esta lista?')) return
        setProcessando(true)

        api.delete(`/listas/${listaSelecionada.id}`)
            .then(res => {
                setProcessando(false)
                setModalAberto(false)
                showSuccess(res.data.Mensagem)
                fetchListas()
            })
            .catch(err => {
                setProcessando(false)
                alert(err.response?.data?.Erro || 'Erro ao deletar a lista.')
            })
    }

    // Abre o success modal e fecha automaticamente após 2s
    function showSuccess(msg) {
        setSuccessMsg(msg)
        setSuccessAberto(true)
        setTimeout(() => {
            setSuccessAberto(false)
        }, 2000)
    }

    // Função para abrir modal de criação
    function abrirModalCriar() {
        setNovoNomeCriar('');
        setModalCriarAberto(true);
    }

    // Fechar modal de criação
    function fecharModalCriar() {
        setModalCriarAberto(false);
        setNovoNomeCriar('');
    }

    // Função de criar lista via API
    async function criarLista() {
        if (!novoNomeCriar.trim()) return;

        try {
            setProcessando(true); // mostra LoadingModal

            const res = await api.post("/listas", {
                usuario_id: user.id,
                nome: novoNomeCriar.trim(),
            });

            showSuccess("Lista criada com sucesso!");
            fetchListas(); 
            fecharModalCriar();

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.Erro || "Erro ao criar lista.");
        } finally {
            setProcessando(false);
        }
    }

    Modal.setAppElement('#root')

    return (
        <div className='userListsPage'>
            <header>
                <h1>Minhas Listas</h1>
                 <Botao
                    style="primary"
                    text="Nova lista"
                    onClick={abrirModalCriar}
                />
            </header>

            {/* Modal de loading enquanto busca listas */}
            { !loadingListas && listas.length === 0 && (
                <div className="noListsMessage">
                    <p>Você ainda não possui listas!</p>
                </div>
            )}

            {listas.length > 0 && (
                <div className='listasGrid'>
                    {listas.map(lista => (
                        <div key={lista.id} className='listaWrapper'>
                            <ListCard
                                nome={lista.nome}
                                onEditar={() => abrirModal(lista)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Dentro do return da página: */}
            <Modal
                isOpen={modalAberto}
                onRequestClose={fecharModal}
                className="modalSalvar"
                overlayClassName="modalOverlay"
            >
                <header className="headerModal">
                    <img src={Logo} alt="Logo" className="logo" />
                    <Botao
                        style="secondary"
                        icon={XIcon}
                        onClick={fecharModal}
                    />
                </header>
                
                <section className="modalContent">
                    <h1>Editar Lista</h1>
                    <Input
                        label='Nome da lista'
                        value = {novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        name = 'nome'
                        disabled={processando}
                    />           
                </section>

                <footer className="footerBtns">
                <Botao style="secondary" text="Deletar lista" onClick={deletarLista} />
                <Botao
                    style="primary"
                    text="Editar"
                    onClick={editarLista}
                    disabled={processando}
                />
                </footer>
            </Modal>

            <Modal
                isOpen={modalCriarAberto}
                onRequestClose={fecharModalCriar}
                className="modalSalvar"
                overlayClassName="modalOverlay"
            >
                <header className="headerModal">
                    <img src={Logo} alt="Logo" className="logo" />
                    <Botao
                        style="secondary"
                        icon={XIcon}
                        onClick={fecharModalCriar}
                    />
                </header>

                <section className="modalContent">
                    <h1>Criar Nova Lista</h1>
                    <Input
                        label="Nome da lista"
                        value={novoNomeCriar}
                        onChange={(e) => setNovoNomeCriar(e.target.value)}
                        disabled={processando}
                    />
                </section>

                <footer className="footerBtns">
                    <Botao style="secondary" text="Cancelar" onClick={fecharModalCriar} />
                    <Botao
                        style="primary"
                        text="Criar"
                        onClick={criarLista}
                        disabled={processando || !novoNomeCriar.trim()}
                    />
                </footer>
            </Modal>

            <LoadingModal isOpen={processando} />
            <SuccessModal
                isOpen={successAberto}
                message={successMsg}
            />
        </div>
    )
}
