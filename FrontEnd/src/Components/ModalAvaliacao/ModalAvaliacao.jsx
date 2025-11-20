// Modal para avaliar um filme

import './ModalAvaliacao.css'
import { useState } from "react";
import Modal from "react-modal";
import XIcon from "../../Assets/Images/Icons/x_icon.svg";
import Logo from "../../Assets/Images/Logo/Logo.svg";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import SuccessModal from "../../Components/SuccessModal/SuccessModal";
import Botao from "../../Components/Botao/Botao";
import { Star } from "lucide-react";
import api from "../../Services/Api";

Modal.setAppElement('#root');

export default function ModalAvaliacao({ isOpen, onRequestClose, filme, user, recarregar }) {

    // nota escolhida
    const [nota, setNota] = useState(0);

    // resenha digitada
    const [resenha, setResenha] = useState("");

    // modais auxiliares
    const [loadingOpen, setLoadingOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    // ==========================
    // SELETOR MANUAL DE ESTRELAS
    // ==========================
    function StarSelector({ value, onChange }) {
        return (
            <div className="starSelectorContainer">
                <div className="starSelector">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                            key={n}
                            size={40}
                            stroke="none"
                            fill={n <= value ? "var(--red)" : "var(--gray)"}
                            className="starClickable"
                            onClick={() => onChange(n)}
                        />
                    ))}
                </div>

                <span className="starCount">{value}</span>
            </div>
        );
    }

    async function enviarAvaliacao() {
        try {
            setLoadingOpen(true);

            const body = {
                usuario_id: user.id,
                filme_id: filme.id,
                nota,
                resenha: resenha.trim() === "" ? null : resenha
            };

            await api.post("/avaliacoes", body);

            setLoadingOpen(false);
            setSuccessOpen(true);

            setTimeout(() => {
                setSuccessOpen(false);
                onRequestClose();
                recarregar();
            }, 1200);

        } catch (err) {
            console.error(err);
            setLoadingOpen(false);
            alert("Erro ao avaliar o filme.");
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
                {/* HEADER */}
                <header className='headerModal'>
                    <img src={Logo} alt='Logo' className='logo' />

                    <button className="closeBtn" onClick={onRequestClose}>
                        <img src={XIcon} alt="Fechar" />
                    </button>
                </header>

                <section className="modalContent">
                    <h1>Avalie o filme!</h1>

                    <p className="textoInfo">
                        Registre suas impressões de <strong>{filme?.titulo}</strong>.
                    </p>

                    <div className="formBox">
                        <label className="labelAval">Nota:</label>

                        <StarSelector value={nota} onChange={setNota} />

                        <label className="labelAval">Resenha (opcional):</label>
                        <textarea
                            className="textareaAval"
                            value={resenha}
                            onChange={(e) => setResenha(e.target.value)}
                        />
                    </div>
                </section>

                {/* FOOTER */}
                <footer className='footerBtns'>
                    <Botao style='secondary' text='Cancelar' onClick={onRequestClose} />

                    <Botao
                        style='primary'
                        text='Avaliar'
                        onClick={enviarAvaliacao}
                        disabled={nota === 0}
                    />
                </footer>
            </Modal>

            <LoadingModal isOpen={loadingOpen} />
            <SuccessModal isOpen={successOpen} message="Avaliação salva!" />
        </>
    );
}
