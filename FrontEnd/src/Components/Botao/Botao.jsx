// Componente genérico de botão

import './Botao.css';

export default function Botao({ style, text, icon = null, onClick }) {
    return (
        <button className={`${style}Btn`} onClick={onClick}>
            {icon && <img src={icon} alt="" className="icon" />}
            {text}
        </button>
    );
}