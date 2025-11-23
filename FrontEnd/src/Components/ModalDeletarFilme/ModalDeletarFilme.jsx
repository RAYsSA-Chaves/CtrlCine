import { useState } from "react";
import Modal from "react-modal";
import "./ModalDeletarFilme.css";
import api from "../../Services/Api";

// Modais reutilizáveis
import LoadingModal from "../LoadingModal/LoadingModal";
import SuccessModal from "../SuccessModal/SuccessModal";

import Logo from "../../Assets/Images/Logo/Logo.svg";
import Botao from "../Botao/Botao";
import XIcon from "../../Assets/Images/Icons/x_icon.svg";


Modal.setAppElement("#root");
export default function ModalDeletarFilme({ isOpen, onRequestClose, filme }) {
    const [loadingOpen, setLoadingOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    async function confirmarDelete() {
        try {
            setLoadingOpen(true);

            // envia requisição para a api
            const resp = await api.delete(`/filmes/${filme.id}`);

            // mostra mensagem de sucesso
            setLoadingOpen(false);
            setSuccessMsg(resp.data.Mensagem || "Filme deletado com sucesso!");
            setSuccessOpen(true);

            setTimeout(() => {
                setSuccessOpen(false);
                onRequestClose(true);
            }, 1500);

        } catch (err) {
            console.error(err);
            setLoadingOpen(false);
            alert("Erro ao deletar filme.");
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => onRequestClose(false)}
                className="modalSalvar"
                overlayClassName="modalOverlay"
            >
                {/* Cabeçalho */}
                <header className="headerModal">
                    <img src={Logo} alt="Logo" className="logo" />
                    <Botao
                        style="secondary"
                        icon={XIcon}
                        onClick={() => onRequestClose(false)}
                    />
                </header>

                {/* Conteúdo */}
                <section className="modalContent">
                    <h1>Tem certeza que deseja deletar?</h1>

                    <p className="textoInfo">
                        Você está prestes a remover o filme <strong>{filme?.titulo}</strong>.
                    </p>

                    <p className="textoInfo">
                        Esta ação não pode ser desfeita!
                    </p>
                </section>

                {/* Footer */}
                <footer className="footerBtns">
                    <Botao
                        style="secondary"
                        text="Cancelar"
                        onClick={() => onRequestClose(false)}
                    />
                    <Botao
                        style="primary"
                        text="Deletar"
                        onClick={confirmarDelete}
                    />
                </footer>
            </Modal>

            {/* Modais internos */}
            <LoadingModal isOpen={loadingOpen} />
            <SuccessModal isOpen={successOpen} message={successMsg} />
        </>
    );
}
