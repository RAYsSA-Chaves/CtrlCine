import './Nav.css'
import ProfileDrop from '../ProfileDrop/ProfileDrop'
import NotificationDrop from '../NotificationDrop/NotificationDrop';
import { useContext } from "react";
import { AuthContext } from '../../Services/AuthContext';
import LogoTxt from '../../Assets/Images/Logo/Logo.svg'
import Logo from '../../Assets/Images/Logo/Logo2.svg'


export default function NavBar() {
    const { user, loading } = useContext(AuthContext);

    return (
        <nav>
            {user ? (
                <img src={Logo} alt="Logo"/>
            ) : (
                <img src={LogoTxt} alt="Logo"/>
            )}

            {/* Links */}
            {user && (
                user.role === 'comum' ? (
                    <ul>
                        <li>Home</li>
                        <li>Catálogo</li>
                        <li>Minhas Listas</li>
                        <li>Solicitar Filme</li>
                    </ul>
                ) : user.role === 'admin' ? (
                    <ul>
                        <li>Home</li>
                        <li>Catálogo</li>
                        <li>Administração</li>
                    </ul>
                ) : null
            )}

            {/* Menu do usuário */}
            {!loading && user && <ProfileDrop />}

            {/* Sininho de notificações */}
            {user && <NotificationDrop />}
        </nav>
    )
}