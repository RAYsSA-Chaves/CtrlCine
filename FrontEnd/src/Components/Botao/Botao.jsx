// Componente genérico de botão

import './Botao.css';
import { useNavigate } from 'react-router-dom';


export default function Botao({ style, text = '', icon = null, onClick, to, type = 'button', disabled = false }) {
    const navigate = useNavigate();

    // função do click e navegação passadas pelo pai
    function handleClick() {
        if (onClick) {
            onClick();
        }
        if (to) {
            navigate(to); 
        }
    }
    
    return (
        <button 
            className={`${style}Btn`} 
            onClick={handleClick}
            type={type}
            disabled={disabled}
        >
            {icon && <img src={icon} alt='Ícone' className='icon' />}
            {text}
        </button>
    );
}