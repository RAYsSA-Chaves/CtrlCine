// Rodapé

import './Footer.css'
import Logo from '../../Assets/Images/Logo/Logo.svg'
import { useContext } from 'react';
import { AuthContext } from '../../Services/AuthContext';
import { Link } from 'react-router-dom';


export default function Footer() {
    const { user } = useContext(AuthContext);

    return (
        <footer>
            {/* Logo */}
            <img src={Logo} alt='Logo' />

            {/* Links para usuário comum ou adm */}
            {user && (
                user.role === 'comum' ? (
                    <ul className='footerLinks'>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/filmes'>Catálogo</Link></li>
                        <li><Link to='/listas'>Minhas Listas</Link></li>
                        <li><Link to='/movie_form?mode=create'>Solicitar Filme</Link></li>
                    </ul>
                ) : user.role === 'admin' ? (
                    <ul className='footerLinks'>
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/filmes'>Catálogo</Link></li>
                        <li><Link to='/administracao'>Administração</Link></li>
                    </ul>
                ) : null
            )}

            {/* Linha divisória */}
            <div className='divider'></div>

            {/* Direitos */}
            <p>@2025 CtrlCine. Todos os Direitos Reservados.</p>
        </footer>
    )
}