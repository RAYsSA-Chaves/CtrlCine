import { useState } from 'react';
import './NotificationDrop.css';
import Bell from '../../Assets/Images/Icons/bell_icon.svg'

export default function NotificationDrop() {
    const [open, setOpen] = useState(false);
    const [hasNew, setHasNew] = useState(true); // controla a bolinha vermelha

    function toggleMenu() {
        setOpen(!open);

        // Ao abrir, remove o indicador
        if (!open) {
            setHasNew(false);
        }
    }

    return (
        <div className='notificationContainer'>
            
            {/* Ícone do sino */}
            <div className='bellButton' onClick={toggleMenu}>
                <img src={Bell} alt='Ícone de sino' />
                {hasNew && <span className='redDot'></span>}
            </div>

            {/* Dropdown */}
            {open && (
                <div className='notificationDropdown'>
                    <div className='dropdownHeader'>
                        <span>Notificações</span>
                        <button className='clear-btn'>Limpar tudo</button>
                    </div>

                    <div className='divider'></div>

                    <div className='emptyMessage'>
                        Sem notificações no momento
                    </div>
                </div>
            )}

        </div>
    );
}