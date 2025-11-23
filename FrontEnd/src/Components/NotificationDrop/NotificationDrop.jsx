// Notificações na bavbar

import { useState, useEffect } from 'react';
import './NotificationDrop.css';
import Bell from '../../Assets/Images/Icons/bell_icon.svg'
import Filme1 from '../../Assets/Images/tel_preto_capa.jpg'
import Filme2 from '../../Assets/Images/truque_mestre_capa.jpg'
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import UserPhoto from '../../Assets/Images/user_pic.png'


export default function NotificationDrop() {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [hasNew, setHasNew] = useState(true); // controla a bolinha vermelha

    // Notificações 
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        if (user.role === 'comum') {
            setNotifications([
                {
                    id: 1,
                    img: Filme1,
                    text: 'O filme "<strong>O Telefone Preto 2</strong>" estreou!'
                },
                {
                    id: 2,
                    img: Filme2,
                    text: 'O filme "<strong>Um Truque de Mestre 3</strong>" estreia amanhã!'
                }
            ]);
        }

        if (user.role === 'admin') {
            setNotifications([
                {
                    id: 1,
                    img: UserPhoto,
                    text: '<strong>Carlos</strong> solicitou um novo filme!'
                }
            ]);
        }
    }, [user.role]);
    
    // Ao abrir, remove a bolinha vermelha
    function toggleMenu() {
        setOpen(!open);
        
        if (!open) {
            setHasNew(false);
        }
    }

    // Apagar notificação específica
    function removerNotificacao(id) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    // Apagar tudo
     function limparTudo() {
        setNotifications([]);
    }

    return (
        <div className='notificationContainer'>
            
            {/* Ícone do sino */}
            <div className={`bellBtn ${open ? 'active' : ''}`} onClick={toggleMenu}>
                <img src={Bell} alt='Ícone de sino' />
                {hasNew && <span className='redDot'></span>}
            </div>

            {/* Dropdown */}
            {open && (
                <div className='notificationDropdown'>
                    <div className='dropdownHeader'>
                        <span>Notificações</span>
                        <button className='clearBtn' onClick={limparTudo}>Limpar tudo</button>
                    </div>

                    <div className='divider'></div>

                    {notifications.length === 0 ? (
                        <div className='emptyMessage'>
                            Sem notificações no momento
                        </div>
                    ) : (
                        notifications.map(not => (
                            <div key={not.id} className='notificationItem'>
                                <img src={not.img} alt='imagem' className='notifImg'/>
                                <p dangerouslySetInnerHTML={{ __html: not.text }}></p>

                                <button 
                                    className='deleteBtn' 
                                    onClick={() => removerNotificacao(not.id)}
                                >
                                    x
                                </button>
                            </div>
                        ))
                    )}
                    
                </div>
            )}

        </div>
    );
}