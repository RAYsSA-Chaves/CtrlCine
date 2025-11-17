/* Centralizando função de salvar filmes em listas (modal) */
import { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import "./ModalSalvar.css";
import { AuthContext } from "../../Services/AuthContext";
import api from '../../Services/Api';
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

// Modais reutilizáveis
import LoadingModal from '../../Components/LoadingModal/LoadingModal'
import SuccessModal from '../../Components/SuccessModal/SuccessModal'

import Logo from '../../Assets/Images/Logo/Logo.svg'
import Botao from "../Botao/Botao";
import XIcon from '../../Assets/Images/Icons/x_icon.svg'

Modal.setAppElement("#root");

export default function ModalSalvarFilme({ isOpen, onRequestClose, filme }) {

    const { user } = useContext(AuthContext);

    // Listas já existentes do usuário
    const [listasUsuario, setListasUsuario] = useState([]);

    // Controle do dropdown
    const [dropdownAberto, setDropdownAberto] = useState(false);

    // Listas selecionadas
    const [selecionadas, setSelecionadas] = useState([]);

    // Listas criadas (fake)
    const [novasListas, setNovasListas] = useState([]);

    // Estados dos modais internos
    const [loadingOpen, setLoadingOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // =========================================================
    // 🔥 USE EFFECT COM LOADING MAIS RÁPIDO (PROMISE.ALL) 🔥
    // =========================================================
    useEffect(() => {
        if (!isOpen) return;

        async function carregarListas() {
            try {
                setLoadingOpen(true); // mostra o loading

                // pega todas as listas do usuário
                const res = await api.get(`/listas/usuario/${user.id}`);
                const listas = res.data;

                // 🔥 Faz TODAS as consultas de filmes ao mesmo tempo!
                const respostas = await Promise.all(
                    listas.map(lista => api.get(`/filmes?lista=${lista.id}`))
                );

                const listasFiltradas = [];

                for (let i = 0; i < listas.length; i++) {
                    const filmes = respostas[i].data;

                    const jaTem = Array.isArray(filmes) &&
                        filmes.some(f => f.id === filme.id);

                    if (!jaTem) listasFiltradas.push(listas[i]);
                }

                setListasUsuario(listasFiltradas);

                // reseta estados
                setSelecionadas([]);
                setNovasListas([]);
                setDropdownAberto(false);

            } catch (err) {
                console.error(err);

            } finally {
                setTimeout(() => {
                    setLoadingOpen(false);
                }, 150); // muito mais rápido agora
            }
        }

        carregarListas();
    }, [isOpen]);
    // =========================================================


    function toggleDropdown() {
        setDropdownAberto(!dropdownAberto);
    }

    function selecionarLista(lista) {
        const existe = selecionadas.some((l) => l.id === lista.id);
        if (!existe) {
            setSelecionadas([...selecionadas, lista]);
        } else {
            setSelecionadas(selecionadas.filter((l) => l.id !== lista.id));
        }
    }

    function removerChip(id) {
        setSelecionadas(selecionadas.filter((l) => l.id !== id));
    }

    function criarNovaLista() {
        const nome = prompt("Digite o nome da nova lista:");
        if (!nome) return;

        const nova = {
            id: "fake-" + novasListas.length,
            nome,
            nova: true,
        };

        setNovasListas([...novasListas, nova]);
        setSelecionadas([...selecionadas, nova]);
    }

    // SALVAR TUDO (Loading + Sucesso)
    async function confirmar() {
        try {
            setLoadingOpen(true);

            let novasCriadas = [];

            for (let lista of novasListas) {
                const resp = await api.post("/listas", {
                    usuario_id: user.id,
                    nome: lista.nome,
                });

                novasCriadas.push({
                    id: resp.data.id,
                    nome: resp.data.nome,
                });
            }

            const listasFinais = selecionadas.map((l) => {
                const criada = novasCriadas.find((x) => x.nome === l.nome);
                return criada ? criada.id : l.id;
            });

            for (let lista_id of listasFinais) {
                await api.post("/listas/filme", {
                    lista_id,
                    filme_id: filme.id,
                });
            }

            setLoadingOpen(false);
            setSuccessMsg("Filme salvo com sucesso!");
            setSuccessOpen(true);

            setTimeout(() => {
                setSuccessOpen(false);
                onRequestClose();
            }, 1500);

        } catch (err) {
            console.error(err);
            setLoadingOpen(false);
            alert("Erro ao salvar filme.");
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                className="modalSalvar"
                overlayClassName="modalOverlay"
            >
                <header className="headerModal">
                    <img src={Logo} alt="Logo" className="logo" />
                    <Botao
                        style="secondary"
                        icon={XIcon}
                        onClick={onRequestClose}
                    />
                </header>

                <section className="modalContent">
                    <h1>Salve o filme nas suas listas</h1>

                    <p className="textoInfo">
                        Escolha uma lista para salvar <strong>{filme?.titulo}</strong>:
                    </p>

                    <div className="dropdownSalvar">
                        <button className="dropBtn" onClick={toggleDropdown}>
                            Selecionar listas
                            {dropdownAberto ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        {dropdownAberto && (
                            <div className="dropContent">

                                {listasUsuario.map((lista) => (
                                    <label key={lista.id} className="dropItem checkboxItem">
                                        <input
                                            type="checkbox"
                                            checked={selecionadas.some((l) => l.id === lista.id)}
                                            readOnly
                                            onClick={() => selecionarLista(lista)}
                                        />
                                        <span>{lista.nome}</span>
                                    </label>
                                ))}

                                <div className="dropNovo" onClick={criarNovaLista}>
                                    <span>Nova lista</span>
                                    <Plus />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chipsArea">
                        {selecionadas.map((l) => (
                            <div className="chip" key={l.id}>
                                {l.nome}
                                <X className="removeChip" onClick={() => removerChip(l.id)} />
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="footerBtns">
                    <Botao style="secondary" text="Cancelar" onClick={onRequestClose} />
                    <Botao
                        style="primary"
                        text="Confirmar"
                        onClick={confirmar}
                        disabled={selecionadas.length === 0}
                    />
                </footer>
            </Modal>

            <LoadingModal isOpen={loadingOpen} />
            <SuccessModal isOpen={successOpen} message={successMsg} />
        </>
    );
}
