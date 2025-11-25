// NavBar para navegação pelas páginas do site

import './Nav.css'
import ProfileDrop from '../ProfileDrop/ProfileDrop'
import NotificationDrop from '../NotificationDrop/NotificationDrop';
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import LogoTxt from '../../Assets/Images/Logo/Logo.svg'
import Logo from '../../Assets/Images/Logo/Logo2.svg'
import { NavLink, Link } from 'react-router-dom';


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
                        <li>
                            <NavLink to='/' end className={({ isActive }) => isActive ? 'active' : ''}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/filmes' end className={({ isActive }) => isActive ? 'active' : ''}>
                                Catálogo
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/listas' end className={({ isActive }) => isActive ? 'active' : ''}>
                                Minhas Listas
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/movie_form?mode=create' className={({ isActive }) => isActive ? 'active' : ''}>
                                Solicitar Filme
                            </NavLink>
                        </li>
                    </ul>

                ) : user.role === 'admin' ? (
                    <ul>
                        <li>
                            <NavLink to='/' end className={({ isActive }) => isActive ? 'active' : ''}>
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/filmes' end className={({ isActive }) => isActive ? 'active' : ''}>
                                Catálogo
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to='/administracao' end className={({ isActive }) => isActive ? 'active' : ''}>
                                Administração
                            </NavLink>
                        </li>
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