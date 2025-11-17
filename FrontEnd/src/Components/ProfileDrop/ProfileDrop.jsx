// Perfil do usuário na NavBar

import './ProfileDrop.css'
import { useState, useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import {ChevronUp, ChevronDown} from 'lucide-react'
import UserIcon from '../../Assets/Images/Icons/user_icon.svg'
import LogOut from '../../Assets/Images/Icons/log_out_icon.svg'


export default function ProfileDrop() {
    const  {user, logout } = useContext(AuthContext); 
    const [open, setOpen] = useState(false); 
    
    return (
        <div className='userMenuContainer'>
            
            {/* Cabeçalho */}
            <div className='userHeader' onClick={() => setOpen(!open)}>
                <div className='userPhoto'></div>
                <span className='userName'>{user.nome}</span>
                <span className='arrow'>{open ? <ChevronUp/> : <ChevronDown/>}</span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className='dropdownUserOptions'>

                    {/* Opção para usuário comum */}
                    {user.role === 'comum' && (
                        <div className='dropdownItem'>
                            <img src={UserIcon} alt='Ícone de usuário' />
                            Perfil
                        </div>
                    )}

                    {/* Opção para usuário comum e adm */}
                    <div className='dropdownItem' onClick={logout}>
                        <img src={LogOut} alt='Ícone de saída' />
                        Sair
                    </div>

                </div>
            )}
        </div>
    );
}