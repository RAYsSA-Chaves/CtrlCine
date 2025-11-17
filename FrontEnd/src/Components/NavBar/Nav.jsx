// NavBar para navegação pelas páginas do site

import './Nav.css'
import ProfileDrop from '../ProfileDrop/ProfileDrop'
import NotificationDrop from '../NotificationDrop/NotificationDrop';
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import LogoTxt from '../../Assets/Images/Logo/Logo.svg'
import Logo from '../../Assets/Images/Logo/Logo2.svg'
import { Link } from 'react-router-dom';


export default function NavBar() {
    const { user } = useContext(AuthContext);

    return (
        <nav>
            {/* Logo para usuário logado ou deslogado */}
            {user ? (
                <Link to='/'>
                    <img className='logo2' src={Logo} alt='Logo'/>
                </Link>
            ) : (
                <Link to='/'>
                    <img className='logo' src={LogoTxt} alt='Logo'/>
                </Link>
            )}

            {/* Links para usuário comum ou adm */}
            {user && (
                user.role === 'comum' ? (
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/'>Catálogo</Link></li>
                        <li><Link to='/listas'>Minhas Listas</Link></li>
                        <li><Link to='/'>Solicitar Filme</Link></li>
                    </ul>
                ) : user.role === 'admin' ? (
                    <ul>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/'>Catálogo</Link></li>
                        <li><Link to='/'>Administração</Link></li>
                    </ul>
                ) : null
            )}

            <div className='userMenus'>
                {/* Menu do usuário */}
                {user && <ProfileDrop />}

                {/* Sininho de notificações */}
                {user && <NotificationDrop />}
            </div>
        </nav>
    )
}