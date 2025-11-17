import Loader from '../../Components/Loading/Loading'
import './LoadingModal.css'
import Modal from 'react-modal';


Modal.setAppElement('#root');
export default function LoadingModal({ isOpen }) {
    return (
        <Modal
            isOpen={isOpen}
            className="modalOverlay"
            overlayClassName="loadingOverlay"
            closeTimeoutMS={200}  // tempo para saída
            shouldCloseOnOverlayClick={false} 
        >
            <Loader />
        </Modal>
    )
}