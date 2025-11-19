// Modal com mensagem de sucesso

import './SuccesModal.css'
import Modal from 'react-modal';
import { CheckCircle2 } from 'lucide-react'


Modal.setAppElement('#root');
export default function SuccessModal({ isOpen, message }) {
    return (
        <Modal
            isOpen={isOpen}
            className='successModal'
            overlayClassName='modalOverlay'
            closeTimeoutMS={200}  // tempo para saída
            shouldCloseOnOverlayClick={false} 
        >
            <CheckCircle2 size={50} />
            <p>{message}</p>
        </Modal>
    )
}